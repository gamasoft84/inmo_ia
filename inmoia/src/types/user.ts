export type UserRole = "super_admin" | "agency_admin" | "agent" | "viewer";

export interface User {
  id: string;
  agency_id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:  "Super Admin",
  agency_admin: "Admin Agencia",
  agent:        "Agente",
  viewer:       "Visualizador",
};

/** Verifica si un rol puede realizar una acción */
export function hasPermission(role: UserRole, action: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[action].includes(role);
}

export const PERMISSIONS = {
  view_admin_panel:         ["super_admin"] as UserRole[],
  view_all_leads:           ["super_admin", "agency_admin", "viewer"] as UserRole[],
  edit_leads:               ["super_admin", "agency_admin", "agent"] as UserRole[],
  manage_properties:        ["super_admin", "agency_admin", "agent"] as UserRole[],
  configure_chatbot:        ["super_admin", "agency_admin"] as UserRole[],
  take_chat_control:        ["super_admin", "agency_admin", "agent"] as UserRole[],
  invite_agents:            ["super_admin", "agency_admin"] as UserRole[],
  view_billing:             ["super_admin", "agency_admin"] as UserRole[],
  view_reports:             ["super_admin", "agency_admin", "viewer"] as UserRole[],
};
