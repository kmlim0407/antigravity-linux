import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = req.nextUrl.origin;
  return NextResponse.redirect(new URL("/icon.png", base), 302);
}
