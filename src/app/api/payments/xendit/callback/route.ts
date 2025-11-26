import { NextRequest, NextResponse } from "next/server";
import { ref, set, get } from "firebase/database";
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

    // Update transaction status
    await set(transactionRef, {
      paymentId: id,
      status: status === "PAID" ? "paid" : status.toLowerCase(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Xendit callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

