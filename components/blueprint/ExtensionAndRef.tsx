import type { ExtensionsAndReferencesProps } from '@/lib/definitions';

export function ExtensionsAndReferences({ extensions = [], references = [] }: ExtensionsAndReferencesProps) {
  if (!extensions.length && !references.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {extensions && extensions.length > 0 && (
        <section className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl mb-4">Future Extensions</h2>
          <ul className="space-y-2">
            {extensions.map((ext, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="mt-0.5 shrink-0">▸</span>
                <span className="flex-1">{ext}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {references && references.length > 0 && (
        <section className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl mb-4">References</h2>
          <ul className="space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="mt-0.5 shrink-0">→</span>
                <span className="flex-1 wrap-break-words">{ref}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}