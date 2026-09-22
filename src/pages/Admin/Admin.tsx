import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { apiFetch, type Employee } from '../../api/api';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setError('');

      const response = await apiFetch<AdminUsersResponse>(
        '/api/admin/users'
      );

      setUsers(response.users || []);
    } catch (error) {
      console.error(
        'ABSher Admin: Failed to load users:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load users'
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

    navigate('/login', {
      replace: true,
    });
  };

  const handleDelete = async (user: Employee) => {
    const userId = user.id || user._id;

    if (!userId) return;

    const confirmed = window.confirm(
      `Delete ${user.name || 'this user'}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(userId);
      setError('');

      await apiFetch(
        `/api/admin/users/${userId}`,
        {
          method: 'DELETE',
        }
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            (currentUser.id || currentUser._id) !== userId
        )
      );
    } catch (error) {
      console.error(
        'ABSher Admin: Failed to delete user:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete user'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name =
        String(user.name || '').toLowerCase();

      const residentId =
        String(
          user.residentIdNumber || ''
        ).toLowerCase();

      const nationality =
        String(
          user.nationality || ''
        ).toLowerCase();

      const sponsorName =
        String(
          user.sponsorName || ''
        ).toLowerCase();

      return (
        name.includes(query) ||
        residentId.includes(query) ||
        nationality.includes(query) ||
        sponsorName.includes(query)
      );
    });
  }, [users, search]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.active !== false
  ).length;

  const inactiveUsers =
    totalUsers - activeUsers;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length / USERS_PER_PAGE
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
      (currentPage - 1) * USERS_PER_PAGE;

    return filteredUsers.slice(
      startIndex,
      startIndex + USERS_PER_PAGE
    );
  }, [filteredUsers, currentPage]);

  const firstItem =
    filteredUsers.length === 0
      ? 0
      : (currentPage - 1) * USERS_PER_PAGE + 1;

  const lastItem = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  return (
    <div className="min-h-[100dvh] bg-[#F4F8F6] text-black">

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white shadow-sm">
              <span className="text-lg font-black">
                A
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green">
                Absher
              </p>

              <h1 className="truncate text-lg font-bold sm:text-xl">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">
                {admin?.name || 'Administrator'}
              </p>

              <p className="max-w-[220px] truncate text-xs text-black/45">
                {admin?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-500/15 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* WELCOME */}
      {/* ================================================================ */}

      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto w-full px-4 py-5 sm:px-6 lg:px-8">

          <p className="text-sm font-medium text-black/45">
            Welcome back,
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            {admin?.name || 'Administrator'}
          </h2>

          <p className="mt-1 text-sm text-black/45">
            Manage employee accounts and information.
          </p>

        </div>
      </section>

      {/* ================================================================ */}
      {/* MAIN */}
      {/* ================================================================ */}

      <main className="mx-auto w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

        <div className="flex flex-col gap-2 lg:flex-row lg:items-start">

          {/* ============================================================ */}
          {/* LEFT STATS */}
          {/* ============================================================ */}

          <aside className="w-full shrink-0 lg:sticky lg:top-5 lg:w-[260px]">

            <div className="space-y-3">

              {/* Total */}

              <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                      Total Users
                    </p>

                    <p className="mt-3 text-3xl font-black">
                      {loadingUsers
                        ? '—'
                        : totalUsers}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF5F0] text-brand-green">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Active */}

              <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                      Active
                    </p>

                    <p className="mt-3 text-3xl font-black">
                      {loadingUsers
                        ? '—'
                        : activeUsers}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <span className="h-3 w-3 rounded-full bg-current" />
                  </div>

                </div>
              </div>

              {/* Inactive */}

              <div className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-black/40">
                      Inactive
                    </p>

                    <p className="mt-3 text-3xl font-black">
                      {loadingUsers
                        ? '—'
                        : inactiveUsers}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <span className="h-3 w-3 rounded-full bg-current" />
                  </div>

                </div>
              </div>

              

            </div>
          </aside>

          {/* ============================================================ */}
          {/* RIGHT TABLE */}
          {/* ============================================================ */}

          <section className="min-w-0 flex-1 overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

            {/* TABLE HEADER */}

            <div className="border-b border-black/5 p-4 sm:p-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-green">
                    Management
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Employee
                  </h2>

                  <p className="mt-1 text-xs text-black/40">
                    Showing {firstItem}–{lastItem} of{' '}
                    {filteredUsers.length} users
                  </p>
                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 px-4 text-sm font-bold text-black/70 transition active:scale-95 disabled:opacity-50"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={
                        refreshing
                          ? 'animate-spin'
                          : ''
                      }
                    >
                      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                      <path d="M4 5v4h4" />
                      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                      <path d="M20 19v-4h-4" />
                    </svg>

                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/admin/users/new')
                    }
                    className="flex h-11 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-bold text-white shadow-sm transition active:scale-95"
                  >
                    + Add User
                  </button>

                </div>
              </div>

              {/* SEARCH */}

              <div className="relative mt-4">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name, Iqama, nationality, sponsor..."
                  className="h-12 w-full rounded-2xl bg-[#F4F8F6] pl-11 pr-4 text-sm outline-none ring-brand-green/30 placeholder:text-black/30 focus:ring-2"
                />

              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="m-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">

                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchUsers}
                  className="mt-2 text-xs font-bold text-red-700 underline"
                >
                  Try again
                </button>

              </div>
            )}

            {/* LOADING */}

            {loadingUsers && (
              <div className="p-6">

                <div className="space-y-3">

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-4 rounded-2xl bg-[#F4F8F6] p-4"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-black/5" />

                      <div className="flex-1">
                        <div className="h-4 w-40 rounded bg-black/5" />
                        <div className="mt-2 h-3 w-28 rounded bg-black/5" />
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* EMPTY */}

            {!loadingUsers &&
              !error &&
              filteredUsers.length === 0 && (
                <div className="px-6 py-14 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F4F8F6] text-brand-green">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base font-bold">
                    {search
                      ? 'No users found'
                      : 'No users yet'}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/40">
                    {search
                      ? 'Try a different name, resident ID, nationality, or sponsor name.'
                      : 'Create an employee account to see it here.'}
                  </p>

                </div>
              )}

            {/* TABLE */}

            {!loadingUsers &&
              filteredUsers.length > 0 && (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>

                      <tr className="border-b border-black/5 bg-[#FAFCFB] text-left">

                        <th className="w-16 px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-black/40">
                          SL
                        </th>

                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">
                          User
                        </th>

                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">
                          Resident ID
                        </th>

                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">
                          Nationality
                        </th>

                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">
                          Sponsor Name
                        </th>

                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-black/40">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-black/40">
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
                            (currentPage - 1) *
                              USERS_PER_PAGE +
                            index +
                            1;

                          return (
                            <tr
                              key={
                                userId ||
                                user.residentIdNumber
                              }
                              className="border-b border-black/5 last:border-b-0"
                            >

                              {/* SL */}

                              <td className="px-5 py-4 text-center">

                                <span className="text-xs font-bold text-black/40">
                                  {serialNumber}
                                </span>

                              </td>

                              {/* USER */}

                              <td className="px-5 py-4">

                                <div className="flex items-center gap-3">

                                  <UserAvatar
                                    user={user}
                                  />

                                  <div className="min-w-0">

                                    <p className="truncate text-sm font-bold">
                                      {user.name ||
                                        'Unnamed User'}
                                    </p>

                                    <p className="truncate text-xs text-black/40">
                                      {user.birthCountry ||
                                        user.nationality ||
                                        'Employee'}
                                    </p>

                                  </div>

                                </div>

                              </td>

                              {/* RESIDENT ID */}

                              <td className="px-5 py-4">

                                <span className="font-mono text-xs font-semibold text-black/70">
                                  {user.residentIdNumber ||
                                    '—'}
                                </span>

                              </td>

                              {/* NATIONALITY */}

                              <td className="px-5 py-4 text-sm text-black/60">
                                {user.nationality ||
                                  '—'}
                              </td>

                              {/* SPONSOR */}

                              <td className="px-5 py-4 text-sm text-black/60">
                                {user.sponsorName ||
                                  '—'}
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
                                    handleDelete(
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

            {/* ============================================================ */}
            {/* PAGINATION */}
            {/* ============================================================ */}

            {!loadingUsers &&
              filteredUsers.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-black/5 bg-[#FAFCFB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                  <p className="text-xs font-semibold text-black/40">
                    Showing{' '}
                    <span className="text-black/65">
                      {firstItem}
                    </span>{' '}
                    to{' '}
                    <span className="text-black/65">
                      {lastItem}
                    </span>{' '}
                    of{' '}
                    <span className="text-black/65">
                      {filteredUsers.length}
                    </span>{' '}
                    users
                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">

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
                        className="flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-bold text-black/60 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        ←
                      </button>

                      {/* PAGE NUMBERS */}

                      <div className="flex items-center gap-1">

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
                            className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold transition ${
                              currentPage ===
                              page
                                ? 'bg-brand-green text-white'
                                : 'border border-black/10 bg-white text-black/60 hover:bg-black/5'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

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
                        className="flex h-9 items-center justify-center rounded-xl border border-black/10 bg-white px-3 text-xs font-bold text-black/60 transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        →
                      </button>

                    </div>
                  )}

                </div>
              )}

          </section>
        </div>
      </main>
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
    typeof user.avatarUrl === 'string'
      ? user.avatarUrl
      : '';

  if (!avatar || imageError) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF5F0] text-sm font-black text-brand-green">
        {String(user.name || 'U')
          .trim()
          .charAt(0)
          .toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={user.name || 'User'}
      onError={() => setImageError(true)}
      className="h-12 w-12 shrink-0 rounded-2xl object-cover"
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        active
          ? 'bg-green-50 text-green-600'
          : 'bg-red-50 text-red-500'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}
      />

      {active ? 'Active' : 'Inactive'}
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

      <button
        type="button"
        onClick={onView}
        className="rounded-xl bg-[#F4F8F6] px-3 py-2 text-xs font-bold text-black/60 transition hover:bg-black/5"
      >
        View
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="rounded-xl bg-[#EAF5F0] px-3 py-2 text-xs font-bold text-brand-green transition hover:bg-[#DFF0E9]"
      >
        Edit
      </button>

      <button
        type="button"
        disabled={
          deletingId === userId
        }
        onClick={onDelete}
        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
      >
        {deletingId === userId
          ? '...'
          : 'Delete'}
      </button>

    </div>
  );
}