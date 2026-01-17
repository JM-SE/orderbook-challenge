import { OrderbookPanel } from "@/features/orderbook/OrderbookPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <OrderbookPanel />
    </main>
  );
}
