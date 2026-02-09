import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Blueprint, BuildGuide, DecisionMatrixOutput, Component } from '@/lib/definitions';

export interface PageContent {
  type: 'heading' | 'paragraph' | 'list';
  content: string;
  level?: number;
  items?: string[];
}

export interface PDFExportData {
  title: string;
  decisionMatrix?: string | DecisionMatrixOutput;
  blueprint?: string | Blueprint;
  buildGuide?: string | BuildGuide;
  author?: string;
  projectName?: string;
}

export interface ExportButtonProps {
  data?: PDFExportData;
  buttonText?: string;
  fileName?: string;
}

// Format Blueprint object into readable text
function formatBlueprintForPDF(blueprint: Blueprint): string {
  let content = '';

  // Problem Statement
  if (blueprint.problem) {
    content += `# Problem Statement\n`;
    content += `${blueprint.problem.statement}\n\n`;
    if (blueprint.problem.constraints?.length) {
      content += `## Constraints\n`;
      blueprint.problem.constraints.forEach(c => {
        content += `- ${c}\n`;
      });
      content += '\n';
    }
  }

  // Architecture
  if (blueprint.architecture) {
    content += `# Architecture\n`;
    content += `## Overview\n`;
    content += `${blueprint.architecture.overview}\n\n`;
    if (blueprint.architecture.block_diagram?.length) {
      content += `## Block Diagram\n`;
      blueprint.architecture.block_diagram.forEach((item: any) => {
        const block = typeof item === 'string' ? item : item.block;
        content += `- ${block}\n`;
      });
      content += '\n';
    }
    if (blueprint.architecture.data_flow) {
      content += `## Data Flow\n`;
      content += `${blueprint.architecture.data_flow}\n\n`;
    }
  }

  // Components
  if (blueprint.components?.length) {
    content += `# Components\n`;
    blueprint.components.forEach((comp) => {
      const hasSelectedOptionObject = isComponentWithSelectedOptionObject(comp);
      const subsystemName = typeof comp.subsystem === 'string'
        ? comp.subsystem
        : comp.subsystem.name;
      const chosenOption = 'chosen_option' in comp
        ? comp.chosen_option
        : hasSelectedOptionObject
          ? comp.selectedOption.name
          : comp.selectedOption;
      const whyChosen = 'why_chosen' in comp
        ? comp.why_chosen
        : hasSelectedOptionObject
          ? comp.selectedOption.why_it_works
          : undefined;
      const pros = 'pros' in comp
        ? comp.pros
        : hasSelectedOptionObject
          ? comp.selectedOption.pros
          : [];
      const cons = 'cons' in comp
        ? comp.cons
        : hasSelectedOptionObject
          ? comp.selectedOption.cons
          : [];

      content += `## ${subsystemName} - ${chosenOption}\n`;
      if (whyChosen) {
        content += `Why chosen: ${whyChosen}\n\n`;
      }
      if (pros?.length) {
        content += `### Pros\n`;
        pros.forEach((p: string) => {
          content += `- ${p}\n`;
        });
        content += '\n';
      }
      if (cons?.length) {
        content += `### Cons\n`;
        cons.forEach((c: string) => {
          content += `- ${c}\n`;
        });
        content += '\n';
      }
    });
  }

  // Execution Steps
  if (blueprint.execution_steps?.length) {
    content += `# Execution Steps\n`;
    blueprint.execution_steps.forEach((step, i) => {
      content += `${i + 1}. ${step}\n`;
    });
    content += '\n';
  }

  // Testing
  if (blueprint.testing) {
    content += `# Testing\n`;
    if (blueprint.testing.methods?.length) {
      content += `## Methods\n`;
      blueprint.testing.methods.forEach(m => {
        content += `- ${m}\n`;
      });
      content += '\n';
    }
    if (blueprint.testing.success_criteria) {
      content += `## Success Criteria\n`;
      content += `${blueprint.testing.success_criteria}\n\n`;
    }
  }

  // Skills
  if (blueprint.skills) {
    content += `# Skills Required\n`;
    const skills = typeof blueprint.skills === 'string'
      ? blueprint.skills.split(',').map(s => s.trim()).filter(Boolean)
      : blueprint.skills;
    skills.forEach(skill => {
      content += `- ${skill}\n`;
    });
    content += '\n';
  }

  // Cost
  if (blueprint.cost) {
    content += `# Cost Estimation\n`;
    content += `${blueprint.cost}\n\n`;
  }

  // Extensions
  if (blueprint.extensions?.length) {
    content += `# Future Extensions\n`;
    blueprint.extensions.forEach(ext => {
      content += `- ${ext}\n`;
    });
    content += '\n';
  }

  // References
  if (blueprint.references?.length) {
    content += `# References\n`;
    blueprint.references.forEach(ref => {
      content += `- ${ref}\n`;
    });
    content += '\n';
  }

  return content;
}

