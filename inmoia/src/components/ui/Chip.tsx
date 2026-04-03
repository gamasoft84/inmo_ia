"use client";

import { cn } from "@/lib/utils/cn";

type ChipProps = {
  active?: boolean;
  onClick?: () => void;
  children: string;
};

export function Chip({ active = false, onClick, children }: ChipProps) {
  return (
    <button type="button" onClick={onClick} className={cn("chip", active && "active")}>
      {children}
    </button>
  );
}
