"use client";

import { Download, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { expenseCategories, incomeCategories, paymentModes, persons } from "@/lib/data";
import { PageHeader } from "./page-header";
import { TransactionCard } from "./transaction-card";
import { useTransactions } from "./transaction-provider";

export function TransactionsScreen() {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [person, setPerson] = useState("all");

  const filtered = useMemo(() => transactions.filter((t) => {
    const query = search.toLowerCase();
    return (type === "all" || t.type === type)
      && (person === "all" || t.person === person)
      && (!query || `${t.category} ${t.counterparty} ${t.description} ${t.paymentMode}`.toLowerCase().includes(query));
  }), [transactions, search, type, person]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader eyebrow={`${filtered.length} records`} title="Transactions" subtitle="Search, filter, and review every rupee." />
      <div className="card mt-7 p-4 sm:p-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input className="field pl-11" placeholder="Search vendor, category, notes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <span className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500"><SlidersHorizontal size={14} /> Filters</span>
          <select className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <select className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold" value={person} onChange={(e) => setPerson(e.target.value)}>
            <option value="all">All people</option>{persons.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)}
      </div>
      {filtered.length === 0 && <div className="card mt-4 p-12 text-center"><p className="font-black">No matching transactions</p><p className="mt-2 text-sm text-slate-400">Try changing your search or filters.</p></div>}
    </div>
  );
}
