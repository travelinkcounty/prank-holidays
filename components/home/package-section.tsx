"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchPackages, selectPackages } from "@/lib/redux/features/packageSlice";

const PackageSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const packages = useSelector(selectPackages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <section className="relative py-14 px-4 bg-gradient-to-br from-[#f1faee]/80 via-[#ffe066]/30 to-[#457b9d]/10 flex flex-col items-center justify-center overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-5xl font-extrabold text-[#e63946] mb-10 text-center"
        style={{ fontFamily: 'var(--font-main)' }}
      >
        Featured <span className="text-[#457b9d]">Packages</span>
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 w-full max-w-7xl">
        {packages.slice(0, 4).map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl shadow-lg border-0 bg-white/90 hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer flex flex-col h-full p-0">
              <div className="relative w-full h-40 rounded-t-2xl overflow-hidden" style={{marginTop: 0}}>
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover w-full h-full rounded-t-2xl" />
                <span className="absolute top-2 right-2 bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded-full shadow">{pkg.days} / {pkg.nights}</span>
              </div>
              <CardContent className="flex-1 flex flex-col items-center justify-between py-4 px-4 min-h-[170px]">
                <div>
                  <h3 className="text-lg font-bold text-[#e63946] mb-1 text-center" style={{ fontFamily: 'var(--font-main)' }}>{pkg.name}</h3>
                  <div className="text-base text-gray-500 mb-2 text-center">{pkg.description}</div>
                </div>
                <div className="text-xl font-extrabold text-[#457b9d] mb-1 mt-2">{pkg.price}</div>
              </CardContent>
              <CardFooter className="flex justify-center pb-4">
                <Button className="bg-[#ffe066] text-[#e63946] font-bold px-6 py-2 rounded-full shadow hover:bg-[#e63946] hover:text-white transition-all cursor-pointer text-base">
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <a
          href="#"
          className="inline-block bg-[#ffe066] text-[#e63946] font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#e63946] hover:text-white transition-colors text-lg"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          View All Packages
        </a>
      </div>
    </section>
  );
};

export default PackageSection;