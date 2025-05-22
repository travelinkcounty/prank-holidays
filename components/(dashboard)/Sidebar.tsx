"use client";

import React from "react";
import { LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
  { name: "Plans", href: "/dashboard/plans", icon: <FileText /> },
  { name: "Leads", href: "/dashboard/leads", icon: <Users /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings /> },
  { name: "Logout", href: "/logout", icon: <LogOut /> },
];

const Sidebar = () => {
  return (
    <aside className="bg-white text-black w-56 min-h-screen py-8 px-4 flex flex-col gap-2 shadow-lg border-r border-gray-200">
      <nav className="flex flex-col gap-2">
        {links.map(link => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            style={{ fontFamily: 'var(--font-main)' }}
          >
            <span className="w-5 h-5">{link.icon}</span>
            {link.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
