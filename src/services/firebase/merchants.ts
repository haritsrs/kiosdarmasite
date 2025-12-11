import { ref, get, type DatabaseReference } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type MerchantProfile } from "~/models/marketplace";

export async function getAllUsers(limit?: number): Promise<Array<MerchantProfile & { role?: string }>> {
  try {
    const db = getRealtimeDatabase();
    const usersRef = ref(db, "users");
    
    console.log("[getAllUsers] Fetching from /users");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log("[getAllUsers] No data found at /users");
      return [];
    }

    const usersData = snapshot.val();
    const userKeys = Object.keys(usersData || {});
    console.log(`[getAllUsers] Found ${userKeys.length} users:`, userKeys);
    
    const users: Array<MerchantProfile & { role?: string }> = [];

    for (const [uid, userData] of Object.entries(usersData as Record<string, any>)) {
      const role = userData?.role;
      console.log(`[getAllUsers] User ${uid}: role=${role}, hasProfile=${!!userData?.profile}`);
      
      // Count products for this user
      const productsRef = ref(db, `users/${uid}/products`);
      const productsSnapshot = await get(productsRef);
      const productCount = productsSnapshot.exists() ? Object.keys(productsSnapshot.val() || {}).length : 0;
      
      const profile = userData.profile ?? {};
      const name = profile.name ?? userData.displayName ?? userData.email?.split("@")[0] ?? "Unknown User";
      const slug = profile.slug ?? name.toLowerCase().replace(/\s+/g, "-") ?? uid;

      const user: MerchantProfile & { role?: string } = {
        id: uid,
        name: name,
        slug,
        location: profile.location ?? undefined,
        rating: profile.rating ?? undefined,
        productCount: productCount > 0 ? productCount : undefined,
        avatarUrl: profile.avatarUrl ?? profile.avatar ?? undefined,
        isVerified: profile.isVerified ?? false,
        phoneNumber: profile.phoneNumber ?? undefined,
        role: role ?? undefined,
      };
      
      console.log(`[getAllUsers] Added user:`, user);
      users.push(user);

      if (limit && users.length >= limit) {
        break;
      }
    }

    console.log(`[getAllUsers] Returning ${users.length} users`);
    return users;
  } catch (error: any) {
    console.error("[getAllUsers] Error:", error);
    console.error("[getAllUsers] Error code:", error.code);
    console.error("[getAllUsers] Error message:", error.message);
    throw error;
  }
}

export async function getMerchants(limit?: number): Promise<MerchantProfile[]> {
  try {
    const allUsers = await getAllUsers();
    const merchants = allUsers.filter((user) => user.role === "merchant" || user.role === "admin");
    
    if (limit) {
      return merchants.slice(0, limit);
    }
    
    return merchants;
  } catch (error: any) {
    console.error("[getMerchants] Error:", error);
    throw error;
  }
}

export async function getMerchantById(merchantId: string): Promise<MerchantProfile | null> {
  const db = getRealtimeDatabase();
  const userRef = ref(db, `users/${merchantId}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const userData = snapshot.val();
  const role = userData.role;
  if (role !== "merchant" && role !== "admin") {
    return null;
  }

  const profile = userData.profile ?? {};
  const slug = profile.slug ?? profile.name?.toLowerCase().replace(/\s+/g, "-") ?? merchantId;

  return {
    id: merchantId,
    name: profile.name ?? "Unknown Merchant",
    slug,
    location: profile.location ?? undefined,
    rating: profile.rating ?? undefined,
    productCount: profile.productCount ?? undefined,
    avatarUrl: profile.avatarUrl ?? profile.avatar ?? undefined,
    isVerified: profile.isVerified ?? false,
    phoneNumber: profile.phoneNumber ?? undefined,
  };
}

export async function getMerchantBySlug(slug: string): Promise<MerchantProfile | null> {
  const merchants = await getMerchants();
  return merchants.find((m) => m.slug === slug) ?? null;
}

