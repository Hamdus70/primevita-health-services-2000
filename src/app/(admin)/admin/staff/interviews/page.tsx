"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Edit2, X, Check } from "lucide-react";

export default function AdminStaffInterviewsPage() {
  const [interviews] = useState([
    { id: "INT-001", candidate: "Dr. Emily Chen", date: "2026-10-15 10:00 AM", interviewer: "Dr. Smith", mode: "Virtual", link: "https://meet.google.com/abc-defg-hij", status: "Scheduled" },
    { id: "INT-002", candidate: "Marcus Johnson", date: "2026-10-16 02:00 PM", interviewer: "Nurse Sarah", mode: "In-Person", link: "Room 402", status: "Scheduled" }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Interview Management</h1>
        <Button>
          <Calendar className="w-4 h-4 mr-2" /> Schedule Interview
        </Button>
      </div>

      <div className="grid gap-4">
        {interviews.map(interview => (
          <Card key={interview.id}>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">{interview.candidate}</h3>
                <p className="text-sm text-gray-500">Time: {interview.date} • Interviewer: {interview.interviewer}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 font-medium">{interview.mode}: {interview.link}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50" title="Mark Complete">
                  <Check className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" title="Cancel">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
