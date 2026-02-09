import Link from "next/link";

const examples = [
    {
        title: "Decision Matrix",
        stage: "Stage 1",
        description:
            "Subsystems, component options, and tradeoffs for a sample Smart Plant Monitor project.",
        href: "/examples/decision-matrix",
    },
    {
        title: "Blueprint",
        stage: "Stage 2",
        description:
            "Unified architecture, block diagram, and cost estimate generated from selected options.",
        href: "/examples/blueprint",
    },
    {
        title: "Build Guide",
        stage: "Stage 3",
        description:
            "Unified architecture, block diagram, and cost estimate generated from selected options.",
        href: "/examples/build-guide",
    },
];

export default function Page() {
    return (
        <main className="max-w-3xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Examples</h1>
            <p className="text-muted-foreground mb-8">
                Browse sample outputs for each workflow stage. Use these to understand
                what Apollo produces before starting your own project.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                {examples.map((ex) => (
                    <Link
                        key={ex.href}
                        href={ex.href}
                        className="group rounded-lg border p-5 hover:border-primary transition-colors"
                    >
                        <span className="text-xs font-medium text-muted-foreground">
                            {ex.stage}
                        </span>
                        <h2 className="text-lg font-medium mt-1 group-hover:text-primary transition-colors">
                            {ex.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">{ex.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}