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
        <Accordion type="single" collapsible className="w-full border-b border-border pb-2">
            <AccordionItem value={subsystem.subsystem}>
                <AccordionTrigger className="py-2 bg-background text-xl">
                    {subsystem.subsystem} System
                </AccordionTrigger>
                <AccordionContent className="">
                    {subsystem.options.map((option: any, index: number) => (
                        <label htmlFor={option.name} key={index} className="flex items-center gap-2 mb-2 cursor-pointer">
                            <div className="w-full flex flex-col gap-2 border border-border rounded-lg p-4 hover:bg-card/70">
                                <div className="w-full flex items-baseline justify-between">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-normal font-semibold">{option.name}</h3>
                                    </div>
                                    <input type="radio" name={subsystem.subsystem} id={option.name} className="size-6 "/>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>{option.why_it_works}</p>
                                    <div className="flex flex-wrap items-baseline-last w-full gap-1">
                                        <Badge className="mt-1" variant="secondary">{option.estimated_cost}</Badge>
                                        <Badge className="ml-1" variant="outline">{String(option.availability).split(';')[0]}</Badge>
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