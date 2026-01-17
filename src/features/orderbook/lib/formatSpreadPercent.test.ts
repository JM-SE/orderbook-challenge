import { formatSpreadPercent } from "./formatSpreadPercent";

describe("formatSpreadPercent", () => {
  it("uses more decimals for tiny spreads", () => {
    const formatted = formatSpreadPercent(0.00000123);
    expect(formatted).not.toBe("0.000%");
  });

  it("formats larger spreads with 3 decimals", () => {
    expect(formatSpreadPercent(0.0025)).toBe("0.250%");
  });
});
