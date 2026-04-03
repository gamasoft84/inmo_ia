"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getClientAgencyId } from "@/lib/agency/client-agency";

type Conversation = {
  leadId: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
};

type ChatMessage = {
  id: string;
  role: "bot" | "client" | "agent";
  content: string;
  created_at: string;
};

function formatMessageTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatbotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string>("");
  const [thread, setThread] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [agentControl, setAgentControl] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function loadSummary() {
    setLoadingList(true);
    const agencyId = getClientAgencyId();
    if (!agencyId) {
      setFeedback("Falta agencyId. Abre esta vista con ?agencyId=<uuid>.");
      setConversations([]);
      setLoadingList(false);
      return;
    }

    const res = await fetch(`/api/chatbot/conversations?agencyId=${encodeURIComponent(agencyId)}`, {
      cache: "no-store",
      headers: { "x-agency-id": agencyId },
    });
    const json = await res.json();
    const list = (json?.data ?? []) as Conversation[];
    setConversations(list);
    setActiveLeadId((prev) => prev || list[0]?.leadId || "");
    setLoadingList(false);
  }

  async function loadThread(leadId: string) {
    if (!leadId) {
      setThread([]);
      return;
    }

    const agencyId = getClientAgencyId();
    if (!agencyId) {
      setFeedback("Falta agencyId. No se puede cargar el hilo.");
      setLoadingThread(false);
      return;
    }

    setLoadingThread(true);
    const res = await fetch(`/api/chatbot/conversations?agencyId=${encodeURIComponent(agencyId)}&leadId=${encodeURIComponent(leadId)}`, {
      cache: "no-store",
      headers: { "x-agency-id": agencyId },
    });
    const json = await res.json();
    setThread((json?.data ?? []) as ChatMessage[]);
    setLoadingThread(false);
  }

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    loadThread(activeLeadId);
  }, [activeLeadId]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("chatbot-conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          loadSummary();
          if (activeLeadId) loadThread(activeLeadId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeLeadId]);

  async function sendMessage() {
    if (!draft.trim() || !activeLeadId || !agentControl) return;

    const agencyId = getClientAgencyId();
    if (!agencyId) {
      setFeedback("Falta agencyId. No se puede enviar mensaje.");
      return;
    }

    setSending(true);
    await fetch(`/api/chatbot/conversations?agencyId=${encodeURIComponent(agencyId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-agency-id": agencyId,
      },
      body: JSON.stringify({
        agencyId,
        leadId: activeLeadId,
        content: draft.trim(),
      }),
    });
    setDraft("");
    await loadThread(activeLeadId);
    await loadSummary();
    setSending(false);
  }

  const activeConversation = useMemo(
    () => conversations.find((c) => c.leadId === activeLeadId) ?? conversations[0],
    [activeLeadId, conversations],
  );

  return (
    <PageWrapper
      title="Chatbot WhatsApp"
      actions={
        <>
          <Link href="/chatbot/configuracion" className="btn btn-brand-soft">
            <span>✦ Configurar Sofia</span>
          </Link>
          <Button variant="primary">Nuevo broadcast</Button>
        </>
      }
    >
      <div className="grid gap-3 xl:grid-cols-[340px_1fr]">
        <section className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <div className="flex items-center gap-2 border-b-[0.5px] border-border-tertiary bg-bg-secondary px-3 py-2">
            <h2 className="flex-1 text-[12px] font-medium text-text-primary">Chatbot Sofia</h2>
            <span className="pill pill-success">🤖 Activo</span>
          </div>

          <div>
            {loadingList ? (
              <div className="p-3 text-[11px] text-text-tertiary">Cargando conversaciones...</div>
            ) : feedback ? (
              <div className="p-3 text-[11px] text-text-tertiary">{feedback}</div>
            ) : conversations.length === 0 ? (
              <div className="p-3 text-[11px] text-text-tertiary">Sin conversaciones aún.</div>
            ) : conversations.map((conversation) => (
              <button
                key={conversation.leadId}
                type="button"
                onClick={() => setActiveLeadId(conversation.leadId)}
                className={`flex w-full items-start gap-2 border-b-[0.5px] border-border-tertiary px-3 py-3 text-left last:border-b-0 ${activeLeadId === conversation.leadId ? "bg-brand-light/30" : "bg-bg-primary"}`}
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-wa-green text-[10px] font-semibold text-white">
                  {conversation.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-text-primary">{conversation.name}</p>
                  <p className="truncate text-[9px] text-text-tertiary">{conversation.preview}</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] text-text-tertiary">{conversation.time}</span>
                  {conversation.unread ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary">
          <header className="flex items-center gap-2 bg-wa-dark px-3 py-2 text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-wa-green text-[10px] font-semibold">
              {activeConversation?.avatar ?? "?"}
            </div>
            <div>
              <p className="text-[11px] font-medium">{activeConversation?.name ?? "Sin lead"}</p>
              <p className="text-[9px] text-white/60">{agentControl ? "Agente en control" : "Sofia atiende automaticamente"}</p>
            </div>

            <button
              type="button"
              onClick={() => setAgentControl((prev) => !prev)}
              disabled={!activeConversation}
              className="ml-auto rounded-full bg-brand px-3 py-1 text-[8px] font-medium disabled:opacity-50"
            >
              {agentControl ? "Regresar a Sofia" : "Tomar control"}
            </button>
          </header>

          <div className="space-y-2 bg-wa-bg p-3">
            {loadingThread ? (
              <div className="text-[11px] text-text-tertiary">Cargando conversación...</div>
            ) : thread.length === 0 ? (
              <div className="text-[11px] text-text-tertiary">Aún no hay mensajes en este lead.</div>
            ) : thread.map((message) => (
              <div key={message.id} className={`flex ${message.role === "client" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-[10px] px-3 py-2 text-[11px] leading-relaxed ${
                    message.role === "client"
                      ? "bg-wa-bubble text-[#1a1a1a]"
                      : message.role === "agent"
                        ? "bg-info-light text-[#1a1a1a]"
                        : "bg-white text-[#1a1a1a]"
                  }`}
                >
                  {message.content}
                  <div className="mt-1 text-[8px] text-text-tertiary">{formatMessageTime(message.created_at)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-bg-secondary px-3 py-2">
            <input
              className="input-base"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={agentControl ? "Escribe como agente..." : "Sofia respondera automaticamente"}
              disabled={!agentControl}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!agentControl || sending}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-wa-dark text-[12px] text-white disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
