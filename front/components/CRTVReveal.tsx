"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SCANLINE_COUNT = 80;

export default function CRTVReveal() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="mt-24 flex w-full max-w-4xl justify-center px-4 sm:px-6">
      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-lg border-4 border-slate-800 bg-slate-900 shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 rounded-md border-2 border-slate-700/50 pointer-events-none" />

        {/* 화면: 처음엔 가로줄 한 줄(진동), 호버 시 세로로 쭉 늘어남 */}
        <motion.div
          className="relative w-full overflow-hidden bg-slate-950"
          initial={false}
          animate={{
            height: isHovered ? 360 : 4,
            x: isHovered ? 0 : [0, -1.5, 1.5, -1, 1, 0],
          }}
          transition={{
            height: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            x: isHovered ? { duration: 0 } : { duration: 0.15, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* 가로줄들: 호버 시 위에서부터 순차로 늘어나며 reveal */}
            <div className="absolute inset-0 flex flex-col">
              {Array.from({ length: SCANLINE_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"
                  initial={false}
                  animate={{
                    height: isHovered ? `${100 / SCANLINE_COUNT}%` : "0%",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: isHovered ? 0.15 + i * 0.0055 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={false}
              animate={{ opacity: isHovered ? 0.5 : 0 }}
              transition={{ duration: 0.3, delay: isHovered ? 0.4 : 0 }}
            >
              <span className="text-slate-500/70 text-sm">(수업 영상 영역)</span>
            </motion.div>

            {!isHovered && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-px w-full bg-slate-600/80" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
