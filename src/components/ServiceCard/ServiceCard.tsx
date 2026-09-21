import type { ReactNode } from 'react';

export default function ServiceCard({
  icon,
  label,
  description,
  onClick,
  layout = 'column',
  variant = 'light',
  className = '',
}: {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  layout?: 'row' | 'column';
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = variant === 'dark';

  const cardBg = isDark ? 'bg-[#3a3a3a]/90' : 'bg-white';
  const titleColor = isDark ? 'text-white' : 'text-black';
  const descriptionColor = isDark ? 'text-white/50' : 'text-black/50';
  const iconColor = isDark ? 'text-green-300' : 'text-brand-green';

  if (layout === 'row') {
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-2xl ${cardBg} p-4 text-left shadow-sm transition-opacity active:opacity-70 ${className}`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
        >
          {icon}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={`text-[15px] font-bold leading-snug ${titleColor}`}
          >
            {label}
          </span>

          {description && (
            <span
              className={`text-[12px] leading-snug ${descriptionColor}`}
            >
              {description}
            </span>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-3 rounded-2xl ${cardBg} p-4 text-left shadow-sm transition-opacity active:opacity-70 ${className}`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}
      >
        {icon}
      </span>

      <span
        className={`text-[15px] font-bold leading-snug ${titleColor}`}
      >
        {label}
      </span>

      {description && (
        <span
          className={`text-[12px] leading-snug ${descriptionColor}`}
        >
          {description}
        </span>
      )}
    </button>
  );
}