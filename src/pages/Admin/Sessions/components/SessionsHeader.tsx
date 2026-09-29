import {
    Activity,
    RefreshCw,
} from "lucide-react";

interface SessionsHeaderProps {
    loading: boolean;
    onRefresh: () => void;
}

export default function SessionsHeader({
    loading,
    onRefresh,
}: SessionsHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <Activity
                        size={22}
                        className="text-emerald-600"
                    />

                    <h1 className="text-2xl font-black tracking-tight text-black">
                        Session Management
                    </h1>
                </div>

                <p className="mt-1 text-sm font-medium text-black/45">
                    Monitor and manage employee and admin sessions.
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-black/[0.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <RefreshCw
                    size={16}
                    className={
                        loading
                            ? "animate-spin"
                            : ""
                    }
                />

                Refresh
            </button>
        </div>
    );
}