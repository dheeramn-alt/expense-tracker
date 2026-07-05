"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Check, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { expenseCategories, incomeCategories, paymentModes, persons } from "@/lib/data";
import { TransactionInput, TransactionType } from "@/lib/types";
import { useTransactions } from "./transaction-provider";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Choose a category"),
  amount: z.number().positive("Amount must be greater than zero"),
  person: z.string().min(1, "Choose a person"),
  counterparty: z.string().min(1, "Enter who this was paid to or received from"),
  paymentMode: z.string().min(1, "Choose a payment mode"),
  description: z.string(),
  attachmentUrl: z.string().optional(),
});

export function TransactionForm({ initial, transactionId }: { initial?: TransactionInput; transactionId?: string }) {
  const router = useRouter();
  const { addTransaction, updateTransaction, uploadAttachment } = useTransactions();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const form = useForm<TransactionInput>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      date: format(new Date(), "yyyy-MM-dd"),
      type: "expense",
      category: "",
      amount: 0,
      person: "Dheeraj",
      counterparty: "",
      paymentMode: "UPI",
      description: "",
      attachmentUrl: undefined,
    },
  });
  const type = form.watch("type") as TransactionType;
  const categories = type === "income" ? incomeCategories : expenseCategories;

  function selectType(next: TransactionType) {
    form.setValue("type", next);
    form.setValue("category", "");
  }

  async function onSubmit(values: TransactionInput) {
    setSaveError("");
    try {
      if (attachment && attachment.size > 10 * 1024 * 1024) {
        throw new Error("Attachment must be smaller than 10 MB.");
      }
      const attachmentUrl = attachment ? await uploadAttachment(attachment) : values.attachmentUrl;
      const payload = { ...values, attachmentUrl };
      if (transactionId) await updateTransaction(transactionId, payload);
      else await addTransaction(payload);
      setSaved(true);
      setTimeout(() => router.push("/transactions"), 700);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save this transaction.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="card mt-7 overflow-hidden">
      <div className="border-b border-slate-100 p-5 sm:p-7">
        <p className="label">Entry type</p>
        <div className="grid grid-cols-2 gap-3">
          {(["expense", "income"] as TransactionType[]).map((item) => {
            const active = type === item;
            const Icon = item === "income" ? ArrowDownLeft : ArrowUpRight;
            return (
              <button key={item} type="button" onClick={() => selectType(item)} className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black capitalize transition ${active ? item === "income" ? "border-forest bg-mint text-forest" : "border-coral bg-orange-50 text-coral" : "border-slate-200 text-slate-400"}`}>
                <Icon size={18} /> {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
        <Field label="Date" error={form.formState.errors.date?.message}>
          <input type="date" className="field" {...form.register("date")} />
        </Field>
        <Field label="Amount (INR)" error={form.formState.errors.amount?.message}>
          <div className="relative"><span className="absolute left-4 top-3 text-slate-400">₹</span><input type="number" inputMode="decimal" min="0" step="0.01" className="field pl-8 text-lg font-black" placeholder="0" {...form.register("amount", { valueAsNumber: true })} /></div>
        </Field>
        <Field label="Category" error={form.formState.errors.category?.message}>
          <select className="field" {...form.register("category")}><option value="">Select category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label={type === "expense" ? "Paid by" : "Received by"} error={form.formState.errors.person?.message}>
          <select className="field" {...form.register("person")}>{persons.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label={type === "expense" ? "Paid to" : "Received from"} error={form.formState.errors.counterparty?.message}>
          <input className="field" placeholder={type === "expense" ? "Vendor or person name" : "Source of income"} {...form.register("counterparty")} />
        </Field>
        <Field label="Payment mode" error={form.formState.errors.paymentMode?.message}>
          <select className="field" {...form.register("paymentMode")}>{paymentModes.map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Description / notes" className="sm:col-span-2">
          <textarea rows={3} className="field resize-none" placeholder="Add details that will help you remember this entry…" {...form.register("description")} />
        </Field>
        <div className="sm:col-span-2">
          <p className="label">Bill or receipt (optional)</p>
          <label htmlFor="attachment" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-bold text-slate-500 hover:border-forest hover:text-forest">
            <Paperclip size={18} /> {attachment ? attachment.name : initial?.attachmentUrl ? "Replace current attachment" : "Attach a photo or PDF"}
          </label>
          <input
            id="attachment"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
          />
          {attachment && attachment.size > 10 * 1024 * 1024 && <p className="mt-2 text-xs font-bold text-red-500">Attachment must be smaller than 10 MB.</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:p-7">
        {saveError && <p className="mr-auto text-xs font-bold text-red-500">{saveError}</p>}
        <button type="button" onClick={() => router.back()} className="rounded-2xl px-5 py-3 text-sm font-bold text-slate-500">Cancel</button>
        <button type="submit" className="flex min-w-36 items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-3 text-sm font-black text-white shadow-lg shadow-forest/20">
          {saved ? <><Check size={18} /> Saved</> : transactionId ? "Update entry" : "Save entry"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <div className={className}><label className="label">{label}</label>{children}{error && <p className="mt-1.5 text-xs font-bold text-red-500">{error}</p>}</div>;
}
