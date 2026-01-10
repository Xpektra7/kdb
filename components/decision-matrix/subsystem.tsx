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
        <Accordion type="single" collapsible defaultValue={subsystem.subsystem} className="w-full border-b border-border pb-3">
            <AccordionItem value={subsystem.subsystem}>
                <AccordionTrigger className="py-3 sm:py-4 bg-background text-base sm:text-lg md:text-xl hover:text-foreground transition-colors font-semibold">
                    {subsystem.subsystem} System
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    {subsystem.options.map((option: any, index: number) => (
                        <label htmlFor={option.name} key={index} className="flex items-center gap-2 mb-4 sm:mb-5 cursor-pointer group">
                            <div className="w-full flex flex-col gap-3 sm:gap-4 border border-border rounded-lg p-4 sm:p-5 md:p-6 hover:bg-muted/30 hover:border-muted-foreground/20 transition-colors">
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">{option.name}</h3>
                                    </div>
                                    <input type="radio" name={subsystem.subsystem} id={option.name} className="mt-1 size-5 md:size-6 shrink-0 cursor-pointer"/>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                    <p className="line-clamp-none leading-relaxed">{option.why_it_works}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
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