"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationSidebar from "@/components/decision-matrix/navigation-sidebar";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import BlueprintView from "@/components/blueprint/blueprint";
import { buildBlueprintNav } from "@/lib/navigation";
import type { Blueprint, NavItem } from "@/lib/definitions";
import { ExportButton } from "@/components/pdf-export/ExportButton";
import type { PDFExportData } from "@/lib/pdfGenerator";

const Z_INDEX = {
  OVERLAY: 40,
  SIDEBAR: 50,
  HEADER: 30,
} as const;

interface BlueprintClientProps {
  blueprintData: Blueprint;
}

export default function BlueprintClient({ blueprintData }: BlueprintClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: true,
    subsystems: true,
    components: true,
  });
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const navStructure: NavItem[] = useMemo(() => buildBlueprintNav(blueprintData), [blueprintData]);

  const scrollToSection = (id: string) => {
    const element = contentRefs.current[id];
    if (!element) return;

    const offset = window.innerWidth < 640 ? 60 : 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    setActiveSection(id);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Highlight active section while scrolling
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const options = { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 };

    Object.keys(contentRefs.current).forEach((key) => {
      const element = contentRefs.current[key];
      if (!element) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(key);
        });
      }, options);

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  // Auto-toggle sidebar on resize
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pdfData: PDFExportData = {
    title: "Blueprint Report",
    projectName: "System Blueprint",
    blueprint: JSON.stringify(blueprintData, null, 2),
  };

  return (
    <div className="min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ zIndex: Z_INDEX.OVERLAY }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <NavigationSidebar
        navStructure={navStructure}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        scrollToSection={scrollToSection}
      />

      <main className={`transition-all duration-300 scroll-custom ${sidebarOpen ? "md:ml-72 lg:ml-80" : ""}`}>
        <div className="flex flex-col max-w-6xl mx-auto w-full px-4 py-4 gap-8">
          <div
            className="fixed top-0 left-0 right-0 md:relative flex w-full justify-between border-b border-border p-4 md:p-6 bg-background/95 backdrop-blur-sm md:px-0"
            style={{ zIndex: Z_INDEX.HEADER }}
          >
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
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {blueprintData && pdfData && (
                <ExportButton data={pdfData} buttonText="Export PDF" fileName="blueprint-report.pdf" />
              )}
              <Button variant="outline" size="lg" className="py-2 h-fit" onClick={() => router.back()}>Back</Button>
            </div>
          </div>

          <div className="w-full h-auto flex flex-col gap-6 mt-20 md:mt-8">
            <BlueprintView
              blueprintData={blueprintData}
              contentRefs={contentRefs}
              expandedSections={expandedSections}
              expandedItems={expandedItems}
              toggleSection={toggleSection}
              toggleItem={toggleItem}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
