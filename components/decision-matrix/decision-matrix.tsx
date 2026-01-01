import ProblemsOverall from "./problems";
import Research from "./research";
import Subsystem from "./subsystem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function DecisionMatrix({ output }: { output: any }) {

  return (
    <div className="w-full flex flex-col justify-center gap-8 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">{output.project}</h1>
        <p>{output.concept}</p>
      </div>
      {
        output.research && (
          <Research research={output.research} />
        )
      }
      {
        output.problems_overall && (
          <ProblemsOverall problems={output.problems_overall} />
        )
      }
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-transparent">
            <h1 className="text-2xl">Components</h1>
          </AccordionTrigger>
          <AccordionContent>
            {output.decision_matrix && (
              <div className="flex flex-col border border-border rounded-lg p-4 gap-4">
                {output.decision_matrix.map((matrix: any, index: number) => <Subsystem key={index} subsystem={matrix} />)}
              </div> )
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}