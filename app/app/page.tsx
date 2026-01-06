"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp, Alert01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";
import { useResultStore } from "@/components/providers/result-store";
type User = {
    name: string;
    email: string;
};
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page() {
    const router = useRouter();
    const { setResult } = useResultStore();

    const [user, setUser] = useState<User | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    useEffect(() => {
        // Simulate fetching user data
        const fetchUserData = async (): Promise<User> => {
            return new Promise((resolve) => {
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
        setResult(null);
        setLoading(true);
        setError(null);

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
                    setResult(parsedData);
                    setError(null);
                    router.push("/app/decision-matrix");
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

    function handleCancel() {
        if (abortController) {
            abortController.abort();
        }
    }

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-[1440px] py-0 pb-12 mx-auto">
            <div className="flex justify-between items-center w-full border-b border-border p-4">
                <div className="flex items-center gap-0">
                    <Image src="/vercel.svg" alt="Apollo Logo" width={20} height={20} />
                    <h1 className="text-2xl font-bold text-foreground">pollo</h1>
                </div>
                <div className="flex w-8 items-center justify-center aspect-square rounded-full bg-muted p-0">
                    {user ? user.name.charAt(0).toUpperCase() : "?"}
                </div>

            </div>
            <div className="flex flex-col w-full gap-8 justify-center items-center mt-32 max-w-2xl">
                <div className="flex flex-col w-full">
                    <p>Welcome {user ? user.name.split(" ")[0] : "Guest"}!</p>
                    <h1 className="text-4xl font-semibold text-foreground">What are we forging today?</h1>
                </div>
                <div className="flex flex-col w-full bg-muted/70 cursor-pointer p-4 gap-2 h-auto rounded-xl ">
                    <textarea name="project" className="flex-1 px-2 outline-none text-sm h-23 text-wrap resize-none overflow-hidden" placeholder="Describe your project..." onChange={(e) => setProjectDescription(e.target.value)} rows={3} maxLength={300} />
                    <hr />
                    <div className="flex w-full justify-between items-center px-2">
                        <p className={`text-sm ${projectDescription.length === 0 ? "text-muted-foreground" : (projectDescription.length < 8 ? "text-red-400" : "text-foreground")}`}>{projectDescription.length} / 300 </p>
                        <Button className={`aspect-square  rounded-xl hover:bg-white ${(projectDescription.length < 8) ? "bg-transparent text-foreground" : ""}`} size="icon-sm" disabled={projectDescription.length < 8} title="Build" onClick={() => handleBuildClick(projectDescription)}>
                            <HugeiconsIcon icon={ArrowUp} color="currentColor" className="h-full w-full " />
                        </Button>
                    </div>
                </div>
                <small className="text-sm text-center -mt-4">Try to be as specific as possible to get the best results.</small>
                {loading && (
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg w-full bg-muted/20">
                        <div className="flex items-center gap-3">
                            <Spinner />
                            <p className="text-sm text-muted-foreground">Generating decision matrix...</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-destructive gap-2 h-8 px-3">
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