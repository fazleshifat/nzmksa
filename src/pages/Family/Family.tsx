import EmptyState from '../../components/EmptyState';
import NavigationHeader from '../../components/Header/NavigationHeader';
import { SearchIcon, FamilyIcon } from '../../components/icons';

export default function Family() {
  return (
    <div className="min-h-full bg-black pb-20 pt-3">
      <NavigationHeader />

      <div className="px-2">
        <p className="mb-4 text-[26px] font-bold text-white">
          Family
        </p>

        <div className="mb-5 flex items-center gap-2 rounded-full bg-[#3a3a3a] px-4 py-5">
          <span className="text-white/50">
            <SearchIcon width={18} height={18} />
          </span>

          <input
            placeholder="Search by name, ID"
            className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-190px)] items-center justify-center px-4">
        <EmptyState
          icon={<FamilyIcon width={64} height={64} />}
          title="No Family Members"
          description="Once you have family members, they will display here."
        />
      </div>
    </div>
  );
}