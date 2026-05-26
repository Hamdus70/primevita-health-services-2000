import { create } from "zustand";

interface StaffState {
  currentStaffId: string | null;
  setCurrentStaff: (id: string | null) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  currentStaffId: null,
  setCurrentStaff: (id) => set({ currentStaffId: id }),
}));
