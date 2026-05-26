"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VitalSignsModule from "@/components/nurse/VitalSignsModule";
import NursingReportModule from "@/components/nurse/NursingReportModule";
import CarePlanModule from "@/components/nurse/CarePlanModule";
import DrugChartModule from "@/components/nurse/DrugChartModule";
import IntakeOutputModule from "@/components/nurse/IntakeOutputModule";

export default function PatientEMRPage({ params }: { params: { patientId: string } }) {
  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Patient: John Doe</h1>
            <p className="text-gray-600">ID: {params.patientId}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">Assigned Nurse: Nurse Jane Doe</p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="careplan">Care Plan</TabsTrigger>
          <TabsTrigger value="drugs">Drug Chart</TabsTrigger>
          <TabsTrigger value="io">Intake & Output</TabsTrigger>
          <TabsTrigger value="report">Nursing Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
            <p>Overview Content (Historical view)</p>
        </TabsContent>
        <TabsContent value="vitals">
            <VitalSignsModule />
        </TabsContent>
        <TabsContent value="careplan">
            <CarePlanModule />
        </TabsContent>
        <TabsContent value="drugs">
            <DrugChartModule />
        </TabsContent>
        <TabsContent value="io">
            <IntakeOutputModule />
        </TabsContent>
        <TabsContent value="report">
            <NursingReportModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}
