"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import DecisionMatrix from "@/components/decision-matrix/decision-matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResultStore } from "@/components/providers/result-store";
import NavigationSidebar from "@/components/decision-matrix/NavigationSideBar";
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';


export default function Page() {
  const router = useRouter();
  const { result } = useResultStore();

  const hasResult = Boolean(result);
  const output = result as any;

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
    if (!output) return [];
    
    const nav: any[] = [
      { id: 'overview', label: 'Project Overview', level: 0 }
    ];

    if (output.research) {
      nav.push({ id: 'research', label: 'Research', level: 0 });
    }

    if (output.problems_overall) {
      nav.push({ id: 'problems', label: 'Problems', level: 0 });
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
    if (!output) return;
    
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
      {hasResult && (
        <NavigationSidebar
          navStructure={navStructure}
          activeSection={activeSection}
          expandedSections={expandedSections}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          scrollToSection={scrollToSection}
          toggleSection={toggleSection}
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${hasResult && sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Menu button when sidebar is closed */}
        {hasResult && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-4 p-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow z-10"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </button>
        )}

        <div className="max-w-5xl mx-auto px-8 py-6">
          {/* Header */}
          <div className="flex w-full justify-between items-center border-b border-border py-4 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Decision Matrix</h1>
              <Badge className="text-muted-foreground" variant="secondary">Latest generated result</Badge>
            </div>
            <Button variant="outline" size="sm" className="px-6" onClick={() => router.push("/app")}>Back</Button>
          </div>

          {/* Content */}
          {!hasResult ? (
            <div className="flex flex-col gap-2 rounded-lg border border-border p-8 text-center">
              <p className="text-lg font-semibold text-foreground">No data available</p>
              <p className="text-muted-foreground">Generate a matrix first, then you&apos;ll see it here.</p>
              <div className="flex justify-center">
                <Button onClick={() => router.push("/app")}>Start a new matrix</Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-auto flex flex-col gap-4">
              <p className="max-w-2xl text-muted-foreground">
                Analyze and compare different options based on multiple criteria to make informed decisions.
              </p>
              <DecisionMatrix output={output} contentRefs={contentRefs} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
