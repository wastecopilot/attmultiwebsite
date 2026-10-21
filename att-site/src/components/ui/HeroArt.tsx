/** Original decorative illustration (abstract light strands). Inline SVG: no image request, no layout shift. */
export function HeroArt({ className = "" }: { className?: string }) {
  const strands = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 700 520" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ha-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--att-brand)" stopOpacity="0" />
          <stop offset=".45" stopColor="var(--att-brand)" stopOpacity=".55" />
          <stop offset="1" stopColor="var(--att-brand-strong)" stopOpacity=".15" />
        </linearGradient>
        <radialGradient id="ha-g2" cx=".7" cy=".35" r=".55">
          <stop offset="0" stopColor="var(--att-brand-tint-2)" />
          <stop offset="1" stopColor="var(--att-brand-tint)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="470" cy="190" r="260" fill="url(#ha-g2)" />
      {strands.map((i) => (
        <path
          key={i}
          d={`M${-40 + i * 6} ${460 - i * 14} C ${180 + i * 8} ${360 - i * 22}, ${330 - i * 4} ${120 + i * 9}, ${720} ${60 + i * 26}`}
          stroke="url(#ha-g1)"
          strokeWidth={i % 3 === 0 ? 2.2 : 1.2}
        />
      ))}
      {[
        [410, 168],
        [520, 120],
        [600, 236],
        [350, 262],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="var(--att-brand)" opacity=".75" />
      ))}
    </svg>
  );
}
