import { ref, get, type DatabaseReference } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type MerchantProfile } from "~/models/marketplace";

export async function getMerchants(limit?: number): Promise<MerchantProfile[]> {
  const db = getRealtimeDatabase();
  const usersRef = ref(db, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
    return [];
  }

  const usersData = snapshot.val();
  const merchants: MerchantProfile[] = [];

  for (const [uid, userData] of Object.entries(usersData as Record<string, any>)) {
    const role = userData.role;
    if (role === "merchant" || role === "admin") {
      const profile = userData.profile ?? {};
      const slug = profile.slug ?? profile.name?.toLowerCase().replace(/\s+/g, "-") ?? uid;

      merchants.push({
        id: uid,
        name: profile.name ?? "Unknown Merchant",
        slug,
        location: profile.location ?? undefined,
        rating: profile.rating ?? undefined,
        productCount: profile.productCount ?? undefined,
        avatarUrl: profile.avatarUrl ?? profile.avatar ?? undefined,
        isVerified: profile.isVerified ?? false,
      });

      if (limit && merchants.length >= limit) {
        break;
      }
    }
  }

  return merchants;
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
  };
}

export async function getMerchantBySlug(slug: string): Promise<MerchantProfile | null> {
  const merchants = await getMerchants();
  return merchants.find((m) => m.slug === slug) ?? null;
}

