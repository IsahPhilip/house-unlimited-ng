import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY  = process.env.RESEND_API_KEY || "";
const CONTACT_TO     = process.env.CONTACT_TO_EMAIL || "official@houseunlimitednigeria.com";
const CONTACT_FROM   = process.env.CONTACT_FROM_EMAIL || "House Unlimited Nigeria <noreply@houseunlimitednigeria.com>";

const ALLOWED_TYPES = new Set(["general", "property_inquiry", "partnership", "complaint", "other"]);
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES      = 15 * 1024 * 1024;
const ALLOWED_MIME_PREFIXES = ["image/", "application/pdf", "application/msword", "application/vnd.openxmlformats"];

// In-memory rate limiter — 5 requests per IP per 10 min
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 10 * 60 * 1000;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function buildHtml(fields: {
  name: string; email: string; subject: string;
  message: string; phone?: string; type: string;
}): string {
  const typeLabels: Record<string, string> = {
    general: "General Inquiry", property_inquiry: "Property Inquiry",
    partnership: "Partnership", complaint: "Complaint", other: "Other"
  };
  const label = typeLabels[fields.type] || fields.type;
  const msg = fields.message
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#1f2937;max-width:600px;margin:0 auto;padding:24px">
  <div style="background:#005555;padding:24px 32px;border-radius:16px 16px 0 0">
    <h1 style="color:#fff;margin:0;font-size:20px">New ${label}</h1>
    <p style="color:#d8eeee;margin:4px 0 0;font-size:13px">House Unlimited Nigeria — Contact Form</p>
  </div>
  <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 16px 16px">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;width:140px">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">From</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <strong>${fields.name}</strong> &lt;${fields.email}&gt;
        </td>
      </tr>
      ${fields.phone ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Phone</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">${fields.phone}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Subject</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">${fields.subject}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af">Type</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <span style="background:#d8eeee;color:#005555;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:700">${label}</span>
        </td>
      </tr>
    </table>
    <div style="margin-top:24px">
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin-bottom:8px">Message</p>
      <div style="background:#f9fafb;border-radius:12px;padding:20px;font-size:14px;color:#374151">${msg}</div>
    </div>
    <p style="margin-top:32px;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:16px">
      Sent via houseunlimitednigeria.com contact form
    </p>
  </div>
</body></html>`;
}

export async function POST(request: Request) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { message: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  if (!RESEND_API_KEY) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return NextResponse.json(
      { message: "Email service is not configured. Please contact us directly." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  const name    = String(formData.get("name")    || "").trim();
  const email   = String(formData.get("email")   || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const phone   = String(formData.get("phone")   || "").trim();
  const type    = String(formData.get("type")    || "general").trim();

  const errors: string[] = [];
  if (!name || name.length > 100)                                    errors.push("Name is required (max 100 characters).");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))          errors.push("A valid email address is required.");
  if (!subject || subject.length > 200)                              errors.push("Subject is required (max 200 characters).");
  if (!message || message.length > 5000)                             errors.push("Message is required (max 5000 characters).");
  if (!ALLOWED_TYPES.has(type))                                      errors.push("Invalid inquiry type.");
  if (errors.length) return NextResponse.json({ message: errors[0], errors }, { status: 400 });

  // Process attachments
  const attachmentFiles = formData.getAll("attachments") as File[];
  const attachments: { filename: string; content: string }[] = [];
  let totalBytes = 0;

  for (const file of attachmentFiles) {
    if (!file?.name || file.size === 0) continue;
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ message: `Attachment "${file.name}" exceeds the 5 MB limit.` }, { status: 400 });
    }
    const isAllowed = ALLOWED_MIME_PREFIXES.some((p) => file.type.startsWith(p));
    if (!isAllowed) {
      return NextResponse.json({ message: `File type "${file.type}" is not allowed.` }, { status: 400 });
    }
    totalBytes += file.size;
    if (totalBytes > MAX_TOTAL_BYTES) {
      return NextResponse.json({ message: "Total attachment size exceeds 15 MB." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer.toString("base64") });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: `${name} <${email}>`,
      subject: `[${type === "property_inquiry" ? "Property Enquiry" : "Contact"}] ${subject}`,
      html: buildHtml({ name, email, subject, message, phone: phone || undefined, type }),
      ...(attachments.length > 0 && { attachments })
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Failed to send your message. Please try again or contact us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Message sent successfully." }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { message: "Failed to send your message. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
