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
    <div className="w-full">
      <div className="w-full flex flex-col gap-8">
        {/* Project Overview */}
        <div
          ref={(el) => { contentRefs.current['overview'] = el; }}
          className="flex flex-col gap-2 scroll-mt-20"
        >
          <h1 className="text-4xl font-semibold">{output.project}</h1>
          <p>{output.concept}</p>
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
          <h1 className="text-2xl">Components</h1>
          {output.decision_matrix && (
            <div className="flex flex-col rounded-lg p-4 gap-4">
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

        <Button variant="default" onClick={() => router.push('/app/blueprint')}>
          Proceed
        </Button>
      </div>
    </div>
  );
}

