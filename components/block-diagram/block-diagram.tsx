'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

import type { BlockDiagramProps, DecisionMatrixItem } from '@/lib/definitions';

export function BlockDiagram({ matrix, className }: BlockDiagramProps) {
  const data : DecisionMatrixItem[] = matrix 

  const blocks = useMemo(() => {
    const blockMap = new Map<string, { subsystem: string; outputTo: string[] }>();

    const getConnections = (val: string | string[] | null | undefined): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(s => s.trim()).filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    };

    data.forEach((item: DecisionMatrixItem) => {
      if (!item.subsystem) return;
      const current = item.subsystem.trim();

      if (!blockMap.has(current)) {
        blockMap.set(current, { subsystem: current, outputTo: [] });
      }

      const targets = getConnections(item.outputTo);
      const existing = blockMap.get(current)!;
      targets.forEach(target => {
        if (!existing.outputTo.includes(target)) {
          existing.outputTo.push(target);
        }
      });
    });

    return Array.from(blockMap.values());
  }, [data]);

  return (
    <div className={cn("w-full py-4", className)}>
      <h2 className='text-xl sm:text-2xl font-semibold mb-6 sm:mb-8'>Block Diagram</h2>
      <div className="rounded-lg p-4 sm:p-6 border border-border">
        <div className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <div
              key={i}
              className="p-4 rounded border border-border bg-muted/30"
            >
              <p className="text-sm sm:text-base capitalize font-medium">{block.subsystem}</p>
              {block.outputTo && block.outputTo.length > 0 && (
                <p className="text-xs mt-1 capitalize">→ {block.outputTo.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

