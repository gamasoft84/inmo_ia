"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type TopbarProps = {
  title: string;
};

export function Topbar({ title }: TopbarProps) {
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
      </div>
    </header>
  );
}
