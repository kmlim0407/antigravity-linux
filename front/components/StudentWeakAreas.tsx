"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_TAGS, type StudentCharacteristics } from "@/lib/characteristics";

export default function StudentWeakAreas({
  studentId,
}: {
  studentId: string;
}) {
  const [data, setData] = useState<StudentCharacteristics | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/characteristics?studentId=${encodeURIComponent(studentId)}`
      );
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      load();
    }
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <span className="inline-flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    );
  }

  if (!data || data.tags.length === 0) {
    return null; // 태그 없으면 아무것도 표시 안 함
  }

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-700 sm:text-sm">
        나의 취약 유형
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {data.tags.map((tag) => {
          const meta = ALL_TAGS.find((t) => t.tag === tag);
          return (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium sm:text-[12px] ${
                meta
                  ? `${meta.bg} ${meta.color}`
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tag}
            </span>
          );
        })}
      </div>
      {data.memo && (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">
          {data.memo}
        </p>
      )}
    </div>
  );
}
