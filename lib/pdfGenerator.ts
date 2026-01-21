import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface PageContent {
  type: 'heading' | 'paragraph' | 'list';
  content: string;
  level?: number;
  items?: string[];
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
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();
  let yPosition = height - 80;
  const margin = 60;
  const maxWidth = width - 2 * margin;

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
    const words = text.split(' ');
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
    { title: 'Decision Matrix', content: data.decisionMatrix },
    { title: 'Blueprint', content: data.blueprint },
    { title: 'Build Guide', content: data.buildGuide }
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