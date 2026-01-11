import { Lightbulb } from 'lucide-react';

interface SkillsProps {
  skills: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Skills({ skills, contentRef }: SkillsProps) {
  return (
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Skills Required</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black rounded-lg text-xs sm:text-sm font-medium border border-border">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}