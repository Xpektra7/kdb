import { MutableRefObject, useState } from 'react';
import AccordionList from "./accordion-list";
import ProblemsOverall from "./problems";
import Research from "./research";
import Subsystem from "./subsystem";
import { BlockDiagram } from '../block-diagram/block-diagram';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

import type { DecisionMatrixProps, DecisionMatrixOption } from '@/lib/definitions';

export default function DecisionMatrix({ output, contentRefs }: DecisionMatrixProps) {

  const router = useRouter();
  
  // Track selected options for each subsystem
  const [selectedOptions, setSelectedOptions] = useState<Record<string, DecisionMatrixOption>>({});
  // Track subsystems missing a selection for UX feedback
  const [missingSubs, setMissingSubs] = useState<string[]>([]);


  // Handle selection change for each subsystem
  const handleOptionSelect = (subsystemName: string, selectedOption: DecisionMatrixOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [subsystemName]: selectedOption,
    }));
    // Clear error highlight for this subsystem once user selects
    setMissingSubs((prev) => prev.filter((name) => name !== subsystemName));
  };

  // Send selected options to Blueprint API and navigate with requestId
  const handleProceedToBlueprint = async () => {
    // Validate all subsystems have a selection
    const missing = (output.decision_matrix || [])
      .filter((m) => !selectedOptions[m.subsystem])
      .map((m) => m.subsystem);

    if (missing.length > 0) {
      setMissingSubs(missing);
      // Scroll to the first missing subsystem for better UX
      const firstMissingIdx = (output.decision_matrix || []).findIndex((m) => m.subsystem === missing[0]);
      const target = contentRefs.current[`component-${firstMissingIdx}`] || contentRefs.current['components'];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    try {
      // Save blueprint request and get short ID
      const response = await fetch('/api/blueprint-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: output.project,
          selectedOptions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save blueprint request');
      }

      const { requestId } = await response.json();
      router.push(`/app/blueprint?requestId=${requestId}`);
    } catch (error) {
      console.error('Error saving blueprint request:', error);
      // Fallback: still navigate but without data
      router.push('/app/blueprint');
    }
  };

  return (
    <div className="w-full max-w-6xl text-wrap flex flex-col gap-10 overflow-x-hidden">
      {/* Project Overview */}
      <div
        ref={(el) => { contentRefs.current['overview'] = el; }}
        className="flex flex-col gap-3 sm:gap-4 scroll-mt-20 pb-6 border-b border-border"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-tight">{output.project}</h1>
        <p className="text-sm sm:text-base leading-relaxed">{output.concept}</p>
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


      {/* Block Diagram */}
      <BlockDiagram matrix={output} className=''/>
      
      {/* Components */}
      <div ref={(el) => { contentRefs.current['components'] = el; }} className="scroll-mt-20">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 sm:mb-8">Component Options</h1>
        {output.decision_matrix && (
          <div className="flex flex-col rounded-lg p-2 sm:p-3 md:p-4 gap-6 sm:gap-7 md:gap-8">
            {output.decision_matrix.map((matrix, index) => (
              <div
                key={index}
                ref={(el) => { contentRefs.current[`component-${index}`] = el; }}
                className="scroll-mt-20"
              >
                <Subsystem 
                  subsystem={matrix} 
                  onOptionSelect={(selectedOption) => handleOptionSelect(matrix.subsystem, selectedOption)}
                  selectedOption={selectedOptions[matrix.subsystem]}
                  showError={missingSubs.includes(matrix.subsystem)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Required */}
      <div ref={(el) => { contentRefs.current['skills'] = el; }} className="scroll-mt-20">
        <AccordionList name="Skills Required" list={output.skills ? [output.skills] : []} />
      </div>

      <Button variant="default" className="w-full sm:w-auto mt-6" onClick={handleProceedToBlueprint}>
        Proceed to Blueprint
      </Button>
    </div>
  );
}

