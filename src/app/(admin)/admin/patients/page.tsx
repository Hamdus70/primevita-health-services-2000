"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Ban, RefreshCw, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockPatients = [
  { id: "P-1001", name: "John Doe", mrn: "MRN-102938", phone: "+234800111222", regDate: "2026-10-01", onboard: "Complete", active: true, dept: "Cardiology" },
  { id: "P-1002", name: "Jane Smith", mrn: "MRN-102939", phone: "+234800111333", regDate: "2026-10-05", onboard: "Pending", active: true, dept: "Neurology" },
  { id: "P-1003", name: "Robert Johnson", mrn: "MRN-102940", phone: "+234800111444", regDate: "2026-09-15", onboard: "Complete", active: false, dept: "General" },
];

export default function AdminPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Patient Administration</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by MRN, Name, Phone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient Info</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Registration</th>
                  <th className="px-4 py-3 font-medium">Onboarding</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.mrn} • {patient.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{patient.dept}</td>
                    <td className="px-4 py-3 text-gray-600">{patient.regDate}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${patient.onboard === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {patient.onboard}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${patient.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                        {patient.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="w-4 h-4 mr-2" /> Billing Summary
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" /> Resend Onboarding
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Ban className="w-4 h-4 mr-2" /> {patient.active ? 'Disable Account' : 'Restore Account'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div>Showing 1 to {filteredPatients.length} of {filteredPatients.length} entries</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
