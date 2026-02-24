"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACT_INFO = {
  phone: "010-3658-7365",
  email: "kmlim0407@gmail.com",
  academy: "02-562-5050",
};

export function ContactModalTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">상담 문의</h3>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/-/g, "")}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="text-slate-500 dark:text-slate-400">휴대폰</span>
                  <span className="font-medium">{CONTACT_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="text-slate-500 dark:text-slate-400">이메일</span>
                  <span className="font-medium">{CONTACT_INFO.email}</span>
                </a>
                <a
                  href={`tel:${CONTACT_INFO.academy.replace(/-/g, "")}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="text-slate-500 dark:text-slate-400">학원</span>
                  <span className="font-medium">{CONTACT_INFO.academy}</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                닫기
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
