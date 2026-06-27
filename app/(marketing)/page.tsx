// app/(marketing)/page.tsx
import Hero from "@/components/marketing/hero";
import Categories from "@/components/marketing/category";

export default function HomePage() {
  return (
    <>
      {/* Block 1: Main Dynamic Showcase */}
      <Hero />
      
      {/* Block 2: Interactive Group Filters */}
      <Categories />
    </>
  );
}
