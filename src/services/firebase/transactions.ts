import { ref, get } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type TransactionStatus } from "~/models/marketplace";

export interface Transaction {
  id: string;
  type: "online" | "offline";
  paymentType?: "qris" | "va";
  paymentId?: string;
  amount: number;
  status: TransactionStatus;
  userId?: string;
  customer?: {
    givenNames?: string;
    email?: string;
    phoneNumber?: string;
  };
  description?: string;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: number;
  updatedAt?: number;
  qrString?: string;
  accountNumber?: string;
  bankCode?: string;
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  const db = getRealtimeDatabase();
  const transactionsRef = ref(db, "transactions");
  
  // Fetch all transactions and filter by userId
  // In a production app, you might want to maintain an index like transactions/{userId}/{transactionId}
  const snapshot = await get(transactionsRef);
  
  if (!snapshot.exists()) {
    return [];
  }

  const transactionsData = snapshot.val();
  const transactions: Transaction[] = [];

  for (const [id, data] of Object.entries(transactionsData as Record<string, any>)) {
    // Filter by userId if it exists in the transaction data
    if (data.userId && data.userId !== userId) {
      continue;
    }

    // Also check customer email as fallback
    if (!data.userId && data.customer?.email) {
      // You might want to fetch user email from Firebase Auth to match
      // For now, we'll include transactions without userId filtering
    }

    const transaction: Transaction = {
      id,
      type: data.type ?? "online",
      paymentType: data.paymentType,
      paymentId: data.paymentId,
      amount: data.amount ?? 0,
      status: data.status ?? "pending",
      customer: data.customer,
      description: data.description,
      items: data.items,
      createdAt: data.createdAt ?? Date.now(),
      updatedAt: data.updatedAt,
      qrString: data.qrString,
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
    };

    transactions.push(transaction);
  }

  // Sort by createdAt descending (newest first)
  return transactions.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  const db = getRealtimeDatabase();
  const transactionRef = ref(db, `transactions/${transactionId}`);
  const snapshot = await get(transactionRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.val();
  return {
    id: transactionId,
    type: data.type ?? "online",
    paymentType: data.paymentType,
    paymentId: data.paymentId,
    amount: data.amount ?? 0,
    status: data.status ?? "pending",
    customer: data.customer,
    description: data.description,
    items: data.items,
    createdAt: data.createdAt ?? Date.now(),
    updatedAt: data.updatedAt,
    qrString: data.qrString,
    accountNumber: data.accountNumber,
    bankCode: data.bankCode,
  };
}

