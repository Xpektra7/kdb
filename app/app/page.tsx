"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUp, Alert01Icon } from '@hugeicons/core-free-icons';
import DecisionMatrix from "@/components/decision-matrix/decision-matrix";
import { Spinner } from "@/components/ui/spinner";
type User = {
    name: string;
    email: string;
};
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import airQualityData from "@/schema/air-quality-result2.json";

export default function Page() {

    const [user, setUser] = useState<User | null>(null);
    const [projectDescription, setProjectDescription] = useState<string>(" ");
    const [loading, setLoading] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<any>("r");
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // Simulate fetching user data
        const fetchUserData = async (): Promise<User> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ name: "John Doe", email: "john.doe@example.com" });
                }, 1000);
            });
        };

        fetchUserData().then((user) => {
            console.log("User data:", user);
            setUser(user);
        });
    }, []);


    function handleBuildClick(projectDescription: string) {
        setResponseData(" ");
        setLoading(true);
        setError(null);

        fetch("/api/generate/decision-matrix", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: projectDescription }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    setError({ title: `API Error`, message: `${response.status} - ${errorText}` });
                    throw new Error(`API Error: ${response.status} - ${errorText}`);
                }
                return response.json();
            })
            .then((data) => {
                const parsedData = JSON.parse(data.output);
                setResponseData(parsedData);
                setError(null);
                console.log("Response from API:", parsedData);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false); // <-- stops spinner after success or error
            });

        console.log("Build clicked with project description:", projectDescription);
    }

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center justify-center max-w-[1440px] py-0 pb-12 mx-auto">
            <div className="flex justify-between items-center w-full border-b border-border p-4">
                <div className="flex items-center gap-0">
                    <Image src="/vercel.svg" alt="Apollo Logo" width={20} height={20} />
                    <h1 className="text-2xl font-bold text-foreground">pollo</h1>
                </div>
                {user && (
                    <div className="flex w-8 items-center justify-center aspect-square rounded-full bg-muted p-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}

            </div>
            <div className="flex flex-col w-full gap-8 justify-center items-center mt-32 max-w-2xl">
                <div className="flex flex-col w-full">
                    <p>Welcome {user?.name.split(" ")[0]}!</p>
                    <h1 className="text-4xl font-semibold text-foreground">What are we forging today?</h1>
                </div>
                <div className="flex w-full bg-muted/70 cursor-pointer p-2 h-auto rounded-xl ">
                    <input type="text" name="project" className="flex-1 px-2 outline-none text-sm" placeholder="Describe your project..." onChange={(e) => setProjectDescription(e.target.value)} />
                    <Button className={`ml-4 aspect-square  rounded-xl hover:bg-white ${projectDescription.length === 0 ? "bg-transparent text-foreground" : ""}`} size="icon-sm" disabled={projectDescription.length === 0} title="Build" onClick={() => handleBuildClick(projectDescription)}>
                        <HugeiconsIcon icon={ArrowUp} color="currentColor" className="h-full w-full " />
                    </Button>
                </div>
                {responseData != null ? (
                    <div className="w-full h-auto flex flex-col gap-4">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-foreground">Decision Matrix</h2>
                            <p className="max-w-2xl text-muted-foreground">
                                Analyze and compare different options based on multiple criteria to make informed decisions.
                            </p>
                        </div>


                        {loading ? (
                            <div className="flex items-center gap-2 justify-center p-8 border border-border rounded-lg h-64">
                                <Spinner />
                                <p>Generating decision matrix...</p>
                            </div>
                        ) :
                            error ? (
                                <Alert variant="destructive" className="flex items-baseline justify-center py-16">
                                    <HugeiconsIcon icon={Alert01Icon} className="" />
                                    <AlertTitle>{error.title}</AlertTitle>

                                    <AlertDescription>
                                        {error.message}
                                    </AlertDescription>
                                </Alert>
                            ) : <DecisionMatrix output={airQualityData.output} />
                        }
                    </div>
                ) : null}

            </div>

        </main>
    );
}