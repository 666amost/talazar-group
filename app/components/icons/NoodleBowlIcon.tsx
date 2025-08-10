import * as React from 'react';
export function NoodleBowlIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h16" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M8 6c2-1 3 0 4 1 1-1 2-2 4-1" />
      <path d="M9 6V4m3 3V4m3 3V4" />
    </svg>
  );
}
