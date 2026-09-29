import {
    LogOut,
    Trash2,
} from "lucide-react";

import type { AdminSession } from "../types";

interface SessionActionsProps {
    session: AdminSession;
    onForceLogout: (
        session: AdminSession
    ) => Promise<void>;
    onDelete: (
        session: AdminSession
    ) => Promise<void>;
}

export default function SessionActions({
    session,
    onForceLogout,
    onDelete,
}: SessionActionsProps) {
    return (
        <div className="mt-8 border-t border-black/[0.06] pt-6">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-black/40">
                Session Actions
            </h3>

            {session.status === "active" && (
                <>
                    <button
                        type="button"
                        onClick={() =>
                            onForceLogout(session)
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99]"
                    >
                        <LogOut size={17} />
                        Force Logout
                    </button>

                    <p className="mt-3 text-center text-[10px] font-medium text-black/35">
                        Active sessions must be
                        forcefully logged out before
                        they can be deleted.
                    </p>
                </>
            )}

            {session.status !== "active" && (
                <button
                    type="button"
                    onClick={() =>
                        onDelete(session)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-black text-red-700 transition hover:bg-red-100 active:scale-[0.99]"
                >
                    <Trash2 size={17} />
                    Delete Session
                </button>
            )}
        </div>
    );
}