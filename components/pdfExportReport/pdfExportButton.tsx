import React, { useState, useRef } from 'react';
import { Eye } from 'lucide-react';
import PreviewModal from './PreviewModal';
import { generatePDF } from './pdfGenerator';
import { 
  detectPageType, 
  cleanContent, 
  createStyledPreview,
  generateFileName 
} from './utils';
import { PDFExportButtonProps, PageType } from './type';

const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  targetSelector = 'main, .content, body',
  fileName,
  className = '',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedPageType, setDetectedPageType] = useState<PageType>('Build Guide');
  const previewRef = useRef<HTMLDivElement>(null);

  const detectAndExtractContent = () => {
    const selectors = targetSelector.split(',').map(s => s.trim());
    let contentElement: Element | null = null;

    for (const selector of selectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }

    if (!contentElement) {
      contentElement = document.body;
    }

    const cleanedContent = cleanContent(contentElement);
    const pageType = detectPageType(cleanedContent);
    const html = cleanedContent.innerHTML;

    setDetectedPageType(pageType);

    return { html, pageType };
  };

  const handlePreview = () => {
    const { html, pageType } = detectAndExtractContent();
    console.log('Extracted HTML:', html);
    console.log('Page Type:', pageType);
    const styledPreview = createStyledPreview(html, pageType);
    setPreviewContent(styledPreview);
    setShowPreview(true);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      if (!previewRef.current) return;

      const finalFileName = generateFileName(detectedPageType, fileName);
      await generatePDF(previewRef.current, finalFileName);
      
      setShowPreview(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePreview}
        className={`group inline-flex items-center gap-2 px-5 py-2.5 mr-45 mt-5 border border-white bg-black text-white rounded-lg hover:bg-white hover:text-black active:scale-95 transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl ${className}`}
      >
        <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        <span>Preview & Export PDF</span>
      </button>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        previewContent={previewContent}
        detectedPageType={detectedPageType}
        onDownload={handleDownload}
        isGenerating={isGenerating}
        previewRef={previewRef}
      />
    </>
  );
};

export default PDFExportButton;