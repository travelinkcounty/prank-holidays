import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section";
import ProcessSection from "@/components/home/process-section";
import DestinationSection from "@/components/home/destination-section";
import PackageSection from "@/components/home/package-section";
import GallerySection from "@/components/home/gallery-section";
import TestimonialSection from "@/components/home/testimonial-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <DestinationSection />
      <PackageSection />
      <GallerySection />
      <TestimonialSection />
    </div>
  );  
}
