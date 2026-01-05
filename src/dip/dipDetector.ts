import type { PriceSample } from "../price/types.js";

export type DipEvent = {
  ts: number;
  peakPrice: number;
  dipPrice: number;
  drawdownPct: number;
  dipLevel: number; // 1 = first -25% dip, 2 = -50%, etc (relative to peak)
};

export class DipDetector {
  private peak = 0;
  private lastDipLevelEmitted = 0;

  constructor(private threshold: number) {}

  public ingest(sample: PriceSample): DipEvent | null {
    const p = sample.priceUsd;

    // Track local peak
    if (p > this.peak) {
      this.peak = p;
      this.lastDipLevelEmitted = 0; // reset dips after new ATH/peak
      return null;
    }

    if (this.peak <= 0) return null;

    const drawdown = (this.peak - p) / this.peak; // 0.25 = -25%
    const dipLevel = Math.floor(drawdown / this.threshold);

    // Emit on each new dip level crossed (1,2,3...)
    if (dipLevel >= 1 && dipLevel > this.lastDipLevelEmitted) {
      this.lastDipLevelEmitted = dipLevel;
      return {
        ts: sample.ts,
        peakPrice: this.peak,
        dipPrice: p,
        drawdownPct: drawdown,
        dipLevel
      };
    }

    return null;
  }
}
