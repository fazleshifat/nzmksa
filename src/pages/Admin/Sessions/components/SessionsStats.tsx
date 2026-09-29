import {
    Activity,
    Clock3,
    LogOut,
    ShieldAlert,
    Users,
} from "lucide-react";

import type { SessionsStats as SessionsStatsType } from "../types";

interface SessionsStatsProps {
    stats: SessionsStatsType;
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
}

function StatCard({
    label,
    value,
    icon,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-black/40">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-black text-black">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-black/60">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function SessionsStats({
    stats,
}: SessionsStatsProps) {
    return (
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
                label="Total Sessions"
                value={stats.total}
                icon={<Users size={18} />}
            />

            <StatCard
                label="Active"
                value={stats.active}
                icon={<Activity size={18} />}
            />

            <StatCard
                label="Logged Out"
                value={stats.loggedOut}
                icon={<LogOut size={18} />}
            />

            <StatCard
                label="Expired"
                value={stats.expired}
                icon={<Clock3 size={18} />}
            />

            <StatCard
                label="Revoked"
                value={stats.revoked}
                icon={<ShieldAlert size={18} />}
            />
        </section>
    );
}