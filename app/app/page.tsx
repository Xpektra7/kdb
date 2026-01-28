"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp } from "@hugeicons/core-free-icons";
import airQuality from "@/schema/air-quality-result2.json";
import { getDataMode } from "@/lib/data-mode";
import Navbar from "@/components/navbar";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
    const router = useRouter();
    const { data: session,status } = useSession();

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [projectDescription, setProjectDescription] = useState("");
    const [useDummyData, setUseDummyData] = useState(false);

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

    function handleBuildClick(currentProjectDescription: string) {
        fetch("/api/generate/decision-matrix", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: currentProjectDescription }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }
                return response.json();
            })
            .then((data) => {
                try {
                    const parsedData = JSON.parse(data.output);
                    
                    // Save DM result to API and get requestId
                    return fetch("/api/decision-matrix-requests", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            project: currentProjectDescription,
                            decisionMatrixOutput: parsedData,
                        }),
                    }).then((res) => {
                        if (!res.ok) throw new Error("Failed to save decision matrix");
                        return res.json();
                    }).then(({ requestId }) => {
                        router.push(`/app/decision-matrix?requestId=${requestId}`);
                    });
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                }
            })
            .catch((err) => {
                console.error(err);
            });

        console.log("Build clicked with project description:", currentProjectDescription);
    }

    function handleDummyBuildClick() {
        setTimeout(async () => {
            try {
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
            }
        }, 1500);
    }

    // if (status === "loading") {
    //     return <div className="flex items-center justify-center h-screen">
    //         <p className="text-muted-foreground">Loading...</p>
    //     </div>;
    // }
    
    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-360 py-0 pb-12 mx-auto">
            <Navbar />
            <div className="flex flex-col w-full gap-8 justify-center items-center mt-32 max-w-2xl">
                <div className="flex flex-col w-full gap-3">
                    <p className="text-base">Welcome {session?.user?.name ? session.user.name.split(" ")[0] : "Guest"}!</p>
                    <h1 className="text-4xl font-semibold text-foreground leading-tight">What are we forging today?</h1>
                </div>
                <div className="flex flex-col w-full bg-muted/50 cursor-pointer p-5 gap-3 h-auto rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
                    <textarea name="project" className="flex-1 px-3 py-2 outline-none text-sm h-24 text-wrap resize-none overflow-hidden bg-transparent text-foreground placeholder:text-muted-foreground" placeholder="Describe your project in detail..." onChange={(e) => setProjectDescription(e.target.value)} rows={3} maxLength={300} />
                    <div className="h-px bg-border" />
                    <div className="flex w-full justify-between items-center px-2">
                        <p className={`text-sm font-medium ${projectDescription.length === 0 ? "text-muted-foreground" : (projectDescription.length < 8 ? "text-destructive" : "text-foreground")}`}>{projectDescription.length} / 300 </p>
                        <Button className={`aspect-square rounded-xl ${(projectDescription.length < 8) ? "bg-muted text-foreground" : ""}`} size="icon-sm" disabled={projectDescription.length < 8} title="Build" onClick={useDummyData ? handleDummyBuildClick : () => handleBuildClick(projectDescription)}>
                            <HugeiconsIcon icon={ArrowUp} color="currentColor" className="h-full w-full " />
                        </Button>
                    </div>
                </div>
                <small className="text-sm text-center -mt-4 text-muted-foreground">Try to be as specific as possible to get the best results.</small>

            </div>

        </main>
    );
}