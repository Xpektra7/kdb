import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar";
import About from "@/components/homepage/about";
import Footer from "@/components/footer";
import { TimelineDemo } from "@/components/homepage/timeline";
import WhyApollo from "@/components/homepage/why-apollo";
import CTA from "@/components/homepage/cta";


export default function HomePage() {
  return (
    <main className="relative flex h-auto flex-col items-center justify-center max-w-1080 mx-auto">
      <Navbar />
      <Hero />
      <About />
      <TimelineDemo />
      <WhyApollo />
      <CTA />
      <Footer />
    </main>
  );
}
