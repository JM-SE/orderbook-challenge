import { computeDepthRatios } from "./computeDepthRatios";

describe("computeDepthRatios", () => {
  it("computes bar ratios relative to max qty", () => {
    const rows = computeDepthRatios(
      [
        { price: 100, quantity: 10 },
        { price: 99, quantity: 5 },
      ],
      10,
    );

    expect(rows[0].barRatio).toBe(1);
    expect(rows[1].barRatio).toBe(0.5);
  });

  it("returns 0 ratios when max qty is 0", () => {
    const rows = computeDepthRatios([{ price: 100, quantity: 0 }], 10);
    expect(rows[0].barRatio).toBe(0);
  });
});
