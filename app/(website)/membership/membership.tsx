'use client'

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchPlans, selectPlans, selectLoading, selectError } from "@/lib/redux/features/planSlice";
import { fetchLocations, selectLocations, selectError as selectLocationError } from "@/lib/redux/features/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import DestinationSection from "@/components/home/destination-section";
import TestimonialSection from "@/components/home/testimonial-section";

const Membership = () => {
  const dispatch = useDispatch<AppDispatch>();
  const plans = useSelector(selectPlans);
  const isLoading = useSelector(selectLoading);
  const locations = useSelector(selectLocations);
  const error = useSelector(selectError);
  const locationError = useSelector(selectLocationError);

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchLocations());
  }, [dispatch]);

  if (error || locationError) {
    return (
      <div className="mx-auto p-0 flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Plans</h2>
        <p>Error loading plans. Please try again later.</p>
      </div>  
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Membership <span className="text-[#ffc72c]">Plans</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Unlock exclusive benefits and premium experiences with our membership plans. Choose the best for your travel style!
          </p>
        </div>
      </div>

      {/* Memberships Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <div className="col-span-full justify-center items-center text-center text-gray-400 py-12">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          )}
          {plans.map((plan) => {
            const location = locations.find(loc => loc.id === plan.location[0]);
            return (
              <Card key={plan.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
                <div className="relative w-full h-48">
                  <Image src={plan.image || ""} alt={plan.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#e30613] flex flex-col gap-1">
                    {plan.name}
                    <span className="text-lg font-extrabold text-[#1a4d8f]">{plan.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1a4d8f] font-medium mb-2">{plan.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-[#ffc72c] text-[#1a4d8f] px-2 py-1 rounded text-xs font-bold">{plan.days} Days</span>
                    <span className="inline-block bg-[#1a4d8f] text-white px-2 py-1 rounded text-xs font-bold">{plan.nights} Nights</span>
                  </div>
                  <div>
                    Location: {location ? location.name : "Unknown"}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <DestinationSection />
      <TestimonialSection />
    </div>
  );
};

export default Membership;