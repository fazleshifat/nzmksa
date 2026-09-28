import {
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

interface Props {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  loading: boolean;
}

export default function AdminStats({
  totalUsers,
  activeUsers,
  inactiveUsers,
  loading,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        label="Total Employees"
        value={loading ? "—" : totalUsers}
        description="Registered accounts"
        icon={<Users size={21} />}
        iconClass="bg-[#EAF5F0] text-brand-green"
      />

      <StatCard
        label="Active Employees"
        value={loading ? "—" : activeUsers}
        description="Currently enabled"
        icon={<UserCheck size={21} />}
        iconClass="bg-green-50 text-green-600"
      />

      <StatCard
        label="Inactive Employees"
        value={loading ? "—" : inactiveUsers}
        description="Currently disabled"
        icon={<UserX size={21} />}
        iconClass="bg-red-50 text-red-500"
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="group rounded-[26px] border border-black/[0.04] p-5 shadow-[0_30px_35px_rgba(0,1,0,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.055)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          <p className="mt-1 text-[11px] font-medium text-black/35">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
