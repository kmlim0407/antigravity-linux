import { NextRequest, NextResponse } from "next/server";
import {
  getPendingSlots,
  addBooking,
  isSlotAvailable,
  nanoid,
  type MakeupBooking,
} from "@/lib/makeup";

// POST /api/makeup/book
// 학생용: 슬롯 예약 제출
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotId, studentName, reason } = body;

    if (!slotId || typeof slotId !== "string") {
      return NextResponse.json({ error: "slotId 필수" }, { status: 400 });
    }

    const name = (studentName ?? "").trim();
    if (!name || name.length > 20) {
      return NextResponse.json(
        { error: "이름을 입력해주세요 (최대 20자)" },
        { status: 400 }
      );
    }

    if (reason && reason.length > 200) {
      return NextResponse.json(
        { error: "이유는 200자 이내" },
        { status: 400 }
      );
    }

    // 슬롯 존재 확인
    const slots = await getPendingSlots();
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) {
      return NextResponse.json(
        { error: "존재하지 않는 슬롯입니다" },
        { status: 404 }
      );
    }

    // 예약 가능 여부 확인
    const available = await isSlotAvailable(slot);
    if (!available) {
      return NextResponse.json(
        { error: "이미 마감된 시간입니다" },
        { status: 409 }
      );
    }

    const booking: MakeupBooking = {
      id: nanoid(),
      slotId,
      studentName: name,
      reason: reason?.trim() || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await addBooking(booking);
    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch {
    return NextResponse.json({ error: "예약 처리 실패" }, { status: 500 });
  }
}
