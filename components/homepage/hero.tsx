"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();
  return (
    <div className="relative flex h-screen max-h-[680px] flex-col w-full p-page">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black_70%)]" ></div>

      <h1 className="relative z-20 bg-linear-to-b mt-20 from-white via-neutral-200 to-neutral-400 bg-clip-text py-4 text-4xl font-medium text-transparent md:text-6xl tracking-tighter max-w-4xl leading-tight">
        Apollo is a mission-driven platform for building smarter projects.
      </h1>
      <p className="z-20 text-base max-w-2xl leading-relaxed">Next stop? The Moon—launch your ideas, track progress, and reach new heights.</p>
      <Link href="/app">
        <Button
          size="lg"
          variant="default"
          className="z-20 mt-8 w-fit"
        >
          Start Building
        </Button>
      </Link>
    </div>
  );
}
