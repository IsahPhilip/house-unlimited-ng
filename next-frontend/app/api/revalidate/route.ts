import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }

  let body: { slug?: string; type?: string } = {};
  try {
    body = await request.json();
  } catch {
    // body is optional
  }

  const type = body.type || "post";
  const slug = body.slug;

  try {
    if (type === "post") {
      revalidatePath("/blog", "page");
      revalidatePath("/", "page");
      if (slug) revalidatePath(`/blog/${slug}`, "page");
    }

    if (type === "property") {
      revalidatePath("/properties", "page");
      revalidatePath("/", "page");
      if (slug) revalidatePath(`/properties/${slug}`, "page");
    }

    revalidatePath("/sitemap.xml");

    console.log(`Revalidated: type=${type} slug=${slug || "all"}`);
    return NextResponse.json({ revalidated: true, type, slug });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
