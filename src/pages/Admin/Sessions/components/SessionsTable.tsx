import {
    Clock3,
    Eye,
    Monitor,
    Smartphone,
} from "lucide-react";

import type { AdminSession } from "../types";

interface EmployeeRecord {
    _id?: string;
    id?: string;
    name?: string;
    residentIdNumber?: string;
    avatarUrl?: string;
    image?: string;
    [key: string]: unknown;
}

interface SessionsTableProps {
    sessions: AdminSession[];
    employees: EmployeeRecord[];
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
        active: "Logged In",
        logged_out: "Logged Out",
        expired: "Expired",
        revoked: "Revoked",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}

function TypeBadge({
    userType,
}: {
    userType: AdminSession["userType"];
}) {
    const labels = {
        employee: "Employee",
        admin: "Admin",
        superadmin: "Super Admin",
    };

    return (
        <span className="text-xs font-bold text-black/50">
            {labels[userType]}
        </span>
    );
}

export default function SessionsTable({
    sessions,
    employees,
    onSelectSession,
}: SessionsTableProps) {
    if (sessions.length === 0) {
        return null;
    }

    return (
        <div className="hidden overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-black/[0.06] bg-black/[0.015]">
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                User
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Type
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Device
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                IP Address
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Started
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Duration
                            </th>

                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Status
                            </th>

                            <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sessions.map((session) => {
                            const employee =
                                employees.find(
                                    (item) =>
                                        item._id ===
                                            session.userId ||
                                        item.id ===
                                            session.userId ||
                                        item.residentIdNumber ===
                                            session.userId
                                );

                            const avatarUrl =
                                employee?.avatarUrl ||
                                employee?.image;

                            const isMobile =
                                session.device
                                    ?.toLowerCase()
                                    .includes(
                                        "mobile"
                                    );

                            return (
                                <tr
                                    key={session._id}
                                    className="border-b border-black/[0.04] last:border-0 transition hover:bg-black/[0.015]"
                                >
                                    {/* USER */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {avatarUrl ? (
                                                <img
                                                    src={
                                                        avatarUrl
                                                    }
                                                    alt={
                                                        session.name
                                                    }
                                                    className="h-10 w-10 shrink-0 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-sm font-black text-black/40">
                                                    {session.name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-black text-black">
                                                    {
                                                        session.name
                                                    }
                                                </p>

                                                <p className="mt-0.5 truncate text-[11px] font-medium text-black/35">
                                                    Iqama:{" "}
                                                    {employee?.residentIdNumber ||
                                                        session.userId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* TYPE */}
                                    <td className="px-5 py-4">
                                        <TypeBadge
                                            userType={
                                                session.userType
                                            }
                                        />
                                    </td>

                                    {/* DEVICE */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.04] text-black/40">
                                                {isMobile ? (
                                                    <Smartphone
                                                        size={
                                                            15
                                                        }
                                                    />
                                                ) : (
                                                    <Monitor
                                                        size={
                                                            15
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-black/70">
                                                    {
                                                        session.device
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-[10px] font-medium text-black/35">
                                                    {
                                                        session.browser
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* IP */}
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-xs font-medium text-black/55">
                                            {
                                                session.ipAddress
                                            }
                                        </span>
                                    </td>

                                    {/* STARTED */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-black/50">
                                            <Clock3
                                                size={
                                                    13
                                                }
                                            />

                                            {formatDate(
                                                session.createdAt
                                            )}
                                        </div>
                                    </td>

                                    {/* DURATION */}
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-black text-black/65">
                                            {formatDuration(
                                                session.duration
                                            )}
                                        </span>
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            status={
                                                session.status
                                            }
                                        />
                                    </td>

                                    {/* ACTION */}
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectSession(
                                                    session
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white px-3 py-2 text-xs font-black text-black/60 transition hover:bg-black/[0.04] hover:text-black"
                                        >
                                            <Eye
                                                size={14}
                                            />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}