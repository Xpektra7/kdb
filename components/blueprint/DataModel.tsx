interface DataModel {
  sample_payload: Record<string, any>;
}

interface DataModelProps {
  dataModel: DataModel;
  contentRef?: (el: HTMLDivElement | null) => void;
}

export function DataModel({ dataModel, contentRef }: DataModelProps) {
  return (
    <section ref={contentRef} className="bg-black rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4">Data Model</h2>
      <div className="bg-black p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap wrap-break-words sm:whitespace-pre">{JSON.stringify(dataModel.sample_payload, null, 2)}</pre>
      </div>
    </section>
  );
}