'use client'

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchHotels, selectHotels, selectLoading } from "@/lib/redux/features/hotelSlice";
import { fetchLocations, selectLocations } from "@/lib/redux/features/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";
import ServiceSection from "@/components/home/service-section";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const PackagesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector(selectHotels);
  const isLoading = useSelector(selectLoading);
  const locations = useSelector(selectLocations);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const getLocationName = (locationId: string) => {
    const loc = locations.find((l) => l.uid == locationId);
    return loc ? loc.name : locationId;
  }

  
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

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/package-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[#ffc72c]">Hotels</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Discover our best-selling hotels. Handpicked experiences, great prices, and unforgettable memories await you!
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
          {hotels.map((hotel) => (
            <Card key={hotel.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
              <div className="relative w-full h-62">
                <ImageSlider images={Array.isArray(hotel.image) ? hotel.image.filter(Boolean) : hotel.image ? [hotel.image] : []} />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e30613] flex flex-col gap-1">
                  {hotel.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a4d8f] font-medium mb-2">{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-block bg-[#ffc72c] text-[#1a4d8f] px-2 py-1 rounded text-xs font-bold">{hotel.address}</span>
                </div>
                <div className="text-xs text-gray-500 font-semibold">Location {getLocationName(hotel.location)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <ServiceSection />
    </div>
  );
};

export default PackagesPage;    