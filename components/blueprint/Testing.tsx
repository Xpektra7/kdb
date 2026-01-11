import { Badge } from '@/components/ui/badge';

interface Testing {
  methods: string[];
  success_criteria: string;
}

interface TestingProps {
  testing: Testing;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function Testing({ testing, contentRef }: TestingProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4">Testing</h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs sm:text-sm mb-2">Methods</p>
          <div className="flex flex-wrap gap-2">
            {testing.methods.map((method, i) => (
              <Badge key={i} variant="outline" className="text-xs sm:text-sm">
                {method}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm mb-1">Success Criteria</p>
          <p className="text-xs sm:text-sm  p-3 rounded border border-border">
            {testing.success_criteria}
          </p>
        </div>
      </div>
    </section>
  );
}