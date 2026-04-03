import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PublicPropertyPage() {
  return (
    <main className="min-h-screen bg-bg-secondary">
      <nav className="flex items-center justify-between border-b-[0.5px] border-border-tertiary bg-bg-primary px-4 py-2">
        <div className="text-[13px] font-medium text-text-primary">🌊 Agencia Aguilar</div>
        <div className="flex items-center gap-1">
          <button className="rounded-[6px] border-[0.5px] border-border-secondary bg-bg-secondary px-2 py-1 text-[10px]">🇲🇽 ES</button>
          <button className="rounded-[6px] border-[0.5px] border-border-secondary bg-bg-secondary px-2 py-1 text-[10px]">🇺🇸 EN</button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="overflow-hidden rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary">
          <div className="flex h-[280px] items-center justify-center bg-gradient-to-br from-[#8B7355] to-[#C4A882] text-[80px]">
            🏡
          </div>

          <div className="space-y-3 p-4">
            <p className="text-[10px] font-semibold tracking-[0.04em] text-brand">CASA EN VENTA</p>
            <h1 className="text-[20px] font-medium tracking-[-0.02em] text-text-primary">Casa con jardin en Coyoacan</h1>
            <p className="text-[24px] font-medium text-brand-dark">$5,800,000</p>

            <div className="flex flex-wrap gap-2 text-[11px] text-text-secondary">
              <span>📐 210m²</span>
              <span>🛏 3 rec</span>
              <span>🚿 2 baños</span>
              <span>🚗 2 estacionamientos</span>
            </div>

            <p className="text-[12px] leading-relaxed text-text-secondary">
              Residencia en calle tranquila de Coyoacan, con jardin privado, cocina integral y acabados premium.
              Cercana a vias principales, escuelas y servicios.
            </p>

            <div className="rounded-[8px] border-[0.5px] border-border-tertiary bg-bg-secondary p-3">
              <p className="text-[10px] text-text-tertiary">Ubicacion aproximada</p>
              <p className="mt-1 text-[12px] font-medium text-text-primary">Coyoacan, CDMX</p>
              <p className="mt-1 text-[10px] text-text-tertiary">Por privacidad, la direccion exacta se comparte al confirmar interes.</p>
            </div>
          </div>
        </article>

        <aside className="space-y-3">
          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h2 className="text-[12px] font-medium">Agenda una visita</h2>
            <p className="mt-1 text-[11px] text-text-tertiary">Respuesta en minutos por WhatsApp.</p>
            <div className="mt-3 space-y-2">
              <Button variant="primary" full>
                📅 Agendar visita
              </Button>
              <Button variant="whatsapp" full>
                WhatsApp
              </Button>
            </div>
          </div>

          <div className="rounded-[12px] border-[0.5px] border-border-tertiary bg-bg-primary p-3">
            <h3 className="text-[12px] font-medium">Propiedades similares</h3>
            <div className="mt-2 space-y-2">
              <Link href="/p/casa-pedregal-260m2-f11c" className="block rounded-[8px] border-[0.5px] border-border-tertiary p-2">
                <p className="text-[11px] font-medium text-text-primary">🏠 Casa Pedregal</p>
                <p className="text-[10px] text-brand-dark">$6,200,000</p>
              </Link>
              <Link href="/p/depto-del-valle-130m2-a12d" className="block rounded-[8px] border-[0.5px] border-border-tertiary p-2">
                <p className="text-[11px] font-medium text-text-primary">🏢 Depto Del Valle</p>
                <p className="text-[10px] text-brand-dark">$4,900,000</p>
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
