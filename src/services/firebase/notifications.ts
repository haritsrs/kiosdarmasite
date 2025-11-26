import { ref, get, set, query, orderByChild, limitToFirst, equalTo } from "firebase/database";
import { getRealtimeDatabase } from "./client";

export interface Notification {
  id: string;
  type: "promo" | "banner" | "order";
  title: string;
  description?: string;
  target: "customer" | "merchant" | "all";
  bannerUrl?: string;
  deeplink?: string;
  expiresAt?: number;
  createdAt?: number;
  isRead?: boolean;
}

export async function getNotifications(limit?: number, target?: "customer" | "merchant" | "all"): Promise<Notification[]> {
  const db = getRealtimeDatabase();
  const notificationsRef = ref(db, "notifications");
  
  let notificationsQuery = notificationsRef;
  
  if (target) {
    notificationsQuery = query(notificationsRef, orderByChild("target"), equalTo(target));
  }

  const snapshot = await get(notificationsQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const notificationsData = snapshot.val();
  const notifications: Notification[] = Object.entries(notificationsData).map(([id, data]: [string, any]) => ({
    id,
    type: data.type ?? "promo",
    title: data.title ?? "",
    description: data.description,
    target: data.target ?? "all",
    bannerUrl: data.bannerUrl ?? data.banner_url,
    deeplink: data.deeplink,
    expiresAt: data.expiresAt ?? data.expires_at,
    createdAt: data.createdAt ?? data.created_at ?? Date.now(),
    isRead: data.isRead ?? false,
  }));

  // Filter by expiration date
  const now = Date.now();
  const activeNotifications = notifications.filter(
    (notif) => !notif.expiresAt || notif.expiresAt > now
  );

  // Sort by createdAt descending (newest first)
  activeNotifications.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  // Apply limit if specified
  if (limit) {
    return activeNotifications.slice(0, limit);
  }

  return activeNotifications;
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  const db = getRealtimeDatabase();
  const readRef = ref(db, `users/${userId}/notificationsRead/${notificationId}`);
  await set(readRef, true);
}

