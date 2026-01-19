import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, File01Icon, MaximizeScreenIcon, MinimizeScreenIcon, Download01Icon } from '@hugeicons/core-free-icons';
import { PreviewModalProps } from './type';

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  previewContent,
  detectedPageType,
  onDownload,
  isGenerating,
  previewRef,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl max-h-[90vh]'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <HugeiconsIcon icon={File01Icon} className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">PDF Preview</h2>
              <p className="text-sm text-white/90">{detectedPageType} detected</p>
            </div>
          </div>
           <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white/20 hover:bg-white/30 text-black rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <HugeiconsIcon icon={MinimizeScreenIcon} className="w-5 h-5" /> : <HugeiconsIcon icon={MaximizeScreenIcon} className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 text-black rounded-lg transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Preview Content - CENTERED */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-8 flex items-start justify-center">
          <div 
            ref={previewRef}
            className="bg-white shadow-2xl"
            style={{ 
              minHeight: '297mm',
              width: '210mm',
              maxWidth: '100%'
            }}
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-700 font-medium">
            Review your document before downloading
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              <HugeiconsIcon icon={Download01Icon} className="w-5 h-5" />
              <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;