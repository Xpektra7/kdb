import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import type { Component, ComponentCardProps } from '@/lib/definitions';

export function ComponentCard({ component, isExpanded, onToggle }: ComponentCardProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-transparent  p-3 sm:p-4 flex items-center justify-between transition-colors "
      >
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs mb-1">
            {component.subsystem} System
          </p>
          <p className="text-sm sm:text-base wrap-break-words pr-2">
            {component.chosen_option}
          </p>
        </div>
        {isExpanded ? 
          <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 shrink-0" /> : 
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3  border-t border-border">
          <div>
            <p className="text-xs mb-1">Why Chosen</p>
            <p className="text-xs sm:text-sm">{component.why_chosen}</p>
          </div>
          
          {component.features && component.features.length > 0 && (
            <div>
              <p className="text-xs mb-1">Features</p>
              <ul className="space-y-1">
                {component.features.map((feature, j) => (
                  <li key={j} className="text-xs sm:text-sm flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">•</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs mb-1">Pros</p>
              <ul className="space-y-1">
                {component.pros.map((pro, j) => (
                  <li key={j} className="text-xs sm:text-sm">• {pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs mb-1">Cons</p>
              <ul className="space-y-1">
                {component.cons.map((con, j) => (
                  <li key={j} className="text-xs sm:text-sm">• {con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {component.alternatives_considered && component.alternatives_considered.length > 0 && (
            <div>
              <p className="text-xs mb-1">Alternatives Considered</p>
              <p className="text-xs sm:text-sm">{component.alternatives_considered.join(', ')}</p>
            </div>
          )}
          
          {(component.availability || component.estimated_cost) && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-border">
              {component.availability && <span className="text-xs sm:text-sm">{component.availability}</span>}
              {component.estimated_cost && <span className="text-sm sm:text-base">{component.estimated_cost}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}