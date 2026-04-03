import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "success" | "warning" | "error" | "info";

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  withProgress?: boolean;
};

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

export function Toast({ title, description, variant = "info", withProgress = false }: ToastProps) {
  const Icon = icons[variant];

  return (
    <div className={cn("toast animate-[slideInRight_0.3s_ease]", variant)}>
      <Icon size={14} className="mt-[1px]" />
      <div className="space-y-1">
        <p className="text-[11px] font-medium">{title}</p>
        {description ? <p className="text-[10px] opacity-80">{description}</p> : null}
      </div>
      {withProgress ? <div className="toast-progress" /> : null}
    </div>
  );
}
