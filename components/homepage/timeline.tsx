import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target, Note01Icon, Hammer, CheckCircle } from "@hugeicons/core-free-icons";

export function TimelineDemo() {
  const data = [
    {
      title: "Decision Matrix",
      subtitle: '"What systems does this project need?"',
      icon: <HugeiconsIcon icon={Target} className="w-5 h-5" />,
      content: (
        <div>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            Apollo breaks your project into <span className="text-foreground font-semibold">subsystems</span> (sensing, control, power, communication) and forces you to make deliberate choices before building anything.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">List realistic options for each subsystem</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">See tradeoffs: cost vs complexity vs availability</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Understand why each option works</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Catch incompatible choices early</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Blueprint",
      subtitle: '"Given these choices, what does the project look like?"',
      icon: <HugeiconsIcon icon={Note01Icon} className="w-5 h-5" />,
      content: (
        <div>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            Once your decisions are locked in, Apollo generates a <span className="text-foreground font-semibold">coherent system architecture</span> that shows exactly how everything fits together.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">System architecture diagram and component mapping</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Cost estimation and bill of materials</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Skills and time requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Risks, constraints, and failure modes</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Build Guide",
      subtitle: '"How do I actually build this?"',
      icon: <HugeiconsIcon icon={Hammer} className="w-5 h-5" />,
      content: (
        <div>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            Only after you've locked in the blueprint, Apollo gives you the <span className="text-foreground font-semibold">execution plan</span>—everything you need to actually build and test.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Wiring, pin mappings, and physical assembly</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Code structure and configuration steps</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Calibration, testing, and validation procedures</span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">Common failure points and how to debug them</span>
            </li>
          </ul>
        </div>
      ),
    },
  ];
  return (
    <section className="w-full p-page pt-20 pb-12 bg-linear-to-b from-muted-foreground/5 via-muted-foreground/5 to-transparent">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold leading-tight">How Apollo Thinks</h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Apollo doesn't jump straight to code. It forces you to slow down where it matters most—making the right engineering decisions, early.
        </p>
      </div>
      <div className="relative w-full overflow-clip">
        <Timeline data={data} />
      </div>
    </section>
  );
}
