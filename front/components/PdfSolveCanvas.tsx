"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Point, Stroke, AnnotationData } from "@/lib/prints";
import { publishAnnotation, publishCorrection } from "@/lib/realtime";

type Props = {
  pdfUrl: string;
  assignmentId: string;
  mode: "solve" | "view" | "correct";
  initialAnnotation?: AnnotationData;
  initialCorrection?: AnnotationData;
  onSaveAnnotation?: (data: AnnotationData) => Promise<void>;
  onSaveCorrection?: (data: AnnotationData) => Promise<void>;
};

const DRAW_COLOR = "#1e40af";
const CORRECTION_COLOR = "#dc2626";

const COLOR_PRESETS = [
  { name: "검정", value: "#1f2937" },
  { name: "파랑", value: "#3b82f6" },
  { name: "빨강", value: "#ef4444" },
  { name: "초록", value: "#22c55e" },
  { name: "보라", value: "#a855f7" },
  { name: "주황", value: "#f97316" },
  { name: "핑크", value: "#ec4899" },
  { name: "하늘", value: "#0ea5e9" },
] as const;

const PASTEL_PRESETS = [
  { name: "연파랑", value: "#93c5fd" },
  { name: "연핑크", value: "#f9a8d4" },
  { name: "연초록", value: "#86efac" },
  { name: "연노랑", value: "#fde047" },
] as const;

const WIDTH_PRESETS = [
  { name: "얇게", value: 1.5 },
  { name: "보통", value: 2.5 },
  { name: "굵게", value: 4 },
] as const;

const HIGHLIGHTER_WIDTH_PRESETS = [
  { name: "얇게", value: 12 },
  { name: "보통", value: 20 },
  { name: "굵게", value: 32 },
] as const;

const ERASER_WIDTH_PRESETS = [
  { name: "작게", value: 8 },
  { name: "보통", value: 16 },
  { name: "크게", value: 28 },
] as const;

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** 가까운 포인트를 솎아내서 stroke 데이터 크기 줄이기 */
function simplifyPoints(points: Point[], tolerance = 1.5): Point[] {
  if (points.length <= 2) return points;
  const result = [points[0]!];
  for (let i = 1; i < points.length - 1; i++) {
    if (dist(points[i]!, result[result.length - 1]!) >= tolerance) {
      result.push(points[i]!);
    }
  }
  result.push(points[points.length - 1]!);
  return result;
}

function strokesIntersectEraser(strokes: Stroke[], eraserPoints: Point[], radius: number): Stroke[] {
  return strokes.filter((stroke) => {
    for (const sp of stroke.points) {
      for (const ep of eraserPoints) {
        if (dist(sp, ep) < radius) return false;
      }
    }
    return true;
  });
}

