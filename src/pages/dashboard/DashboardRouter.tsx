import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_SESSION = { user: { id: 'demo-user', linkedUserType: 'STAFF', role: 'ADMIN' } };
const STATUS = 'authenticated';

export function DashboardRouter() {
    console.log("DashboardRouter: Component mounted");
    const status = STATUS;
    const session = MOCK_SESSION; // Mocked session
    const navigate = useNavigate();

    useEffect(() => {
        console.log("DashboardRouter: Status", status);
        console.log("DashboardRouter: Session", session);

        // Always treating as authenticated for now since next-auth is gone
        const user = session?.user as any;
            
        if (!user) {
            console.warn("DashboardRouter: Authenticated but no user object");
            return;
        }

        console.log("DashboardRouter: User", user);
        
        if (user?.linkedUserType === 'PATIENT') {
            navigate('/portal');
        } else if (user?.linkedUserType === 'STAFF') {
            if (user?.role === 'ADMIN') navigate('/dashboard/admin');
            else if (user?.role === 'DOCTOR') navigate('/dashboard/clinical/doctor');
            else if (user?.role === 'NURSE') navigate('/dashboard/clinical/nurse');
            else if (user?.role === 'CAREGIVER') navigate('/dashboard/clinical/caregiver');
            else if (user?.role === 'PHYSIOTHERAPIST') navigate('/dashboard/clinical/physiotherapist');
            else navigate('/dashboard/clinical');
        } else {
            console.error("DashboardRouter: Unknown user type", user?.linkedUserType);
        }
    }, [status, session, navigate]);

  return <div className="p-8 text-center mt-20 font-medium text-[#10837f]">
        <p>Redirecting to your dashboard...</p>
    </div>;
}
