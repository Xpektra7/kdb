import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { BlockDiagram } from "../block-diagram/block-diagram";
import AccordionList from "./AccordionList";
import ProblemsOverall from "./problems";
import Research from "./research";
import Subsystem from "./subsystem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavigationSidebar from "./NavigationSideBar";

export default function DecisionMatrix({ output }: { output: any }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    problems: true,
    components: true,
    skills: false,
    suggestions: false
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Build navigation structure from output data
  const buildNavStructure = () => {
    const nav: any[] = [
      { id: 'overview', label: 'Project Overview', level: 0 }
    ];

    if (output.research) {
      nav.push({ id: 'research', label: 'Research', level: 0 });
    }

    if (output.problems_overall) {
      nav.push({
        id: 'problems',
        label: 'Problems',
        level: 0,
        children: output.problems_overall.map((p: any, i: number) => ({
          id: `problem-${i}`,
          label: p.problem,
          level: 1
        }))
      });
    }

    if (output.decision_matrix) {
      nav.push({
        id: 'components',
        label: 'Components',
        level: 0,
        children: output.decision_matrix.map((m: any, i: number) => ({
          id: `component-${i}`,
          label: `${m.subsystem} System`,
          level: 1
        }))
      });
    }

    if (output.skills) {
      nav.push({ id: 'skills', label: 'Skills Required', level: 0 });
    }

    if (output.suggestions) {
      nav.push({ id: 'suggestions', label: 'Suggestions', level: 0 });
    }

    return nav;
  };

  const navStructure = buildNavStructure();

  const scrollToSection = (id: string) => {
    const element = contentRefs.current[id];
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Intersection Observer for active section highlighting
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
  }, [output]);

  return (
    <div className="flex min-h-screen bg-background">
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
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 p-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow z-10"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="w-full flex flex-col justify-center gap-8 p-8 max-w-5xl mx-auto">
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

          {/* Components */}
          <div ref={(el) => { contentRefs.current['components'] = el; }} className="scroll-mt-20">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="bg-transparent">
                  <h1 className="text-2xl">Components</h1>
                </AccordionTrigger>
                <AccordionContent>
                  {output.decision_matrix && (
                    <div className="flex flex-col border border-border rounded-lg p-4 gap-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Skills Required */}
          <div ref={(el) => { contentRefs.current['skills'] = el; }} className="scroll-mt-20">
            <AccordionList name="Skills Required" list={output.skills ? [output.skills] : []} />
          </div>

          {/* Suggestions */}
          <div ref={(el) => { contentRefs.current['suggestions'] = el; }} className="scroll-mt-20">
            <AccordionList name="Suggestions" list={output.suggestions || []} />
          </div>
        </div>
      </div>
      {
        output.research && (
          <Research research={output.research} />
        )
      }
      {
        output.problems_overall && (
          <ProblemsOverall problems={output.problems_overall} />
        )
      }
      <BlockDiagram data={output.blockDiagram || []} />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-transparent">
            <h1 className="text-2xl">Components</h1>
          </AccordionTrigger>
          <AccordionContent>
            {output.decision_matrix && (
              <div className="flex flex-col border border-border rounded-lg p-4 gap-4">
                {output.decision_matrix.map((matrix: any, index: number) => <Subsystem key={index} subsystem={matrix} />)}
              </div> )
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <AccordionList name="Skills Required" list={output.skills ? [output.skills] : []} />
      <AccordionList name="Suggestions" list={output.suggestions || []} />
    </div>
  );
}

