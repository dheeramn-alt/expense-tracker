"use client";

import { ChevronRight, CircleDollarSign, CreditCard, LogOut, Tag, UserRound, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "./page-header";
import { createClient } from "@/lib/supabase/client";
import { useTransactions } from "./transaction-provider";

const settings = [
  { icon: UsersRound, title: "Persons", detail: "Dheeraj, Deepika, Bank, Other", count: "4" },
  { icon: Tag, title: "Categories", detail: "Income and expense categories", count: "27" },
  { icon: CreditCard, title: "Payment modes", detail: "Cash, UPI, bank transfer and more", count: "6" },
  { icon: CircleDollarSign, title: "Currency", detail: "Indian Rupee", count: "INR" },
];

export function SettingsScreen() {
  const router = useRouter();
  const { databaseConnected } = useTransactions();

  async function logout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Preferences" title="Settings" subtitle="Manage the people and options used in your tracker." />
      <section className="card mt-7 p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f0c7a8] text-lg font-black text-[#6e4027]">DD</div>
          <div className="min-w-0 flex-1"><h2 className="font-black">Dheeraj Muraleedharan</h2><p className="mt-1 truncate text-sm text-slate-400">dheeraj@example.com</p></div>
          <span className="rounded-full bg-mint px-3 py-1 text-[10px] font-black uppercase tracking-wider text-forest">Owner</span>
        </div>
      </section>
      <section className="card mt-4 flex items-center justify-between p-5 sm:px-7">
        <div><p className="text-sm font-black">Supabase database</p><p className="mt-1 text-xs text-slate-400">{databaseConnected ? "Cloud authentication and storage enabled" : "Running in local preview mode"}</p></div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${databaseConnected ? "bg-mint text-forest" : "bg-amber-50 text-amber-700"}`}>{databaseConnected ? "Connected" : "Not connected"}</span>
      </section>
      <section className="card mt-4 overflow-hidden">
        {settings.map(({ icon: Icon, title, detail, count }) => (
          <button key={title} className="flex w-full items-center gap-4 border-b border-slate-100 p-5 text-left last:border-0 sm:px-7">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-forest"><Icon size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-black">{title}</span><span className="mt-1 block truncate text-xs text-slate-400">{detail}</span></span>
            <span className="text-xs font-bold text-slate-400">{count}</span><ChevronRight size={17} className="text-slate-300" />
          </button>
        ))}
      </section>
      <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-red-600"><LogOut size={18} /> Log out</button>
      <p className="mt-6 text-center text-xs text-slate-400">Nammude Veedu · Version 1.0</p>
    </div>
  );
}
