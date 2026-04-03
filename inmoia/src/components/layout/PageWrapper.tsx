import type { ReactNode } from "react";

type PageWrapperProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageWrapper({ title, actions, children }: PageWrapperProps) {
  return (
    <section>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {actions ? <div className="inline-flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
