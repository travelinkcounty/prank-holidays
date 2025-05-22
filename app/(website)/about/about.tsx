import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            About <span className="text-[#ffc72c]">Prank Holidays</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Your trusted travel partner for unforgettable journeys across India and beyond.
          </p>
        </div>
      </div>

      {/* About Content */}
      <section className="container mx-auto px-4 pb-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#e30613] mb-4">Our Story</h2>
          <p className="text-neutral-800 text-lg mb-6">
            Founded in 2010, Prank Holidays has grown from a small team of passionate travelers into one of India's leading travel companies. Our mission is to make travel accessible, enjoyable, and truly memorable for everyone. With a focus on personalized service and unique experiences, we have helped thousands of clients explore the world with confidence.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#e30613] mb-4">Our Mission</h2>
          <p className="text-neutral-800 text-lg mb-6">
            To inspire and enable people to discover new destinations, cultures, and adventures, while providing exceptional value and care at every step of their journey.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#e30613] mb-4">Our Values</h2>
          <ul className="list-disc pl-6 text-neutral-800 text-lg space-y-2">
            <li>Customer-first approach</li>
            <li>Integrity and transparency</li>
            <li>Innovation in travel experiences</li>
            <li>Commitment to quality and safety</li>
            <li>Passion for exploration</li>
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md h-72 rounded-xl overflow-hidden shadow-lg border-4 border-[#ffc72c]">
            <Image src="/images/contact-banner.jpg" alt="Our Team" fill className="object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;