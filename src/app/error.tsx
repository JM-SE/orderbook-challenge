"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-[var(--muted)]">
        An unexpected error occurred. You can try again to reload the view.
      </p>
      <button
        className="rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--bid)]"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
