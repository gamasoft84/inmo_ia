export type VisitStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface Visit {
  id: string;
  agency_id: string;
  lead_id: string | null;
  property_id: string | null;
  agent_id: string | null;
  status: VisitStatus;
  scheduled_at: string;
  duration_min: number;
  notes: string | null;
  cancelled_by: "lead" | "agent" | null;
  created_at: string;
}

export const VISIT_STATUS_META: Record<
  VisitStatus,
  { bg: string; color: string; label: string }
> = {
  pending:   { bg: "#FAEEDA", color: "#854F0B", label: "Pendiente"  },
  confirmed: { bg: "#EAF3DE", color: "#3B6D11", label: "Confirmada" },
  completed: { bg: "#E6F1FB", color: "#185FA5", label: "Realizada"  },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelada"  },
  no_show:   { bg: "#f0f0f0", color: "#9090a8", label: "No asistió" },
};
