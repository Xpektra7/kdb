"use client";
import dummydata from '@/schema/air-quality-result.json';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import NavigationSidebar from '@/components/decision-matrix/NavigationSideBar';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { getDataMode } from '@/lib/data-mode';

// Z-index scale for consistent layering
const Z_INDEX = {
  OVERLAY: 40,
  SIDEBAR: 50,
  HEADER: 30,
} as const;


export default function Page() {
  const router = useRouter();
  const [blueprintData, setBlueprintData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: true,
    subsystems: true,
    components: true
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768;
  });
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load blueprint data from sessionStorage or use dummy data
  useEffect(() => {
    try {
      const useDummyData = getDataMode();
      
      if (useDummyData) {
        // Use dummy data when toggle is enabled
        setBlueprintData(dummydata);
        setIsLoading(false);
        setError(null);
        return;
      }
      
      const storedData = sessionStorage.getItem('blueprintData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setBlueprintData(parsed);
        setError(null);
        sessionStorage.removeItem('blueprintData');
      } else {
        // Show error if no API data and not using dummy data
        setError('No blueprint data available. Please generate from the decision matrix.');
        setBlueprintData(null);
      }
    } catch (err) {
      console.error('Error loading blueprint data:', err);
      setError(`Failed to parse blueprint data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setBlueprintData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Build navigation structure
  const buildNavStructure = () => {
    if (!blueprintData) return [];
    
    const nav: any[] = [
      { id: 'overview', label: 'Project Overview', level: 0 }
    ];

    if (blueprintData.problem) {
      nav.push({ id: 'problem', label: 'Problem Statement', level: 0 });
    }

    if (blueprintData.architecture) {
      nav.push({
        id: 'architecture',
        label: 'Architecture',
        level: 0,
        children: [
          { id: 'arch-overview', label: 'Overview', level: 1 },
          { id: 'block-diagram', label: 'Block Diagram', level: 1 },
          { id: 'data-flow', label: 'Data Flow', level: 1 }
        ]
      });
    }

    if (blueprintData.subsystems) {
      nav.push({
        id: 'subsystems',
        label: 'Subsystems',
        level: 0,
        children: blueprintData.subsystems.map((s: any, i: number) => ({
          id: `subsystem-${i}`,
          label: s.name,
          level: 1
        }))
      });
    }

    if (blueprintData.components) {
      nav.push({
        id: 'components',
        label: 'Components',
        level: 0,
        children: blueprintData.components.map((c: any, i: number) => ({
          id: `component-${i}`,
          label: `${c.subsystem} System`,
          level: 1
        }))
      });
    }

    if (blueprintData.power_budget) {
      nav.push({ id: 'power', label: 'Power Budget', level: 0 });
    }

    if (blueprintData.execution_steps) {
      nav.push({ id: 'execution', label: 'Execution Steps', level: 0 });
    }

    if (blueprintData.testing) {
      nav.push({ id: 'testing', label: 'Testing', level: 0 });
    }

    if (blueprintData.failure_modes) {
      nav.push({ id: 'failures', label: 'Failure Modes', level: 0 });
    }

    if (blueprintData.data_model) {
      nav.push({ id: 'data', label: 'Data Model', level: 0 });
    }

    if (blueprintData.skills) {
      nav.push({ id: 'skills', label: 'Skills Required', level: 0 });
    }

    if (blueprintData.cost) {
      nav.push({ id: 'cost', label: 'Cost Estimation', level: 0 });
    }

    if (blueprintData.extensions || blueprintData.references) {
      nav.push({ id: 'extras', label: 'Extensions & References', level: 0 });
    }

    return nav;
  };

  const navStructure = buildNavStructure();

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = contentRefs.current[id];
    if (element) {
      const offset = window.innerWidth < 640 ? 60 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);

      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  // Toggle section expansion
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle item expansion
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Intersection observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    Object.keys(contentRefs.current).forEach(key => {
      const element = contentRefs.current[key];
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(key);
          }
        });
      }, options);

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  // Handle sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ zIndex: Z_INDEX.OVERLAY }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <NavigationSidebar
        navStructure={navStructure}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        scrollToSection={scrollToSection}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-72 lg:ml-80' : ''}`}>
        <div className="flex flex-col max-w-6xl mx-auto w-full px-4 py-4 gap-8">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 md:relative flex w-full justify-between border-b border-border p-4 md:p-6 bg-background/95 backdrop-blur-sm md:px-0" style={{ zIndex: Z_INDEX.HEADER }}>
            <div className="flex gap-3 items-center">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 bg-muted border border-border rounded-lg hover:bg-muted/70 transition-colors"
                  aria-label="Open navigation menu"
                >
                  <HugeiconsIcon icon={Menu01Icon} size={16} className="sm:w-4.5 sm:h-4.5" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Blueprint</h1>
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="px-4"
              onClick={() => router.push('/app')}
            >
              Back
            </Button>
          </div>

          {/* Content */}
          <div className="w-full h-auto flex flex-col gap-6 mt-20 md:mt-8">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading blueprint...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col gap-4">
                <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Blueprint</h2>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/app')}
                    >
                      Go Back
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/app/decision-matrix')}
                    >
                      Back to Decision Matrix
                    </Button>
                  </div>
                </div>
              </div>
            ) : blueprintData ? (
              <>
                <div className="bg-muted/30 p-4 rounded-lg border-l-2 border-border">
                  <p className="text-sm leading-relaxed">
                    Comprehensive project blueprint with architecture, components, and execution plan.
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
                    contentRef={(el) => (contentRefs.current['problem'] = el)}
                  />
                )}

                {/* Architecture */}
                {blueprintData.architecture && (
                  <Architecture
                    overview={blueprintData.architecture.overview}
                    blockDiagram={blueprintData.architecture.block_diagram}
                    dataFlow={blueprintData.architecture.data_flow}
                    isExpanded={expandedSections.architecture}
                    onToggle={() => toggleSection('architecture')}
                    contentRef={(el) => (contentRefs.current['architecture'] = el)}
                  />
                )}

                {/* Subsystems */}
                {blueprintData.subsystems && (
                  <Subsystems
                    subsystems={blueprintData.subsystems}
                    isExpanded={expandedSections.subsystems}
                    onToggle={() => toggleSection('subsystems')}
                    contentRef={(el) => (contentRefs.current['subsystems'] = el)}
                  />
                )}

                {/* Components */}
                {blueprintData.components && (
                  <Components
                    components={blueprintData.components}
                    isExpanded={expandedSections.components}
                    onToggle={() => toggleSection('components')}
                    expandedItems={expandedItems}
                    onItemToggle={toggleItem}
                    contentRef={(el) => (contentRefs.current['components'] = el)}
                  />
                )}

                {/* Power Budget */}
                {blueprintData.power_budget && (
                  <PowerBudget
                    powerBudget={blueprintData.power_budget}
                    contentRef={(el) => (contentRefs.current['power'] = el)}
                  />
                )}

                {/* Execution Steps */}
                {blueprintData.execution_steps && (
                  <ExecutionSteps
                    steps={blueprintData.execution_steps}
                    contentRef={(el) => (contentRefs.current['execution'] = el)}
                  />
                )}

                {/* Testing */}
                {blueprintData.testing && (
                  <Testing
                    testing={blueprintData.testing}
                    contentRef={(el) => (contentRefs.current['testing'] = el)}
                  />
                )}

                {/* Failure Modes */}
                {blueprintData.failure_modes && (
                  <FailureModes
                    failureModes={blueprintData.failure_modes}
                    contentRef={(el) => (contentRefs.current['failures'] = el)}
                  />
                )}

                {/* Data Model */}
                {blueprintData.data_model && (
                  <DataModel
                    dataModel={blueprintData.data_model}
                    contentRef={(el) => (contentRefs.current['data'] = el)}
                  />
                )}

                {/* Skills */}
                {blueprintData.skills && (
                  <Skills
                    skills={blueprintData.skills}
                    contentRef={(el) => (contentRefs.current['skills'] = el)}
                  />
                )}

                {/* Cost */}
                {blueprintData.cost && (
                  <Cost
                    cost={blueprintData.cost}
                    contentRef={(el) => (contentRefs.current['cost'] = el)}
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
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}