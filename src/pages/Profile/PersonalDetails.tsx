import SubPageHeader from '../../components/SubPageHeader';
import ExpandableSection, { DetailRow } from '../../components/ExpandableSection/ExpandableSection';
import { demoEmployee, demoHajjDetails } from '../../data/demoEmployee';
import { GlobeIcon } from '../../components/icons';

export default function PersonalDetails() {
  const e = demoEmployee;
  return (
    <div className="min-h-full bg-black pb-10">
      <SubPageHeader title="My Personal Details" />
      <div className="flex flex-col gap-3 px-4">
        <ExpandableSection
          defaultOpen
          icon={<img src={e.avatarUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />}
          title="Personal Details"
        >
          <DetailRow label="Name" value={e.name} />
          <DetailRow label="Birth City" value={e.birthCity} />
          <DetailRow label="Birth Country/Region" value={e.birthCountry} />
          <DetailRow label="Date of Birth" value={e.dateOfBirth} />
          <DetailRow label="Marital Status" value={e.maritalStatus} />
          <DetailRow label="No. of sponsorship transfers" value={String(e.sponsorshipTransfers)} />
          <DetailRow label="Religion" value={e.religion} />
          <DetailRow label="Work Permit" value={e.workPermit} />
        </ExpandableSection>

        <ExpandableSection icon={<PersonOutline />} title="Sponsor Details">
          <DetailRow label="Sponsor Name" value={e.sponsorName} />
          <DetailRow label="Sponsor ID Number" value={e.sponsorIdNumber} copyable />
        </ExpandableSection>

        <ExpandableSection icon={<MoonOutline />} title="Health Insurance">
          <p className="py-2 text-sm text-white/50">No active health insurance policy on file.</p>
        </ExpandableSection>

        <ExpandableSection icon={<GlobeIcon width={22} height={22} />} title="Hajj Details">
          <div className="py-2">
            <p className="text-[13px] font-semibold text-white">Hajj Status</p>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-green px-3 py-1.5 text-[13px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {demoHajjDetails.status === 'eligible' ? 'Eligible for Hajj' : 'Not Eligible'}
            </span>
          </div>
          <DetailRow label="Last Hajj Year" value={demoHajjDetails.lastHajjYear} />
        </ExpandableSection>
      </div>
    </div>
  );
}

function PersonOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}
function MoonOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
