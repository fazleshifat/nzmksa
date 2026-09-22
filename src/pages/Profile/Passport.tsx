import { useState } from 'react';
import SubPageHeader from '../../components/SubPageHeader';
import ExpandableSection, {
  Accordion,
  DetailRow,
} from '../../components/ExpandableSection/ExpandableSection';
import { useAuth } from '../../context/AuthContext';
import { GlobeIcon, CopyIcon } from '../../components/icons';

export default function Passport() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

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
      await navigator.clipboard.writeText(passportNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy passport number:', error);
    }
  };

  return (
    <div className="min-h-full bg-black pb-10">
      <SubPageHeader title="My Passport" />

      <div className="flex flex-col gap-3 px-4">
        {/* Amount Deposit */}
        <div className="rounded-2xl bg-[#2a2a2a] p-4">
          <p className="text-[13px] font-semibold text-white">
            Amount deposit
          </p>

          <p className="mt-1 text-[15px] text-white/60">
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
          >
            <div className="flex items-start justify-between gap-3 py-2.5">
              <div>
                <p className="text-[13px] font-semibold text-white">
                  Passport Number
                </p>

                <p className="mt-1 text-[15px] text-white/60">
                  {p?.passportNumber || 'N/A'}
                </p>
              </div>

              {p?.passportNumber && (
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy passport number"
                    className="group flex h-8 w-8 items-center justify-center rounded-lg text-brand-mint transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <CheckIcon />
                    ) : (
                      <CopyIcon
                        width={18}
                        height={18}
                      />
                    )}

                    {/* Hover Tooltip */}
                    {!copied && (
                      <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        Copy
                      </span>
                    )}

                    {/* Copied Tooltip */}
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
              label="Type"
              value={p?.type}
            />

            <DetailRow
              label="Issuing Date"
              value={p?.issuingDate}
            />

            <DetailRow
              label="Expiry Date"
              value={p?.expiryDate}
            />

            <DetailRow
              label="Issuing City"
              value={p?.issuingCity}
            />

            <DetailRow
              label="Status"
              value={p?.status}
            />
          </ExpandableSection>
        </Accordion>
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