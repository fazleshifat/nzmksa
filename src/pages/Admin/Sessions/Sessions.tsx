import { useMemo, useState } from "react";

import { AlertCircle, Users } from "lucide-react";

import type {
  AdminSession,
  SessionTab,
} from "./types";


import SessionsHeader from "./components/SessionsHeader";
import SessionsStats from "./components/SessionsStats";
import SessionsSearch from "./components/SessionsSearch";
import SessionsTabs from "./components/SessionsTabs";
import SessionsTable from "./components/SessionsTable";
import SessionMobileList from "./components/SessionMobileList";
import SessionEmptyState from "./components/SessionEmptyState";
import SessionDetails from "./components/SessionDetails";
import { apiFetch } from "../../../api/api";
import { useSessions } from "./hooks/useSessions";


interface EmployeeRecord {
  _id?: string;
  id?: string;
  name?: string;
  residentIdNumber?: string;
  avatarUrl?: string;
  image?: string;
  [key: string]: unknown;
}


export default function Sessions() {
  const {
    sessions,
    employees,
    stats,
    loading,
    error,
    employeeError,
    refresh,
  } = useSessions();


  const [activeTab, setActiveTab] =
    useState<SessionTab>("all");

  const [search, setSearch] =
    useState("");

  const [selectedSession, setSelectedSession] =
    useState<AdminSession | null>(null);


  const filteredSessions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return sessions.filter((session) => {
      /* -----------------------------
       * TAB FILTER
       * ----------------------------- */

      let matchesTab = true;

      switch (activeTab) {
        case "active":
          matchesTab =
            session.status === "active";
          break;

        case "logged_out":
          matchesTab =
            session.status === "logged_out";
          break;

        case "expired":
          matchesTab =
            session.status === "expired";
          break;

        case "revoked":
          matchesTab =
            session.status === "revoked";
          break;

        case "employees":
          matchesTab =
            session.userType === "employee";
          break;

        case "admins":
          matchesTab =
            session.userType === "admin";
          break;

        case "superadmins":
          matchesTab =
            session.userType === "superadmin";
          break;

        case "all":
        default:
          matchesTab = true;
          break;
      }


      if (!matchesTab) {
        return false;
      }


      /* -----------------------------
       * SEARCH FILTER
       * ----------------------------- */

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        session.name,
        session.userId,
        session.device,
        session.browser,
        session.os,
        session.ipAddress,
        session.location?.country,
        session.location?.city,
        session.location?.region,
        session.userType,
        session.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedSearch
      );
    });
  }, [sessions, activeTab, search]);


  /* --------------------------------
   * FIND EMPLOYEE
   * -------------------------------- */

  const findEmployee = (
    userId: string
  ): EmployeeRecord | undefined => {
    return employees.find((employee) => {
      const employeeId =
        employee._id ??
        employee.id ??
        employee.residentIdNumber;

      return employeeId === userId;
    });
  };


  /* --------------------------------
   * FORCE LOGOUT
   * -------------------------------- */

  const handleForceLogout = async (
    session: AdminSession
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to force logout ${session.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(
        `/api/admin/sessions/${session._id}/revoke`,
        {
          method: "PATCH",
        }
      );

      setSelectedSession(null);

      await refresh();
    } catch (error) {
      console.error(
        "Failed to force logout session:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to logout session."
      );
    }
  };


  /* --------------------------------
   * DELETE SESSION
   * -------------------------------- */

  const handleDeleteSession = async (
    session: AdminSession
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the session for ${session.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiFetch(
        `/api/admin/sessions/${session._id}`,
        {
          method: "DELETE",
        }
      );

      setSelectedSession(null);

      await refresh();
    } catch (error) {
      console.error(
        "Failed to delete session:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete session."
      );
    }
  };


  return (
    <div className="min-h-full bg-[#f7f8f7] p-4 md:p-6">

      {/* --------------------------------
             * HEADER
             * -------------------------------- */}

      <SessionsHeader
        loading={loading}
        onRefresh={refresh}
      />


      {/* --------------------------------
             * STATS
             * -------------------------------- */}

      <SessionsStats
        stats={stats}
      />


      {/* --------------------------------
             * EMPLOYEE API WARNING
             * -------------------------------- */}

      {employeeError && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-800">
          <Users
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-xs font-black">
              Employee information unavailable
            </p>

            <p className="mt-1 text-[11px] font-medium leading-5">
              {employeeError}
            </p>
          </div>
        </div>
      )}


      {/* --------------------------------
             * SESSION API ERROR
             * -------------------------------- */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-700">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="text-xs font-black">
              Failed to load sessions
            </p>

            <p className="mt-1 text-[11px] font-medium leading-5">
              {error}
            </p>
          </div>
        </div>
      )}


      {/* --------------------------------
             * SEARCH
             * -------------------------------- */}

      <SessionsSearch
        search={search}
        onSearchChange={setSearch}
      />


      {/* --------------------------------
             * TABS
             * -------------------------------- */}

      <SessionsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />


      {/* --------------------------------
             * LOADING
             * -------------------------------- */}

      {loading && (
        <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black" />

          <p className="mt-4 text-xs font-bold text-black/40">
            Loading sessions...
          </p>
        </div>
      )}


      {/* --------------------------------
             * SESSION RESULTS
             * -------------------------------- */}

      {!loading &&
        filteredSessions.length > 0 && (
          <>
            <SessionsTable
              sessions={filteredSessions}
              employees={employees}
              onSelectSession={setSelectedSession}
            />

            <SessionMobileList
              sessions={filteredSessions}
              onSelectSession={
                setSelectedSession
              }
            />
          </>
        )}


      {/* --------------------------------
             * EMPTY STATE
             * -------------------------------- */}

      {!loading &&
        filteredSessions.length === 0 && (
          <SessionEmptyState
            search={search}
          />
        )}


      {/* --------------------------------
             * SESSION DETAILS DRAWER
             * -------------------------------- */}

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          employee={findEmployee(
            selectedSession.userId
          )}
          onClose={() =>
            setSelectedSession(null)
          }
          onForceLogout={
            handleForceLogout
          }
          onDelete={
            handleDeleteSession
          }
        />
      )}

    </div>
  );
}