"use client";
import marquee from "./../../public/ales-nesetril-Im7lZjxeLhg-unsplash.jpg"
import Image from "next/image";

export default function Marquee() {
  return (
    <div className="mx-auto z-19 mt-8 lg:-mt-8  w-full">
      <Image
        src={marquee}
        alt="Marquee"
        width={1080}
        className="w-full h-auto"
      />
    </div>
  );
}
