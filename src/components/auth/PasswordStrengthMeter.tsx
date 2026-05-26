import React from "react";

export function PasswordStrengthMeter({ password }: { password?: string }) {
  if (!password) {
    return (
      <div className="w-full mt-2">
        <div className="flex gap-1 h-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded-full" />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Enter a password to check strength</p>
      </div>
    );
  }

  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  const getColor = () => {
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    if (strength === 4) return "bg-green-500";
    return "bg-gray-200";
  };

  const getLabel = () => {
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    if (strength === 4) return "Strong";
    return "";
  };

  return (
    <div className="w-full mt-2">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${i <= strength ? getColor() : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">{getLabel()}</p>
    </div>
  );
}