type SelectedOptionObject = {
  name: string;
  why_it_works: string;
  pros: string[];
  cons: string[];
};

type ComponentWithSelectedOptionObject = {
  subsystem: { name: string };
  selectedOption: SelectedOptionObject;
  features?: string[];
};

function isComponentWithSelectedOptionObject(
  component: Component
): component is ComponentWithSelectedOptionObject {
  return (
    typeof component.selectedOption === 'object' &&
    component.selectedOption !== null &&
    'name' in component.selectedOption
  );
}

// Format DecisionMatrix object into readable text
function formatDecisionMatrixForPDF(dm: any): string {
  let content = '';

  // Project Overview
  const projectName = dm.project || dm.title;
  if (projectName) {
    content += `# Project: ${projectName}\n`;
  }
  if (dm.concept) {
    content += `${dm.concept}\n\n`;
  }

  // Goals
  if (dm.goals?.length) {
    content += `# Goals\n`;
    dm.goals.forEach((goal: string) => {
      content += `- ${goal}\n`;
    });
    content += '\n';
  }

  // Research
  if (dm.research?.length) {
    content += `# Research Insights\n`;
    dm.research.forEach((item: string) => {
      content += `- ${item}\n`;
    });
    content += '\n';
  }

  // Problems
  if (dm.problems_overall?.length) {
    content += `# Problems & Solutions\n`;
    dm.problems_overall.forEach((problem: any) => {
      content += `## Problem: ${problem.problem}\n`;
      content += `Solution: ${problem.suggested_solution}\n\n`;
    });
  }

  // Decision Matrix - Subsystems
  if (dm.subsystems?.length) {
    content += `# Component Options\n`;
    dm.subsystems.forEach((subsystem: any) => {
      content += `## ${subsystem.subsystem} System\n`;

      const inputFrom = subsystem.inputFrom ?? subsystem.from;
      const outputTo = subsystem.outputTo ?? subsystem.to;
      if (inputFrom || outputTo) {
        if (inputFrom) {
          const fromList = Array.isArray(inputFrom)
            ? inputFrom
            : [inputFrom];
          content += `Inputs: ${fromList.filter(Boolean).join(', ')}\n`;
        }
        if (outputTo) {
          const toList = Array.isArray(outputTo)
            ? outputTo
            : [outputTo];
          content += `Outputs: ${toList.filter(Boolean).join(', ')}\n`;
        }
        content += '\n';
      }

      if (subsystem.options?.length) {
        subsystem.options.forEach((option: any, optIdx: number) => {
          content += `### Option ${optIdx + 1}: ${option.name}\n`;
          content += `Why it works: ${option.why_it_works}\n`;
          if (option.features?.length) {
            content += `Features:\n`;
            option.features.forEach((feature: string) => {
              content += `- ${feature}\n`;
            });
          }
          if (option.pros?.length) {
            content += `Pros:\n`;
            option.pros.forEach((pro: string) => {
              content += `- ${pro}\n`;
            });
          }
          if (option.cons?.length) {
            content += `Cons:\n`;
            option.cons.forEach((con: string) => {
              content += `- ${con}\n`;
            });
          }
          if (option.estimated_cost) {
            content += `Estimated cost: ${option.estimated_cost}\n`;
          }
          if (option.availability) {
            content += `Availability: ${option.availability}\n`;
          }
          content += '\n';
        });
      }
    });
  }

  // Skills
  if (dm.skills) {
    content += `# Skills Required\n`;
    const skillsList = typeof dm.skills === 'string'
      ? dm.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(dm.skills) ? dm.skills : [];
    
    skillsList.forEach((skill: string) => {
      content += `- ${skill}\n`;
    });
    content += '\n';
  }

  return content;
}

