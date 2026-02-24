import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: err.status }
    );
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(", ");
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400 }
    );
  }

  console.error("[API Error]", err);
  return NextResponse.json(
    { ok: false, error: "서버 오류가 발생했습니다." },
    { status: 500 }
  );
}
