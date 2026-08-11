export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="h-4 w-64 max-w-full animate-pulse rounded-full bg-neutral-200" />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-7 px-3 py-5 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <div className="-mx-3 aspect-[4/3] animate-pulse bg-neutral-200 sm:mx-0 sm:rounded-sm" />

          <div className="px-1 sm:px-0">
            <div className="h-3 w-28 animate-pulse rounded-full bg-neutral-200" />

            <div className="mt-4 h-12 w-4/5 animate-pulse rounded-lg bg-neutral-200 sm:h-16" />

            <div className="mt-5 space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />

              <div className="h-4 w-4/5 animate-pulse rounded-full bg-neutral-200" />
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 border-y border-neutral-200 py-5">
              <div>
                <div className="h-3 w-16 animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-3 h-5 w-24 animate-pulse rounded-full bg-neutral-200" />
              </div>

              <div>
                <div className="h-3 w-12 animate-pulse rounded-full bg-neutral-200" />
                <div className="mt-3 h-5 w-24 animate-pulse rounded-full bg-neutral-200" />
              </div>
            </div>

            <div className="mt-5 h-4 w-40 animate-pulse rounded-full bg-neutral-200" />
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-20">
          <div>
            <div className="h-3 w-28 animate-pulse rounded-full bg-neutral-200" />

            <div className="mt-4 h-10 w-40 animate-pulse rounded-lg bg-neutral-200" />

            <div className="mt-6 space-y-3">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-full animate-pulse rounded-full bg-neutral-200"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="h-8 w-36 animate-pulse rounded-lg bg-neutral-200" />

            <div className="mt-6 space-y-3">
              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-neutral-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}