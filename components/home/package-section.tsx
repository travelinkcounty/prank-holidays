"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const packages = [
  {
    image: "/mock/goa.jpg",
    title: "Goa Beach Escape",
    price: "₹12,999",
    days: "6D/4N",
  },
  {
    image: "/mock/manali.jpg",
    title: "Manali Adventure",
    price: "₹9,499",
    days: "4D/3N",
  },
  {
    image: "/mock/jaipur.jpg",
    title: "Jaipur Heritage",
    price: "₹7,999",
    days: "3D/2N",
  },
  {
    image: "/mock/kerala.jpg",
    title: "Kerala Backwaters",
    price: "₹14,499",
    days: "5D/4N",
  },
];

const PackageSection = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-[#f1faee]/80 via-[#ffe066]/30 to-[#457b9d]/10 flex flex-col items-center justify-center overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-extrabold text-[#e63946] mb-12 text-center" style={{ fontFamily: 'var(--font-main)' }}
      >
        Featured <span className="text-[#457b9d]">Packages</span>
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/90 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer flex flex-col h-full">
              <div className="relative w-full h-40 rounded-t-2xl overflow-hidden">
                <Image src={pkg.image} alt={pkg.title} fill className="object-cover w-full h-full" />
                <span className="absolute top-2 right-2 bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded-full shadow">{pkg.days}</span>
              </div>
              <CardContent className="flex-1 flex flex-col items-center py-6 px-4">
                <h3 className="text-lg font-bold text-[#e63946] mb-2 text-center" style={{ fontFamily: 'var(--font-main)' }}>{pkg.title}</h3>
                <div className="text-xl font-extrabold text-[#457b9d] mb-2">{pkg.price}</div>
              </CardContent>
              <CardFooter className="flex justify-center pb-6">
                <Button className="bg-[#ffe066] text-[#e63946] font-bold px-6 py-2 rounded-full shadow hover:bg-[#e63946] hover:text-white transition-all cursor-pointer text-base">
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PackageSection;