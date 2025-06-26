import React from "react";
import Image from "next/image";
import { Globe, CheckCircle } from "lucide-react";
import { Hotel, UserCheck, Cog, Plane, FileText, Car } from "lucide-react";
import PackageSection from "@/components/home/package-section";

const features = [
  "First Class Flights",
  "5 Star Accommodations",
  "150 Premium City Tours",
  "Handpicked Hotels",
  "Latest Model Vehicles",
  "24/7 Service",
];

const services = [
  {
    icon: <Globe className="w-9 h-9 text-[#ffe066]" />,
    title: "International Tours",
    desc: "Expertly planned tours to iconic landmarks and hidden gems worldwide. Your journey will be as memorable as the destination.",
  },
  {
    icon: <Hotel className="w-9 h-9 text-[#e63946]" />,
    title: "Hotel Reservation",
    desc: "Simple, quick, and tailored hotel bookings. Enjoy the comfort of a great stay and the convenience of easy booking.",
  },
  {
    icon: <UserCheck className="w-9 h-9 text-[#457b9d]" />,
    title: "Membership",
    desc: "Become a member for exclusive discounts, priority booking, and special perks on every trip. Travel smarter and enjoy luxury.",
  },
  {
    icon: <Cog className="w-9 h-9 text-[#ffe066]" />,
    title: "Event Management",
    desc: "Tailored events, seamless execution, and unforgettable moments for every occasion.",
  },
  {
    icon: <Globe className="w-9 h-9 text-[#e63946]" />,
    title: "Domestic Tours",
    desc: "Stress-free weekend getaways or extended road trips, packed with unforgettable experiences.",
  },
  {
    icon: <Plane className="w-9 h-9 text-[#457b9d]" />,
    title: "Transportation",
    desc: "Find the best deals, flexible schedules, and seamless travel arrangements for any destination.",
  },
  {
    icon: <FileText className="w-9 h-9 text-[#ffe066]" />,
    title: "Visa, Passport Applications",
    desc: "Guidance through every step of visa and passport applications, ensuring fast processing and worry-free travel.",
  },
  {
    icon: <Car className="w-9 h-9 text-[#e63946]" />,
    title: "Car Rentals",
    desc: "Latest model vehicles, handpicked for comfort and safety, available 24/7 for your convenience.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            About <span className="text-[#ffe066]">Travelink County</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Your trusted travel partner for unforgettable journeys across India and beyond.
          </p>
        </div>
      </div>

      {/* About Section Hero (new, as per screenshot) */}
      <section className="w-full max-w-7xl mx-auto bg-[#f6f7fa] py-10 flex flex-col md:flex-row items-center justify-center gap-10 px-4">
        {/* Left: Image */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-lg h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/images/contact-banner.jpg"
              alt="About Travelink County"
              width={520}
              height={320}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-[#e63946] leading-tight" style={{ fontFamily: 'var(--font-main)' }}>
            Welcome to <span className="text-[#457b9d]">Travelink County</span>
          </h1>
          <p className="text-base text-[#222] mb-4">
            Travelink County offers cost effective hotels, transport, and event management services to all destinations. We can give you full support to book your Holidays plan with the nominal service charge.
          </p>
          <p className="text-base text-[#222] mb-4">
            Corporate Travels are proven business tools for motivating teams and individuals towards a desired behaviour. Time tested to drive sales, enhance employee engagement, boost morale and promote corporate loyalty.
          </p>
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-base text-[#e63946] font-medium">
                <CheckCircle className="w-4 h-4 text-[#ffe066]" />
                <span className="text-[#222]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
      <PackageSection />

      {/* CTA Section (wide, on-theme) */}
      <section className="w-full max-w-7xl mx-auto my-16 px-4">
        <div className="rounded-2xl flex flex-col md:flex-row items-stretch overflow-hidden shadow-lg">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center p-12">
            <span className="uppercase text-2xl font-bold text-[#ffe066] mb-2 tracking-wider ">Quick Booking</span>
            <h2 className="text-4xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-main)' }}>
              Plan Your Trip Instantly
            </h2>
            <p className="text-lg mb-6">
              Book your next adventure with Travelink County in just a few clicks.
            </p>
          </div>
          {/* Right: Booking Form */}
          <form className="flex-1 flex flex-col justify-center gap-3 p-12">
            <input type="text" placeholder="Your Name" className="px-4 py-3 rounded border border-[#e63946]  focus:outline-none" />
            <input type="email" placeholder="Your Email" className="px-4 py-3 rounded border border-[#e63946]  focus:outline-none" />
            <input type="text" placeholder="Destination" className="px-4 py-3 rounded border border-[#e63946]  focus:outline-none" />
            <button
              type="submit"
              className="w-full bg-[#ffe066] text-[#e63946] font-bold px-6 py-3 rounded-lg shadow hover:bg-[#e63946] hover:text-white transition-colors text-base mt-2"
              style={{ fontFamily: 'var(--font-main)' }}
            >
              Book Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const ServicesSection = () => (
  <section className="w-full max-w-7xl mx-auto px-4 py-20">
    <h2 className="text-5xl font-extrabold text-center mb-14 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
      Our Services
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {services.map((service, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start hover:shadow-2xl transition group border-2 border-[#ffe066]/40"
        >
          <div className="mb-4">{service.icon}</div>
          <h3 className="text-xl font-bold mb-2 text-[#457b9d]" style={{ fontFamily: 'var(--font-main)' }}>
            {service.title}
          </h3>
          <p className="text-gray-700 text-base">{service.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default About;