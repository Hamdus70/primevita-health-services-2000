"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useFinanceStore } from "@/stores/finance.store";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminFinanceDashboardPage() {
  const { metrics } = useFinanceStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/invoices">
            <Button variant="outline">Invoices</Button>
          </Link>
          <Link href="/admin/payments">
            <Button variant="outline">Payment Records</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Invoices Issued</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.invoicesIssued}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">₦{metrics.totalCollected.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Outstanding Balance</CardTitle>
            <CreditCard className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">₦{metrics.outstanding.toLocaleString()}</div>
            <p className="text-xs text-red-600 mt-1">Overall unpaid</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Overdue Invoices</CardTitle>
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{metrics.overdue}</div>
            <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
              <span className="text-gray-400">Chart: Revenue Trends</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
              <span className="text-gray-400">Chart: Payment History</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
