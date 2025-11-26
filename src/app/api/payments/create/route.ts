import { NextRequest, NextResponse } from "next/server";
import { createQRISPayment, createVAPayment, type XenditPaymentRequest } from "~/services/xendit";
import { ref, set } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, referenceId, customer, description, bankCode, items, userId } = body;

    if (!type || !amount || !referenceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paymentRequest: XenditPaymentRequest = {
      amount,
      currency: "IDR",
      referenceId,
      customer,
      description,
    };

    let paymentResponse;

    if (type === "qris") {
      paymentResponse = await createQRISPayment(paymentRequest);
    } else if (type === "va") {
      paymentResponse = await createVAPayment(paymentRequest, bankCode ?? "BCA");
    } else {
      return NextResponse.json({ error: "Invalid payment type" }, { status: 400 });
    }

    // Save transaction to Firebase
    const db = getRealtimeDatabase();
    const transactionRef = ref(db, `transactions/${referenceId}`);
    const transactionData: any = {
      type: "online",
      paymentType: type,
      paymentId: paymentResponse.id,
      amount,
      status: "pending",
      customer,
      description,
      createdAt: Date.now(),
    };

    // Store items if provided
    if (items && Array.isArray(items)) {
      transactionData.items = items;
    }

    // Store userId if provided (for easier querying)
    if (userId) {
      transactionData.userId = userId;
    }

    // Store payment-specific data
    if (paymentResponse.qrString) {
      transactionData.qrString = paymentResponse.qrString;
    }
    if (paymentResponse.accountNumber) {
      transactionData.accountNumber = paymentResponse.accountNumber;
    }
    if (bankCode) {
      transactionData.bankCode = bankCode;
    }

    await set(transactionRef, transactionData);

    // Also create user-specific transaction index for efficient querying
    if (userId) {
      const userTransactionRef = ref(db, `transactions/${userId}/${referenceId}`);
      await set(userTransactionRef, transactionData);
    }

    return NextResponse.json(paymentResponse);
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to create payment" }, { status: 500 });
  }
}

