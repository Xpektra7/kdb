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
    <section ref={contentRef} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Testing</h2>
      <div className="space-y-3">
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Methods</p>
          <div className="flex flex-wrap gap-2">
            {testing.methods.map((method, i) => (
              <span key={i} className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs sm:text-sm border border-blue-200">
                {method}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Success Criteria</p>
          <p className="text-xs sm:text-sm text-slate-700 bg-green-50 p-3 rounded border border-green-200">
            {testing.success_criteria}
          </p>
        </div>
      </div>
    </section>
  );
}