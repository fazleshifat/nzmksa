import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

const links = [
  {
    label: "All Users",
    description: "Employee accounts",
    icon: Users,
    to: "/admin",
  },
  {
    label: "All Iqama ID",
    description: "Iqama records",
    icon: CreditCard,
    to: "/admin/all-iqama",
  },
  {
    label: "All Admin",
    description: "All Admin profile",
    icon: ShieldCheck,
    to: "/admin/all-profile",
  },
];

export default function AdminSidebar({ mobileOpen, onClose }: Props) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-black/[0.06] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[78px] items-center justify-between border-b border-black/[0.06] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green text-lg font-black text-white shadow-[0_8px_20px_rgba(25,118,83,0.18)]">
              A
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green">
                Absher
              </p>
              <p className="text-sm font-black">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-black/40 hover:bg-black/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/30">
            Management
          </p>

          <nav className="mt-3 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-3.5 py-3 transition ${
                      isActive
                        ? "bg-[#EAF5F0] text-brand-green"
                        : "text-black/50 hover:bg-[#F5F8F6] hover:text-black/80"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-white text-brand-green shadow-sm"
                            : "bg-[#F5F8F6]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black">{link.label}</p>
                        <p className="mt-0.5 text-[10px] font-medium opacity-50">
                          {link.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className={`transition ${
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-3xl bg-[#173D31] p-5 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <LayoutDashboard size={18} />
            </div>

            <p className="mt-4 text-sm font-black">Admin Workspace</p>
            <p className="mt-1 text-[11px] leading-5 text-white/50">
              Secure employee management dashboard.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold text-white/60">
                System connected
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
