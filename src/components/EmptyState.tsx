import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-10 text-center text-white/70">
      <div className="mb-5 text-white/60">{icon}</div>
      <p className="mb-2 text-lg font-bold text-white">{title}</p>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
    </div>
  );
}
