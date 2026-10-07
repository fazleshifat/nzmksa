import {
createContext,
useContext,
useState,
type ReactNode,
} from 'react';

import {
Check,
ChevronDown,
Copy,
} from 'lucide-react';

interface AccordionContextType {
openSection: string | null;
setOpenSection: (section: string | null) => void;
}

const AccordionContext =
createContext<AccordionContextType | null>(null);

interface AccordionProps {
children: ReactNode;
defaultOpen?: string;
}

export function Accordion({
children,
defaultOpen,
}: AccordionProps) {
const [openSection, setOpenSection] =
useState<string | null>(defaultOpen ?? null);

return (
<AccordionContext.Provider
value={{
openSection,
setOpenSection,
}}
> <div className="flex flex-col gap-3">
{children} </div>
</AccordionContext.Provider>
);
}

interface ExpandableSectionProps {
id: string;
icon: ReactNode;
title: string;
children: ReactNode;
variant?: 'light' | 'dark';
}

export default function ExpandableSection({
id,
icon,
title,
children,
variant = 'dark',
}: ExpandableSectionProps) {
const context = useContext(AccordionContext);

const isOpen = context?.openSection === id;
const isDark = variant === 'dark';

const handleToggle = () => {
if (!context) {
return;
}


context.setOpenSection(
  context.openSection === id ? null : id
);


};

return (
<div
className={`overflow-hidden rounded-2xl ${
        isDark ? 'bg-[#2a2a2a]' : 'bg-white'
      }`}
> <button
     type="button"
     onClick={handleToggle}
     className="flex w-full items-center gap-3 px-4 py-4 text-left"
   >
<span
className={
isDark ? 'text-white/80' : 'text-black/70'
}
>
{icon} </span>


    <span
      className={`flex-1 text-[17px] font-bold ${
        isDark ? 'text-white' : 'text-black'
      }`}
    >
      {title}
    </span>

    <span
      className={`transition-transform ${
        isDark ? 'text-white/70' : 'text-black/60'
      } ${isOpen ? 'rotate-180' : ''}`}
    >
      <ChevronDown
        width={20}
        height={20}
      />
    </span>
  </button>

  {isOpen && (
    <div
      className={`border-t px-4 pb-4 pt-3 ${
        isDark
          ? 'border-white/10'
          : 'border-black/10'
      }`}
    >
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
variant?: 'light' | 'dark';
}

export function DetailRow({
label,
value,
copyable = false,
variant = 'dark',
}: DetailRowProps) {
const [copied, setCopied] = useState(false);

const isDark = variant === 'dark';
const displayValue = value || 'N/A';

const handleCopy = async () => {
if (!value) {
return;
}


try {
  await navigator.clipboard.writeText(value);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 1500);
} catch (error) {
  console.error(
    'Failed to copy text:',
    error
  );
}

};

return ( <div className="flex items-start justify-between gap-3 py-2.5"> <div className="min-w-0">
<p
className={`text-[13px] font-semibold ${
            isDark ? 'text-white' : 'text-black'
          }`}
>
{label} </p>

    <p
      className={`mt-1 break-words text-[15px] ${
        isDark
          ? 'text-white/60'
          : 'text-black/60'
      }`}
    >
      {displayValue}
    </p>
  </div>

  {copyable && (
    <div className="group relative mt-1 shrink-0">
      <button
        type="button"
        aria-label={
          copied
            ? `${label} copied`
            : `Copy ${label}`
        }
        disabled={!value}
        onClick={handleCopy}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          value
            ? isDark
              ? 'text-brand-mint active:scale-90'
              : 'text-brand-green active:scale-90'
            : isDark
              ? 'cursor-not-allowed text-white/20'
              : 'cursor-not-allowed text-black/20'
        }`}
      >
        {copied ? (
          <Check
            size={18}
            strokeWidth={1.8}
          />
        ) : (
          <Copy
            size={18}
            strokeWidth={1.6}
          />
        )}
      </button>

      {/* Desktop hover tooltip + mobile click feedback */}
      <span
        className={`pointer-events-none absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium shadow-lg transition-all ${
          isDark
            ? 'bg-white text-black'
            : 'bg-black text-white'
        } ${
          copied
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100'
        }`}
      >
        {copied ? 'Copied' : 'Copy'}
      </span>
    </div>
  )}
</div>

);
}
