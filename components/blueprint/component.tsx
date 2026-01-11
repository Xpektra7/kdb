import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon, Book02Icon } from '@hugeicons/core-free-icons';
import { ComponentCard } from './ComponentCard';

interface Component {
  subsystem: string;
  chosen_option: string;
  why_chosen: string;
  features: string[];
  pros: string[];
  cons: string[];
  alternatives_considered: string[];
  availability: string;
  estimated_cost: string;
}

interface ComponentsProps {
  components: Component[];
  isExpanded: boolean;
  onToggle: () => void;
  expandedItems: Record<string, boolean>;
  onItemToggle: (id: string) => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Components({ components, isExpanded, onToggle, expandedItems, onItemToggle, contentRef }: ComponentsProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <button
        onClick={onToggle}
        className="w-full flex bg-transparent items-center justify-between mb-4"
      >
        <h2 className="text-lg sm:text-xl flex items-center gap-2">
          <HugeiconsIcon icon={Book02Icon} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Components</span>
        </h2>
        {isExpanded ? 
          <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 shrink-0" /> : 
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          {components.map((comp, i) => (
            <ComponentCard
              key={i}
              component={comp}
              isExpanded={expandedItems[`comp-${i}`] || false}
              onToggle={() => onItemToggle(`comp-${i}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}