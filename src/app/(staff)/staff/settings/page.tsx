"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function StaffSettingsPage() {
  const [msg, setMsg] = useState("");

  const handleSave = () => {
    setMsg("Settings saved successfully.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Preferences</h1>
      <AuthSuccessAlert message={msg} />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Push Notifications</p>
              <p className="text-gray-500">Receive alerts for critical patient updates.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Dark Mode</p>
              <p className="text-gray-500">Toggle dark mode interface.</p>
            </div>
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <Button onClick={handleSave} className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
