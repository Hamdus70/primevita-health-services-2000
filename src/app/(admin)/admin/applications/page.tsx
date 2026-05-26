"use client";

import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/admin.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const MOCK_APPLICATIONS = [
  { id: "APP-001", fullName: "Jane Doe", type: "NURSE", status: "PENDING", biodata: {email: "jane@example.com", phone: "123"}, createdAt: "2026-05-17", updatedAt: "2026-05-17" },
  { id: "APP-002", fullName: "John Smith", type: "PATIENT", status: "UNDER_REVIEW", biodata: {email: "john@example.com", phone: "456"}, createdAt: "2026-05-16", updatedAt: "2026-05-17" },
];

export default function ApplicationsPage() {
  const { applications, setApplications } = useAdminStore();

  useEffect(() => {
    if (applications.length === 0) setApplications(MOCK_APPLICATIONS as any);
  }, [setApplications]);

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING': return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
        case 'UNDER_REVIEW': return <Badge variant="outline" className="bg-blue-100">Reviewing</Badge>;
        case 'APPROVED': return <Badge variant="outline" className="bg-green-100">Approved</Badge>;
        case 'REJECTED': return <Badge variant="outline" className="bg-red-100">Rejected</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Application Intake Queue</h2>
      
      <Card>
        <CardHeader><CardTitle>All Applications</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.fullName}</TableCell>
                  <TableCell>{app.type}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{app.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      {app.id && <Link to={`/admin/applications/${app.id}`}>Review</Link>}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
