// /src/components/emr/EMRViewer.tsx
import React from 'react';
import { Patient, VitalSigns, CarePlan, DrugChart, IntakeOutput, NursingReport } from '../../types/emr';

export const EMRViewer = ({ patientId }: { patientId: string }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">EMR Viewer - Patient {patientId}</h2>
    {/* Implementation */}
  </div>
);
