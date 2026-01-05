export type TreasuryState = {
  devFeesUsd: number;
  profitsUsd: number;
  reinjectedUsd: number;
};

export class TreasuryLedger {
  private state: TreasuryState = { devFeesUsd: 0, profitsUsd: 0, reinjectedUsd: 0 };

  creditDevFees(amountUsd: number) {
    this.state.devFeesUsd += amountUsd;
  }

  creditProfits(amountUsd: number) {
    this.state.profitsUsd += amountUsd;
  }

  snapshot(): TreasuryState {
    return { ...this.state };
  }

  drainAll(): { devFeesUsd: number; profitsUsd: number; totalUsd: number } {
    const devFeesUsd = this.state.devFeesUsd;
    const profitsUsd = this.state.profitsUsd;
    const totalUsd = devFeesUsd + profitsUsd;
    this.state.devFeesUsd = 0;
    this.state.profitsUsd = 0;
    this.state.reinjectedUsd += totalUsd;
    return { devFeesUsd, profitsUsd, totalUsd };
  }
}
