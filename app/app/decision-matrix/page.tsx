"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import DecisionMatrix from "@/components/decision-matrix/decision-matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResultStore } from "@/components/providers/result-store";
import NavigationSidebar from "@/components/decision-matrix/NavigationSideBar";
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';


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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
      // Dynamic offset based on screen size
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

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="flex min-h-screen bg-background">
      {/* Overlay for mobile when sidebar is open */}
      {hasResult && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
      <main className="flex-1 transition-all duration-300">
        {/* Menu button */}
        {hasResult && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 sm:top-4 sm:left-4 p-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow z-30"
            aria-label="Open navigation menu"
          >
            <HugeiconsIcon icon={Menu01Icon} size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
        )}


        <div className="w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center border-b border-border py-2 sm:py-3 md:py-4 mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Decision Matrix</h1>
              <Badge className="text-xs sm:text-sm text-muted-foreground" variant="secondary">
                Latest generated result
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3 sm:px-4 md:px-6 w-full sm:w-auto text-xs sm:text-sm" 
              onClick={() => router.push("/app")}
            >
              Back
            </Button>
          </div>

          {/* Content */}
          {!hasResult ? (
            <div className="flex flex-col gap-2 sm:gap-3 rounded-lg border border-border p-4 sm:p-6 md:p-8 text-center">
              <p className="text-base sm:text-lg font-semibold text-foreground">No data available</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Generate a matrix first, then you&apos;ll see it here.
              </p>
              <div className="flex justify-center mt-2 sm:mt-3">
                <Button onClick={() => router.push("/app")} className="w-full sm:w-auto text-xs sm:text-sm">
                  Start a new matrix
                </Button>
              </div>
            </div>
          ) : output ? (
            <div className="w-full h-auto flex flex-col gap-2 sm:gap-3 md:gap-4">
              <p className="max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground">
                Analyze and compare different options based on multiple criteria to make informed decisions.
              </p>
              <DecisionMatrix output={output} contentRefs={contentRefs} />
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:p-6 md:p-8 text-center">
              <p className="text-base sm:text-lg font-semibold text-foreground">Loading...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}