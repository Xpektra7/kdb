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
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-slate-50 to-white p-3 sm:p-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
      >
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs text-slate-600 mb-1">{component.subsystem} System</p>
          <p className="font-semibold text-slate-900 text-sm sm:text-base break-words pr-2">
            {component.chosen_option}
          </p>
        </div>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 flex-shrink-0" /> : 
          <ChevronRight className="w-5 h-5 flex-shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3 bg-white border-t border-slate-200">
          <div>
            <p className="text-xs font-medium text-slate-600 mb-1">Why Chosen</p>
            <p className="text-xs sm:text-sm text-slate-700">{component.why_chosen}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 mb-1">Features</p>
            <ul className="space-y-1">
              {component.features.map((feature, j) => (
                <li key={j} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">Pros</p>
              <ul className="space-y-1">
                {component.pros.map((pro, j) => (
                  <li key={j} className="text-xs sm:text-sm text-slate-700">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-red-700 mb-1">Cons</p>
              <ul className="space-y-1">
                {component.cons.map((con, j) => (
                  <li key={j} className="text-xs sm:text-sm text-slate-700">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-slate-600 mb-1">Alternatives Considered</p>
            <p className="text-xs sm:text-sm text-slate-700">{component.alternatives_considered.join(', ')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-slate-200">
            <span className="text-xs sm:text-sm text-slate-600">{component.availability}</span>
            <span className="font-semibold text-green-700 text-sm sm:text-base">{component.estimated_cost}</span>
          </div>
        </div>
      )}
    </div>
  );
}