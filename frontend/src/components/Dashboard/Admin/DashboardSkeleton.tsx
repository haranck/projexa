export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 pb-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="w-48 h-10 bg-white/5 rounded-xl animate-pulse" />
                    <div className="w-64 h-4 bg-white/2 rounded-lg animate-pulse" />
                </div>
                <div className="w-32 h-8 bg-white/3 rounded-xl animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-[#12121e]/85 backdrop-blur-xl rounded-2xl border border-white/5 p-6 space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="w-20 h-3 bg-white/5 rounded" />
                                <div className="w-24 h-8 bg-white/10 rounded" />
                            </div>
                            <div className="w-11 h-11 bg-white/5 rounded-xl" />
                        </div>
                        <div className="w-28 h-4 bg-white/2 rounded" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="h-[300px] bg-[#12121e]/85 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                    <div className="w-32 h-4 bg-white/5 rounded mb-8" />
                    <div className="w-full h-40 bg-white/2 rounded-xl" />
                </div>
                <div className="h-[300px] bg-[#12121e]/85 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                    <div className="w-32 h-4 bg-white/5 rounded mb-8" />
                    <div className="w-full h-40 bg-white/2 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="h-[400px] bg-[#12121e]/85 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                    <div className="w-32 h-4 bg-white/5 rounded mb-8" />
                    <div className="space-y-4">
                        <div className="w-full h-32 bg-white/2 rounded-xl" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="w-20 h-3 bg-white/2 rounded" />
                                <div className="w-12 h-3 bg-white/2 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="xl:col-span-2 h-[400px] bg-[#12121e]/85 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
                    <div className="w-32 h-4 bg-white/5 rounded mb-8" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-full h-12 bg-white/2 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};