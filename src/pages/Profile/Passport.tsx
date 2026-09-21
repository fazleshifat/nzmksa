import SubPageHeader from '../../components/SubPageHeader';
import ExpandableSection, { DetailRow } from '../../components/ExpandableSection/ExpandableSection';
import { demoPassport } from '../../data/demoEmployee';
import { GlobeIcon, CopyIcon } from '../../components/icons';

export default function Passport() {
  const p = demoPassport;
  return (
    <div className="min-h-full bg-black pb-10">
      <SubPageHeader title="My Passport" />
      <div className="flex flex-col gap-3 px-4">
        <div className="rounded-2xl bg-[#2a2a2a] p-4">
          <p className="text-[13px] font-semibold text-white">Amount deposit</p>
          <p className="mt-1 text-[15px] text-white/60">{p.amountDeposit}</p>
        </div>

        <ExpandableSection defaultOpen icon={<GlobeIcon width={22} height={22} />} title="Normal Passport">
          <div className="flex items-start justify-between py-2.5">
            <div>
              <p className="text-[13px] font-semibold text-white">Passport Number</p>
              <p className="mt-1 text-[15px] text-white/60">{p.passportNumber}</p>
            </div>
            <button className="mt-1 text-brand-mint" onClick={() => navigator.clipboard?.writeText(p.passportNumber)} aria-label="Copy passport number">
              <CopyIcon width={18} height={18} />
            </button>
          </div>
          <DetailRow label="Type" value={p.type} />
          <DetailRow label="Issuing Date" value={p.issuingDate} />
          <DetailRow label="Expiry Date" value={p.expiryDate} />
          <DetailRow label="Issuing City" value={p.issuingCity} />
          <DetailRow label="Status" value={p.status} />
        </ExpandableSection>
      </div>
    </div>
  );
}
