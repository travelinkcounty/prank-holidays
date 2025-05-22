import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const management = [
  {
    name: "Nikhil Chaudhary",
    image: "/images/contact-banner.jpg",
    designation: "Founder & CEO",
    bio: "Visionary leader with 15+ years in the travel industry, passionate about creating memorable journeys.",
  },
  {
    name: "Priya Sharma",
    image: "/images/contact-banner.jpg",
    designation: "COO",
    bio: "Expert in operations and customer experience, ensuring seamless travel for all clients.",
  },
  {
    name: "Amit Verma",
    image: "/images/contact-banner.jpg",
    designation: "Head of Sales",
    bio: "Dynamic sales strategist with a knack for building strong client relationships.",
  },
  {
    name: "Sneha Patel",
    image: "/images/contact-banner.jpg",
    designation: "Marketing Director",
    bio: "Creative marketer driving brand growth and digital presence across platforms.",
  },
];

const Management = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/management-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Meet Our <span className="text-[#ffc72c]">Management</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Our leadership team brings decades of experience and a passion for travel to deliver the best for you.
          </p>
        </div>
      </div>

      {/* Management Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {management.map((member) => (
            <Card key={member.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mt-6 rounded-full overflow-hidden border-4 border-[#ffc72c] shadow-md">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#e30613] mt-2">{member.name}</CardTitle>
                <div className="text-[#1a4d8f] font-semibold text-base mb-2">{member.designation}</div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 font-medium text-sm md:text-base">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Management;  