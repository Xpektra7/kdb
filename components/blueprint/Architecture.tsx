import { ChevronDown, ChevronRight, Code } from 'lucide-react';

interface BlockDiagramItem {
  block: string;
  from: string[];
  to: string[];
}

interface ArchitectureProps {
  overview: string;
  blockDiagram: BlockDiagramItem[];
  dataFlow: string;
  isExpanded: boolean;
  onToggle: () => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Architecture({ overview, blockDiagram, dataFlow, isExpanded, onToggle, contentRef }: ArchitectureProps) {
  return (
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-white p-4 sm:p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4"
      >
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 bg-black">
          <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
          <span>Architecture</span>
        </h2>
        {isExpanded ? 
          <ChevronDown className="w-5 h-5 shrink-0" /> : 
          <ChevronRight className="w-5 h-5 shrink-0" />
        }
      </button>
      
      {isExpanded && (
        <div className="space-y-4 text-white">
          <div>
            <h3 className="font-medium mb-2 text-sm sm:text-base">Overview</h3>
            <p className="text-white text-sm sm:text-base">{overview}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-sm sm:text-base">Block Diagram</h3>
            <div className="bg-black rounded-lg p-3 sm:p-4 border border-black">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {blockDiagram.map((block, i) => (
                  <div key={i} className="bg-black p-3 rounded border border-black">
                    <p className="font-medium text-white text-sm sm:text-base">{block.block}</p>
                    {block.to.length > 0 && (
                      <p className="text-xs mt-1">→ {block.to.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-slate-900 mb-2 text-sm sm:text-base">Data Flow</h3>
            <p className="text-slate-700 text-sm sm:text-base">{dataFlow}</p>
          </div>
        </div>
      )}
    </section>
  );
}