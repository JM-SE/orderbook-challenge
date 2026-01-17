import { formatSpread } from "./formatSpread";

describe("formatSpread", () => {
  it("uses more decimals for small spreads", () => {
    expect(formatSpread(0.00001234)).not.toBe("0.00");
  });

  it("uses 2 decimals for large spreads", () => {
    expect(formatSpread(12.3456)).toBe("12.35");
  });
});
