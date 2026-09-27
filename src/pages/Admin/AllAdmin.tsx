import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Mail,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    Users,
    X,
    Eye,
} from "lucide-react";

import { apiFetch } from "../../api/api";

interface Admin {
    id?: string;
    _id?: string;

    name: string;
    email: string;
    active: boolean;
    createdAt?: string;
}

interface AdminsResponse {
    admins: Admin[];
    total?: number;
}

const ADMINS_PER_PAGE = 10;

const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

export default function AllAdmins() {
    const navigate = useNavigate();

    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAdmins = async () => {
        try {
            setError("");

            const response = await apiFetch<AdminsResponse>(
                "/api/admin/all-admins"
            );

            setAdmins(response.admins || []);
        } catch (err) {
            console.error(
                "ABSher Admin: Failed to load admins:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load administrators."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const filteredAdmins = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return admins;
        }

        return admins.filter((admin) => {
            const name = String(admin.name || "").toLowerCase();
            const email = String(admin.email || "").toLowerCase();

            return (
                name.includes(query) ||
                email.includes(query)
            );
        });
    }, [admins, search]);

    const totalAdmins = admins.length;

    const activeAdmins = admins.filter(
        (admin) => admin.active
    ).length;

    const inactiveAdmins = totalAdmins - activeAdmins;

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredAdmins.length / ADMINS_PER_PAGE
        )
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedAdmins = useMemo(() => {
        const startIndex =
            (currentPage - 1) * ADMINS_PER_PAGE;

        return filteredAdmins.slice(
            startIndex,
            startIndex + ADMINS_PER_PAGE
        );
    }, [filteredAdmins, currentPage]);

    const firstItem =
        filteredAdmins.length === 0
            ? 0
            : (currentPage - 1) * ADMINS_PER_PAGE + 1;

    const lastItem = Math.min(
        currentPage * ADMINS_PER_PAGE,
        filteredAdmins.length
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAdmins();
    };

    const handleView = (admin: Admin) => {
        const id = admin.id || admin._id;

        if (!id) {
            console.error(
                "ABSher Admin: Admin has no ID:",
                admin
            );
            return;
        }

        navigate(`/admin/admins/${id}`);
    };

    const handleEdit = (admin: Admin) => {
        const id = admin.id || admin._id;

        if (!id) {
            console.error(
                "ABSher Admin: Admin has no ID:",
                admin
            );
            return;
        }

        navigate(`/admin/admins/${id}/edit`);
    };

    return (
        <section className="min-h-full bg-[#F3F7F5] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-[1700px]">

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <div className="mb-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

                        {/* LEFT */}
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E7F4EE] text-[#197653]">
                                    <ShieldCheck size={16} />
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#197653]">
                                    Access Management
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-[#101815] sm:text-3xl">
                                All Administrators
                            </h1>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/45">
                                Manage administrator accounts, access
                                status and account information from one
                                place.
                            </p>
                        </div>

                        {/* RIGHT STATS */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">

                            <MiniStat
                                label="Total"
                                value={totalAdmins}
                                icon={<Users size={15} />}
                            />

                            <MiniStat
                                label="Active"
                                value={activeAdmins}
                                icon={<Activity size={15} />}
                            />

                            <MiniStat
                                label="Inactive"
                                value={inactiveAdmins}
                                icon={<UserRound size={15} />}
                            />

                        </div>
                    </div>
                </div>

                {/* =====================================================
                    SEARCH / ACTION BAR
                ====================================================== */}
                <div className="mb-5 rounded-2xl border border-black/[0.05] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.025)] sm:p-4">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* SEARCH */}
                        <div className="relative w-full lg:max-w-[520px]">
                            <Search
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search administrator by name or email..."
                                className="h-12 w-full rounded-xl border border-black/[0.06] bg-[#FAFCFB] pl-11 pr-11 text-sm font-medium text-black outline-none transition placeholder:text-black/25 focus:border-[#197653]/30 focus:bg-white focus:ring-4 focus:ring-[#197653]/5"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/30 transition hover:bg-black/5 hover:text-black/60"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* REFRESH */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/[0.06] bg-white px-5 text-xs font-black text-black/60 transition hover:border-[#197653]/20 hover:bg-[#F8FBF9] hover:text-[#197653] disabled:cursor-not-allowed disabled:opacity-50"
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

                {/* =====================================================
                    ERROR
                ====================================================== */}
                {error && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                                <ShieldCheck size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-black text-red-700">
                                    Failed to load administrators
                                </p>

                                <p className="mt-1 text-xs leading-5 text-red-600/70">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={fetchAdmins}
                                    className="mt-2 text-xs font-black text-red-700 underline underline-offset-2"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =====================================================
                    TABLE CARD
                ====================================================== */}
                <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.035)]">

                    {/* TABLE HEADER */}
                    <div className="flex flex-col gap-2 border-b border-black/[0.05] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        <div>
                            <h2 className="text-base font-black text-[#101815]">
                                Administrator Accounts
                            </h2>

                            <p className="mt-1 text-xs text-black/35">
                                {filteredAdmins.length === 0
                                    ? "No administrator records"
                                    : `Showing ${firstItem}–${lastItem} of ${filteredAdmins.length} administrators`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-[#E8F4EE] px-3 py-2">
                            <ShieldCheck
                                size={14}
                                className="text-[#197653]"
                            />

                            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#197653]">
                                Admin Access
                            </span>
                        </div>
                    </div>

                    {/* LOADING */}
                    {loading && (
                        <AdminTableSkeleton />
                    )}

                    {/* EMPTY */}
                    {!loading &&
                        !error &&
                        paginatedAdmins.length === 0 && (
                            <EmptyState search={Boolean(search)} />
                        )}

                    {/* DESKTOP TABLE */}
                    {!loading &&
                        paginatedAdmins.length > 0 && (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-black/[0.05] bg-[#FAFCFB]">

                                                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
                                                    Administrator
                                                </th>

                                                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
                                                    Email
                                                </th>

                                                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
                                                    Status
                                                </th>

                                                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
                                                    Joined At
                                                </th>

                                                <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.15em] text-black/35">
                                                    Actions
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedAdmins.map(
                                                (admin) => (
                                                    <AdminTableRow
                                                        key={
                                                            admin.id ||
                                                            admin._id ||
                                                            admin.email
                                                        }
                                                        admin={admin}
                                                        onView={() =>
                                                            handleView(
                                                                admin
                                                            )
                                                        }
                                                        onEdit={() =>
                                                            handleEdit(
                                                                admin
                                                            )
                                                        }
                                                    />
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* MOBILE */}
                                <div className="divide-y divide-black/[0.05] md:hidden">
                                    {paginatedAdmins.map(
                                        (admin) => (
                                            <AdminMobileCard
                                                key={
                                                    admin.id ||
                                                    admin._id ||
                                                    admin.email
                                                }
                                                admin={admin}
                                                onView={() =>
                                                    handleView(
                                                        admin
                                                    )
                                                }
                                                onEdit={() =>
                                                    handleEdit(
                                                        admin
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </>
                        )}

                    {/* PAGINATION */}
                    {!loading &&
                        filteredAdmins.length > 0 && (
                            <div className="flex flex-col gap-3 border-t border-black/[0.05] bg-[#FAFCFB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <p className="text-[11px] font-semibold text-black/35">
                                    Showing{" "}
                                    <span className="font-black text-black/55">
                                        {firstItem}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-black text-black/55">
                                        {lastItem}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-black text-black/55">
                                        {filteredAdmins.length}
                                    </span>
                                </p>

                                <div className="flex items-center gap-1.5">

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage === 1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page - 1
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/40 transition hover:border-[#197653]/20 hover:text-[#197653] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronLeft
                                            size={15}
                                        />
                                    </button>

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
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-[11px] font-black transition ${currentPage ===
                                                    page
                                                    ? "bg-[#197653] text-white shadow-sm"
                                                    : "border border-black/[0.06] bg-white text-black/40 hover:border-[#197653]/20 hover:text-[#197653]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page + 1
                                            )
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.06] bg-white text-black/40 transition hover:border-[#197653]/20 hover:text-[#197653] disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <ChevronRight
                                            size={15}
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

/* ================================================================
   MINI STAT
================================================================ */

function MiniStat({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="min-w-[85px] rounded-2xl border border-black/[0.05] bg-white px-4 py-3 shadow-[0_6px_25px_rgba(0,0,0,0.025)]">
            <div className="flex items-center gap-1.5 text-black/30">
                {icon}

                <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                    {label}
                </span>
            </div>

            <p className="mt-1 text-xl font-black text-[#101815]">
                {value}
            </p>
        </div>
    );
}

/* ================================================================
   DESKTOP TABLE ROW
================================================================ */

function AdminTableRow({
    admin,
    onView,
    onEdit,
}: {
    admin: Admin;
    onView: () => void;
    onEdit: () => void;
}) {
    return (
        <tr className="group border-b border-black/[0.04] last:border-0 transition-colors hover:bg-[#FBFDFC]">

            {/* ADMIN */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F4EE] text-[#197653]">
                        <UserRound size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#101815]">
                            {admin.name || "Unnamed Admin"}
                        </p>

                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/30">
                            Administrator
                        </p>
                    </div>

                </div>
            </td>

            {/* EMAIL */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">

                    <Mail
                        size={14}
                        className="shrink-0 text-black/25"
                    />

                    <span className="text-xs font-semibold text-black/55">
                        {admin.email || "—"}
                    </span>

                </div>
            </td>

            {/* STATUS */}
            <td className="px-6 py-4">
                <StatusBadge active={admin.active} />
            </td>

            {/* CREATED */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">

                    <CalendarDays
                        size={14}
                        className="text-black/25"
                    />

                    <span className="text-xs font-semibold text-black/45">
                        {formatDate(admin.createdAt)}
                    </span>

                </div>
            </td>

            {/* ACTIONS */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">

                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.07] bg-white px-3 text-[10px] font-black text-black/50 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653]"
                    >
                        <Eye size={14} />
                        View
                    </button>

                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#197653] px-3 text-[10px] font-black text-white transition hover:bg-[#145F43]"
                    >
                        <Edit3 size={14} />
                        Edit
                    </button>

                </div>
            </td>
        </tr>
    );
}

/* ================================================================
   MOBILE CARD
================================================================ */

function AdminMobileCard({
    admin,
    onView,
    onEdit,
}: {
    admin: Admin;
    onView: () => void;
    onEdit: () => void;
}) {
    return (
        <div className="p-5">

            <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F4EE] text-[#197653]">
                        <UserRound size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#101815]">
                            {admin.name || "Unnamed Admin"}
                        </p>

                        <p className="mt-1 truncate text-xs text-black/40">
                            {admin.email || "—"}
                        </p>
                    </div>

                </div>

                <StatusBadge active={admin.active} />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-black/40">
                <CalendarDays size={14} />

                <span>
                    Created{" "}
                    <span className="font-black text-black/55">
                        {formatDate(admin.createdAt)}
                    </span>
                </span>
            </div>

            <div className="mt-4 flex gap-2">

                <button
                    type="button"
                    onClick={onView}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white text-[10px] font-black text-black/55 transition hover:border-[#197653]/20 hover:bg-[#E8F4EE] hover:text-[#197653]"
                >
                    <Eye size={14} />
                    View Details
                </button>

                <button
                    type="button"
                    onClick={onEdit}
                    className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#197653] text-[10px] font-black text-white transition hover:bg-[#145F43]"
                >
                    <Edit3 size={14} />
                    Edit
                </button>

            </div>
        </div>
    );
}

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
    active,
}: {
    active: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] ${active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${active
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
            />

            {active ? "Active" : "Inactive"}
        </span>
    );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState({
    search,
}: {
    search: boolean;
}) {
    return (
        <div className="px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F4EE] text-[#197653]">
                {search ? (
                    <Search size={26} />
                ) : (
                    <Users size={26} />
                )}
            </div>

            <h3 className="mt-5 text-lg font-black text-[#101815]">
                {search
                    ? "No administrators found"
                    : "No administrators yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
                {search
                    ? "Try searching with a different administrator name or email address."
                    : "Administrator accounts will appear here once they are created."}
            </p>
        </div>
    );
}

/* ================================================================
   TABLE SKELETON
================================================================ */

function AdminTableSkeleton() {
    return (
        <div>
            {/* DESKTOP */}
            <div className="hidden md:block">

                <div className="border-b border-black/[0.05] bg-[#FAFCFB] px-6 py-4">
                    <div className="h-3 w-full animate-pulse rounded bg-black/[0.04]" />
                </div>

                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-6 border-b border-black/[0.04] px-6 py-5 last:border-0"
                    >
                        <div className="flex flex-1 items-center gap-3">
                            <div className="h-11 w-11 animate-pulse rounded-xl bg-black/[0.05]" />

                            <div className="space-y-2">
                                <div className="h-3 w-32 animate-pulse rounded bg-black/[0.05]" />
                                <div className="h-2 w-20 animate-pulse rounded bg-black/[0.04]" />
                            </div>
                        </div>

                        <div className="h-3 w-44 animate-pulse rounded bg-black/[0.04]" />

                        <div className="h-7 w-20 animate-pulse rounded-full bg-black/[0.05]" />

                        <div className="h-3 w-24 animate-pulse rounded bg-black/[0.04]" />

                        <div className="h-9 w-32 animate-pulse rounded-xl bg-black/[0.05]" />
                    </div>
                ))}
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-black/[0.05] md:hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="space-y-4 p-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 animate-pulse rounded-xl bg-black/[0.05]" />

                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 animate-pulse rounded bg-black/[0.05]" />
                                <div className="h-2.5 w-44 animate-pulse rounded bg-black/[0.04]" />
                            </div>
                        </div>

                        <div className="h-3 w-32 animate-pulse rounded bg-black/[0.04]" />

                        <div className="flex gap-2">
                            <div className="h-10 flex-1 animate-pulse rounded-xl bg-black/[0.04]" />
                            <div className="h-10 flex-1 animate-pulse rounded-xl bg-black/[0.05]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}