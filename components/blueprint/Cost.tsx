import { HugeiconsIcon } from '@hugeicons/react';
import { DollarCircleIcon } from '@hugeicons/core-free-icons';

interface CostProps {
  cost: string;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Cost({ cost, contentRef }: CostProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={DollarCircleIcon} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Cost Estimation</span>
      </h2>
      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{cost}</p>
    </section>
  );
}
