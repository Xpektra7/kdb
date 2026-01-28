import type { NavItem, Blueprint, DecisionMatrixOutput } from '@/lib/definitions';

// Config-driven navigation sections for blueprint view
const NAV_CONFIG = [
  { key: 'problem', id: 'problem', label: 'Problem Statement' },
  {
    key: 'architecture',
    id: 'architecture',
    label: 'Architecture',
  },
  {
    key: 'components',
    id: 'components',
    label: 'Components',
  },
  { key: 'execution_steps', id: 'execution', label: 'Execution Steps' },
  { key: 'testing', id: 'testing', label: 'Testing' },
  { key: 'skills', id: 'skills', label: 'Skills Required' },
  { key: 'cost', id: 'cost', label: 'Cost Estimation' },
] as const;

export function buildBlueprintNav(blueprintData: Blueprint): NavItem[] {
  if (!blueprintData) return [];

  const nav: NavItem[] = [{ id: 'overview', label: 'Project Overview', level: 0 }];

  NAV_CONFIG.forEach((item) => {
    const value = blueprintData[item.key as keyof Blueprint];
    if (!value) return;

    const base: NavItem = { id: item.id, label: item.label, level: 0 };
    nav.push(base);
  });

  if (blueprintData.extensions || blueprintData.references) {
    nav.push({ id: 'extras', label: 'Extensions & References', level: 0 });
  }

  return nav;
}

// Decision Matrix navigation builder
export function buildDecisionMatrixNav(output: DecisionMatrixOutput): NavItem[] {
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
      children: output.decision_matrix.map((m, i) => ({
        id: `component-${i}`,
        label: `${m.subsystem} System`,
        level: 1,
      })),
    });
  }

  if (output.skills) {
    nav.push({ id: 'skills', label: 'Skills Required', level: 0 });
  }

  return nav;
}
