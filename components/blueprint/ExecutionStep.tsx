import type { ExecutionStepsProps } from '@/lib/definitions';

// Simple function to convert basic markdown to HTML
function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em class="text-foreground">$1</em>'); // Italic
}

export function ExecutionSteps({ steps, contentRef }: ExecutionStepsProps) {
  return (
    <section ref={contentRef} className=" rounded-lg shadow-sm border border-border p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl mb-4">Execution Steps</h2>
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-muted-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-black">
              {i + 1}
            </span>
            <span 
              className="text-xs sm:text-sm lg:text-base flex-1"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(step) }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}