"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Activity, HeartPulse, FileText, Pill, BrainCircuit, ActivitySquare } from "lucide-react";

export default function PatientChartLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { patientId: string };
}) {
  const pathname = usePathname();
  const tabs = [
    { name: "Overview", href: `/staff/patients/${params.patientId}`, icon: <User className="w-4 h-4 mr-2" /> },
    { name: "Quick Assessment", href: `/staff/patients/${params.patientId}/quick-assessment`, icon: <ActivitySquare className="w-4 h-4 mr-2" /> },
    { name: "Vitals", href: `/staff/patients/${params.patientId}/vitals`, icon: <Activity className="w-4 h-4 mr-2" /> },
    { name: "Care Plan", href: `/staff/patients/${params.patientId}/care-plan`, icon: <HeartPulse className="w-4 h-4 mr-2" /> },
    { name: "Doctor Notes", href: `/staff/patients/${params.patientId}/doctor-notes`, icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: "Medications", href: `/staff/patients/${params.patientId}/medications`, icon: <Pill className="w-4 h-4 mr-2" /> },
    { name: "AI Investigator", href: `/staff/patients/${params.patientId}/ai-investigator`, icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/staff/patients">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Patient Chart: John Doe
            <span className="px-2 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800">
              Stable
            </span>
          </h1>
          <p className="text-sm text-gray-500">MRN: {params.patientId} • DOB: 1990-01-01 (36y) • Male</p>
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-1 border-b border-gray-200 hide-scrollbar pb-1">
        {tabs.map((tab) => tab.href && (
          <Link key={tab.href} href={tab.href}>
            <Button
              variant={pathname === tab.href ? "secondary" : "ghost"}
              className={`rounded-b-none ${pathname === tab.href ? "border-b-2 border-blue-600 font-bold" : "text-gray-500 font-medium"}`}
            >
              {tab.icon}
              {tab.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
