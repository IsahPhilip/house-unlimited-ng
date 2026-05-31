import { NextResponse } from "next/server";

const WORDPRESS_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress";
const WORDPRESS_BLOG_API_BASE = `${WORDPRESS_BASE_URL}/wp-json/hun/v1`;

type RouteContext = {
  params: {
    path: string[];
  };
};

async function proxyRequest(request: Request, context: RouteContext) {
  const { path } = context.params;
  const targetUrl = new URL(`${WORDPRESS_BLOG_API_BASE}/${path.join("/")}`);
  targetUrl.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("accept-encoding");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers(response.headers);

  responseHeaders.delete("transfer-encoding");
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("connection");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}
