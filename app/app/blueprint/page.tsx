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
import { ExtensionsAndReferences } from '@/components/blueprint/ExtensionAndRef';
import NavigationSidebar from '@/components/decision-matrix/NavigationSideBar';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';

// Z-index scale for consistent layering
const Z_INDEX = {
  OVERLAY: 40,
  SIDEBAR: 50,
  HEADER: 30,
} as const;


export default function Page() {
  const router = useRouter();
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

  // Build navigation structure
  const buildNavStructure = () => {
    const nav: any[] = [
      { id: 'overview', label: 'Project Overview', level: 0 }
    ];

    if (dummydata.problem) {
      nav.push({ id: 'problem', label: 'Problem Statement', level: 0 });
    }

    if (dummydata.architecture) {
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

    if (dummydata.subsystems) {
      nav.push({
        id: 'subsystems',
        label: 'Subsystems',
        level: 0,
        children: dummydata.subsystems.map((s: any, i: number) => ({
          id: `subsystem-${i}`,
          label: s.name,
          level: 1
        }))
      });
    }

    if (dummydata.components) {
      nav.push({
        id: 'components',
        label: 'Components',
        level: 0,
        children: dummydata.components.map((c: any, i: number) => ({
          id: `component-${i}`,
          label: `${c.subsystem} System`,
          level: 1
        }))
      });
    }

    if (dummydata.power_budget) {
      nav.push({ id: 'power', label: 'Power Budget', level: 0 });
    }

    if (dummydata.execution_steps) {
      nav.push({ id: 'execution', label: 'Execution Steps', level: 0 });
    }

    if (dummydata.testing) {
      nav.push({ id: 'testing', label: 'Testing', level: 0 });
    }

    if (dummydata.failure_modes) {
      nav.push({ id: 'failures', label: 'Failure Modes', level: 0 });
    }

    if (dummydata.data_model) {
      nav.push({ id: 'data', label: 'Data Model', level: 0 });
    }

    if (dummydata.skills) {
      nav.push({ id: 'skills', label: 'Skills Required', level: 0 });
    }

    if (dummydata.extensions || dummydata.references) {
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
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Blueprint</h1>
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
            <div className="bg-muted/30 p-4 rounded-lg border-l-2 border-border">
              <p className="text-sm leading-relaxed">
                Comprehensive project blueprint with architecture, components, and execution plan.
              </p>
            </div>

            {/* Project Header */}
            <div className="bg-background rounded-lg shadow-sm border border-border p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 wrap-break-words">
                {dummydata.project}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Blueprint</p>
            </div>

            {/* Problem Statement */}
            <ProblemStatement
              statement={dummydata.problem.statement}
              constraints={dummydata.problem.constraints}
              contentRef={(el) => (contentRefs.current['problem'] = el)}
            />

            {/* Architecture */}
            <Architecture
              overview={dummydata.architecture.overview}
              blockDiagram={dummydata.architecture.block_diagram}
              dataFlow={dummydata.architecture.data_flow}
              isExpanded={expandedSections.architecture}
              onToggle={() => toggleSection('architecture')}
              contentRef={(el) => (contentRefs.current['architecture'] = el)}
            />

            {/* Subsystems */}
            <Subsystems
              subsystems={dummydata.subsystems}
              isExpanded={expandedSections.subsystems}
              onToggle={() => toggleSection('subsystems')}
              contentRef={(el) => (contentRefs.current['subsystems'] = el)}
            />

            {/* Components */}
            <Components
              components={dummydata.components}
              isExpanded={expandedSections.components}
              onToggle={() => toggleSection('components')}
              expandedItems={expandedItems}
              onItemToggle={toggleItem}
              contentRef={(el) => (contentRefs.current['components'] = el)}
            />

            {/* Power Budget */}
            <PowerBudget
              powerBudget={dummydata.power_budget}
              contentRef={(el) => (contentRefs.current['power'] = el)}
            />

            {/* Execution Steps */}
            <ExecutionSteps
              steps={dummydata.execution_steps}
              contentRef={(el) => (contentRefs.current['execution'] = el)}
            />

            {/* Testing */}
            <Testing
              testing={dummydata.testing}
              contentRef={(el) => (contentRefs.current['testing'] = el)}
            />

            {/* Failure Modes */}
            <FailureModes
              failureModes={dummydata.failure_modes}
              contentRef={(el) => (contentRefs.current['failures'] = el)}
            />

            {/* Data Model */}
            <DataModel
              dataModel={dummydata.data_model}
              contentRef={(el) => (contentRefs.current['data'] = el)}
            />

            {/* Skills */}
            <Skills
              skills={dummydata.skills}
              contentRef={(el) => (contentRefs.current['skills'] = el)}
            />

            {/* Extensions & References */}
            <ExtensionsAndReferences
              extensions={dummydata.extensions}
              references={dummydata.references}
            />
          </div>
        </div>
      </main>
    </div>
  );
}