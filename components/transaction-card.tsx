"use client";

import { format, parseISO } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, MoreVertical, Paperclip, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/data";
import { Transaction } from "@/lib/types";
import { useTransactions } from "./transaction-provider";

export function TransactionCard({ transaction, compact = false }: { transaction: Transaction; compact?: boolean }) {
  const { deleteTransaction, getAttachmentUrl } = useTransactions();
  const income = transaction.type === "income";

  return (
    <article className={`group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white ${compact ? "px-1 py-3" : "p-4"}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${income ? "bg-mint text-forest" : "bg-orange-50 text-coral"}`}>
        {income ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-ink">{transaction.category}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-400">{transaction.counterparty} · {transaction.person}</p>
          </div>
          <p className={`shrink-0 text-sm font-black ${income ? "text-forest" : "text-ink"}`}>
            {income ? "+" : "−"}{formatINR(transaction.amount)}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>{format(parseISO(transaction.date), "dd MMM yyyy")} · {transaction.paymentMode}</span>
          {!compact && <span className="flex items-center gap-1">
            <Link href={`/transactions/${transaction.id}`} className="rounded-lg p-1 text-slate-300 hover:bg-mint hover:text-forest" aria-label="Edit transaction"><Pencil size={15} /></Link>
            <button onClick={() => { if (confirm("Delete this transaction?")) void deleteTransaction(transaction.id); }} className="rounded-lg p-1 text-slate-300 hover:bg-red-50 hover:text-red-500" aria-label="Delete transaction"><Trash2 size={15} /></button>
          </span>}
        </div>
        {!compact && transaction.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{transaction.description}</p>}
        {!compact && transaction.attachmentUrl && (
          <button
            onClick={async () => window.open(await getAttachmentUrl(transaction.attachmentUrl!), "_blank", "noopener,noreferrer")}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-forest"
          >
            <Paperclip size={13} /> View attachment
          </button>
        )}
      </div>
      {compact && <MoreVertical size={16} className="text-slate-300" />}
    </article>
  );
}
