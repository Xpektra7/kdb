import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { BuildGuideTesting } from '@/lib/definitions';

interface TestingProps {
  testing: BuildGuideTesting;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Testing({ testing, contentRef }: TestingProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="testing">
        <AccordionItem value="testing">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Testing Procedures</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              {/* Unit Tests */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unit Tests</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {testing.unit.map((test, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Integration Tests */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <span className="text-blue-500">⟳</span>
                  <span>Integration Tests</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {testing.integration.map((test, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Acceptance Tests */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <span className="text-purple-500">★</span>
                  <span>Acceptance Tests</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {testing.acceptance.map((test, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{test}</span>
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
