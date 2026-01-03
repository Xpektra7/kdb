import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar";
import GettingStarted from "@/components/homepage/getting-started";


export default function HomePage() {
  return (
    <main className="relative flex h-auto flex-col items-center justify-center max-w-[1440px] mx-auto">
      <Navbar />
      <Hero />
      <GettingStarted />
    </main>
  );
}