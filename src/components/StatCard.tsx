interface StatCardProps {
    value: string | number;
    label: string;
    color: 'purple' | 'blue' | 'green' | 'orange';
    loading?: boolean;
}

const colorClasses = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
};

export function StatCard({ value, label, color, loading = false }: StatCardProps) {
    return (
        <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center hover:bg-white/[0.07] transition-colors">
            <div className={`text-2xl font-bold ${colorClasses[color]}`}>
                {loading ? (
                    <div className="h-8 w-16 mx-auto bg-white/10 animate-pulse rounded" />
                ) : (
                    value
                )}
            </div>
            <div className="text-sm text-white/60 mt-1">{label}</div>
        </div>
    );
}
