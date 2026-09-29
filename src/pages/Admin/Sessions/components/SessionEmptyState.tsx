import { SearchX } from "lucide-react";

interface SessionEmptyStateProps {
    search?: string;
}

export default function SessionEmptyState({
    search,
}: SessionEmptyStateProps) {
    return (
        <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black/[0.04] text-black/35">
                <SearchX size={24} />
            </div>

            <h3 className="mt-4 text-sm font-black text-black">
                No sessions found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs font-medium leading-5 text-black/40">
                {search
                    ? "No sessions match your current search."
                    : "There are no sessions available for this filter."}
            </p>
        </div>
    );
}