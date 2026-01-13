import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon, Book02Icon } from '@hugeicons/core-free-icons';

interface BlockDiagramItem {
  block: string;
  from?: string[];
  to?: string[];
}

interface ArchitectureProps {
  overview: string;
  blockDiagram: BlockDiagramItem[] | string[];
  dataFlow?: string;
  isExpanded: boolean;
  onToggle: () => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Architecture({
  overview,
  blockDiagram,
  dataFlow,
  isExpanded,
  onToggle,
  contentRef,
}: ArchitectureProps) {
  // Handle both string array and object array formats
  const diagramItems = blockDiagram.map((item, index) => {
    if (typeof item === 'string') {
      return { block: item, from: [], to: [] };
    }
    return { ...item, from: item.from || [], to: item.to || [] };
  });

  return (
    <section
      ref={contentRef}
      className="rounded-lg shadow-sm border border-border p-4 sm:p-6"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center bg-background justify-between"
      >
        <h2 className="text-lg bg-transparent sm:text-xl flex items-center gap-2">
          <HugeiconsIcon icon={Book02Icon} className="sm:w-5 sm:h-5 w-4 h-4 shrink-0" />
          <span>Architecture</span>
        </h2>
        {isExpanded ? (
          <HugeiconsIcon icon={ArrowDown01Icon} className="w-5 h-5 shrink-0" />
        ) : (
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm sm:text-base">Overview</h3>
            <p className="text-sm sm:text-base">{overview}</p>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-sm sm:text-base">
              Block Diagram
            </h3>
            <div className="rounded-lg p-3 sm:p-4 border border-border">
              <div className="flex flex-col gap-3">
                {diagramItems.map((block, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-border bg-muted/30"
                  >
                    <p className="text-sm sm:text-base">{block.block}</p>
                    {block.to && block.to.length > 0 && (
                      <p className="text-xs mt-1">→ {block.to.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {dataFlow && (
            <div>
              <h3 className="mb-2 text-sm sm:text-base">Data Flow</h3>
              <p className="text-sm sm:text-base">{dataFlow}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
