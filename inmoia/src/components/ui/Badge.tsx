import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  ai?: boolean;
};

export function Badge({ className, ai = false, children, ...props }: BadgeProps) {
  if (ai) {
    return (
      <span className={cn("badge-ai", className)} {...props}>
        <span aria-hidden="true">✦</span>
        <span>{children ?? "IA"}</span>
      </span>
    );
  }

  return (
    <span className={cn("pill bg-bg-secondary text-text-secondary", className)} {...props}>
      {children}
    </span>
  );
}
