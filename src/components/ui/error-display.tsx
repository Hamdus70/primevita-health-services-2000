import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ title = "An error occurred", message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-red-200 bg-red-50 rounded-lg text-center">
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="text-md font-semibold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-red-200 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      )}
    </div>
  );
}
