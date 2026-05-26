"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Plus, Edit2, FileText, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockInvoices = [
  { id: "INV-001", patient: "John Doe", amount: "₦15,000", issueDate: "2026-10-10", dueDate: "2026-10-24", status: "Unpaid" },
  { id: "INV-002", patient: "Jane Smith", amount: "₦25,000", issueDate: "2026-10-08", dueDate: "2026-10-22", status: "Paid" },
  { id: "INV-003", patient: "Robert Johnson", amount: "₦10,000", issueDate: "2026-09-01", dueDate: "2026-09-15", status: "Overdue" },
];

export default function AdminInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = mockInvoices.filter(
    (i) =>
      i.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Invoice Number, Patient..."
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
                  <th className="px-4 py-3 font-medium">Invoice No</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Issue / Due Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{inv.id}</td>
                    <td className="px-4 py-3 text-gray-700">{inv.patient}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{inv.amount}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {inv.issueDate} <br />
                      <span className="text-gray-400">{inv.dueDate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {inv.status}
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
                            <FileText className="w-4 h-4 mr-2" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Invoice
                          </DropdownMenuItem>
                          {inv.status !== 'Paid' && (
                            <DropdownMenuItem className="cursor-pointer text-green-600">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Paid
                            </DropdownMenuItem>
                          )}
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
