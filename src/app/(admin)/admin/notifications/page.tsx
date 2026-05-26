"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, HeartPulse, UserPlus, AlertCircle, Check } from "lucide-react";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function AdminNotificationsPage() {
  const [msg, setMsg] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "system", title: "Redis Cache Limit Reached", message: "System health check indicates redis memory usage is at 90%.", time: "10 mins ago", read: false },
    { id: 2, type: "staff", title: "New Staff Application", message: "Dr. Emily Chen has applied for the DOCTOR role in Cardiology.", time: "1 hour ago", read: false },
    { id: 3, type: "finance", title: "Large Payment Received", message: "Payment of ₦150,000 via Bank Transfer has been confirmed.", time: "2 hours ago", read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setMsg("All notifications marked as read.");
    setTimeout(() => setMsg(""), 3000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "system": return <HeartPulse className="w-5 h-5 text-red-500" />;
      case "staff": return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "finance": return <AlertCircle className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Notifications</h1>
        <Button variant="outline" onClick={markAllRead}>
          <Check className="w-4 h-4 mr-2" /> Mark All Read
        </Button>
      </div>

      <AuthSuccessAlert message={msg} />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {notifications.map(notify => (
              <div key={notify.id} className={`p-4 border-b last:border-0 flex gap-4 items-start ${notify.read ? 'bg-white' : 'bg-blue-50/30'}`}>
                <div className={`p-2 rounded-full shrink-0 ${notify.read ? 'bg-gray-100' : 'bg-white border'}`}>
                  {getIcon(notify.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm md:text-base ${notify.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{notify.title}</h4>
                    <span className="text-xs text-gray-500">{notify.time}</span>
                  </div>
                  <p className={`text-sm mt-1 ${notify.read ? 'text-gray-500' : 'text-gray-700'}`}>{notify.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
