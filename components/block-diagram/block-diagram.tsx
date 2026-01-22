'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

import type { BlockDiagramProps, DecisionMatrixItem } from '@/lib/definitions';

export function BlockDiagram({ matrix, className }: BlockDiagramProps) {
  const data = matrix.decision_matrix || [];
  
  const blocks = useMemo(() => {
    const blockMap = new Map<string, { subsystem: string; to: string[] }>();

    const getConnections = (val: string | string[] | null | undefined): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(s => s.trim()).filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    };

    data.forEach((item: DecisionMatrixItem) => {
      if (!item.subsystem) return;
      const current = item.subsystem.trim();
      
      if (!blockMap.has(current)) {
        blockMap.set(current, { subsystem: current, to: [] });
      }

      const targets = getConnections(item.to);
      const existing = blockMap.get(current)!;
      targets.forEach(target => {
        if (!existing.to.includes(target)) {
          existing.to.push(target);
        }
      });
    });

    return Array.from(blockMap.values());
  }, [data]);

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="rounded-lg p-3 sm:p-4 border border-border">
        <div className="flex flex-col gap-3">
          {blocks.map((block, i) => (
            <div
              key={i}
              className="p-3 rounded border border-border bg-muted/30"
            >
              <p className="text-sm sm:text-base capitalize font-medium">{block.subsystem}</p>
              {block.to && block.to.length > 0 && (
                <p className="text-xs mt-1 capitalize">→ {block.to.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
