"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";

export default function StaffAttendancePage() {
  const [msg, setMsg] = useState("");

  const handleClockIn = () => {
    setMsg("Clocked in successfully at " + new Date().toLocaleTimeString());
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <AuthSuccessAlert message={msg} />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Current Shift</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-orange-600">Not Clocked In</span>
          </div>
          <Button onClick={handleClockIn} className="w-full mt-4">Clock In Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
