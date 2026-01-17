import { ProblemStatement } from '@/components/blueprint/problems';
import { Architecture } from '@/components/blueprint/Architecture';
import { Subsystems } from '@/components/blueprint/subSystem';
import { Components } from '@/components/blueprint/component';
import { PowerBudget } from '@/components/blueprint/PowerBudget';
import { ExecutionSteps } from '@/components/blueprint/ExecutionStep';
import { Testing } from '@/components/blueprint/Testing';
import { FailureModes } from '@/components/blueprint/FailureModes';
import { DataModel } from '@/components/blueprint/DataModel';
import { Skills } from '@/components/blueprint/Skills';
import { Cost } from '@/components/blueprint/Cost';
import { ExtensionsAndReferences } from '@/components/blueprint/ExtensionAndRef';


interface BlueprintProps {
  blueprintData: any;
  contentRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  expandedSections: Record<string, boolean>;
  expandedItems: Record<string, boolean>;
  toggleSection: (id: string) => void;
  toggleItem: (id: string) => void;
}

export default function Blueprint({
  blueprintData,
  contentRefs,
  expandedSections,
  expandedItems,
  toggleSection,
  toggleItem,
}: BlueprintProps) {
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

      {/* Subsystems */}
      {blueprintData.subsystems && (
        <Subsystems
          subsystems={blueprintData.subsystems}
          isExpanded={expandedSections.subsystems}
          onToggle={() => toggleSection("subsystems")}
          contentRef={(el) => (contentRefs.current["subsystems"] = el)}
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

      {/* Power Budget */}
      {blueprintData.power_budget && (
        <PowerBudget
          powerBudget={blueprintData.power_budget}
          contentRef={(el) => (contentRefs.current["power"] = el)}
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
      {blueprintData.failure_modes && (
        <FailureModes
          failureModes={blueprintData.failure_modes}
          contentRef={(el) => (contentRefs.current["failures"] = el)}
        />
      )}

      {/* Data Model */}
      {blueprintData.data_model && (
        <DataModel
          dataModel={blueprintData.data_model}
          contentRef={(el) => (contentRefs.current["data"] = el)}
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
    </>
  );
}
