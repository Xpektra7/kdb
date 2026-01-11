interface ExecutionStepsProps {
  steps: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function ExecutionSteps({ steps, contentRef }: ExecutionStepsProps) {
  return (
    <section ref={contentRef} className="rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Execution Steps</h2>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
              {i + 1}
            </span>
            <span className="pt-0.5 text-xs sm:text-sm lg:text-base flex-1 ">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}