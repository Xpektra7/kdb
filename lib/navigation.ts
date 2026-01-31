import type { NavItem, Blueprint, DecisionMatrixOutput, BuildGuide } from '@/lib/definitions';

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

// Build Guide navigation builder
const BUILD_GUIDE_NAV_CONFIG = [
  { key: 'build_overview', id: 'overview', label: 'Build Overview' },
  { key: 'prerequisites', id: 'prerequisites', label: 'Prerequisites' },
  { key: 'wiring', id: 'wiring', label: 'Wiring' },
  { key: 'firmware', id: 'firmware', label: 'Firmware' },
  { key: 'calibration', id: 'calibration', label: 'Calibration' },
  { key: 'testing', id: 'testing', label: 'Testing' },
  { key: 'common_failures', id: 'failures', label: 'Common Failures' },
  { key: 'safety', id: 'safety', label: 'Safety' },
  { key: 'next_steps', id: 'next-steps', label: 'Next Steps' },
] as const;

export function buildBuildGuideNav(buildGuideData: BuildGuide): NavItem[] {
  if (!buildGuideData) return [];

  const nav: NavItem[] = [{ id: 'project', label: 'Project', level: 0 }];

  BUILD_GUIDE_NAV_CONFIG.forEach((item) => {
    const value = buildGuideData[item.key as keyof BuildGuide];
    if (!value || (Array.isArray(value) && value.length === 0)) return;

    const base: NavItem = { id: item.id, label: item.label, level: 0 };
    nav.push(base);
  });

  return nav;
}
