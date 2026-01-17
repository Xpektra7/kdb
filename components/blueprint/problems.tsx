import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import type { ProblemStatementProps } from '@/lib/definitions';

export function ProblemStatement({ statement, constraints, contentRef }: ProblemStatementProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={Alert01Icon} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Problem Statement</span>
      </h2>
      <p className="text-sm sm:text-base mb-4">{statement}</p>
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
    </section>
  );
}