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
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4">Failure Modes</h2>
      <div className="space-y-3">
        {failureModes.map((mode, i) => (
          <div key={i} className="border border-border rounded-lg p-3 sm:p-4">
            <p className="mb-2 text-xs sm:text-sm">{mode.issue}</p>
            <p className="text-xs sm:text-sm">
              <span className="font-medium">Mitigation:</span> {mode.mitigation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}