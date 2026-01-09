import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import AccordionList from "./AccordionList";
import { Badge } from "../ui/badge";

export default function Subsystem({ subsystem }: { subsystem: any }) {
    return (
        <Accordion type="single" collapsible defaultValue={subsystem.subsystem} className="w-full border-b border-border pb-2">
            <AccordionItem value={subsystem.subsystem}>
                <AccordionTrigger className="py-2 sm:py-3 bg-background text-base sm:text-lg md:text-xl hover:text-primary transition-colors">
                    {subsystem.subsystem} System
                </AccordionTrigger>
                <AccordionContent className="">
                    {subsystem.options.map((option: any, index: number) => (
                        <label htmlFor={option.name} key={index} className="flex items-center gap-2 mb-3 sm:mb-4 cursor-pointer">
                            <div className="w-full flex flex-col gap-2 sm:gap-3 border border-border rounded-lg p-3 sm:p-4 md:p-5 hover:bg-card/70 transition-colors">
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                                    <div className="flex flex-col gap-1 sm:gap-2 flex-1">
                                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">{option.name}</h3>
                                    </div>
                                    <input type="radio" name={subsystem.subsystem} id={option.name} className="mt-1 size-4 sm:size-5 md:size-6 shrink-0"/>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                    <p className="line-clamp-none">{option.why_it_works}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                                        <Badge className="text-xs sm:text-sm" variant="secondary">{option.estimated_cost}</Badge>
                                        <Badge className="text-xs sm:text-sm" variant="outline">{String(option.availability).split(';')[0]}</Badge>
                                    </div>
                                </div>
                                <AccordionList name="Features" list={option.features} />
                                <AccordionList name="Pros" list={option.pros} />
                                <AccordionList name="Cons" list={option.cons} />

                            </div>
                        </label>
                    ))}

                </AccordionContent>
            </AccordionItem>
        </Accordion>

    );
}