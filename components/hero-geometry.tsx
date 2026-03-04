export function HeroGeometry() {
  return (
    <div className="relative h-[460px] w-full overflow-hidden bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.2),rgba(2,6,23,0.22)_55%,rgba(2,6,23,0)_80%)]">
      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full text-orange-500/70"
        fill="none"
      >
        <defs>
          <radialGradient
            id="heroGlow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(260 260) rotate(90) scale(220)"
          >
            <stop stopColor="#fb923c" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fb923c" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="260" cy="260" rx="180" ry="120" fill="url(#heroGlow)" />

        <circle cx="260" cy="260" r="170" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
        <circle cx="260" cy="260" r="145" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />

        <polygon
          points="260,95 395,175 395,335 260,415 125,335 125,175"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.9"
        />

        <line x1="260" y1="95" x2="260" y2="415" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <line x1="125" y1="175" x2="395" y2="335" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <line x1="395" y1="175" x2="125" y2="335" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <line x1="125" y1="175" x2="395" y2="175" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <line x1="125" y1="335" x2="395" y2="335" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />

        {[
          [260, 95],
          [395, 175],
          [395, 335],
          [260, 415],
          [125, 335],
          [125, 175],
          [260, 260],
        ].map(([cx, cy], idx) => (
          <g key={idx} filter="url(#nodeGlow)">
            <circle cx={cx} cy={cy} r="6.5" fill="rgb(251 146 60)" />
            <circle cx={cx} cy={cy} r="13" fill="rgb(251 146 60)" opacity="0.16" />
          </g>
        ))}
      </svg>

      <div className="absolute right-4 top-14 rounded-md border border-emerald-400/35 bg-slate-900/55 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        NODE_ALPHA_READY
      </div>
      <div className="absolute bottom-14 left-3 rounded-md border border-orange-400/35 bg-slate-900/55 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-orange-300 shadow-[0_0_20px_rgba(251,146,60,0.15)]">
        OPTIMIZING_FLUX_CAP
      </div>
    </div>
  );
}
