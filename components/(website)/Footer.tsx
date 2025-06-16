"use client";

import React from "react";
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#181929] text-white pt-12 pb-4 mt-8 border-t-4 border-[#ffe066]" style={{ fontFamily: 'var(--font-main)' }}>
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Logo, Name, Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-center gap-8 mb-3">
              <Image src="/favicon.png" alt="Travelink County" width={100} height={100} className="h-auto w-auto" />
              <h1 className="text-2xl text-white/80 font-bold">Travelink <br /> County</h1>
          </div>
          <p className="text-white/80 max-w-xs">
            Your trusted partner for travel, events, and unforgettable experiences. Explore the world with us!
          </p>
        </div>
        {/* Address & Social */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e63946]">Contact</h3>
          <ul className="space-y-2 text-white/90 mb-4">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e63946]" />
              <span>Travelink County Pvt. Ltd.<br />
              FB/B1, Mathura Rd, Block B-1, Block E,<br />
              Mohan Cooperative Industrial Estate,<br />
              Badarpur, New Delhi, Delhi 110044</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e63946]" />
              <span>+91 - 9717308208<br />
              +91 - 9220413324</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e63946]" />
              <div className="flex flex-col">
                <span>Toll Free: 1800 890 5660</span>
                <span>Landline: +91-45725977</span>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e63946]" />
              <span>info@travelinkcounty.com</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <a href="https://wa.me/919717308208" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><MessageCircle className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/travelink_county/" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Instagram className="w-5 h-5" /></a>
            <a href="https://www.youtube.com/@TravelinkCounty-y2o/shorts" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        {/* Quick Links */}
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="text-xl font-extrabold mb-4 text-[#e63946]">Quick Links</h3>
          <ul className="space-y-2 text-white/90">
            <li><a href="/home" className="hover:text-[#ffe066] transition">Home</a></li>
            <li><a href="/packages" className="hover:text-[#ffe066] transition">Packages</a></li>
            <li><a href="/membership" className="hover:text-[#ffe066] transition">Membership</a></li>
            <li><a href="/hotels" className="hover:text-[#ffe066] transition">Hotels</a></li>
            <li><a href="/contact" className="hover:text-[#ffe066] transition">Contact Us</a></li>
            <li><a href="/about" className="hover:text-[#ffe066] transition">About Us</a></li>
          </ul>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/60 gap-2">
        <div>
          &copy; {new Date().getFullYear()} <span className="font-bold text-white">Travelink County</span>. All Rights Reserved.
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center w-full md:w-auto">
          <a href="/privacy-policy" className="hover:text-[#ffe066]">Privacy Policy</a>
          <span className="hidden md:inline mx-2">|</span>
          <a href="/terms" className="hover:text-[#ffe066]">Terms & Conditions</a>
          <span className="hidden md:inline mx-2">|</span>
          <a href="/refund-policy" className="hover:text-[#ffe066]">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  