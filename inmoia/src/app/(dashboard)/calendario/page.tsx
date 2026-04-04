"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";

/* ── Types ────────────────────────────────────────── */

type VisitStatus = "scheduled" | "confirmed" | "done" | "cancelled" | "no_show";

interface Visit {
  id: string;
  lead_id: string | null;
  property_id: string | null;
  scheduled_at: string;
  duration_min: number;
  status: VisitStatus;
  notes: string | null;
  lead_name?: string;
  property_title?: string;
}

interface ScheduleForm {
  step: 1 | 2 | 3 | 4 | 5;
  lead_id: string;
  property_id: string;
  date: string;
  time: string;
  duration_min: number;
  notes: string;
}

type Row = Record<string, unknown>;

/* ── Constants ────────────────────────────────────── */

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 – 19:00

const STATUS_META: Record<VisitStatus, { label: string; bg: string; color: string; border: string }> = {
  scheduled:  { label: "Agendada",   bg: "#EEF2FF", color: "#3730A3", border: "#C7D2FE" },
  confirmed:  { label: "Confirmada", bg: "#ECFDF5", color: "#065F46", border: "#6EE7B7" },
  done:       { label: "Realizada",  bg: "#F0FDF4", color: "#166534", border: "#86EFAC" },
  cancelled:  { label: "Cancelada",  bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
  no_show:    { label: "No asistió", bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
};

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

/* ── Helpers ──────────────────────────────────────── */

function startOfWeek(d: Date): Date {
  const day = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7)); // Mon-based
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmtHour(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`;
}

function visitHour(iso: string): number {
  return new Date(iso).getHours();
}

function visitDay(iso: string): string {
  return isoDate(new Date(iso));
}

/* ════════════════════════════════════════════════════ */

export default function CalendarioPage() {
  const supabase = createClient();

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [visits, setVisits]   = useState<Visit[]>([]);
  const [leads, setLeads]     = useState<Row[]>([]);
  const [props, setProps]     = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const [form, setForm] = useState<ScheduleForm>({
    step: 1,
    lead_id: "",
    property_id: "",
    date: isoDate(new Date()),
    time: "10:00",
    duration_min: 60,
    notes: "",
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const loadVisits = useCallback(async () => {
    const from = weekStart.toISOString();
    const to   = addDays(weekStart, 7).toISOString();

    const { data } = await supabase
      .from("visits")
      .select("*, leads(name), properties(title_es)")
      .gte("scheduled_at", from)
      .lt("scheduled_at", to)
      .order("scheduled_at");

    if (data) {
      setVisits(
        data.map((v: Row) => ({
          ...(v as unknown as Visit),
          lead_name:       (v.leads as Row | null)?.name as string | undefined,
          property_title:  (v.properties as Row | null)?.title_es as string | undefined,
        }))
      );
    }
    setLoading(false);
  }, [weekStart, supabase]);

  useEffect(() => {
    void loadVisits();
  }, [loadVisits]);

  useEffect(() => {
    async function loadSelects() {
      const [{ data: leadsData }, { data: propsData }] = await Promise.all([
        supabase.from("leads").select("id, name, phone").order("created_at", { ascending: false }).limit(50),
        supabase.from("properties").select("id, title_es, city").eq("status", "active").limit(50),
      ]);
      setLeads(leadsData ?? []);
      setProps(propsData ?? []);
    }
    void loadSelects();
  }, [supabase]);

  async function saveVisit() {
    setSaving(true);
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile }  = await supabase
      .from("users")
      .select("agency_id")
      .eq("id", user?.id ?? "")
      .maybeSingle();

    await supabase.from("visits").insert({
      agency_id:    profile?.agency_id,
      lead_id:      form.lead_id      || null,
      property_id:  form.property_id  || null,
      scheduled_at: scheduledAt,
      duration_min: form.duration_min,
      notes:        form.notes        || null,
      status:       "scheduled",
    });

    setSaving(false);
    setShowModal(false);
    resetForm();
    void loadVisits();
  }

  function resetForm() {
    setForm({ step: 1, lead_id: "", property_id: "", date: isoDate(new Date()), time: "10:00", duration_min: 60, notes: "" });
  }

  async function updateStatus(visitId: string, status: VisitStatus) {
    await supabase.from("visits").update({ status }).eq("id", visitId);
    setSelectedVisit(null);
    void loadVisits();
  }

  const monthLabel = `${MONTHS_ES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;

  return (
    <PageWrapper
      title="Calendario"
      actions={
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Agendar visita
        </Button>
      }
    >
      {/* Week navigation */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekStart(w => addDays(w, -7))}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-primary text-[12px] text-text-secondary hover:bg-bg-secondary"
          >
            ‹
          </button>
          <span className="text-[12px] font-medium text-text-primary">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setWeekStart(w => addDays(w, 7))}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-primary text-[12px] text-text-secondary hover:bg-bg-secondary"
          >
            ›
          </button>
        </div>
        <button
          type="button"
          onClick={() => setWeekStart(startOfWeek(new Date()))}
          className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-primary px-3 py-1.5 text-[10px] text-text-secondary hover:bg-bg-secondary"
        >
          Hoy
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
        <div className="min-w-[700px]">

          {/* Day headers */}
          <div className="grid border-b-[0.5px] border-border-tertiary" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
            <div className="border-r-[0.5px] border-border-tertiary" />
            {weekDays.map((day, i) => {
              const isToday = isoDate(day) === isoDate(new Date());
              return (
                <div
                  key={i}
                  className="border-r-[0.5px] border-border-tertiary px-2 py-2 text-center last:border-r-0"
                >
                  <p className={`text-[9px] uppercase tracking-[0.05em] ${isToday ? "text-brand" : "text-text-tertiary"}`}>
                    {DAYS_ES[day.getDay()]}
                  </p>
                  <p className={`text-[14px] font-semibold leading-tight ${isToday ? "text-brand" : "text-text-primary"}`}>
                    {day.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {loading ? (
            <div className="py-12 text-center text-[11px] text-text-tertiary">Cargando...</div>
          ) : (
            HOURS.map(hour => (
              <div
                key={hour}
                className="grid border-b-[0.5px] border-border-tertiary last:border-b-0"
                style={{ gridTemplateColumns: "56px repeat(7, 1fr)", minHeight: "52px" }}
              >
                {/* Hour label */}
                <div className="flex items-start justify-center border-r-[0.5px] border-border-tertiary pt-1">
                  <span className="text-[9px] text-text-tertiary">{fmtHour(hour)}</span>
                </div>

                {/* Day cells */}
                {weekDays.map((day, di) => {
                  const dayStr = isoDate(day);
                  const cellVisits = visits.filter(
                    v => visitDay(v.scheduled_at) === dayStr && visitHour(v.scheduled_at) === hour
                  );
                  return (
                    <div
                      key={di}
                      className="relative border-r-[0.5px] border-border-tertiary p-1 last:border-r-0"
                    >
                      {cellVisits.map(v => {
                        const meta = STATUS_META[v.status];
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVisit(v)}
                            className="mb-1 w-full rounded-[6px] border-[0.5px] p-1.5 text-left transition hover:opacity-80"
                            style={{ background: meta.bg, borderColor: meta.border }}
                          >
                            <p className="truncate text-[9px] font-semibold" style={{ color: meta.color }}>
                              {v.lead_name ?? "Sin lead"}
                            </p>
                            <p className="truncate text-[8px]" style={{ color: meta.color, opacity: 0.8 }}>
                              {v.property_title ?? "Sin propiedad"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Visit detail modal */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-[14px] border-[0.5px] border-border-tertiary bg-bg-primary p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-text-primary">Detalle de visita</h2>
              <button type="button" onClick={() => setSelectedVisit(null)} className="text-[16px] text-text-tertiary">✕</button>
            </div>
            <div className="space-y-2 text-[11px]">
              <Row label="Lead"       value={selectedVisit.lead_name ?? "Sin lead"} />
              <Row label="Propiedad"  value={selectedVisit.property_title ?? "Sin propiedad"} />
              <Row label="Fecha/hora" value={new Date(selectedVisit.scheduled_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })} />
              <Row label="Duración"   value={`${selectedVisit.duration_min} min`} />
              <Row label="Estado"     value={STATUS_META[selectedVisit.status].label} />
              {selectedVisit.notes ? <Row label="Notas" value={selectedVisit.notes} /> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["confirmed", "done", "cancelled", "no_show"] as VisitStatus[])
                .filter(s => s !== selectedVisit.status)
                .map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void updateStatus(selectedVisit.id, s)}
                    className="rounded-[8px] border-[0.5px] px-3 py-1.5 text-[10px] transition hover:opacity-80"
                    style={{ background: STATUS_META[s].bg, color: STATUS_META[s].color, borderColor: STATUS_META[s].border }}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* Schedule modal — 5 steps */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[14px] border-[0.5px] border-border-tertiary bg-bg-primary shadow-lg">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b-[0.5px] border-border-tertiary px-5 py-4">
              <div>
                <h2 className="text-[13px] font-semibold text-text-primary">Agendar visita</h2>
                <p className="text-[10px] text-text-tertiary">Paso {form.step} de 5</p>
              </div>
              <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="text-[16px] text-text-tertiary">✕</button>
            </div>

            {/* Step indicator */}
            <div className="flex gap-1 px-5 pt-3">
              {[1,2,3,4,5].map(s => (
                <div
                  key={s}
                  className="h-1 flex-1 rounded-full transition-all"
                  style={{ background: s <= form.step ? "var(--color-brand)" : "var(--color-bg-tertiary)" }}
                />
              ))}
            </div>

            <div className="p-5">

              {/* Step 1 — Lead */}
              {form.step === 1 && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium text-text-primary">¿Qué lead va a visitar?</h3>
                  <select
                    className="input-base text-[11px]"
                    value={form.lead_id}
                    onChange={e => setForm(f => ({ ...f, lead_id: e.target.value }))}
                  >
                    <option value="">Sin lead asociado</option>
                    {leads.map(l => (
                      <option key={String(l.id)} value={String(l.id)}>
                        {String(l.name ?? "Sin nombre")} — {String(l.phone ?? "")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 2 — Property */}
              {form.step === 2 && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium text-text-primary">¿Qué propiedad van a visitar?</h3>
                  <select
                    className="input-base text-[11px]"
                    value={form.property_id}
                    onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Sin propiedad específica</option>
                    {props.map(p => (
                      <option key={String(p.id)} value={String(p.id)}>
                        {String(p.title_es ?? "Sin título")} — {String(p.city ?? "")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3 — Date & time */}
              {form.step === 3 && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium text-text-primary">Fecha y hora</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label-base">Fecha</label>
                      <input
                        type="date"
                        className="input-base text-[11px]"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="label-base">Hora</label>
                      <input
                        type="time"
                        className="input-base text-[11px]"
                        value={form.time}
                        onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-base">Duración</label>
                    <select
                      className="input-base text-[11px]"
                      value={form.duration_min}
                      onChange={e => setForm(f => ({ ...f, duration_min: Number(e.target.value) }))}
                    >
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={90}>1.5 horas</option>
                      <option value={120}>2 horas</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4 — Notes */}
              {form.step === 4 && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium text-text-primary">Notas internas</h3>
                  <textarea
                    className="input-base min-h-[100px] text-[11px]"
                    placeholder="Ej: cliente llega en auto, mostrar primero la alberca..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              )}

              {/* Step 5 — Confirm */}
              {form.step === 5 && (
                <div className="space-y-3">
                  <h3 className="text-[12px] font-medium text-text-primary">Confirmar visita</h3>
                  <div className="rounded-[10px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3 space-y-2 text-[11px]">
                    <Row label="Lead"       value={leads.find(l => l.id === form.lead_id) ? String(leads.find(l => l.id === form.lead_id)?.name ?? "") : "Sin lead"} />
                    <Row label="Propiedad"  value={props.find(p => p.id === form.property_id) ? String(props.find(p => p.id === form.property_id)?.title_es ?? "") : "Sin propiedad"} />
                    <Row label="Fecha"      value={new Date(`${form.date}T${form.time}`).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" })} />
                    <Row label="Duración"   value={`${form.duration_min} min`} />
                    {form.notes ? <Row label="Notas" value={form.notes} /> : null}
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="mt-5 flex justify-between">
                <button
                  type="button"
                  onClick={() => form.step > 1 ? setForm(f => ({ ...f, step: (f.step - 1) as ScheduleForm["step"] })) : setShowModal(false)}
                  className="text-[11px] text-text-tertiary hover:text-text-secondary"
                >
                  {form.step === 1 ? "Cancelar" : "← Atrás"}
                </button>
                {form.step < 5 ? (
                  <Button
                    variant="primary"
                    onClick={() => setForm(f => ({ ...f, step: (f.step + 1) as ScheduleForm["step"] }))}
                  >
                    Siguiente →
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => void saveVisit()} disabled={saving}>
                    {saving ? "Guardando..." : "Confirmar visita"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b-[0.5px] border-border-tertiary pb-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-text-tertiary">{label}</span>
      <span className="text-right font-medium text-text-primary">{value}</span>
    </div>
  );
}
