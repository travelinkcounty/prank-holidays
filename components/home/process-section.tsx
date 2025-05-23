import React from "react";

const steps = [
  {
    title: "Choose Your Prank",
    description: "Select from a variety of hilarious holiday pranks.",
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Customize Details",
    description: "Personalize your prank for maximum fun.",
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Send & Enjoy",
    description: "We deliver the prank, you enjoy the reactions!",
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l1 2h13l1-2h2" />
      </svg>
    ),
  },
];

const ProcessSection = () => (
  <section className="py-16 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;