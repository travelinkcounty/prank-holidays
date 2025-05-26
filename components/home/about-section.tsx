"use client";
import React from "react";
import { Smile, Globe, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: <Smile className="w-8 h-8 text-[#e63946] flex-shrink-0" />,
    title: "Personalized Experience",
    desc: "Every trip is tailored to your dreams and comfort.",
  },
  {
    icon: <Globe className="w-8 h-8 text-[#457b9d] flex-shrink-0" />,
    title: "Global Destinations",
    desc: "From beaches to mountains, we cover 100+ places.",
  },
  {
    icon: <Star className="w-8 h-8 text-[#ffe066] flex-shrink-0" />,
    title: "Top Rated Service",
    desc: "Thousands of happy travelers and 5-star reviews.",
  },
];

const AboutSection = () => {
  return (
    <section className="relative py-20 px-4 bg-white/80 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0"
        >
          <Image
            src="/about.jpg"
            alt="About Travelink County"
            className="rounded-3xl shadow-2xl object-cover w-full max-w-lg h-[420px] md:h-[500px] border-4 border-[#ffe066] bg-white"
            width={400}
            height={400}
          />
        </motion.div>
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex flex-col items-start"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#e63946] mb-4" style={{ fontFamily: 'var(--font-main)' }}>
            About <span className="text-[#457b9d]">Travelink County</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8" style={{ fontFamily: 'var(--font-main)' }}>
            We are passionate travel experts, curating unforgettable journeys for every explorer. Our mission is to make your holidays fun, easy, and truly memorable—whether you crave adventure, relaxation, or a bit of both!
          </p>
          {/* Features/Support Points as Badges */}
          <div className="flex flex-col gap-4 w-full">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                viewport={{ once: true }}
                className="flex items-center bg-white/90 border border-[#ffe066] rounded-xl shadow-sm px-4 py-3 max-h-20 hover:shadow-lg transition group"
                style={{ minHeight: '64px' }}
              >
                <div className="mr-4 flex items-center justify-center rounded-full bg-[#ffe066]/30 p-2 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#e63946] text-base sm:text-lg" style={{ fontFamily: 'var(--font-main)' }}>{f.title}</span>
                  <span className="text-gray-600 text-sm sm:text-base leading-tight">{f.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;