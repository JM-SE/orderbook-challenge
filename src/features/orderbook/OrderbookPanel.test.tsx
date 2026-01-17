import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderbookPanel } from "./OrderbookPanel";

jest.mock("./hooks/useOrderbook", () => ({
  useOrderbook: () => ({
    bids: [],
    asks: [],
    status: "connecting",
    error: null,
  }),
}));

describe("OrderbookPanel", () => {
  it("renders status label and selector", () => {
    render(<OrderbookPanel />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Connecting")).toBeInTheDocument();
    expect(screen.getByLabelText("Trading pair")).toBeInTheDocument();
  });

  it("changes symbol from selector", () => {
    render(<OrderbookPanel />);

    const select = screen.getByLabelText("Trading pair") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "ETHUSDT" } });

    expect(select.value).toBe("ETHUSDT");
  });
});
