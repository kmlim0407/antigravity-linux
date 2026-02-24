import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

export type MakeupSlot = {
  id: string;           // nanoid
  date: string;         // "2026-03-05"
  time: string;         // "14:00"
  label?: string;       // 선택적 설명 (예: "오후 보강")
  maxBookings: number;  // 최대 인원 (보통 1)
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type MakeupBooking = {
  id: string;          // nanoid
  slotId: string;
  studentName: string;
  reason?: string;     // 보강 이유 (선택)
  status: BookingStatus;
  createdAt: string;   // ISO string
};

// ──────────────────────────────────────────
// Redis Keys
// ──────────────────────────────────────────

const SLOTS_KEY = "makeup:slots";
const BOOKINGS_KEY = "makeup:bookings";

// ──────────────────────────────────────────
// Slots
// ──────────────────────────────────────────

export async function getSlots(): Promise<MakeupSlot[]> {
  const data = await redis.get<MakeupSlot[]>(SLOTS_KEY);
  return data ?? [];
}

export async function addSlot(slot: MakeupSlot): Promise<void> {
  const slots = await getSlots();
  slots.push(slot);
  await redis.set(SLOTS_KEY, slots);
}

export async function deleteSlot(slotId: string): Promise<void> {
  const slots = await getSlots();
  await redis.set(SLOTS_KEY, slots.filter((s) => s.id !== slotId));
}

// 만료된 슬롯(오늘 이전) 자동 정리
export async function getPendingSlots(): Promise<MakeupSlot[]> {
  const today = new Date().toISOString().split("T")[0];
  const slots = await getSlots();
  return slots.filter((s) => s.date >= today!).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}

// ──────────────────────────────────────────
// Bookings
// ──────────────────────────────────────────

export async function getBookings(): Promise<MakeupBooking[]> {
  const data = await redis.get<MakeupBooking[]>(BOOKINGS_KEY);
  return data ?? [];
}

export async function addBooking(booking: MakeupBooking): Promise<void> {
  const bookings = await getBookings();
  bookings.push(booking);
  await redis.set(BOOKINGS_KEY, bookings);
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<boolean> {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return false;
  bookings[idx]!.status = status;
  await redis.set(BOOKINGS_KEY, bookings);
  return true;
}

// 특정 슬롯의 예약 수 (cancelled 제외)
export async function getActiveBookingCount(slotId: string): Promise<number> {
  const bookings = await getBookings();
  return bookings.filter(
    (b) => b.slotId === slotId && b.status !== "cancelled"
  ).length;
}

// 특정 슬롯 예약 가능 여부
export async function isSlotAvailable(slot: MakeupSlot): Promise<boolean> {
  const count = await getActiveBookingCount(slot.id);
  return count < slot.maxBookings;
}

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────

export function nanoid(): string {
  return Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10);
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d!);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
}
