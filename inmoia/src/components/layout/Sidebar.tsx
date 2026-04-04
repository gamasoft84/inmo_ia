"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Building2, Calendar, type LucideIcon, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/calendario", label: "Calendario", icon: Calendar },
  { href: "/reportes", label: "Reportes", icon: BarChart2 },
  { href: "/configuracion", label: "Configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar hidden md:block">
      <div className="border-b border-[0.5px] border-sidebar-border px-4 py-4">
        <p className="text-[13px] font-medium text-white">🏡 InmoIA</p>
        <p className="mt-1 text-[10px] text-sidebar-muted">Gamasoft IA Technologies</p>
      </div>

      <p className="sidebar-section-label">Principal</p>
      <nav className="pb-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className={cn("sidebar-item", active && "active")}>
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
