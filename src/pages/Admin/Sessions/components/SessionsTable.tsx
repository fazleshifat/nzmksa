import {
    Clock3,
    ChevronLeft,
    ChevronRight,
    Eye,
    Monitor,
    Smartphone,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

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

const SESSIONS_PER_PAGE = 20;

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString();
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
    const [currentPage, setCurrentPage] =
        useState(1);

    // ============================================================
    // TOTAL PAGES
    // ============================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            sessions.length / SESSIONS_PER_PAGE
        )
    );

    // ============================================================
    // RESET PAGE WHEN THE SESSION SET CHANGES
    // ============================================================

    const sessionIds = useMemo(
        () =>
            sessions
                .map((session) => session._id)
                .join(","),
        [sessions]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [sessionIds]);

    // ============================================================
    // KEEP CURRENT PAGE VALID
    // ============================================================

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    // ============================================================
    // PAGINATED SESSIONS
    // ============================================================

    const paginatedSessions = useMemo(() => {
        const startIndex =
            (currentPage - 1) *
            SESSIONS_PER_PAGE;

        return sessions.slice(
            startIndex,
            startIndex + SESSIONS_PER_PAGE
        );
    }, [sessions, currentPage]);

    // ============================================================
    // EMPTY STATE
    // ============================================================

    if (sessions.length === 0) {
        return null;
    }

    // ============================================================
    // DISPLAY RANGE
    // ============================================================

    const startRecord =
        (currentPage - 1) *
            SESSIONS_PER_PAGE +
        1;

    const endRecord = Math.min(
        currentPage * SESSIONS_PER_PAGE,
        sessions.length
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">

            {/* ==================================================
                DESKTOP TABLE
            ================================================== */}

            <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[900px]">

                    {/* ==================================================
                        TABLE HEADER
                    ================================================== */}

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

                    {/* ==================================================
                        TABLE BODY
                    ================================================== */}

                    <tbody>

                        {paginatedSessions.map(
                            (session) => {
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
                                        key={
                                            session._id
                                        }
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
                                                            session.name ||
                                                            "User"
                                                        }
                                                        className="h-10 w-10 shrink-0 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-sm font-black text-black/40">

                                                        {session.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase() ||
                                                            "?"}

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
                                                    size={
                                                        14
                                                    }
                                                />

                                                View

                                            </button>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t border-black/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* RECORD COUNT */}

                    <p className="text-xs font-semibold text-black/40">

                        Showing{" "}

                        <span className="font-black text-black/65">
                            {startRecord}
                        </span>

                        {" "}to{" "}

                        <span className="font-black text-black/65">
                            {endRecord}
                        </span>

                        {" "}of{" "}

                        <span className="font-black text-black/65">
                            {sessions.length}
                        </span>

                        {" "}sessions

                    </p>

                    {/* PAGINATION */}

                    <div className="flex items-center justify-center gap-1.5">

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.max(
                                            1,
                                            page - 1
                                        )
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/50 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Previous page"
                        >
                            <ChevronLeft
                                size={16}
                            />
                        </button>

                        {/* PAGE NUMBERS */}

                        {Array.from(
                            {
                                length: totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        page
                                    )
                                }
                                className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-black transition ${
                                    currentPage ===
                                    page
                                        ? "bg-black text-white shadow-sm"
                                        : "border border-black/10 bg-white text-black/50 hover:bg-black/5"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* NEXT */}

                        <button
                            type="button"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        Math.min(
                                            totalPages,
                                            page + 1
                                        )
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/50 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Next page"
                        >
                            <ChevronRight
                                size={16}
                            />
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}