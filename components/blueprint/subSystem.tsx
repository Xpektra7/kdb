import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon, Book02Icon } from '@hugeicons/core-free-icons';
import type { SubsystemInterface, Subsystem, SubsystemsProps } from '@/lib/definitions';

export function Subsystems({ subsystems, isExpanded, onToggle, contentRef }: SubsystemsProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <button
        onClick={onToggle}
        className="w-full flex bg-transparent items-center justify-between mb-4"
      >
        <h2 className="text-lg sm:text-xl flex items-center gap-2">
          <HugeiconsIcon icon={Book02Icon} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Subsystems</span>
        </h2>
        {isExpanded ? 
          <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 shrink-0" /> : 
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          {subsystems.map((subsystem, i) => (
            <div key={i} className="border border-border rounded-lg p-3 sm:p-4 ">
              <h3 className="mb-2 text-sm sm:text-base">{subsystem.name}</h3>
              <p className="text-xs sm:text-sm mb-3">{subsystem.role}</p>
              <div className="space-y-2">
                <p className="text-xs">Interfaces:</p>
                {subsystem.interfaces.map((iface, j) => (
                  <div key={j} className=" p-2 rounded border border-border text-xs sm:text-sm">
                    <span className="font-medium">{iface.type}</span> • {iface.voltage}
                    {iface.notes && <span className="block sm:inline sm:ml-1">— {iface.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}