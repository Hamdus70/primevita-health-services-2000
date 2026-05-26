"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { Send, Archive, Edit2 } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [msg, setMsg] = useState("");
  const form = useForm({
    defaultValues: { title: "", message: "", audience: "all", startDate: "", endDate: "" }
  });

  const onSubmit = () => {
    setMsg("Announcement published successfully.");
    setTimeout(() => setMsg(""), 3000);
    form.reset();
  };

  const activeAnnouncements = [
    { id: 1, title: "Flu Season Update", audience: "All Patients", expires: "2026-11-01" },
    { id: 2, title: "System Maintenance", audience: "Staff Only", expires: "2026-10-20" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Announcements</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compose New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-sm">
                <AuthSuccessAlert message={msg} />
                <div>
                  <label className="font-medium mb-1 block">Title</label>
                  <input {...form.register("title")} className="w-full border rounded-md p-2" required placeholder="Announcement Title" />
                </div>
                <div>
                  <label className="font-medium mb-1 block">Message</label>
                  <textarea {...form.register("message")} className="w-full border rounded-md p-2" rows={4} required placeholder="Write your message here..."></textarea>
                </div>
                <div>
                  <label className="font-medium mb-1 block">Audience</label>
                  <select {...form.register("audience")} className="w-full border rounded-md p-2 bg-white">
                    <option value="all">Everyone (Staff & Patients)</option>
                    <option value="staff">Staff Only</option>
                    <option value="patient">Patients Only</option>
                    <option value="selected">Selected Patients (Manual List)</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-medium mb-1 block">Start Date</label>
                    <input type="date" {...form.register("startDate")} className="w-full border rounded-md p-2" required />
                  </div>
                  <div className="flex-1">
                    <label className="font-medium mb-1 block">End Date</label>
                    <input type="date" {...form.register("endDate")} className="w-full border rounded-md p-2" required />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4"><Send className="w-4 h-4 mr-2" /> Publish Now</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAnnouncements.map(ann => (
              <div key={ann.id} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900">{ann.title}</h4>
                  <p className="text-sm text-gray-600">Audience: {ann.audience}</p>
                  <p className="text-xs text-red-500 mt-1">Expires: {ann.expires}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-orange-600 hover:bg-orange-50" title="Archive">
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
