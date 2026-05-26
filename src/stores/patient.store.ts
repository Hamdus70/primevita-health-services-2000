import { create } from "zustand";

interface PatientState {
  currentPatientId: string | null;
  setCurrentPatient: (id: string | null) => void;
  recentPatients: string[];
  addRecentPatient: (id: string) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  currentPatientId: null,
  setCurrentPatient: (id) => set({ currentPatientId: id }),
  recentPatients: [],
  addRecentPatient: (id) => 
    set((state) => ({
      recentPatients: [id, ...state.recentPatients.filter(p => p !== id)].slice(0, 10)
    })),
}));
