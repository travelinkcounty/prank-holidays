'use client'

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { fetchFeaturedLocations, selectLocations, selectLoading, selectError } from "@/lib/redux/features/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import PackageSection from "@/components/home/package-section";
import TestimonialSection from "@/components/home/testimonial-section";

const tabOptions = [
  { label: "Domestic", value: "domestic" },
  { label: "International", value: "international" },
];

const Locations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locations = useSelector(selectLocations);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchFeaturedLocations());
  }, [dispatch]);

  const [tab, setTab] = useState("domestic");
  const filteredLocations = locations.filter(loc => loc.type === tab);

  if (error) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Locations</h2>
        <p>Error loading locations. Please try again later.</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/location-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[#ffc72c]">Locations</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Explore our branches across India and the world. Each location offers unique experiences and top-notch service.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-[#f8fafc] rounded-full shadow border border-[#ffe066]/40 overflow-hidden">
          {isLoading && (
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}
          {tabOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTab(option.value)}
              className={`px-7 py-2 cursor-pointer font-bold text-base transition-colors duration-200 focus:outline-none ${tab === option.value ? "bg-[#ffe066] text-[#e30613]" : "text-[#1a4d8f] hover:bg-[#ffe066]/30"}`}
              style={{ fontFamily: 'var(--font-main)' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <div className="col-span-full text-center text-gray-400 py-12">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}
          {filteredLocations.map((loc) => (
            <Card key={loc.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
              <div className="relative w-full h-48">
                <Image src={loc.image} alt={loc.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e30613]">{loc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a4d8f] font-medium">{loc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <PackageSection />
      <TestimonialSection />
    </div>
  );
};

export default Locations;