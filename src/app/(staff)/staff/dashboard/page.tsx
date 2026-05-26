"use client";

import React from "react";
// import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NurseDashboardPage() {
  // const { data: session } = useSession();
  const session = { user: { name: 'Demo User', email: 'demo@example.com', role: 'NURSE', staffPublicId: 'NUR-001' } };
  const user = session?.user;

  // Placeholder for patient data - will need to fetch from API
  const assignedPatients = [
      { id: "P-001", name: "John Doe", status: "Admitted" },
      { id: "P-002", name: "Jane Smith", status: "Under Care" },
  ];

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Nurse Dashboard</h1>
      
      {/* Profile Summary Panel */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl">
              {user.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="text-sm text-gray-500 mt-1">
                  Role: {user.role} | ID: {user.staffPublicId}
              </div>
            </div>
            <Button variant="outline" className="ml-auto">Edit Profile</Button>
          </div>
        </CardHeader>
      </Card>

      {/* Assigned Patients Section */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Assigned Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{patient.name}</div>
                  <div className="text-sm text-gray-500">ID: {patient.id} | Status: {patient.status}</div>
                </div>
                <Button>Open EMR</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
