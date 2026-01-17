import { normalizeOrderbook } from "./normalizeOrderbook";

describe("normalizeOrderbook", () => {
  it("normalizes strings to numbers", () => {
    const result = normalizeOrderbook({
      lastUpdateId: 1,
      bids: [["100", "2"]],
      asks: [["101", "3"]],
    });

    expect(result).toEqual({
      bids: [{ price: 100, quantity: 2 }],
      asks: [{ price: 101, quantity: 3 }],
    });
  });

  it("sorts bids descending and asks ascending", () => {
    const result = normalizeOrderbook({
      lastUpdateId: 1,
      bids: [
        ["99", "1"],
        ["101", "1"],
        ["100", "1"],
      ],
      asks: [
        ["103", "1"],
        ["101", "1"],
        ["102", "1"],
      ],
    });

    expect(result.bids.map((l) => l.price)).toEqual([101, 100, 99]);
    expect(result.asks.map((l) => l.price)).toEqual([101, 102, 103]);
  });

  it("trims to top 10 by default", () => {
    const bids = Array.from({ length: 20 }, (_, i) => [String(200 - i), "1"] as const);
    const asks = Array.from({ length: 20 }, (_, i) => [String(100 + i), "1"] as const);

    const result = normalizeOrderbook({
      lastUpdateId: 1,
      bids: bids.map(([p, q]) => [p, q]),
      asks: asks.map(([p, q]) => [p, q]),
    });

    expect(result.bids).toHaveLength(10);
    expect(result.asks).toHaveLength(10);
    expect(result.bids[0].price).toBe(200);
    expect(result.asks[0].price).toBe(100);
  });

  it("filters invalid values", () => {
    const result = normalizeOrderbook({
      lastUpdateId: 1,
      bids: [
        ["100", "1"],
        ["NaN", "1"],
        ["-1", "1"],
      ],
      asks: [
        ["101", "1"],
        ["102", "Infinity"],
        ["103", "-5"],
      ],
    });

    expect(result.bids).toEqual([{ price: 100, quantity: 1 }]);
    expect(result.asks).toEqual([{ price: 101, quantity: 1 }]);
  });
});
