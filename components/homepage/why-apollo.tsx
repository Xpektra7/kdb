import { HugeiconsIcon } from "@hugeicons/react";
import {
    AlertTriangle,
    Book02Icon,
    Cancel01Icon,
    CheckCircle,
    Hammer,
    Note01Icon,
    ShieldCheck,
    Target,
} from "@hugeicons/core-free-icons";

export default function WhyApollo() {
    const rows = [
        { old: "Scattered docs", new: "Single project context", oldIcon: Book02Icon, newIcon: ShieldCheck },
        { old: "Guesswork decisions", new: "Explicit tradeoffs", oldIcon: Cancel01Icon, newIcon: Target },
        { old: "Generic AI chat", new: "Context-locked engineering AI", oldIcon: Note01Icon, newIcon: CheckCircle },
        { old: "Theory overload", new: "Theory only when needed", oldIcon: Book02Icon, newIcon: Note01Icon },
        { old: "Rigid designs", new: "Modular, swappable subsystems", oldIcon: Cancel01Icon, newIcon: Hammer },
        { old: "“Hope it works” builds", new: "Execution-ready blueprints", oldIcon: AlertTriangle, newIcon: CheckCircle },
    ];

    return (
        <section className="relative w-full p-page py-18">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-background/80" />
            <div className="absolute -inset-x-10 top-20 h-48 blur-[120px] bg-gradient-to-r from-accent/20 via-primary/10 to-transparent -z-10" />

            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-baseline justify-between flex-wrap gap-3">
                    <h2 className="text-3xl font-bold text-foreground">Old Way vs <span className="text-accent text-3xl">Apollo</span></h2>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">No fluff. Just contrast.</p>
                </div>

                <div className="grid gap-3">
                    {rows.map((row) => (
                        <div key={row.old} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/40 px-4 py-3 text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.02)]">
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/70 text-muted-foreground/80 -rotate-3">
                                    <HugeiconsIcon icon={row.oldIcon} className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-medium tracking-tight">{row.old}</span>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 text-foreground shadow-[0_10px_40px_-24px_rgba(0,0,0,0.45)]">
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary-foreground">
                                    <HugeiconsIcon icon={row.newIcon} className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-semibold tracking-tight">{row.new}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 text-center text-lg font-semibold text-foreground">
                    Stop guessing. Start building.
                </div>
            </div>
        </section>
    );
}