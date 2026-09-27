import { AlertTriangle, LogOut, X } from "lucide-react";

interface Props {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AdminLogoutModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="w-full max-w-[430px] overflow-hidden rounded-[30px] border border-black/[0.05] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7E8] text-[#C27A00]">
              <LogOut size={23} />
            </div>

            {!loading && (
              <button
                type="button"
                onClick={onCancel}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-black/30 hover:bg-black/5 hover:text-black/60"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <h2 className="mt-6 text-xl font-black tracking-tight">
            Are you sure you want to logout?
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/50">
            You will be signed out of the admin dashboard and returned to the
            login screen.
          </p>

          <div className="mt-5 flex gap-3 rounded-2xl border border-[#F2E2C0] bg-[#FFF9EE] p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-[#C27A00]"
            />
            <p className="text-[11px] leading-5 text-[#9A650A]">
              Make sure all changes are saved before leaving the admin panel.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-[#FAFCFB] p-5 sm:flex-row">
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-xs font-black text-white shadow-[0_8px_20px_rgba(239,68,68,0.16)] transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={15} />
            {loading ? "Logging out..." : "Yes, Logout"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-5 text-xs font-black text-black/60 transition hover:bg-black/5 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
