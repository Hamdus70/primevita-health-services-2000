"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, Ban, User, Briefcase, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminStaffProfilePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/staff">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Staff Profile: Dr. Sarah Adams
            <span className="px-2 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800">
              Active
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
              Approved
            </span>
          </h1>
          <p className="text-sm text-gray-500">ID: {id} • DOCTOR • Cardiology</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5"/> Identity & Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Full Name</span><span className="font-medium">Dr. Sarah Adams</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Email</span><span className="font-medium">sarah.adams@hospital.com</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phone</span><span className="font-medium">+234 800 123 4567</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5"/> Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Role</span><span className="font-medium">DOCTOR</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Department</span><span className="font-medium">Cardiology</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Qualifications</span><span className="font-medium">MBBS, MD Cardiology</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5"/> HR & History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Approval Date</span><span className="font-medium">2026-09-01</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Interview History</span><span className="font-medium text-blue-600 cursor-pointer">View Records</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Attendance Ratio</span><span className="font-medium text-green-600">98%</span></div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700"><ShieldAlert className="w-5 h-5"/> Security & Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-red-100 pb-2"><span className="text-gray-500">Failed Logins</span><span className="font-medium">0</span></div>
            <div className="flex justify-between border-b border-red-100 pb-2"><span className="text-gray-500">Account Locked</span><span className="font-medium text-green-600">No</span></div>
            <div className="flex justify-between border-b border-red-100 pb-2"><span className="text-gray-500">Session Version</span><span className="font-medium">v4.2</span></div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 w-full">
                <ShieldAlert className="w-4 h-4 mr-2" /> Force Logout
              </Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full">
                <Ban className="w-4 h-4 mr-2" /> Suspend
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
