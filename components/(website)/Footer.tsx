"use client";

import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#181929] text-white pt-12 pb-4 mt-8 border-t-4 border-[#ffe066]" style={{ fontFamily: 'var(--font-main)' }}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e63946]">Company</h3>
          <ul className="space-y-2 text-white/90">
            <li><a href="/about" className="flex items-center gap-2 hover:text-[#ffe066] transition"><span className="text-[#e63946]">&#8250;</span> About Us</a></li>
            <li><a href="/contact" className="flex items-center gap-2 hover:text-[#ffe066] transition"><span className="text-[#e63946]">&#8250;</span> Contact Us</a></li>
            <li><a href="/privacy" className="flex items-center gap-2 hover:text-[#ffe066] transition"><span className="text-[#e63946]">&#8250;</span> Privacy Policy</a></li>
            <li><a href="/terms" className="flex items-center gap-2 hover:text-[#ffe066] transition"><span className="text-[#e63946]">&#8250;</span> Terms & Condition</a></li>
            <li><a href="/faqs" className="flex items-center gap-2 hover:text-[#ffe066] transition"><span className="text-[#e63946]">&#8250;</span> FAQs & Help</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e63946]">Contact</h3>
          <ul className="space-y-2 text-white/90">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#e63946]" /> 123, Main Street, New Delhi, India</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#e63946]" /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#e63946]" /> info@travelinkcounty.com</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Youtube className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e63946] transition"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e63946]">Newsletter</h3>
          <p className="mb-4 text-white/80">Subscribe to our newsletter for exclusive travel deals, tips, and updates delivered straight to your inbox!</p>
          <form className="flex rounded-full overflow-hidden border-2 border-[#ffe066] bg-white/10">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 bg-transparent text-white placeholder:text-white/60 focus:outline-none" />
            <button type="submit" className="px-6 py-2 bg-[#ffe066] text-[#e63946] font-bold hover:bg-[#e63946] hover:text-white transition-all text-base rounded-none">Sign Up</button>
          </form>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/60 gap-2">
        <div>
          &copy; {new Date().getFullYear()} <span className="font-bold text-white">Travelink County</span>. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <a href="/" className="hover:text-[#ffe066]">Home</a>
          <a href="/cookies" className="hover:text-[#ffe066]">Cookies</a>
          <a href="/help" className="hover:text-[#ffe066]">Help</a>
          <a href="/faqs" className="hover:text-[#ffe066]">FAQs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  