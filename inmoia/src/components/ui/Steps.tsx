import { cn } from "@/lib/utils/cn";

type StepItem = {
  id: string;
  label: string;
  done?: boolean;
};

type StepsProps = {
  steps: StepItem[];
  current: string;
};

export function Steps({ steps, current }: StepsProps) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((step, index) => {
        const active = index === currentIndex;
        const done = step.done || index < currentIndex;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className={cn("step", active && "active", done && "done", "flex items-center gap-2")}>
              <span className="step-num">{index + 1}</span>
              <span className="hidden text-[10px] text-text-secondary md:block">{step.label}</span>
            </div>
            {index < steps.length - 1 ? <span className={cn("step-line", done && "done")} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
