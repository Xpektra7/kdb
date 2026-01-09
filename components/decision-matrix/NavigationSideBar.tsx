import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon, Cancel01Icon, Book02Icon } from '@hugeicons/core-free-icons';

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

export default function NavigationSidebar({
  navStructure = [],
  activeSection,
  expandedSections,
  sidebarOpen,
  setSidebarOpen,
  scrollToSection,
  toggleSection
}: NavigationSidebarProps) {

  const NavItemComponent = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.id];
    const isActive = activeSection === item.id;
    const isComponentsSection = item.id === 'components';

    const showChildren = isComponentsSection ? true : (hasChildren && isExpanded);
    const canCollapse = hasChildren && !isComponentsSection;

    const handleClick = () => {
      if (canCollapse) {
        toggleSection(item.id);
      }
      requestAnimationFrame(() => {
        scrollToSection(item.id);
      });
    };

    return (
      <div className={isChild ? 'ml-2 sm:ml-3 md:ml-4 border-l border-border' : ''}>
        <div
          className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${isActive
            ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-px'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            } ${isChild ? 'ml-2 sm:ml-3 text-xs sm:text-sm' : 'text-sm sm:text-base font-medium'}`}
          onClick={handleClick}
        >
          {canCollapse && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(item.id);
              }}
              className="p-0.5 rounded hover:bg-accent transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
            >
              {isExpanded ? <HugeiconsIcon icon={ArrowDown01Icon} size={14} /> : <HugeiconsIcon icon={ArrowRight01Icon} size={14} />}
            </button>
          )}

          {isComponentsSection && hasChildren && (
            <span className="p-0.5 text-muted-foreground shrink-0">
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
            </span>
          )}
          <span className={`truncate ${!hasChildren && isChild ? 'ml-1' : ''}`}>
            {item.label}
          </span>
        </div>
        {showChildren && hasChildren && (
          <div className="mt-1 space-y-0.5">
            {item.children?.map(child => (
              <NavItemComponent key={child.id} item={child} isChild />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`
        sm:p-3 md:p-4
        fixed inset-y-0 left-0 w-64 sm:w-72 max-w-[85vw]
        bg-background border-r border-border
        z-50
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        shadow-lg
      `}
    >
      <div className="w-64 sm:w-72 flex flex-col h-full">
        {/* Header */}
        <div className="p-3 sm:p-3.5 md:p-4 border-b border-border flex items-center justify-between bg-card/50 shrink-0">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Book02Icon} size={16} className="text-primary shrink-0 sm:w-[18px] sm:h-[18px]" />
            <h2 className="font-semibold text-xs sm:text-sm text-foreground tracking-tight">Contents</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="bg-transparent hover:bg-accent p-1.5 sm:p-2 rounded-lg transition-colors shrink-0"
            aria-label="Close navigation"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} className="sm:w-[16px] sm:h-[16px]" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-3.5 md:py-4 px-2 sm:px-3">
          <nav className="space-y-1">
            {navStructure && navStructure.length > 0 ? (
              navStructure.map(item => (
                <NavItemComponent key={item.id} item={item} />
              ))
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
  );
}