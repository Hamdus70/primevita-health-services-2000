"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

const mockLogs = [
  { id: "LOG-001", actor: "Admin User", role: "SUPER_ADMIN", action: "FORCE_LOGOUT", target: "users", record: "EMP-005", timestamp: "2026-10-15 14:32:01", ip: "192.168.1.55" },
  { id: "LOG-002", actor: "Dr. Sarah", role: "DOCTOR", action: "UPDATE_MEDICAL_RECORD", target: "records", record: "REC-991", timestamp: "2026-10-15 13:10:44", ip: "10.0.0.12" },
  { id: "LOG-003", actor: "Admin User", role: "ADMIN", action: "APPROVE_STAFF", target: "users", record: "EMP-008", timestamp: "2026-10-14 09:15:00", ip: "192.168.1.55" },
];

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useAuthStore((state) => state.user);

  // Protection handled by RouteGuard in layout, but extra safety
  if (user?.role !== "SUPER_ADMIN") {
    // If Admin manages to hit this URL, they see empty state or standard UI, 
    // but the RouteGuard blocks it anyway if we make layout guard handle it? 
    // Layout guard handles BOTH. To restrict just to SUPER_ADMIN:
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500">Only Super Admins can view audit logs.</p>
      </div>
    );
  }

  const filteredLogs = mockLogs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.record.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" /> System Audit Logs
          </h1>
          <p className="text-sm text-gray-500">Secure, read-only record of all system activities.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Actor, Action, or Record ID..."
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
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Target Table</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors font-mono text-xs md:text-sm">
                    <td className="px-4 py-3 text-gray-600">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{log.actor}</div>
                      <div className="text-gray-500">{log.role}</div>
                    </td>
                    <td className="px-4 py-3 text-blue-700 font-bold">{log.action}</td>
                    <td className="px-4 py-3 text-gray-600">{log.target}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{log.record}</td>
                    <td className="px-4 py-3 text-gray-500">{log.ip}</td>
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
