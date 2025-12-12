"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ref, get, set, onValue, off } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { useAuth } from "./AuthContext";
import { type ProductSummary } from "~/models/marketplace";

export interface CartItem {
  product: ProductSummary;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductSummary, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "kiosdarma_cart";

function loadCartFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToLocalStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = loadCartFromLocalStorage();
    setItems(localCart);
    setIsLoading(false);
  }, []);

  // Sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      // If user logs out, keep localStorage cart but don't sync
      return;
    }

    const db = getRealtimeDatabase();
    const cartRef = ref(db, `carts/${user.uid}`);

    // Load cart from Firestore
    get(cartRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firestoreCart = snapshot.val();
          const firestoreItems: CartItem[] = Array.isArray(firestoreCart) ? firestoreCart : [];
          
          // Merge with localStorage (localStorage takes precedence for conflicts)
          const localCart = loadCartFromLocalStorage();
          const mergedCart = mergeCarts(localCart, firestoreItems);
          
          setItems(mergedCart);
          saveCartToLocalStorage(mergedCart);
          set(cartRef, mergedCart).catch((error) => {
            if (error.code === "PERMISSION_DENIED") {
              console.warn("Cart write permission denied. Make sure Firebase rules are updated.");
            } else {
              console.error("Failed to sync cart to Firebase:", error);
            }
          });
        } else {
          // No Firestore cart, sync localStorage to Firestore
          const localCart = loadCartFromLocalStorage();
          if (localCart.length > 0) {
            set(cartRef, localCart).catch((error) => {
              if (error.code === "PERMISSION_DENIED") {
                console.warn("Cart write permission denied. Make sure Firebase rules are updated.");
              } else {
                console.error("Failed to sync cart to Firebase:", error);
              }
            });
          }
        }
      })
      .catch((error) => {
        if (error.code === "PERMISSION_DENIED") {
          console.warn("Cart read permission denied. Make sure Firebase rules are updated.");
        } else {
          console.error("Failed to load cart from Firebase:", error);
        }
      });

    // Listen for real-time updates
    const unsubscribe = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreCart = snapshot.val();
        const firestoreItems: CartItem[] = Array.isArray(firestoreCart) ? firestoreCart : [];
        setItems(firestoreItems);
        saveCartToLocalStorage(firestoreItems);
      }
    });

    return () => {
      off(cartRef, "value", unsubscribe);
    };
  }, [user]);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      saveCartToLocalStorage(items);
      
      // Also save to Firestore if user is logged in
      if (user && user.uid) {
        const db = getRealtimeDatabase();
        const cartRef = ref(db, `carts/${user.uid}`);
        set(cartRef, items).catch((error) => {
          if (error.code === "PERMISSION_DENIED") {
            console.warn("Cart write permission denied. Make sure Firebase rules are updated with cart rules.");
          } else {
            console.error("Failed to save cart to Firebase:", error);
          }
        });
      }
    }
  }, [items, user, isLoading]);

  const addItem = (product: ProductSummary, quantity: number = 1) => {
    setItems((prevItems) => {
      // Validate single merchant - if cart has items, check if new product is from same merchant
      if (prevItems.length > 0) {
        const existingMerchantId = prevItems[0]!.product.merchantId;
        if (product.merchantId !== existingMerchantId) {
          throw new Error(
            `Produk ini dari merchant berbeda. Silakan checkout produk dari ${prevItems[0]!.product.merchantName} terlebih dahulu, atau hapus item dari keranjang untuk menambahkan produk dari merchant lain.`
          );
        }
      }

      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex]!,
          quantity: updated[existingIndex]!.quantity + quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Helper function to merge two carts (localStorage takes precedence)
function mergeCarts(localCart: CartItem[], firestoreCart: CartItem[]): CartItem[] {
  const merged: CartItem[] = [...localCart];
  
  for (const firestoreItem of firestoreCart) {
    const existingIndex = merged.findIndex((item) => item.product.id === firestoreItem.product.id);
    if (existingIndex < 0) {
      // Item doesn't exist in local cart, add it
      merged.push(firestoreItem);
    }
    // If it exists, keep the local version (localStorage takes precedence)
  }
  
  return merged;
}


