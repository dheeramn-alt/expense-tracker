"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Landmark, Plus, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatINR } from "@/lib/data";
import { useTransactions } from "./transaction-provider";
import { TransactionCard } from "./transaction-card";
import { PageHeader } from "./page-header";

const colors = ["#216e4e", "#e6ad60", "#e06d52", "#6f8f80", "#a3c9b5", "#876c99"];

export function Dashboard() {
  const { transactions } = useTransactions();
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const loan = transactions.filter((t) => t.type === "income" && t.category === "Bank Loan").reduce((s, t) => s + t.amount, 0);
  const monthKey = "2026-07";
  const thisMonthExpense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(monthKey)).reduce((s, t) => s + t.amount, 0);
  const thisMonthIncome = transactions.filter((t) => t.type === "income" && t.date.startsWith(monthKey)).reduce((s, t) => s + t.amount, 0);

  const spendByPerson = ["Dheeraj", "Deepika"].map((person) => ({
    person,
    amount: transactions.filter((t) => t.type === "expense" && t.person === person).reduce((s, t) => s + t.amount, 0),
  }));

  const categoryData = Object.entries(
    transactions.filter((t) => t.type === "expense").reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  const monthly = ["Apr", "May", "Jun", "Jul"].map((label, index) => {
    const prefix = `2026-${String(index + 4).padStart(2, "0")}`;
    return {
      month: label,
      Income: transactions.filter((t) => t.type === "income" && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0),
      Expense: transactions.filter((t) => t.type === "expense" && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0),
    };
  });

  const cards = [
    { label: "Total income", value: income, detail: "All funds received", icon: ArrowDownLeft, tone: "bg-mint text-forest" },
    { label: "Total expense", value: expense, detail: `${Math.round((expense / income) * 100)}% of income used`, icon: ArrowUpRight, tone: "bg-orange-50 text-coral" },
    { label: "Remaining balance", value: income - expense, detail: "Available to spend", icon: WalletCards, tone: "bg-blue-50 text-blue-600" },
    { label: "Bank loan received", value: loan, detail: `${Math.round((loan / income) * 100)}% of total income`, icon: Landmark, tone: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow={format(new Date(2026, 6, 4), "EEEE, dd MMMM")}
        title="Good evening, Dheeraj"
        subtitle="Here’s where your dream home stands today."
        action={<Link href="/add" className="hidden items-center gap-2 rounded-2xl bg-forest px-4 py-3 text-sm font-bold text-white shadow-lg shadow-forest/20 sm:flex"><Plus size={18} /> Add entry</Link>}
      />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={18} /></span>
            </div>
            <p className="mt-4 text-2xl font-black tracking-tight">{formatINR(value)}</p>
            <p className="mt-2 text-xs text-slate-400">{detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-white/45">This month</p>
          <div className="mt-4 flex items-end justify-between">
            <div><p className="text-xs text-white/50">Expense</p><p className="mt-1 text-2xl font-black">{formatINR(thisMonthExpense)}</p></div>
            <ArrowUpRight className="text-coral" />
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-coral" style={{ width: `${Math.min(100, thisMonthExpense / Math.max(thisMonthIncome, 1) * 100)}%` }} /></div>
        </div>
        <div className="rounded-3xl bg-forest p-6 text-white shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50">This month</p>
          <div className="mt-4 flex items-end justify-between">
            <div><p className="text-xs text-white/60">Income</p><p className="mt-1 text-2xl font-black">{formatINR(thisMonthIncome)}</p></div>
            <ArrowDownLeft className="text-emerald-200" />
          </div>
          <p className="mt-5 text-xs text-white/55">Includes the latest loan disbursement</p>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="card p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div><h2 className="font-black">Cash flow</h2><p className="mt-1 text-xs text-slate-400">Income and expense by month</p></div>
            <span className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">Apr – Jul</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barGap={4}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e9eee9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8a9990" }} />
                <YAxis hide />
                <Tooltip formatter={(value) => formatINR(Number(value))} contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 8px 30px rgba(0,0,0,.1)", fontSize: 12 }} />
                <Bar dataKey="Income" fill="#216e4e" radius={[7, 7, 0, 0]} />
                <Bar dataKey="Expense" fill="#e6ad60" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-forest" />Income</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#e6ad60]" />Expense</span></div>
        </div>

        <div className="card p-5 sm:p-7">
          <h2 className="font-black">Expense breakdown</h2>
          <p className="mt-1 text-xs text-slate-400">Top categories overall</p>
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {categoryData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatINR(Number(value))} contentStyle={{ borderRadius: 16, border: "none", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((item, i) => <div key={item.name} className="flex items-center gap-2 text-[11px] text-slate-500"><i className="h-2 w-2 rounded-full" style={{ background: colors[i] }} /><span className="truncate">{item.name}</span></div>)}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.55fr]">
        <div className="card p-5 sm:p-7">
          <h2 className="font-black">Who spent what</h2>
          <div className="mt-5 space-y-5">
            {spendByPerson.map(({ person, amount }, i) => (
              <div key={person}>
                <div className="flex items-center justify-between text-sm"><span className="font-bold">{person}</span><span className="font-black">{formatINR(amount)}</span></div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full" style={{ width: `${amount / Math.max(...spendByPerson.map((p) => p.amount)) * 100}%`, background: colors[i] }} /></div>
              </div>
            ))}
          </div>
          <Link href="/reports" className="mt-6 flex items-center gap-2 text-xs font-black text-forest">View detailed report <ArrowRight size={14} /></Link>
        </div>

        <div className="card p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><h2 className="font-black">Recent activity</h2><p className="mt-1 text-xs text-slate-400">Your latest five entries</p></div><Link href="/transactions" className="text-xs font-bold text-forest">View all</Link></div>
          <div className="mt-3 divide-y divide-slate-100">
            {transactions.slice(0, 5).map((t) => <TransactionCard key={t.id} transaction={t} compact />)}
          </div>
        </div>
      </section>
    </div>
  );
}
