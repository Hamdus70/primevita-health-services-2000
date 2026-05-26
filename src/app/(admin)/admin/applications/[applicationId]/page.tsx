"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/stores/admin.store";

export default function ApplicationReviewPage() {
  const { applicationId } = useParams();
  const router = useRouter();
  const { applications, updateApplicationStatus } = useAdminStore();
  const app = useMemo(() => applications.find(a => a.id === applicationId), [applications, applicationId]);

  if (!app) return <div>Application not found</div>;

  const handleUpdate = (status: any) => {
      updateApplicationStatus(app.id, status);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Application: {app.id}</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
            <CardHeader><CardTitle>Application Details</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p><strong>Name:</strong> {app.fullName}</p>
                    <p><strong>Type:</strong> {app.type}</p>
                    <p><strong>Status:</strong> {app.status}</p>
                    <p><strong>Submitted:</strong> {app.createdAt}</p>
                    <div className="p-4 border rounded">
                        <p><strong>Email:</strong> {app.biodata.email}</p>
                        <p><strong>Phone:</strong> {app.biodata.phone}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Admin Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <Button className="w-full bg-green-600" onClick={() => handleUpdate('APPROVED')}>Approve</Button>
                <Button className="w-full bg-red-600" onClick={() => handleUpdate('REJECTED')}>Reject</Button>
                <Button className="w-full bg-blue-600" onClick={() => handleUpdate('INTERVIEW_SCHEDULED')}>Schedule Interview</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
