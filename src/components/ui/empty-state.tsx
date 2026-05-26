import React from "react";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description = "No data available at this time.", 
  icon = <FileQuestion className="w-12 h-12 text-gray-400" />,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed bg-gray-50">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
