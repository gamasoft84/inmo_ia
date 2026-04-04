"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

type TopbarProps = {
  title: string;
};

export function Topbar({ title }: TopbarProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="topbar">
      <div>
        <p className="page-title">{title}</p>
      </div>

      <div className="hidden w-[280px] lg:block">
        <Input placeholder="Buscar leads, propiedades..." className="h-[34px]" />
      </div>

      <div className="inline-flex items-center gap-2">
        <Button variant="brand-soft" size="sm" ai>
          Sugerir con IA
        </Button>
        <Button variant="ghost" size="sm" aria-label="Notificaciones">
          <Bell size={14} />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Buscar">
          <Search size={14} />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Cerrar sesion" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut size={14} />
        </Button>
      </div>
    </header>
  );
}
