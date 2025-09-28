import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Route-level loader shown while /search is streaming/SSR
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <div className="mb-2">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-5 w-72 mb-6" />

        {/* Sticky Filters bar placeholder */}
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-3 md:p-4 mb-8 border border-orange-100 sticky top-16 z-40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Cards grid placeholder */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden border-0 shadow rounded-xl bg-white"
              aria-hidden
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
