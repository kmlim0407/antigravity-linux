import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_ICON_URL;
  if (url?.startsWith("http")) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.arrayBuffer();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch {
      // fall through to file
    }
  }
  try {
    const filePath = path.join(process.cwd(), "public", "icon.png");
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
