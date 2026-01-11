import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SkillsProps {
  skills: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Skills({ skills, contentRef }: SkillsProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Skills Required</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <Badge key={i} variant="outline" className="text-xs sm:text-sm">
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}