import { ref, set, get, push } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type TransactionStatus } from "~/models/marketplace";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: TransactionStatus;
  userConfirmed: boolean;
  merchantConfirmed: boolean;
  whatsappMessage?: string;
  merchantId?: string;
  merchantName?: string;
  merchantPhone?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  cancelledAt?: number;
  cancelledBy?: string;
}

export async function createOrder(
  userId: string,
  items: OrderItem[],
  whatsappMessage: string,
  merchantId?: string,
  merchantName?: string,
  merchantPhone?: string
): Promise<string> {
  const db = getRealtimeDatabase();
  const ordersRef = ref(db, `marketplaceOrders/${userId}`);
  const newOrderRef = push(ordersRef);
  const orderId = newOrderRef.key!;

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal;

  const order: Order = {
    id: orderId,
    userId,
    items,
    subtotal,
    total,
    status: "pending",
    userConfirmed: false,
    merchantConfirmed: false,
    whatsappMessage,
    merchantId,
    merchantName,
    merchantPhone,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Save to /marketplaceOrders/$userId/$orderId
  await set(ref(db, `marketplaceOrders/${userId}/${orderId}`), order);

  return orderId;
}

export async function getOrderById(userId: string, orderId: string): Promise<Order | null> {
  const db = getRealtimeDatabase();
  const orderRef = ref(db, `marketplaceOrders/${userId}/${orderId}`);
  const snapshot = await get(orderRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val() as Order;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const db = getRealtimeDatabase();
  const userOrdersRef = ref(db, `marketplaceOrders/${userId}`);
  const snapshot = await get(userOrdersRef);

  if (!snapshot.exists()) {
    return [];
  }

  const ordersData = snapshot.val();
  const orders: Order[] = Object.values(ordersData);

  return orders.sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateOrderStatus(
  userId: string,
  orderId: string,
  status: TransactionStatus,
  confirmedBy: "user" | "merchant",
  cancelledByUserId?: string
): Promise<void> {
  const db = getRealtimeDatabase();
  const orderRef = ref(db, `marketplaceOrders/${userId}/${orderId}`);
  const snapshot = await get(orderRef);

  if (!snapshot.exists()) {
    throw new Error("Order not found");
  }

  const order = snapshot.val() as Order;
  const updates: Partial<Order> = {
    updatedAt: Date.now(),
  };

  if (confirmedBy === "user") {
    updates.userConfirmed = true;
  } else if (confirmedBy === "merchant") {
    updates.merchantConfirmed = true;
  }

  if (status === "completed") {
    updates.status = "completed";
    updates.completedAt = Date.now();
  } else if (status === "cancelled") {
    updates.status = "cancelled";
    updates.cancelledAt = Date.now();
    if (cancelledByUserId) {
      updates.cancelledBy = cancelledByUserId;
    }
  }

  // Update order
  await set(ref(db, `marketplaceOrders/${userId}/${orderId}`), { ...order, ...updates });
}


