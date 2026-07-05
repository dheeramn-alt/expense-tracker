"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, FileText, LayoutDashboard, Plus, ReceiptText, Settings } from "lucide-react";
import { TransactionProvider } from "./transaction-provider";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Entries", icon: ReceiptText },
  { href: "/add", label: "Add", icon: Plus, featured: true },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <TransactionProvider>
      <div className="min-h-screen pb-24 lg:pb-0">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200/70 bg-white/90 p-6 backdrop-blur-xl lg:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-white">
              <Building2 size={22} />
            </span>
            <span>
              <span className="block text-lg font-black leading-none">Nammude Veedu</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Build. Track. Belong.</span>
            </span>
          </Link>

          <nav className="mt-12 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? "bg-mint text-forest" : "text-slate-500 hover:bg-slate-50 hover:text-ink"}`}>
                  <Icon size={19} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-ink p-5 text-white">
            <FileText size={20} className="text-emerald-300" />
            <p className="mt-4 text-sm font-bold">Every rupee has a story.</p>
            <p className="mt-1 text-xs leading-relaxed text-white/55">Keep your dream home on budget, one entry at a time.</p>
          </div>
        </aside>

        <main className="lg:ml-64">{children}</main>

        <nav className="fixed inset-x-3 bottom-3 z-50 grid h-16 grid-cols-5 items-center rounded-[1.4rem] border border-white/80 bg-white/95 px-2 shadow-2xl backdrop-blur-xl lg:hidden">
          {navItems.map(({ href, label, icon: Icon, featured }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`relative flex h-full flex-col items-center justify-center gap-1 text-[10px] font-bold ${active ? "text-forest" : "text-slate-400"}`}>
                <span className={featured ? "-mt-8 grid h-12 w-12 place-items-center rounded-2xl bg-forest text-white shadow-lg shadow-forest/25" : ""}>
                  <Icon size={featured ? 23 : 20} />
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </TransactionProvider>
  );
}
