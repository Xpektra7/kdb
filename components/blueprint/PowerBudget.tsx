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
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4">Power Budget</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-black p-3 rounded-lg">
          <p className="text-xs mb-1">Source</p>
          <p className=" text-xs sm:text-sm wrap-break-words">{powerBudget.source}</p>
        </div>
        <div className="bg-black p-3 rounded-lg">
          <p className="text-xs mb-1">Active Current</p>
          <p className="text-xs sm:text-sm">{powerBudget.active_current}</p>
        </div>
        <div className="bg-black p-3 rounded-lg">
          <p className="text-xs mb-1">Sleep Current</p>
          <p className="text-xs sm:text-sm">{powerBudget.sleep_current}</p>
        </div>
        <div className="bg-black p-3 rounded-lg col-span-2 lg:col-span-1">
          <p className="text-xs  mb-1">Runtime</p>
          <p className="font-medium  text-xs sm:text-sm WRAP-break-words">{powerBudget.runtime_estimate}</p>
        </div>
      </div>
    </section>
  );
}

