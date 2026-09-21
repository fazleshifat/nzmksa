import { useState, type ReactNode } from 'react';
import { ChevronDown } from '../icons';

interface ExpandableSectionProps {
  icon: ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function ExpandableSection({ icon, title, defaultOpen, children }: ExpandableSectionProps) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl bg-[#2a2a2a]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        <span className="text-white/80">{icon}</span>
        <span className="flex-1 text-[17px] font-bold text-white">{title}</span>
        <span className={`text-white/70 transition-transform ${open ? 'rotate-180' : ''}`}>
          <ChevronDown width={20} height={20} />
        </span>
      </button>
      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">{children}</div>
      )}
    </div>
  );
}

export function DetailRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div>
        <p className="text-[13px] font-semibold text-white">{label}</p>
        <p className="mt-1 text-[15px] text-white/60">{value}</p>
      </div>
      {copyable && (
        <button
          aria-label={`Copy ${label}`}
          className="mt-1 text-brand-mint"
          onClick={() => navigator.clipboard?.writeText(value)}
        >
          <CopyGlyph />
        </button>
      )}
    </div>
  );
}

function CopyGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
  );
}
