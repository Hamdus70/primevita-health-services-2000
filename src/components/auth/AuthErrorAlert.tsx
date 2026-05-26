import React, { useState, useEffect, Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface AuthErrorAlertProps {
  message?: string;
}

function ErrorDisplay({ message }: AuthErrorAlertProps) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  
  const [displayMessage, setDisplayMessage] = useState<string | null>(message || null);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      return;
    }

    if (!errorParam) {
      setDisplayMessage(null);
      return;
    }

    switch (errorParam) {
      case "CredentialsSignin":
      case "Invalid credentials":
        setDisplayMessage("Invalid username or password.");
        break;
      case "Account locked":
        setDisplayMessage("Account is locked due to too many failed attempts. Please try again later.");
        break;
      case "Patient onboarding incomplete":
        setDisplayMessage("Your registration is incomplete. Please complete onboarding.");
        break;
      case "Your account is pending approval":
        setDisplayMessage("Your account is under review and pending approval.");
        break;
      case "Interview scheduled. Approval pending":
        setDisplayMessage("Your interview is scheduled. Account approval is pending.");
        break;
      case "Staff application rejected":
        setDisplayMessage("Your staff application has been rejected.");
        break;
      case "Password reset required":
        setDisplayMessage("A password reset is required before you can log in.");
        break;
      case "Session payload corrupted":
        setDisplayMessage("Session error. Please log in again.");
        break;
      case "session_timeout":
      case "Session timeout":
        setDisplayMessage("Your session expired after inactivity. Please sign in again.");
        break;
      case "forced_logout":
      case "Forced logout":
        setDisplayMessage("You were signed out by an administrator.");
        break;
      case "access_denied":
      case "Access denied":
        setDisplayMessage("You do not have permission to access that area.");
        break;
      default:
        setDisplayMessage(decodeURIComponent(errorParam));
        break;
    }
  }, [errorParam, message]);

  if (!displayMessage) return null;

  return (
    <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start gap-3 border border-red-200 text-sm mb-4">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <span>{displayMessage}</span>
    </div>
  );
}

export function AuthErrorAlert(props: AuthErrorAlertProps) {
  return (
    <Suspense>
      <ErrorDisplay {...props} />
    </Suspense>
  );
}
