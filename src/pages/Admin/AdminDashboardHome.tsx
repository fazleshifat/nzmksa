import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, type Employee } from "../../api/api";

import AdminLayout from "./adminLayout/AdminLayout";
import AdminStats from "./components/AdminStats";
import AdminUsersTable from "./adminLayout/allUser/AdminUsersTable";

interface AdminUsersResponse {
  users: Employee[];
  total?: number;
}

const USERS_PER_PAGE = 10;

export default function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<Employee[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] =
    useState<Employee | null>(null);

  const fetchUsers = async () => {
    try {
      setError("");

      const response =
        await apiFetch<AdminUsersResponse>(
          "/api/admin/users"
        );

      setUsers(response.users || []);
    } catch (err) {
      console.error(
        "ABSher Admin: Failed to load users:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
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

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

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
      : (currentPage - 1) *
          USERS_PER_PAGE +
        1;

  const lastItem = Math.min(
    currentPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const userId =
      deleteTarget.id ||
      deleteTarget._id;

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

      setUsers((current) =>
        current.filter(
          (user) =>
            (user.id || user._id) !==
            userId
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "ABSher Admin: Failed to delete user:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete user"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <main className="mx-auto w-full max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* HEADER */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
            Overview
          </p>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
            Employee Management
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-black/45">
            Manage employee accounts, Iqama information
            and account access from one place.
          </p>
        </div>

        {/* STATS */}
        <AdminStats
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
          loading={loadingUsers}
        />

        {/* USERS TABLE */}
        <div className="mt-6">
          <AdminUsersTable
            users={paginatedUsers}
            totalFiltered={filteredUsers.length}
            firstItem={firstItem}
            lastItem={lastItem}
            currentPage={currentPage}
            totalPages={totalPages}
            search={search}
            loading={loadingUsers}
            refreshing={refreshing}
            error={error}
            deletingId={deletingId}
            onSearchChange={setSearch}
            onClearSearch={() => setSearch("")}
            onRefresh={handleRefresh}
            onCreate={() =>
              navigate("/admin/users/create")
            }
            onView={(id) =>
              navigate(`/admin/users/${id}`)
            }
            onEdit={(id) =>
              navigate(`/admin/users/${id}/edit`)
            }
            onDelete={(user) =>
              setDeleteTarget(user)
            }
            onRetry={fetchUsers}
            onPageChange={setCurrentPage}
          />
        </div>

      </main>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          deleting={Boolean(deletingId)}
          onCancel={() =>
            !deletingId &&
            setDeleteTarget(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
}

/* ================================================================
   DELETE MODAL
================================================================ */

function DeleteModal({
  user,
  deleting,
  onCancel,
  onConfirm,
}: {
  user: Employee;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="p-6 sm:p-7">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <span className="text-2xl">
              !
            </span>
          </div>

          <h2 className="mt-6 text-xl font-black">
            Delete Employee?
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/50">
            Are you sure you want to permanently
            delete{" "}
            <span className="font-black text-black/80">
              {user.name ||
                "this employee"}
            </span>
            ?
          </p>

          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs leading-5 text-red-600">
            This action cannot be undone. The
            employee account and stored information
            will be removed.
          </div>

        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-[#FAFCFB] p-5 sm:flex-row">

          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-red-500 px-5 py-3 text-xs font-black text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : "Yes, Delete"}
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-5 py-2 text-xs font-black text-black/60 transition hover:bg-black/5 disabled:opacity-50"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}