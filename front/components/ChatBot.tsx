"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "model"; content: string };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "안녕하세요. 궁금하신 내용을 편하게 질문해 주시면 도움을 드리겠습니다." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((m) => [...m, { role: "model", content: data.text }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "model", content: data.error || "오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "model", content: "통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition-all hover:scale-105 hover:bg-slate-100"
        aria-label="챗봇 열기"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" fill="currentColor" />
          <circle cx="8" cy="11" r="1" fill="white" />
          <circle cx="12" cy="11" r="1" fill="white" />
          <circle cx="16" cy="11" r="1" fill="white" />
        </svg>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 z-[9998] bg-slate-900/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
              <motion.div
                className="flex h-[min(700px,90vh)] w-full max-w-[480px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 - 모던 미니멀 */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" fill="currentColor" />
                      <circle cx="8" cy="11" r="1" fill="white" />
                      <circle cx="12" cy="11" r="1" fill="white" />
                      <circle cx="16" cy="11" r="1" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">챗봇</p>
                    <p className="text-[11px] text-slate-500">온라인</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  aria-label="닫기"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 대화 영역 */}
              <div
                ref={scrollRef}
                className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-5"
              >
                <div className="mx-auto max-w-md space-y-4">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-[1.6] ${
                          m.role === "user"
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/60"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans text-[14px]">{m.content}</pre>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/60">
                        <span className="inline-flex gap-1.5">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 입력 영역 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="shrink-0 border-t border-slate-100 bg-white p-4"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 rounded-2xl border-0 bg-slate-100 px-4 py-3.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:bg-slate-200/80 focus:ring-2 focus:ring-slate-300/50"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="shrink-0 rounded-2xl bg-slate-900 px-6 py-3.5 text-[14px] font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-40"
                  >
                    전송
                  </button>
                </div>
              </form>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
