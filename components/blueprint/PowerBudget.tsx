interface PowerBudget {
  source: string;
  active_current: string;
  sleep_current: string;
  runtime_estimate: string;
}

interface PowerBudgetProps {
  powerBudget: PowerBudget;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function PowerBudget({ powerBudget, contentRef }: PowerBudgetProps) {
  return (
    <section ref={contentRef} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Power Budget</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">Source</p>
          <p className="font-medium text-slate-900 text-xs sm:text-sm break-words">{powerBudget.source}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">Active Current</p>
          <p className="font-medium text-slate-900 text-xs sm:text-sm">{powerBudget.active_current}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-600 mb-1">Sleep Current</p>
          <p className="font-medium text-slate-900 text-xs sm:text-sm">{powerBudget.sleep_current}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg col-span-2 lg:col-span-1">
          <p className="text-xs text-slate-600 mb-1">Runtime</p>
          <p className="font-medium text-slate-900 text-xs sm:text-sm break-words">{powerBudget.runtime_estimate}</p>
        </div>
      </div>
    </section>
  );
}

