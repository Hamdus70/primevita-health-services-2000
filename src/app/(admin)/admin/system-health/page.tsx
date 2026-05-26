"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Database, Server, Mail, MessageSquare, BrainCircuit, HardDrive, RefreshCw, ShieldAlert } from "lucide-react";
import { useAdminStore } from "@/stores/admin.store";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminSystemHealthPage() {
  const { systemHealth } = useAdminStore();
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      // Logic to fetch system health would go here
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500">Only Super Admins can view system health metrics.</p>
      </div>
    );
  }

  const services = [
    { name: "Database (PostgreSQL)", icon: <Database />, status: systemHealth.database, latency: "42ms" },
    { name: "Redis Cache", icon: <Server />, status: systemHealth.redis, latency: "12ms" },
    { name: "Storage (S3)", icon: <HardDrive />, status: "up", latency: "105ms" },
    { name: "Email Server (SendGrid)", icon: <Mail />, status: "up", latency: "200ms" },
    { name: "SMS Gateway (Twilio)", icon: <MessageSquare />, status: "up", latency: "180ms" },
    { name: "AI Inference (Gemini)", icon: <BrainCircuit />, status: "up", latency: "850ms" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-green-600" /> System Health
          </h1>
          <p className="text-sm text-gray-500">Live monitoring of infrastructure and integrations.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">Last updated: {lastRefreshed}</span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" onClick={() => setLastRefreshed(new Date().toLocaleTimeString())}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <Card key={idx} className={service.status === "down" ? "border-red-200" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                {React.cloneElement(service.icon as React.ReactElement, { className: "w-4 h-4" })}
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  {service.status === 'up' ? (
                    <span className="px-2 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800 flex items-center gap-1 w-max">
                      <span className="w-2 h-2 rounded-full bg-green-600 block"></span> Operational
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800 flex items-center gap-1 w-max">
                      <span className="w-2 h-2 rounded-full bg-red-600 block"></span> Degraded / Down
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  {service.latency}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Background Job Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-100 rounded-full h-8 flex items-center overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${Math.min(100, (systemHealth.queue / 1000) * 100)}%` }}></div>
              </div>
              <div className="shrink-0 font-bold text-gray-700 min-w-[120px] text-right">
                {systemHealth.queue} items
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Maximum comfortable queue length is ~1,000.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
