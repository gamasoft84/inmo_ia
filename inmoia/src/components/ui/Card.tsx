import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  brand?: boolean;
};

export function Card({ className, title, brand = false, children, ...props }: CardProps) {
  return (
    <section className={cn("card", brand && "card-brand", className)} {...props}>
      {title ? <h3 className="card-title">{title}</h3> : null}
      {children}
    </section>
  );
}