// Format BuildGuide object into readable text
function formatBuildGuideForPDF(bg: any): string {
  let content = '';

  // Project
  if (bg.project) {
    content += `# Project: ${bg.project}\n\n`;
  }

  // Build Overview
  if (bg.build_overview) {
    content += `# Build Overview\n`;
    content += `${bg.build_overview}\n\n`;
  }

  // Prerequisites
  if (bg.prerequisites) {
    content += `# Prerequisites\n`;
    if (bg.prerequisites.tools?.length) {
      content += `## Tools Required\n`;
      bg.prerequisites.tools.forEach((tool: string) => {
        content += `- ${tool}\n`;
      });
      content += '\n';
    }
    if (bg.prerequisites.materials?.length) {
      content += `## Materials Required\n`;
      bg.prerequisites.materials.forEach((material: string) => {
        content += `- ${material}\n`;
      });
      content += '\n';
    }
  }

  // Wiring
  if (bg.wiring) {
    content += `# Wiring\n`;
    if (bg.wiring.description) {
      content += `${bg.wiring.description}\n\n`;
    }
    if (bg.wiring.connections?.length) {
      content += `## Connections\n`;
      bg.wiring.connections.forEach((conn: string, idx: number) => {
        content += `- ${conn}\n`;
      });
      content += '\n';
    }
  }

  // Firmware
  if (bg.firmware) {
    content += `# Firmware\n`;
    if (bg.firmware.language) {
      content += `Language: ${bg.firmware.language}\n\n`;
    }
    if (bg.firmware.structure?.length) {
      content += `## Code Structure\n`;
      bg.firmware.structure.forEach((item: string) => {
        content += `- ${item}\n`;
      });
      content += '\n';
    }
    if (bg.firmware.key_logic?.length) {
      content += `## Key Logic\n`;
      bg.firmware.key_logic.forEach((logic: string, idx: number) => {
        content += `- ${logic}\n`;
      });
      content += '\n';
    }
  }

  // Calibration
  if (bg.calibration?.length) {
    content += `# Calibration Steps\n`;
    bg.calibration.forEach((step: string, idx: number) => {
      content += `- Step ${idx + 1}: ${step}\n`;
    });
    content += '\n';
  }

  // Testing
  if (bg.testing) {
    content += `# Testing\n`;
    if (bg.testing.unit?.length) {
      content += `## Unit Tests\n`;
      bg.testing.unit.forEach((test: string) => {
        content += `- ${test}\n`;
      });
      content += '\n';
    }
    if (bg.testing.integration?.length) {
      content += `## Integration Tests\n`;
      bg.testing.integration.forEach((test: string) => {
        content += `- ${test}\n`;
      });
      content += '\n';
    }
    if (bg.testing.acceptance?.length) {
      content += `## Acceptance Tests\n`;
      bg.testing.acceptance.forEach((test: string) => {
        content += `- ${test}\n`;
      });
      content += '\n';
    }
  }

  // Common Failures
  if (bg.common_failures?.length) {
    content += `# Common Failures\n`;
    bg.common_failures.forEach((failure: any) => {
      content += `## Issue: ${failure.issue}\n`;
      content += `Cause: ${failure.cause}\n`;
      content += `Fix: ${failure.fix}\n\n`;
    });
  }

  // Safety
  if (bg.safety?.length) {
    content += `# Safety Guidelines\n`;
    bg.safety.forEach((item: string) => {
      content += `- ${item}\n`;
    });
    content += '\n';
  }

  // Next Steps
  if (bg.next_steps?.length) {
    content += `# Next Steps\n`;
    bg.next_steps.forEach((step: string, idx: number) => {
      content += `- ${step}\n`;
    });
    content += '\n';
  }

  return content;
}

