import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import {
    ArrowUpDown,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Eye,
    Filter,
    Mail,
    RefreshCw,
    Search,
    ShieldCheck,
    UserCog,
    Users,
    X,
    XCircle,
} from "lucide-react";

import { apiFetch } from "../../../api/api";

interface Admin {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    active: boolean;
    createdAt?: string;
}

interface AdminResponse {
    admins: Admin[];
    total: number;
}

interface ApiError {
    message?: string;
}

type StatusFilter = "all" | "active" | "inactive";
type SortKey = "name" | "email" | "createdAt";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

export default function AllAdmins() {
    const navigate = useNavigate();
    const location = useLocation();

    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    const [sortKey, setSortKey] =
        useState<SortKey>("createdAt");

    const [sortDirection, setSortDirection] =
        useState<SortDirection>("desc");

    const [currentPage, setCurrentPage] = useState(1);

    const fetchAdmins = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await apiFetch<AdminResponse>(
                    "/api/admin/all-admins"
                );

            setAdmins(response.admins || []);
        } catch (err) {
            const apiError = err as ApiError;

            setError(
                apiError?.message ||
                    "Failed to load administrators."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const activeCount = useMemo(
        () =>
            admins.filter(
                (admin) => admin.active
            ).length,
        [admins]
    );

    const inactiveCount = useMemo(
        () =>
            admins.filter(
                (admin) => !admin.active
            ).length,
        [admins]
    );

    const filteredAdmins = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        let result = admins.filter((admin) => {
            const matchesSearch =
                !normalizedSearch ||
                admin.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                admin.email
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" &&
                    admin.active) ||
                (statusFilter === "inactive" &&
                    !admin.active);

            return (
                matchesSearch &&
                matchesStatus
            );
        });

        result.sort((a, b) => {
            let comparison = 0;

            if (sortKey === "name") {
                comparison = a.name.localeCompare(
                    b.name
                );
            }

            if (sortKey === "email") {
                comparison = a.email.localeCompare(
                    b.email
                );
            }

            if (sortKey === "createdAt") {
                const aDate = a.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0;

                const bDate = b.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0;

                comparison = aDate - bDate;
            }

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });

        return result;
    }, [
        admins,
        search,
        statusFilter,
        sortKey,
        sortDirection,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredAdmins.length /
                ITEMS_PER_PAGE
        )
    );

    const paginatedAdmins = useMemo(() => {
        const start =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        return filteredAdmins.slice(
            start,
            start + ITEMS_PER_PAGE
        );
    }, [
        filteredAdmins,
        currentPage,
    ]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((current) =>
                current === "asc"
                    ? "desc"
                    : "asc"
            );
            return;
        }

        setSortKey(key);
        setSortDirection("asc");
    };

    /**
     * IMPORTANT:
     * Always resolve the real MongoDB ID first.
     *
     * Previously the code did:
     *
     * const id = admin.id || admin._id;
     * navigate(`/admin/admins/${admin._id}`)
     *
     * If `admin.id` existed but `_id` did not,
     * the URL became:
     *
     * /admin/admins/undefined
     *
     * This version always navigates using the
     * resolved `id`.
     */
    const handleView = (admin: Admin) => {
        const id = admin._id || admin.id;

        if (!id) {
            console.error(
                "Absher Admin: Admin has no ID:",
                admin
            );
            return;
        }

        navigate(`/admin/admins/${id}`, {
            state: {
                from:
                    location.pathname +
                    location.search +
                    location.hash,
            },
        });
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    const hasFilters =
        Boolean(search.trim()) ||
        statusFilter !== "all";

    const formatDate = (
        date?: string
    ) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const formatTime = (
        date?: string
    ) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    if (loading) {
        return (
            <section className="min-h-full w-full bg-[#F3F7F5] px-3 py-5 sm:px-6 lg:px-4 lg:py-3">
                <div className="w-full">
                    <div className="animate-pulse space-y-6">
                        <div className="h-32 rounded-[28px] bg-white" />

                        <div className="h-20 rounded-[24px] bg-white" />

                        <div className="overflow-hidden rounded-[28px] bg-white">
                            <div className="h-16 border-b border-black/[0.05]" />

                            {Array.from({
                                length: 7,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-20 border-b border-black/[0.04]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex min-h-[500px] w-full items-center justify-center bg-[#F3F7F5] px-5">
                <div className="w-full max-w-xl rounded-[30px] border border-red-500/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <CircleAlert
                            size={28}
                        />
                    </div>

                    <h2 className="mt-5 text-xl font-black tracking-tight text-black/85">
                        Unable to load administrators
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-black/45">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            fetchAdmins()
                        }
                        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#197653] px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(25,118,83,0.18)] transition hover:-translate-y-0.5 hover:bg-[#145f43]"
                    >
                        <RefreshCw
                            size={16}
                        />
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-full w-full bg-[#F3F7F5] px-2 py-3 sm:px-3 lg:px-3 lg:py-3">
            <div className="w-full space-y-3">

                {/* =========================================================
                    HEADER
                ========================================================= */}
                <div className="relative overflow-hidden rounded-[30px] border border-black/[0.05] bg-white px-5 py-6 shadow-[0_15px_45px_rgba(0,0,0,0.045)] sm:px-7 lg:px-8 lg:py-7">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#197653]/[0.05] blur-3xl" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#197653]/10 bg-[#E8F4EE] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#197653]">
                                <ShieldCheck
                                    size={13}
                                />
                                Access Management
                            </div>

                            <h1 className="text-2xl font-black tracking-[-0.04em] text-black/90 sm:text-3xl">
                                All Administrators
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-black/45">
                                Manage administrator
                                accounts, monitor
                                access status, and
                                review account
                                information from one
                                centralized workspace.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <StatCard
                                icon={
                                    <Users
                                        size={16}
                                    />
                                }
                                label="Total"
                                value={
                                    admins.length
                                }
                            />

                            <StatCard
                                icon={
                                    <CheckCircle2
                                        size={16}
                                    />
                                }
                                label="Active"
                                value={
                                    activeCount
                                }
                            />

                            <StatCard
                                icon={
                                    <XCircle
                                        size={16}
                                    />
                                }
                                label="Inactive"
                                value={
                                    inactiveCount
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    TOOLBAR
                ========================================================= */}
                <div className="rounded-[26px] border border-black/[0.05] bg-white p-3 shadow-[0_12px_35px_rgba(0,0,0,0.04)] sm:p-4">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Search by name or email..."
                                className="h-12 w-full rounded-2xl border border-black/[0.06] bg-[#F8FAF9] pl-11 pr-4 text-sm font-semibold text-black/80 outline-none transition placeholder:text-black/30 focus:border-[#197653]/25 focus:bg-white focus:ring-4 focus:ring-[#197653]/[0.06]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex h-12 items-center gap-2 rounded-2xl border border-black/[0.06] bg-[#F8FAF9] px-3">
                                <Filter
                                    size={15}
                                    className="text-black/35"
                                />

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event
                                                .target
                                                .value as StatusFilter
                                        )
                                    }
                                    className="cursor-pointer bg-transparent pr-1 text-xs font-black text-black/55 outline-none"
                                >
                                    <option value="all">
                                        All Status
                                    </option>

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="inline-flex h-12 items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 text-xs font-black text-black/45 transition hover:border-red-500/15 hover:bg-red-50 hover:text-red-500"
                                >
                                    <X
                                        size={15}
                                    />
                                    Clear
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    fetchAdmins(
                                        true
                                    )
                                }
                                disabled={
                                    refreshing
                                }
                                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#197653] px-4 text-xs font-black text-white shadow-[0_8px_20px_rgba(25,118,83,0.16)] transition hover:-translate-y-0.5 hover:bg-[#145f43] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={15}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    TABLE
                ========================================================= */}
                <div className="overflow-hidden rounded-[28px] border border-black/[0.05] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.045)]">

                    {/* Table Header */}
                    <div className="hidden border-b border-black/[0.05] bg-[#FAFCFB] px-6 py-4 lg:grid lg:grid-cols-[minmax(250px,1.6fr)_minmax(250px,1.5fr)_150px_160px_100px] lg:items-center lg:gap-4">
                        <SortButton
                            label="Administrator"
                            active={
                                sortKey === "name"
                            }
                            direction={
                                sortDirection
                            }
                            onClick={() =>
                                handleSort(
                                    "name"
                                )
                            }
                        />

                        <SortButton
                            label="Email Address"
                            active={
                                sortKey === "email"
                            }
                            direction={
                                sortDirection
                            }
                            onClick={() =>
                                handleSort(
                                    "email"
                                )
                            }
                        />

                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                            Status
                        </span>

                        <SortButton
                            label="Joined"
                            active={
                                sortKey ===
                                "createdAt"
                            }
                            direction={
                                sortDirection
                            }
                            onClick={() =>
                                handleSort(
                                    "createdAt"
                                )
                            }
                        />

                        <span className="text-right text-[10px] font-black uppercase tracking-[0.15em] text-black/35">
                            Action
                        </span>
                    </div>

                    {/* Empty */}
                    {paginatedAdmins.length ===
                    0 ? (
                        <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F4EE] text-[#197653]">
                                <Search
                                    size={26}
                                />
                            </div>

                            <h3 className="mt-5 text-lg font-black text-black/80">
                                No administrators found
                            </h3>

                            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-black/40">
                                No administrator
                                accounts match your
                                current search or
                                filter.
                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#197653] px-4 text-xs font-black text-white"
                                >
                                    <X
                                        size={14}
                                    />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop rows */}
                            <div className="hidden lg:block">
                                {paginatedAdmins.map(
                                    (
                                        admin,
                                        index
                                    ) => (
                                        <AdminTableRow
                                            key={
                                                admin._id ||
                                                admin.id ||
                                                admin.email
                                            }
                                            admin={
                                                admin
                                            }
                                            index={
                                                index
                                            }
                                            onView={() =>
                                                handleView(
                                                    admin
                                                )
                                            }
                                            formatDate={
                                                formatDate
                                            }
                                            formatTime={
                                                formatTime
                                            }
                                        />
                                    )
                                )}
                            </div>

                            {/* Mobile / Tablet */}
                            <div className="divide-y divide-black/[0.04] lg:hidden">
                                {paginatedAdmins.map(
                                    (
                                        admin
                                    ) => (
                                        <AdminMobileCard
                                            key={
                                                admin._id ||
                                                admin.id ||
                                                admin.email
                                            }
                                            admin={
                                                admin
                                            }
                                            onView={() =>
                                                handleView(
                                                    admin
                                                )
                                            }
                                            formatDate={
                                                formatDate
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {filteredAdmins.length >
                        0 && (
                        <div className="flex flex-col gap-4 border-t border-black/[0.05] bg-[#FAFCFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-xs font-semibold text-black/40">
                                Showing{" "}
                                <span className="font-black text-black/65">
                                    {Math.min(
                                        (currentPage -
                                            1) *
                                            ITEMS_PER_PAGE +
                                            1,
                                        filteredAdmins.length
                                    )}
                                </span>{" "}
                                to{" "}
                                <span className="font-black text-black/65">
                                    {Math.min(
                                        currentPage *
                                            ITEMS_PER_PAGE,
                                        filteredAdmins.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-black text-black/65">
                                    {
                                        filteredAdmins.length
                                    }
                                </span>{" "}
                                administrators
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.max(
                                                    1,
                                                    page -
                                                        1
                                                )
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/45 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <ChevronLeft
                                        size={16}
                                    />
                                </button>

                                <div className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#197653] px-3 text-xs font-black text-white">
                                    {currentPage}
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        currentPage >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                Math.min(
                                                    totalPages,
                                                    page +
                                                        1
                                                )
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/45 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <ChevronRight
                                        size={16}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="min-w-[82px] rounded-2xl border border-black/[0.05] bg-[#FAFCFB] px-3 py-3 sm:min-w-[105px] sm:px-4">
            <div className="flex items-center gap-2 text-[#197653]">
                {icon}

                <span className="hidden text-[9px] font-black uppercase tracking-[0.12em] text-black/35 sm:block">
                    {label}
                </span>
            </div>

            <p className="mt-1.5 text-xl font-black tracking-tight text-black/80">
                {value}
            </p>
        </div>
    );
}

/* =========================================================
   SORT BUTTON
========================================================= */

function SortButton({
    label,
    active,
    direction,
    onClick,
}: {
    label: string;
    active: boolean;
    direction: SortDirection;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group inline-flex items-center gap-2 text-left text-[10px] font-black uppercase tracking-[0.15em] transition ${
                active
                    ? "text-[#197653]"
                    : "text-black/35 hover:text-black/60"
            }`}
        >
            {label}

            <ArrowUpDown
                size={13}
                className={`transition ${
                    active
                        ? "text-[#197653]"
                        : "text-black/20 group-hover:text-black/40"
                } ${
                    active &&
                    direction === "desc"
                        ? "rotate-180"
                        : ""
                }`}
            />
        </button>
    );
}

/* =========================================================
   DESKTOP TABLE ROW
========================================================= */

function AdminTableRow({
    admin,
    index,
    onView,
    formatDate,
    formatTime,
}: {
    admin: Admin;
    index: number;
    onView: () => void;
    formatDate: (
        date?: string
    ) => string;
    formatTime: (
        date?: string
    ) => string;
}) {
    return (
        <div
            className={`grid grid-cols-[minmax(250px,1.6fr)_minmax(250px,1.5fr)_150px_160px_100px] items-center gap-4 border-b border-black/[0.04] px-6 py-4 transition last:border-b-0 hover:bg-[#FAFCFB] ${
                index % 2 === 1
                    ? "bg-black/[0.008]"
                    : "bg-white"
            }`}
        >
            {/* Administrator */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F4EE] text-sm font-black text-[#197653]">
                    {getInitials(
                        admin.name
                    )}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-black text-black/80">
                        {admin.name}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                        <UserCog
                            size={11}
                            className="text-black/25"
                        />

                        <span className="text-[10px] font-semibold text-black/35">
                            Administrator
                        </span>
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="flex min-w-0 items-center gap-2">
                <Mail
                    size={14}
                    className="shrink-0 text-black/25"
                />

                <span className="truncate text-xs font-semibold text-black/55">
                    {admin.email}
                </span>
            </div>

            {/* Status */}
            <div>
                <StatusBadge
                    active={admin.active}
                />
            </div>

            {/* Created */}
            <div>
                <p className="text-xs font-bold text-black/60">
                    {formatDate(
                        admin.createdAt
                    )}
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-black/30">
                    {formatTime(
                        admin.createdAt
                    )}
                </p>
            </div>

            {/* Action */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white px-3 text-[10px] font-black text-black/50 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653]"
                >
                    <Eye size={14} />
                    View
                </button>
            </div>
        </div>
    );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function AdminMobileCard({
    admin,
    onView,
    formatDate,
}: {
    admin: Admin;
    onView: () => void;
    formatDate: (
        date?: string
    ) => string;
}) {
    return (
        <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8F4EE] text-sm font-black text-[#197653]">
                    {getInitials(
                        admin.name
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-black/80">
                                {admin.name}
                            </h3>

                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-black/40">
                                <Mail
                                    size={12}
                                    className="shrink-0"
                                />
                                {admin.email}
                            </p>
                        </div>

                        <StatusBadge
                            active={
                                admin.active
                            }
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t border-black/[0.05] pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-black/25">
                                Created
                            </p>

                            <p className="mt-1 text-xs font-bold text-black/55">
                                {formatDate(
                                    admin.createdAt
                                )}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onView}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 text-xs font-black text-black/50 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653]"
                        >
                            <Eye
                                size={15}
                            />
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
    active,
}: {
    active: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] ${
                active
                    ? "bg-[#E8F4EE] text-[#197653]"
                    : "bg-red-50 text-red-500"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    active
                        ? "bg-[#197653]"
                        : "bg-red-500"
                }`}
            />

            {active
                ? "Active"
                : "Inactive"}
        </span>
    );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(
    name: string
) {
    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "A";
    }

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}