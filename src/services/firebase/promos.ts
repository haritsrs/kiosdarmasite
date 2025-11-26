import { ref, get, query, orderByChild, limitToFirst, type DatabaseReference } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type Promo } from "~/models/marketplace";

export async function getPromos(limit?: number): Promise<Promo[]> {
  const db = getRealtimeDatabase();
  const promosRef = ref(db, "notifications");
  let promosQuery: DatabaseReference = promosRef;

  if (limit) {
    promosQuery = query(promosRef, limitToFirst(limit));
  }

  const snapshot = await get(promosQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const promosData = snapshot.val();
  const promos: Promo[] = [];

  for (const [id, data] of Object.entries(promosData as Record<string, any>)) {
    // Filter for promo-type notifications
    if (data.type === "promo" || data.type === "banner" || data.target === "customer" || !data.target) {
      promos.push({
        id,
        title: data.title ?? data.message ?? "Promo",
        description: data.description ?? data.body ?? undefined,
        badge: data.badge ?? data.priority ?? undefined,
        expiresAt: data.expiresAt ?? data.expires_at ?? undefined,
        bannerUrl: data.bannerUrl ?? data.banner_url ?? data.imageUrl ?? data.image ?? undefined,
        deeplink: data.deeplink ?? data.link ?? undefined,
      });
    }
  }

  return promos.slice(0, limit ?? promos.length);
}

