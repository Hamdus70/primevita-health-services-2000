// /src/components/nurse/NurseDashboard.tsx
import React from 'react';
import VitalSignsModule from './VitalSignsModule';
import CarePlanModule from './CarePlanModule';
import DrugChartModule from './DrugChartModule';
import IntakeOutputModule from './IntakeOutputModule';
import NursingReportModule from './NursingReportModule';

export const NurseDashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Nurse Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VitalSignsModule />
        <NursingReportModule />
        <IntakeOutputModule />
        <DrugChartModule />
        <CarePlanModule />
    </div>
  </div>
);
