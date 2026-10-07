import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import SubPageHeader from '../../components/SubPageHeader';
import ExpandableSection, {
  Accordion,
  DetailRow,
} from '../../components/ExpandableSection/ExpandableSection';
import { useAuth } from '../../context/AuthContext';
import { GlobeIcon } from '../../components/icons';

export default function Passport() {
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');

    
return savedTheme === 'dark' ? 'dark' : 'light';


  });

  const isDark = theme === 'dark';
  const variant = isDark ? 'dark' : 'light';

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('absher_theme');

      
  setTheme(
    savedTheme === 'dark' ? 'dark' : 'light'
  );
};

window.addEventListener(
  'storage',
  handleThemeChange
);

return () => {
  window.removeEventListener(
    'storage',
    handleThemeChange
  );
};


    }, []);

  if (!user) {
    return null;
  }

  const p = user.passport;

  const handleCopy = async () => {
    const passportNumber = p?.passportNumber;

    
if (!passportNumber) {
  return;
}

try {
  await navigator.clipboard.writeText(
    passportNumber
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
} catch (error) {
  console.error(
    'Failed to copy passport number:',
    error
  );
}


  };

  return (
    <div
      className={`min-h-[100vh] pb-10 ${isDark ? 'bg-black' : 'bg-[#F4F8F6]'
        }`}
    > <SubPageHeader title="My Passport" />

      
      <div className="flex flex-col gap-3 px-4">
        {/* Amount Deposit */}
        <div
          className={`rounded-2xl p-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
        >
          <p
            className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-black'
              }`}
          >
            Amount deposit
          </p>

          <p
            className={`mt-1 text-[15px] ${isDark
                ? 'text-white/60'
                : 'text-black/60'
              }`}
          >
            {p?.amountDeposit || 'N/A'}
          </p>
        </div>

        <Accordion defaultOpen="passport">
          <ExpandableSection
            id="passport"
            icon={
              <GlobeIcon
                width={22}
                height={22}
              />
            }
            title="Normal Passport"
            variant={variant}
          >
            {/* Passport Number */}
            <div className="flex items-start justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p
                  className={`text-[13px] font-semibold ${isDark
                      ? 'text-white'
                      : 'text-black'
                    }`}
                >
                  Passport Number
                </p>

                <p
                  className={`mt-1 break-words text-[15px] ${isDark
                      ? 'text-white/60'
                      : 'text-black/60'
                    }`}
                >
                  {p?.passportNumber || 'N/A'}
                </p>
              </div>

              {p?.passportNumber && (
                <div className="group relative mt-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy passport number"
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all active:scale-90 ${isDark
                        ? 'text-brand-mint hover:bg-white/5'
                        : 'text-brand-green hover:bg-black/5'
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

                  {/* Tooltip */}
                  <span
                    className={`pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium shadow-lg transition-all ${isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      } ${copied
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100'
                      }`}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </div>
              )}
            </div>

            <DetailRow
              label="Type"
              value={p?.type}
              variant={variant}
            />

            <DetailRow
              label="Issuing Date"
              value={
                p?.issuingDate
                  ? formatDate(p.issuingDate)
                  : undefined
              }
              variant={variant}
            />

            <DetailRow
              label="Expiry Date"
              value={
                p?.expiryDate
                  ? formatDate(p.expiryDate)
                  : undefined
              }
              variant={variant}
            />

            <DetailRow
              label="Issuing City"
              value={p?.issuingCity}
              variant={variant}
            />

            <DetailRow
              label="Status"
              value={p?.status}
              variant={variant}
            />
          </ExpandableSection>
        </Accordion>
      </div>
    </div>


);
}

function formatDate(date: string) {
const [year, month, day] = date.split('-');

return `${ day } -${ month } -${ year } `;
}
