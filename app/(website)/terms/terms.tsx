"use client";

import React from "react";

const Terms = () => (
  <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
        <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d8f] to-[#e30613] opacity-90" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
          Our <span className="text-[#ffc72c]">Terms & Conditions</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
          Read our Terms & Conditions to understand how you can use our website and services.
        </p>
      </div>
    </div>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#e30613] mb-6">Terms & Conditions</h1>
      <div className="space-y-6 text-gray-700 text-lg">
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Introduction</h2>
          <p>
            Please read these Terms & Conditions carefully before using our website. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Use of Service</h2>
          <p>
            You agree to use our website and services only for lawful purposes and in accordance with these terms.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Intellectual Property</h2>
          <p>
            All content, trademarks, and data on this website are the property of Travelink County or its licensors and are protected by applicable laws.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Limitation of Liability</h2>
          <p>
            We are not liable for any damages arising from your use of our website or services, to the maximum extent permitted by law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#1a4d8f] mb-2">Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:info@travelinkcounty.com" className="text-[#e30613] underline">info@travelinkcounty.com</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
