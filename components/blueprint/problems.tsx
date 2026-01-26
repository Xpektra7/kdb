import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ProblemStatementProps } from '@/lib/definitions';

export function ProblemStatement({ statement, constraints, contentRef }: ProblemStatementProps) {
  return (
    <section ref={contentRef}>
      <Accordion type="single" collapsible defaultValue="problem">
        <AccordionItem value="problem">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Problem Statement</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              <div>
                <p className="text-sm sm:text-base mb-4">{statement}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium">Constraints:</p>
                <div className="flex flex-wrap gap-2">
                  {constraints.map((constraint, i) => (
                    <Badge key={i} variant="outline" className="text-xs sm:text-sm">
                      {constraint}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}