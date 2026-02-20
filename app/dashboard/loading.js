'use client';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 bg-[#0a0e17]/95 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1a1f2e] rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area Skeleton */}
      <div className="flex-1 p-4">
        <div className="max-w-[1800px] mx-auto">
          {/* Toolbar Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 bg-[#1a1f2e] rounded-lg w-24 animate-pulse"></div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-8 w-10 bg-[#1a1f2e] rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex-1"></div>
            <div className="h-8 bg-[#1a1f2e] rounded-lg w-32 animate-pulse"></div>
          </div>

          {/* Chart Skeleton */}
          <div className="bg-[#0d1117] rounded-2xl border border-white/10 overflow-hidden">
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm">Loading chart...</p>
              </div>
            </div>
          </div>

          {/* Oscillator Skeleton */}
          <div className="mt-4 bg-[#0d1117] rounded-xl border border-white/10 h-32 animate-pulse"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="border-t border-white/10 bg-[#0a0e17] px-4 py-2">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
