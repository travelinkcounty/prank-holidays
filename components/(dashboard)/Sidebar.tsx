"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Image, LogOut, MapPin, Package, Menu, History, Building2 } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
  { name: "Users", href: "/dashboard/users", icon: <Users /> },
  { name: "Leads", href: "/dashboard/leads", icon: <FileText /> },
  { name: "Packages", href: "/dashboard/packages", icon: <Package /> },
  { name: "Plans", href: "/dashboard/plans", icon: <FileText /> },
  { name: "Locations", href: "/dashboard/locations", icon: <MapPin /> },
  { name: "Hotels", href: "/dashboard/hotels", icon: <Building2 /> },
  { name: "Gallery", href: "/dashboard/gallery", icon: <Image /> },
  { name: "Memberships", href: "/dashboard/memberships", icon: <Users /> },
  { name: "History", href: "/dashboard/history", icon: <History /> },
  { name: "Join Us", href: "/dashboard/join-us", icon: <Users /> },
  { name: "Logout", href: "/logout", icon: <LogOut /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <>
      {/* Logo at the top, centered */}
      <div className="flex flex-col items-center mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-black">Travelink County</h1>
        <div className="w-24 h-1 rounded-full mt-2" style={{ background: 'linear-gradient(90deg, #e63946 0%, #ffe066 50%, #457b9d 100%)' }} />
      </div>
      <nav className="flex flex-col gap-2 mt-0">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base select-none
                border-l-4
                ${isActive
                  ? "text-[#e63946] font-bold border-[#e63946] bg-white shadow-sm"
                  : "font-medium text-gray-700 hover:bg-[#e63946]/10 hover:text-[#e63946] border-transparent"}`}
              style={{ fontFamily: 'var(--font-main)' }}
              onClick={() => setOpen(false)}
            >
              <span
                className={`flex items-center justify-center transition-all
                  ${isActive
                    ? "text-[#e63946] font-bold scale-110"
                    : "text-gray-500"}
                  `}
                style={{ minWidth: 32, minHeight: 32 }}
              >
                {React.cloneElement(link.icon, {
                  size: isActive ? 24 : 20,
                  strokeWidth: isActive ? 2.5 : 1.8,
                  className: isActive ? "text-[#e63946]" : "text-gray-500"
                })}
              </span>
              <span className="truncate">{link.name}</span>
            </a>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex flex-col h-screen sticky top-0 z-[9999]">
      {/* Hamburger for mobile */}
      <button
        className="absolute top-4 left-4 md:hidden bg-white rounded-full p-2 shadow border border-gray-200 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-[#e63946]" />
      </button>

      {/* Overlay for mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar drawer for mobile, static for md+ */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl border-r border-gray-200 py-8 px-4 flex flex-col gap-6 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:min-h-screen md:block
        `}
        style={{ maxWidth: 280 }}
      >
        {sidebarContent}
      </aside>
    </div>
  );
};

export default Sidebar;
