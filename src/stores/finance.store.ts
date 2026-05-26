import { create } from "zustand";

interface FinanceState {
  metrics: {
    invoicesIssued: number;
    totalCollected: number;
    outstanding: number;
    overdue: number;
    partialPayments: number;
  };
  setMetrics: (metrics: Partial<FinanceState["metrics"]>) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  metrics: {
    invoicesIssued: 0,
    totalCollected: 0,
    outstanding: 0,
    overdue: 0,
    partialPayments: 0,
  },
  setMetrics: (metrics) => set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
}));
