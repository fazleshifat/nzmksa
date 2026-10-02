import type { ReactNode } from "react";

import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Computer,
    Globe2,
    LogOut,
    MapPin,
    Monitor,
    Shield,
    Timer,
    User,
    X,
} from "lucide-react";

import type { AdminSession } from "../types";
import SessionActions from "./SessionActions";

interface EmployeeRecord {
    _id?: string;
    id?: string;
    name?: string;
    residentIdNumber?: string;
    avatarUrl?: string;
    image?: string;
    [key: string]: unknown;
}

interface SessionDetailsProps {
    session: AdminSession;
    employee?: EmployeeRecord;
    onClose: () => void;
    onForceLogout: (
        session: AdminSession
    ) => Promise<void>;
    onDelete: (
        session: AdminSession
    ) => Promise<void>;
}

function SectionTitle({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <h3 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-black/40">
            {children}
        </h3>
    );
}

function formatDate(value?: string) {
    if (!value) return "—";

    return new Date(value).toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );
}

function formatDuration(
    milliseconds: number
) {
    if (!milliseconds || milliseconds < 0) {
        return "0m";
    }

    const totalSeconds = Math.floor(
        milliseconds / 1000
    );

    const days = Math.floor(
        totalSeconds / 86400
    );

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    if (days > 0) {
        return `${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

function StatusBadge({
    session,
}: {
    session: AdminSession;
}) {
    const config = {
        active: {
            label: "Active",
            className:
                "bg-emerald-50 text-emerald-700",
        },
        logged_out: {
            label: "Logged Out",
            className:
                "bg-slate-100 text-slate-600",
        },
        expired: {
            label: "Expired",
            className:
                "bg-amber-50 text-amber-700",
        },
        revoked: {
            label: "Revoked",
            className:
                "bg-red-50 text-red-700",
        },
    }[session.status];

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${config.className}`}
        >
            {config.label}
        </span>
    );
}

function TypeBadge({
    userType,
}: {
    userType: AdminSession["userType"];
}) {
    const config = {
        employee: {
            label: "Employee",
            className:
                "bg-blue-50 text-blue-700",
        },
        admin: {
            label: "Admin",
            className:
                "bg-violet-50 text-violet-700",
        },
        superadmin: {
            label: "Super Admin",
            className:
                "bg-purple-50 text-purple-700",
        },
    }[userType];

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide ${config.className}`}
        >
            {config.label}
        </span>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof User;
    label: string;
    value?: string | number;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-black/[0.025] p-3">
            <div className="mt-0.5 text-black/40">
                <Icon size={16} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black/35">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-bold text-black/75">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}

export default function SessionDetails({
    session,
    employee,
    onClose,
    onForceLogout,
    onDelete,
}: SessionDetailsProps) {
    const avatar =
        employee?.avatarUrl ||
        employee?.image;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}

            <button
                type="button"
                aria-label="Close session details"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            {/* Drawer */}

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
                            Session Details
                        </p>

                        <h2 className="mt-1 text-lg font-black text-black">
                            {session.name}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] text-black/55 transition hover:bg-black/[0.08]"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Content */}

                <div className="session-details-scrollbar flex-1 overflow-y-auto px-5 py-6">
                    {/* Profile */}

                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#197653]/10">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={session.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User
                                    size={27}
                                    className="text-[#197653]"
                                />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-black text-black">
                                {session.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2">
                                <TypeBadge
                                    userType={
                                        session.userType
                                    }
                                />

                                <StatusBadge
                                    session={session}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Duration */}

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-[#197653]/5 p-4">
                            <div className="flex items-center gap-2 text-[#197653]">
                                <Timer size={16} />

                                <span className="text-[10px] font-black uppercase tracking-wide">
                                    Duration
                                </span>
                            </div>

                            <p className="mt-2 text-lg font-black">
                                {formatDuration(
                                    session.duration
                                )}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-black/[0.025] p-4">
                            <div className="flex items-center gap-2 text-black/45">
                                <Activity size={16} />

                                <span className="text-[10px] font-black uppercase tracking-wide">
                                    Last Active
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-black">
                                {formatDate(
                                    session.lastActiveAt
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Session Information */}

                    <div className="mt-8">
                        <SectionTitle>
                            Session Information
                        </SectionTitle>

                        <div className="grid gap-2">
                            <InfoRow
                                icon={User}
                                label="User ID"
                                value={
                                    session.userId
                                }
                            />

                            <InfoRow
                                icon={Shield}
                                label="Account Type"
                                value={
                                    session.userType
                                }
                            />

                            <InfoRow
                                icon={Computer}
                                label="Device"
                                value={
                                    session.device
                                }
                            />

                            <InfoRow
                                icon={Globe2}
                                label="Browser"
                                value={
                                    session.browser
                                }
                            />

                            <InfoRow
                                icon={Monitor}
                                label="Operating System"
                                value={
                                    session.os
                                }
                            />

                            <InfoRow
                                icon={Globe2}
                                label="IP Address"
                                value={
                                    session.ipAddress
                                }
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Country"
                                value={
                                    session.location
                                        ?.country
                                }
                            />

                            <InfoRow
                                icon={MapPin}
                                label="City"
                                value={
                                    session.location
                                        ?.city
                                }
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Region"
                                value={
                                    session.location
                                        ?.region
                                }
                            />
                        </div>
                    </div>

                    {/* Timeline */}

                    <div className="mt-8">
                        <SectionTitle>
                            Timeline
                        </SectionTitle>

                        <div className="space-y-3">
                            <InfoRow
                                icon={LogOut}
                                label="Login"
                                value={formatDate(
                                    session.createdAt
                                )}
                            />

                            <InfoRow
                                icon={Activity}
                                label="Last Active"
                                value={formatDate(
                                    session.lastActiveAt
                                )}
                            />

                            <InfoRow
                                icon={CalendarDays}
                                label="Expires"
                                value={formatDate(
                                    session.expiresAt
                                )}
                            />

                            {session.loggedOutAt && (
                                <InfoRow
                                    icon={
                                        CheckCircle2
                                    }
                                    label="Logged Out"
                                    value={formatDate(
                                        session.loggedOutAt
                                    )}
                                />
                            )}

                            <InfoRow
                                icon={Clock3}
                                label="Total Duration"
                                value={formatDuration(
                                    session.duration
                                )}
                            />
                        </div>
                    </div>

                    {/* Matched Employee */}

                    {employee && (
                        <div className="mt-8">
                            <SectionTitle>
                                Matched Employee
                            </SectionTitle>

                            <div className="rounded-2xl border border-black/[0.06] p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#197653]/10">
                                        {employee.avatarUrl ||
                                            employee.image ? (
                                            <img
                                                src={
                                                    (employee.avatarUrl ||
                                                        employee.image) as string
                                                }
                                                alt={
                                                    employee.name ||
                                                    session.name
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={
                                                    19
                                                }
                                                className="text-[#197653]"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-black">
                                            {employee.name ||
                                                session.name}
                                        </p>

                                        <p className="mt-0.5 text-xs font-medium text-black/40">
                                            {employee.residentIdNumber ||
                                                "No Resident ID"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}

                    <SessionActions
                        session={session}
                        onForceLogout={onForceLogout}
                        onDelete={onDelete}
                    />
                </div>
            </aside>
        </div>
    );
}