"use client";

import { useState, useRef, useCallback } from "react";

const PROBLEM_NUM_LEN = 3;
const CROP_PADDING = 10;
const OCR_LINE_Y_THRESH = 8;

/** 문제 아닌 부분(헤더·푸터·여백) 잘라내기 비율: 상단 5%, 하단 10%, 좌 3%, 우 3% */
const CROP_CONTENT_TOP = 0.05;
const CROP_CONTENT_BOTTOM = 0.1;
const CROP_CONTENT_LEFT = 0.03;
const CROP_CONTENT_RIGHT = 0.03;

/** 전체 페이지에서 문제 영역만 잘라낸 캔버스 반환. 반환값: { canvas, offsetX, offsetY, width, height } */
function cropToContentArea(source: HTMLCanvasElement): {
  canvas: HTMLCanvasElement;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
} {
  const w = source.width;
  const h = source.height;
  const x0 = Math.round(w * CROP_CONTENT_LEFT);
  const y0 = Math.round(h * CROP_CONTENT_TOP);
  const x1 = Math.round(w * (1 - CROP_CONTENT_RIGHT));
  const y1 = Math.round(h * (1 - CROP_CONTENT_BOTTOM));
  const cw = Math.max(1, x1 - x0);
  const ch = Math.max(1, y1 - y0);
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const ctx = out.getContext("2d");
  if (!ctx) return { canvas: source, offsetX: 0, offsetY: 0, width: w, height: h };
  ctx.drawImage(source, x0, y0, cw, ch, 0, 0, cw, ch);
  return { canvas: out, offsetX: x0, offsetY: y0, width: cw, height: ch };
}

/** OCR 인식률을 위해 그레이스케일 + 대비 적용 */
function preprocessCanvasForOcr(sourceCanvas: HTMLCanvasElement): string {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) return sourceCanvas.toDataURL("image/png");
  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    const v = g < 128 ? Math.max(0, g * 1.2 - 20) : Math.min(255, g * 1.1 + 10);
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(imgData, 0, 0);
  return out.toDataURL("image/png");
}
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const COLUMN_WIDTH = A4_WIDTH / 2;
const DIVIDER_X = COLUMN_WIDTH;

function normalizeNum(n: number): string {
  return String(n).padStart(PROBLEM_NUM_LEN, "0");
}

/** "001, 013, 135" 또는 "1, 13, 135" → ["001","013","135"] */
function parseProblemInput(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? null : normalizeNum(n);
    })
    .filter((s): s is string => s !== null);
}

type ProblemRegion = {
  num: string;
  pageIndex: number;
  y0: number;
  y1: number;
  pageWidth: number;
  pageHeight: number;
};

