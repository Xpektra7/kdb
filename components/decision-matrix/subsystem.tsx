import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import AccordionList from "./accordion-list";
import { Badge } from "../ui/badge";
import type { SubsystemProps, DecisionMatrixOption } from '@/lib/definitions';

export default function Subsystem({ subsystem, onOptionSelect, selectedOption, showError }: SubsystemProps) {
    const handleOptionChange = (option: DecisionMatrixOption) => {
        if (onOptionSelect) {
            onOptionSelect(option);
        }
    };
    return (
        <Accordion type="single" collapsible defaultValue={subsystem.subsystem} className="w-full border-b border-border pb-3">
            <AccordionItem value={subsystem.subsystem}>
                <AccordionTrigger className="py-3 sm:py-4 bg-background text-base sm:text-lg md:text-xl hover:text-foreground transition-colors font-semibold">
                    {subsystem.subsystem} System
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    {subsystem.options.map((option, index) => (
                        <label htmlFor={option.name} key={index} className="flex items-center gap-2 mb-4 sm:mb-5 cursor-pointer group">
                            <div className={`w-full flex flex-col gap-3 sm:gap-4 border rounded-lg p-4 sm:p-5 md:p-6 hover:bg-muted/30 transition-colors ${showError ? 'border-destructive/60 ring-1 ring-destructive/30' : 'border-border hover:border-muted-foreground/20'}`}>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">{option.name}</h3>
                                    </div>
                                    <input 
                                        type="radio" 
                                        name={subsystem.subsystem} 
                                        id={option.name} 
                                        className="mt-1 size-5 md:size-6 shrink-0 cursor-pointer"
                                        checked={selectedOption?.name === option.name}
                                        onChange={() => handleOptionChange(option)}
                                        aria-invalid={showError}
                                    />
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                    <p className="line-clamp-none leading-relaxed">{option.why_it_works}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                                        <Badge className="text-xs sm:text-sm" variant="secondary" title="Estimated Cost">{option.estimated_cost}</Badge>
                                        <Badge className="text-xs sm:text-sm" variant="secondary" title="Availability">{option.availability}</Badge>
                                    </div>
                                </div>
                                {option.features && option.features.length > 0 && (
                                  <AccordionList name="Features" list={option.features} />
                                )}
                                <AccordionList name="Pros" list={option.pros} />
                                <AccordionList name="Cons" list={option.cons} />

                                {showError && (
                                    <p className="text-xs sm:text-sm text-destructive font-medium">Select an option to continue.</p>
                                )}
                            </div>
                        </label>
                    ))}

                </AccordionContent>
            </AccordionItem>
        </Accordion>

    );
}
