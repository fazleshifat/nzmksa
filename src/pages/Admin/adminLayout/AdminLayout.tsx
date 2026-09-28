import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import AdminLogoutModal from "../components/AdminLogoutModal";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
    children,
}: AdminLayoutProps) {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await logout();

            navigate("/login", {
                replace: true,
            });
        } catch (err) {
            console.error(
                "ABSher Admin: Logout failed:",
                err
            );
        } finally {
            setLoggingOut(false);
            setLogoutOpen(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#F3F7F5] text-black">
            {/* =====================================================
          SIDEBAR
      ====================================================== */}
            <AdminSidebar
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* =====================================================
          RIGHT SIDE CONTENT
      ====================================================== */}
            <div className="lg:pl-[270px]">
                {/* TOPBAR */}
                <AdminTopbar
                    admin={admin}
                    onMenuClick={() =>
                        setMobileSidebarOpen(true)
                    }
                    onLogoutClick={() =>
                        setLogoutOpen(true)
                    }
                />

                {/* PAGE CONTENT */}
                {children}
            </div>

            {/* =====================================================
          LOGOUT MODAL
      ====================================================== */}
            <AdminLogoutModal
                open={logoutOpen}
                loading={loggingOut}
                onCancel={() => setLogoutOpen(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
}