import { NextRequest, NextResponse } from "next/server";
import { ref, update, get } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, reference_id, status } = body;

    if (!id || !reference_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getRealtimeDatabase();
    const transactionRef = ref(db, `transactions/${reference_id}`);

    // Check if transaction exists
    const snapshot = await get(transactionRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update only the payment status fields, preserving existing data
    const statusMap: Record<string, string> = {
      PAID: "paid",
      PENDING: "pending",
      EXPIRED: "expired",
      FAILED: "failed",
    };

    await update(transactionRef, {
      paymentId: id,
      status: statusMap[status] ?? status.toLowerCase(),
      updatedAt: Date.now(),
    });

    // Also update user-specific transaction index if userId exists
    const transactionData = snapshot.val();
    if (transactionData.userId) {
      const userTransactionRef = ref(db, `transactions/${transactionData.userId}/${reference_id}`);
      await update(userTransactionRef, {
        paymentId: id,
        status: statusMap[status] ?? status.toLowerCase(),
        updatedAt: Date.now(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Xendit callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

