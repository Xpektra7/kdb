import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Testing, TestingProps } from '@/lib/definitions';

export function Testing({ testing, contentRef }: TestingProps) {
  return (
    <section ref={contentRef}>
      <Accordion type="single" collapsible defaultValue="testing">
        <AccordionItem value="testing">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Testing</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 border-l-2 border-accent-border pl-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm font-medium mb-3">Methods</p>
                <div className="flex flex-wrap gap-2">
                  {testing.methods.map((method, i) => (
                    <Badge key={i} variant="outline" className="text-xs sm:text-sm">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium mb-3">Success Criteria</p>
                <p className="text-xs sm:text-sm p-4 sm:p-6 rounded border border-border bg-muted/30">
                  {testing.success_criteria}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}