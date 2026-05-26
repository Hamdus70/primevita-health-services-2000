"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, CheckCircle2, XCircle, Calendar } from "lucide-react";

export default function AdminStaffApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "interview" | null>(null);

  const applications = [
    { id: "APP-001", name: "Dr. Emily Chen", role: "DOCTOR", date: "2026-10-10", status: "Pending Review", cvTitle: "Chen_CV_2026.pdf" },
    { id: "APP-002", name: "Marcus Johnson", role: "NURSE", date: "2026-10-11", status: "Pending Review", cvTitle: "Marcus_Nursing_CV.pdf" },
  ];

  const handleAction = () => {
    // API logic goes here
    setSelectedApp(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Staff Applications</h1>

      <div className="grid gap-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{app.name}</h3>
                <p className="text-sm text-gray-500">Applied for: {app.role} • {app.date}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 underline cursor-pointer">{app.cvTitle}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => { setSelectedApp(app); setActionType("interview"); }}>
                  <Calendar className="w-4 h-4 mr-2" /> Request Interview
                </Button>
                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => { setSelectedApp(app); setActionType("approve"); }}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => { setSelectedApp(app); setActionType("reject"); }}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Confirm Approval"}
              {actionType === "reject" && "Confirm Rejection"}
              {actionType === "interview" && "Schedule Interview"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              You are about to {actionType} the application for <strong>{selectedApp?.name}</strong>.
            </p>
            {actionType === "reject" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Rejection Reason</label>
                <textarea className="w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            )}
            {actionType === "approve" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Approval Notes (Optional)</label>
                <textarea className="w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            )}
            {actionType === "interview" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Interview Notes for Candidate</label>
                <textarea className="w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApp(null)}>Cancel</Button>
            <Button onClick={handleAction} className={actionType === "reject" ? "bg-red-600 hover:bg-red-700" : actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
