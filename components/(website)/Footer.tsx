"use client";

import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const galleryImages = [
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  "/gallery4.jpg",
  "/gallery5.jpg",
  "/gallery6.jpg",
];

const Footer = () => {
  return (
    <footer className="bg-[#181929] text-white pt-12 pb-4 mt-8" style={{ fontFamily: 'var(--font-main)' }}>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e30613]">Company</h3>
          <ul className="space-y-2 text-white/90">
            <li><a href="/about" className="flex items-center gap-2 hover:text-[#ffc72c] transition"><span className="text-[#e30613]">&#8250;</span> About Us</a></li>
            <li><a href="/contact" className="flex items-center gap-2 hover:text-[#ffc72c] transition"><span className="text-[#e30613]">&#8250;</span> Contact Us</a></li>
            <li><a href="/privacy" className="flex items-center gap-2 hover:text-[#ffc72c] transition"><span className="text-[#e30613]">&#8250;</span> Privacy Policy</a></li>
            <li><a href="/terms" className="flex items-center gap-2 hover:text-[#ffc72c] transition"><span className="text-[#e30613]">&#8250;</span> Terms & Condition</a></li>
            <li><a href="/faqs" className="flex items-center gap-2 hover:text-[#ffc72c] transition"><span className="text-[#e30613]">&#8250;</span> FAQs & Help</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e30613]">Contact</h3>
          <ul className="space-y-2 text-white/90">
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#e30613]" /> 123, Main Street, New Delhi, India</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#e30613]" /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#e30613]" /> info@prankholidays.com</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e30613] transition"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e30613] transition"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e30613] transition"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e30613] transition"><Youtube className="w-5 h-5" /></a>
            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-[#e30613] transition"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
        {/* Gallery */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e30613]">Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.map((img, i) => (
              <div key={i} className="w-20 h-14 bg-white/10 rounded overflow-hidden flex items-center justify-center border-2 border-[#1a4d8f]">
                <img src={img} alt={`Gallery ${i+1}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-extrabold mb-4 text-[#e30613]">Newsletter</h3>
          <p className="mb-4 text-white/80">Subscribe to our newsletter for exclusive travel deals, tips, and updates delivered straight to your inbox!</p>
          <form className="flex">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-l bg-white text-black focus:outline-none" />
            <button type="submit" className="px-5 py-2 bg-[#e30613] text-white font-bold rounded-r hover:bg-[#ffc72c] hover:text-[#e30613] transition">SignUp</button>
          </form>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-white/60 gap-2">
        <div>
          &copy; {new Date().getFullYear()} <span className="font-bold text-white">Prank Holidays</span>. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <a href="/" className="hover:text-[#ffc72c]">Home</a>
          <a href="/cookies" className="hover:text-[#ffc72c]">Cookies</a>
          <a href="/help" className="hover:text-[#ffc72c]">Help</a>
          <a href="/faqs" className="hover:text-[#ffc72c]">FAQs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  