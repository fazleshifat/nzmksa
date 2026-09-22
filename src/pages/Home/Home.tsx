import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import IqamaViewer from '../../components/IqamaViewer/IqamaViewer';
import { GiPistolGun, GiPoliceCar } from 'react-icons/gi';
import { FaCar, FaMap } from 'react-icons/fa';
import { IoFingerPrintSharp } from 'react-icons/io5';
import { RxAvatar } from 'react-icons/rx';
import { AiFillMessage } from 'react-icons/ai';
import HomeHeader from '../../components/Header/HomeHeader';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  const e = user;

  if (!e) {
    return null;
  }

  return (
    <div className="min-h-full bg-[#F4F8F6] pb-14">
      <div className="bg-green-50/25 pb-12">
        <HomeHeader showSearch />
      </div>

      <div className="-mt-15 mb-6 px-4">
        <button
          onClick={() => navigate('/profile')}
          className="min-w-full flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm active:opacity-80"
        >
          <img
            src={e.avatarUrl}
            alt={e.name}
            className="h-14 w-14 rounded-xl object-cover"
          />

          <div>
            <p className="text-[17px] font-bold text-black">
              {e.name}
            </p>

            <p className="text-sm text-black">
              ID No.: {e.residentIdNumber}
            </p>
          </div>
        </button>
      </div>

      <div className="px-4">
        <div className="flex gap-4 rounded-2xl bg-green-700/25 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-900/80 text-white">
            <AiFillMessage size={25} />
          </div>

          <div className="flex min-h-10 flex-1 flex-col">
            <p className="text-[15px] font-bold text-black/90">
              Take a Quick Survey
            </p>

            <p className="text-[13px] leading-relaxed text-green-900">
              Share your experience with Absher to help us improve.
            </p>

            <button
              type="button"
              className="mt-2 self-end text-[13px] font-bold text-green-800"
            >
              Start Survey
            </button>
          </div>
        </div>

        <div className="pt-6">
          <p className="mb-3 text-[19px] font-bold text-black">
            My Digital Documents
          </p>

          <button
            onClick={() => {
              setViewerOpen(true);

              window.dispatchEvent(
                new CustomEvent('absher-iqama-open')
              );
            }}
            className="w-full overflow-hidden rounded-2xl bg-white transition-transform"
            aria-label="Open Resident ID document viewer"
          >
            <img
              src={user?.iqamaImage}
              alt="Iqama ID"
              className="w-full min-h-30 object-contain"
            />
          </button>
        </div>
      </div>

      <div className="bg-green-100 mt-8 p-4 pb-12">
        <p className="mb-4 text-[19px] font-bold text-black">
          Quick Access
        </p>

        <ServiceCard
          layout="row"
          icon={<FaCar size={24} />}
          label="My Vehicles"
          description="View details, renew documents, report accidents and much more."
          onClick={() => navigate('/services')}
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <ServiceCard
            icon={<IoFingerPrintSharp size={24} />}
            label="Authentication Services"
            onClick={() => navigate('/services')}
          />

          <ServiceCard
            icon={<FaMap size={24} />}
            label="Abshser Travel"
            onClick={() => navigate('/other')}
            className="justify-between"
          />

          <ServiceCard
            icon={<GiPoliceCar size={24} />}
            label="Report Minor Accident"
            onClick={() => navigate('/other')}
          />

          <ServiceCard
            icon={<RxAvatar size={24} />}
            label="Update Resident Photo"
            onClick={() => navigate('/other')}
          />
        </div>

        <ServiceCard
          layout="row"
          className="mt-5"
          icon={<GiPistolGun size={24} />}
          label="My Weapons"
          description="View weapons details, issue and view carry permints."
          onClick={() => navigate('/other')}
        />
      </div>

      <IqamaViewer
        open={viewerOpen}
        onClose={() => {
          setViewerOpen(false);

          window.dispatchEvent(
            new CustomEvent('absher-iqama-close')
          );
        }}
      />
    </div>
  );
}