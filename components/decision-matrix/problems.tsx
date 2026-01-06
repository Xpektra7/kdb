import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ProblemsOverall({ problems }: { problems: { problem: string; suggested_solution: string }[] }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="text-2xl">Problems</h2>
      <Accordion type="single" collapsible className="w-full">
        {problems.map((problem, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="py-2 bg-background text-normal">
              {problem.problem}
            </AccordionTrigger>
            <AccordionContent >
              <p className="text-muted-foreground py-2">{problem.suggested_solution}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
} 