import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center w-full p-page border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
            <div className="flex items-center gap-0 cursor-pointer">
                <Image src="/vercel.svg" alt="Apollo Logo" width={20} height={20} />
                <h1 className="text-2xl font-bold text-foreground">pollo</h1>
            </div>
            <Button variant="default" size="lg" className="py-0">Sign in</Button>
        </div>
    );
}
