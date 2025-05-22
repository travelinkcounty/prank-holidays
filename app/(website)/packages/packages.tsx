import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const packages = [
  {
    name: "Goa Beach Escape",
    image: "/images/contact-banner.jpg",
    price: "₹19,999",
    description: "3 nights, 4 days stay at a luxury beach resort with all meals included.",
  },
  {
    name: "Himalayan Adventure",
    image: "/images/contact-banner.jpg",
    price: "₹24,999",
    description: "5 days trekking and camping in the Himalayas with expert guides.",
  },
  {
    name: "Royal Rajasthan",
    image: "/images/contact-banner.jpg",
    price: "₹21,499",
    description: "4 nights exploring palaces, forts, and vibrant markets of Rajasthan.",
  },
  {
    name: "Kerala Backwaters",
    image: "/images/contact-banner.jpg",
    price: "₹22,999",
    description: "3 nights on a houseboat with authentic Kerala cuisine and sightseeing.",
  },
];

const PackagesPage = () => {
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
          {packages.map((pkg) => (
            <Card key={pkg.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
              <div className="relative w-full h-48">
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e30613] flex flex-col gap-1">
                  {pkg.name}
                  <span className="text-lg font-extrabold text-[#1a4d8f]">{pkg.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a4d8f] font-medium">{pkg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;    