import { ChevronDown, ChevronRight, X } from 'lucide-react';

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

    return (
      <div className={isChild ? 'ml-2' : ''}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
            isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-accent'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            }
            scrollToSection(item.id);
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(item.id);
              }}
              className="p-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span className={`text-sm ${!hasChildren && isChild ? 'ml-6' : ''}`}>
            {item.label}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
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
        sidebarOpen ? 'w-80' : 'w-0'
      } transition-all duration-300 bg-card border-r border-border overflow-hidden flex flex-col fixed h-screen z-20`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg">Navigation</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 hover:bg-accent rounded"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {navStructure.map(item => (
          <NavItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}