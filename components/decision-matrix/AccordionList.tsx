import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function AccordionList({ name, list } : { name: string, list: String[]}) {
  return (
    <Accordion type="single" collapsible className="w-full border-b border-border mb-2">
      <AccordionItem value={name}>
        <AccordionTrigger className="py-2 bg-transparent text-normal font-medium">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="">
            {list.map((item, index) => (
              <li key={index}>- {item}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
