"use client";

import React from "react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
    <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d8f] to-[#e30613] opacity-90" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
          Our <span className="text-[#ffc72c]">Privacy Policy</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
          Learn about how we collect, use, and protect your personal information when you use our website.
        </p>
      </div>
    </div>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#e30613] mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 text-lg">
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Introduction</h2>
          <p>
            We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Information We Collect</h2>
          <p>
            We may collect information such as your name, email address, phone number, and other details you provide when using our services or contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, communicate with you, and ensure a secure experience on our platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@travelinkcounty.com" className="text-[#e30613] underline">info@travelinkcounty.com</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
