import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const locations = [
  {
    name: "New Delhi",
    image: "/images/contact-banner.jpg",
    description: "The heart of India, rich in history and culture.",
  },
  {
    name: "Mumbai",
    image: "/images/contact-banner.jpg",
    description: "The city that never sleeps, home to Bollywood and beaches.",
  },
  {
    name: "Goa",
    image: "/images/contact-banner.jpg",
    description: "Famous for its stunning beaches and vibrant nightlife.",
  },
  {
    name: "Bangalore",
    image: "/images/contact-banner.jpg",
    description: "The Silicon Valley of India, known for its parks and cafes.",
  },
  {
    name: "Chennai",
    image: "/images/contact-banner.jpg",
    description: "The capital of Tamil Nadu, known for its temples and beaches.",
  },
  {
    name: "Hyderabad",
    image: "/images/contact-banner.jpg",
    description: "The city of pearls, known for its history and cuisine.",
  },
  {
    name: "Kolkata",
    image: "/images/contact-banner.jpg",
    description: "The city of joy, known for its culture and cuisine.",
  },
  {
    name: "Jaipur",
    image: "/images/contact-banner.jpg",
    description: "The pink city, known for its forts and palaces.",
  },
  {
    name: "Lucknow",
    image: "/images/contact-banner.jpg",
    description: "The city of Nawabs, known for its cuisine and culture.",
  },
  {
    name: "Ahmedabad",
    image: "/images/contact-banner.jpg",
    description: "The city of temples, known for its culture and cuisine.",
  },
  {
    name: "Surat",
    image: "/images/contact-banner.jpg",
    description: "The city of temples, known for its culture and cuisine.",
  },
];

const Locations = () => {
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
            Explore our branches across India. Each location offers unique experiences and top-notch service.
          </p>
        </div>
      </div>

      {/* Locations Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc) => (
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
    </div>
  );
};

export default Locations;