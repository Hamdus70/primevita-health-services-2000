"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileText } from "lucide-react";

const mockPayments = [
  { id: "PAY-1001", patient: "Jane Smith", method: "Credit Card", amount: "₦25,000", date: "2026-10-15", ref: "TXN-987654", receipt: "RCP-002" },
  { id: "PAY-1002", patient: "John Doe", method: "Bank Transfer", amount: "₦15,000", date: "2026-10-14", ref: "TXN-123456", receipt: "RCP-001" },
];

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = mockPayments.filter(
    (p) =>
      p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Payment Records</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, Patient, Transfer Ref..."
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
                  <th className="px-4 py-3 font-medium">Payment ID</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Amount & Method</th>
                  <th className="px-4 py-3 font-medium">Date Verified</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{pay.id}</td>
                    <td className="px-4 py-3 text-gray-700">{pay.patient}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{pay.amount}</div>
                      <div className="text-xs text-gray-500">{pay.method}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{pay.date}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-gray-100 p-1 px-2 rounded border">{pay.ref}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" title="View Receipt">
                        <FileText className="w-4 h-4 mr-2" /> Receipt
                      </Button>
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
