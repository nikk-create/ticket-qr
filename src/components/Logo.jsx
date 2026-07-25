import React from 'react';

/**
 * TicketQR mark: a rounded hexagon (teal-900) holding a white ticket-stub
 * glyph with a torn corner + fold line, echoing the brand's app icon.
 */
export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="TicketQR"
    >
      <path
        d="M32 2 L58 16.5 V47.5 L32 62 L6 47.5 V16.5 Z"
        fill="#0B4F47"
      />
      <g transform="translate(32 32) rotate(-8) translate(-32 -32)">
        <path
          d="M21 20 H37 L43 26 V41 C43 42.66 41.66 44 40 44 H21 C19.34 44 18 42.66 18 41 V23 C18 21.34 19.34 20 21 20 Z"
          fill="#F7F2E7"
        />
        <path d="M37 20 V26 H43 Z" fill="#0B4F47" opacity="0.18" />
        <line x1="21.5" y1="32" x2="39.5" y2="32" stroke="#0B4F47" strokeWidth="1.6" strokeDasharray="2.4 2.6" />
      </g>
    </svg>
  );
}
