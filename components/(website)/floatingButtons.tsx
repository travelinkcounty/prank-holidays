"use client";

import React, { useState } from "react";
import { Phone, HelpCircle, MessageCircle, MessageCircleHeart } from "lucide-react";

const actions = [
  { icon: <MessageCircle />, label: "WhatsApp", color: "bg-[var(--primary-green)]" , href: "https://wa.me/919717308208"},
  { icon: <Phone />, label: "Call", color: "bg-[var(--primary-yellow)] text-black" , href: "tel:+919717308208"},
  { icon: <HelpCircle />, label: "Help", color: "bg-[var(--primary-red)]" , href: "/contact"},
];

const FloatingButtons = () => {
  const [open, setOpen] = useState(false);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#fab-root")) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div id="fab-root" className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col gap-3 mb-2 transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}>
        {actions.map((action, i) => (
          <button
            key={action.label}
            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white font-semibold text-base transition-transform hover:scale-105 hover:shadow-xl focus:outline-none ${action.color}`}
            aria-label={action.label}
            style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
            onClick={() => {
              if (action.href) {
                window.open(action.href, "_blank");
              }
            }}
          > 
            {action.icon}
          </button>
        ))}
      </div>
      {/* Main FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#e63946] text-white shadow-xl text-2xl hover:bg-[#ffe066] hover:text-[#e63946] transition-all focus:outline-none"
        aria-label="Open actions"
      >
        <MessageCircleHeart className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} size={32} />
      </button>
    </div>
  );
};

export default FloatingButtons;
