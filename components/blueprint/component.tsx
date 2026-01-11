import { ChevronDown, ChevronRight, Zap } from 'lucide-react';
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
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
          <span>Components</span>
        </h2>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 flex-shrink-0" /> : 
          <ChevronRight className="w-5 h-5 flex-shrink-0" />
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