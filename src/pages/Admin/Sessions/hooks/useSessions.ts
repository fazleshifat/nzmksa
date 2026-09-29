import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    AdminSession,
    SessionsResponse,
} from "../types";
import { apiFetch } from "../../../../api/api";


interface EmployeeRecord {
    _id?: string;
    id?: string;
    name?: string;
    residentIdNumber?: string;
    avatarUrl?: string;
    image?: string;
    [key: string]: unknown;
}

export function useSessions() {
    const [sessions, setSessions] = useState<
        AdminSession[]
    >([]);

    const [employees, setEmployees] = useState<
        EmployeeRecord[]
    >([]);

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        loggedOut: 0,
        expired: 0,
        revoked: 0,
    });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [employeeError, setEmployeeError] =
        useState<string | null>(null);


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response =
                await apiFetch<SessionsResponse>(
                    "/api/admin/sessions"
                );

            setSessions(response.sessions ?? []);

            setStats(
                response.stats ?? {
                    total: 0,
                    active: 0,
                    loggedOut: 0,
                    expired: 0,
                    revoked: 0,
                }
            );
        } catch (error) {
            console.error(
                "Failed to fetch sessions:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load sessions."
            );
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchEmployees = useCallback(async () => {
        setEmployeeError(null);

        try {
            const response =
                await apiFetch<
                    EmployeeRecord[] |
                    { users?: EmployeeRecord[]; employees?: EmployeeRecord[] }
                >("/api/employees");

            if (Array.isArray(response)) {
                setEmployees(response);
                return;
            }

            setEmployees(
                response.users ??
                response.employees ??
                []
            );
        } catch (error) {
            console.error(
                "Failed to fetch employees:",
                error
            );

            setEmployees([]);

            setEmployeeError(
                error instanceof Error
                    ? error.message
                    : "Failed to load employee information."
            );
        }
    }, []);


    useEffect(() => {
        void fetchData();
        void fetchEmployees();
    }, [fetchData, fetchEmployees]);


    return {
        sessions,
        employees,
        stats,
        loading,
        error,
        employeeError,
        refresh: fetchData,
    };
}