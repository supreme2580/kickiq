export function WorldCupIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Globe at the top */}
      <circle cx="12" cy="7" r="4" />
      {/* Globe latitude lines */}
      <line x1="8.5" y1="5.5" x2="15.5" y2="5.5" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="8.5" />
      {/* Left figure */}
      <path d="M8 11C8 11 6 14 5 18" />
      <path d="M6.5 12.5C6.5 12.5 4.5 14 4 16" />
      {/* Right figure */}
      <path d="M16 11C16 11 18 14 19 18" />
      <path d="M17.5 12.5C17.5 12.5 19.5 14 20 16" />
      {/* Base/plinth */}
      <rect x="7" y="18" width="10" height="2" rx="0.5" />
      <rect x="9" y="20" width="6" height="1.5" rx="0.3" />
    </svg>
  )
}
