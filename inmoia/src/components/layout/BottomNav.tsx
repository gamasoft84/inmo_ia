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
              "inline-flex flex-col items-center justify-center gap-1 text-[9px] text-text-tertiary",
              active && "text-brand-dark",
            )}
          >
            <Icon size={14} />
            <span className="font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
