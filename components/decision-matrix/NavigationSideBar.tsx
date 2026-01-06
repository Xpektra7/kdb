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
  navStructure,
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
    
    // Components section is always expanded and not collapsible
    const showChildren = isComponentsSection ? true : (hasChildren && isExpanded);
    const canCollapse = hasChildren && !isComponentsSection;

    return (
      <div className={isChild ? 'ml-3 border-l border-border' : ''}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
            isActive 
              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-[1px]' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          } ${isChild ? 'ml-3 text-sm' : 'text-sm font-medium'}`}
          onClick={() => {
            if (canCollapse) {
              toggleSection(item.id);
            }
            scrollToSection(item.id);
          }}
        >
          {canCollapse && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(item.id);
              }}
              className="p-0.5 rounded hover:bg-accent transition-colors"
            >
              {isExpanded ? <HugeiconsIcon icon={ArrowDown01Icon} size={14} /> : <HugeiconsIcon icon={ArrowRight01Icon} size={14} />}
            </button>
          )}
          {isComponentsSection && hasChildren && (
            <span className="p-0.5 text-muted-foreground">
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
    <div
      className={`${
        sidebarOpen ? 'w-72' : 'w-0'
      } transition-all duration-300 bg-background border-r border-border overflow-hidden flex flex-col fixed h-screen z-20`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Book02Icon} size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground tracking-tight">Contents</h2>
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navStructure.map(item => (
            <NavItemComponent key={item.id} item={item} />
          ))}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-border text-xs text-muted-foreground">
        <p>Scroll to navigate sections</p>
      </div>
    </div>
  );
}