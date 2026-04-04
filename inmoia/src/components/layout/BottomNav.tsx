"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/propiedades", label: "Props", icon: Building2 },
  { href: "/chatbot", label: "Chat", icon: MessageSquare },
  { href: "/configuracion", label: "Config", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative inline-flex flex-col items-center justify-center gap-1 pt-1 text-[10px]",
              active ? "text-brand-dark" : "text-text-tertiary",
            )}
          >
            {/* Barra indicadora superior */}
            <span
              className={cn(
                "absolute top-0 h-[3px] w-8 rounded-full transition-all duration-200",
                active ? "bg-brand" : "bg-transparent",
              )}
            />
            <Icon size={20} strokeWidth={active ? 2.2 : 1.6} />
            <span className={cn("font-medium", active && "font-semibold")}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
