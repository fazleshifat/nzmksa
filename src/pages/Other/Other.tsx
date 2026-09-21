import { useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { otherServices } from '../../data/demoEmployee';
import { SearchIcon } from '../../components/icons';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { MdModeEdit } from 'react-icons/md';

export default function Other() {
  const [query, setQuery] = useState('');

  const filtered = otherServices.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const preferred = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div className="min-h-full bg-black pb-24 pt-3">
      <NavigationHeader />

      <div className="px-2">
        <p className="mb-4 text-[26px] font-bold text-white">
          Other Services
        </p>

        <div className="mb-5 flex items-center gap-2 rounded-full bg-[#3a3a3a] px-4 py-5">
          <span className="text-white/50">
            <SearchIcon width={18} height={18} />
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Service"
            className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {preferred.length > 0 && (
        <div className="bg-brand-green px-2 py-5">
          <p className="mb-3 text-[17px] font-bold text-white">
            Preferred Services
          </p>

          <div className="grid grid-cols-2 gap-3">
            {preferred.map((service) => {
              const Icon = service.icon;

              return (
                <ServiceCard
                  variant="dark"
                  key={service.id}
                  icon={<Icon size={26} />}
                  label={service.label}
                  className="h-full justify-between bg-black/80!"
                />
              );
            })}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 px-2 pt-4">
          {rest.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.id}
                variant="dark"
                icon={<Icon size={26} />}
                label={service.label}
                className="h-full justify-between"
              />
            );
          })}
        </div>
      )}

      <div className='pt-5 pb-10 flex items-center justify-center gap-1 text-gray-500 text-sm font-semibold'>
        <MdModeEdit size={16} />
        <p>Personalise Space</p>
      </div>
    </div>
  );
}