export interface PageContent {
  type: 'heading' | 'paragraph' | 'list';
  content: string;
  level?: number;
  items?: string[];
}

export interface PDFExportData {
  title: string;
  decisionMatrix?: string;
  blueprint?: string;
  buildGuide?: string;
  author?: string;
  projectName?: string;
}

export interface ExportButtonProps {
  data: PDFExportData;
  buttonText?: string;
  fileName?: string;
}