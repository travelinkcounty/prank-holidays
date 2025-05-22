import { Plane, Mountain, Palmtree, Sun, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4 bg-[var(--background)]">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center gap-2 mb-4">
          <Plane className="w-8 h-8 text-[var(--primary-yellow)] rotate-12" />
          <Mountain className="w-8 h-8 text-[var(--primary-blue)]" />
          <Palmtree className="w-8 h-8 text-[var(--primary-green)]" />
          <Sun className="w-8 h-8 text-[var(--primary-orange)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-red)] mb-4" style={{ fontFamily: 'var(--font-main)' }}>
          Plan Your Next Adventure with Prank Holidays
        </h1>
        <p className="text-lg sm:text-xl text-[var(--foreground)] mb-8" style={{ fontFamily: 'var(--font-main)' }}>
          Unforgettable trips, best deals, and memories for a lifetime. Explore mountains, beaches, and cities with us!
        </p>
        <a
          href="#"
          className="inline-block bg-[var(--primary-yellow)] text-black font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[var(--primary-orange)] transition-colors text-lg"
          style={{ fontFamily: 'var(--font-main)' }}
        >
          Start Planning
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-16">
        <div className="flex flex-col items-center">
          <MapPin className="w-10 h-10 text-[var(--primary-blue)] mb-2" />
          <span className="font-semibold text-[var(--primary-blue)]" style={{ fontFamily: 'var(--font-main)' }}>100+ Destinations</span>
        </div>
        <div className="flex flex-col items-center">
          <Sun className="w-10 h-10 text-[var(--primary-orange)] mb-2" />
          <span className="font-semibold text-[var(--primary-orange)]" style={{ fontFamily: 'var(--font-main)' }}>All Seasons</span>
        </div>
        <div className="flex flex-col items-center">
          <Plane className="w-10 h-10 text-[var(--primary-green)] mb-2" />
          <span className="font-semibold text-[var(--primary-green)]" style={{ fontFamily: 'var(--font-main)' }}>Best Deals</span>
        </div>
      </div>
    </div>
  );
}
