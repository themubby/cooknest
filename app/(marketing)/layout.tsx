import React from 'react';
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import { auth } from "@/auth";
import { getChefProfile } from "@/lib/profile";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the session (will be null if they are a logged-out guest)
  const session = await auth();

  // 2. Signed-in users get a user object; guests get null so the navbar shows "Sign In"
  // Read the latest name/photo saved on the Profile page (the session only has sign-in-time values)
  const profile = session?.user
    ? await getChefProfile(session.user.email, session.user)
    : null;

  const safeUser = session?.user && profile
    ? {
        name: profile.name,
        email: session.user.email || '',
        image: profile.image,
      }
    : null;

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