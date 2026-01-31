import { HugeiconsIcon } from '@hugeicons/react';
import { PuzzleIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { BuildGuideFirmware } from '@/lib/definitions';

interface FirmwareProps {
  firmware: BuildGuideFirmware;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Firmware({ firmware, contentRef }: FirmwareProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="firmware">
        <AccordionItem value="firmware">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold">
            <h2>Firmware / Code</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-accent-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-muted-foreground">Language:</span>
                <Badge variant="secondary" className="text-xs sm:text-sm">{firmware.language}</Badge>
              </div>
              
              {/* Code Structure */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center gap-2">
                  <HugeiconsIcon icon={PuzzleIcon} className="w-4 h-4 shrink-0" />
                  <span>Code Structure</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {firmware.structure.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                      <span className="text-muted-foreground">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Key Logic */}
              <div className="bg-muted/20 rounded-lg p-4 sm:p-6 border border-border">
                <h3 className="text-base sm:text-lg font-medium mb-3">Key Logic</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {firmware.key_logic.map((logic, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                      <span className="shrink-0 w-6 h-6 bg-muted-foreground/20 rounded-full flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span>{logic}</span>
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
