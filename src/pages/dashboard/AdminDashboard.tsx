import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Users, Activity, Building, Calculator, 
    FileText, UserCog, UserCheck, UserX, 
    Bell, CreditCard, Megaphone, DollarSign, 
    Clock, ShieldCheck, CheckCircle2, AlertCircle,
    User, Search, Plus, FileSignature, Calendar, Video, History, Database, ArrowRight,
    Star, MessageSquareQuote
} from 'lucide-react';
import { AIInvestigatorAdminView } from './components/AIInvestigatorAdminView';
import { AdminEmergencyAlerts } from '@/components/GlobalEmergencyAlert';

// --- MOCK DATA ---
const ADMIN_PROFILE = {
    name: 'Dr. Tunde Bakare',
    email: 'admin@bukkahospital.com',
    phone: '+234 800 123 4567',
    age: '45',
    staffId: 'ADM-001',
    photoUrl: '', // Simulate image
    lastLogin: 'Today, 08:30 AM'
};

const INITIAL_METRICS = {
    activePatients: 142,
    activeStaff: 86,
    pendingApps: 15,
    scheduledInterviews: 4,
    staffPresentToday: 78,
    staffAbsentToday: 8,
    patientsPendingPayments: 24
};

const INITIAL_APPLICATIONS = [
    { id: 'APP-101', name: 'Dr. Jane Smith', type: 'Staff', role: 'Doctor', date: '2023-11-20', status: 'Pending Review', email: 'jane@example.com', phone: '08012345678' },
    { id: 'APP-102', name: 'Mr. Emmanuel Joseph', type: 'Patient', role: 'Patient', date: '2023-11-21', status: 'Interview Scheduled', email: 'emmanuel@example.com', phone: '09087654321' },
    { id: 'APP-103', name: 'Nurse Olamide', type: 'Staff', role: 'Nurse', date: '2023-11-22', status: 'Pending Review', email: 'olamide@example.com', phone: '07011223344' },
    { id: 'APP-104', name: 'Mrs. Kemi', type: 'Patient', role: 'Patient', date: '2023-11-22', status: 'Pending Review', email: 'kemi@example.com', phone: '09011122233' }
];

const INITIAL_INTERVIEWS = [
    { id: 'INT-01', candidate: 'Mr. Emmanuel Joseph', role: 'Patient Intake', date: 'Tomorrow, 10:00 AM', mode: 'Virtual', status: 'Scheduled' },
    { id: 'INT-02', candidate: 'PT. Chuks', role: 'Physiotherapist', date: 'Today, 2:00 PM', mode: 'Physical', status: 'Scheduled' },
];

const INITIAL_STAFF_LIST = [
    { id: '1', name: 'Nurse Sarah Jenkins', role: 'Nurse', staffId: 'HSP-NUR-0001', department: 'Home Care', status: 'Present', presentDays: 20, absentDays: 1, attendancePercent: 95 },
    { id: '2', name: 'Dr. Michael Chen', role: 'Doctor', staffId: 'HSP-DOC-0002', department: 'Internal Med', status: 'Absent', presentDays: 18, absentDays: 3, attendancePercent: 85 },
    { id: '3', name: 'PT. David Ojo', role: 'Physiotherapist', staffId: 'HSP-PHY-0003', department: 'Rehabilitation', status: 'Present', presentDays: 21, absentDays: 0, attendancePercent: 100 },
];

const INITIAL_PATIENT_LIST = [
    { id: '1', name: 'Mrs. Folashade Adebayo', patientId: 'CL-FA-0001', assignedStaff: 'Nurse Sarah Jenkins', admissionStatus: 'Admitted', paymentStatus: 'Paid', amountDue: 0 },
    { id: '2', name: 'Mr. Chinedu Okafor', patientId: 'CL-CO-0002', assignedStaff: 'Dr. Michael Chen', admissionStatus: 'Under Care', paymentStatus: 'Pending', amountDue: 150000 },
    { id: '3', name: 'Alhaji Musa Bala', patientId: 'CL-MB-0003', assignedStaff: 'Unassigned', admissionStatus: 'Discharged', paymentStatus: 'Overdue', amountDue: 45000 },
];

const INITIAL_NOTIFICATIONS = [
    { id: '1', type: 'PAYMENT', message: 'Payment of ₦150k for Mr. Chinedu is due tomorrow.', time: '10 mins ago', status: 'unread' },
    { id: '2', type: 'SYSTEM', message: 'Nurse Sarah Jenkins registered in the system.', time: '1 hour ago', status: 'read' },
    { id: '3', type: 'ASSIGNMENT', message: 'Patient Alhaji Musa needs staff assignment.', time: '2 hours ago', status: 'unread' },
];

const INITIAL_ANNOUNCEMENTS = [
    { id: '1', title: 'Eid-El-Kabir Public Holiday', target: 'Global', time: 'Yesterday', body: 'Please note the revised shifts for the upcoming holiday.' }
];

