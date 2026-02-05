import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';import { parseMarkdown } from '@/lib/utils/markdown';import type { BuildGuideFailure } from '@/lib/definitions';

interface CommonFailuresProps {
  failures: BuildGuideFailure[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function CommonFailures({ failures, contentRef }: CommonFailuresProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="failures">
        <AccordionItem value="failures">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Common Failures</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-3 sm:space-y-4">
              {failures.map((failure, i) => (
                <div key={i} className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                  <p className="font-medium text-sm sm:text-base mb-2">{parseMarkdown(failure.issue)}</p>
                  <div className="text-sm sm:text-base space-y-1 leading-relaxed">
                    <p>
                      <span className="text-muted-foreground">Cause:</span>{' '}
                      <span>{parseMarkdown(failure.cause)}</span>
                    </p>
                    <p>
                      <span className="text-green-500 font-medium">Fix:</span>{' '}
                      <span>{parseMarkdown(failure.fix)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
