// 슬롯 추가 스크립트 — node scripts/add-slots.mjs
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

// .env.local 수동 파싱 (dotenv 의존성 없이)
const __dir = dirname(fileURLToPath(import.meta.url));
try {
  const env = readFileSync(join(__dir, "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key) process.env[key] = val;
  }
} catch {
  console.error("⚠️  .env.local 읽기 실패 — 환경변수를 직접 설정해주세요");
}

const { Redis } = await import("@upstash/redis");
const redis = Redis.fromEnv();

const SLOTS_KEY = "makeup:slots";

function nanoid() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

const newSlots = [
  { id: nanoid(), date: "2026-02-24", time: "14:00", maxBookings: 15 },
  { id: nanoid(), date: "2026-02-25", time: "14:00", maxBookings: 15 },
  { id: nanoid(), date: "2026-02-26", time: "14:00", maxBookings: 15 },
];

const existing = (await redis.get(SLOTS_KEY)) ?? [];
const updated = [...existing, ...newSlots];
await redis.set(SLOTS_KEY, updated);

console.log("✅ 슬롯 추가 완료:");
newSlots.forEach((s) => console.log(`  - ${s.date} ${s.time} (최대 ${s.maxBookings}명)`));
console.log(`총 슬롯: ${updated.length}개`);
