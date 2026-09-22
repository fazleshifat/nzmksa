import SubPageHeader from '../../components/SubPageHeader';
import { DetailRow } from '../../components/ExpandableSection/ExpandableSection';
import { IdCardIcon, CopyIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

export default function ResidentId() {
  const { employee } = useAuth();

  const e = employee;

  if (!e) {
    return null;
  }

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

          <div className="flex items-start justify-between py-2.5">
            <div>
              <p className="text-[13px] font-semibold text-white">
                Resident ID Number
              </p>

              <p className="mt-1 text-[15px] text-white/60">
                {e.residentIdNumber}
              </p>
            </div>

            <button
              className="mt-1 text-brand-mint"
              onClick={() =>
                navigator.clipboard?.writeText(
                  e.residentIdNumber
                )
              }
              aria-label="Copy resident ID number"
            >
              <CopyIcon width={18} height={18} />
            </button>
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