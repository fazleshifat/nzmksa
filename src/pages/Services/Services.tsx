import { useState } from 'react';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import { SearchIcon } from '../../components/icons';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { myServices } from '../../data/serviceData';

export default function Services() {
  const [query, setQuery] = useState('');

  const filtered = myServices.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-full bg-black pb-24 pt-3">
      <NavigationHeader />
      <div className="px-2">
        <p className="mb-4 text-[26px] font-bold text-white">
          My Services
        </p>

        <div className="mb-5 flex items-center gap-2 rounded-full bg-[#3a3a3a] px-4 py-5">
          <span className="text-white/50">
            <SearchIcon width={18} height={18} />
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Service..."
            className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.id}
                variant="dark"
                layout="column"
                className="justify-between"
                icon={<Icon size={26} />}
                label={service.label}
              />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-white">
            No services match your search.
          </p>
        )}
      </div>
    </div>
  );
}