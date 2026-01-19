import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (
  previewElement: HTMLDivElement,
  fileName: string
): Promise<void> => {

  // Clone the element and apply fallback styles
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.appendChild(clonedElement);
  document.body.appendChild(tempContainer);

  // Wait a frame for styles to compute
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // Remove all style attributes that might contain oklch/modern colors
    const allElements = clonedElement.querySelectorAll('*');
    const elementsToProcess = [clonedElement, ...Array.from(allElements)] as HTMLElement[];
    
    elementsToProcess.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      
      const style = el.getAttribute('style');
      if (style && /oklch|oklab|lab\(|lch\(/i.test(style)) {
        el.removeAttribute('style');
      }
      
      // Also remove style attributes from computed styles by applying safe fallbacks
      const computed = window.getComputedStyle(el);
      if (computed.backgroundColor && /oklch|oklab/i.test(computed.backgroundColor)) {
        (el.style as unknown as Record<string, string>)['backgroundColor'] = '#ffffff';
      }
      if (computed.color && /oklch|oklab/i.test(computed.color)) {
        (el.style as unknown as Record<string, string>)['color'] = '#000000';
      }
    });

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(tempContainer);
  }
};