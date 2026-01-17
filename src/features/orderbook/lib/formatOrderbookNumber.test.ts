import { formatOrderbookNumber } from "./formatOrderbookNumber";

describe("formatOrderbookNumber", () => {
  it("formats price with stable 2 decimals", () => {
    expect(formatOrderbookNumber(123.456, "price")).toBe("123.46");
  });

  it("does not render 0.00 for small non-zero quantities", () => {
    const formatted = formatOrderbookNumber(0.00000012, "quantity");
    expect(formatted).not.toBe("0.00");
  });
});
