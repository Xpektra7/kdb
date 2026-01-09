import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProblemsOverall({ problems }: { problems: { problem: string; suggested_solution: string }[] }) {
  return (
    <div className="w-full flex flex-col gap-2 sm:gap-3">
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Problems</h2>
      <Accordion type="single" collapsible className="w-full">
        {problems.map((problem, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="py-2 sm:py-2.5 bg-background text-xs sm:text-sm md:text-base hover:text-primary transition-colors">
              {problem.problem}
            </AccordionTrigger>
            <AccordionContent >
              <p className="text-xs sm:text-sm text-muted-foreground py-2">{problem.suggested_solution}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}