import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full border-[0.5px] border-border-tertiary bg-bg-secondary", className)}>
      <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