export default function WrongAnswerPrintPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [problemInput, setProblemInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (pdfFile: File) => {
    setLoading(true);
    setError(null);
    setPageCount(0);
    setProblemInput("");
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setFile(null);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      const res = await fetch("/api/wrong-answer-print/page-count", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "PDF를 불러올 수 없습니다.");
      }
      const { pageCount: count } = (await res.json()) as { pageCount: number };
      setPageCount(count);
      setFile(pdfFile);
      setFileUrl(URL.createObjectURL(pdfFile));
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF를 불러올 수 없습니다. 파일을 확인해 주세요.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, [fileUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") {
      loadPdf(f);
    } else if (f) {
      setError("PDF 파일만 업로드할 수 있습니다.");
      setFile(null);
      setPageCount(0);
    }
    e.target.value = "";
  };

  const resetFile = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setFile(null);
    setPageCount(0);
    setProblemInput("");
    setError(null);
  };

  const generatePrint = useCallback(async () => {
    if (!file) return;
    const wanted = parseProblemInput(problemInput);
    if (wanted.length === 0) {
      setError("포함할 문항 번호를 입력해 주세요. (반드시 3자리: 001, 013, 135)");
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress("PDF 불러오는 중…");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      if (typeof window !== "undefined") {
        (pdfjsLib as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as unknown as { version: string }).version}/pdf.worker.min.mjs`;
      }

      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const numPages = pdf.numPages;
      const scale = 2;
      const regions: ProblemRegion[] = [];
      const renderedPages = new Map<number, { width: number; height: number; dataUrl: string }>();

      for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
        setProgress(`문항 위치 찾는 중… (${pageIndex + 1}/${numPages}페이지)`);
        const page = await pdf.getPage(pageIndex + 1);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        const fullHeight = viewport.height;
        const fullWidth = viewport.width;
        const sc = viewport.scale;

        const crop = cropToContentArea(canvas);
        const pageHeight = crop.height;
        const pageWidth = crop.width;
        const ox = crop.offsetX;
        const oy = crop.offsetY;

        let problemWords: { num: string; y0: number; y1: number }[] = [];

        try {
          const textContent = await page.getTextContent();
          const rawItems = (textContent as { items: Array<{ str?: string; transform?: number[]; width?: number; height?: number }> }).items || [];

          const digitItems = rawItems
            .filter((it) => /^\d$/.test((it.str || "").trim()))
            .map((it) => {
              const t = it.transform || [1, 0, 0, 1, 0, 0];
              const pdfY = t[5];
              const h = (it.height as number) ?? 12;
              const canvasTop = fullHeight - (pdfY + h) * sc;
              const canvasBottom = fullHeight - pdfY * sc;
              const contentTop = canvasTop - oy;
              const contentBottom = canvasBottom - oy;
              if (contentTop >= pageHeight || contentBottom <= 0) return null;
              return {
                str: (it.str || "").trim(),
                x: t[4] - ox,
                canvasTop: Math.max(0, contentTop),
                canvasBottom: Math.min(pageHeight, contentBottom),
              };
            })
            .filter((it): it is NonNullable<typeof it> => it !== null);
          if (digitItems.length >= 3) {
            digitItems.sort((a, b) => a.canvasTop - b.canvasTop || a.x - b.x);
            const Y_LINE_THRESH = 5;
            let i = 0;
            while (i < digitItems.length) {
              const lineStart = i;
              const top = digitItems[i].canvasTop;
              while (i < digitItems.length && Math.abs(digitItems[i].canvasTop - top) <= Y_LINE_THRESH) i++;
              const line = digitItems.slice(lineStart, i).sort((a, b) => a.x - b.x);
              const digitStr = line.map((it) => it.str).join("");
              for (let k = 0; k + 3 <= digitStr.length; k += 3) {
                const num = digitStr.slice(k, k + 3);
                const first = line[k];
                const last = line[k + 2];
                if (!first || !last) continue;
                const nextFirst = line[k + 3];
                const y0 = Math.max(0, first.canvasTop - CROP_PADDING);
                problemWords.push({
                  num,
                  y0,
                  y1: nextFirst ? nextFirst.canvasTop - CROP_PADDING : pageHeight,
                });
              }
            }
            problemWords.sort((a, b) => a.y0 - b.y0);
          }
          if (problemWords.length === 0) {
            const asThree = rawItems
              .filter((it) => /^\d{3}$/.test((it.str || "").trim()))
              .map((it) => {
                const t = it.transform || [1, 0, 0, 1, 0, 0];
                const pdfY = t[5];
                const h = (it.height as number) ?? 12;
                const canvasTop = fullHeight - (pdfY + h) * sc;
                const canvasBottom = fullHeight - pdfY * sc;
                const contentTop = canvasTop - oy;
                const contentBottom = canvasBottom - oy;
                if (contentTop >= pageHeight || contentBottom <= 0) return null;
                return {
                  num: (it.str || "").trim(),
                  y0: Math.max(0, contentTop) - CROP_PADDING,
                  y1: Math.min(pageHeight, contentBottom) + CROP_PADDING,
                };
              })
              .filter((it): it is NonNullable<typeof it> => it !== null)
              .sort((a, b) => a.y0 - b.y0);
            if (asThree.length > 0) {
              for (let i = 0; i < asThree.length; i++) {
                asThree[i].y1 = asThree[i + 1]
                  ? asThree[i + 1].y0 - CROP_PADDING
                  : pageHeight;
              }
              problemWords = asThree;
            }
          }
        } catch {
          problemWords = [];
        }

        if (problemWords.length === 0) {
          setProgress(`문항 번호 인식 중(OCR, 3자리만)… (${pageIndex + 1}/${numPages}페이지)`);
          const Tesseract = await import("tesseract.js");
          const preprocessed = preprocessCanvasForOcr(crop.canvas);
          const result = await Tesseract.recognize(preprocessed, "eng", {
            logger: () => {},
            tessedit_char_whitelist: "0123456789",
          });
          const data = result.data as { words?: Array<{ text?: string; bbox?: { x0: number; y0: number; x1: number; y1: number } }> };
          const words = data?.words ?? [];

          let ocrWords = words
            .filter((w) => {
              const t = (w.text || "").trim().replace(/[Oo]/g, "0").replace(/[lI]/g, "1");
              return /^\d{3}$/.test(t);
            })
            .map((w) => {
              const t = (w.text || "").trim().replace(/[Oo]/g, "0").replace(/[lI]/g, "1");
              const b = w.bbox!;
              return { num: t, y0: b.y0 - CROP_PADDING, y1: b.y1 + CROP_PADDING };
            })
            .filter((w): w is NonNullable<typeof w> => w !== null)
            .sort((a, b) => a.y0 - b.y0);

          if (ocrWords.length === 0) {
            const digitWords = words
              .filter((w) => w.bbox && /^\d{1,2}$/.test((w.text || "").trim().replace(/[Oo]/g, "0").replace(/[lI]/g, "1")))
              .map((w) => {
                const t = (w.text || "").trim().replace(/[Oo]/g, "0").replace(/[lI]/g, "1");
                const b = w.bbox!;
                return { str: t, y0: b.y0, x0: b.x0, y1: b.y1 };
              })
              .sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
            let i = 0;
            while (i < digitWords.length) {
              const lineStart = i;
              const top = digitWords[i].y0;
              while (i < digitWords.length && Math.abs(digitWords[i].y0 - top) <= OCR_LINE_Y_THRESH) i++;
              const line = digitWords.slice(lineStart, i).sort((a, b) => a.x0 - b.x0);
              const digitStr = line.map((d) => d.str).join("");
              for (let k = 0; k + 3 <= digitStr.length; k += 3) {
                const num = digitStr.slice(k, k + 3);
                let charIdx = 0;
                let first: (typeof line)[0] | null = null;
                let last: (typeof line)[0] | null = null;
                for (const item of line) {
                  const prev = charIdx;
                  charIdx += item.str.length;
                  if (first === null && charIdx > k) first = item;
                  if (last === null && charIdx > k + 2) last = item;
                  if (first && last) break;
                }
                if (!first || !last) continue;
                ocrWords.push({
                  num,
                  y0: first.y0 - CROP_PADDING,
                  y1: last.y1 + CROP_PADDING,
                });
              }
            }
            ocrWords.sort((a, b) => a.y0 - b.y0);
          }

          if (ocrWords.length > 0) {
            for (let i = 0; i < ocrWords.length; i++) {
              ocrWords[i].y1 = ocrWords[i + 1]
                ? ocrWords[i + 1].y0 - CROP_PADDING
                : pageHeight;
            }
            problemWords = ocrWords;
          }
        }

        for (let i = 0; i < problemWords.length; i++) {
          const curr = problemWords[i];
          const next = problemWords[i + 1];
          const y0 = Math.max(0, curr.y0);
          const y1 = next ? Math.min(pageHeight, next.y0 - CROP_PADDING) : pageHeight;
          regions.push({
            num: curr.num,
            pageIndex,
            y0,
            y1,
            pageWidth,
            pageHeight,
          });
        }

        renderedPages.set(pageIndex, {
          width: pageWidth,
          height: pageHeight,
          dataUrl: crop.canvas.toDataURL("image/png"),
        });
      }

      const selectedRegions: ProblemRegion[] = [];
      const used = new Set<string>();
      for (const num of wanted) {
        const r = regions.find((r0) => r0.num === num && !used.has(`${r0.pageIndex}-${r0.y0}`));
        if (r) {
          used.add(`${r.pageIndex}-${r.y0}`);
          selectedRegions.push(r);
        }
      }

      if (selectedRegions.length === 0) {
        const detectedNums = [...new Set(regions.map((r) => r.num))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        setError(
          detectedNums.length > 0
            ? `입력한 문항 번호를 찾지 못했습니다. 이 PDF에서 인식된 문항 번호: ${detectedNums.join(", ")}. 위 목록에서 고르거나, 교재가 001·080 형식(3자리)인지 확인해 주세요.`
            : "이 PDF에서 문항 번호(3자리)를 전혀 인식하지 못했습니다. 텍스트 선택이 되는 PDF인지, 또는 스캔 품질을 확인해 주세요."
        );
        setGenerating(false);
        return;
      }

      setProgress("문항 영역 잘라내는 중…");
      const cropCanvas = document.createElement("canvas");
      const cropCtx = cropCanvas.getContext("2d");
      if (!cropCtx) throw new Error("Canvas not supported");
      const cropImages: string[] = [];

      for (const r of selectedRegions) {
        const img = renderedPages.get(r.pageIndex);
        if (!img) continue;
        const src = new Image();
        await new Promise<void>((resolve, reject) => {
          src.onload = () => resolve();
          src.onerror = reject;
          src.src = img.dataUrl;
        });
        const h = Math.max(1, Math.round(r.y1 - r.y0));
        cropCanvas.width = img.width;
        cropCanvas.height = h;
        cropCtx.drawImage(src, 0, r.y0, img.width, h, 0, 0, img.width, h);
        cropImages.push(cropCanvas.toDataURL("image/png"));
      }

      setProgress("오답 프린트 PDF 만드는 중…");
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const halfW = COLUMN_WIDTH - 20;
      const margin = 20;

      for (let i = 0; i < cropImages.length; i += 2) {
        const pdfPage = doc.addPage([A4_WIDTH, A4_HEIGHT]);
        const leftImg = cropImages[i];
        const rightImg = cropImages[i + 1];

        const drawCrop = async (dataUrl: string, x: number) => {
          const imgBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
          const png = await doc.embedPng(new Uint8Array(imgBytes));
          const ratio = png.width / png.height;
          let w = halfW;
          let h = halfW / ratio;
          if (h > A4_HEIGHT - margin * 2) {
            h = A4_HEIGHT - margin * 2;
            w = h * ratio;
          }
          const y = A4_HEIGHT - margin - h;
          pdfPage.drawImage(png, {
            x: x + (halfW - w) / 2 + 10,
            y,
            width: w,
            height: h,
          });
        };

        await drawCrop(leftImg, 0);
        if (rightImg) await drawCrop(rightImg, COLUMN_WIDTH);

        pdfPage.drawLine({
          start: { x: DIVIDER_X, y: 0 },
          end: { x: DIVIDER_X, y: A4_HEIGHT },
          thickness: 0.5,
          color: { type: "RGB", red: 0.8, green: 0.8, blue: 0.8 },
        });
      }

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wrong-answer-print.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오답 프린트 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
      setProgress("");
    }
  }, [file, problemInput]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8" style={{ fontFamily: "var(--font-outfit)" }}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          오답 프린트 만들기
        </h1>
        <p className="mb-6 text-slate-600">
          교재 PDF를 올리고, <strong>포함할 문항 번호</strong>를 입력하면 해당 문항만 잘라서 <strong>한 장에 좌우 2열</strong>로 모아 PDF로 다운로드합니다. 문항 번호는 <strong>반드시 3자리</strong>(001, 013, 135 형식)로 되어 있어야 합니다.
        </p>

        {!file && (
          <div
            className="mb-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white py-12 transition hover:border-slate-400 hover:bg-slate-50/50"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              className="hidden"
            />
            <svg className="mb-3 h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-slate-600">PDF 파일을 클릭하거나 여기에 드래그하여 업로드</span>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-white py-8 text-slate-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            PDF 불러오는 중…
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            {error}
          </div>
        )}

        {file && !loading && pageCount > 0 && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-600 sm:text-base">
                <strong>{file.name}</strong> · {pageCount}페이지
              </span>
              <button
                type="button"
                onClick={resetFile}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                다른 파일
              </button>
            </div>

            {fileUrl && (
              <div className="mb-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <p className="mb-2 text-sm font-medium text-slate-600">미리보기</p>
                <iframe
                  src={`${fileUrl}#toolbar=1`}
                  title="PDF 미리보기"
                  className="h-[360px] w-full rounded-lg border-0 bg-slate-100"
                />
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="problem-input" className="mb-2 block text-sm font-medium text-slate-600">
                포함할 문항 번호 (쉼표 또는 공백으로 구분)
              </label>
              <input
                id="problem-input"
                type="text"
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="예: 001, 013, 135 (3자리만)"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                입력한 문항만 잘라서 한 장에 2문항씩 좌우로 배치한 PDF가 만들어집니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={generatePrint}
                disabled={generating}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50 disabled:hover:bg-slate-900"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress || "생성 중…"}
                  </>
                ) : (
                  "오답 프린트 만들기"
                )}
              </button>
              {generating && progress && (
                <span className="text-sm text-slate-500">{progress}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
