"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getDataMode, setDataMode } from "@/lib/data-mode";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Navbar() {
    const [useDummyData, setUseDummyData] = useState(false);

    const { data: session, status } = useSession();

    // Load preference from localStorage on mount
    useEffect(() => {
        setUseDummyData(getDataMode());
    }, []);

    // Toggle and save preference
    const toggleDataMode = () => {
        const newValue = !useDummyData;
        setUseDummyData(newValue);
        setDataMode(newValue);

        // Notify user
        const message = newValue ? "Using Dummy Data" : "Using API Data";
        console.log(message);
    };

    return (
        <div className="flex justify-between items-center w-full p-page border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-0 cursor-pointer">
                <Image src="/logo-text.svg" alt="Apollo Logo" width={70} height={70} />
            </Link>
            {status === "loading" ? (
                <p>...</p>
            ) : session?.user?.name ? (
                <div className="flex items-center gap-3">{session.user.name}</div>
            ) : (
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDataMode}
                        className="flex items-center gap-2"
                    >
                        <Badge variant={useDummyData ? "secondary" : "default"}>
                            {useDummyData ? "Dummy" : "API"}
                        </Badge>
                        <span className="text-xs">Data Mode</span>
                    </Button>
                    <Link href="/auth/login" >
                        <Button variant="default" size="lg" className="py-2 h-fit">Sign in</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}