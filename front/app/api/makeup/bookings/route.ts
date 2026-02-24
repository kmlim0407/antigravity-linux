import { NextRequest, NextResponse } from "next/server";
import {
  getBookings,
  getSlots,
  updateBookingStatus,
  type BookingStatus,
} from "@/lib/makeup";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "smookth";

// GET /api/makeup/bookings
// 선생님용: 전체 예약 목록 + 슬롯 정보 조합
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("adminKey");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  try {
    const [bookings, slots] = await Promise.all([getBookings(), getSlots()]);

    const slotMap = Object.fromEntries(slots.map((s) => [s.id, s]));

    const enriched = bookings
      .map((b) => ({ ...b, slot: slotMap[b.slotId] ?? null }))
      .sort((a, b) => {
        const dateA = a.slot?.date ?? "";
        const dateB = b.slot?.date ?? "";
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        return (a.slot?.time ?? "").localeCompare(b.slot?.time ?? "");
      });

    return NextResponse.json({ bookings: enriched });
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

// PATCH /api/makeup/bookings
// 선생님용: 예약 상태 변경 (pending → confirmed / cancelled)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, status, adminKey } = body;

    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    const validStatuses: BookingStatus[] = ["pending", "confirmed", "cancelled"];
    if (!bookingId || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "bookingId, status(pending|confirmed|cancelled) 필수" },
        { status: 400 }
      );
    }

    const ok = await updateBookingStatus(bookingId, status);
    if (!ok) {
      return NextResponse.json(
        { error: "해당 예약을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "상태 변경 실패" }, { status: 500 });
  }
}
