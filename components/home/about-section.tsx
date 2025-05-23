"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Globe, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Smile className="w-8 h-8 text-[#e63946]" />,
    title: "Personalized Experience",
    desc: "Every trip is tailored to your dreams and comfort.",
  },
  {
    icon: <Globe className="w-8 h-8 text-[#457b9d]" />,
    title: "Global Destinations",
    desc: "From beaches to mountains, we cover 100+ places.",
  },
  {
    icon: <Star className="w-8 h-8 text-[#ffe066]" />,
    title: "Top Rated Service",
    desc: "Thousands of happy travelers and 5-star reviews.",
  },
];

const AboutSection = () => {
  return (
    <section className="relative py-20 px-4 bg-white/80 flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#e63946] mb-4" style={{ fontFamily: 'var(--font-main)' }}>
          About <span className="text-[#457b9d]">Prank Holidays</span>
        </h2>
        <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'var(--font-main)' }}>
          We are passionate travel experts, curating unforgettable journeys for every explorer. Our mission is to make your holidays fun, easy, and truly memorable—whether you crave adventure, relaxation, or a bit of both!
        </p>
        <span className="inline-block bg-[#ffe066] text-[#e63946] font-semibold px-4 py-1 rounded-full shadow-sm animate-pulse">
          Why Choose Us?
        </span>
      </motion.div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-4xl">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3"
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/90 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer">
              <CardContent className="flex flex-col items-center py-8 px-4">
                <div className="mb-3">{f.icon}</div>
                <h3 className="text-xl font-bold text-[#e63946] mb-2" style={{ fontFamily: 'var(--font-main)' }}>{f.title}</h3>
                <p className="text-gray-600 text-center text-base">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;