const INITIAL_AUDIT_LOGS = [
    { id: '1', adminId: 'ADM-001', action: 'Approved Staff Application for Dr. Jane Smith', time: 'Today, 09:12 AM' },
    { id: '2', adminId: 'ADM-001', action: 'Scheduled Interview for Mr. Emmanuel Joseph', time: 'Yesterday, 14:30 PM' },
    { id: '3', adminId: 'SYSTEM', action: 'Automated Attendance: Marked 8 staff absent', time: 'Today, 00:00 AM' },
    { id: '4', adminId: 'ADM-001', action: 'Assigned Patient PT-0001 to Nurse Sarah Jenkins', time: '2 days ago' }
];

// --- SEQUENCE GENERATOR MOCK DB ---
let patientSequence = INITIAL_PATIENT_LIST.length + 1;
let staffSequence = INITIAL_STAFF_LIST.length + 1;

const extractInitials = (name: string) => {
    const parts = name.split(' ').filter(p => p.trim() !== '');
    if (parts.length === 0) return 'XX';
    const first = parts[0][0]?.toUpperCase() || 'X';
    const last = parts.length > 1 ? parts[parts.length - 1][0]?.toUpperCase() : 'X';
    return `${first}${last}`;
};

const generatePatientId = (name: string) => {
    // Simulated Database Transaction & Row Lock here
    const seq = patientSequence;
    patientSequence++;
    const initials = extractInitials(name);
    return `CL-${initials}-${seq.toString().padStart(4, '0')}`;
};

