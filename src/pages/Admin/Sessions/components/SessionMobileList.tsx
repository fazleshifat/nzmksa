import {
    Clock3,
    Eye,
    Monitor,
    Smartphone,
} from "lucide-react";

import type { AdminSession } from "../types";

interface SessionMobileListProps {
    sessions: AdminSession[];
    onSelectSession: (
        session: AdminSession
    ) => void;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString();
}

function formatDuration(seconds: number) {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
        return remainingMinutes > 0
            ? `${hours}h ${remainingMinutes}m`
            : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return remainingHours > 0
        ? `${days}d ${remainingHours}h`
        : `${days}d`;
}

function StatusBadge({
    status,
}: {
    status: AdminSession["status"];
}) {
    const styles = {
        active:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
        logged_out:
            "bg-blue-50 text-blue-700 border-blue-200",
        expired:
            "bg-amber-50 text-amber-700 border-amber-200",
        revoked:
            "bg-red-50 text-red-700 border-red-200",
    };

    const labels = {
        active: "Active",
        logged_out: "Logged Out",
        expired: "Expired",
        revoked: "Revoked",
    };

    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}

function getUserTypeLabel(
    userType: AdminSession["userType"]
) {
    if (userType === "superadmin") {
        return "Super Admin";
    }

    if (userType === "admin") {
        return "Admin";
    }

    return "Employee";
}

export default function SessionMobileList({
    sessions,
    onSelectSession,
}: SessionMobileListProps) {
    if (sessions.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 md:hidden">
            {sessions.map((session) => {
                const isMobile =
                    session.device
                        ?.toLowerCase()
                        .includes("mobile");

                return (
                    <div
                        key={session._id}
                        className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-black/45">
                                    {isMobile ? (
                                        <Smartphone
                                            size={17}
                                        />
                                    ) : (
                                        <Monitor
                                            size={17}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-black">
                                        {session.name}
                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] font-medium text-black/35">
                                        {session.userId}
                                    </p>
                                </div>
                            </div>

                            <StatusBadge
                                status={session.status}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-black/[0.025] p-3">
                                <p className="text-[9px] font-black uppercase tracking-wider text-black/35">
                                    Type
                                </p>

                                <p className="mt-1 text-xs font-bold text-black/70">
                                    {getUserTypeLabel(
                                        session.userType
                                    )}
                                </p>
                            </div>

                            <div className="rounded-xl bg-black/[0.025] p-3">
                                <p className="text-[9px] font-black uppercase tracking-wider text-black/35">
                                    Device
                                </p>

                                <p className="mt-1 truncate text-xs font-bold text-black/70">
                                    {session.device}
                                </p>
                            </div>

                            <div className="rounded-xl bg-black/[0.025] p-3">
                                <p className="text-[9px] font-black uppercase tracking-wider text-black/35">
                                    IP Address
                                </p>

                                <p className="mt-1 truncate font-mono text-[11px] font-medium text-black/60">
                                    {session.ipAddress}
                                </p>
                            </div>

                            <div className="rounded-xl bg-black/[0.025] p-3">
                                <p className="text-[9px] font-black uppercase tracking-wider text-black/35">
                                    Duration
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs font-black text-black/70">
                                    <Clock3
                                        size={12}
                                    />
                                    {formatDuration(
                                        session.duration
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="truncate text-[10px] font-medium text-black/35">
                                Started:{" "}
                                {formatDate(
                                    session.createdAt
                                )}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    onSelectSession(
                                        session
                                    )
                                }
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white px-3 py-2 text-xs font-black text-black/60 transition hover:bg-black/[0.04] hover:text-black"
                            >
                                <Eye size={14} />
                                View
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}