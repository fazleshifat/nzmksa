import type { SessionTab } from "../types";

interface SessionsTabsProps {
    activeTab: SessionTab;
    onTabChange: (tab: SessionTab) => void;
}

const tabs: {
    id: SessionTab;
    label: string;
}[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "logged_out", label: "Logged Out" },
    { id: "expired", label: "Expired" },
    { id: "revoked", label: "Revoked" },
    { id: "employees", label: "Employees" },
    { id: "admins", label: "Admins" },
    { id: "superadmins", label: "Super Admins" },
];

export default function SessionsTabs({
    activeTab,
    onTabChange,
}: SessionsTabsProps) {
    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max gap-2 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-sm">
                {tabs.map((tab) => {
                    const isActive =
                        activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() =>
                                onTabChange(tab.id)
                            }
                            className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                isActive
                                    ? "bg-black text-white shadow-sm"
                                    : "text-black/45 hover:bg-black/[0.04] hover:text-black"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}