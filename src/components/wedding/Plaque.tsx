/** Ornate cream-and-gold cartouche shown on the closed doors. */
export function Plaque({ label }: { label: string }) {
  const outer =
    "M100 6 C112 6 118 18 128 22 C142 28 160 20 170 34 C180 48 172 62 182 74 C194 88 196 100 190 130 C196 160 194 172 182 186 C172 198 180 212 170 226 C160 240 142 232 128 238 C118 242 112 254 100 254 C88 254 82 242 72 238 C58 232 40 240 30 226 C20 212 28 198 18 186 C6 172 4 160 10 130 C4 100 6 88 18 74 C28 62 20 48 30 34 C40 20 58 28 72 22 C82 18 88 6 100 6 Z";
  const leaf = "M0 0 C-6 -8 -6 -18 0 -26 C6 -18 6 -8 0 0 Z";
  return (
    <svg viewBox="0 0 200 260" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id="pq-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.86 0.08 88)" />
          <stop offset="0.5" stopColor="oklch(0.7 0.095 84)" />
          <stop offset="1" stopColor="oklch(0.58 0.085 78)" />
        </linearGradient>
        <radialGradient id="pq-cream" cx="0.5" cy="0.42" r="0.65">
          <stop offset="0" stopColor="oklch(0.98 0.015 85)" />
          <stop offset="0.75" stopColor="oklch(0.92 0.03 84)" />
          <stop offset="1" stopColor="oklch(0.86 0.04 82)" />
        </radialGradient>
        <radialGradient id="pq-pearl" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="oklch(1 0 0)" />
          <stop offset="1" stopColor="oklch(0.85 0.03 80)" />
        </radialGradient>
      </defs>
      <path d={outer} fill="url(#pq-gold)" />
      <g transform="translate(100 130) scale(0.9) translate(-100 -130)">
        <path d={outer} fill="url(#pq-cream)" />
      </g>
      <g transform="translate(100 130) scale(0.8) translate(-100 -130)">
        <path d={outer} fill="none" stroke="url(#pq-gold)" strokeWidth="1.6" />
      </g>
      {/* Pearls */}
      {[
        [100, 10],
        [100, 250],
        [10, 130],
        [190, 130],
        [86, 14],
        [114, 14],
        [86, 246],
        [114, 246],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i < 4 ? 5 : 3.2} fill="url(#pq-pearl)" stroke="oklch(0.7 0.06 80)" strokeWidth="0.5" />
      ))}
      {/* Fleur motifs */}
      {[
        { y: 86, flip: false },
        { y: 176, flip: true },
      ].map(({ y, flip }) => (
        <g key={y} transform={`translate(100 ${y}) ${flip ? "scale(1 -1)" : ""}`} fill="url(#pq-gold)">
          <path d={leaf} />
          <path d={leaf} transform="rotate(-38)" />
          <path d={leaf} transform="rotate(38)" />
          <rect x="-14" y="2" width="28" height="1.6" rx="0.8" />
        </g>
      ))}
      <text
        x="100"
        y="136"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="13"
        letterSpacing="2"
        fill="oklch(0.45 0.04 90)"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}
