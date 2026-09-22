import { useState } from 'react';
import SubPageHeader from '../../components/SubPageHeader';
import { DetailRow } from '../../components/ExpandableSection/ExpandableSection';
import { IdCardIcon, CopyIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

export default function ResidentId() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-full bg-black pb-10">
      <SubPageHeader title="" />

      <div className="px-4">
        <div className="rounded-2xl bg-[#2a2a2a] p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-white/80">
              <IdCardIcon width={22} height={22} />
            </span>

            <p className="text-[19px] font-bold text-white">
              My Resident ID
            </p>
          </div>

          <div className="border-t border-white/10" />

          <div className="flex items-start justify-between gap-3 py-2.5">
            <div>
              <p className="text-[13px] font-semibold text-white">
                Resident ID Number
              </p>

              <p className="mt-1 text-[15px] text-white/60">
                {e.residentIdNumber || 'N/A'}
              </p>
            </div>

            {e.residentIdNumber && (
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy"
                  className="group flex h-8 w-8 items-center justify-center rounded-lg text-brand-mint transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <CheckIcon />
                  ) : (
                    <CopyIcon width={18} height={18} />
                  )}

                  {!copied && (
                    <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Copy
                    </span>
                  )}

                  {copied && (
                    <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-black shadow-lg">
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
          />

          <DetailRow
            label="Issuing Date"
            value={e.residentIdIssueDate}
          />

          <DetailRow
            label="Expiry Date"
            value={e.residentIdExpiry}
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