export default function PdfSolveCanvas({
  pdfUrl,
  assignmentId,
  mode,
  initialAnnotation = {},
  initialCorrection = {},
  onSaveAnnotation,
  onSaveCorrection,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageDimensions, setPageDimensions] = useState<{ w: number; h: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [annotation, setAnnotation] = useState<AnnotationData>(initialAnnotation);
  const [correction, setCorrection] = useState<AnnotationData>(initialCorrection);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDrawing = mode === "solve" || mode === "correct";
  const isCorrectMode = mode === "correct";

  const [tool, setTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [penStyle, setPenStyle] = useState<"ballpoint" | "fountain">("ballpoint");
  const [color, setColor] = useState(isCorrectMode ? CORRECTION_COLOR : "#3b82f6");
  const [width, setWidth] = useState(2.5);
  const [highlighterWidth, setHighlighterWidth] = useState(20);
  const [eraserWidth, setEraserWidth] = useState(16);
  const [showPastel, setShowPastel] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const [history, setHistory] = useState<AnnotationData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const applyChange = useCallback(
    (getNext: (prev: AnnotationData) => AnnotationData) => {
      const prev = isCorrectMode ? correction : annotation;
      const next = getNext(prev);
      if (isCorrectMode) setCorrection(next);
      else setAnnotation(next);
      setHistory((h) => [...h.slice(0, historyIndex + 1), JSON.parse(JSON.stringify(next))]);
      setHistoryIndex((i) => i + 1);
      setDirty(true);
    },
    [isCorrectMode, correction, annotation, historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const nextIdx = historyIndex - 1;
    const data = history[nextIdx];
    if (data) {
      if (isCorrectMode) setCorrection(data);
      else setAnnotation(data);
      setHistoryIndex(nextIdx);
      setDirty(true);
    }
  }, [isCorrectMode, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIdx = historyIndex + 1;
    const data = history[nextIdx];
    if (data) {
      if (isCorrectMode) setCorrection(data);
      else setAnnotation(data);
      setHistoryIndex(nextIdx);
      setDirty(true);
    }
  }, [isCorrectMode, history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  useEffect(() => {
    const data = isCorrectMode ? initialCorrection : initialAnnotation;
    const copy = JSON.parse(JSON.stringify(data));
    setHistory([copy]);
    setHistoryIndex(0);
  }, [assignmentId, isCorrectMode, initialAnnotation, initialCorrection]);

  const removeStrokesByEraser = useCallback(
    (pageIndex: number, eraserPoints: Point[], radius: number) => {
      const data = isCorrectMode ? correction : annotation;
      const page = data[pageIndex];
      if (!page) return;
      const kept = strokesIntersectEraser(page.strokes, eraserPoints, radius);
      if (kept.length === page.strokes.length) return;
      applyChange((prev) => {
        const p = prev[pageIndex];
        if (!p) return prev;
        return {
          ...prev,
          [pageIndex]: { ...p, strokes: kept, updatedAt: new Date().toISOString() },
        };
      });
    },
    [annotation, correction, isCorrectMode, applyChange]
  );

  // Private Blob은 브라우저에서 직접 접근 불가 → 프록시 API 사용
  const effectivePdfUrl =
    typeof window !== "undefined" && pdfUrl.includes("private.blob.vercel-storage.com")
      ? `/api/prints/blob?url=${encodeURIComponent(pdfUrl)}`
      : pdfUrl;

  const mergeAnnotation = useCallback(
    (pageIndex: number, newStroke: Stroke) => {
      applyChange((prev) => {
        const page = prev[pageIndex] ?? { pageIndex, strokes: [], updatedAt: new Date().toISOString() };
        return {
          ...prev,
          [pageIndex]: { ...page, strokes: [...page.strokes, newStroke], updatedAt: new Date().toISOString() },
        };
      });
    },
    [applyChange]
  );

  const mergeCorrection = useCallback(
    (pageIndex: number, newStroke: Stroke) => {
      applyChange((prev) => {
        const page = prev[pageIndex] ?? { pageIndex, strokes: [], updatedAt: new Date().toISOString() };
        return {
          ...prev,
          [pageIndex]: { ...page, strokes: [...page.strokes, newStroke], updatedAt: new Date().toISOString() },
        };
      });
    },
    [applyChange]
  );

  useEffect(() => {
    setAnnotation(initialAnnotation);
    setCorrection(initialCorrection);
  }, [assignmentId, initialAnnotation, initialCorrection]);

  useEffect(() => {
    if (!dirty || !isDrawing) return;
    const save = async () => {
      try {
        setSaveError(null);
        if (isCorrectMode && onSaveCorrection) {
          await onSaveCorrection(correction);
          publishCorrection(assignmentId, correction);
        } else if (!isCorrectMode && onSaveAnnotation) {
          await onSaveAnnotation(annotation);
          publishAnnotation(assignmentId, annotation);
        }
        setDirty(false);
      } catch (err) {
        console.warn("자동 저장 실패:", err);
        setSaveError("저장에 실패했습니다. 필기가 너무 많으면 일부를 지워주세요.");
      }
    };
    saveTimeoutRef.current = setTimeout(save, 2000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [dirty, annotation, correction, isCorrectMode, isDrawing, assignmentId, onSaveAnnotation, onSaveCorrection]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        if (typeof window !== "undefined") {
          (pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc =
            `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as unknown as { version: string }).version}/pdf.worker.min.mjs`;
        }
        const pdf = await pdfjsLib.getDocument({ url: effectivePdfUrl }).promise;
        if (cancelled) return;
        const n = pdf.numPages;
        setNumPages(n);
        const dims: { w: number; h: number }[] = [];
        for (let i = 1; i <= n; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 1.5 });
          dims.push({ w: vp.width, h: vp.height });
        }
        if (cancelled) return;
        setPageDimensions(dims);
      } catch (e) {
        if (!cancelled) setError("PDF를 불러올 수 없습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [effectivePdfUrl]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-slate-500">
        PDF 불러오는 중…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const btnBase = "rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-95";
  const btnActive = "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30";
  const btnInactive = "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";
  const colorBtns = showPastel ? PASTEL_PRESETS : COLOR_PRESETS;

  return (
    <div ref={containerRef} className="space-y-4 pb-8">
      {saveError && (
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
          {saveError}
        </div>
      )}
      {isDrawing && (
        <div className="sticky z-10 mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white/98 p-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-slate-600/50 dark:bg-slate-900/98 dark:shadow-slate-900/50" style={{ top: 'calc(var(--nav-height) + 8px)' }}>
          {/* 상단: 도구 + Undo/Redo */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className={`rounded-xl p-2.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${btnInactive}`}
                title="뒤로가기"
              >
                <span className="text-base">↩</span>
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className={`rounded-xl p-2.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${btnInactive}`}
                title="앞으로가기"
              >
                <span className="text-base">↪</span>
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600" />
            <div className="flex rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setTool("pen")}
                className={`${btnBase} ${tool === "pen" ? btnActive : btnInactive}`}
              >
                <span className="mr-1">✏️</span>펜
              </button>
              <button
                type="button"
                onClick={() => setTool("highlighter")}
                className={`${btnBase} ${tool === "highlighter" ? btnActive : btnInactive}`}
              >
                <span className="mr-1">🖍️</span>형광펜
              </button>
              <button
                type="button"
                onClick={() => setTool("eraser")}
                className={`${btnBase} ${tool === "eraser" ? btnActive : btnInactive}`}
              >
                <span className="mr-1">🧽</span>지우개
              </button>
            </div>
          </div>

          {/* 펜 옵션 */}
          {(tool === "pen" || tool === "highlighter") && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setColorPickerOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-2xl bg-slate-100/80 px-3 py-2 transition-all hover:bg-slate-200/80 hover:scale-105 active:scale-95 dark:bg-slate-800/80 dark:hover:bg-slate-700/80"
                  title="색상 선택"
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-slate-200 shadow-sm ring-2 ring-transparent transition-all"
                    style={{
                      backgroundColor: color,
                      ...(colorPickerOpen && { borderColor: "rgb(99 102 241)", boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.3)" }),
                    }}
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    색상
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {colorPickerOpen && (
                    <motion.div
                      initial={{ x: -120, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -120, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1.5 pl-2">
                        {colorBtns.map((c) => (
                          <motion.button
                            key={c.value}
                            type="button"
                            onClick={() => setColor(c.value)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.02 }}
                            className={`h-8 w-8 shrink-0 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${
                              color === c.value ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800" : "border-slate-200 hover:border-slate-300"
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPastel(!showPastel)}
                        className="shrink-0 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400"
                      >
                        {showPastel ? "진한색" : "연한색"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {tool === "pen" && (
                <>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">펜 모양</span>
                    <div className="flex gap-1">
                      {(["ballpoint", "fountain"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setPenStyle(s)}
                          className={`${btnBase} ${penStyle === s ? btnActive : btnInactive}`}
                        >
                          {s === "ballpoint" ? "볼펜" : "만년필"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">굵기</span>
                    <div className="flex gap-1">
                      {WIDTH_PRESETS.map((w) => (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => setWidth(w.value)}
                          className={`${btnBase} ${width === w.value ? btnActive : btnInactive}`}
                        >
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {tool === "highlighter" && (
                <>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">굵기</span>
                    <div className="flex gap-1">
                      {HIGHLIGHTER_WIDTH_PRESETS.map((w) => (
                        <button
                          key={w.value}
                          type="button"
                          onClick={() => setHighlighterWidth(w.value)}
                          className={`${btnBase} ${highlighterWidth === w.value ? btnActive : btnInactive}`}
                        >
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {tool === "eraser" && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500">지우개 크기</span>
              <div className="flex gap-1">
                {ERASER_WIDTH_PRESETS.map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setEraserWidth(w.value)}
                    className={`${btnBase} ${eraserWidth === w.value ? btnActive : btnInactive}`}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {Array.from({ length: numPages }).map((_, pageIndex) => (
        <PageCanvas
          key={pageIndex}
          pdfUrl={effectivePdfUrl}
          pageIndex={pageIndex}
          width={pageDimensions[pageIndex]?.w ?? 595}
          height={pageDimensions[pageIndex]?.h ?? 842}
          annotation={annotation[pageIndex]}
          correction={correction[pageIndex]}
          mode={mode}
          tool={tool}
          penStyle={penStyle}
          color={color}
          strokeWidth={width}
          highlighterWidth={highlighterWidth}
          eraserWidth={eraserWidth}
          isCorrectMode={isCorrectMode}
          onStroke={(stroke) => {
            if (isCorrectMode) mergeCorrection(pageIndex, stroke);
            else mergeAnnotation(pageIndex, stroke);
          }}
          onEraserStroke={(points, radius) => removeStrokesByEraser(pageIndex, points, radius)}
        />
      ))}
    </div>
  );
}

function PageCanvas({
  pdfUrl,
  pageIndex,
  width,
  height,
  annotation,
  correction,
  mode,
  tool,
  penStyle,
  color,
  strokeWidth,
  highlighterWidth,
  eraserWidth,
  isCorrectMode,
  onStroke,
  onEraserStroke,
}: {
  pdfUrl: string;
  pageIndex: number;
  width: number;
  height: number;
  annotation?: { strokes: Stroke[] };
  correction?: { strokes: Stroke[] };
  mode: "solve" | "view" | "correct";
  tool: "pen" | "highlighter" | "eraser";
  penStyle: "ballpoint" | "fountain";
  color: string;
  strokeWidth: number;
  highlighterWidth: number;
  eraserWidth: number;
  isCorrectMode: boolean;
  onStroke: (stroke: Stroke) => void;
  onEraserStroke: (points: Point[], radius: number) => void;
}) {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);

  const eraserRadius = eraserWidth / 2;
  const isPenOrHighlighter = tool === "pen" || tool === "highlighter";
  const strokeColor = color;
  const strokeWidthFinal =
    tool === "highlighter" ? highlighterWidth : tool === "pen" ? strokeWidth : strokeWidth;
  const strokeOpacity = tool === "highlighter" ? 0.45 : tool === "pen" && penStyle === "fountain" ? 0.55 : 1;
  const isFountain = tool === "pen" && penStyle === "fountain";
  const fountainBaseWidth = 1;

  useEffect(() => {
    let cancelled = false;
    async function renderPdf() {
      const canvas = pdfCanvasRef.current;
      if (!canvas) return;
      try {
        const pdfjsLib = await import("pdfjs-dist");
        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        const scale = 1.5;
        const vp = page.getViewport({ scale });
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx2 = canvas.getContext("2d");
        if (!ctx2 || cancelled) return;
        await page.render({
          canvasContext: ctx2,
          viewport: vp,
        }).promise;
      } catch (err) {
        console.warn("renderPdf failed:", err);
      }
    }
    renderPdf();
    return () => { cancelled = true; };
  }, [pdfUrl, pageIndex]);

  useEffect(() => {
    const c = drawCanvasRef.current;
    if (!c) return;
    const ctx2 = c.getContext("2d");
    setCtx(ctx2);
  }, []);

  useEffect(() => {
    const c = drawCanvasRef.current;
    const ctx2 = c?.getContext("2d");
    if (!c || !ctx2) return;
    ctx2.clearRect(0, 0, c.width, c.height);
    [annotation?.strokes ?? [], correction?.strokes ?? []].forEach((strokes) => {
      strokes.forEach((s) => drawStroke(ctx2, s, s.color, s.opacity));
    });
  }, [annotation, correction]);

  const drawStroke = (
    ctx2: CanvasRenderingContext2D,
    stroke: Stroke,
    overrideColor?: string,
    overrideOpacity?: number
  ) => {
    if (stroke.points.length < 2) return;
    const col = overrideColor ?? stroke.color;
    const op = overrideOpacity ?? stroke.opacity ?? 1;
    ctx2.save();
    ctx2.globalAlpha = op;
    ctx2.strokeStyle = col;
    ctx2.lineCap = "round";
    ctx2.lineJoin = "round";

    if (stroke.penStyle === "fountain") {
      // 만년필: 테이퍼드 선 (시작·끝 얇고 중간 굵게), 얇은 형광펜 느낌
      const pts = stroke.points;
      const baseW = stroke.width;
      for (let i = 0; i < pts.length - 1; i++) {
        const t0 = pts.length <= 1 ? 1 : i / (pts.length - 1);
        const t1 = pts.length <= 1 ? 1 : (i + 1) / (pts.length - 1);
        const taper = (t: number) => Math.sin(t * Math.PI);
        const w0 = baseW * (0.25 + 0.75 * taper(t0));
        const w1 = baseW * (0.25 + 0.75 * taper(t1));
        ctx2.lineWidth = (w0 + w1) / 2;
        ctx2.beginPath();
        ctx2.moveTo(pts[i]!.x, pts[i]!.y);
        ctx2.lineTo(pts[i + 1]!.x, pts[i + 1]!.y);
        ctx2.stroke();
      }
    } else {
      ctx2.lineWidth = stroke.width;
      ctx2.beginPath();
      ctx2.moveTo(stroke.points[0]!.x, stroke.points[0]!.y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx2.lineTo(stroke.points[i]!.x, stroke.points[i]!.y);
      }
      ctx2.stroke();
    }
    ctx2.restore();
  };

  const getPoint = (e: React.PointerEvent | PointerEvent): Point | null => {
    const c = drawCanvasRef.current;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (mode === "view" || !ctx) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pt = getPoint(e);
      if (!pt) return;
      isDrawingRef.current = true;
      currentStrokeRef.current = [pt];
    },
    [mode, ctx]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawingRef.current || !ctx) return;
      e.preventDefault();
      const pt = getPoint(e);
      if (!pt) return;
      currentStrokeRef.current.push(pt);
      if (isPenOrHighlighter) {
        const stroke: Stroke = {
          points: [...currentStrokeRef.current],
          color: strokeColor,
          width: isFountain ? fountainBaseWidth : strokeWidthFinal,
          ...(tool === "highlighter" && { opacity: strokeOpacity }),
          ...(isFountain && { opacity: strokeOpacity, penStyle: "fountain" }),
        };
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        [annotation?.strokes ?? [], correction?.strokes ?? []].forEach((strokes) => {
          strokes.forEach((s) => drawStroke(ctx!, s, s.color, s.opacity));
        });
        drawStroke(ctx, stroke, strokeColor, strokeOpacity);
      } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        [annotation?.strokes ?? [], correction?.strokes ?? []].forEach((strokes) => {
          strokes.forEach((s) => drawStroke(ctx!, s, s.color, s.opacity));
        });
      }
    },
    [ctx, annotation, correction, tool, isPenOrHighlighter, isFountain, strokeColor, strokeWidthFinal, strokeOpacity, fountainBaseWidth]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      if (!isDrawingRef.current) return;
      e.preventDefault();
      isDrawingRef.current = false;
      if (tool === "eraser") {
        if (currentStrokeRef.current.length >= 1) {
          onEraserStroke([...currentStrokeRef.current], eraserRadius);
        }
      } else if (isPenOrHighlighter && currentStrokeRef.current.length >= 2) {
        onStroke({
          points: simplifyPoints([...currentStrokeRef.current]),
          color: strokeColor,
          width: isFountain ? fountainBaseWidth : strokeWidthFinal,
          ...(tool === "highlighter" && { opacity: strokeOpacity }),
          ...(isFountain && { opacity: strokeOpacity, penStyle: "fountain" }),
        });
      }
      currentStrokeRef.current = [];
    },
    [tool, isPenOrHighlighter, isFountain, onStroke, onEraserStroke, strokeColor, strokeWidthFinal, strokeOpacity, fountainBaseWidth, eraserRadius]
  );

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 800
  );

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scale = Math.min(1, windowWidth / width) * 0.95;

  return (
    <div className="flex justify-center">
      <div
        className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700"
        style={{ width: width * scale, height: height * scale }}
      >
        <canvas
          ref={pdfCanvasRef}
          className="absolute left-0 top-0 block max-w-full"
          style={{ width: width * scale, height: height * scale }}
        />
        <canvas
          ref={drawCanvasRef}
          width={width}
          height={height}
          className={`absolute left-0 top-0 block max-w-full ${
            (mode === "solve" || mode === "correct")
              ? tool === "eraser"
                ? "cursor-cell"
                : "cursor-crosshair"
              : ""
          }`}
          style={{ width: width * scale, height: height * scale, touchAction: (mode === "solve" || mode === "correct") ? "none" : "pan-x pan-y pinch-zoom" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
}
