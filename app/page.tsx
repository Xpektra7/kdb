import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar";
import GettingStarted from "@/components/homepage/getting-started";
import Marquee from "@/components/homepage/marquee";
import Footer from "@/components/footer";


export default function HomePage() {
  return (
    <main className="relative flex h-auto flex-col items-center justify-center max-w-1080 mx-auto">
      <Navbar />
      <Hero />
      <GettingStarted />
      <Marquee />
      <Footer />
    </main>
  );
}
