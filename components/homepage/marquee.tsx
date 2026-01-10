"use client";
import marquee from "@/public/hero.png"
import Image from "next/image";

export default function Marquee() {
  return (
    <div className="z-19">
      <Image
        src={marquee}
        alt="Marquee"
        width={1440}
        height={810}
        className="w-full absolute top-80 right-0 left-0 -z-20 h-auto object-cover pointer-events-none"
      />
    </div>
  );
}
