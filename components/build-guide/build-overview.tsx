import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { parseMarkdown } from '@/lib/utils/markdown';

interface BuildOverviewProps {
  overview: string;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function BuildOverview({ overview, contentRef }: BuildOverviewProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="overview">
        <AccordionItem value="overview">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Build Overview</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <p className="text-sm sm:text-base leading-relaxed">{parseMarkdown(overview)}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
