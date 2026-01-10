import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar";
import GettingStarted from "@/components/homepage/getting-started";
import { BlockDiagram } from "@/components/block-diagram/block-diagram";
import Marquee from "@/components/homepage/marquee";


export default function HomePage() {

  const data =[
    { block: "Sensing", to: "Control" },
    { block: "Control", from: "Sensing", to: "Actuation, Communication" },
    { block: "Actuation", from: "Control" , to: "Power" },
    { block: "Communication", from: "Control", to: "Power" },
    { block: "Power", from: "Communication" },
    { block: "Verilog", from: "Communication" },
  ]
  return (
    <main className="relative flex h-auto flex-col items-center justify-center max-w-[1440px] mx-auto">
      <Navbar />
      <Hero />
      <GettingStarted />
      <Marquee />
    </main>
  );
}