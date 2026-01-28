"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CTA() {
    const router = useRouter();

    return (
        <section className="relative w-full p-page py-20">
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-accent/5 to-background" />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
            
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent/10 border border-accent/20 mb-4">
                    <HugeiconsIcon icon={Rocket01Icon} className="w-8 h-8 text-accent" />
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                        Ready to build with clarity?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Stop guessing your way through projects. Start with decisions, architecture, and execution plans that actually work.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button 
                        size="lg" 
                        variant="default"
                        onClick={() => router.push('/app')}
                        className="group"
                    >
                        Start Your Project
                        <HugeiconsIcon 
                            icon={ArrowRight01Icon} 
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                        />
                    </Button>
                    
                    <Link href="/getting-started">
                        <Button 
                            size="lg" 
                            variant="link"
                            className="link-btn"
                        >
                            Learn More
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}