import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, ShieldAlert, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export function AIInvestigatorAdminView() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch AI reports
        const q = query(collection(db, 'ai_reports'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(data);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const markAsReviewed = async (id: string) => {
        try {
            await updateDoc(doc(db, 'ai_reports', id), {
                status: 'REVIEWED'
            });
            toast.success("Report marked as reviewed.");
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    return (
        <Card className="border-red-200 shadow-md">
            <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-red-700">
                    <ShieldAlert className="w-6 h-6" /> 
                    AI Investigator Compliance Reports
                </CardTitle>
                <CardDescription className="text-red-900/70">
                    Real-time oversight of medical documentation. AI flags potentially litigious, unethical, or negligent language.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading AI reports...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-gray-900">No Violations Detected</h3>
                        <p className="text-gray-500 text-sm mt-1">Staff documentation is currently compliant with legal and medical ethics guidelines.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reports.map((report) => (
                            <div key={report.id} className={`border rounded-xl p-5 ${report.status === 'REVIEWED' ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-red-50/30 border-red-200'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${report.status === 'REVIEWED' ? 'bg-gray-200 text-gray-700' : 'bg-red-600 text-white animate-pulse'}`}>
                                                {report.status === 'REVIEWED' ? 'REVIEWED' : 'ACTION REQUIRED'}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> 
                                                {report.timestamp?.toDate ? report.timestamp.toDate().toLocaleString() : 'Recent'}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900">{report.violation || 'Ethical Violation'}</h4>
                                        <div className="text-sm font-medium text-gray-600 mt-1">
                                            Reported Staff: <span className="text-gray-900 font-bold">{report.staffName} ({report.role})</span>
                                        </div>
                                    </div>
                                    {report.status !== 'REVIEWED' && (
                                        <Button onClick={() => markAsReviewed(report.id)} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                                            Mark as Reviewed
                                        </Button>
                                    )}
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm relative">
                                    <div className="absolute -top-3 left-4 bg-white px-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Intercepted Documentation</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed mt-2 italic">
                                        "{report.context}"
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <strong>Trigger Word:</strong> <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded ml-1 font-mono">{report.triggerWord}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
