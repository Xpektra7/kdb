import Hero from "@/components/homepage/hero";
import Marquee from "@/components/homepage/marquee";
import Navbar from "@/components/navbar";


export default function HomePage() {
  return (
    <main className="relative flex h-auto flex-col items-center justify-center max-w-[1440px] mx-auto">
      <Navbar />
      <Hero />
    </main>
  );
}