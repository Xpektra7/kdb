import { PageType } from './type';

export const detectPageType = (element: HTMLElement): PageType => {
  const text = element.textContent?.toLowerCase() || '';
  
  if (text.includes('decision matrix') || element.querySelector('table')) {
    return 'Decision Matrix';
  } else if (text.includes('blueprint') || 
             element.querySelector('.blueprint, .timeline, .steps')) {
    return 'Blueprint';
  } else if (text.includes('build guide')) {
    return 'Build Guide';
  }
  
  return 'Build Guide';
};

export const cleanContent = (element: Element): HTMLElement => {
  const clonedContent = element.cloneNode(true) as HTMLElement;
  
  // Remove unwanted elements
  clonedContent.querySelectorAll(
    'script, style, button, nav, footer, .no-export'
  ).forEach(el => el.remove());
  
  return clonedContent;
};

export const createStyledPreview = (
  html: string, 
  pageType: PageType
): string => {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #000000; background: #ffffff; padding: 40px; max-width: 800px; margin: 0 auto; border-radius: 8px;">
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; color: #000000 !important; font-weight: bold;">${pageType}</h1>
        <p style="margin: 8px 0 0 0; color: #000000 !important; font-size: 14px;">Generated on ${new Date().toLocaleString()}</p>
      </div>
      <div style="line-height: 1.8; color: #000000 !important; font-size: 14px;">
        ${html}
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #000000 !important; font-size: 12px;">
        <p style="margin: 0; color: #000000 !important;">Page 1 • ${pageType} Export</p>
      </div>
    </div>
    
    <style>
      /* Style ALL h1 tags in the content */
      h1 { 
        color: #ffffff !important;
        font-size: 24px !important;
        font-weight: bold !important;
        margin: 0 0 16px 0 !important;
        padding: 0 !important;
      }
      
      /* Style ALL h2 tags */
      h2 { 
        color: #000000 !important;
        font-size: 20px !important;
        font-weight: bold !important;
        margin: 20px 0 12px 0 !important;
        padding: 0 !important;
      }
      
      /* Style ALL h3 tags */
      h3 { 
        color: #000000 !important;
        font-weight: bold !important;
        font-size: 18px !important;
        margin: 16px 0 8px 0 !important;
        padding: 0 !important;
      }
      
      /* Style paragraphs - clean spacing */
      p {
        color: #000000 !important;
        margin: 0 0 12px 0 !important;
        padding: 0 !important;
        line-height: 1.6 !important;
      }
      
      /* Problem and Solution sections - clean organized layout */
      .problem, .solution, [class*="problem"], [class*="solution"] {
        margin: 20px 0 !important;
        padding: 0 !important;
      }
      
      .problem h2, .solution h2,
      [class*="problem"] h2, [class*="solution"] h2 {
        margin: 0 0 12px 0 !important;
        padding: 0 !important;
      }
      
      .problem p, .solution p,
      [class*="problem"] p, [class*="solution"] p {
        margin: 0 0 8px 0 !important;
        padding: 0 !important;
      }
      
      /* Component Options - nice bordered boxes */
      .component, .option, [class*="component"], [class*="option"] {
        border: 2px solid #2563eb !important;
        border-radius: 12px !important;
        padding: 16px !important;
        margin: 16px 0 !important;
        background-color: #f8fafc !important;
      }
      
      .component h3, .option h3,
      [class*="component"] h3, [class*="option"] h3 {
        color: #2563eb !important;
        margin: 0 0 8px 0 !important;
        padding: 0 !important;
        font-size: 18px !important;
      }
      
      .component p, .option p,
      [class*="component"] p, [class*="option"] p {
        margin: 0 0 8px 0 !important;
        padding: 0 !important;
      }
      
      /* Lists - clean spacing */
      ul, ol {
        margin: 12px 0 !important;
        padding-left: 20px !important;
      }
      
      li {
        margin: 4px 0 !important;
        padding: 0 !important;
        color: #000000 !important;
      }
    </style>
  `;
};

export const generateFileName = (pageType: PageType, customName?: string): string => {
  if (customName) return customName;
  
  const date = new Date().toISOString().split('T')[0];
  const safeName = pageType.toLowerCase().replace(/\s+/g, '-');
  return `${safeName}-${date}.pdf`;
};