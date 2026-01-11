import { ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';

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

interface ComponentCardProps {
  component: Component;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ComponentCard({ component, isExpanded, onToggle }: ComponentCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-linear-to-r  p-3 sm:p-4 flex items-center justify-between transition-colors"
      >
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs mb-1 text-black">{component.subsystem} System</p>
          <p className=" text-sm sm:text-base wrap-break-words pr-2 text-black">
            {component.chosen_option}
          </p>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 shrink-0" /> : 
          <ChevronRight className="w-5 h-5 shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3 bg-black border-t border-border">
          <div>
            <p className="text-xs mb-1">Why Chosen</p>
            <p className="text-xs sm:text-sm">{component.why_chosen}</p>
          </div>
          
          <div>
            <p className="text-xs  mb-1">Features</p>
            <ul className="space-y-1">
              {component.features.map((feature, j) => (
                <li key={j} className="text-xs sm:text-sm flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-x mb-1">Pros</p>
              <ul className="space-y-1">
                {component.pros.map((pro, j) => (
                  <li key={j} className="text-xs sm:text-sm ">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs mb-1">Cons</p>
              <ul className="space-y-1">
                {component.cons.map((con, j) => (
                  <li key={j} className="text-xs sm:text-sm text-slate-700">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <p className="text-xs 0 mb-1">Alternatives Considered</p>
            <p className="text-xs sm:text-sm">{component.alternatives_considered.join(', ')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-border">
            <span className="text-xs sm:text-sm">{component.availability}</span>
            <span className="text-sm sm:text-base">{component.estimated_cost}</span>
          </div>
        </div>
      )}
    </div>
  );
}