import { HugeiconsIcon } from '@hugeicons/react';
import { Book02Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import type { SkillsProps } from '@/lib/definitions';

export function Skills({ skills, contentRef }: SkillsProps) {
  // Handle both array and string formats
  const skillsList = Array.isArray(skills) 
    ? skills 
    : skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <section ref={contentRef} className="rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl mb-4 flex items-center gap-2">
        <HugeiconsIcon icon={Book02Icon} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        <span>Skills Required</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill, i) => (
          <Badge key={i} variant="outline" className="text-xs sm:text-sm">
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
}