import React from "react";
import { Gift, BadgeCheck, Users, Heart, Calendar } from "lucide-react";

const services = [
  {
    icon: <BadgeCheck className="w-10 h-10 text-[#ffe066] mb-2" />,
    title: "Memberships",
    color: "text-[#e3b800]",
    desc: "Exclusive memberships with special benefits and rewards.",
  },
  {
    icon: <Users className="w-10 h-10 text-[#1a4d8f] mb-2" />,
    title: "Packages",
    color: "text-[#1a4d8f]",
    desc: "Handpicked travel packages for unforgettable experiences.",
  },
  {
    icon: <Heart className="w-10 h-10 text-[#e30613] mb-2" />,
    title: "Weddings",
    color: "text-[#e30613]",
    desc: "Dream destination weddings, planned to perfection.",
  },
  {
    icon: <Calendar className="w-10 h-10 text-[#1a4d8f] mb-2" />,
    title: "Events",
    color: "text-[#1a4d8f]",
    desc: "Corporate, social, and private events with a personal touch.",
  },
];

const ServiceSection = () => (
  <section className="py-12 bg-white" style={{ fontFamily: 'var(--font-main)' }}>
    <div className="container mx-auto px-4">
      <div className="text-5xl font-extrabold text-center mb-10 text-[#e63946]">
        Our <span className="text-[#ffe066]">Services</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-white border border-[#ffe066] rounded-2xl shadow p-8 flex flex-col items-start text-left hover:shadow-lg transition-all duration-300 min-h-[270px]"
          >
            {service.icon}
            <h3 className="text-lg font-bold mb-2 mt-2 text-[#1a4d8f]">{service.title}</h3>
            <p className="text-gray-600 font-normal leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceSection;