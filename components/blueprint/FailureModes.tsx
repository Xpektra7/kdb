interface FailureMode {
  issue: string;
  mitigation: string;
}

interface FailureModesProps {
  failureModes: FailureMode[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function FailureModes({ failureModes, contentRef }: FailureModesProps) {
  return (
    <section ref={contentRef} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Failure Modes</h2>
      <div className="space-y-3">
        {failureModes.map((mode, i) => (
          <div key={i} className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
            <p className="font-medium text-red-900 mb-2 text-xs sm:text-sm">{mode.issue}</p>
            <p className="text-xs sm:text-sm text-red-700">
              <span className="font-medium">Mitigation:</span> {mode.mitigation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}