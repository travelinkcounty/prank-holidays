"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  // { name: "Management", href: "/management" },
  { name: "Locations", href: "/locations" },
  { name: "Packages", href: "/packages" },
  { name: "Membership", href: "/membership" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let u = null;
      try {
        u = JSON.parse(localStorage.getItem("user") || "null");
      } catch {}
      if (!u) {
        const match = document.cookie.match(/user=([^;]+)/);
        if (match) {
          try {
            u = JSON.parse(decodeURIComponent(match[1]));
          } catch {}
        }
      }
      setUser(u);
    }
  }, [pathname]);

  let profileHref = "/profile";
  let profileLabel = "Profile";
  if (user?.role === "admin") {
    profileHref = "/dashboard";
    profileLabel = "Dashboard";
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-[#e3061320]">
      <div className="container mx-auto px-4 flex items-center justify-between py-1.5 min-h-[46px]">
        <div className="flex items-center gap-0">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.jpeg" alt="Travelink County Logo" width={150} height={67} className="mr-2 rounded-md" />
          </Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-5 items-center text-base font-bold" style={{ fontFamily: 'var(--font-main)' }}>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={
                  `px-2 py-1 rounded-md transition-colors cursor-pointer ` +
                  (isActive
                    ? "text-yellow-500 font-bold"
                    : "text-[#1a4d8f] hover:text-[#ffc72c] hover:bg-[#fff1e6]")
                }
              >
                {link.name}
              </Link>
            );
          })}
          {user ? (
            <Link
              href={profileHref}
              className="ml-3 bg-[#e30613] text-white font-bold px-6 py-1.5 rounded-full shadow-lg hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] hover:scale-105 active:scale-100 text-base"
            >
              {profileLabel}
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-3 bg-[#e30613] text-white font-bold px-6 py-1.5 rounded-full shadow-lg hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] hover:scale-105 active:scale-100 text-base"
            >
              Login
            </Link>
          )}
        </nav>
        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e30613]"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7 text-[#e30613]" />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg flex flex-col p-6 relative animate-slide-in" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 p-2 rounded focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-[#e30613]" />
            </button>
            <nav className="flex flex-col gap-4 mt-10 text-lg font-bold" style={{ fontFamily: 'var(--font-main)' }}>
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={
                    `px-2 py-1 rounded-md transition-colors cursor-pointer ` +
                    (pathname === link.href
                      ? "text-yellow-500 font-bold"
                      : "text-[#1a4d8f] hover:text-[#ffc72c] hover:bg-[#fff1e6]")
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {/* Hotels link only for mobile menu */}
              <Link
                href="/hotels"
                className={
                  `px-2 py-1 rounded-md transition-colors cursor-pointer text-[#1a4d8f] hover:text-[#ffc72c] hover:bg-[#fff1e6]`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              {user ? (
                <Link
                  href={profileHref}
                  className="mt-4 bg-[#e30613] text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {profileLabel}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="mt-4 bg-[#e30613] text-white font-bold px-6 py-2 rounded-full shadow-lg hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
