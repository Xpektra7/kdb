import { cn } from "@/lib/utils";
import { IconAi, IconArtboard, IconBrandCitymapper, IconChecklist, IconHexagon, IconNote, IconPlaneDeparture} from "@tabler/icons-react";

export function Features() {
    const features = [
        {
            title: "Engineering-first",
            description:
                "Designed specifically for engineering projects—IoT, embedded systems, and real hardware constraints.",
            icon: <IconArtboard />,
        },
        {
            title: "Decision-driven planning",
            description:
                "Compare subsystems, components, and tradeoffs before you build anything.",
            icon: <IconChecklist />,
        },
        {
            title: "Execution-ready blueprints",
            description:
                "Get structured project blueprints: architecture, components, steps, testing, and extensions.",
            icon: <IconBrandCitymapper />,
        },
        {
            title: "Context-locked AI",
            description:
                "AI that works inside your project context—no generic chat, no hallucinated advice.",
            icon: <IconAi />,
        },
        {
            title: "Theory, only when it matters",
            description:
                "Engineering theory explained exactly where it applies in your project—not as lectures.",
            icon: <IconNote />,
        },
        {
            title: "Built to ship projects",
            description:
                "From idea → decisions → blueprint → build guide. No inspiration dumps, just execution.",
            icon: <IconPlaneDeparture />,
        },
        {
            title: "Modular by design",
            description:
                "Subsystem-based structure lets you swap sensors, MCUs, power, and comms without chaos.",
            icon: <IconHexagon />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}   

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted/45 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted/45 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
