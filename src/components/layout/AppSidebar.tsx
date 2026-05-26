import React from "react";
import { Link } from "react-router-dom";
import { User, Menu, Settings, FileText, Bell, CreditCard, FolderOpen, HeartPulse, ClipboardList, Activity, BrainCircuit } from "lucide-react";

export function AppSidebar({ role }: { role: string }) {
  const isPatient = role === "PATIENT";

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen hidden md:flex flex-col p-4">
      <div className="font-bold text-2xl mb-8">NovaCare</div>
      <nav className="flex flex-col gap-4 flex-1">
        <Link to={isPatient ? "/patient/overview" : `/${role.toLowerCase()}`} className="flex items-center gap-2 hover:text-gray-300">
          <Menu className="w-5 h-5"/> Dashboard
        </Link>
        {(role === "ADMIN" || role === "SUPER_ADMIN") && (
          <>
            <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-gray-300">
              <Activity className="w-5 h-5"/> Admin Dashboard
            </Link>
            <Link to="/admin/patients" className="flex items-center gap-2 hover:text-gray-300">
              <User className="w-5 h-5"/> Patients
            </Link>
            <Link to="/admin/staff" className="flex items-center gap-2 hover:text-gray-300">
              <User className="w-5 h-5"/> Staff
            </Link>
            <Link to="/admin/finance" className="flex items-center gap-2 hover:text-gray-300">
              <CreditCard className="w-5 h-5"/> Finance
            </Link>
            <Link to="/admin/announcements" className="flex items-center gap-2 hover:text-gray-300">
              <Bell className="w-5 h-5"/> Announcements
            </Link>
            <Link to="/admin/notifications" className="flex items-center gap-2 hover:text-gray-300">
              <Bell className="w-5 h-5"/> Notifications
            </Link>
            {role === "SUPER_ADMIN" && (
              <>
                <Link to="/admin/audit-logs" className="flex items-center gap-2 hover:text-gray-300">
                  <FileText className="w-5 h-5"/> Audit Logs
                </Link>
                <Link to="/admin/system-health" className="flex items-center gap-2 hover:text-gray-300">
                  <HeartPulse className="w-5 h-5"/> System Health
                </Link>
              </>
            )}
          </>
        )}
        {(["DOCTOR", "NURSE", "CAREGIVER", "STAFF"].includes(role)) && (
          <>
            <Link to="/staff/patients" className="flex items-center gap-2 hover:text-gray-300">
              <User className="w-5 h-5"/> Patients
            </Link>
            <Link to="/staff/assignments" className="flex items-center gap-2 hover:text-gray-300">
              <ClipboardList className="w-5 h-5"/> Assignments
            </Link>
            <Link to="/staff/schedule" className="flex items-center gap-2 hover:text-gray-300">
              <Activity className="w-5 h-5"/> Schedule
            </Link>
            <Link to="/staff/attendance" className="flex items-center gap-2 hover:text-gray-300">
              <FileText className="w-5 h-5"/> Attendance
            </Link>
            <Link to="/staff/notifications" className="flex items-center gap-2 hover:text-gray-300">
              <Bell className="w-5 h-5"/> Notifications
            </Link>
          </>
        )}
        {isPatient && (
          <>
            <Link to="/patient/appointments" className="flex items-center gap-2 hover:text-gray-300">
              <ClipboardList className="w-5 h-5"/> Appointments
            </Link>
            <Link to="/patient/vitals" className="flex items-center gap-2 hover:text-gray-300">
              <Activity className="w-5 h-5"/> Vitals
            </Link>
            <Link to="/patient/care-plans" className="flex items-center gap-2 hover:text-gray-300">
              <HeartPulse className="w-5 h-5"/> Care Plans
            </Link>
            <Link to="/patient/medications" className="flex items-center gap-2 hover:text-gray-300">
              <FileText className="w-5 h-5"/> Medications
            </Link>
            <Link to="/patient/billing" className="flex items-center gap-2 hover:text-gray-300">
              <CreditCard className="w-5 h-5"/> Billing
            </Link>
            <Link to="/patient/announcements" className="flex items-center gap-2 hover:text-gray-300">
              <Bell className="w-5 h-5"/> Announcements
            </Link>
            <Link to="/patient/documents" className="flex items-center gap-2 hover:text-gray-300">
              <FolderOpen className="w-5 h-5"/> Documents
            </Link>
            <Link to="/patient/ai-insights" className="flex items-center gap-2 hover:text-gray-300">
              <BrainCircuit className="w-5 h-5"/> AI Insights
            </Link>
          </>
        )}
        {!isPatient && (
          <Link to="/reports" className="flex items-center gap-2 hover:text-gray-300">
            <FileText className="w-5 h-5"/> Reports
          </Link>
        )}
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        {isPatient && (
          <Link to="/patient/profile" className="flex items-center gap-2 hover:text-gray-300">
            <User className="w-5 h-5"/> Profile
          </Link>
        )}
        <Link to={isPatient ? "/patient/settings" : (role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/settings" : "/settings")} className="flex items-center gap-2 hover:text-gray-300">
          <Settings className="w-5 h-5"/> Settings
        </Link>
      </div>
    </aside>
  );
}
