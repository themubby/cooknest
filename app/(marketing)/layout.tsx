import React from 'react';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Top Header */}
      <Navbar />
      
      {/* 2. Main content container wraps homepage blocks */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* 3. Bottom Footer */}
      <Footer />
    </div>
  );
}