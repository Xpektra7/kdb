"use client";
import { Button } from "../ui/button";
import Marquee from "./marquee";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative flex h-screen flex-col w-full p-page">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black_70%)]" ></div>
      <h1 className="relative z-20 bg-gradient-to-b mt-16 from-white to-neutral-300 bg-clip-text py-4 text-4xl font-medium text-transparent md:text-6xl tracking-tighter max-w-4xl">
        Apollo is a mission-driven platform for building smarter projects.
      </h1>
      <p className="z-20">Next stop? The Moon—launch your ideas, track progress, and reach new heights.</p>
      <Button
        size="lg"
        variant="default"
        className="z-20 mt-6 w-fit "
        onClick={() => router.push('/app')}
      >
        Start Building
      </Button>
      {/* <Marquee /> */}
    </div>
  );
}
