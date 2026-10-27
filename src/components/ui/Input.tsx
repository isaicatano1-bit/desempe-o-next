import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[#222D28]">{label}</span>
      ) : null}

      <input
        className={`w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] placeholder:text-[#727970] transition focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20 ${error ? 'border-[#A33B32] focus:border-[#A33B32] focus:ring-[#A33B32]/15' : ''} ${className}`}
        {...props}
      />

      {error ? <span className="mt-1.5 block text-xs text-[#A33B32]">{error}</span> : null}
    </label>
  );
}
