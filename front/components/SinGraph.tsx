"use client";

export default function SinGraph() {
  const width = 600;
  const height = 200;
  const padding = 40;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const amplitude = innerHeight / 2 - 10;
  const scaleX = innerWidth / (4 * Math.PI);

  const pathPoints: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * 4 * Math.PI - 2 * Math.PI;
    const y = Math.sin(x);
    const px = padding + (x + 2 * Math.PI) * scaleX;
    const py = padding + innerHeight / 2 - y * amplitude;
    pathPoints.push(`${px} ${py}`);
  }
  const pathD = `M ${pathPoints.join(" L ")}`;

  return (
    <section className="mt-24 flex w-full max-w-4xl justify-center px-4 sm:px-6">
      <div className="w-full overflow-hidden rounded-lg border border-slate-300 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* x축 */}
          <line
            x1={padding}
            y1={padding + innerHeight / 2}
            x2={width - padding}
            y2={padding + innerHeight / 2}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          {/* y축 */}
          <line
            x1={padding + innerWidth / 2}
            y1={padding}
            x2={padding + innerWidth / 2}
            y2={height - padding}
            stroke="#64748b"
            strokeWidth={1.5}
          />
          <path
            d={pathD}
            fill="none"
            stroke="#475569"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
