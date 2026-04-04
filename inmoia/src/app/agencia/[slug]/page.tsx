import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { CatalogoCliente } from "./CatalogoCliente";

type Props = { params: { slug: string } };

async function getAgencyData(slug: string) {
  const supabase = createServiceClient();

  const { data: agency } = await supabase
    .from("agencies")
    .select("id, name, slug, logo_url, brand_emoji, whatsapp_number, bot_name")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!agency) return null;

  const { data: properties } = await supabase
    .from("properties")
    .select("id, slug, title_es, title_en, type, operation, price_mxn, price_usd, area_total, bedrooms, bathrooms, city, photos, amenities")
    .eq("agency_id", agency.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  return { agency, properties: properties ?? [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getAgencyData(params.slug);
  if (!data) return { title: "Agencia no encontrada" };
  return {
    title: `${data.agency.name} — Propiedades`,
    description: `Catálogo de propiedades de ${data.agency.name}. ${data.properties.length} propiedades disponibles.`,
    openGraph: {
      title: `${data.agency.name} — Propiedades`,
      description: `Encuentra tu propiedad ideal con ${data.agency.name}`,
    },
  };
}

export default async function AgenciaPage({ params }: Props) {
  const data = await getAgencyData(params.slug);
  if (!data) notFound();

  return <CatalogoCliente agency={data.agency} properties={data.properties} />;
}
