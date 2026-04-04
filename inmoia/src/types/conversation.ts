export type ConversationRole = "bot" | "agent" | "client";

export interface Conversation {
  id: string;
  agency_id: string;
  lead_id: string;
  role: ConversationRole;
  content: string;
  language: "es" | "en";
  is_read: boolean;
  created_at: string;
}
