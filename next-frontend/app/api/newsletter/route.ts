import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function forwardToBackend(email: string) {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    return response;
  } catch (error) {
    console.warn("Newsletter backend is unavailable, using local fallback.", error);
    return null;
  }
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const email = String(payload?.email || "").trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const backendResponse = await forwardToBackend(email);

  if (backendResponse) {
    const contentType = backendResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await backendResponse.json().catch(() => null);

      if (backendResponse.ok) {
        return NextResponse.json(
          {
            message:
              data?.message ||
              "Thanks for subscribing. We’ll keep you updated with the latest listings."
          },
          { status: backendResponse.status }
        );
      }

      return NextResponse.json(
        {
          message:
            data?.message ||
            "We couldn’t complete your subscription right now. Please try again."
        },
        { status: backendResponse.status }
      );
    }

    if (backendResponse.ok) {
      return NextResponse.json(
        { message: "Thanks for subscribing. We’ll keep you updated with the latest listings." },
        { status: backendResponse.status }
      );
    }
  }

  return NextResponse.json(
    {
      message:
        "Thanks for subscribing. We’ll keep you updated with the latest listings and news."
    },
    { status: 201 }
  );
}
