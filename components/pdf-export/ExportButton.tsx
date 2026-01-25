'use client'
import React, { useState } from 'react';
import type { ExportButtonProps } from '@/lib/pdfGenerator';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download, Loader, CheckCircle } from '@hugeicons/core-free-icons';
import { Button } from '../ui/button';

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
    <Button
      onClick={handleExport}
      disabled={isGenerating}
      className="inline-flex items-center justify-center h-fit gap-2 px-4 py-2"
    >

      <HugeiconsIcon
        icon={isGenerating ? Loader : isSuccess ? CheckCircle : Download}
        className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`}
      />
      
      <span className="hidden sm:inline text-sm">
        {isGenerating ? 'Generating...' : isSuccess ? 'Success!' : buttonText}
      </span>
      <span className="sm:hidden">
        {isGenerating ? '...' : isSuccess ? '✓' : 'PDF'}
      </span>
    </Button>
  );
};