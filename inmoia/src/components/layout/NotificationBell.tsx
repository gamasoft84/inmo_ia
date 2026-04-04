"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { scoreToTemperature, LEAD_TEMP_META } from "@/types/lead";

interface Notification {
  id: string;
  type: "new_lead" | "hot_lead" | "new_visit";
  title: string;
  body: string;
  at: Date;
  read: boolean;
  href?: string;
}

function relTime(d: Date): string {
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1)  return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

export function NotificationBell() {
  const supabase = createClient();
  const [open, setOpen]             = useState(false);
  const [notifs, setNotifs]         = useState<Notification[]>([]);
  const panelRef                    = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  function addNotif(n: Omit<Notification, "id" | "at" | "read">) {
    setNotifs(prev => [
      { ...n, id: crypto.randomUUID(), at: new Date(), read: false },
      ...prev.slice(0, 19), // keep last 20
    ]);
  }

  // Supabase Realtime — leads
  useEffect(() => {
    const channel = supabase
      .channel("notif-leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const score = Number(row.ai_score ?? 0);
          const temp  = scoreToTemperature(score);
          const meta  = LEAD_TEMP_META[temp];
          const name  = String(row.name ?? "Lead nuevo");

          addNotif({
            type:  temp === "hot" ? "hot_lead" : "new_lead",
            title: temp === "hot" ? `${meta.emoji} Lead caliente` : "Nuevo lead",
            body:  `${name} — Score ${score}`,
            href:  `/leads/${String(row.id ?? "")}`,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visits" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const dt  = row.scheduled_at
            ? new Date(String(row.scheduled_at)).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })
            : "";

          addNotif({
            type:  "new_visit",
            title: "Visita agendada",
            body:  `Para el ${dt}`,
            href:  "/calendario",
          });
        }
      )
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, [supabase]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function handleClick(n: Notification) {
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    setOpen(false);
    if (n.href) window.location.href = n.href;
  }

  const ICON: Record<Notification["type"], string> = {
    new_lead:  "👤",
    hot_lead:  "🔥",
    new_visit: "📅",
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        type="button"
        aria-label="Notificaciones"
        onClick={() => setOpen(o => !o)}
        className="btn btn-ghost btn-sm relative"
      >
        <Bell size={14} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[8px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-9 z-50 w-[300px] rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary px-4 py-3">
            <p className="text-[12px] font-semibold text-text-primary">Notificaciones</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[10px] text-brand hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[24px]">🔔</p>
                <p className="mt-1 text-[11px] text-text-tertiary">Sin notificaciones aún.</p>
                <p className="text-[10px] text-text-tertiary">Llegarán en tiempo real cuando entren leads.</p>
              </div>
            ) : (
              notifs.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 border-b-[0.5px] border-border-tertiary px-4 py-3 text-left transition last:border-b-0 hover:bg-bg-secondary ${
                    !n.read ? "bg-brand-light/40" : ""
                  }`}
                >
                  <span className="mt-0.5 text-[16px]">{ICON[n.type]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-medium text-text-primary">{n.title}</p>
                      <p className="shrink-0 text-[9px] text-text-tertiary">{relTime(n.at)}</p>
                    </div>
                    <p className="truncate text-[10px] text-text-secondary">{n.body}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
