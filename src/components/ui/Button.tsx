import type { ButtonHTMLAttributes, ReactNode } from 'react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]';

const variants = {
  primary: 'bg-[#245642] text-white hover:bg-[#1d473a]',
  secondary: 'border border-[#DEDED5] bg-white text-[#222D28] hover:bg-[#F7F6F2]',
  ghost: 'bg-transparent text-[#245642] hover:bg-[#EAF1E9]',
  danger: 'bg-[#A33B32] text-white hover:bg-[#8d312b]',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}
