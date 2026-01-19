export interface PDFExportButtonProps {
  targetSelector?: string;
  fileName?: string;
  className?: string;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewContent: string;
  detectedPageType: string;
  onDownload: () => void;
  isGenerating: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>; // ✅ Allow null
}

export type PageType = 'Decision Matrix' | 'Blueprint' | 'Build Guide';