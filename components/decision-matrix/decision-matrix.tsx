import { MutableRefObject } from 'react';
import AccordionList from "./AccordionList";
import ProblemsOverall from "./problems";
import Research from "./research";
import Subsystem from "./subsystem";
import { BlockDiagram } from '../block-diagram/block-diagram';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface DecisionMatrixProps {
  output: any;
  contentRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export default function DecisionMatrix({ output, contentRefs }: DecisionMatrixProps) {

  const router = useRouter();

  return (
    <div className="w-full max-w-6xl text-wrap flex flex-col gap-10 overflow-x-hidden">
      {/* Project Overview */}
      <div
        ref={(el) => { contentRefs.current['overview'] = el; }}
        className="flex flex-col gap-3 sm:gap-4 scroll-mt-20 pb-6 border-b border-border"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">{output.project}</h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">{output.concept}</p>
      </div>

      {/* Research */}
      {output.research && (
        <div ref={(el) => { contentRefs.current['research'] = el; }} className="scroll-mt-20">
          <Research research={output.research} />
        </div>
      )}

      {/* Problems */}
      {output.problems_overall && (
        <div ref={(el) => { contentRefs.current['problems'] = el; }} className="scroll-mt-20">
          <ProblemsOverall problems={output.problems_overall} />
        </div>
      )}
      <BlockDiagram data={output.block_diagram} />
      {/* Components */}
      <div ref={(el) => { contentRefs.current['components'] = el; }} className="scroll-mt-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8">Component Options</h1>
        {output.decision_matrix && (
          <div className="flex flex-col rounded-lg p-2 sm:p-3 md:p-4 gap-6 sm:gap-7 md:gap-8">
            {output.decision_matrix.map((matrix: any, index: number) => (
              <div
                key={index}
                ref={(el) => { contentRefs.current[`component-${index}`] = el; }}
                className="scroll-mt-20"
              >
                <Subsystem subsystem={matrix} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Required */}
      <div ref={(el) => { contentRefs.current['skills'] = el; }} className="scroll-mt-20">
        <AccordionList name="Skills Required" list={output.skills ? [output.skills] : []} />
      </div>

      {/* Suggestions */}
      <div ref={(el) => { contentRefs.current['suggestions'] = el; }} className="scroll-mt-20">
        <AccordionList name="Suggestions" list={output.suggestions || []} />
      </div>

      <Button variant="default" className="w-full sm:w-auto mt-6" onClick={() => router.push('/app/blueprint')}>
        Proceed to Blueprint
      </Button>
    </div>
  );
}

