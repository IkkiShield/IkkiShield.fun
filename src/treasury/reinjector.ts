import type { DipEvent } from "../dip/dipDetector.js";
import { TreasuryLedger } from "./ledger.js";

export type ReinjectPlan = {
  ts: number;
  reason: string;
  dip: DipEvent;
  devFeesUsd: number;
  profitsUsd: number;
  totalUsd: number;
};

export function planReinject(ledger: TreasuryLedger, dip: DipEvent): ReinjectPlan {
  const drained = ledger.drainAll();
  return {
    ts: Date.now(),
    reason: `Dip level ${dip.dipLevel} reached (>= ${(dip.dipLevel * 25).toFixed(0)}% from peak).`,
    dip,
    ...drained
  };
}

// LARP: this is intentionally non-trading. It just returns a pretend “tx id”.
export async function executeReinject(plan: ReinjectPlan): Promise<{ txId: string }> {
  // In real life you’d do onchain swaps here. We do NOT.
  const txId = `LARP_TX_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  return { txId };
}
