export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="h-3 w-28 animate-pulse rounded-full bg-neutral-200" />

          <div className="mt-3 h-11 w-64 max-w-full animate-pulse rounded-lg bg-neutral-200 sm:h-16 sm:w-96" />

          <div className="mt-5 max-w-2xl space-y-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />

            <div className="h-4 w-4/5 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mobile-scrollbar-hidden -mx-3 flex gap-2 overflow-hidden px-3 sm:mx-0 sm:px-0">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-neutral-200 sm:rounded-sm"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded-full bg-neutral-200" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <ProductCardSkeleton
              key={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-sm">
      <div className="aspect-[4/3] animate-pulse bg-neutral-200" />

      <div className="p-4 sm:p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />

        <div className="mt-3 h-7 w-4/5 animate-pulse rounded-md bg-neutral-200" />

        <div className="mt-4 space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-neutral-200" />

          <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-neutral-200" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200" />

          <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}