'use client'

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { fetchPackages, selectPackages, selectLoading } from "@/lib/redux/features/packageSlice";
import { fetchFeaturedLocations, selectLocations } from "@/lib/redux/features/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import DestinationSection from "@/components/home/destination-section";
import ServiceSection from "@/components/home/service-section";

const PackagesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const packages = useSelector(selectPackages);
  const isLoading = useSelector(selectLoading);
  const locations = useSelector(selectLocations);

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchFeaturedLocations());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/package-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[#ffc72c]">Packages</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Discover our best-selling travel packages. Handpicked experiences, great prices, and unforgettable memories await you!
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}
          {packages.map((pkg) => (
            <Card key={pkg.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
              <div className="relative w-full h-48">
                <Image src={pkg.image || ""} alt={pkg.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e30613] flex flex-col gap-1">
                  {pkg.name}
                  <span className="text-lg font-extrabold text-[#1a4d8f]">{pkg.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a4d8f] font-medium mb-2">{pkg.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-block bg-[#ffc72c] text-[#1a4d8f] px-2 py-1 rounded text-xs font-bold">{pkg.days} Days</span>
                  <span className="inline-block bg-[#1a4d8f] text-white px-2 py-1 rounded text-xs font-bold">{pkg.nights} Nights</span>
                </div>
                <div className="text-xs text-gray-500 font-semibold">Location {locations.find((loc) => loc.id === pkg.locationId)?.name || "Unknown"}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <ServiceSection />
      <DestinationSection />
    </div>
  );
};

export default PackagesPage;    