import type { ReactNode } from 'react';

const variants = {
  default: 'bg-[#EAF1E9] text-[#245642]',
  warn: 'bg-[#F1E8D9] text-[#826031]',
  danger: 'bg-[#F6E4E1] text-[#A33B32]',
  neutral: 'border border-[#DEDED5] bg-[#F7F6F2] text-[#727970]',
};

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: keyof typeof variants }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${variants[variant]}`}>{children}</span>;
}
