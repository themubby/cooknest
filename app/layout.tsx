// app/layout.tsx
import React from 'react';
import "@/app/globals.css"; // Your Tailwind input stylesheet
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning prevents Next.js from throwing errors about server/client attribute mismatches
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}