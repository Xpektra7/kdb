import { MutableRefObject, useState } from 'react';
import AccordionList from "./accordion-list";
import ProblemsOverall from "./problems";
import Research from "./research";
import Subsystem from "./subsystem";
import { BlockDiagram } from '../block-diagram/block-diagram';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

import type { DecisionMatrixProps, DecisionMatrixOption } from '@/lib/definitions';

interface ExtendedDecisionMatrixProps extends DecisionMatrixProps {
  projectId?: number;
}

export default function DecisionMatrix({ output, contentRefs, projectId }: ExtendedDecisionMatrixProps) {

  const router = useRouter();
  
  // Track selected options for each subsystem
  const [selectedOptions, setSelectedOptions] = useState<Record<string, DecisionMatrixOption>>({});
  // Track subsystems missing a selection for UX feedback
  const [missingSubs, setMissingSubs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Handle selection change for each subsystem
  const handleOptionSelect = (subsystemName: string, selectedOption: DecisionMatrixOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [subsystemName]: selectedOption,
    }));
    // Clear error highlight for this subsystem once user selects
    setMissingSubs((prev) => prev.filter((name) => name !== subsystemName));
  };

  // Send selected options to Blueprint API and navigate
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

    setIsLoading(true);
    setError(null);

    try {
      if (projectId) {
        // New flow: Save decisions to project, generate blueprint, then navigate
        // Fetch subsystems once
        const subsystemResponse = await fetch(`/api/projects/${projectId}/subsystems`);
        if (!subsystemResponse.ok) throw new Error('Failed to fetch subsystems');
        
        const { subsystems } = await subsystemResponse.json();

        // Save decisions for each subsystem
        for (const [subsystemName, option] of Object.entries(selectedOptions)) {
          const subsystem = subsystems.find((s: any) => s.name === subsystemName);
          if (!subsystem) continue;

          const matchingOption = subsystem.options.find((o: any) => o.name === option.name);
          if (!matchingOption) continue;

          // Save decision
          const decisionResponse = await fetch(`/api/projects/${projectId}/decisions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subsystemId: subsystem.id,
              selectedOptionId: matchingOption.id,
            }),
          });

          if (!decisionResponse.ok) {
            console.warn(`Failed to save decision for ${subsystemName}`);
          }
        }

        // Generate blueprint via AI
        const blueprintResponse = await fetch('/api/generate/blueprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: output.project,
            selectedOptions,
          }),
        });

        if (!blueprintResponse.ok) {
          const errorData = await blueprintResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate blueprint');
        }

        const { output: blueprintOutput } = await blueprintResponse.json();
        const parsedBlueprint = typeof blueprintOutput === 'string' 
          ? JSON.parse(blueprintOutput) 
          : blueprintOutput;

        // Persist blueprint to project
        const persistResponse = await fetch(`/api/projects/${projectId}/blueprint/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aiOutput: parsedBlueprint }),
        });

        if (!persistResponse.ok) {
          const errorData = await persistResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to save blueprint');
        }

        router.push(`/app/blueprint?projectId=${projectId}`);
      } else {
        // No projectId - this shouldn't happen in the new flow
        throw new Error('Project ID is required');
      }
    } catch (err) {
      console.error('Error proceeding to blueprint:', err);
      setError(err instanceof Error ? err.message : 'Failed to proceed to blueprint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl text-wrap flex flex-col gap-10 overflow-x-hidden">
      {/* Project Overview */}
      <div
        ref={(el) => { contentRefs.current['overview'] = el; }}
        className="flex flex-col gap-3 sm:gap-4 scroll-mt-20 pb-6 border-b border-border"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-tight">{output.project}</h1>
        <p className="text-sm sm:text-base leading-relaxed">{output.concept}</p>
      </div>

      {/* Research */}
      {output.research && (
        <div ref={(el) => { contentRefs.current['research'] = el; }} className="scroll-mt-20">
          <Research research={output.research} />
        </div>
      )}

      {/* Goals */}
      {output.goals && (
        <div ref={(el) => { contentRefs.current['goals'] = el; }} className="scroll-mt-20">
          <Research research={output.goals} />
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
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">Component Options</h1>
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

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        variant="default" 
        className="w-full sm:w-auto mt-6" 
        onClick={handleProceedToBlueprint}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Generating Blueprint...
          </>
        ) : (
          'Proceed to Blueprint'
        )}
      </Button>
    </div>
  );
}

