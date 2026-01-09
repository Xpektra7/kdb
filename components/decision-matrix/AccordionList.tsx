import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function AccordionList({ name, list } : { name: string, list: string[]}) {
  return (
    <Accordion type="single" collapsible className="w-full border-b border-border mb-2">
      <AccordionItem value={name}>
        <AccordionTrigger className="py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm font-medium hover:text-primary transition-colors">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="text-xs sm:text-sm gap-1 flex flex-col">
            {list.map((item, index) => (
              <li key={index} className="break-words">- {item}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
