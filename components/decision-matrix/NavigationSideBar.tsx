import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Cancel01Icon, Book02Icon } from '@hugeicons/core-free-icons';

interface NavItem {
  id: string;
  label: string;
  level: number;
  children?: NavItem[];
}

interface NavigationSidebarProps {
  navStructure: NavItem[];
  activeSection: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  scrollToSection: (id: string) => void;
}

export default function NavigationSidebar({
  navStructure = [],
  activeSection,
  sidebarOpen,
  setSidebarOpen,
  scrollToSection
}: NavigationSidebarProps) {

  const NavItemComponent = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeSection === item.id;
    const showChildren = hasChildren; // Always render children when present

    const handleClick = () => {
      requestAnimationFrame(() => {
        scrollToSection(item.id);
      });
    };

    return (
      <div className={isChild ? 'ml-2 sm:ml-3 text-sm md:ml-4 border-l-2 border-border' : ''}>
        <div
          className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-colors ${isActive
            ? 'text-accent font-medium bg-muted/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            } ${isChild ? 'ml-2 sm:ml-3 text-xs sm:text-sm' : 'text-sm sm:text-base font-medium'}`}
          onClick={handleClick}
        >
          {hasChildren && (
            <span className="p-0.5 text-muted-foreground shrink-0">
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
            </span>
          )}
          <span className="truncate text-sm font-medium">
            {item.label}
          </span>
        </div>
        {showChildren && hasChildren && (
          <div className="mt-1 space-y-1">
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
        
        fixed inset-y-0 text-sm left-0 w-64 sm:w-72 max-w-[85vw]
        bg-background border-r border-border
        z-50
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        shadow-xl
      `}
    >
      <div className="w-64 sm:w-72 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Book02Icon} size={18} className="text-foreground shrink-0" />
            <h2 className="font-bold text-sm sm:text-base text-foreground tracking-tight">Contents</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="bg-transparent hover:bg-muted p-2 rounded-lg transition-colors shrink-0"
            aria-label="Close navigation"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} className="sm:w-4.5 sm:h-4.5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 text-sm overflow-y-auto py-4 sm:py-5 md:py-6 px-3 sm:px-4">
          <nav className="space-y-1.5">
            {navStructure && navStructure.length > 0 ? (
              navStructure.map(item => (
                <NavItemComponent key={item.id} item={item} />
              ))
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground p-3">No sections available</p>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border text-xs text-muted-foreground shrink-0 bg-muted/30">
          <p className="hidden sm:block">Scroll to navigate sections</p>
          <p className="sm:hidden">Tap to navigate</p>
        </div>
      </div>
    </aside>
  );
}