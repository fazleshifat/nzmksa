import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    CreditCard,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";

import { apiFetch, type Employee } from "../../api/api";

interface AdminUsersResponse {
    users: Employee[];
    total?: number;
}

const formatDate = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

export default function AllIqama() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            setError("");

            const response = await apiFetch<AdminUsersResponse>(
                "/api/admin/users"
            );

            setUsers(response.users || []);
        } catch (err) {
            console.error(
                "ABSher Admin: Failed to load Iqama users:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load Iqama records."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const iqamaUsers = useMemo(() => {
        return users.filter(
            (user) =>
                Boolean(user.residentIdNumber) ||
                Boolean(user.iqamaImage)
        );
    }, [users]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return iqamaUsers;
        }

        return iqamaUsers.filter((user) => {
            const name = String(user.name || "").toLowerCase();
            const residentId = String(
                user.residentIdNumber || ""
            ).toLowerCase();
            const sponsorName = String(
                user.sponsorName || ""
            ).toLowerCase();
            const nationality = String(
                user.nationality || ""
            ).toLowerCase();
            const occupation = String(
                user.occupation || ""
            ).toLowerCase();
            const employer = String(
                user.employer || ""
            ).toLowerCase();

            return (
                name.includes(query) ||
                residentId.includes(query) ||
                sponsorName.includes(query) ||
                nationality.includes(query) ||
                occupation.includes(query) ||
                employer.includes(query)
            );
        });
    }, [iqamaUsers, search]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
    };

    /*
     * Opens the same existing employee View Details page
     * used by AdminUsersTable.
     */
    const handleView = (employee: Employee) => {
        const id = employee.id || employee._id;

        if (!id) {
            console.error(
                "ABSher Admin: Employee has no ID:",
                employee
            );
            return;
        }

        navigate(`/admin/users/${id}`);
    };

    return (
        <section className="min-h-full bg-[#F3F7F5] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-[1700px]">

                {/* =====================================================
                    BACK BUTTON
                ====================================================== */}
                <div className="mb-5">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3.5 py-2.5 text-xs font-black text-black/55 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-[#197653]/20 hover:bg-[#F9FCFA] hover:text-[#197653]"
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-200 group-hover:-translate-x-0.5"
                        />

                        <span>Back</span>
                    </button>
                </div>

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <div className="mb-3">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        {/* LEFT */}
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E7F4EE] text-[#197653]">
                                    <ShieldCheck size={16} />
                                </div>

                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#197653]">
                                    Employee Records
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-[#101815] sm:text-3xl">
                                All Iqama ID
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-black/45">
                                Browse all employee Iqama records and view
                                complete employee information.
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-3">

                            {/* TOTAL */}
                            <div className="rounded-2xl border border-black/[0.05] bg-white px-5 py-3 shadow-sm">
                                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-black/30">
                                    Total Iqama
                                </p>

                                <p className="mt-0.5 text-xl font-black text-[#101815]">
                                    {loading ? "—" : iqamaUsers.length}
                                </p>
                            </div>

                            {/* REFRESH */}
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex h-[58px] items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-4 text-xs font-black text-black/60 shadow-sm transition hover:bg-[#F9FBFA] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span className="hidden sm:inline">
                                    Refresh
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =================================================
                        SEARCH
                    ================================================== */}
                    <div className="relative mt-2 max-w-3xl">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/25"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by Iqama number, employee name, sponsor..."
                            className="h-14 w-full rounded-2xl border border-black/[0.06] bg-white pl-12 pr-12 text-sm font-medium text-black outline-none shadow-[0_8px_30px_rgba(0,0,0,0.025)] transition placeholder:text-black/25 focus:border-[#197653]/30 focus:ring-4 focus:ring-[#197653]/5"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-black/30 transition hover:bg-black/5 hover:text-black/60"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* =====================================================
                    ERROR
                ====================================================== */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4">
                        <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                                <ShieldCheck size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-red-700">
                                    Failed to load Iqama records
                                </p>

                                <p className="mt-1 text-xs text-red-600/70">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={fetchUsers}
                                    className="mt-2 text-xs font-black text-red-700 underline underline-offset-2"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* =====================================================
                    LOADING
                ====================================================== */}
                {loading && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <IqamaCardSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* =====================================================
                    EMPTY
                ====================================================== */}
                {!loading &&
                    !error &&
                    filteredUsers.length === 0 && (
                        <div className="rounded-2xl border border-black/[0.05] bg-white px-6 py-20 text-center shadow-[0_10px_35px_rgba(0,0,0,0.025)]">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F4EE] text-[#197653]">
                                <CreditCard size={27} />
                            </div>

                            <h2 className="mt-5 text-lg font-black text-[#101815]">
                                {search
                                    ? "No Iqama found"
                                    : "No Iqama records"}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/40">
                                {search
                                    ? "Try another Iqama number, employee name, or sponsor."
                                    : "Employee Iqama records will appear here once they are available."}
                            </p>
                        </div>
                    )}

                {/* =====================================================
                    IQAMA GRID
                ====================================================== */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredUsers.map((employee) => (
                            <IqamaCard
                                key={
                                    employee.id ||
                                    employee._id ||
                                    employee.residentIdNumber
                                }
                                employee={employee}
                                onClick={() => handleView(employee)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ================================================================
   IQAMA CARD
================================================================ */

function IqamaCard({
    employee,
    onClick,
}: {
    employee: Employee;
    onClick: () => void;
}) {
    const [imageError, setImageError] = useState(false);

    const isActive = employee.active !== false;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-black/[0.05] bg-white text-left shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#197653]/15 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
        >
            {/* =================================================
                IQAMA IMAGE
            ================================================== */}
            <div className="relative h-[220px] overflow-hidden bg-[#E8EFEB]">

                {employee.iqamaImage && !imageError ? (
                    <img
                        src={employee.iqamaImage}
                        alt={`${employee.name || "Employee"} Iqama`}
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#EAF5F0] to-[#DDECE5] text-[#197653]">
                        <CreditCard
                            size={46}
                            strokeWidth={1.4}
                        />

                        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em]">
                            Iqama ID
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-[#197653]/50">
                            Image unavailable
                        </p>
                    </div>
                )}

                {/* Bottom gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

                {/* ACTIVE */}
                <div className="absolute left-4 top-4">
                    <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">

                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                isActive
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                            }`}
                        />

                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-black/65">
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                {/* CARD ICON - ALWAYS VISIBLE */}
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-black/45 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#197653]">
                    <CreditCard size={16} />
                </div>
            </div>

            {/* =================================================
                CONTENT
            ================================================== */}
            <div className="p-5">

                {/* IQAMA NUMBER */}
                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#197653]">
                            Iqama Number
                        </p>

                        <p className="mt-1 font-mono text-base font-black tracking-wide text-[#101815]">
                            {employee.residentIdNumber ||
                                "Not available"}
                        </p>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F4EE] text-[#197653]">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* EMPLOYEE */}
                <div className="mt-5 border-t border-black/[0.05] pt-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EDF2EF]">

                            {employee.avatarUrl ? (
                                <img
                                    src={employee.avatarUrl}
                                    alt={employee.name || "Employee"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserRound
                                    size={17}
                                    className="text-black/25"
                                />
                            )}

                        </div>

                        <div className="min-w-0">

                            <p className="truncate text-sm font-black text-[#101815]">
                                {employee.name ||
                                    "Unnamed Employee"}
                            </p>

                            <p className="mt-0.5 truncate text-xs font-medium text-black/40">
                                {employee.sponsorName ||
                                    "Sponsor not available"}
                            </p>

                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays
                            size={14}
                            className="shrink-0 text-black/25"
                        />

                        <span className="truncate text-[10px] font-semibold text-black/35">
                            Expires{" "}
                            {formatDate(
                                employee.residentIdExpiry
                            )}
                        </span>
                    </div>

                    {/* VIEW - ALWAYS VISIBLE */}
                    <span className="shrink-0 rounded-xl bg-[#E8F4EE] px-3 py-2 text-[10px] font-black text-[#197653] transition-all duration-300 group-hover:bg-[#197653] group-hover:text-white group-hover:shadow-sm">
                        View
                    </span>
                </div>
            </div>
        </button>
    );
}

/* ================================================================
   SKELETON
================================================================ */

function IqamaCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white">

            <div className="h-[220px] animate-pulse bg-black/[0.045]" />

            <div className="space-y-4 p-5">

                <div className="h-2.5 w-24 animate-pulse rounded bg-black/[0.05]" />

                <div className="h-5 w-40 animate-pulse rounded bg-black/[0.06]" />

                <div className="border-t border-black/[0.05] pt-4">
                    <div className="h-10 w-full animate-pulse rounded-xl bg-black/[0.04]" />
                </div>

                <div className="h-3 w-36 animate-pulse rounded bg-black/[0.04]" />

            </div>
        </div>
    );
}