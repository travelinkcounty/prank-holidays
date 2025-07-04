'use client'

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { fetchFeaturedSubLocations, selectSubLocations, selectSubLoading, selectSubError } from "@/lib/redux/features/subLocationSlice";
import { fetchLocationById, selectSelectedLocation } from "@/lib/redux/features/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import PackageSection from "@/components/home/package-section";
import TestimonialSection from "@/components/home/testimonial-section";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ImageSlider = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    drag: true,
    created: (s) => s.moveToIdx(0),
    slideChanged: (s) => setCurrent(s.track.details.rel),
  });
  // Autoplay effect
  useEffect(() => {
    if (!instanceRef.current) return;
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 2500);
    return () => clearInterval(interval);
  }, [instanceRef, images.length]);

  if (!images.length) return null;
  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Slide 1"
        className="w-full h-62 object-cover"
      />
    );
  }
  return (
    <div className="relative w-full h-62">
      <div ref={sliderRef} className="keen-slider w-full h-62 rounded-t-2xl">
        {images.map((src, i) => (
          <div className="keen-slider__slide" key={i}>
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-62 object-cover"
            />
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${current === i ? "bg-[#e63946] opacity-90" : "bg-[#e63946] opacity-40"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Locations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const subLocations = useSelector(selectSubLocations);
  const isLoading = useSelector(selectSubLoading);
  const error = useSelector(selectSubError);
  const location = useSelector(selectSelectedLocation);

  const { id } = useParams();
  const locationId = id as string;

  useEffect(() => {
    if (locationId) {
      dispatch(fetchLocationById(locationId));
    }
  }, [dispatch, locationId]);

  useEffect(() => {
    if (location && location.uid) {
      dispatch(fetchFeaturedSubLocations(location.uid));
    }
  }, [dispatch, location]);

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

      {/* Locations Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          ) : subLocations.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              <p>No locations found.</p>
            </div>
          ) : (
            subLocations.map((loc) => (
              <Link key={loc.id} href={`/locations/${loc.name}`} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
                <Card className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
                  <div className="relative w-full h-62">
                    <ImageSlider images={Array.isArray(loc.image) ? loc.image.filter(Boolean) : loc.image ? [loc.image] : []} />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#e30613]">{loc.name}</CardTitle>
                    <CardDescription>{loc.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#1a4d8f] font-medium">{loc.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
      <PackageSection />
      <TestimonialSection />
    </div>
  );
};

export default Locations;