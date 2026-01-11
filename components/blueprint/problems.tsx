import { AlertCircle } from 'lucide-react';

interface ProblemStatementProps {
  statement: string;
  constraints: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function ProblemStatement({ statement, constraints, contentRef }: ProblemStatementProps) {
  return (
    <section ref={contentRef} className="bg-blackrounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Problem Statement</span>
      </h2>
      <p className="text-sm sm:text-base mb-4">{statement}</p>
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-medium">Constraints:</p>
        <div className="flex flex-wrap gap-2">
          {constraints.map((constraint, i) => (
            <span key={i} className="px-2 sm:px-3 py-1 bg-black rounded-full text-xs sm:text-sm border border-amber-200">
              {constraint}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}