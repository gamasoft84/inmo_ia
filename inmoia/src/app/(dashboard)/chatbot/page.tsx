"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  status: "bot" | "agent";
};

const conversations: Conversation[] = [
  { id: "carlos", name: "Carlos Mendoza", avatar: "C", preview: "¿Cuando puedo ver la casa?", time: "5 min", unread: true, status: "bot" },
  { id: "ana", name: "Ana Torres", avatar: "A", preview: "Me interesa el depto de Santa Fe", time: "2h", unread: true, status: "bot" },
  { id: "roberto", name: "Roberto Silva", avatar: "R", preview: "¿Tiene escrituras el terreno?", time: "ayer", unread: false, status: "agent" },
];

const messagesByLead: Record<string, Array<{ role: "bot" | "client"; text: string; time: string }>> = {
  carlos: [
    { role: "bot", text: "¡Hola! Soy Sofia 🏡 ¿En que puedo ayudarte?", time: "10:32" },
    { role: "client", text: "Hola, me interesa la Casa Coyoacan", time: "10:33" },
    { role: "bot", text: "Con gusto. 210m², 3 rec, jardin privado y $5,800,000. ¿Agendamos visita?", time: "10:33" },
    { role: "client", text: "Si, ¿cuando pueden? Mi presupuesto es hasta 6M", time: "10:34" },
    { role: "bot", text: "Perfecto. Tengo mañana 10am o jueves 3pm. ¿Cual te acomoda?", time: "10:34" },
  ],
  ana: [
    { role: "bot", text: "Hola Ana, te comparto opciones en Santa Fe.", time: "09:12" },
    { role: "client", text: "Busco 2 recamaras y amenidades", time: "09:13" },
  ],
  roberto: [
    { role: "client", text: "¿Tiene escrituras el terreno?", time: "ayer" },
    { role: "bot", text: "Si, toda la documentacion esta en regla.", time: "ayer" },
  ],
};

export default function ChatbotPage() {
  const [activeLeadId, setActiveLeadId] = useState("carlos");
  const [agentControl, setAgentControl] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeLeadId) ?? conversations[0],
    [activeLeadId],
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
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveLeadId(conversation.id)}
                className={`flex w-full items-start gap-2 border-b-[0.5px] border-border-tertiary px-3 py-3 text-left last:border-b-0 ${activeLeadId === conversation.id ? "bg-brand-light/30" : "bg-bg-primary"}`}
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
              {activeConversation.avatar}
            </div>
            <div>
              <p className="text-[11px] font-medium">{activeConversation.name}</p>
              <p className="text-[9px] text-white/60">{agentControl ? "Agente en control" : "Sofia atiende automaticamente"}</p>
            </div>

            <button
              type="button"
              onClick={() => setAgentControl((prev) => !prev)}
              className="ml-auto rounded-full bg-brand px-3 py-1 text-[8px] font-medium"
            >
              {agentControl ? "Regresar a Sofia" : "Tomar control"}
            </button>
          </header>

          <div className="space-y-2 bg-wa-bg p-3">
            {messagesByLead[activeConversation.id].map((message, index) => (
              <div key={`${activeConversation.id}-${index}`} className={`flex ${message.role === "client" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-[10px] px-3 py-2 text-[11px] leading-relaxed ${message.role === "client" ? "bg-wa-bubble text-[#1a1a1a]" : "bg-white text-[#1a1a1a]"}`}>
                  {message.text}
                  <div className="mt-1 text-[8px] text-text-tertiary">{message.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-bg-secondary px-3 py-2">
            <input
              className="input-base"
              placeholder={agentControl ? "Escribe como agente..." : "Sofia respondera automaticamente"}
              disabled={!agentControl}
            />
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-wa-dark text-[12px] text-white">
              ➤
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
