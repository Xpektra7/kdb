"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp } from "@hugeicons/core-free-icons";
import { getDataMode } from "@/lib/data-mode";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [projectDescription, setProjectDescription] = useState("");
    const [useDummyData, setUseDummyData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load data mode preference
    useEffect(() => {
        setUseDummyData(getDataMode());
    }, []);

    useEffect(() => {
        // Simulate fetching user data
        const fetchUserData = async () => {
            return new Promise<{ name: string; email: string }>((resolve) => {
                setTimeout(() => {
                    resolve({ name: "John Doe", email: "john.doe@example.com" });
                }, 1000);
            });
        };

        fetchUserData().then((fetchedUser) => {
            console.log("User data:", fetchedUser);
            setUser(fetchedUser);
        });
    }, []);

    async function      handleBuildClick(currentProjectDescription: string) {
        setIsLoading(true);
        setError(null);

        try {
            // Create project via the proper API - this generates decision matrix via AI
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: currentProjectDescription,
                    description: currentProjectDescription 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const { projectId } = await response.json();
            
            // Navigate to decision matrix with projectId
            router.push(`/app/decision-matrix?projectId=${projectId}`);
        } catch (err) {
            console.error("Error creating project:", err);
            setError(err instanceof Error ? err.message : "Failed to create project");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDummyBuildClick() {
        // For dummy mode, we still use the old temporary store approach
        // since we don't want to create actual database records
        setIsLoading(true);
        try {
            const airQuality = await import("@/schema/air-quality-result2.json");
            const response = await fetch("/api/decision-matrix-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project: "Air Quality Monitoring (Dummy)",
                    decisionMatrixOutput: airQuality.output,
                }),
            });
            
            if (response.ok) {
                const { requestId } = await response.json();
                router.push(`/app/decision-matrix?requestId=${requestId}`);
            } else {
                throw new Error("Failed to save dummy decision matrix");
            }
        } catch (err) {
            console.error("Error saving dummy DM:", err);
            setError(err instanceof Error ? err.message : "Failed to load dummy data");
        } finally {
            setIsLoading(false);
        }
    }

    // if (status === "loading") {
    //     return <div className="flex items-center justify-center h-screen">
    //         <p className="text-muted-foreground">Loading...</p>
    //     </div>;
    // }
    
    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-360 py-0 pb-12 mx-auto">
            <div className="flex flex-col w-full gap-8 justify-center items-center mt-32 max-w-2xl">
                <div className="flex flex-col w-full gap-3">
                    <p className="text-base">Welcome {session?.user?.name ? session.user.name.split(" ")[0] : "Guest"}!</p>
                    <h1 className="text-4xl font-semibold text-foreground leading-tight">What are we forging today?</h1>
                </div>
                {error && (
                    <div className="w-full p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                    </div>
                )}
                <div className="flex flex-col w-full bg-muted/50 cursor-pointer p-5 gap-3 h-auto rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
                    <textarea name="project" className="flex-1 px-3 py-2 outline-none text-sm h-24 text-wrap resize-none overflow-hidden bg-transparent text-foreground placeholder:text-muted-foreground" placeholder="Describe your project in detail..." onChange={(e) => setProjectDescription(e.target.value)} rows={3} maxLength={300} disabled={isLoading} />
                    <div className="h-px bg-border" />
                    <div className="flex w-full justify-between items-center px-2">
                        <p className={`text-sm font-medium ${projectDescription.length === 0 ? "text-muted-foreground" : (projectDescription.length < 8 ? "text-destructive" : "text-foreground")}`}>{projectDescription.length} / 300 </p>
                        <Button 
                            className={`aspect-square rounded-xl ${(projectDescription.length < 8 || isLoading) ? "bg-muted text-foreground" : ""}`} 
                            size="icon-sm" 
                            disabled={projectDescription.length < 8 || isLoading} 
                            title="Build" 
                            onClick={useDummyData ? handleDummyBuildClick : () => handleBuildClick(projectDescription)}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <HugeiconsIcon icon={ArrowUp} color="currentColor" className="h-full w-full " />
                            )}
                        </Button>
                    </div>
                </div>
                <small className="text-sm text-center -mt-4 text-muted-foreground">
                    {isLoading ? "Creating your project..." : "Try to be as specific as possible to get the best results."}
                </small>

            </div>

        </main>
    );
}