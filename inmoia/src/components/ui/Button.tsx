import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "brand-soft" | "ghost" | "danger" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  ai?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  "brand-soft": "btn-brand-soft",
  ghost: "btn-ghost",
  danger: "btn-danger",
  whatsapp: "btn-whatsapp",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function Button({
  className,
  children,
  variant = "ghost",
  size = "md",
  full = false,
  ai = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn",
        variantClasses[variant],
        sizeClasses[size],
        full && "btn-full",
        className,
      )}
      {...props}
    >
      {ai ? <span aria-hidden="true">✦</span> : null}
      <span>{children}</span>
    </button>
  );
}
