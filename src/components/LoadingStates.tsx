export function ConversationSkeleton() {
    return (
        <div className="bg-white/5 rounded-xl border border-white/10 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-white/10" />
                    <div className="flex-1">
                        <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                </div>
            </div>
            <div className="h-4 bg-white/10 rounded w-full mb-2" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
        </div>
    );
}

export function AgentCardSkeleton() {
    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-black animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
            <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
            <div className="h-4 bg-white/10 rounded w-full mb-2" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center animate-pulse">
            <div className="h-8 w-16 mx-auto bg-white/10 rounded mb-2" />
            <div className="h-4 w-24 mx-auto bg-white/10 rounded" />
        </div>
    );
}
