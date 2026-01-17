import { deriveSpreadMetrics } from "./deriveSpreadMetrics";

describe("deriveSpreadMetrics", () => {
  it("returns nulls when either side is missing", () => {
    expect(deriveSpreadMetrics([], [])).toEqual({
      bestBid: null,
      bestAsk: null,
      spread: null,
      spreadPct: null,
    });
  });

  it("computes spread and spreadPct when data is present", () => {
    const result = deriveSpreadMetrics(
      [{ price: 100, quantity: 1 }],
      [{ price: 101, quantity: 1 }],
    );

    expect(result.bestBid).toBe(100);
    expect(result.bestAsk).toBe(101);
    expect(result.spread).toBe(1);
    expect(result.spreadPct).not.toBeNull();
  });
});
