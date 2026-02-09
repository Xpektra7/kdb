import { HugeiconsIcon } from '@hugeicons/react';
import { Book02Icon } from '@hugeicons/core-free-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ComponentCard } from './component-card';
import type { Component, ComponentsProps } from '@/lib/definitions';

export function Components({ components, isExpanded, onToggle, expandedItems, onItemToggle, contentRef }: ComponentsProps) {
  return (
    <section ref={contentRef}>
      <Accordion type="single" collapsible defaultValue={isExpanded ? "components" : ""}>
        <AccordionItem value="components">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
              <h2>Components</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              {components.map((comp: Component, i: number) => (
                <ComponentCard
                  key={i}
                  component={comp}
                  isExpanded={expandedItems[`comp-${i}`] || false}
                  onToggle={() => onItemToggle(`comp-${i}`)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
