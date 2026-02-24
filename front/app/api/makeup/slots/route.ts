import { NextRequest, NextResponse } from "next/server";
import {
  getPendingSlots,
  addSlot,
  deleteSlot,
  nanoid,
  isSlotAvailable,
  getBookings,
  type MakeupSlot,
} from "@/lib/makeup";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "smookth";

// 슬롯은 자주 바뀌지 않으므로 30초 캐시
export const revalidate = 30;

// GET /api/makeup/slots
// 학생용: 예약 가능한 슬롯 목록 반환 (날짜순)
export async function GET() {
  try {
    const slots = await getPendingSlots();
    const bookings = await getBookings();

    const slotsWithAvailability = slots.map((slot) => {
      const activeCount = bookings.filter(
        (b) => b.slotId === slot.id && b.status !== "cancelled"
      ).length;
      return {
        ...slot,
        available: activeCount < slot.maxBookings,
        bookedCount: activeCount,
      };
    });

    return NextResponse.json({ slots: slotsWithAvailability });
  } catch {
    return NextResponse.json({ error: "슬롯 조회 실패" }, { status: 500 });
  }
}

// POST /api/makeup/slots
// 선생님용: 슬롯 추가 또는 삭제 (ADMIN_KEY 필요)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, adminKey, slotId, date, time, label, maxBookings } = body;

    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    // 슬롯 삭제
    if (action === "delete") {
      if (!slotId) {
        return NextResponse.json({ error: "slotId 필요" }, { status: 400 });
      }
      await deleteSlot(slotId);
      return NextResponse.json({ ok: true });
    }

    // 슬롯 추가
    if (!date || !time) {
      return NextResponse.json(
        { error: "date, time 필수" },
        { status: 400 }
      );
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "date 형식은 YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // 시간 형식 검증 (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json(
        { error: "time 형식은 HH:MM" },
        { status: 400 }
      );
    }

    const slot: MakeupSlot = {
      id: nanoid(),
      date,
      time,
      label: label ?? undefined,
      maxBookings: Number(maxBookings) || 1,
    };

    await addSlot(slot);
    return NextResponse.json({ ok: true, slot });
  } catch {
    return NextResponse.json({ error: "슬롯 처리 실패" }, { status: 500 });
  }
}
