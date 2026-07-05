"use client";

import { Download, Landmark, PieChart as PieIcon, Users, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatINR } from "@/lib/data";
import { PageHeader } from "./page-header";
import { useTransactions } from "./transaction-provider";

export function ReportsScreen() {
  const { transactions } = useTransactions();
  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = expenses.reduce((s, t) => s + t.amount, 0);
  const loan = transactions.filter((t) => t.category === "Bank Loan").reduce((s, t) => s + t.amount, 0);

  const categories = Object.entries(expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {})).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);

  const personData = ["Dheeraj", "Deepika"].map((name) => ({
    name,
    Expense: expenses.filter((t) => t.person === name).reduce((s, t) => s + t.amount, 0),
    Income: transactions.filter((t) => t.type === "income" && t.person === name).reduce((s, t) => s + t.amount, 0),
  }));

  function exportCSV() {
    const header = ["Date", "Type", "Category", "Amount", "Person", "Counterparty", "Payment Mode", "Description"];
    const rows = transactions.map((t) => [t.date, t.type, t.category, t.amount, t.person, t.counterparty, t.paymentMode, t.description]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "house-building-transactions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Financial insights"
        title="Reports"
        subtitle="Clear answers for better construction decisions."
        action={<button onClick={exportCSV} className="flex items-center gap-2 rounded-2xl bg-forest px-4 py-3 text-sm font-bold text-white"><Download size={17} /> Export CSV</button>}
      />
      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <Insight icon={Landmark} label="Loan utilised" value={`${Math.round(expense / loan * 100)}%`} detail={`${formatINR(expense)} spent`} />
        <Insight icon={WalletCards} label="Balance" value={formatINR(income - expense)} detail="Funds available" />
        <Insight icon={PieIcon} label="Top category" value={categories[0]?.name || "—"} detail={formatINR(categories[0]?.amount || 0)} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="card p-5 sm:p-7">
          <h2 className="font-black">Category-wise expense</h2>
          <p className="mt-1 text-xs text-slate-400">Share of total construction spend</p>
          <div className="mt-6 space-y-4">
            {categories.slice(0, 8).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between gap-3 text-xs"><span className="truncate font-bold">{item.name}</span><span className="shrink-0 font-black">{formatINR(item.amount)}</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-forest" style={{ width: `${item.amount / expense * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 sm:p-7">
          <h2 className="font-black">Person-wise summary</h2>
          <p className="mt-1 text-xs text-slate-400">Entries recorded against each person</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e9eee9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(value) => formatINR(Number(value))} contentStyle={{ borderRadius: 16, border: "none" }} />
                <Legend iconType="circle" />
                <Bar dataKey="Expense" fill="#e06d52" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Income" fill="#216e4e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card mt-4 overflow-hidden">
        <div className="border-b border-slate-100 p-5 sm:p-7"><h2 className="font-black">Payment mode report</h2><p className="mt-1 text-xs text-slate-400">How outgoing payments were made</p></div>
        <div className="divide-y divide-slate-100">
          {Object.entries(expenses.reduce<Record<string, number>>((acc, t) => { acc[t.paymentMode] = (acc[t.paymentMode] || 0) + t.amount; return acc; }, {})).sort((a,b) => b[1]-a[1]).map(([mode, amount]) => (
            <div key={mode} className="flex items-center justify-between px-5 py-4 sm:px-7"><span className="text-sm font-bold">{mode}</span><span className="text-sm font-black">{formatINR(amount)}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Insight({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: string; detail: string }) {
  return <div className="card p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-mint text-forest"><Icon size={18} /></span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-black">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>;
}
