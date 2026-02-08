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
  matrix: DecisionMatrixOutput;
  className?: string;
}

// Blueprint page and components
export interface Blueprint {
  project: string;
  problem: { statement: string; constraints: string[] };
  architecture: { overview: string; block_diagram: string[]; data_flow?: string;};
  components: { subsystem: string; chosen_option: string; why_chosen: string; pros: string[]; cons: string[] }[];
  execution_steps: string[];
  testing: { methods: string[]; success_criteria: string ; failure_modes?: {issue: string; mitigation: string}[] };
  references: string[];
  extensions: string[];
  cost: string;
  skills: string;
}

export interface BlockDiagramItem {
  block: string;
  from?: string | string[] | null;
  to?: string | string[] | null;
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
export interface DecisionMatrixOption {
  name: string;
  why_it_works: string;
  pros: string[];
  cons: string[];
}

export interface DecisionMatrixItem {
  subsystem: string;
  from?: string | string[] | null;
  to?: string | string[] | null;
  options: DecisionMatrixOption[];
}

export interface Problem {
  problem: string;
  suggested_solution: string;
}

export interface DecisionMatrixOutput {
  project: string;
  concept: string;
  research: string[]; // Updated to array of objects with title and url
  goals?: string[]; // New field for project goals
  problems_overall: Problem[];
  subsystems: DecisionMatrixItem[];
  cost: string;
  skills: string;
}

export interface DecisionMatrixProps {
  output: DecisionMatrixOutput;
  contentRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export interface SubsystemProps {
  subsystem: DecisionMatrixItem;
  onOptionSelect?: (selectedOption: DecisionMatrixOption) => void;
  selectedOption?: DecisionMatrixOption;
  showError?: boolean;
}

// Build Guide
export interface BuildGuidePrerequisites {
  tools: string[];
  materials: string[];
}

export interface BuildGuideWiring {
  description: string;
  connections: string[];
}

export interface BuildGuideFirmware {
  language: string;
  structure: string[];
  key_logic: string[];
}

export interface BuildGuideTesting {
  unit: string[];
  integration: string[];
  acceptance: string[];
}

export interface BuildGuideFailure {
  issue: string;
  cause: string;
  fix: string;
}

export interface BuildGuide {
  project: string;
  build_overview: string;
  prerequisites: BuildGuidePrerequisites;
  wiring: BuildGuideWiring;
  firmware: BuildGuideFirmware;
  calibration: string[];
  testing: BuildGuideTesting;
  common_failures: BuildGuideFailure[];
  safety: string[];
  next_steps: string[];
}

export interface BuildGuideProps {
  buildGuideData: BuildGuide;
  contentRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}
