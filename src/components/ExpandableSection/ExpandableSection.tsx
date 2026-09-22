import { createContext, useContext, useState, type ReactNode } from 'react';
import { ChevronDown } from '../icons';

interface AccordionContextType {
  openSection: string | null;
  setOpenSection: (section: string | null) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
}

export function Accordion({
  children,
  defaultOpen,
}: AccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(
    defaultOpen ?? null
  );

  return (
    <AccordionContext.Provider
      value={{
        openSection,
        setOpenSection,
      }}
    >
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface ExpandableSectionProps {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function ExpandableSection({
  id,
  icon,
  title,
  children,
}: ExpandableSectionProps) {
  const context = useContext(AccordionContext);

  const isOpen = context?.openSection === id;

  const handleToggle = () => {
    if (!context) {
      return;
    }

    context.setOpenSection(
      context.openSection === id ? null : id
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-[#2a2a2a]">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        <span className="text-white/80">
          {icon}
        </span>

        <span className="flex-1 text-[17px] font-bold text-white">
          {title}
        </span>

        <span
          className={`text-white/70 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown width={20} height={20} />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value?: string;
  copyable?: boolean;
}

export function DetailRow({
  label,
  value,
  copyable,
}: DetailRowProps) {
  const displayValue = value || 'N/A';

  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div>
        <p className="text-[13px] font-semibold text-white">
          {label}
        </p>

        <p className="mt-1 text-[15px] text-white/60">
          {displayValue}
        </p>
      </div>

      {copyable && (
        <button
          type="button"
          aria-label={`Copy ${label}`}
          className="mt-1 text-brand-mint"
          onClick={() => {
            navigator.clipboard?.writeText(displayValue);
          }}
        >
          <CopyGlyph />
        </button>
      )}
    </div>
  );
}

function CopyGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="1.5"
      />

      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
  );
}