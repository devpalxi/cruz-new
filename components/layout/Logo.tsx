export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 84"
      role="img"
      aria-label="Riverside Hotel"
      className={className}
      fontFamily="Georgia, 'Times New Roman', serif"
    >
      <defs>
        <clipPath id="logo-emblem">
          <ellipse cx="100" cy="24" rx="48" ry="22" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="24" rx="48" ry="22" fill="#1f3a6e" />
      <g clipPath="url(#logo-emblem)" fill="none" stroke="#dbe4f3" strokeWidth="1">
        <path d="M52 34c20-8 40-8 60 0s30 4 36-2" />
        <path d="M52 40c20-8 40-8 60 0s30 4 36-2" />
        <path d="M52 46c20-8 40-8 60 0s30 4 36-2" />
      </g>
      <text
        x="100"
        y="27"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="-1"
      >
        RS
      </text>
      <text
        x="100"
        y="63"
        textAnchor="middle"
        fontSize="21"
        fill="#1f3a6e"
        textLength="200"
        lengthAdjust="spacingAndGlyphs"
      >
        RIVERSIDE
      </text>
      <text
        x="100"
        y="74"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#1f3a6e"
        fontFamily="Arial, sans-serif"
        letterSpacing="9"
      >
        HOTEL
      </text>
      <text
        x="100"
        y="82"
        textAnchor="middle"
        fontSize="4"
        fill="#1f3a6e"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.3"
      >
        COME, STAY AND ENJOY YOUR DAY
      </text>
    </svg>
  );
}
