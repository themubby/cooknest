import React from 'react';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { auth } from "@/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the session (will be null if they are a logged-out guest)
  const session = await auth();

  // 2. Build a safe structure to satisfy your Navbar's strict type requirement
  const safeUser = session?.user 
    ? {
        name: session.user.name || 'CookNest Chef',
        email: session.user.email || '',
        image: session.user.image || undefined,
      }
    : {
        name: 'Guest',
        email: '',
        image: undefined,
      };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ⚡ FIXED: Pass the required user prop */}
      <Navbar user={safeUser} />
      
      {/* 2. Main content container wraps homepage blocks */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* 3. Bottom Footer */}
      <Footer />
    </div>
  );
}