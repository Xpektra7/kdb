import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { parseMarkdown } from '@/lib/utils/markdown';

interface CalibrationProps {
  calibration: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Calibration({ calibration, contentRef }: CalibrationProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="calibration">
        <AccordionItem value="calibration">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Calibration</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
              <ol className="space-y-2 sm:space-y-3">
                {calibration.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="shrink-0 w-6 h-6 bg-muted-foreground/20 rounded-full flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
