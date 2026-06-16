/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TopBar } from '@/components/layout/TopBar';
import { MissionVisionHeader } from '@/components/layout/MissionVisionHeader';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { BookingPage } from '@/pages/BookingPage';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ContactPage } from '@/pages/ContactPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { CredentialSetup } from '@/pages/auth/CredentialSetup';
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard';
import { ClinicalDashboard } from '@/pages/dashboard/ClinicalDashboard';
import { PatientPortal } from '@/pages/dashboard/PatientPortal';
import { DashboardRouter } from '@/pages/dashboard/DashboardRouter';
import { FamilyPortal } from '@/pages/dashboard/FamilyPortal';
import { LicensePage } from '@/pages/LicensePage';
import { SearchPage } from '@/pages/SearchPage';
import { CompanyProfile } from '@/pages/CompanyProfile';
import { HomeNursingPage } from '@/pages/HomeNursingPage';
import { ElderlyCarePage } from '@/pages/ElderlyCarePage';
import { PostHospitalRecoveryPage } from '@/pages/PostHospitalRecoveryPage';
import { DementiaCarePage } from '@/pages/DementiaCarePage';
import { PhysiotherapyPage } from '@/pages/PhysiotherapyPage';
import { FAQPage } from '@/pages/FAQPage';
import { ReferralFormPage } from '@/pages/ReferralFormPage';
import { ApplicationPortal } from '@/pages/ApplicationPortal';
import ApplicationTracker from '@/pages/ApplicationTracker';
import { RoleSwitcher } from '@/components/dev/RoleSwitcher';
import { CommandPalette } from '@/components/CommandPalette';
import { TelehealthChatWidget } from '@/components/TelehealthChatWidget';

import TrackProgressPage from '@/pages/TrackProgressPage';
import { Providers } from './app/providers';

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
        <CommandPalette />
        <RoleSwitcher />
        <TelehealthChatWidget />
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={
            <>
              <MissionVisionHeader />
              <TopBar />
              <Header />
              <main className="flex-1">
                <HomePage />
              </main>
              <Footer />
            </>
          } />
          <Route path="/about" element={<><MissionVisionHeader /><TopBar /><Header /><main className="flex-1"><AboutPage /></main><Footer /></>} />
          <Route path="/book" element={<><MissionVisionHeader /><TopBar /><Header /><main className="flex-1"><BookingPage /></main><Footer /></>} />
          <Route path="/assessment" element={<><MissionVisionHeader /><TopBar /><Header /><main className="flex-1"><AssessmentPage /></main><Footer /></>} />
          <Route path="/apply" element={<ApplicationPortal />} />
          <Route path="/track-application" element={<TrackProgressPage />} />
          <Route path="/track-application/:token" element={<ApplicationTracker />} />
          <Route path="/interview/:token" element={
             <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                 <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#10837f] text-center max-w-md">
                    <h2 className="text-2xl font-bold text-[#0e4e5e] mb-2">Secure Interview Portal</h2>
                    <p className="text-gray-600 mb-6">This environment simulates a secure virtual CBT and interview room accessible only via the generated tracking link.</p>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium" onClick={() => window.history.back()}>Exit Interview Room</button>
                 </div>
             </div>
          } />
          <Route path="/services" element={<><TopBar /><Header /><main className="flex-1"><ServicesPage /></main><Footer /></>} />
          <Route path="/services/home-nursing" element={<><TopBar /><Header /><main className="flex-1"><HomeNursingPage /></main><Footer /></>} />
          <Route path="/services/elderly-care" element={<><TopBar /><Header /><main className="flex-1"><ElderlyCarePage /></main><Footer /></>} />
          <Route path="/services/post-hospital-recovery" element={<><TopBar /><Header /><main className="flex-1"><PostHospitalRecoveryPage /></main><Footer /></>} />
          <Route path="/services/dementia-care" element={<><TopBar /><Header /><main className="flex-1"><DementiaCarePage /></main><Footer /></>} />
          <Route path="/services/physiotherapy" element={<><TopBar /><Header /><main className="flex-1"><PhysiotherapyPage /></main><Footer /></>} />
          <Route path="/faqs" element={<><TopBar /><Header /><main className="flex-1"><FAQPage /></main><Footer /></>} />
          <Route path="/refer-patient" element={<><TopBar /><Header /><main className="flex-1"><ReferralFormPage /></main><Footer /></>} />
          <Route path="/contact" element={<><TopBar /><Header /><main className="flex-1"><ContactPage /></main><Footer /></>} />
          <Route path="/license" element={<><TopBar /><Header /><main className="flex-1"><LicensePage /></main><Footer /></>} />
          <Route path="/search" element={<><TopBar /><Header /><main className="flex-1"><SearchPage /></main><Footer /></>} />
          <Route path="/brochure" element={<CompanyProfile />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth/setup" element={<CredentialSetup />} />

          {/* Dashboard Routes (Protected in real app) */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          <Route path="/dashboard/clinical/*" element={<ClinicalDashboard />} />
          <Route path="/portal/*" element={<PatientPortal />} />
          <Route path="/family-portal/*" element={<FamilyPortal />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  </Providers>
  );
}

