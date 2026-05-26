"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function PatientBillingPage() {
  const [msg, setMsg] = useState("");

  const initiatePayment = () => {
    setMsg("Payment gateway integration pending.");
    setTimeout(() => setMsg(""), 3000);
  };

  const downloadReceipt = () => {
    setMsg("Receipt downloaded.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing & Invoices</h1>
      <AuthSuccessAlert message={msg} />
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-900">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">₦15,000</div>
            <p className="text-sm text-red-600 mt-1">Due by Oct 30, 2026</p>
            <Button onClick={initiatePayment} className="w-full mt-4 bg-red-600 hover:bg-red-700">
              <CreditCard className="w-4 h-4 mr-2" /> Pay Now
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div>
                  <div className="font-semibold">General Checkup</div>
                  <div className="text-xs text-gray-500">INV-0102 • Oct 10, 2026</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">₦15,000</div>
                    <div className="text-[10px] font-bold text-red-600 uppercase">Unpaid</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadReceipt}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div>
                  <div className="font-semibold">Lab Tests</div>
                  <div className="text-xs text-gray-500">INV-0098 • Sep 15, 2026</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">₦25,000</div>
                    <div className="text-[10px] font-bold text-green-600 uppercase">Paid</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadReceipt}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
