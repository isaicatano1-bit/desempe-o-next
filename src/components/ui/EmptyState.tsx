import type { ReactNode } from 'react';

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-white p-6 text-center shadow-[0_10px_24px_rgba(22,31,26,0.02)]">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">•</div>
      <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">{title}</h3>
      <p className="mt-2 text-sm text-[#727970]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
