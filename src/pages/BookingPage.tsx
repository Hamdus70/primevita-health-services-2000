import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId?: string) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: userId,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const session = { user: { id: 'demo-user' } };

  useEffect(() => {
    if (!session?.user?.id) return;
    const q = query(
      collection(db, 'appointments'),
      where('clientId', '==', session.user.id)
    );
    return onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments', session.user.id);
    });
  }, [session]);
  
  const handleBooking = async () => {
    if (!date || !session?.user?.id) return;
    try {
      await addDoc(collection(db, 'appointments'), {
        clientId: session.user.id,
        dateTime: date.toISOString(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      alert('Appointment booked successfully!');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'appointments', session.user.id);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
        await updateDoc(doc(db, 'appointments', id), { status });
    } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `appointments/${id}`, session?.user?.id);
    }
  }

const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-semibold mb-8 text-foreground">Book an Appointment</h1>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
          <p className="text-xl mb-4 font-light text-muted-foreground">
            Selected Date: {date ? format(date, 'PPP') : 'Please select a date'}
          </p>
          <Button size="lg" onClick={handleBooking}>Confirm Booking</Button>
        </div>
      </div>

        <h2 className="text-3xl font-semibold mb-6">Your Appointments</h2>
        <div className="space-y-4">
            {appointments.map(app => (
                <div key={app.id} className="p-6 border rounded-xl flex justify-between items-center bg-card shadow-sm">
                    <div>
                        <p className="font-semibold text-lg">{format(new Date(app.dateTime), 'PPPp')}</p>
                        <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </div>
                    </div>
                    
                    <div className="space-x-2">
                        {app.status === 'pending' && (
                            <>
                                <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50" onClick={() => updateStatus(app.id, 'confirmed')}>Confirm</Button>
                                <Button size="sm" variant="outline" className="border-rose-600 text-rose-700 hover:bg-rose-50" onClick={() => updateStatus(app.id, 'cancelled')}>Cancel</Button>
                            </>
                        )}
                        {app.status === 'confirmed' && (
                            <>
                                <Button size="sm" variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50" onClick={() => updateStatus(app.id, 'completed')}>Complete</Button>
                                <Button size="sm" variant="outline" className="border-rose-600 text-rose-700 hover:bg-rose-50" onClick={() => updateStatus(app.id, 'cancelled')}>Cancel</Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
