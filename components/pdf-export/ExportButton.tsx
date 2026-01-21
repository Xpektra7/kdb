import React, { useState } from 'react';
import type { ExportButtonProps } from './types';
import { ButtonIcon } from './ButtonIcon';

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  buttonText = 'Export to PDF',
  fileName = 'report.pdf'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    setIsSuccess(false);

    try {
      // ✅ Send data to your server API
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // ✅ Get the PDF blob from the response
      const blob = await response.blob();
      
      // ✅ Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r bg-black border border-white hover:bg-white hover:text-black disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg text-sm"
    >
      <ButtonIcon isGenerating={isGenerating} isSuccess={isSuccess} />
      <span className="hidden sm:inline">
        {isGenerating ? 'Generating...' : isSuccess ? 'Success!' : buttonText}
      </span>
      <span className="sm:hidden">
        {isGenerating ? '...' : isSuccess ? '✓' : 'PDF'}
      </span>
    </button>
  );
};