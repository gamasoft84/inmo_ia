import Link from "next/link";
import { Plus } from "lucide-react";

export function FAB() {
  return (
    <Link href="/propiedades/nueva" className="fab md:hidden" aria-label="Crear propiedad">
      <Plus size={20} />
    </Link>
  );
}
