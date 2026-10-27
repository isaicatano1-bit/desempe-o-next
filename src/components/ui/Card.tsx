import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[16px] border border-[#DEDED5] bg-white shadow-[0_10px_24px_rgba(22,31,26,0.04)] ${className}`}>{children}</div>;
}
