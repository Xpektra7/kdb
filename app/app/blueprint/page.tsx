"use client";
import { dummydata } from '@/schema/air-quality-result';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavigationSidebar from '@/components/decision-matrix/NavigationSideBar';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { getDataMode } from '@/lib/data-mode';
import type { Blueprint, NavItem } from '@/lib/definitions';
import BlueprintView from '@/components/blueprint/blueprint';

// Z-index scale for consistent layering
const Z_INDEX = {
  OVERLAY: 40,
  SIDEBAR: 50,
  HEADER: 30,
} as const;



export default function Page() {
  const router = useRouter();
  const [blueprintData, setBlueprintData] = useState<Blueprint | null>(null);
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
        setBlueprintData(dummydata as unknown as Blueprint);
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

  // Navigation configuration
  const NAV_CONFIG = [
    { 
      key: 'problem', 
      id: 'problem', 
      label: 'Problem Statement' 
    },
    {
      key: 'architecture',
      id: 'architecture',
      label: 'Architecture',
      children: [
        { id: 'arch-overview', label: 'Overview' },
        { id: 'block-diagram', label: 'Block Diagram' },
        { id: 'data-flow', label: 'Data Flow' }
      ]
    },
    {
      key: 'subsystems',
      id: 'subsystems',
      label: 'Subsystems',
      childrenFn: (data: any) => data.map((s: any, i: number) => ({
        id: `subsystem-${i}`,
        label: s.name
      }))
    },
    {
      key: 'components',
      id: 'components',
      label: 'Components',
      childrenFn: (data: any) => data.map((c: any, i: number) => ({
        id: `component-${i}`,
        label: `${c.subsystem} System`
      }))
    },
    { key: 'power_budget', id: 'power', label: 'Power Budget' },
    { key: 'execution_steps', id: 'execution', label: 'Execution Steps' },
    { key: 'testing', id: 'testing', label: 'Testing' },
    { key: 'failure_modes', id: 'failures', label: 'Failure Modes' },
    { key: 'data_model', id: 'data', label: 'Data Model' },
    { key: 'skills', id: 'skills', label: 'Skills Required' },
    { key: 'cost', id: 'cost', label: 'Cost Estimation' },
  ] as const;

  // Build navigation structure
  const buildNavStructure = () => {
    if (!blueprintData) return [];
    
    const nav: NavItem[] = [
      { id: 'overview', label: 'Project Overview', level: 0 }
    ];

    // Add sections from config
    NAV_CONFIG.forEach(item => {
      const value = blueprintData[item.key as keyof Blueprint];
      if (!value) return;

      let navItem: NavItem = {
        id: item.id,
        label: item.label,
        level: 0
      };

      // Handle static children
      if ('children' in item && item.children) {
        navItem.children = item.children.map(child => ({
          ...child,
          level: 1
        }));
      }
      // Handle dynamic children
      else if ('childrenFn' in item && item.childrenFn) {
        navItem.children = item.childrenFn(value).map((child: any) => ({
          ...child,
          level: 1
        }));
      }

      nav.push(navItem);
    });

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
      <main className={`transition-all duration-300 scroll-custom ${sidebarOpen ? 'md:ml-72 lg:ml-80' : ''}`}>
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
              <BlueprintView
                blueprintData={blueprintData}
                contentRefs={contentRefs}
                expandedSections={expandedSections}
                expandedItems={expandedItems}
                toggleSection={toggleSection}
                toggleItem={toggleItem}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}