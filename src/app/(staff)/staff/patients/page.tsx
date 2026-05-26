"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

const mockPatients = [
  { id: "P-1001", name: "John Doe", mrn: "MRN-102938", ward: "Cardiology", status: "Stable", assignedClinician: "Dr. Smith" },
  { id: "P-1002", name: "Jane Smith", mrn: "MRN-102939", ward: "Neurology", status: "Critical", assignedClinician: "Dr. Adams" },
  { id: "P-1003", name: "Robert Johnson", mrn: "MRN-102940", ward: "General", status: "Discharging", assignedClinician: "Dr. Smith" },
];

export default function StaffPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Patient Directory</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by MRN, Name, or Ward..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient Name</th>
                  <th className="px-4 py-3 font-medium">MRN</th>
                  <th className="px-4 py-3 font-medium">Ward</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Clinician</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.mrn}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.ward}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${patient.status === 'Critical' ? 'bg-red-100 text-red-800' : patient.status === 'Discharging' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{patient.assignedClinician}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/staff/patients/${patient.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No patients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
