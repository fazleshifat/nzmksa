import { Search, X } from "lucide-react";

interface SessionsSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function SessionsSearch({
    search,
    onSearchChange,
}: SessionsSearchProps) {
    return (
        <div className="mb-5">
            <div className="relative">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Search by name, user ID, IP address, device..."
                    className="w-full rounded-2xl border border-black/[0.08] bg-white py-3.5 pl-11 pr-11 text-sm font-medium text-black outline-none transition placeholder:text-black/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black/40 transition hover:bg-black/[0.05] hover:text-black"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}