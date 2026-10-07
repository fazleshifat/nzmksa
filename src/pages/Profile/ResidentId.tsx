import { useEffect, useState } from 'react';
import SubPageHeader from '../../components/SubPageHeader';
import { DetailRow } from '../../components/ExpandableSection/ExpandableSection';
import { IdCardIcon, CopyIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

export default function ResidentId() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('absher_theme');

    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('absher_theme');

      setTheme(savedTheme === 'dark' ? 'dark' : 'light');
    };

    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const e = user;

  if (!e) {
    return null;
  }

  const handleCopy = async () => {
    const residentIdNumber = e.residentIdNumber;

    if (!residentIdNumber) return;

    try {
      await navigator.clipboard.writeText(residentIdNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy resident ID number:', error);
    }
  };

  return (
    <div
      className={`min-h-[100vh] pb-10 ${isDark ? 'bg-black' : 'bg-[#F4F8F6]'
        }`}
    >
      <SubPageHeader title="" />

      <div className="px-4">
        <div
          className={`rounded-2xl p-4 ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'
            }`}
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              className={
                isDark ? 'text-white/80' : 'text-black/70'
              }
            >
              <IdCardIcon width={22} height={22} />
            </span>

            <p
              className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-black'
                }`}
            >
              My Resident ID
            </p>
          </div>

          <div
            className={`border-t ${isDark ? 'border-white/10' : 'border-black/10'
              }`}
          />

          <div className="flex items-start justify-between gap-3 py-2.5">
            <div>
              <p
                className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-black'
                  }`}
              >
                Resident ID Number
              </p>

              <p
                className={`mt-1 text-[15px] ${isDark ? 'text-white/60' : 'text-black/60'
                  }`}
              >
                {e.residentIdNumber || 'N/A'}
              </p>
            </div>

            {e.residentIdNumber && (
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy"
                  className={`group flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all active:scale-95 ${isDark
                    ? 'text-brand-mint hover:bg-white/5'
                    : 'text-brand-green hover:bg-black/5'
                    }`}
                >
                  {copied ? (
                    <CheckIcon />
                  ) : (
                    <CopyIcon width={18} height={18} />
                  )}

                  {!copied && (
                    <span
                      className={`pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium opacity-0 shadow-lg transition-opacity group-hover:opacity-100 ${isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                        }`}
                    >
                      Copy
                    </span>
                  )}

                  {copied && (
                    <span
                      className={`pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-medium shadow-lg ${isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                        }`}
                    >
                      Copied
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          <DetailRow
            label="ID Version"
            value={e.idVersion}
            variant={isDark ? 'dark' : 'light'}
          />

          <DetailRow
            label="Issuing Date"
            value={
              e.residentIdIssueDate
                ? formatDate(e.residentIdIssueDate)
                : undefined
            }
            variant={isDark ? 'dark' : 'light'}
          />

          <DetailRow
            label="Expiry Date"
            value={
              e.residentIdExpiry
                ? formatDate(e.residentIdExpiry)
                : undefined
            }
            variant={isDark ? 'dark' : 'light'}
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4 4L19 7" />
    </svg>
  );
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-');

  return `${day}-${month}-${year}`;
}
