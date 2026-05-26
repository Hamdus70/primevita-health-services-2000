import { create } from "zustand";
import { Application, ApplicationStatus } from "@/types/application";
import { useNotificationStore } from "@/stores/notification.store";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { triggerOnboarding } from "@/lib/onboarding";

interface AdminState {
  adminProfile: {
    name: string;
    email: string;
    phone: string;
    age: number;
    staffId: string;
    profileImage: string;
    lastLogin: string;
  };
  metrics: {
    totalPatients: number;
    totalStaff: number;
    pendingApprovals: number;
    scheduledInterviews: number;
    dailyRegistrations: number;
    activeAnnouncements: number;
    staffPresent: number;
    staffAbsent: number;
  };
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    database: "up" | "down";
    redis: "up" | "down";
    queue: number;
    lastUpdated: string;
  };
  applications: Application[];
  setAdminProfile: (profile: Partial<AdminState["adminProfile"]>) => void;
  setMetrics: (metrics: Partial<AdminState["metrics"]>) => void;
  setSystemHealth: (health: Partial<AdminState["systemHealth"]>) => void;
  setApplications: (apps: Application[]) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  adminProfile: {
    name: "John Admin",
    email: "admin@hospital.com",
    phone: "+1-555-010-9999",
    age: 45,
    staffId: "ADS-001",
    profileImage: "/admin.jpg",
    lastLogin: new Date().toISOString(),
  },
  metrics: {
    totalPatients: 0,
    totalStaff: 0,
    pendingApprovals: 0,
    scheduledInterviews: 0,
    dailyRegistrations: 0,
    activeAnnouncements: 0,
    staffPresent: 0,
    staffAbsent: 0,
  },
  systemHealth: {
    status: "healthy",
    database: "up",
    redis: "up",
    queue: 0,
    lastUpdated: new Date().toISOString(),
  },
  applications: [],
  setMetrics: (metrics) => set((state) => ({ metrics: { ...state.metrics, ...metrics } })),
  setSystemHealth: (health) => set((state) => ({ systemHealth: { ...state.systemHealth, ...health } })),
  setAdminProfile: (profile) => set((state) => ({ adminProfile: { ...state.adminProfile, ...profile } })),
  setApplications: (apps) => set({ applications: apps }),
  updateApplicationStatus: async (id, status) => {
    const app = get().applications.find(a => a.id === id);
    if (!app) return;
    
    try {
      await updateDoc(doc(db, "applications", id), { status, updatedAt: new Date().toISOString() });
      
      set((state) => ({
        applications: state.applications.map((a) =>
          a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
        ),
      }));

      if (status === 'APPROVED') {
        await triggerOnboarding(app);
      }
      
      useNotificationStore.getState().addNotification({
          title: "Application Status Updated",
          message: `Application ${id} status changed to ${status}`,
          type: "info"
      });
    } catch (error) {
      console.error("Firestore Update Error: ", error);
      useNotificationStore.getState().addNotification({
          title: "Error",
          message: "Failed to update application status.",
          type: "error"
      });
    }
  },
}));
