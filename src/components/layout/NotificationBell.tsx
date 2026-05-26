"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const [unreadCount] = useState(3);

  return (
    <button className="relative p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:outline-none" aria-label="Notifications">
      <Bell className="w-5 h-5 text-gray-700" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
