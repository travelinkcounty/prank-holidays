"use client";

import React from "react";
import { Phone, HelpCircle, MessageCircle } from "lucide-react";

const actions = [
  { icon: <MessageCircle />, label: "WhatsApp", color: "bg-[var(--primary-green)]" },
  { icon: <Phone />, label: "Call", color: "bg-[var(--primary-yellow)] text-black" },
  { icon: <HelpCircle />, label: "Help", color: "bg-[var(--primary-red)]" },
];

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {actions.map((action) => (
        <button
          key={action.label}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white font-semibold text-base transition-transform hover:scale-105 hover:shadow-xl focus:outline-none ${action.color}`}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default FloatingButtons;
