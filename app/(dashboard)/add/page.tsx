import { PageHeader } from "@/components/page-header";
import { TransactionForm } from "@/components/transaction-form";

export default function AddPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-7 lg:px-10 lg:py-10">
      <PageHeader eyebrow="Daily entry" title="Add a transaction" subtitle="Record money coming in or going out. It only takes a moment." />
      <TransactionForm />
    </div>
  );
}
