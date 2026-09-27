import { useState } from "react";
import {
  Menu,
  ChevronDown,
  UserRound,
  LogOut,
  ShieldCheck,
} from "lucide-react";

interface Props {
  admin: any;
  onMenuClick: () => void;
  onLogoutClick: () => void;
}

export default function AdminTopbar({
  admin,
  onMenuClick,
  onLogoutClick,
}: Props) {
  const [open, setOpen] = useState(false);

  const adminName = admin?.name || "Administrator";
  const adminEmail = admin?.email || "admin@example.com";
  const adminImage =
    admin?.avatarUrl || admin?.imageUrl || admin?.profileImage || "";

  const initial = String(adminName).trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F8F6] text-black/55 hover:bg-[#EAF5F0] hover:text-brand-green lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
                Dashboard
              </span>
              <span className="hidden rounded-full bg-[#EAF5F0] px-2 py-0.5 text-[9px] font-black text-brand-green sm:inline-flex">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white px-2.5 py-2 transition hover:bg-[#F7FAF8]"
          >
            {adminImage ? (
              <img
                src={adminImage}
                alt={adminName}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5F0] text-sm font-black text-brand-green">
                {initial}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="max-w-[170px] truncate text-xs font-black">
                {adminName}
              </p>
              <p className="max-w-[170px] truncate text-[10px] font-medium text-black/35">
                {adminEmail}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`mr-1 text-black/35 transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <>
              <button
                aria-label="Close admin menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-3 rounded-xl bg-[#F7FAF8] p-3">
                  {adminImage ? (
                    <img
                      src={adminImage}
                      alt={adminName}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5F0] text-sm font-black text-brand-green">
                      {initial}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-xs font-black">{adminName}</p>
                    <p className="truncate text-[10px] text-black/40">
                      {adminEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    window.location.href = "/admin/profile";
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold text-black/60 transition hover:bg-[#F5F8F6] hover:text-black"
                >
                  <UserRound size={16} />
                  See Profile
                </button>

                <div className="my-1 border-t border-black/[0.06]" />

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLogoutClick();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-black text-red-500 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
