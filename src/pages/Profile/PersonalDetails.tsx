import { useEffect, useState } from 'react';
import { Moon, UserRound } from 'lucide-react';

import SubPageHeader from '../../components/SubPageHeader';
import ExpandableSection, {
  Accordion,
  DetailRow,
} from '../../components/ExpandableSection/ExpandableSection';
import { GlobeIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

export default function PersonalDetails() {
  const { user } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('absher_theme') === 'dark'
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const updateTheme = () => {
      setTheme(
        localStorage.getItem('absher_theme') === 'dark'
          ? 'dark'
          : 'light'
      );
    };

    updateTheme();

    window.addEventListener('storage', updateTheme);

    return () => {
      window.removeEventListener('storage', updateTheme);
    };


  }, []);

  const isDark = theme === 'dark';

  const e = user;

  if (!e) {
    return null;
  }

  const hajjDetails = e.hajjDetails;
  const variant = isDark ? 'dark' : 'light';

  return (
    <div
      className={`min-h-[100vh] pb-10 ${isDark ? 'bg-black' : 'bg-[#F4F8F6]'
        }`}
    > <SubPageHeader title="My Personal Details" />

      <div className="px-4">
        <Accordion defaultOpen="personal">
          {/* Personal Details */}
          <ExpandableSection
            id="personal"
            icon={
              <img
                src={e.avatarUrl}
                alt=""
                className="h-9 w-9 rounded-lg object-cover"
              />
            }
            title="Personal Details"
            variant={variant}
          >
            <DetailRow
              label="Name"
              value={e.name}
              variant={variant}
            />

            <DetailRow
              label="Birth City"
              value={e.birthCity}
              variant={variant}
            />

            <DetailRow
              label="Birth Country/Region"
              value={e.birthCountry}
              variant={variant}
            />

            <DetailRow
              label="Date of Birth"
              value={
                e.dateOfBirth
                  ? formatDate(e.dateOfBirth)
                  : undefined
              }
              variant={variant}
            />

            <DetailRow
              label="Marital Status"
              value={e.maritalStatus}
              variant={variant}
            />

            <DetailRow
              label="No. of sponsorship transfers"
              value={
                e.sponsorshipTransfers !== undefined
                  ? String(e.sponsorshipTransfers)
                  : undefined
              }
              variant={variant}
            />

            <DetailRow
              label="Religion"
              value={e.religion}
              variant={variant}
            />

            <DetailRow
              label="Work Permit"
              value={e.workPermit}
              variant={variant}
            />
          </ExpandableSection>

          {/* Sponsor Details */}
          <ExpandableSection
            id="sponsor"
            icon={<UserRound size={22} strokeWidth={1.6} />}
            title="Sponsor Details"
            variant={variant}
          >
            <DetailRow
              label="Sponsor Name"
              value={e.sponsorName}
              copyable
              variant={variant}
            />

            <DetailRow
              label="Sponsor ID Number"
              value={e.sponsorIdNumber}
              copyable
              variant={variant}
            />
          </ExpandableSection>

          {/* Health Insurance */}
          <ExpandableSection
            id="health"
            icon={<Moon size={22} strokeWidth={1.6} />}
            title="Health Insurance"
            variant={variant}

          >

            <DetailRow
              label="Issuing Date"
              value={
                e.healthInsurance?.issuingDate
                  ? formatDate(e.healthInsurance.issuingDate)
                  : undefined
              }
              variant={variant}
            />

            <DetailRow
              label="Expiry Date"
              value={
                e.healthInsurance?.expiryDate
                  ? formatDate(e.healthInsurance.expiryDate)
                  : undefined
              }
              variant={variant}
            /> </ExpandableSection>


          {/* Hajj Details */}
          <ExpandableSection
            id="hajj"
            icon={
              <GlobeIcon
                width={22}
                height={22}
              />
            }
            title="Hajj Details"
            variant={variant}
          >
            <div className="py-2">
              <p
                className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-black'
                  }`}
              >
                Hajj Status
              </p>

              <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-green px-3 py-1.5 text-[13px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />

                {hajjDetails?.status === 'eligible'
                  ? 'Eligible for Hajj'
                  : 'Not Eligible'}
              </span>
            </div>

            <DetailRow
              label="Last Hajj Year"
              value={hajjDetails?.lastHajjYear}
              variant={variant}
            />
          </ExpandableSection>
        </Accordion>
      </div>
    </div>

  );
}

function formatDate(date: string) {
  if (!date) return '';

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    return date;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [day, month, year] = date.split('/');
    return `${day}-${month}-${year}`;
  }

  // DD Mon YYYY
  // Example: 08 Jul 2026
  if (/^\d{2}\s[A-Za-z]{3}\s\d{4}$/.test(date)) {
    const [day, monthName, year] = date.split(' ');

    const months: Record<string, string> = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    const month = months[monthName];

    if (month) {
      return `${day}-${month}-${year}`;
    }
  }

  // Unknown format — return original value instead of
  // producing undefined-undefined-...
  return date;
}
