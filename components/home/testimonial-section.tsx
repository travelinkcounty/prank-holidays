"use client";

import React from "react";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: "Mohan Singh",
    text: "They offer high-quality services at a fair price. Prank Holiday ensures a pleasant and stress-free travel experience. Customer Service is quite helpful, and the workforce is equally cooperative.",
    image: "/testimonials/1.jpeg",
  },
  {
    name: "Ridhima Tandon",
    text: "Travelink County provide excellent service when it comes to providing luxury travel accommodations. It is a highly recommended spot to stay. They provide high-quality services at a reasonable cost. They make sure to cater to your needs efficiently and without burning a hole in your pocket.",
    image: "/testimonials/11.jpeg",
  },
  {
    name: "Alok Verma",
    text: "Travelink County provides you luxury and  budget packages and deals. Service  is good, it has facilities of  game and  activities. Staff is very courteous and generous. It is a great place and I would recommend it. It is worthy. I would love to come back to this place.",
    image: "/testimonials/2.jpeg",
  },
  {
    name: "Sapna Kumari",
    text: "Travelink County is best option to go for if your planning your vacations anytime soon. I had an amazing experience. They provide quality services at reasonable price. Travelink County provides a very smooth and hassle-free travel experience. The Customer Care is so supportive and the team is also co-operative.",
    image: "/testimonials/12.jpeg",
  },
  {
    name: "Amit Sharma",
    text: "I had a great experience with Travelink County. The staff was friendly and helpful, and the facilities were clean and modern. I would definitely recommend this place to others.",
    image: "/testimonials/3.jpeg",
  },
  {
    name: "Priya Mehra",
    text: "The team at Prank Holiday made our family trip memorable. Everything was well organized and the support was excellent.",
    image: "/testimonials/13.jpeg",
  },
  {
    name: "Rahul Gupta",
    text: "Best travel experience ever! The packages were affordable and the service was top-notch. Highly recommended!",
    image: "/testimonials/5.jpeg",
  },
  {
    name: "Sneha Kapoor",
    text: "From booking to the actual trip, everything was smooth. The staff is very responsive and helpful.",
    image: "/testimonials/14.jpeg",
  },
  {
    name: "Vikas Yadav",
    text: "Amazing deals and great customer service. Will definitely book again with Prank Holiday!",
    image: "/testimonials/4.jpeg",
  },
];

const TestimonialSection = () => (
  <section className="relative py-20 bg-white overflow-hidden">
    {/* Subtle background accent */}
    <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ffe066]/30 rounded-full blur-3xl z-0" />
    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#e63946]/10 rounded-full blur-3xl z-0" />
    <div className="relative z-10 max-w-5xl mx-auto px-4">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
        What Our Customers Say
      </h2>
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12 w-full h-full items-stretch"
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx} className="h-full flex items-stretch">
            <div
              className="bg-white rounded-2xl border-2 border-[#ffe066] shadow-md hover:shadow-xl transition hover:scale-105 flex flex-col items-center text-center p-8 pt-12 group h-full min-h-[420px] flex-1 justify-between"
            >
              <Quote className="w-8 h-8 text-[#e63946] mb-3 bg-white rounded-full p-1 shadow" />
              <img
                src={t.image}
                alt={t.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#ffe066] shadow-lg group-hover:scale-105 transition"
              />
              <p className="text-gray-700 mb-4 text-lg font-medium flex-1" style={{ fontFamily: 'var(--font-main)' }}>
                "{t.text}"
              </p>
              <div className="font-bold text-[#e63946] text-base mt-auto" style={{ fontFamily: 'var(--font-main)' }}>- {t.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default TestimonialSection;