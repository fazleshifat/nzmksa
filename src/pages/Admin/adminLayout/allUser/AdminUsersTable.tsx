import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { Employee } from "../../../../api/api";

interface Props {
  users: Employee[];
  totalFiltered: number;
  firstItem: number;
  lastItem: number;
  currentPage: number;
  totalPages: number;
  search: string;
  loading: boolean;
  refreshing: boolean;
  error: string;
  deletingId: string | null;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onRefresh: () => void;
  onCreate: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (user: Employee) => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}

export default function AdminUsersTable(props: Props) {
  const {
    users,
    totalFiltered,
    firstItem,
    lastItem,
    currentPage,
    totalPages,
    search,
    loading,
    refreshing,
    error,
    deletingId,
    onSearchChange,
    onClearSearch,
    onRefresh,
    onCreate,
    onView,
    onEdit,
    onDelete,
    onRetry,
    onPageChange,
  } = props;

  return (
    <section className="overflow-hidden rounded-[28px] border border-black/[0.045] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.035)]">
      <div className="border-b border-black/[0.055] p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-green">
              Employee Directory
            </p>
            <h2 className="mt-1.5 text-xl font-black">All Employees</h2>
            <p className="mt-1 text-xs text-black/40">
              Showing{" "}
              <span className="font-black text-black/60">{firstItem}–{lastItem}</span>{" "}
              of{" "}
              <span className="font-black text-black/60">{totalFiltered}</span>{" "}
              employees
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-xs font-black text-black/60 transition hover:bg-[#F5F8F6] disabled:opacity-40"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={onCreate}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-black text-white transition hover:brightness-95"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        <div className="relative mt-5">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name, Iqama, nationality, sponsor..."
            className="h-12 w-full rounded-2xl border border-transparent bg-[#F4F8F6] pl-11 pr-11 text-sm font-medium outline-none transition placeholder:text-black/30 focus:border-brand-green/20 focus:bg-white focus:ring-4 focus:ring-brand-green/5"
          />

          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-black/35 hover:bg-black/5"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 sm:mx-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
              <AlertTriangle size={17} />
            </div>
            <div>
              <p className="text-sm font-black text-red-700">
                Unable to load employees
              </p>
              <p className="mt-1 text-xs leading-5 text-red-600/75">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 text-xs font-black text-red-700 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-3 p-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-4 rounded-2xl bg-[#F7F9F8] p-4"
            >
              <div className="h-11 w-11 rounded-xl bg-black/[0.05]" />
              <div className="flex-1">
                <div className="h-3.5 w-40 rounded bg-black/[0.05]" />
                <div className="mt-2 h-3 w-24 rounded bg-black/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalFiltered === 0 && (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF5F0] text-brand-green">
            <Users size={27} />
          </div>
          <h3 className="mt-5 text-base font-black">
            {search ? "No employees found" : "No employees yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/40">
            {search
              ? "Try another name, resident ID, nationality, or sponsor name."
              : "Create your first employee account to start managing your directory."}
          </p>
        </div>
      )}

      {!loading && totalFiltered > 0 && (
        <>
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
                {users.map((user, index) => {
                  const userId = user.id || user._id || "";
                  const serialNumber =
                    (currentPage - 1) * 10 + index + 1;

                  return (
                    <tr
                      key={userId || user.residentIdNumber}
                      className="group border-b border-black/[0.045] transition last:border-b-0 hover:bg-[#FAFCFB]"
                    >
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#F4F8F6] px-1.5 text-[10px] font-black text-black/40">
                          {serialNumber}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                              {user.name || "Unnamed User"}
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

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[#F7F9F8] px-2.5 py-1.5 font-mono text-[11px] font-bold text-black/60">
                          {user.residentIdNumber || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-black/55">
                        {user.nationality || "—"}
                      </td>

                      <td className="max-w-[180px] px-5 py-4">
                        <span className="block truncate text-xs font-semibold text-black/55">
                          {user.sponsorName || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge active={user.active !== false} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <ActionButton
                            title="View employee"
                            onClick={() => onView(userId)}
                          >
                            <Eye size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Edit employee"
                            green
                            onClick={() => onEdit(userId)}
                          >
                            <Pencil size={15} />
                          </ActionButton>

                          <ActionButton
                            title="Delete employee"
                            danger
                            disabled={deletingId === userId}
                            onClick={() => onDelete(user)}
                          >
                            {deletingId === userId ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/[0.055] bg-[#FAFCFB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs font-semibold text-black/40">
              Showing{" "}
              <span className="font-black text-black/65">{firstItem}</span>{" "}
              to{" "}
              <span className="font-black text-black/65">{lastItem}</span>{" "}
              of{" "}
              <span className="font-black text-black/65">{totalFiltered}</span>{" "}
              employees
            </p>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onPageChange(page)}
                      className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-black ${
                        currentPage === page
                          ? "bg-brand-green text-white shadow-sm"
                          : "border border-black/10 bg-white text-black/50 hover:bg-black/5"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/50 hover:bg-black/5 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function UserAvatar({ user }: { user: Employee }) {
  const avatar = typeof user.avatarUrl === "string" ? user.avatarUrl : "";

  if (!avatar) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF5F0] text-sm font-black text-brand-green">
        {String(user.name || "U").trim().charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={user.name || "User"}
      className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
    />
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black ${
        active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  green,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  green?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : green
          ? "bg-[#EAF5F0] text-brand-green hover:bg-[#DFF0E9]"
          : "bg-[#F4F8F6] text-black/50 hover:bg-[#EAF5F0] hover:text-brand-green"
      }`}
    >
      {children}
    </button>
  );
}
