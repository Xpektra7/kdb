import { HugeiconsIcon } from '@hugeicons/react';
import { Book02Icon } from '@hugeicons/core-free-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ArchitectureProps, BlockDiagramItem } from '@/lib/definitions';

export function Architecture({
  overview,
  blockDiagram,
  dataFlow,
  isExpanded,
  onToggle,
  contentRef,
}: ArchitectureProps) {
  // Handle both string array and object array formats
  const diagramItems = blockDiagram.map((item, index) => {
    if (typeof item === 'string') {
      return { block: item, from: [], to: [] };
    }
    return { ...item, from: item.from || [], to: item.to || [] };
  });

  return (
    <section ref={contentRef} className='border-b border-border pb-4'>
      <Accordion type="single" collapsible defaultValue={isExpanded ? "architecture" : ""}>
        <AccordionItem value="architecture">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
             <h2>Architecture</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm sm:text-base font-medium">Overview</h3>
                <p className="text-sm sm:text-base">{overview}</p>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-sm sm:text-base">
                  Block Diagram
                </h3>
                  <div className="flex flex-col gap-3">
                    {diagramItems.map((block, i) => (
                      <div
                        key={i}
                        className="p-4 rounded border border-border bg-muted/30"
                      >
                        <p className="text-sm sm:text-base">{block.block}</p>
                        {block.to && Array.isArray(block.to) && block.to.length > 0 && (
                          <p className="text-xs mt-1">→ {block.to.join(", ")}</p>
                        )}
                      </div>
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
