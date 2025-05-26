"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, DollarSign, Plane } from "lucide-react";

const steps = [
  {
    title: "Pick Your Place",
    description: "Whether it's a beach or a mountain, choose your favorite spot and kickstart your journey. There's something special for every traveler!",
    icon: <Globe className="w-14 h-14 text-[#8bc34a] bg-white rounded-full p-2 shadow" />, // Green globe icon
    border: "border-[#b6d957]",
    bg: "",
  },
  {
    title: "Book & Pay Easily",
    description: "Booking and payment are now super simple – confirm your trip in just a few clicks, totally hassle-free!",
    icon: <DollarSign className="w-14 h-14 text-[#8bc34a] bg-white rounded-full p-2 shadow" />, // Green dollar icon
    border: "border-[#b6d957]",
    bg: "",
  },
  {
    title: "Take Off Instantly",
    description: "Book today and take off right away. Even last-minute plans are now stress-free and easy!",
    icon: <Plane className="w-14 h-14 text-[#8bc34a] bg-white rounded-full p-2 shadow" />, // Green plane icon
    border: "border-[#b6d957]",
    bg: "",
  },
];

const ProcessSection = () => (
  <section className="py-16 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-5xl font-extrabold text-center mb-10 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
        Our Process
      </h2>
      <div className="flex flex-col gap-7 md:grid md:grid-cols-3 md:gap-8 items-stretch">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="h-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <div
              className={`flex flex-col items-center text-center rounded-xl border ${step.border} bg-white shadow-sm px-8 py-8 transition-all duration-300 ${step.bg} h-full`}
              style={{ height: '100%' }}
            >
              <div className="flex items-center justify-center rounded-full bg-[#ffe066]/30 p-3 mb-4">
                {step.icon}
              </div>
              <span className="font-bold text-[#e63946] text-lg mb-2" style={{ fontFamily: 'var(--font-main)' }}>{step.title}</span>
              <span className="text-gray-600 text-base leading-tight">{step.description}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;