export function HeroGeometry() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[460px] rounded-2xl border border-orange-500/20 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.16),rgba(2,6,23,0.65)_58%,rgba(2,6,23,0.98)_100%)]">
      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full text-orange-500/70"
        fill="none"
      >
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
          <g key={idx}>
            <circle cx={cx} cy={cy} r="6.5" fill="rgb(251 146 60)" />
            <circle cx={cx} cy={cy} r="13" fill="rgb(251 146 60)" opacity="0.16" />
          </g>
        ))}
      </svg>

      <div className="absolute right-6 top-14 rounded-md border border-emerald-400/30 bg-slate-900/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
        NODE_ALPHA_READY
      </div>
      <div className="absolute bottom-14 left-6 rounded-md border border-orange-400/30 bg-slate-900/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-orange-300">
        OPTIMIZING_FLUX_CAP
      </div>
    </div>
  );
}
