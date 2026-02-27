import { Redis } from "@upstash/redis";

export type BookKey = "올고" | "올유" | "올학" | "수신";

export const BOOKS: {
  key: BookKey;
  label: string;
  color: string;
  bg: string;
  ring: string;
}[] = [
  {
    key: "올고",
    label: "올고",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-400",
  },
  {
    key: "올유",
    label: "올유",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-400",
  },
  {
    key: "올학",
    label: "올학",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-400",
  },
  {
    key: "수신",
    label: "수신",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-400",
  },
];

export type SupType = {
  id: string;
  book: BookKey;
  name: string;
  videoUrl: string;
  handwrittenUrl: string;
  order: number;
  createdAt: string;
};

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function getTypesByBook(book: BookKey): Promise<SupType[]> {
  const redis = getRedis();
  const ids = await redis.smembers<string[]>(`supp:book:${book}`);
  if (!ids.length) return [];
  const types = await Promise.all(
    ids.map((id) => redis.hgetall<SupType>(`supp:type:${id}`))
  );
  return types
    .filter((t): t is SupType => t !== null)
    .sort((a, b) => Number(a.order) - Number(b.order));
}

export async function createSupType(
  data: Pick<SupType, "book" | "name" | "videoUrl" | "handwrittenUrl">
): Promise<SupType> {
  const redis = getRedis();
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const count = await redis.scard(`supp:book:${data.book}`);
  const type: SupType = {
    ...data,
    id,
    order: count,
    createdAt: new Date().toISOString(),
  };
  await redis.hset(`supp:type:${id}`, type as unknown as Record<string, string>);
  await redis.sadd(`supp:book:${data.book}`, id);
  return type;
}

export async function updateSupType(
  id: string,
  data: Partial<Pick<SupType, "name" | "videoUrl" | "handwrittenUrl">>
): Promise<void> {
  const redis = getRedis();
  await redis.hset(`supp:type:${id}`, data as Record<string, string>);
}

export async function deleteSupType(id: string, book: BookKey): Promise<void> {
  const redis = getRedis();
  await Promise.all([
    redis.del(`supp:type:${id}`),
    redis.srem(`supp:book:${book}`, id),
  ]);
}
