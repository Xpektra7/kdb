import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <main className="max-w-4xl mx-auto py-16 px-6">
            {/* Hero */}
            <header className="mb-12">
                <h1 className="text-4xl font-semibold tracking-tight mb-3">
                    Getting Started with Apollo
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Apollo is a structured engineering project planning system. It guides
                    you from a raw project idea to a buildable, validated design—step by
                    step.
                </p>
            </header>

            {/* Philosophy */}
            <section className="mb-14">
                <h2 className="text-2xl font-medium mb-3">Why Apollo Exists</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                    Most engineering students start projects by randomly picking sensors,
                    microcontrollers, and power sources. They often discover—too
                    late—that parts are incompatible, unavailable, or outside budget.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Apollo fixes this by <strong>slowing you down in the right
                    places</strong>. It forces real engineering decisions up front so you
                    understand how each choice affects the final system before you write
                    code or wire anything.
                </p>
            </section>

            {/* Workflow */}
            <section className="mb-14">
                <h2 className="text-2xl font-medium mb-6">The Three-Stage Workflow</h2>
                <p className="text-muted-foreground mb-6">
                    Every Apollo project flows through three sequential stages. You cannot
                    skip stages—each one builds on the previous.
                </p>

                <ol className="space-y-8 border-l-2 border-border pl-6">
                    {/* Stage 1 */}
                    <li className="relative">
                        <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary-foreground text-xs font-semibold">
                            1
                        </span>
                        <h3 className="text-xl font-medium">Decision Matrix</h3>
                        <p className="text-sm text-muted-foreground italic mb-2">
                            "What systems does this project need?"
                        </p>
                        <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                            <li>Breaks the project into logical <strong>subsystems</strong> (sensing, control, power, communication, etc.).</li>
                            <li>Lists <strong>realistic component options</strong> for each subsystem.</li>
                            <li>Surfaces <strong>tradeoffs</strong>—cost, complexity, availability, power draw.</li>
                            <li>Identifies <strong>known engineering problems</strong> and suggested mitigations.</li>
                        </ul>
                        <p className="text-sm mt-3 text-muted-foreground">
                            Nothing is built at this stage. Its sole purpose is to <em>prevent
                            bad early decisions</em>.
                        </p>
                        <Link
                            className={buttonVariants({ variant: "link", className: "px-0 mt-2" })}
                            href="/examples/decision-matrix"
                        >
                            View example Decision Matrix →
                        </Link>
                    </li>

                    {/* Stage 2 */}
                    <li className="relative">
                        <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary-foreground text-xs font-semibold">
                            2
                        </span>
                        <h3 className="text-xl font-medium">Blueprint</h3>
                        <p className="text-sm text-muted-foreground italic mb-2">
                            "Given these choices, what does the system look like?"
                        </p>
                        <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                            <li>Freezes the chosen options from Stage 1.</li>
                            <li>Produces a <strong>single coherent architecture</strong>—block diagram, interconnections, interfaces.</li>
                            <li>Estimates <strong>total cost</strong> and <strong>required skills</strong>.</li>
                            <li>Documents <strong>risks, constraints, and failure modes</strong>.</li>
                        </ul>
                        <p className="text-sm mt-3 text-muted-foreground">
                            This is a <em>design document</em>, not a tutorial. It shows how
                            everything fits together before you order parts.
                        </p>
                        <Link
                            className={buttonVariants({ variant: "link", className: "px-0 mt-2" })}
                            href="/examples/blueprint"
                        >
                            View example Blueprint →
                        </Link>
                    </li>

                    {/* Stage 3 */}
                    <li className="relative">
                        <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                            3
                        </span>
                        <h3 className="text-xl font-medium text-muted-foreground">
                            Build Guide <span className="text-xs ml-1 font-normal">(coming soon)</span>
                        </h3>
                        <p className="text-sm text-muted-foreground italic mb-2">
                            "How do I actually build this?"
                        </p>
                        <ul className="list-disc ml-5 text-muted-foreground space-y-1 text-sm">
                            <li>Wiring diagrams and pin mappings.</li>
                            <li>Code structure and libraries.</li>
                            <li>Calibration and testing steps.</li>
                            <li>Common failure points and debugging tips.</li>
                        </ul>
                    </li>
                </ol>
            </section>

            {/* Best Practices */}
            <section className="mb-14">
                <h2 className="text-2xl font-medium mb-4">Best Practices</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-1">Be specific with the project title</h3>
                        <p className="text-sm text-muted-foreground">
                            "Smart plant monitor with soil moisture and Wi‑Fi alerts" yields
                            far better subsystem suggestions than "plant project."
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-1">State your constraints early</h3>
                        <p className="text-sm text-muted-foreground">
                            Budget limits, local part availability, and skill level should
                            inform every subsystem choice. Surface them at the Decision Matrix
                            stage.
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-1">Don't skip stages</h3>
                        <p className="text-sm text-muted-foreground">
                            Jumping straight to wiring or code is the #1 cause of broken
                            demos. Let the Decision Matrix catch incompatibilities first.
                        </p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-1">Review tradeoffs honestly</h3>
                        <p className="text-sm text-muted-foreground">
                            Cheaper parts may lack features; powerful parts may exceed your
                            power budget. Use the tradeoff tables to make informed choices.
                        </p>
                    </div>
                </div>
            </section>

            {/* What Apollo Is Not */}
            <section className="mb-14">
                <h2 className="text-2xl font-medium mb-4">What Apollo Is <em>Not</em></h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                    <li><strong>Not a chatbot.</strong> Apollo outputs structured JSON, not conversational prose.</li>
                    <li><strong>Not a project idea generator.</strong> You bring the idea; Apollo helps you engineer it.</li>
                    <li><strong>Not a copy‑paste code tool.</strong> Build Guides will explain code structure, not dump boilerplate.</li>
                    <li><strong>Not a YouTube replacement.</strong> Theory appears only when it explains a real system decision.</li>
                </ul>
            </section>

            {/* Quick Start */}
            <section className="rounded-lg border bg-muted/30 p-6">
                <h2 className="text-xl font-medium mb-3">Quick Start</h2>
                <ol className="list-decimal ml-5 text-muted-foreground space-y-2 text-sm">
                    <li>
                        Go to{" "}
                        <Link href="/app" className="underline underline-offset-2 text-primary">
                            /app
                        </Link>{" "}
                        and enter your project title.
                    </li>
                    <li>
                        Apollo generates a <strong>Decision Matrix</strong>—review subsystems, options, and tradeoffs.
                    </li>
                    <li>Select your preferred option for each subsystem.</li>
                    <li>
                        Proceed to <strong>Blueprint</strong>—Apollo generates a unified architecture based on your choices.
                    </li>
                    <li>Export as PDF or iterate until satisfied.</li>
                </ol>
            </section>
        </main>
    );
}