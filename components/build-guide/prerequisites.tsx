import { HugeiconsIcon } from '@hugeicons/react';
import { Wrench01Icon, PackageIcon } from '@hugeicons/core-free-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { parseMarkdown } from '@/lib/utils/markdown';
import type { BuildGuidePrerequisites } from '@/lib/definitions';

interface PrerequisitesProps {
  prerequisites: BuildGuidePrerequisites;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Prerequisites({ prerequisites, contentRef }: PrerequisitesProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="prerequisites">
        <AccordionItem value="prerequisites">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Prerequisites</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Tools */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <HugeiconsIcon icon={Wrench01Icon} className="w-5 h-5 shrink-0" />
                  <span>Tools</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {prerequisites.tools.map((tool, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{parseMarkdown(tool)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <HugeiconsIcon icon={PackageIcon} className="w-5 h-5 shrink-0" />
                  <span>Materials</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {prerequisites.materials.map((material, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{parseMarkdown(material)}</span>
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
