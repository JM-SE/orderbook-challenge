export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-8">
      <h1 className="text-3xl font-semibold">Orderbook Viewer</h1>
      <p className="text-sm text-muted-foreground">
        WebSocket-first Binance orderbook UI (Next.js 14 + React 18 + TypeScript).
      </p>
      <p className="text-sm text-muted-foreground">
        Implementation is spec-driven. See <code>docs/SPEC.md</code> and
        <code> docs/implementation-tasks/</code>.
      </p>
    </main>
  );
}
