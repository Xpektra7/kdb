interface ExtensionsAndReferencesProps {
  extensions: string[];
  references: string[];
}

export function ExtensionsAndReferences({ extensions, references }: ExtensionsAndReferencesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <section className="rounded-lg shadow-sm border border-border p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl mb-4">Future Extensions</h2>
        <ul className="space-y-2">
          {extensions.map((ext, i) => (
            <li key={i} className="flex items-start gap-2  text-xs sm:text-sm">
              <span className=" mt-0.5 shrink-0">▸</span>
              <span className="flex-1">{ext}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg shadow-sm border border-border p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl mb-4">References</h2>
        <ul className="space-y-2">
          {references.map((ref, i) => (
            <li key={i} className="flex items-start gap-2  text-xs sm:text-sm">
              <span className=" mt-0.5 shrink-0">→</span>
              <span className="flex-1 wrap-break-words">{ref}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}