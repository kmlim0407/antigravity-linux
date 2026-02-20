"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: Record<string, unknown>) => {
        playVideo: () => void;
        pauseVideo: () => void;
        getPlayerState: () => number;
        getCurrentTime: () => number;
        getDuration: () => number;
        seekTo: (seconds: number) => void;
        setVolume: (volume: number) => void;
        getVolume: () => number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function YouTubePlayerCustomControls({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<InstanceType<Window["YT"]["Player"]> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const VOLUME = 80;
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerId = `yt-player-${videoId}`;

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    const startProgressPolling = () => {
      progressIntervalRef.current = setInterval(() => {
        const p = playerRef.current;
        if (!p || p.getPlayerState() !== 1) return;
        setCurrentTime(p.getCurrentTime());
        const d = p.getDuration();
        if (Number.isFinite(d)) setDuration(d);
      }, 250);
    };

    const stopProgressPolling = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    const initPlayer = () => {
      if (!window.YT?.Player) return;
      if (playerRef.current) return;

      const player = new window.YT.Player(playerId, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady(e: { target: InstanceType<Window["YT"]["Player"]> }) {
            playerRef.current = e.target;
            const d = e.target.getDuration();
            if (Number.isFinite(d)) setDuration(d);
            e.target.setVolume(VOLUME);
            startProgressPolling();
          },
          onStateChange(e: { data: number; target: InstanceType<Window["YT"]["Player"]> }) {
            setIsPlaying(e.data === 1);
            if (e.data === 1) startProgressPolling();
            else stopProgressPolling();
            if (e.data === 0) setCurrentTime(0);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
      return () => {
        stopProgressPolling();
        playerRef.current = null;
      };
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      initPlayer();
    };

    return () => {
      stopProgressPolling();
      playerRef.current = null;
      window.onYouTubeIframeAPIReady = prevReady ?? (() => {});
    };
  }, [videoId, playerId]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  };

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;

  const progressToTime = (ratio: number) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const value = Math.max(0, Math.min(duration, ratio * duration));
    p.seekTo(value);
    setCurrentTime(value);
  };

  const getRatioFromEvent = (clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar) return progress;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleBarClick = (e: React.MouseEvent<SVGElement>) => {
    if ((e.target as SVGElement).closest("circle")) return;
    progressToTime(getRatioFromEvent(e.clientX));
  };

  const handleDotMouseDown = () => setIsDragging(true);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => progressToTime(getRatioFromEvent(e.clientX));
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, duration]);

  useEffect(() => {
    if (!isDragging) return;
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) progressToTime(getRatioFromEvent(t.clientX));
    };
    const onTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, duration]);

  const W = 200;
  const H = 24;
  const cy = H / 2;
  const tickCount = 56;
  const tickMinH = 2;
  const tickMaxH = 8;
  const sigma = 1.8;
  const progressPos = progress * tickCount;

  return (
    <div ref={containerRef} className="flex w-full flex-col border-0 outline-none bg-black [&_iframe]:border-0">
      <div className="relative w-full aspect-video shrink-0">
        <div id={playerId} className="absolute inset-0 h-full w-full [&_iframe]:border-0" />
      </div>
      <div
        className="flex flex-shrink-0 items-center gap-1.5 bg-white px-2 py-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div ref={progressBarRef} className="relative flex flex-1 min-w-0 items-center min-h-[28px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="h-6 w-full cursor-pointer"
            onClick={handleBarClick}
            role="slider"
            aria-label="재생 위치"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            {/* 스펙트럼처럼 부드럽게: 현재 위치 주변만 눈금이 길어짐 */}
            {Array.from({ length: tickCount }).map((_, i) => {
              const x = ((i + 0.5) / tickCount) * W;
              const dist = Math.abs(progressPos - (i + 0.5));
              const influence = Math.exp(-(dist * dist) / (2 * sigma * sigma));
              const h = tickMinH + influence * (tickMaxH - tickMinH);
              const r = Math.round(203 + (51 - 203) * influence);
              const g = Math.round(213 + (65 - 213) * influence);
              const b = Math.round(225 + (85 - 225) * influence);
              const strokeColor = `rgb(${r},${g},${b})`;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={cy - h}
                  x2={x}
                  y2={cy + h}
                  stroke={strokeColor}
                  strokeWidth={0.8 + influence * 0.6}
                  strokeLinecap="round"
                  style={{
                    transition: isDragging ? "none" : "all 0.18s ease-out",
                  }}
                />
              );
            })}
            {/* 클릭/드래그로 이동: 투명한 큰 점으로 터치 영역 확보 */}
            <circle
              cx={progress * W}
              cy={cy}
              r="8"
              fill="transparent"
              className="cursor-grab active:cursor-grabbing touch-none select-none"
              onMouseDown={handleDotMouseDown}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDotMouseDown();
              }}
            />
          </svg>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-slate-600">
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
}
