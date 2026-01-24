"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp, Alert01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";
import airQuality from "@/schema/air-quality-result2.json";
import { getDataMode } from "@/lib/data-mode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navbar from "@/components/navbar";

export default function Page() {
    const router = useRouter();

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [projectDescription, setProjectDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ title?: string; message?: string } | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
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
        setLoading(true);
        setError({});

        const controller = new AbortController();
        setAbortController(controller);

        fetch("/api/generate/decision-matrix", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: currentProjectDescription }),
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    setError({ title: "API Error", message: `${response.status} - ${errorText}` });
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
                        setError({});
                        router.push(`/app/decision-matrix?requestId=${requestId}`);
                    });
                } catch (parseError) {
                    setError({ 
                        title: "Parse Error", 
                        message: "Failed to parse response. Please try again." 
                    });
                    console.error("JSON Parse Error:", parseError);
                }
            })
            .catch((err) => {
                if (err.name === "AbortError") {
                    console.log("Request aborted");
                    return;
                }
                console.error(err);
                setError({ title: "Request Failed", message: err?.message || "Unknown error" });
            })
            .finally(() => {
                setLoading(false);
                setAbortController(null);
            });

        console.log("Build clicked with project description:", currentProjectDescription);
    }

    function handleDummyBuildClick() {
        setLoading(true);
        setError({});

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
                    setLoading(false);
                    router.push(`/app/decision-matrix?requestId=${requestId}`);
                } else {
                    throw new Error("Failed to save dummy decision matrix");
                }
            } catch (err) {
                console.error("Error saving dummy DM:", err);
                setLoading(false);
                setError({ title: "Error", message: "Failed to load decision matrix" });
            }
        }, 1500);
    }

    function handleCancel() {
        if (abortController) {
            abortController.abort();
        }
    }

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-360 py-0 pb-12 mx-auto">
            <Navbar />
            <div className="flex flex-col w-full gap-8 justify-center items-center mt-32 max-w-2xl">
                <div className="flex flex-col w-full gap-3">
                    <p className="text-base">Welcome {user ? user.name.split(" ")[0] : "Guest"}!</p>
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
                {loading && (
                    <div className="flex items-center justify-between p-5 border border-border rounded-lg w-full bg-muted/30">
                        <div className="flex items-center gap-3">
                            <Spinner />
                            <p className="text-sm text-foreground font-medium">Generating decision matrix...</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-destructive gap-2 h-8 px-3 hover:bg-destructive/10">
                            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                            Cancel
                        </Button>
                    </div>
                )}
                {error && (
                    <Alert variant="destructive" className="flex items-baseline justify-center py-4 w-full">
                        <HugeiconsIcon icon={Alert01Icon} className="" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}

            </div>

        </main>
    );
}