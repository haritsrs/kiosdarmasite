import { NextRequest, NextResponse } from "next/server";
import { ref, push, set } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { contactFormLimiter, getClientIdentifier } from "~/lib/rate-limit";
import { contactFormSchema } from "~/lib/validation";
import { sanitizeForHtml, sanitizeEmailContent } from "~/lib/sanitize";

export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimitResult = contactFormLimiter.check(request, identifier);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.reset),
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Validasi gagal" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Sanitize inputs
    const sanitizedName = sanitizeForHtml(name);
    const sanitizedSubject = sanitizeForHtml(subject);
    const sanitizedMessage = sanitizeEmailContent(message);

    // Store in Firebase
    const db = getRealtimeDatabase();
    const ticketRef = push(ref(db, "supportTickets"));
    const ticketId = ticketRef.key;

    if (!ticketId) {
      throw new Error("Failed to generate ticket ID");
    }

    const ticketData = {
      id: ticketId,
      name: sanitizedName,
      email, // Already validated and lowercased by Zod
      subject: sanitizedSubject,
      message: sanitizedMessage,
      status: "pending",
      createdAt: Date.now(),
      repliedAt: null,
    };

    await set(ticketRef, ticketData);

    // Send email using Resend (or fallback to simple email service)
    // Use sanitized values for email content
    const emailContent = `
Dukungan Baru dari KiosDarma Marketplace

Nama: ${sanitizedName}
Email: ${email}
Subjek: ${sanitizedSubject}

Pesan:
${sanitizedMessage}

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
                  <p><strong>Nama:</strong> ${sanitizedName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subjek:</strong> ${sanitizedSubject}</p>
                </div>
                <div style="margin: 20px 0;">
                  <h3>Pesan:</h3>
                  <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
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

