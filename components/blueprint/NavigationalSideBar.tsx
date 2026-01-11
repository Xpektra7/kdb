import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  level: number;
  children?: NavItem[];
}

interface NavigationSidebarProps {
  navStructure: NavItem[];
  activeSection: string;
  expandedSections: Record<string, boolean>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  scrollToSection: (id: string) => void;
  toggleSection: (id: string) => void;
}

export function NavigationSidebar({
  navStructure = [],
  activeSection,
  expandedSections,
  sidebarOpen,
  setSidebarOpen,
  scrollToSection,
  toggleSection
}: NavigationSidebarProps) {
  const renderNavItem = (item: NavItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.id];
    const isActive = activeSection === item.id;

    const handleClick = () => {
      if (hasChildren) {
        toggleSection(item.id);
      }
      requestAnimationFrame(() => {
        scrollToSection(item.id);
      });
    };

    return (
      <div key={item.id} className={isChild ? 'ml-2 sm:ml-3 md:ml-4 border-l border-border' : ''}>
        <div
          className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${isActive
            ? 'font-medium border-l-2 border-primary -ml-px'
            : ''
            } ${isChild ? 'ml-2 sm:ml-3 text-xs sm:text-sm' : 'text-sm sm:text-base font-medium'}`}
          onClick={handleClick}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(item.id);
              }}
              className="p-0.5 rounded transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}

          <button onClick={() => scrollToSection(item.id)} className="flex-1 text-left truncate bg-transparent">
            {item.label}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.children!.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-lg shadow-sm md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 sm:w-72 max-w-[85vw] bg-background border-r border-border z-50 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-lg`}
      >
        <div className="w-64 sm:w-72 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-sm text-foreground">Navigation</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 sm:p-2 rounded-lg transition-colors shrink-0"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-3 sm:py-3.5 md:py-4 px-2 sm:px-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
            <style dangerouslySetInnerHTML={{__html: `
              .scrollbar-thin::-webkit-scrollbar {
                width: 6px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: transparent;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #9ca3af;
                border-radius: 3px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #6b7280;
              }
              .scrollbar-thin {
                scrollbar-width: thin;
                scrollbar-color: #9ca3af transparent;
              }
            `}} />
            <nav className="space-y-1">
              {navStructure && navStructure.length > 0 ? (
                navStructure.map((item) => renderNavItem(item))
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground p-2 sm:p-3">No sections available</p>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-2 sm:p-2.5 border-t border-border text-xs text-muted-foreground shrink-0">
            <p className="hidden sm:block">Scroll to navigate sections</p>
            <p className="sm:hidden">Tap to navigate</p>
          </div>
        </div>
      </aside>
    </>
  );
}