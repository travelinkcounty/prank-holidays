"use client";

import React from "react";
import { UserCircle } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-[var(--primary-blue)] text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-main)' }}>
        Prank Dashboard
      </div>
      <div className="flex items-center gap-3">
        {/* Placeholder for user avatar or profile menu */}
        <UserCircle className="w-8 h-8 text-[var(--primary-yellow)]" />
      </div>
    </header>
  );
};

export default DashboardHeader;
