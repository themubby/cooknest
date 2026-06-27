// app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center">
      {/* This structural frame passes the login page content down cleanly */}
      {children}
    </div>
  );
}