import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SafetyProps {
  safety: string[];
  contentRef?: (el: HTMLDivElement | null) => void;
}

function formatText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function Safety({ safety, contentRef }: SafetyProps) {
  return (
    <section ref={contentRef} className="border-b border-border pb-4">
      <Accordion type="single" collapsible defaultValue="safety">
        <AccordionItem value="safety">
          <AccordionTrigger className="py-3 sm:py-4 bg-background text-lg sm:text-xl hover:text-foreground transition-colors font-semibold text-amber-500">
            <h2>Safety Guidelines</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-4 border-l-2 border-amber-500/30">
            <div className="bg-amber-500/10 rounded-lg p-4 sm:p-6 border border-amber-500/30">
              <ul className="space-y-2 sm:space-y-3">
                {safety.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base leading-relaxed">
                    <span className="text-amber-500">⚠</span>
                    <span>{formatText(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
