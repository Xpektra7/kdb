import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { BuildGuideWiring } from '@/lib/definitions';

interface WiringProps {
  wiring: BuildGuideWiring;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Wiring({ wiring, contentRef }: WiringProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="wiring">
        <AccordionItem value="wiring">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Wiring Instructions</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              <p className="text-sm sm:text-base leading-relaxed">{wiring.description}</p>
              
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3">Connections</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {wiring.connections.map((connection, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                      <span className="shrink-0 w-6 h-6 bg-muted-foreground/20 rounded-full flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span>{connection}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
