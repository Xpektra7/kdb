"use client";
import dummydata from '@/schema/air-quality-result.json';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloHeader } from '@/components/blueprint/blueprint-ui';
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
import { NavigationSidebar } from '@/components/blueprint/NavigationalSideBar';
import { Button } from '@/components/ui/button';


export default function Page() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: true,
    subsystems: true,
    components: true
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className={`flex w-full min-h-screen bg-black ${sidebarOpen ? 'md:pl-80' : ''}`}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <NavigationSidebar
        navStructure={navStructure}
        activeSection={activeSection}
        expandedSections={expandedSections}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        scrollToSection={scrollToSection}
        toggleSection={toggleSection}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
          {/* Fixed Header */}
          <div className="sticky top-0 z-30 bg-black pb-4 flex justify-between items-center border-b border-black/10">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Blueprint</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/app')}
            >
              Back
            </Button>
          </div>

          {/* Header */}
          <ApolloHeader
            projectName={dummydata.project}
          />

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
      </main>
    </div>
  );
}