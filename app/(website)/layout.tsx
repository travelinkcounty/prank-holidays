"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/(website)/Header";
import Footer from "@/components/(website)/Footer";
import FloatingButtons from "@/components/(website)/floatingButtons";
import Popup from "@/components/(website)/popup";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [popupOpen, setPopupOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPopupOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Popup open={popupOpen} onOpenChange={setPopupOpen} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
