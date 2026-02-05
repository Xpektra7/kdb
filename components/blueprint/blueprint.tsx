"use client";

import { ProblemStatement } from '@/components/blueprint/problems';
import { Architecture } from '@/components/blueprint/architecture';
import { Components } from '@/components/blueprint/component';
import { ExecutionSteps } from '@/components/blueprint/execution-step';
import { Testing } from '@/components/blueprint/testing';
import { FailureModes } from '@/components/blueprint/failure-modes';
import { Skills } from '@/components/blueprint/skills';
import { Cost } from '@/components/blueprint/cost';
import { ExtensionsAndReferences } from '@/components/blueprint/extension-and-ref';
import type { Blueprint } from '@/lib/definitions';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Compresses the full blueprint into a minimal format for build guide generation
 */
function compressBlueprintForBuildGuide(blueprint: Blueprint) {
  return {
    project: blueprint.project,
    location: "Nigeria", // Default location, could be made dynamic
    systems: blueprint.components.map((comp) => ({
      subsystem: comp.subsystem,
      choice: comp.chosen_option,
    })),
    constraints: blueprint.problem?.constraints || [],
  };
}


interface BlueprintProps {
  blueprintData: Blueprint;
  contentRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  expandedSections: Record<string, boolean>;
  expandedItems: Record<string, boolean>;
  toggleSection: (id: string) => void;
  toggleItem: (id: string) => void;
  projectId?: number;
  dummy?: boolean;
}

export default function Blueprint({
  blueprintData,
  contentRefs,
  expandedSections,
  expandedItems,
  toggleSection,
  toggleItem,
  projectId,
  dummy,
}: BlueprintProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceedToBuildGuide = async () => {
    // In dummy mode, just navigate directly to the build guide page
    if (dummy) {
      router.push('/app/build-guide');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Compress blueprint to minimal format
      const compressedBlueprint = compressBlueprintForBuildGuide(blueprintData);
      
      // Generate the build guide
      const generateResponse = await fetch('/api/generate/build-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: compressedBlueprint.project,
          blueprint: compressedBlueprint,
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate build guide');
      }

      const { output, error: genError } = await generateResponse.json();
      
      if (genError) {
        throw new Error(genError);
      }
      
      // Output is already parsed from the API
      const buildGuideOutput = output;

      if (projectId) {
        // New flow: Persist build guide to project
        const persistResponse = await fetch(`/api/projects/${projectId}/build-guide/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aiOutput: buildGuideOutput }),
        });

        if (!persistResponse.ok) {
          const errorData = await persistResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to save build guide');
        }

        router.push(`/app/build-guide?projectId=${projectId}`);
      } else {
        // Legacy flow: Store in temporary request store
        const storeResponse = await fetch('/api/build-guide-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: compressedBlueprint.project,
            buildGuideOutput,
          }),
        });

        if (!storeResponse.ok) {
          throw new Error('Failed to store build guide');
        }

        const { requestId } = await storeResponse.json();
        router.push(`/app/build-guide?requestId=${requestId}`);
      }
      
    } catch (err) {
      console.error('Error generating build guide:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate build guide');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="bg-muted/30 p-4 rounded-lg border-l-2 border-border">
        <p className="text-sm leading-relaxed">
          Comprehensive project blueprint with architecture, components, and
          execution plan.
        </p>
      </div>

      {/* Project Header */}
      <div className="bg-background rounded-lg shadow-sm border border-border p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 wrap-break-words">
          {blueprintData.project}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Blueprint</p>
      </div>

      {/* Problem Statement */}
      {blueprintData.problem && (
        <ProblemStatement
          statement={blueprintData.problem.statement}
          constraints={blueprintData.problem.constraints}
          contentRef={(el) => (contentRefs.current["problem"] = el)}
        />
      )}

      {/* Architecture */}
      {blueprintData.architecture && (
        <Architecture
          overview={blueprintData.architecture.overview}
          blockDiagram={blueprintData.architecture.block_diagram}
          dataFlow={blueprintData.architecture.data_flow}
          isExpanded={expandedSections.architecture}
          onToggle={() => toggleSection("architecture")}
          contentRef={(el) => (contentRefs.current["architecture"] = el)}
        />
      )}


      {/* Components */}
      {blueprintData.components && (
        <Components
          components={blueprintData.components}
          isExpanded={expandedSections.components}
          onToggle={() => toggleSection("components")}
          expandedItems={expandedItems}
          onItemToggle={toggleItem}
          contentRef={(el) => (contentRefs.current["components"] = el)}
        />
      )}

      {/* Execution Steps */}
      {blueprintData.execution_steps && (
        <ExecutionSteps
          steps={blueprintData.execution_steps}
          contentRef={(el) => (contentRefs.current["execution"] = el)}
        />
      )}

      {/* Testing */}
      {blueprintData.testing && (
        <Testing
          testing={blueprintData.testing}
          contentRef={(el) => (contentRefs.current["testing"] = el)}
        />
      )}

      {/* Failure Modes */}
      {blueprintData.testing.failure_modes && (
        <FailureModes
          failureModes={blueprintData.testing.failure_modes}
          contentRef={(el) => (contentRefs.current["failures"] = el)}
        />
      )}

      {/* Skills */}
      {blueprintData.skills && (
        <Skills
          skills={blueprintData.skills}
          contentRef={(el) => (contentRefs.current["skills"] = el)}
        />
      )}

      {/* Cost */}
      {blueprintData.cost && (
        <Cost
          cost={blueprintData.cost}
          contentRef={(el) => (contentRefs.current["cost"] = el)}
        />
      )}

      {/* Extensions & References */}
      {(blueprintData.extensions || blueprintData.references) && (
        <ExtensionsAndReferences
          extensions={blueprintData.extensions}
          references={blueprintData.references}
        />
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <Button 
        variant="default" 
        className="w-full sm:w-auto mt-6" 
        onClick={handleProceedToBuildGuide}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Generating Build Guide...
          </>
        ) : (
          'Proceed to Build Guide'
        )}
      </Button>
    </>
  );
}
