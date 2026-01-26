import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProblemsOverall({ problems }: { problems: { problem: string; suggested_solution: string }[] }) {
  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      <h2 className="text-xl sm:text-2xl font-semibold">Problems & Solutions</h2>
      <Accordion type="single" collapsible className="w-full">
        {problems.map((problem, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="py-3 sm:py-3.5 bg-background text-xs sm:text-sm md:text-base hover:text-foreground transition-colors font-medium">
              {problem.problem}
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-muted/30 rounded-lg p-4 sm:p-6 border border-border">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">{problem.suggested_solution}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}