const generateStaffId = (role: string) => {
    // Simulated Database Transaction & Row Lock here
    const seq = staffSequence;
    staffSequence++;
    let prefix = 'STF';
    const normalized = role.toLowerCase();
    if (normalized.includes('nurse')) prefix = 'NUR';
    else if (normalized.includes('doctor')) prefix = 'DOC';
    else if (normalized.includes('caregiver')) prefix = 'CRG';
    else if (normalized.includes('physiotherapist')) prefix = 'PHY';
    else prefix = role.substring(0, 3).toUpperCase();
    return `HSP-${prefix}-${seq.toString().padStart(4, '0')}`;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  // States for interactive lists
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [interviews, setInterviews] = useState(INITIAL_INTERVIEWS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF_LIST);
  const [patientList, setPatientList] = useState(INITIAL_PATIENT_LIST);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  
  // Testimonials state and handlers
  const [adminTestimonials, setAdminTestimonials] = useState<any[]>([]);

  const handleApproveTestimonial = async (id: string) => {
      try {
          await updateDoc(doc(db, 'testimonials', id), { isApproved: true });
          toast.success("Testimonial approved & made live instantly!");
      } catch (err) {
          toast.error("Failed to approve testimonial.");
      }
  };

  const handleRejectTestimonial = async (id: string) => {
      try {
          await updateDoc(doc(db, 'testimonials', id), { isApproved: false });
          toast.info("Testimonial set back to draft / pending review.");
      } catch (err) {
          toast.error("Failed to reset testimonial status.");
      }
  };

  const handleDeleteTestimonial = async (id: string) => {
      if (confirm("Are you sure you want to permanently delete this client story?")) {
          try {
              const { deleteDoc } = await import('firebase/firestore');
              await deleteDoc(doc(db, 'testimonials', id));
              toast.success("Client story permanently deleted.");
          } catch (err) {
              toast.error("Failed to delete client story.");
          }
      }
  };
  
  // Assignment dialog state
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentStaffId, setAssignmentStaffId] = useState('');

  const handleAssignStaff = () => {
    if (!selectedPatient) return;
    const staff = staffList.find(s => s.staffId === assignmentStaffId);
    
    setPatientList(prev => prev.map(p => 
        p.id === selectedPatient.id 
            ? { ...p, assignedStaff: staff ? staff.name : 'Unassigned' } 
            : p
    ));
    toast.success(`Assigned ${staff?.name || 'Unassigned'} to ${selectedPatient.name}`);
    setIsAssignmentModalOpen(false);
    setSelectedPatient(null);
  };
  
  // Announcement form states
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('Global');

  // Action Handlers
  const handleApproveApp = async (appId: string, name: string) => {
      const app = applications.find(a => a.id === appId);
      if (!app) return;
      
      if (!appId.startsWith('APP-')) {
          try {
              await updateDoc(doc(db, 'applications', appId), { status: 'Approved' });
          } catch(err) {
              console.error(err);
          }
      }

      setApplications(prev => prev.filter(a => a.id !== appId));
      setMetrics(prev => ({ ...prev, pendingApps: Math.max(0, prev.pendingApps - 1) }));
      
      let assignedId = '';
      if (app.type === 'Staff') {
         assignedId = generateStaffId(app.role);
         if (!appId.startsWith('APP-')) {
             try {
                 await addDoc(collection(db, 'users'), {
                     fullName: app.name,
                     firstName: app.name.split(' ')[0],
                     lastName: app.name.split(' ').slice(1).join(' '),
                     role: app.role.toLowerCase(),
                     email: app.email,
                     phone: app.phone,
                     department: app.role === 'Doctor' ? 'Internal Med' : 'Home Care',
                     staffId: assignedId,
                     createdAt: serverTimestamp()
                 });
             } catch (e) {}
         }
         toast.success(`Generated permanent Staff ID: ${assignedId}`);
      } else {
         assignedId = generatePatientId(app.name);
         if (!appId.startsWith('APP-')) {
             try {
                 await addDoc(collection(db, 'patients'), {
                     fullName: app.name,
                     firstName: app.name.split(' ')[0],
                     lastName: app.name.split(' ').slice(1).join(' '),
                     email: app.email,
                     phone: app.phone,
                     patientId: assignedId,
                     status: 'Active',
                     assignedStaffId: null,
                     createdAt: serverTimestamp()
                 });
             } catch (e) {}
         }
      }
      
      // Simulate credential generation and sending...
      const generatedPassword = `TEMP-${Math.random().toString(36).slice(-6).toUpperCase()}`;
      toast.success(`Application for ${name} approved instantly!`);
      setTimeout(() => toast.info(`System automatically dispatched secure credentials:\nID: ${assignedId}\nPass: ${generatedPassword}`, { duration: 8000 }), 1500);
      
      // Log it
      setAuditLogs(prev => [
         { id: `LOG-${Date.now()}`, adminId: 'ADM-001', action: `Approved Application & Generated Credentials for ${name} (${assignedId})`, time: 'Just now' },
         ...prev
      ]);
  };

  const handleRejectApp = async (appId: string, name: string) => {
      if (!appId.startsWith('APP-')) {
          try {
              await updateDoc(doc(db, 'applications', appId), { status: 'Rejected' });
          } catch(err) {
              console.error(err);
          }
      }
      setApplications(prev => prev.filter(a => a.id !== appId));
      setMetrics(prev => ({ ...prev, pendingApps: Math.max(0, prev.pendingApps - 1) }));
      toast.error(`Application for ${name} has been rejected.`);
  };

  const handleScheduleInterview = async (appId: string, name: string) => {
      if (!appId.startsWith('APP-')) {
          try {
              await updateDoc(doc(db, 'applications', appId), { status: 'Interview Scheduled' });
          } catch(err) {
              console.error(err);
          }
      }
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Interview Scheduled' } : a));
      setInterviews(prev => [{
          id: `INT-${Date.now()}`,
          candidate: name,
          role: 'TBD',
          date: 'Pending Date',
          mode: 'Virtual',
          status: 'Scheduled'
      }, ...prev]);
      setMetrics(prev => ({ ...prev, scheduledInterviews: prev.scheduledInterviews + 1 }));
      toast.success(`Interview scheduling initialized for ${name}.`);
  };

  const handleRescheduleInterview = (intId: string) => {
      toast.info('Reschedule request sent to candidate.');
  };

  const handleRecordInterviewResult = (intId: string, candidate: string) => {
      setInterviews(prev => prev.filter(i => i.id !== intId));
      setMetrics(prev => ({ ...prev, scheduledInterviews: Math.max(0, prev.scheduledInterviews - 1) }));
      toast.success(`Result recorded for ${candidate}.`);
  };

  const handleBroadcastAnnouncement = () => {
      if (!announcementTitle.trim() || !announcementBody.trim()) {
          toast.error("Please fill in both title and body.");
          return;
      }
      const newAnn = {
          id: `ANN-${Date.now()}`,
          title: announcementTitle,
          target: announcementTarget,
          time: 'Just now',
          body: announcementBody
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      setAnnouncementTitle('');
      setAnnouncementBody('');
      toast.success("Announcement broadcasted successfully!");
  };

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.fullName,
                type: data.appType === 'staff' ? 'Staff' : 'Patient',
                role: data.appType === 'staff' ? 'Staff' : 'Patient',
                date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Just now',
                status: data.status,
                email: data.email,
                phone: data.phone
            };
        });
        setApplications([...apps, ...INITIAL_APPLICATIONS]); // Keep initial mocks appended for demonstration purposes
        setMetrics(prev => ({ ...prev, pendingApps: apps.filter(a => a.status === 'Pending Review').length + INITIAL_APPLICATIONS.filter(a => a.status === 'Pending Review').length }));
    }, (error) => {
        console.error("Error fetching applications:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const qTestimonials = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribeTestimonials = onSnapshot(qTestimonials, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setAdminTestimonials(list);
    }, (error) => {
        console.warn("Error getting admin reviews snapshot:", error);
    });
    return () => unsubscribeTestimonials();
  }, []);

  useEffect(() => {
    if (!user) return;
    const qStaff = query(collection(db, 'users'));
    const unStaff = onSnapshot(qStaff, (snap) => {
        const staff = snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.fullName || 'Unknown Staff',
                role: data.role || 'Staff',
                staffId: doc.id.substring(0, 8).toUpperCase(),
                department: data.department || 'General',
                status: 'Present',
                presentDays: 0,
                absentDays: 0,
                attendancePercent: 0
            };
        }).filter(u => u.role !== 'admin' && u.role !== 'patient');
        setStaffList([...staff, ...INITIAL_STAFF_LIST]);
    }, (error) => {
        console.error("Error fetching staff:", error);
    });

    const qPatients = query(collection(db, 'patients'));
    const unPatients = onSnapshot(qPatients, (snap) => {
        const p = snap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.fullName || 'Unknown Patient',
                patientId: doc.id.substring(0, 8).toUpperCase(),
                assignedStaff: 'Unassigned',
                admissionStatus: data.status || 'Active',
                paymentStatus: 'Pending',
                amountDue: 0
            };
        });
        setPatientList([...p, ...INITIAL_PATIENT_LIST]);
    }, (error) => {
        console.error("Error fetching patients:", error);
    });

    return () => {
        unStaff();
        unPatients();
    };
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    const checkRole = async () => {
      if (!user) {
        navigate('/auth/login');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid, 'public', 'profile'));
        if (userDoc.exists()) {
          const ud = userDoc.data();
          if (ud.role !== 'admin') {
             navigate('/');
          }
        } else {
          console.warn("User doc missing in AdminDashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [navigate, user, authLoading]);

  if (loading) return <div className="p-8 text-center mt-20 text-[#10837f] font-semibold animate-pulse">Loading Admin Control Center...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <AdminEmergencyAlerts />
      <TopBar />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* 1. ADMIN PROFILE DASHBOARD (Landing Section) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-[#0e4e5e] to-[#10837f] text-white p-6 md:p-8 rounded-2xl shadow-md mb-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full border-2 border-white/50 flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-1">{ADMIN_PROFILE.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90 text-sm">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> ID: {ADMIN_PROFILE.staffId}</span>
                        <span className="opacity-50">|</span>
                        <span>{ADMIN_PROFILE.email}</span>
                        <span className="opacity-50">|</span>
                        <span>{ADMIN_PROFILE.phone}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 inline-flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider text-white/70 mb-1">Last Login</span>
                    <span className="font-medium text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {ADMIN_PROFILE.lastLogin}
                    </span>
                </div>
            </div>
        </div>

        {/* 2. HOSPITAL OVERVIEW METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card onClick={() => setActiveTab('patients')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Patients</p>
                    <p className="text-3xl font-bold text-blue-600">{metrics.activePatients}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('staff')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Staff</p>
                    <p className="text-3xl font-bold text-[#10837f]">{metrics.activeStaff}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('applications')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Apps</p>
                    <p className="text-3xl font-bold text-orange-600">{metrics.pendingApps}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('applications')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Interviews</p>
                    <p className="text-3xl font-bold text-purple-600">{metrics.scheduledInterviews}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('staff')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Staff Present</p>
                    <p className="text-3xl font-bold text-green-600">{metrics.staffPresentToday}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('staff')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Staff Absent</p>
                    <p className="text-3xl font-bold text-red-600">{metrics.staffAbsentToday}</p>
                </CardContent>
            </Card>
            <Card onClick={() => setActiveTab('finance')} role="button" tabIndex={0} className="border-0 shadow-sm ring-1 ring-gray-100 bg-white col-span-2 md:col-span-2 lg:col-span-1 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-[#10837f] active:scale-[0.98] transition-all">
                <CardContent className="p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Pymts</p>
                    <p className="text-3xl font-bold text-yellow-600">{metrics.patientsPendingPayments}</p>
                </CardContent>
            </Card>
        </div>
        
        {/* MAIN ADMIN TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide">
                <TabsList className="flex w-max min-w-full h-auto bg-white border shadow-sm rounded-xl p-1 gap-1">
                    <TabsTrigger value="applications" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white flex items-center gap-2">
                        Applications <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">15</span>
                    </TabsTrigger>
                    <TabsTrigger value="staff" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Staff Management</TabsTrigger>
                    <TabsTrigger value="patients" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Patient Logistics</TabsTrigger>
                    <TabsTrigger value="finance" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Financials</TabsTrigger>
                    <TabsTrigger value="workforce" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Workforce Analytics</TabsTrigger>
                    <TabsTrigger value="notifications" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white flex items-center gap-2">
                        Alerts <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center gap-2">
                        AI Investigator <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">New</span>
                    </TabsTrigger>
                    <TabsTrigger value="announcements" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Announcements</TabsTrigger>
                    <TabsTrigger value="testimonials" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white flex items-center gap-1.5">
                        Client Reviews <span className="bg-[#d8a846] text-[#0e4e5e] text-[10px] px-1.5 py-0.5 rounded-full font-bold">{adminTestimonials.filter(t => !t.isApproved).length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="audit" className="py-2.5 px-4 rounded-lg data-[state=active]:bg-[#10837f] data-[state=active]:text-white">Audit Logs</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="applications" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Application Intake Queue */}
                    <Card className="lg:col-span-2 border-0 shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><FileSignature className="w-5 h-5 text-[#10837f]" /> Application Intake Queue</CardTitle>
                            <CardDescription>Review and manage incoming portal applications.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                    <tr>
                                        <th className="p-4">Applicant</th>
                                        <th className="p-4">Type / Role</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{app.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{app.date}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{app.type}</div>
                                                <div className="text-xs text-[#10837f] mt-0.5">{app.role}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                    app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-orange-50 text-orange-700 border-orange-100'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Dialog>
                                                    <DialogTrigger className={buttonVariants({variant: "outline", size: "sm"}) + " border-[#10837f] text-[#10837f] hover:bg-emerald-50"} >
                                                        Review
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Application Review: {app.name}</DialogTitle>
                                                            <DialogDescription>Review biodata and decide on the next steps for this applicant.</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid grid-cols-2 gap-4 py-4 border-y my-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                                                                <p className="font-semibold">{app.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-medium">Application Type</p>
                                                                <p className="font-semibold">{app.type} ({app.role})</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                                                <p className="font-semibold">{app.email}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                                                <p className="font-semibold">{app.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                             <h4 className="font-semibold text-gray-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600"/> Biodata Verified</h4>
                                                             <div className="flex bg-gray-50 p-4 border rounded-xl items-center gap-4">
                                                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
                                                                    <FileText className="text-gray-400 w-6 h-6" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm">Resume / Medical License.pdf</p>
                                                                    <p className="text-xs text-gray-500">2.4 MB • Uploaded {app.date}</p>
                                                                </div>
                                                                <Dialog>
                                                                    <DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"})} >
                                                                        View
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Document Viewer</DialogTitle>
                                                                            <DialogDescription>Reviewing uploaded documents.</DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="flex-1 bg-gray-100 rounded-lg border flex flex-col items-center justify-center">
                                                                            <FileText className="w-16 h-16 text-gray-400 mb-4 opacity-50" />
                                                                            <p className="text-gray-500 text-sm">Simulating document preview for the applicant...</p>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                             </div>
                                                        </div>
                                                        <DialogFooter className="mt-6 flex gap-2">
                                                            <DialogTrigger className={buttonVariants({variant: "outline"}) + " text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"} onClick={() => handleRejectApp(app.id, app.name)}>
                                                                Reject
                                                            </DialogTrigger>
                                                            <div className="flex gap-2 flex-1 justify-end">
                                                                <DialogTrigger className={buttonVariants({variant: "outline"}) + " text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"} onClick={() => handleScheduleInterview(app.id, app.name)}>
                                                                    <Calendar className="w-4 h-4 mr-2"/> Schedule Interview
                                                                </DialogTrigger>
                                                                <DialogTrigger className={buttonVariants({variant: "default"}) + " bg-[#10837f] hover:bg-[#0c6b68]"} onClick={() => handleApproveApp(app.id, app.name)}>
                                                                    Approve Instantly
                                                                </DialogTrigger>
                                                            </div>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Interview Scheduling System */}
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><Video className="w-5 h-5 text-purple-600" /> Upcoming Interviews</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100">
                                {interviews.map((interview) => (
                                    <div key={interview.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-gray-900 text-sm">{interview.candidate}</p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                                                {interview.mode}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#10837f] font-medium mb-3">Role: {interview.role}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-100 w-max px-2 py-1 rounded">
                                            <Clock className="w-3.5 h-3.5" />
                                            {interview.date}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => handleRescheduleInterview(interview.id)}>Reschedule</Button>
                                            <Button size="sm" className="w-full text-xs h-8 bg-[#10837f] hover:bg-[#0c6b68]" onClick={() => handleRecordInterviewResult(interview.id, interview.candidate)}>Record Result</Button>
                                        </div>
                                    </div>
                                ))}
                                {interviews.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">No interviews scheduled.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* 3. STAFF MANAGEMENT SYSTEM */}
            <TabsContent value="staff" className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Search staff..." className="pl-9 w-64" />
                        </div>
                        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                            <option>All Departments</option>
                            <option>Home Care</option>
                            <option>Internal Med</option>
                        </select>
                    </div>
                    <Dialog>
                        <DialogTrigger className={buttonVariants({variant: "default"}) + " bg-[#10837f] hover:bg-[#0c6b68]"} >
                            <Plus className="w-4 h-4 mr-2"/> Add Staff
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Clinical Staff</DialogTitle>
                                <DialogDescription>Register a new staff member to the network.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="e.g. Dr. John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                        <option>Doctor</option>
                                        <option>Nurse</option>
                                        <option>Physiotherapist</option>
                                        <option>Caregiver</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                        <option>Internal Medicine</option>
                                        <option>Home Care</option>
                                        <option>Rehabilitation</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogTrigger className={buttonVariants({variant: "default"}) + " bg-[#10837f] hover:bg-[#0c6b68]"} onClick={() => toast.success("New staff registration initiated.")}>
                                    Create Staff Account
                                </DialogTrigger>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><UserCog className="w-5 h-5 text-[#10837f]" /> Staff Directory & Attendance</CardTitle>
                        <CardDescription>Automated daily attendance linked to EMR login activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Staff Name & ID</th>
                                    <th className="p-4">Role & Dept</th>
                                    <th className="p-4 text-center">Daily Status (Today)</th>
                                    <th className="p-4 text-center">Month Attendance</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {staffList.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{staff.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{staff.staffId}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-[#10837f]">{staff.role}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{staff.department}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {staff.status === 'Present' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Present (Active)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Absent (No Login)
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-bold text-gray-900">{staff.attendancePercent}%</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{staff.presentDays} Days Present</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right flex gap-2 justify-end">
                                            <Dialog>
                                                <DialogTrigger className={buttonVariants({variant: "outline", size: "sm"}) + " text-blue-600 hover:text-blue-700 hover:bg-blue-50"} >
                                                    Assign to Patient
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Assign {staff.name} to Patient</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                                                            {patientList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                        </select>
                                                        <Button onClick={() => toast.success(`Assigned ${staff.name} to patient.`)}>Save Assignment</Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-blue-600 hover:text-blue-700 hover:bg-blue-50"} >
                                                    View Record
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>{staff.name}&apos;s Record</DialogTitle>
                                                        <DialogDescription>Full details and attendance history.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4 text-left">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div><span className="text-gray-500 text-sm">Staff ID</span><p className="font-semibold">{staff.staffId}</p></div>
                                                            <div><span className="text-gray-500 text-sm">Role</span><p className="font-semibold">{staff.role}</p></div>
                                                            <div><span className="text-gray-500 text-sm">Department</span><p className="font-semibold">{staff.department}</p></div>
                                                            <div><span className="text-gray-500 text-sm">Status</span><p className="font-semibold">{staff.status}</p></div>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 rounded-lg border flex flex-col">
                                                            <h4 className="font-medium text-sm text-gray-700 mb-2">Monthly Attendance</h4>
                                                            <div className="flex flex-row justify-between w-full items-center">
                                                                <span className="text-green-600 font-bold">{staff.presentDays} Present</span>
                                                                <span className="text-red-600 font-bold">{staff.absentDays} Absent</span>
                                                                <span className="text-[#10837f] font-bold">{staff.attendancePercent}% Score</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 4. PATIENT MANAGEMENT SYSTEM */}
            <TabsContent value="patients" className="space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-[#10837f]" /> Patient Registry & Assignment Control</CardTitle>
                        <CardDescription>Assign or reassign patients to clinical staff workflows.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Patient Name & ID</th>
                                    <th className="p-4">Clinical Status</th>
                                    <th className="p-4">Currently Assigned Staff</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {patientList.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{patient.patientId}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                patient.admissionStatus === 'Admitted' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                patient.admissionStatus === 'Discharged' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                                {patient.admissionStatus}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {patient.assignedStaff === 'Unassigned' ? (
                                                 <span className="text-red-500 flex items-center gap-1 text-sm font-medium"><AlertCircle className="w-4 h-4"/> Unassigned</span>
                                            ) : (
                                                 <div className="font-medium text-gray-700 flex items-center gap-2">
                                                     <div className="w-6 h-6 rounded-full bg-[#10837f]/10 text-[#10837f] flex items-center justify-center text-[10px] font-bold">
                                                         {patient.assignedStaff.split(' ').map(n=>n[0]).slice(0,2).join('')}
                                                     </div>
                                                     {patient.assignedStaff}
                                                 </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                             <div className="flex gap-2 justify-end">
                                               <Button variant="outline" size="sm" className="border-[#10837f] text-[#10837f] hover:bg-emerald-50" onClick={() => {setSelectedPatient(patient); setAssignmentStaffId(patient.assignedStaffId || ''); setIsAssignmentModalOpen(true);}}>
                                                    Manage
                                                </Button>
                                               <Dialog>
                                                    <DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-purple-600 hover:text-purple-700 hover:bg-purple-50"} >
                                                        View Profile
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Initial Intake Assessment</DialogTitle>
                                                            <DialogDescription>Submitted by {patient.name} on first login.</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="bg-gray-50 p-4 rounded-lg border">
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Primary Symptoms</h4>
                                                                <p className="text-gray-900 font-medium">Headache, fever, and persistent cough.</p>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="bg-gray-50 p-4 rounded-lg border">
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</h4>
                                                                    <p className="text-gray-900 font-medium">3 days</p>
                                                                </div>
                                                                <div className="bg-gray-50 p-4 rounded-lg border">
                                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pain Level</h4>
                                                                    <p className="text-gray-900 font-medium">4 / 10</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-gray-50 p-4 rounded-lg border">
                                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Medical History</h4>
                                                                <p className="text-gray-900 font-medium whitespace-pre-wrap">Asthma. No known allergies.</p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 5. FINANCIAL MANAGEMENT SYSTEM */}
            <TabsContent value="finance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Cleared Payments</p>
                                    <h3 className="text-3xl font-bold mt-1">₦0.00</h3>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg"><CheckCircle2 className="w-6 h-6"/></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-[#d8a846] to-yellow-600 text-white border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
                                    <h3 className="text-3xl font-bold mt-1">₦150,000</h3>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg"><Clock className="w-6 h-6"/></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-red-100 text-sm font-medium">Overdue Accounts</p>
                                    <h3 className="text-3xl font-bold mt-1">₦45,000</h3>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg"><AlertCircle className="w-6 h-6"/></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#10837f]" /> Patient Billing Records & Tracking</CardTitle>
                        <CardDescription>Automated tracking warns 2 days prior to payment due dates.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Patient Profile</th>
                                    <th className="p-4 text-center">Amount Due</th>
                                    <th className="p-4 text-center">Payment Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {patientList.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{patient.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{patient.patientId}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="font-bold text-gray-900">₦{patient.amountDue.toLocaleString()}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                patient.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                                patient.paymentStatus === 'Overdue' ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' :
                                                'bg-[#d8a846]/10 text-yellow-700 border-yellow-200'
                                            }`}>
                                                {patient.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Dialog>
                                                <DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-[#10837f] hover:text-[#0c6b68] hover:bg-[#10837f]/10"} >
                                                    View Invoice
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Invoice Details</DialogTitle>
                                                        <DialogDescription>Billing summary for {patient.name}.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4 text-left">
                                                        <div className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">Total Amount Due</h4>
                                                                <span className="text-gray-500 text-sm">Due in 2 days</span>
                                                            </div>
                                                            <div className="text-2xl font-bold text-gray-900">₦{patient.amountDue.toLocaleString()}</div>
                                                        </div>
                                                        <div className="space-y-4 text-sm px-2">
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-gray-600">Patient ID</span>
                                                                <span className="font-medium">{patient.patientId}</span>
                                                            </div>
                                                            <div className="flex justify-between border-b pb-2">
                                                                <span className="text-gray-600">Status</span>
                                                                <span className={`font-semibold ${patient.paymentStatus === 'Paid' ? 'text-green-600' : patient.paymentStatus === 'Overdue' ? 'text-red-600' : 'text-yellow-600'}`}>{patient.paymentStatus}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="flex-col sm:flex-row gap-2">
                                                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast.success("Reminder sent successfully")}><AlertCircle className="w-4 h-4 mr-2" /> Send Reminder</Button>
                                                        <DialogTrigger className={buttonVariants({variant: "default"}) + " w-full sm:w-auto bg-[#10837f] hover:bg-[#0c6b68]"} onClick={() => toast.success("Payment marked as resolved")}>
                                                            Mark as Paid
                                                        </DialogTrigger>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 6. NOTIFICATION SYSTEM */}
            <TabsContent value="notifications" className="space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5 text-[#10837f]" /> System Activity Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className={`p-4 rounded-xl border flex gap-4 ${notif.status === 'unread' ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
                                    <div className={`mt-0.5 rounded-full p-2 h-max ${
                                        notif.type === 'PAYMENT' ? 'bg-yellow-100 text-yellow-700' :
                                        notif.type === 'ASSIGNMENT' ? 'bg-red-100 text-red-700' :
                                        'bg-[#10837f]/10 text-[#10837f]'
                                    }`}>
                                        {notif.type === 'PAYMENT' ? <CreditCard className="w-4 h-4" /> :
                                         notif.type === 'ASSIGNMENT' ? <AlertCircle className="w-4 h-4" /> :
                                         <InfoIcon className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                    {notif.status === 'unread' && (
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full my-auto" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 7. GENERAL ANNOUNCEMENT SYSTEM */}
            <TabsContent value="announcements" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#10837f]" /> Create Announcement</CardTitle>
                            <CardDescription>Broadcast messages to specific groups.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Select Audience Target</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={announcementTarget} onChange={(e) => setAnnouncementTarget(e.target.value)}>
                                    <option>Global (All Staff & Patients)</option>
                                    <option>Staff Only (Healthcare Workers)</option>
                                    <option>Patients Only</option>
                                    <option>Targeted (Selected Groups)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Announcement Title</Label>
                                <Input placeholder="e.g. System Maintenance Notice" value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Message Body</Label>
                                <Textarea className="min-h-[120px] resize-none" placeholder="Provide full details..." value={announcementBody} onChange={e => setAnnouncementBody(e.target.value)} />
                            </div>
                            <Button className="w-full bg-[#10837f] hover:bg-[#0c6b68]" onClick={handleBroadcastAnnouncement}>Broadcast Message</Button>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5 text-gray-500" /> Recent Broadcasts</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                             <div className="divide-y">
                                {announcements.map((ann) => (
                                    <div key={ann.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-[#0e4e5e]">{ann.title}</h4>
                                            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded uppercase">{ann.target} Target</span>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{ann.body}</p>
                                        <div className="mt-3 text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Sent {ann.time}</div>
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* 8. WORKFORCE ANALYTICS (RECORD OF SERVICE) */}
            <TabsContent value="workforce" className="space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-[#10837f]" /> Record of Service</CardTitle>
                        <CardDescription>Automated workforce presence tracking and analytics based on login logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Staff Member</th>
                                    <th className="p-4 text-center">Month Presence</th>
                                    <th className="p-4 text-center">Month Absence</th>
                                    <th className="p-4 text-center">Last System Activity</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {staffList.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{staff.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{staff.role} • {staff.department}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-green-600">{staff.presentDays} Days</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-red-600">{staff.absentDays} Days</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="text-gray-900 font-medium">Today, 09:00 AM</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Dialog>
                                                <DialogTrigger className={buttonVariants({variant: "ghost", size: "sm"}) + " text-[#10837f] hover:text-[#0c6b68] hover:bg-[#10837f]/10"} >
                                                    View Report <ArrowRight className="w-4 h-4 ml-1"/>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Monthly Analytics: {staff.name}</DialogTitle>
                                                        <DialogDescription>Workforce performance and activity tracking.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-6 py-4">
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div className="text-center p-4 bg-green-50 border border-green-100 rounded-xl">
                                                                <div className="text-2xl font-bold text-green-700">{staff.presentDays}</div>
                                                                <div className="text-xs text-green-600 uppercase font-semibold mt-1">Present</div>
                                                            </div>
                                                            <div className="text-center p-4 bg-red-50 border border-red-100 rounded-xl">
                                                                <div className="text-2xl font-bold text-red-700">{staff.absentDays}</div>
                                                                <div className="text-xs text-red-600 uppercase font-semibold mt-1">Absent</div>
                                                            </div>
                                                            <div className="text-center p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                                                <div className="text-2xl font-bold text-blue-700">{staff.attendancePercent}%</div>
                                                                <div className="text-xs text-blue-600 uppercase font-semibold mt-1">Score</div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2 text-left">
                                                            <h4 className="text-sm font-semibold text-gray-900">Recent Login Activity</h4>
                                                            <div className="text-sm text-gray-600 border rounded-lg divide-y">
                                                                <div className="p-3 flex justify-between"><span>Today, 09:00 AM</span><span className="text-green-600 font-medium">Logged In</span></div>
                                                                <div className="p-3 flex justify-between"><span>Yesterday, 08:45 AM</span><span className="text-green-600 font-medium">Logged In</span></div>
                                                                <div className="p-3 flex justify-between"><span>2 Days Ago</span><span className="text-red-600 font-medium">No Activity</span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 9. AUDIT SYSTEM */}
            <TabsContent value="audit" className="space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><Database className="w-5 h-5 text-[#10837f]" /> System Audit Logs</CardTitle>
                        <CardDescription>Immutable record of all administrative actions and system automations.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                <tr>
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4">Action Taken</th>
                                    <th className="p-4">Actor</th>
                                    <th className="p-4 text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="text-gray-900 font-medium">{log.time}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-700 font-medium">{log.action}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                                                log.adminId === 'SYSTEM' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {log.adminId}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Dialog>
                                                <DialogTrigger className={buttonVariants({variant: "outline", size: "sm"}) + " h-7 text-xs border-gray-200"} >
                                                    Details
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Audit Action Details</DialogTitle>
                                                        <DialogDescription>Immutable record reference: {log.id}</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4 text-left">
                                                        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm text-gray-800 break-all whitespace-pre">
                                                            {`{\n  "eventId": "${log.id}",\n  "timestamp": "${log.time}",\n  "actorId": "${log.adminId}",\n  "action": "${log.action}",\n  "ipAddress": "192.168.1.1",\n  "status": "SUCCESS"\n}`}
                                                        </div>
                                                        <p className="text-sm text-gray-500">This record is permanently logged in the system ledger and cannot be altered by administrators.</p>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 10. CLIENT REVIEWS & TESTIMONIALS MODERATION */}
            <TabsContent value="testimonials" className="space-y-6">
                <Card className="border-0 shadow-sm ring-1 ring-gray-100">
                    <CardHeader className="bg-gray-50/50 border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#10837f]" /> Client Success Stories Moderation</CardTitle>
                            <CardDescription>Approve or draft patient and family-written feedback reviews and video diary URLs.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <span className="bg-amber-100 text-[#b58b35] font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1">
                                {adminTestimonials.filter(t => !t.isApproved).length} Pending Review
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1">
                                {adminTestimonials.filter(t => t.isApproved).length} Made Live
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {adminTestimonials.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <MessageSquareQuote className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <h4 className="font-heading font-bold text-sm text-gray-600 mb-1">No Submissions Found</h4>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">No client testimonials have been posted into Firestore databases yet. Submit stories on the Testimonials page to test this live moderation deck!</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8fcfc] border-b text-gray-600 font-medium">
                                    <tr>
                                        <th className="p-4">Author Details</th>
                                        <th className="p-4">Review Text</th>
                                        <th className="p-4">Rating Given</th>
                                        <th className="p-4">Video Link</th>
                                        <th className="p-4">Publishing Status</th>
                                        <th className="p-4 text-right">Moderator Decisions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {adminTestimonials.map((story) => (
                                        <tr key={story.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">{story.clientName}</div>
                                                <div className="text-xs text-gray-500 font-semibold">{story.relation}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">
                                                    {story.createdAt?.toDate ? story.createdAt.toDate().toLocaleDateString() : 'Active Static Data'}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-sm">
                                                <p className="text-xs text-gray-600 italic line-clamp-3 leading-relaxed">
                                                    "{story.text}"
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex text-[#d8a846] gap-0.5">
                                                    {Array.from({ length: story.rating || 5 }).map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {story.videoUrl ? (
                                                    <a
                                                        href={story.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[#10837f] hover:underline font-mono text-[11px] font-bold"
                                                    >
                                                        <Video className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                                        Preview Video Link
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-300">No Video Included</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                                                    story.isApproved
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                }`}>
                                                    {story.isApproved ? '● Published Live' : '○ Pending Approval'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2.5">
                                                    {!story.isApproved ? (
                                                        <button
                                                            onClick={() => handleApproveTestimonial(story.id)}
                                                            className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-black text-[10px] px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-all active:scale-95"
                                                        >
                                                            Approve Story
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRejectTestimonial(story.id)}
                                                            className="bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-amber-200 transition-all active:scale-95"
                                                        >
                                                            Set to Draft
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteTestimonial(story.id)}
                                                        className="bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg border border-red-100 transition-all active:scale-95"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
                <AIInvestigatorAdminView />
            </TabsContent>
        </Tabs>

        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Staff to {selectedPatient?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Select Staff</Label>
              <select 
                value={assignmentStaffId} 
                onChange={(e) => setAssignmentStaffId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Unassigned</option>
                {staffList.map(s => <option key={s.id} value={s.staffId}>{s.name} ({s.role})</option>)}
              </select>
            </div>
            <DialogFooter>
              <Button onClick={handleAssignStaff}>Save Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}
