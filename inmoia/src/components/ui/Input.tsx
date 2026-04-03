import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  hasError?: boolean;
  isSuccess?: boolean;
  aiFilled?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, hasError, isSuccess, aiFilled, id, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-[11px] text-text-secondary" htmlFor={id}>
      {label ? <span className="text-[10px] font-medium uppercase tracking-[0.03em] text-text-tertiary">{label}</span> : null}
      <input
        ref={ref}
        id={id}
        className={cn(
          "input-base",
          hasError && "error",
          isSuccess && "success",
          aiFilled && "ai-filled",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-[10px] text-text-tertiary">{hint}</span> : null}
    </label>
  );
});
