"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp, FolderOpen, Clock, ChevronRight, Delete01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { useSession } from "next-auth/react";
import ErrorComponent from "@/components/error/error-boundary";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  createdAt: string;
  stage: string;
}

export default function Page() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [projectDescription, setProjectDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Fetch existing projects on load
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            fetchProjects();
        } else {
            setIsLoadingProjects(false);
        }
    }, [status, session]);

    async function fetchProjects() {
        try {
            const response = await fetch("/api/projects");
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setIsLoadingProjects(false);
        }
    }

    async function handleBuildClick(currentProjectDescription: string) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: currentProjectDescription,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const { projectId } = await response.json();
            router.push(`/app/decision-matrix?projectId=${projectId}`);
        } catch (err) {
            console.error("Error creating project:", err);
            setError(err instanceof Error ? err.message : "Failed to create project");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteProject(projectId: number, e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }

        setDeletingId(projectId);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== projectId));
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to delete project");
            }
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Failed to delete project");
        } finally {
            setDeletingId(null);
        }
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    return (
        <main className="relative p-page-lg flex h-auto flex-col items-center mx-auto py-0 pb-12 w-full max-w-6xl">
            {error ? (
                <div className="w-full p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                    <ErrorComponent 
                        error={new Error(error)} 
                        reset={() => setError(null)}
                        showReset={true}
                    />
                </div>
            ) : (
                <div className="w-full flex flex-col items-center">
                    {/* Prompting Section */}
                    <div className="flex flex-col w-full gap-8 justify-center items-center mt-24">
                        <div className="flex flex-col w-full gap-6">
                            <div className="space-y-2">
                                <p className="text-base text-muted-foreground">Welcome {session?.user?.name ? session.user.name.split(" ")[0] : "Guest"}!</p>
                                <h1 className="text-4xl font-semibold text-foreground leading-tight">What are we forging today?</h1>
                            </div>
                            <div className="flex flex-col w-full bg-muted/50 cursor-pointer p-5 gap-3 h-auto rounded-xl border border-border hover:border-muted-foreground/30 transition-colors">
                                <textarea 
                                    name="project" 
                                    className="flex-1 px-3 py-2 outline-none text-sm h-24 text-wrap resize-none overflow-hidden bg-transparent text-foreground placeholder:text-muted-foreground" 
                                    placeholder="Describe your project in detail..." 
                                    onChange={(e) => setProjectDescription(e.target.value)} 
                                    rows={3} 
                                    maxLength={300} 
                                    disabled={isLoading} 
                                />
                                <div className="h-px bg-border" />
                                <div className="flex w-full justify-between items-center px-2">
                                    <p className={`text-sm font-medium ${projectDescription.length === 0 ? "text-muted-foreground" : (projectDescription.length < 8 ? "text-destructive" : "text-foreground")}`}>
                                        {projectDescription.length} / 300
                                    </p>
                                    <Button
                                        className={`aspect-square rounded-xl ${(projectDescription.length < 8 || isLoading) ? "bg-muted text-foreground" : ""}`}
                                        size="icon-sm"
                                        disabled={projectDescription.length < 8 || isLoading}
                                        title="Build"
                                        onClick={() => handleBuildClick(projectDescription)}
                                    >
                                        {isLoading ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <HugeiconsIcon icon={ArrowUp} color="currentColor" className="h-full w-full" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <small className="text-sm text-center -mt-2 text-muted-foreground">
                                {isLoading ? "Creating your project..." : "Try to be as specific as possible to get the best results."}
                            </small>
                        </div>
                    </div>

                    {/* Existing Projects Section */}
                    {status === "authenticated" && (
                        <div className="w-full mt-16">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                                    <HugeiconsIcon icon={FolderOpen} className="w-5 h-5 text-muted-foreground" />
                                    Your Projects
                                </h2>
                                {projects.length > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        {projects.length} project{projects.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {isLoadingProjects ? (
                                <div className="flex justify-center py-8">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                                    <p className="text-sm text-muted-foreground">No projects yet</p>
                                    <p className="text-xs text-muted-foreground mt-1">Create your first project above!</p>
                                </div>
                            ) : (
                                <div className="w-full flex flex-col gap-3">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all w-full overflow-hidden"
                                        >
                                            <Link
                                                href={`/app/decision-matrix?projectId=${project.id}`}
                                                className="flex-1 min-w-0 overflow-hidden"
                                            >
                                                <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <HugeiconsIcon icon={Clock} className="w-3 h-3" />
                                                        {formatDate(project.createdAt)}
                                                    </span>
                                                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                                        {project.stage}
                                                    </span>
                                                </div>
                                            </Link>
                                            <div className="flex items-center gap-1 ml-2">
                                                <Link
                                                    href={`/app/decision-matrix?projectId=${project.id}`}
                                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                                >
                                                    <HugeiconsIcon 
                                                        icon={ChevronRight} 
                                                        className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                                                    />
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDeleteProject(project.id, e)}
                                                    disabled={deletingId === project.id}
                                                    className="p-2 rounded-lg bg-transparent"
                                                    title="Delete project"
                                                >
                                                    {deletingId === project.id ? (
                                                        <div className="h-4 w-4 rounded-full" />
                                                    ) : (
                                                        <HugeiconsIcon 
                                                            icon={Delete01Icon} 
                                                            className="w-4 h-4 text-muted-foreground hover:text-destructive" 
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            )}

        </main>
    );
}
