interface DataModel {
  sample_payload: Record<string, any>;
}

interface DataModelProps {
  dataModel: DataModel;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function DataModel({ dataModel, contentRef }: DataModelProps) {
  return (
    <section ref={contentRef} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Data Model</h2>
      <div className="bg-slate-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap break-words sm:whitespace-pre">{JSON.stringify(dataModel.sample_payload, null, 2)}</pre>
      </div>
    </section>
  );
}