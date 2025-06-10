"use client";

import { Plane, Mountain, Palmtree, Sun } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] py-16 px-4 overflow-hidden bg-black">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/hero1.mp4"
        autoPlay
        loop
        muted
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#457b9d]/40 to-black/60 z-10" />
      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-2xl text-center flex flex-col items-center">
        <div className="flex justify-center gap-2 mb-4 animate-fade-in">
          <Plane className="w-10 h-10 text-[var(--primary-yellow)] rotate-12 animate-bounce-slow" />
          <Mountain className="w-10 h-10 text-[var(--primary-blue)] animate-pulse" />
          <Palmtree className="w-10 h-10 text-[var(--primary-green)] animate-wiggle" />
          <Sun className="w-10 h-10 text-[var(--primary-orange)] animate-spin-slow" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-yellow)] drop-shadow-lg mb-4 animate-fade-in-up" style={{ fontFamily: 'var(--font-main)' }}>
          Plan Your Next Adventure with <span className="text-[var(--primary-red)]">Travelink County</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 animate-fade-in-up delay-100" style={{ fontFamily: 'var(--font-main)' }}>
          Unforgettable trips, best deals, and memories for a lifetime.
        </p>
        <a
          href="/packages"
          className="inline-block bg-[var(--primary-yellow)] text-black font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[var(--primary-orange)] transition-colors text-lg animate-fade-in-up delay-200"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          Start Planning
        </a>
      </div>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle { animation: wiggle 2.5s infinite; }
        .animate-bounce-slow { animation: bounce 2.2s infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-fade-in { animation: fadeIn 1s both; }
        .animate-fade-in-up { animation: fadeInUp 1.1s both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
