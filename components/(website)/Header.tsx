"use client";

import React from "react";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Management", href: "/management" },
  { name: "Locations", href: "/locations" },
  { name: "Packages", href: "/packages" },
  { name: "Membership", href: "/membership" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-[#e3061320]">
      <div className="container mx-auto px-4 flex items-center justify-between py-1.5 min-h-[46px]">
        <div className="flex items-center gap-0">
          <span className="inline-flex items-center">
            <Image src="/logo.jpeg" alt="Travelink County Logo" width={150} height={67} className="mr-2 rounded-md" />
          </span>
        </div>
        <nav className="hidden md:flex gap-5 items-center text-base font-bold" style={{ fontFamily: 'var(--font-main)' }}>
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-[#1a4d8f] hover:text-[#ffc72c] transition-colors px-2 py-1 rounded-md hover:bg-[#fff1e6]">
              {link.name}
            </a>
          ))}
          <a href="/login" className="ml-3 bg-[#e30613] text-white font-bold px-6 py-1.5 rounded-full shadow-lg hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] hover:scale-105 active:scale-100 text-base">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
