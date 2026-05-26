import React from "react";
import { CheckCircle2 } from "lucide-react";

interface AuthSuccessAlertProps {
  message?: string;
}

export function AuthSuccessAlert({ message }: AuthSuccessAlertProps) {
  if (!message) return null;

  return (
    <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-start gap-3 border border-green-200 text-sm mb-4">
      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
