import type { ReactNode } from "react";

interface AdminPageLayoutProps {
    children: ReactNode;
}

export default function AdminPageLayout({
    children,
}: AdminPageLayoutProps) {
    return (
        <div className="admin-page-scrollbar min-h-[100dvh] w-full bg-[#F5F8F6]">
            {children}
        </div>
    );
}