function parseSectionContent(content: string): PageContent[] {
  const pages: PageContent[] = [];
  const lines = content.split('\n').filter(line => line.trim());
  let currentList: string[] = [];

  lines.forEach(line => {
    if (line.startsWith('#')) {
      if (currentList.length > 0) {
        pages.push({ type: 'list', content: '', items: [...currentList] });
        currentList = [];
      }
      pages.push({
        type: 'heading',
        content: line.replace(/^#+\s+/, ''),
        level: line.match(/^#+/)?.[0].length || 1
      });
    } else if (line.startsWith('-') || line.startsWith('*')) {
      currentList.push(line.replace(/^[-*]\s+/, ''));
    } else {
      if (currentList.length > 0) {
        pages.push({ type: 'list', content: '', items: [...currentList] });
        currentList = [];
      }
      if (line.trim()) {
        pages.push({ type: 'paragraph', content: line });
      }
    }
  });

  if (currentList.length > 0) {
    pages.push({ type: 'list', content: '', items: currentList });
  }

  return pages;
}

export async function generatePDFBuffer(data: any): Promise<Uint8Array> {
  // Convert Blueprint object to formatted text if needed
  let blueprintContent = data.blueprint;
  if (blueprintContent && typeof blueprintContent === 'object') {
    blueprintContent = formatBlueprintForPDF(blueprintContent);
  }

  // Convert DecisionMatrix object to formatted text if needed
  let dmContent = data.decisionMatrix;
  if (dmContent && typeof dmContent === 'object') {
    dmContent = formatDecisionMatrixForPDF(dmContent);
  }

  // Convert BuildGuide object to formatted text if needed
  let buildGuideContent = data.buildGuide;
  if (buildGuideContent && typeof buildGuideContent === 'object') {
    buildGuideContent = formatBuildGuideForPDF(buildGuideContent);
  }

  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  let yPosition = height - 80;
  const margin = 60;
  const maxWidth = width - 2 * margin;

  // Helper function to sanitize text for PDF (remove Unicode characters not supported by WinAnsi)
  const sanitizeText = (text: string): string => {
    return text
      .replace(/→/g, '->') // Arrow
      .replace(/←/g, '<-') // Left arrow
      .replace(/↓/g, 'v')  // Down arrow
      .replace(/↑/g, '^')  // Up arrow
      .replace(/[^\x00-\x7F]/g, '?'); // Replace other non-ASCII chars with ?
  };

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition - requiredSpace < 80) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 80;
      return true;
    }
    return false;
  };

  // Helper function to draw wrapped text with better word wrapping
  const drawText = (
    text: string, 
    fontSize: number, 
    font: any, 
    color = rgb(0, 0, 0),
    indent = 0,
    align: 'left' | 'center' = 'left'
  ) => {
    const cleanText = sanitizeText(text);
    const words = cleanText.split(' ');
    let line = '';
    const lineHeight = fontSize * 1.5;
    const lines: string[] = [];

    // Build lines
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth - indent && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== '') {
      lines.push(line.trim());
    }

    // Draw each line
    for (const textLine of lines) {
      checkPageBreak(lineHeight);
      
      let xPosition = margin + indent;
      if (align === 'center') {
        const textWidth = font.widthOfTextAtSize(textLine, fontSize);
        xPosition = (width - textWidth) / 2;
      }

      page.drawText(textLine, {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        font: font,
        color: color,
      });
      yPosition -= lineHeight;
    }
  };

  // Draw horizontal line
  const drawLine = () => {
    checkPageBreak(10);
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    yPosition -= 20;
  };

  // ========== TITLE PAGE ==========
  yPosition = height - 200; // Start lower for title page
  
  drawText(data.title || 'Report', 32, helveticaBold, rgb(0.2, 0.2, 0.2), 0, 'center');
  yPosition -= 20;

  if (data.projectName) {
    drawText(`Project: ${data.projectName}`, 16, helveticaOblique, rgb(0.3, 0.3, 0.3), 0, 'center');
    yPosition -= 10;
  }

  drawText(`Generated: ${new Date().toLocaleString()}`, 12, helveticaFont, rgb(0.5, 0.5, 0.5), 0, 'center');
  yPosition -= 60;

  drawLine();

  // ========== SECTIONS ==========
  const sections = [
    { title: 'Decision Matrix', content: dmContent },
    { title: 'Blueprint', content: blueprintContent },
    { title: 'Build Guide', content: buildGuideContent }
  ];

  for (const section of sections) {
    if (!section.content) continue;

    // Start section on new page
    page = pdfDoc.addPage([595, 842]);
    yPosition = height - 80;

    // Section title with background
    checkPageBreak(50);
    page.drawRectangle({
      x: margin - 10,
      y: yPosition - 5,
      width: maxWidth + 20,
      height: 40,
      color: rgb(0.95, 0.95, 0.98),
    });

    drawText(section.title, 24, helveticaBold, rgb(0.2, 0.3, 0.6));
    yPosition -= 20;
    drawLine();

    // Parse and render content
    const contentPages = parseSectionContent(section.content);
    
    for (const contentPage of contentPages) {
      checkPageBreak(40);

      if (contentPage.type === 'heading') {
        yPosition -= 10; // Extra space before headings
        const fontSize = contentPage.level === 1 ? 18 : contentPage.level === 2 ? 14 : 12;
        const color = contentPage.level === 1 ? rgb(0.1, 0.1, 0.1) : rgb(0.2, 0.2, 0.2);
        drawText(contentPage.content, fontSize, helveticaBold, color);
        yPosition -= 5;
      } else if (contentPage.type === 'paragraph') {
        drawText(contentPage.content, 11, helveticaFont, rgb(0.15, 0.15, 0.15));
        yPosition -= 8;
      } else if (contentPage.type === 'list' && contentPage.items) {
        for (const item of contentPage.items) {
          checkPageBreak(30);
          
          // Draw bullet point
          page.drawCircle({
            x: margin + 5,
            y: yPosition + 4,
            size: 2,
            color: rgb(0.3, 0.3, 0.3),
          });
          
          // Draw item text with indent
          drawText(item, 11, helveticaFont, rgb(0.15, 0.15, 0.15), 15);
          yPosition -= 3;
        }
        yPosition -= 10;
      }
    }

    yPosition -= 20;
  }

  // ========== ADD PAGE NUMBERS ==========
  const pages = pdfDoc.getPages();
  pages.forEach((pg, index) => {
    const pageNumberText = `Page ${index + 1} of ${pages.length}`;
    const textWidth = helveticaFont.widthOfTextAtSize(pageNumberText, 9);
    
    pg.drawText(pageNumberText, {
      x: (width - textWidth) / 2,
      y: 40,
      size: 9,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
