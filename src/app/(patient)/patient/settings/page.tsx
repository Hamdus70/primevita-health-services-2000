"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function PatientSettingsPage() {
  const [msg, setMsg] = useState("");

  const handleSave = () => {
    setMsg("Settings saved.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <AuthSuccessAlert message={msg} />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates and reminders via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive updates and reminders via SMS</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <Button onClick={handleSave} className="mt-4">Save Preferences</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">You can request your account to be deactivated if you no longer wish to use the services.</p>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Request Deactivation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
