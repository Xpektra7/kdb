import type { NavItem } from '@/lib/definitions';

// Config-driven navigation sections for blueprint view
const NAV_CONFIG = [
  { key: 'problem', id: 'problem', label: 'Problem Statement' },
  {
    key: 'architecture',
    id: 'architecture',
    label: 'Architecture',
    children: [
      { id: 'arch-overview', label: 'Overview' },
      { id: 'block-diagram', label: 'Block Diagram' },
      { id: 'data-flow', label: 'Data Flow' },
    ],
  },
  {
    key: 'subsystems',
    id: 'subsystems',
    label: 'Subsystems',
    childrenFn: (data: any) => (Array.isArray(data) ? data : []).map((s: any, i: number) => ({
      id: `subsystem-${i}`,
      label: s?.name ?? `Subsystem ${i + 1}`,
    })),
  },
  {
    key: 'components',
    id: 'components',
    label: 'Components',
    childrenFn: (data: any) => (Array.isArray(data) ? data : []).map((c: any, i: number) => ({
      id: `component-${i}`,
      label: `${c?.subsystem ?? 'Component'} System`,
    })),
  },
  { key: 'power_budget', id: 'power', label: 'Power Budget' },
  { key: 'execution_steps', id: 'execution', label: 'Execution Steps' },
  { key: 'testing', id: 'testing', label: 'Testing' },
  { key: 'failure_modes', id: 'failures', label: 'Failure Modes' },
  { key: 'data_model', id: 'data', label: 'Data Model' },
  { key: 'skills', id: 'skills', label: 'Skills Required' },
  { key: 'cost', id: 'cost', label: 'Cost Estimation' },
] as const;

export function buildBlueprintNav(blueprintData: any): NavItem[] {
  if (!blueprintData) return [];

  const nav: NavItem[] = [{ id: 'overview', label: 'Project Overview', level: 0 }];

  NAV_CONFIG.forEach((item) => {
    const value = (blueprintData as any)[item.key];
    if (!value) return;

    const base: NavItem = { id: item.id, label: item.label, level: 0 };

    if ('children' in item && item.children) {
      base.children = item.children.map((child) => ({ ...child, level: 1 }));
    } else if ('childrenFn' in item && item.childrenFn) {
      base.children = item.childrenFn(value).map((child: any) => ({ ...child, level: 1 }));
    }

    nav.push(base);
  });

  if ((blueprintData as any).extensions || (blueprintData as any).references) {
    nav.push({ id: 'extras', label: 'Extensions & References', level: 0 });
  }

  return nav;
}

// Decision Matrix navigation builder
export function buildDecisionMatrixNav(output: any): NavItem[] {
  if (!output) return [];
  const nav: NavItem[] = [{ id: 'overview', label: 'Project Overview', level: 0 }];

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
        level: 1,
      })),
    });
  }

  if (output.skills) {
    nav.push({ id: 'skills', label: 'Skills Required', level: 0 });
  }

  if (output.suggestions) {
    nav.push({ id: 'suggestions', label: 'Suggestions', level: 0 });
  }

  return nav;
}
