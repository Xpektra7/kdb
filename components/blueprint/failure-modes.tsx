import type { FailureMode, FailureModesProps } from '@/lib/definitions';

export function FailureModes({ failureModes, contentRef }: FailureModesProps) {
  return (
    <section ref={contentRef} className="rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl mb-4">Failure Modes</h2>
      <div className="space-y-3">
        {failureModes.map((mode, i) => (
          <div key={i} className="border border-border rounded-lg p-4 sm:p-6">
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