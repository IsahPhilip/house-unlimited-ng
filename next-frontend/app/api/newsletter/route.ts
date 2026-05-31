import { NextResponse } from "next/server";

const WORDPRESS_BASE_URL =
  process.env.WORDPRESS_BACKEND_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

function buildNewsletterEndpoint() {
  const trimmedBaseUrl = WORDPRESS_BASE_URL.replace(/\/$/, "");

  if (!trimmedBaseUrl) {
    return "";
  }

  if (trimmedBaseUrl.endsWith("/api")) {
    return `${trimmedBaseUrl}/newsletter/subscribe`;
  }

  return `${trimmedBaseUrl}/wp-json/hun/v1/newsletter/subscribe`;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const email = String(payload?.email || "").trim();
  const source = String(payload?.source || "footer").trim() || "footer";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const endpoint = buildNewsletterEndpoint();

  if (!endpoint) {
    return NextResponse.json(
      {
        message:
          "Newsletter delivery is not configured yet. Please set WORDPRESS_BACKEND_URL or NEXT_PUBLIC_WORDPRESS_URL."
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, source })
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(
        data ?? { message: response.ok ? "Subscribed successfully." : "Subscription failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: response.ok
          ? "You are subscribed and will receive our newsletter by email."
          : "Subscription failed. Please try again."
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Newsletter subscription proxy error:", error);

    return NextResponse.json(
      {
        message:
          "We could not reach the newsletter backend. Please try again later."
      },
      { status: 502 }
    );
  }
}
