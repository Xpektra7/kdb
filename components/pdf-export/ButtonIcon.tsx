import React from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';

interface ButtonIconProps {
  isGenerating: boolean;
  isSuccess: boolean;
}

// ✅ This should be a regular component, NOT using useState
export const ButtonIcon: React.FC<ButtonIconProps> = ({ isGenerating, isSuccess }) => {
  if (isGenerating) return <Loader2 className="w-5 h-5 animate-spin" />;
  if (isSuccess) return <CheckCircle className="w-5 h-5" />;
  return <Download className="w-5 h-5" />;
};