import { cn } from "@/lib/utils/cn";

type SkeletonProps = {
  className?: string;
};

export function SkeletonLine({ className }: SkeletonProps) {
  return <div className={cn("skeleton skeleton-line", className)} />;
}

export function SkeletonBlock({ className }: SkeletonProps) {
  return <div className={cn("skeleton skeleton-block", className)} />;
}
