import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  description,
  variant = 'dark',
}: {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center px-10 text-center ${isDark
          ? 'text-white/70'
          : 'text-black/70'
        }`}
    >
      <div
        className={`mb-5 ${isDark
            ? 'text-white/60'
            : 'text-black/60'
          }`}
      >
        {icon}
      </div>

      <p
        className={`mb-2 text-lg font-bold ${isDark
            ? 'text-white'
            : 'text-black'
          }`}
      >
        {title}
      </p>

      <p
        className={`text-sm leading-relaxed ${isDark
            ? 'text-white/50'
            : 'text-black/50'
          }`}
      >
        {description}
      </p>
    </div>
  );
}
