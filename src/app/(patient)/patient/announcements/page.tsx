"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, Info } from "lucide-react";

export default function PatientAnnouncementsPage() {
  const announcements = [
    { title: "Flu Season Update", date: "Oct 12, 2026", message: "Flu shots are now available at the main clinic. Walk-ins welcome.", unread: true },
    { title: "Clinic Closure Notice", date: "Oct 01, 2026", message: "The cardiology department will be closed on Oct 15th for system upgrades.", unread: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>
      
      <div className="grid gap-4">
        {announcements.map((ann, i) => (
          <Card key={i} className={`transition-colors ${ann.unread ? "border-blue-200 bg-blue-50/10" : ""}`}>
            <CardContent className="p-4 flex gap-4">
              <div className={`shrink-0 p-2 rounded-full h-10 w-10 flex items-center justify-center ${ann.unread ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-base ${ann.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{ann.title}</h3>
                  <span className="text-xs text-gray-500">{ann.date}</span>
                </div>
                <p className={`mt-1 text-sm ${ann.unread ? "text-gray-700" : "text-gray-500"}`}>{ann.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
