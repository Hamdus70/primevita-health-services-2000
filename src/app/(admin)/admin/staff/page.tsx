"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Ban, RefreshCw, Eye, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockStaff = [
  { id: "EMP-001", name: "Dr. Sarah Adams", role: "DOCTOR", dept: "Cardiology", approval: "Approved", active: true, onboard: "Complete", attendance: "Present" },
  { id: "EMP-002", name: "Nurse John Doe", role: "NURSE", dept: "Emergency", approval: "Pending", active: false, onboard: "Pending", attendance: "N/A" },
  { id: "EMP-003", name: "Dr. James Smith", role: "DOCTOR", dept: "General", approval: "Approved", active: true, onboard: "Complete", attendance: "Absent" },
];

export default function AdminStaffPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = mockStaff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/staff/applications">
            <Button variant="outline">View Applications</Button>
          </Link>
          <Link href="/admin/staff/interviews">
            <Button variant="outline">Interviews</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Employee ID, Name..."
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
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Role & Dept</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Attendance (Today)</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-700">{staff.role}</div>
                      <div className="text-xs text-gray-500">{staff.dept}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${staff.approval === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {staff.approval}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${staff.active ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                          {staff.active ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${staff.attendance === 'Present' ? 'bg-green-100 text-green-800' : staff.attendance === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {staff.attendance}
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
                          <Link href={`/admin/staff/${staff.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                          </Link>
                          {staff.approval === "Pending" && (
                            <>
                              <DropdownMenuItem className="cursor-pointer text-green-600">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-orange-600">
                            <ShieldAlert className="w-4 h-4 mr-2" /> Force Logout
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Ban className="w-4 h-4 mr-2" /> {staff.active ? 'Suspend Account' : 'Reactivate Account'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
