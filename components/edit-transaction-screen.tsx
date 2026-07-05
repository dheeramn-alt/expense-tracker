"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "./page-header";
import { TransactionForm } from "./transaction-form";
import { useTransactions } from "./transaction-provider";

export function EditTransactionScreen() {
  const params = useParams<{ id: string }>();
  const { transactions } = useTransactions();
  const transaction = transactions.find((item) => item.id === params.id);

  if (!transaction) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black">Transaction not found</h1>
        <p className="mt-2 text-sm text-slate-400">It may have been removed already.</p>
        <Link href="/transactions" className="mt-6 inline-block rounded-2xl bg-forest px-5 py-3 text-sm font-bold text-white">Back to transactions</Link>
      </div>
    );
  }

  const { id, ...initial } = transaction;
  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Transaction details" title="Edit transaction" subtitle="Update the entry and keep your records accurate." />
      <TransactionForm initial={initial} transactionId={id} />
    </div>
  );
}
