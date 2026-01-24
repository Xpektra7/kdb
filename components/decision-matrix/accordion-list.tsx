import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionList({
  name,
  list,
}: {
  name: string;
  list: string[];
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-b border-border mb-2"
    >
      <AccordionItem value={name}>
        <AccordionTrigger className="py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm font-medium hover:text-foreground transition-colors">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </AccordionTrigger>
        {list && list.length > 0 && (
          <AccordionContent>
            <ul className="text-xs sm:text-sm gap-1.5 flex flex-col pl-2 border-l-2 border-accent-border-border">
              {list.map((item, index) => (
                <li
                  key={index}
                  className="wrap-break-words pl-2 leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}
