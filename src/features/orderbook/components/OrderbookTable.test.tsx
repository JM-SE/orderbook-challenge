import { render, screen } from "@testing-library/react";
import { OrderbookTable } from "./OrderbookTable";

describe("OrderbookTable", () => {
  it("renders 10 rows with placeholders when empty", () => {
    render(<OrderbookTable title="Bids" tone="bid" levels={[]} />);

    const placeholders = screen.getAllByText("—");
    expect(placeholders.length).toBeGreaterThanOrEqual(10);
  });
});
