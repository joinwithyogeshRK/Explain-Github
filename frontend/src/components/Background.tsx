export const Background = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
    <div
      className="absolute inset-0 opacity-[0.04] dark:opacity-[0.045]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }}
    />
    <div
      className="absolute -top-[220px] -left-[160px] h-[600px] w-[600px] rounded-full"
      style={{ background: "radial-gradient(circle, var(--orb-a) 0%, transparent 65%)" }}
    />
    <div
      className="absolute -bottom-[250px] -right-[200px] h-[700px] w-[700px] rounded-full"
      style={{ background: "radial-gradient(circle, var(--orb-b) 0%, transparent 65%)" }}
    />
    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
          <path
            d="M 52 0 L 0 0 0 52"
            fill="none"
            stroke="var(--grid-stroke)"
            strokeWidth="0.35"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
)
