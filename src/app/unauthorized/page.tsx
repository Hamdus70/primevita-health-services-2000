import React from "react";
import Link from "next/link";
import { ErrorDisplay } from "@/components/ui/error-display";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ErrorDisplay 
        title="Unauthorized" 
        message="You do not have permission to view this page." 
      />
      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
