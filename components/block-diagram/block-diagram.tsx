'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import type { BlockDiagramProps, Edge, BlockData } from '@/lib/definitions';



export function BlockDiagram({ data, className }: BlockDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodesByLevel, setNodesByLevel] = useState<Record<number, string[]>>({});
  const [lines, setLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);

  // 1. Parse Data into Graph Structure
  const { graphNodes, graphEdges } = useMemo(() => {
    const uniqueNodes = new Set<string>();
    const parsedEdges: Edge[] = [];
    const adjacency: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};

    const getConnections = (val: string | string[] | null | undefined): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(s => s.trim()).filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    };

    // Collect nodes and edges
    data.forEach((item) => {
      if (!item.block) return;
      const current = item.block.trim();
      uniqueNodes.add(current);
      if (!adjacency[current]) adjacency[current] = [];
      if (!inDegree[current]) inDegree[current] = 0;

      // Handle 'to'
      const targets = getConnections(item.to);
      targets.forEach((target) => {
        uniqueNodes.add(target);
        if (!adjacency[target]) adjacency[target] = [];
        if (!inDegree[target]) inDegree[target] = 0;

        const edgeId = `${current}-${target}`;
        if (!parsedEdges.find(e => e.id === edgeId)) {
          parsedEdges.push({ from: current, to: target, id: edgeId });
          adjacency[current].push(target);
          inDegree[target]++;
        }
      });

      // Handle 'from' (ensure edge exists if not already)
      const sources = getConnections(item.from);
      sources.forEach((source) => {
        uniqueNodes.add(source);
        if (!adjacency[source]) adjacency[source] = [];
        if (!inDegree[source]) inDegree[source] = 0;

        const edgeId = `${source}-${current}`;
        if (!parsedEdges.find(e => e.id === edgeId)) {
          parsedEdges.push({ from: source, to: current, id: edgeId });
          adjacency[source].push(current);
          inDegree[current]++;
        }
      });
    });

    // Assign Levels (BFS/Topological)
    const levels: Record<string, number> = {};
    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = [];

    // Initialize queue with sources (in-degree 0)
    const sources = Array.from(uniqueNodes).filter((n) => inDegree[n] === 0);

    // If cycle or no clear source, pick the first defined node
    if (sources.length === 0 && uniqueNodes.size > 0) {
      sources.push(Array.from(uniqueNodes)[0]);
    }

    sources.forEach(id => {
      queue.push({ id, level: 0 });
      visited.add(id);
    });

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      levels[id] = level;

      const neighbors = adjacency[id] || [];
      neighbors.forEach(next => {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push({ id: next, level: level + 1 });
        }
      });
    }

    // Assign level to unreachable nodes (islands)
    Array.from(uniqueNodes).forEach(node => {
      if (levels[node] === undefined) {
        levels[node] = 0;
      }
    });

    const nodesByLvl: Record<number, string[]> = {};
    Array.from(uniqueNodes).forEach(node => {
      const lvl = levels[node];
      if (!nodesByLvl[lvl]) nodesByLvl[lvl] = [];
      nodesByLvl[lvl].push(node);
    });

    return { graphNodes: nodesByLvl, graphEdges: parsedEdges };
  }, [data]);

  useEffect(() => {
    setNodesByLevel(graphNodes);
    setEdges(graphEdges);
  }, [graphNodes, graphEdges]);

  // 2. Calculate Lines Positions
  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const ARROW_GAP = 12; // keep arrowheads visible near node edges
    const newLines: typeof lines = [];

    edges.forEach((edge) => {
      const sourceEl = document.getElementById(`node-${edge.from}`);
      const targetEl = document.getElementById(`node-${edge.to}`);

      if (sourceEl && targetEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const x1 = sourceRect.right - containerRect.left;
        const y1 = sourceRect.top + sourceRect.height / 2 - containerRect.top;

        const x2 = targetRect.left - containerRect.left;
        const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;

        const direction = x2 >= x1 ? 1 : -1;
        const adjustedX2 = x2 - direction * ARROW_GAP;

        newLines.push({
          id: edge.id,
          x1,
          y1,
          x2: adjustedX2,
          y2,
        });
      }
    });
    setLines(newLines);
  };

  useEffect(() => {
    calculateLines();
    const observer = new ResizeObserver(() => {
      calculateLines();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const timeout = setTimeout(calculateLines, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [nodesByLevel, edges]);

  // Sort levels
  const sortedLevels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className={cn("relative w-full overflow-x-auto p-8", className)} ref={containerRef}>
      {/* SVG Layer for Lines */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ minWidth: '100%', minHeight: '100%', overflow: 'visible' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
          </marker>
        </defs>
        {lines.map((line) => (
          <path
            key={line.id}
            d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2) / 2} ${line.y1}, ${(line.x1 + line.x2) / 2} ${line.y2}, ${line.x2} ${line.y2}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="text-muted-foreground"
          />
        ))}
      </svg>

      {/* Nodes Layer - Responsive Grid Layout */}
      <div className="flex flex-wrap gap-4 sm:gap-8 md:gap-12 lg:gap-20 items-start justify-start">
        {sortedLevels.map((level) => (
          <div key={level} className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-start z-10">
            {nodesByLevel[level].map((nodeId) => (
              <motion.div
                key={nodeId}
                id={`node-${nodeId}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 sm:p-4 bg-background border-2 border-border rounded-lg shadow-sm min-w-[100px] sm:min-w-[120px] text-center text-sm sm:text-base font-medium capitalize"
              >
                {nodeId}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
