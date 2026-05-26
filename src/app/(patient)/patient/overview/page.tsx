"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClipboardList, CreditCard, HeartPulse, FileText, Activity, Bell } from "lucide-react";
import Link from "next/link";

export default function PatientOverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Patient Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/patient/appointments">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <ClipboardList className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 Upcoming</div>
              <p className="text-xs text-gray-500 mt-1">Next: Oct 24, 10:00 AM</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/billing">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦0.00</div>
              <p className="text-xs text-gray-500 mt-1">No outstanding invoices</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/care-plans">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Care Plans</CardTitle>
              <HeartPulse className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 Active</div>
              <p className="text-xs text-gray-500 mt-1">Requires your attention</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/medications">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medications</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Current</div>
              <p className="text-xs text-gray-500 mt-1">Check scheduled dosages</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/vitals">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vitals</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Normal</div>
              <p className="text-xs text-gray-500 mt-1">Last taken: Yesterday</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/announcements">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 Unread</div>
              <p className="text-xs text-gray-500 mt-1">General hospital updates</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
