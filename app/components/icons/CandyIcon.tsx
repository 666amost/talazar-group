import * as React from 'react';
export function CandyIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17c-2-2-2-8 0-10 2-2 8-2 10 0 2 2 2 8 0 10-2 2-8 2-10 0Z" fill="none" />
      <path d="M7 7 5 5M17 17l2 2M17 7l2-2M7 17l-2 2" />
      <path d="M9 9c1 .5 2 .5 3 0s2-.5 3 0" />
      <path d="M9 15c1-.5 2-.5 3 0s2 .5 3 0" />
    </svg>
  );
}
