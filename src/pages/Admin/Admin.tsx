import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Database,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { apiFetch, type Employee } from "../../api/api";

interface AdminUsersResponse {
  users: Employee[];
  total?: number;
}

const USERS_PER_PAGE = 10;

export default function Admin() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<Employee[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const fetchUsers = async () => {
    try {
      setError("");

      const response = await apiFetch<AdminUsersResponse>(
        "/api/admin/users"
      );

      setUsers(response.users || []);
    } catch (error) {
      console.error(
        "ABSher Admin: Failed to load users:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users"
      );
    } finally {
      setLoadingUsers(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ============================================================
  // OPEN DELETE MODAL
  // ============================================================

  const openDeleteModal = (user: Employee) => {
    setDeleteTarget(user);
  };

  // ============================================================
  // ACTUAL DELETE
  // ============================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const userId =
      deleteTarget.id || deleteTarget._id;

    if (!userId) {
      setDeleteTarget(null);
      return;
    }

    try {
      setDeletingId(userId);
      setError("");

      await apiFetch(
        `/api/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            (currentUser.id || currentUser._id) !==
            userId
        )
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "ABSher Admin: Failed to delete user:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete user"
      );

      setDeleteTarget(null);
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name = String(
        user.name || ""
      ).toLowerCase();

      const residentId = String(
        user.residentIdNumber || ""
      ).toLowerCase();

      const nationality = String(
        user.nationality || ""
      ).toLowerCase();

      const sponsorName = String(
        user.sponsorName || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        residentId.includes(query) ||
        nationality.includes(query) ||
        sponsorName.includes(query)
      );
    });
  }, [users, search]);

  // ============================================================
  // STATS
  // ============================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.active !== false
  ).length;

  const inactiveUsers =
    totalUsers - activeUsers;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length /
        USERS_PER_PAGE
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

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      USERS_PER_PAGE;

    return filteredUsers.slice(
      startIndex,
      startIndex + USERS_PER_PAGE
    );
  }, [
    filteredUsers,
    currentPage,
  ]);

  const firstItem =
    filteredUsers.length === 0
      ? 0
      : (currentPage - 1) *
          USERS_PER_PAGE +
        1;

  const lastItem = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-[100dvh] bg-[#F3F7F5] text-black">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[78px] max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* BRAND */}

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white shadow-[0_8px_20px_rgba(25,118,83,0.18)]">

              <span className="text-lg font-black">
                A
              </span>

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
                  Absher
                </p>

                <span className="hidden rounded-full bg-[#EAF5F0] px-2 py-0.5 text-[9px] font-bold text-brand-green sm:inline-flex">
                  ADMIN
                </span>

              </div>

              <h1 className="truncate text-lg font-black sm:text-xl">
                Admin Dashboard
              </h1>

            </div>
          </div>

          {/* ADMIN */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right md:block">

              <p className="text-sm font-black">
                {admin?.name ||
                  "Administrator"}
              </p>

              <p className="max-w-[220px] truncate text-xs text-black/40">
                {admin?.email}
              </p>

            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#EAF5F0] text-sm font-black text-brand-green sm:flex">
              {String(
                admin?.name ||
                  "A"
              )
                .trim()
                .charAt(0)
                .toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-500/10 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 active:scale-95"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* PAGE INTRO */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2 text-brand-green">

              <Activity size={15} />

              <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                Overview
              </span>

            </div>

            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Employee Management
            </h2>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/45">
              Manage employee accounts,
              review profiles, update
              information, and control
              account access.
            </p>

          </div>

        </div>

        {/* ========================================================
            DASHBOARD GRID
        ======================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row">

          {/* ======================================================
              LEFT SIDEBAR / STATS
          ====================================================== */}

          <aside className="w-full shrink-0 lg:sticky lg:top-[100px] lg:w-[280px]">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">

              {/* TOTAL */}

              <StatCard
                label="Total Employees"
                value={
                  loadingUsers
                    ? "—"
                    : totalUsers
                }
                icon={
                  <Users size={21} />
                }
                iconClass="bg-[#EAF5F0] text-brand-green"
                description="Registered accounts"
              />

              {/* ACTIVE */}

              <StatCard
                label="Active Employees"
                value={
                  loadingUsers
                    ? "—"
                    : activeUsers
                }
                icon={
                  <UserCheck
                    size={21}
                  />
                }
                iconClass="bg-green-50 text-green-600"
                description="Currently enabled"
              />

              {/* INACTIVE */}

              <StatCard
                label="Inactive Employees"
                value={
                  loadingUsers
                    ? "—"
                    : inactiveUsers
                }
                icon={
                  <UserX size={21} />
                }
                iconClass="bg-red-50 text-red-500"
                description="Currently disabled"
              />

            </div>

            {/* SYSTEM CARD */}

            <div className="mt-3 hidden rounded-3xl bg-[#173D31] p-5 text-white lg:block">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                    System
                  </p>

                  <p className="mt-2 text-lg font-black">
                    Employee Database
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <Database size={18} />
                </div>

              </div>

              <div className="mt-5 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs font-semibold text-white/65">
                  Connected
                </span>

              </div>

            </div>

          </aside>

          {/* ======================================================
              EMPLOYEE TABLE
          ====================================================== */}

          <section className="min-w-0 flex-1 overflow-hidden rounded-[28px] border border-black/[0.045] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.035)]">

            {/* TABLE HEADER */}

            <div className="border-b border-black/[0.055] p-4 sm:p-5 lg:p-6">

              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <ShieldCheck
                      size={16}
                      className="text-brand-green"
                    />

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
                      Employee Directory
                    </p>

                  </div>

                  <h3 className="mt-1.5 text-xl font-black">
                    All Employees
                  </h3>

                  <p className="mt-1 text-xs text-black/40">
                    Showing{" "}
                    <span className="font-bold text-black/60">
                      {firstItem}–
                      {lastItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-black/60">
                      {filteredUsers.length}
                    </span>{" "}
                    employees
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={
                      handleRefresh
                    }
                    disabled={refreshing}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-xs font-black text-black/60 transition hover:bg-[#F5F8F6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
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

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/admin/users/create"
                      )
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-black text-white transition hover:brightness-95 active:scale-95"
                  >
                    <Plus size={16} />
                    Add Employee
                  </button>

                </div>

              </div>

              {/* SEARCH */}

              <div className="relative mt-5">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by name, Iqama, nationality, sponsor..."
                  className="h-12 w-full rounded-2xl border border-transparent bg-[#F4F8F6] pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-black/30 focus:border-brand-green/20 focus:bg-white focus:ring-4 focus:ring-brand-green/5"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/35 transition hover:bg-black/5 hover:text-black/60"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mx-4 mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 sm:mx-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                    <AlertTriangle
                      size={17}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-black text-red-700">
                      Unable to load employees
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600/75">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={
                        fetchUsers
                      }
                      className="mt-2 text-xs font-black text-red-700 underline underline-offset-2"
                    >
                      Try again
                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* LOADING */}

            {loadingUsers && (
              <div className="p-5">

                <div className="space-y-3">

                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-4 rounded-2xl bg-[#F7F9F8] p-4"
                    >

                      <div className="h-11 w-11 rounded-xl bg-black/[0.05]" />

                      <div className="flex-1">

                        <div className="h-3.5 w-40 rounded bg-black/[0.05]" />

                        <div className="mt-2 h-3 w-24 rounded bg-black/[0.04]" />

                      </div>

                      <div className="hidden h-8 w-20 rounded-lg bg-black/[0.04] sm:block" />

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* EMPTY */}

            {!loadingUsers &&
              !error &&
              filteredUsers.length === 0 && (
                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF5F0] text-brand-green">
                    <Users size={27} />
                  </div>

                  <h3 className="mt-5 text-base font-black">
                    {search
                      ? "No employees found"
                      : "No employees yet"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/40">
                    {search
                      ? "Try another name, resident ID, nationality, or sponsor name."
                      : "Create your first employee account to start managing your directory."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/admin/users/create"
                        )
                      }
                      className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-black text-white"
                    >
                      <Plus size={15} />
                      Create Employee
                    </button>
                  )}

                </div>
              )}

            {/* TABLE */}

            {!loadingUsers &&
              filteredUsers.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[980px]">

                    <thead>

                      <tr className="border-b border-black/[0.055] bg-[#FAFCFB] text-left">

                        <th className="w-16 px-5 py-4 text-center text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          SL
                        </th>

                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Employee
                        </th>

                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Resident ID
                        </th>

                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Nationality
                        </th>

                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Sponsor
                        </th>

                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {paginatedUsers.map(
                        (user, index) => {

                          const userId =
                            user.id ||
                            user._id;

                          const serialNumber =
                            (currentPage -
                              1) *
                              USERS_PER_PAGE +
                            index +
                            1;

                          return (
                            <tr
                              key={
                                userId ||
                                user.residentIdNumber
                              }
                              className="group border-b border-black/[0.045] transition last:border-b-0 hover:bg-[#FAFCFB]"
                            >

                              {/* SL */}

                              <td className="px-5 py-4 text-center">

                                <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#F4F8F6] px-1.5 text-[10px] font-black text-black/40">
                                  {serialNumber}
                                </span>

                              </td>

                              {/* EMPLOYEE */}

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <UserAvatar
                                    user={user}
                                  />

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-black">
                                      {user.name ||
                                        "Unnamed User"}
                                    </p>

                                    <p className="mt-0.5 truncate text-[11px] font-medium text-black/35">
                                      {user.occupation ||
                                        user.birthCountry ||
                                        user.nationality ||
                                        "Employee"}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              {/* RESIDENT ID */}

                              <td className="px-5 py-4">

                                <span className="rounded-lg bg-[#F7F9F8] px-2.5 py-1.5 font-mono text-[11px] font-bold text-black/60">
                                  {user.residentIdNumber ||
                                    "—"}
                                </span>

                              </td>

                              {/* NATIONALITY */}

                              <td className="px-5 py-4">

                                <span className="text-xs font-semibold text-black/55">
                                  {user.nationality ||
                                    "—"}
                                </span>

                              </td>

                              {/* SPONSOR */}

                              <td className="max-w-[180px] px-5 py-4">

                                <span className="block truncate text-xs font-semibold text-black/55">
                                  {user.sponsorName ||
                                    "—"}
                                </span>

                              </td>

                              {/* STATUS */}

                              <td className="px-5 py-4">

                                <StatusBadge
                                  user={user}
                                />

                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">

                                <UserActions
                                  user={user}
                                  deletingId={
                                    deletingId
                                  }
                                  onView={() =>
                                    navigate(
                                      `/admin/users/${userId}`
                                    )
                                  }
                                  onEdit={() =>
                                    navigate(
                                      `/admin/users/${userId}/edit`
                                    )
                                  }
                                  onDelete={() =>
                                    openDeleteModal(
                                      user
                                    )
                                  }
                                />

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            {/* ======================================================
                PAGINATION
            ====================================================== */}

            {!loadingUsers &&
              filteredUsers.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-black/[0.055] bg-[#FAFCFB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                  <p className="text-xs font-semibold text-black/40">

                    Showing{" "}

                    <span className="font-black text-black/65">
                      {firstItem}
                    </span>

                    {" "}to{" "}

                    <span className="font-black text-black/65">
                      {lastItem}
                    </span>

                    {" "}of{" "}

                    <span className="font-black text-black/65">
                      {filteredUsers.length}
                    </span>{" "}
                    employees

                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5">

                      {/* PREVIOUS */}

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
                                page - 1
                              )
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/50 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft
                          size={16}
                        />
                      </button>

                      {/* PAGE NUMBERS */}

                      <div className="flex items-center gap-1">

                        {Array.from(
                          {
                            length:
                              totalPages,
                          },
                          (_, index) =>
                            index + 1
                        ).map(
                          (page) => (
                            <button
                              key={
                                page
                              }
                              type="button"
                              onClick={() =>
                                setCurrentPage(
                                  page
                                )
                              }
                              className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-black transition ${
                                currentPage ===
                                page
                                  ? "bg-brand-green text-white shadow-sm"
                                  : "border border-black/10 bg-white text-black/50 hover:bg-black/5"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}

                      </div>

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
                      >
                        <ChevronRight
                          size={16}
                        />
                      </button>

                    </div>
                  )}

                </div>
              )}

          </section>

        </div>
      </main>

      {/* ============================================================
          DELETE CONFIRMATION MODAL
      ============================================================ */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!deletingId) {
              setDeleteTarget(null);
            }
          }}
        >

          <div
            className="w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL TOP */}

            <div className="p-6 pb-5 sm:p-7">

              <div className="flex items-start justify-between gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">

                  <Trash2
                    size={24}
                    strokeWidth={2}
                  />

                </div>

                {!deletingId && (
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget(
                        null
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-black/30 transition hover:bg-black/5 hover:text-black/60"
                  >
                    <X size={18} />
                  </button>
                )}

              </div>

              <h2 className="mt-6 text-xl font-black tracking-tight">
                Delete Employee?
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Are you sure you want to
                permanently delete{" "}
                <span className="font-black text-black/80">
                  {deleteTarget.name ||
                    "this employee"}
                </span>
                ?
              </p>

              {/* WARNING */}

              <div className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>

                  <p className="text-xs font-black text-red-700">
                    This action cannot be undone.
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-red-600/70">
                    Once you delete this
                    employee, their account
                    and stored information
                    cannot be recovered.
                  </p>

                </div>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-[#FAFCFB] p-5 sm:flex-row sm:items-center sm:justify-between">

              {/* YES DELETE — LEFT */}

              <button
                type="button"
                disabled={Boolean(
                  deletingId
                )}
                onClick={
                  handleDelete
                }
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-black text-white shadow-[0_8px_20px_rgba(239,68,68,0.18)] transition hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deletingId ? (
                  <>
                    <RefreshCw
                      size={15}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={15}
                    />
                    Yes, Delete
                  </>
                )}

              </button>

              {/* CANCEL — RIGHT */}

              <button
                type="button"
                disabled={Boolean(
                  deletingId
                )}
                onClick={() =>
                  setDeleteTarget(
                    null
                  )
                }
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-black/10 bg-white px-5 text-xs font-black text-black/60 transition hover:bg-black/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================

function StatCard({
  label,
  value,
  icon,
  iconClass,
  description,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconClass: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-black/[0.04] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.055)]">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="truncate text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-[11px] font-medium text-black/35">
            {description}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// ============================================================================
// USER AVATAR
// ============================================================================

function UserAvatar({
  user,
}: {
  user: Employee;
}) {
  const [imageError, setImageError] =
    useState(false);

  const avatar =
    typeof user.avatarUrl === "string"
      ? user.avatarUrl
      : "";

  if (!avatar || imageError) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F0] text-sm font-black text-brand-green">
        {String(
          user.name || "U"
        )
          .trim()
          .charAt(0)
          .toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={user.name || "User"}
      onError={() =>
        setImageError(true)
      }
      className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
    />
  );
}

// ============================================================================
// STATUS
// ============================================================================

function StatusBadge({
  user,
}: {
  user: Employee;
}) {
  const active =
    user.active !== false;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black ${
        active
          ? "bg-green-50 text-green-600"
          : "bg-red-50 text-red-500"
      }`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

      {active
        ? "Active"
        : "Inactive"}

    </span>
  );
}

// ============================================================================
// USER ACTIONS
// ============================================================================

function UserActions({
  user,
  deletingId,
  onView,
  onEdit,
  onDelete,
}: {
  user: Employee;
  deletingId: string | null;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const userId =
    user.id || user._id;

  return (
    <div className="flex justify-end gap-1.5">

      {/* VIEW */}

      <button
        type="button"
        onClick={onView}
        title="View employee"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F8F6] text-black/50 transition hover:bg-[#EAF5F0] hover:text-brand-green active:scale-95"
      >
        <Eye size={15} />
      </button>

      {/* EDIT */}

      <button
        type="button"
        onClick={onEdit}
        title="Edit employee"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF5F0] text-brand-green transition hover:bg-[#DFF0E9] active:scale-95"
      >
        <Pencil size={15} />
      </button>

      {/* DELETE */}

      <button
        type="button"
        disabled={
          deletingId === userId
        }
        onClick={onDelete}
        title="Delete employee"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {deletingId === userId ? (
          <RefreshCw
            size={14}
            className="animate-spin"
          />
        ) : (
          <Trash2 size={15} />
        )}
      </button>

    </div>
  );
}