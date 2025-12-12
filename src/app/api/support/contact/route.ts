import { NextRequest, NextResponse } from "next/server";
import { ref, push, set } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message }: ContactFormData = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    // Basic spam protection - check message length
    if (message.length < 10) {
      return NextResponse.json({ error: "Pesan terlalu pendek" }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: "Pesan terlalu panjang" }, { status: 400 });
    }

    // Store in Firebase
    const db = getRealtimeDatabase();
    const ticketRef = push(ref(db, "supportTickets"));
    const ticketId = ticketRef.key;

    if (!ticketId) {
      throw new Error("Failed to generate ticket ID");
    }

    const ticketData = {
      id: ticketId,
      name,
      email,
      subject,
      message,
      status: "pending",
      createdAt: Date.now(),
      repliedAt: null,
    };

    await set(ticketRef, ticketData);

    // Send email using Resend (or fallback to simple email service)
    const emailContent = `
Dukungan Baru dari KiosDarma Marketplace

Nama: ${name}
Email: ${email}
Subjek: ${subject}

Pesan:
${message}

---
Ticket ID: ${ticketId}
Waktu: ${new Date().toLocaleString("id-ID")}
    `.trim();

    // Use Resend API if available, otherwise log for manual handling
    const resendApiKey = process.env.RESEND_API_KEY;
    const supportEmail = "haritssetiono2304@gmail.com";

    if (resendApiKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "KiosDarma Marketplace <noreply@kiosdarma.com>",
            to: [supportEmail],
            replyTo: email,
            subject: `[Support] ${subject}`,
            text: emailContent,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">Dukungan Baru dari KiosDarma Marketplace</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Nama:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subjek:</strong> ${subject}</p>
                </div>
                <div style="margin: 20px 0;">
                  <h3>Pesan:</h3>
                  <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                  Ticket ID: ${ticketId}<br>
                  Waktu: ${new Date().toLocaleString("id-ID")}
                </p>
              </div>
            `,
          }),
        });

        if (!resendResponse.ok) {
          console.error("Failed to send email via Resend:", await resendResponse.text());
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Continue even if email fails - ticket is still saved in Firebase
      }
    } else {
      // Log email content for manual sending if Resend is not configured
      console.log("=== SUPPORT EMAIL (Resend not configured) ===");
      console.log(`To: ${supportEmail}`);
      console.log(`Subject: [Support] ${subject}`);
      console.log(`From: ${email}`);
      console.log(`Content:\n${emailContent}`);
      console.log("==============================================");
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Pesan Anda telah dikirim. Kami akan merespons segera.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: error.message ?? "Gagal mengirim pesan" }, { status: 500 });
  }
}

