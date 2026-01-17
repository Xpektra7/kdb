// Centralized shared TypeScript types found in the codebase
import type { MutableRefObject, ReactNode } from 'react';

// Navigation
export interface NavItem {
  id: string;
  label: string;
  level: number;
  children?: NavItem[];
}

export interface NavigationSidebarProps {
  navStructure: NavItem[];
  activeSection: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  scrollToSection: (id: string) => void;
}

// Block Diagram
export interface BlockData {
  block: string;
  from?: string | string[] | null;
  to?: string | string[] | null;
}

export interface Edge {
  from: string;
  to: string;
  id: string;
}

export interface BlockDiagramProps {
  data: BlockData[];
  className?: string;
}

// Blueprint page and components
export interface Blueprint {
  project: string;
  problem: { statement: string; constraints: string[] };
  architecture: { overview: string; block_diagram: string[] };
  components: { subsystem: string; chosen_option: string; why_chosen: string; pros: string[]; cons: string[] }[];
  execution_steps: string[];
  testing: { methods: string[]; success_criteria: string };
  references: string[];
  extensions: string[];
  cost: string;
  skills: string;
}

export interface BlockDiagramItem {
  block: string;
  from?: string[];
  to?: string[];
}

export interface ArchitectureProps {
  overview: string;
  blockDiagram: BlockDiagramItem[] | string[];
  dataFlow?: string;
  isExpanded: boolean;
  onToggle: () => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface Component {
  subsystem: string;
  chosen_option: string;
  why_chosen: string;
  features?: string[];
  pros: string[];
  cons: string[];
  alternatives_considered?: string[];
  availability?: string;
  estimated_cost?: string;
}

export interface ComponentsProps {
  components: Component[];
  isExpanded: boolean;
  onToggle: () => void;
  expandedItems: Record<string, boolean>;
  onItemToggle: (id: string) => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface FailureMode {
  issue: string;
  mitigation: string;
}

export interface FailureModesProps {
  failureModes: FailureMode[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface ExtensionsAndReferencesProps {
  extensions?: string[];
  references?: string[];
}

export interface CostProps {
  cost: string;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface DataModel {
  sample_payload: Record<string, any>;
}

export interface DataModelProps {
  dataModel: DataModel;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface SubsystemInterface {
  type: string;
  voltage: string;
  notes: string;
}

export interface Subsystem {
  name: string;
  role: string;
  interfaces: SubsystemInterface[];
}

export interface SubsystemsProps {
  subsystems: Subsystem[];
  isExpanded: boolean;
  onToggle: () => void;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface Testing {
  methods: string[];
  success_criteria: string;
}

export interface TestingProps {
  testing: Testing;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface ProblemStatementProps {
  statement: string;
  constraints: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface PowerBudget {
  source: string;
  active_current: string;
  sleep_current: string;
  runtime_estimate: string;
}

export interface PowerBudgetProps {
  powerBudget: PowerBudget;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface ComponentCardProps {
  component: Component;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface ExecutionStepsProps {
  steps: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export interface SkillsProps {
  skills: string[] | string;
  contentRef?: (el: HTMLDivElement | null) => void;
}

// Decision matrix
export interface DecisionMatrixProps {
  output: any;
  contentRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export interface SubsystemProps {
  subsystem: any;
  onOptionSelect?: (selectedOption: any) => void;
  selectedOption?: any;
  showError?: boolean;
}

// Providers
export interface ResultContextValue {
  result: unknown;
  setResult: (value: unknown) => void;
}

// App page
export interface User {
  name: string;
  email: string;
}

export interface Error {
  title?: string;
  message?: string;
}
