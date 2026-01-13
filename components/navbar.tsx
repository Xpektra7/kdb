"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getDataMode, setDataMode } from "@/lib/data-mode";

export default function Navbar() {
    const [useDummyData, setUseDummyData] = useState(false);

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
            <div className="flex items-center gap-0 cursor-pointer">
                <Image src="/vercel.svg" alt="Apollo Logo" width={20} height={20} />
                <h1 className="text-2xl font-bold text-foreground">pollo</h1>
            </div>
            <div className="flex items-center gap-3">
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
                <Button variant="default" size="lg" className="py-0">Sign in</Button>
            </div>
        </div>
    );
}
