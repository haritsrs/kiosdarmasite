import { env } from "~/env";

export interface XenditPaymentRequest {
  amount: number;
  currency?: string;
  referenceId: string;
  customer?: {
    givenNames: string;
    email?: string;
    mobileNumber?: string;
  };
  description?: string;
}

export interface XenditQRISResponse {
  id: string;
  reference_id: string;
  status: string;
  qr_string: string;
  expires_at: string;
  amount: number;
  currency: string;
}

export interface XenditVAResponse {
  id: string;
  reference_id: string;
  status: string;
  bank_code: string;
  account_number: string;
  expires_at: string;
  amount: number;
  currency: string;
}

const XENDIT_API_BASE = "https://api.xendit.co";

async function xenditRequest<T>(endpoint: string, body: unknown): Promise<T> {
  if (!env.XENDIT_SECRET_KEY) {
    throw new Error("XENDIT_SECRET_KEY is not configured. Please set it in your .env file.");
  }

  const response = await fetch(`${XENDIT_API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${env.XENDIT_SECRET_KEY}:`).toString("base64")}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Xendit API error: ${response.status} - ${error}`);
  }

  return response.json() as Promise<T>;
}

export async function createQRISPayment(request: XenditPaymentRequest): Promise<XenditQRISResponse> {
  return xenditRequest<XenditQRISResponse>("/qr_codes", {
    reference_id: request.referenceId,
    type: "DYNAMIC",
    currency: request.currency ?? "IDR",
    amount: request.amount,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/payments/xendit/callback`,
    metadata: {
      customer: request.customer,
      description: request.description,
    },
  });
}

export async function createVAPayment(
  request: XenditPaymentRequest,
  bankCode: string = "BCA"
): Promise<XenditVAResponse> {
  return xenditRequest<XenditVAResponse>("/virtual_accounts", {
    reference_id: request.referenceId,
    bank_code: bankCode,
    name: request.customer?.givenNames ?? "Customer",
    expected_amount: request.amount,
    is_closed: true,
    is_single_use: true,
    currency: request.currency ?? "IDR",
    expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      customer: request.customer,
      description: request.description,
    },
  });
}

export async function getPaymentStatus(paymentId: string, type: "qris" | "va"): Promise<unknown> {
  if (!env.XENDIT_SECRET_KEY) {
    throw new Error("XENDIT_SECRET_KEY is not configured. Please set it in your .env file.");
  }

  const endpoint = type === "qris" ? `/qr_codes/${paymentId}` : `/virtual_accounts/${paymentId}`;
  const response = await fetch(`${XENDIT_API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.XENDIT_SECRET_KEY}:`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment status: ${response.status}`);
  }

  return response.json();
}

