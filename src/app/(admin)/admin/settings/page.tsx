"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AuthSuccessAlert } from "@/components/auth/AuthSuccessAlert";
import { Shield } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminSettingsPage() {
  const [msg, setMsg] = useState("");
  const user = useAuthStore((state) => state.user);

  const formGeneral = useForm({
    defaultValues: { hospitalName: "NovaCare Hospital", timezone: "Africa/Lagos", contactEmail: "admin@novacare.com" }
  });

  const onSubmitGeneral = () => {
    setMsg("General settings updated.");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">System Settings</h1>
      
      <AuthSuccessAlert message={msg} />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...formGeneral}>
              <form onSubmit={formGeneral.handleSubmit(onSubmitGeneral)} className="space-y-4 text-sm max-w-xl">
                <div>
                  <label className="font-medium mb-1 block">Hospital Name</label>
                  <input {...formGeneral.register("hospitalName")} className="w-full border rounded-md p-2" />
                </div>
                <div>
                  <label className="font-medium mb-1 block">System Timezone</label>
                  <select {...formGeneral.register("timezone")} className="w-full border rounded-md p-2 bg-white">
                    <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium mb-1 block">Support Contact Email</label>
                  <input {...formGeneral.register("contactEmail")} type="email" className="w-full border rounded-md p-2" />
                </div>
                <Button type="submit">Save General Settings</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security & MFA (Super Admin)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm max-w-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-bold text-gray-900">Enforce Multi-Factor Authentication</p>
                <p className="text-gray-500">Require all staff to use 2FA apps.</p>
              </div>
              <input type="checkbox" className="w-4 h-4" disabled={user?.role !== "SUPER_ADMIN"} />
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-bold text-gray-900">Session Timeout</p>
                <p className="text-gray-500">Automatically log out inactive users.</p>
              </div>
              <select className="border rounded-md p-1 bg-white" disabled={user?.role !== "SUPER_ADMIN"}>
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>
            
            {user?.role !== "SUPER_ADMIN" && (
               <div className="flex bg-orange-50 text-orange-800 p-3 rounded-md items-center gap-2 mt-4">
                 <Shield className="w-4 h-4" />
                 <span className="text-sm font-medium">Security settings are locked. Only Super Admins can alter these policies.</span>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
