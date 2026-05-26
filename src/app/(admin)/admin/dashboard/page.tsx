"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, Clock, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";

export default function AdminDashboardPage() {
  const { metrics, systemHealth, adminProfile } = useAdminStore();

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl">
            {adminProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-grow">
            <p className="font-bold text-lg">{adminProfile.name}</p>
            <p className="text-sm text-gray-600">{adminProfile.email} | {adminProfile.phone}</p>
            <p className="text-sm text-gray-500">ID: {adminProfile.staffId} | Age: {adminProfile.age}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login: {new Date(adminProfile.lastLogin).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="grid grid-cols-4 gap-4 mt-6">
            <Card><CardHeader><CardTitle className="text-sm">Staff Present</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{metrics.staffPresent}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Staff Absent</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{metrics.staffAbsent}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Pending Apps</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{metrics.pendingApprovals}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Active Patients</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{metrics.totalPatients}</CardContent></Card>
        </div>
        
        {systemHealth.status === "healthy" ? (
          <span className="px-3 py-1 flex items-center gap-2 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-600 block"></span> System Healthy
          </span>
        ) : (
          <span className="px-3 py-1 flex items-center gap-2 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800">
            <span className="w-2 h-2 rounded-full bg-red-600 block"></span> System degraded
          </span>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStaff}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3"/> +4% this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPatients}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3"/> +12% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Approvals</CardTitle>
            <ClipboardList className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{metrics.pendingApprovals}</div>
            <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Interviews</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{metrics.scheduledInterviews}</div>
            <p className="text-xs text-gray-500 mt-1">Coming up this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Registrations Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
              <span className="text-gray-400">Chart: Patient Growth & Registrations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
              <span className="text-gray-400">Chart: Role Distribution</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
