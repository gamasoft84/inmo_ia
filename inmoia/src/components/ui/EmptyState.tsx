import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
};

export function EmptyState({
  icon = "🗂",
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty-title">{title}</p>
      <p className="empty-desc">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
      {secondaryAction ? <div>{secondaryAction}</div> : null}
    </div>
  );
}
