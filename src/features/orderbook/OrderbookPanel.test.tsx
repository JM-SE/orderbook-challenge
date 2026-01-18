import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { BINANCE_DEPTH_INTERVAL_MS, BINANCE_DEPTH_LEVELS } from "./lib/binance/binanceWsConfig";
import { OrderbookPanel } from "./OrderbookPanel";

const useOrderbookMock = jest.fn();

jest.mock("./hooks/useOrderbook", () => ({
  useOrderbook: (...args: unknown[]) => useOrderbookMock(...args),
}));

beforeEach(() => {
  useOrderbookMock.mockReturnValue({
    bids: [],
    asks: [],
    status: "connecting",
    error: null,
  });
});

describe("OrderbookPanel", () => {
  it("renders status label and selector", () => {
    render(<OrderbookPanel />);

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Connecting")).toBeInTheDocument();
    expect(screen.getByLabelText("Trading pair")).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`Depth\\s+${BINANCE_DEPTH_LEVELS}\\s+•\\s+${BINANCE_DEPTH_INTERVAL_MS}ms`))
    ).toBeInTheDocument();
  });

  it("changes symbol from selector", () => {
    render(<OrderbookPanel />);

    const select = screen.getByLabelText("Trading pair") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "ETHUSDT" } });

    expect(select.value).toBe("ETHUSDT");
  });

  it("renders Error state with a message", () => {
    useOrderbookMock.mockReturnValue({
      bids: [],
      asks: [],
      status: "error",
      error: "boom",
    });

    render(<OrderbookPanel />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders at least one bid and ask row when data is present", () => {
    useOrderbookMock.mockReturnValue({
      bids: [{ price: 100, quantity: 0.1 }],
      asks: [{ price: 101, quantity: 0.2 }],
      status: "connected",
      error: null,
    });

    render(<OrderbookPanel />);

    expect(screen.getByText("100.00")).toBeInTheDocument();
    expect(screen.getByText("101.00")).toBeInTheDocument();
    expect(screen.getByText("Spread")).toBeInTheDocument();
  });
});
