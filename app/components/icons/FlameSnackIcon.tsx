import * as React from 'react';
export function FlameSnackIcon({ className = 'w-6 h-6', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c1 3 4 4 4 7a4 4 0 0 1-8 0c0-1 .2-2 .6-3" />
      <path d="M8 14c-.5 3 1.5 5 4 5s4.5-2 4-5c-.3 1-1.3 2-2.5 2-1.5 0-2.5-1-2.5-2" />
      <path d="M6 20h12" />
    </svg>
  );
}
