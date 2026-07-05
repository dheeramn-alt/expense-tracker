"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { demoTransactions } from "@/lib/data";
import { Transaction, TransactionInput } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type TrackerContextValue = {
  transactions: Transaction[];
  loading: boolean;
  databaseConnected: boolean;
  addTransaction: (input: TransactionInput) => Promise<void>;
  updateTransaction: (id: string, input: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  uploadAttachment: (file: File) => Promise<string>;
  getAttachmentUrl: (path: string) => Promise<string>;
};

const TrackerContext = createContext<TrackerContextValue | null>(null);
const STORAGE_KEY = "nammude-veedu-transactions";
const supabase = createClient();

type ReferenceIds = {
  persons: Record<string, string>;
  categories: Record<string, string>;
  paymentModes: Record<string, string>;
};

type DatabaseTransaction = {
  id: string;
  transaction_date: string;
  type: "income" | "expense";
  amount: number | string;
  counterparty: string;
  description: string | null;
  attachment_url: string | null;
  category: { name: string } | { name: string }[];
  person: { name: string } | { name: string }[];
  payment_mode: { name: string } | { name: string }[] | null;
};

function relationName(value: { name: string } | { name: string }[] | null) {
  if (!value) return "Other";
  return Array.isArray(value) ? value[0]?.name ?? "Other" : value.name;
}

function fromDatabase(row: DatabaseTransaction): Transaction {
  return {
    id: row.id,
    date: row.transaction_date,
    type: row.type,
    category: relationName(row.category),
    amount: Number(row.amount),
    person: relationName(row.person),
    counterparty: row.counterparty,
    paymentMode: relationName(row.payment_mode),
    description: row.description ?? "",
    attachmentUrl: row.attachment_url ?? undefined,
  };
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [referenceIds, setReferenceIds] = useState<ReferenceIds | null>(null);

  useEffect(() => {
    if (supabase) {
      const client = supabase;
      async function loadDatabase() {
        const [transactionsResult, personsResult, categoriesResult, modesResult] = await Promise.all([
          client.from("transactions").select(`
            id, transaction_date, type, amount, counterparty, description, attachment_url,
            category:categories(name),
            person:persons(name),
            payment_mode:payment_modes(name)
          `).order("transaction_date", { ascending: false }),
          client.from("persons").select("id,name"),
          client.from("categories").select("id,name"),
          client.from("payment_modes").select("id,name"),
        ]);

        if (!transactionsResult.error && transactionsResult.data) {
          setTransactions((transactionsResult.data as unknown as DatabaseTransaction[]).map(fromDatabase));
        }
        if (personsResult.data && categoriesResult.data && modesResult.data) {
          setReferenceIds({
            persons: Object.fromEntries(personsResult.data.map((item) => [item.name, item.id])),
            categories: Object.fromEntries(categoriesResult.data.map((item) => [item.name, item.id])),
            paymentModes: Object.fromEntries(modesResult.data.map((item) => [item.name, item.id])),
          });
        }
        setLoading(false);
      }
      void loadDatabase();
      const channel = client
        .channel("house-tracker-transactions")
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
          void loadDatabase();
        })
        .subscribe();
      return () => { void client.removeChannel(channel); };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  async function addTransaction(input: TransactionInput) {
    if (!supabase) {
      setTransactions((items) => [{ ...input, id: crypto.randomUUID() }, ...items]);
      return;
    }
    if (!referenceIds) throw new Error("Database options are still loading.");
    const { data, error } = await supabase.from("transactions").insert({
      transaction_date: input.date,
      type: input.type,
      category_id: referenceIds.categories[input.category],
      amount: input.amount,
      person_id: referenceIds.persons[input.person],
      counterparty: input.counterparty,
      payment_mode_id: referenceIds.paymentModes[input.paymentMode],
      description: input.description,
      attachment_url: input.attachmentUrl ?? null,
    }).select(`
      id, transaction_date, type, amount, counterparty, description, attachment_url,
      category:categories(name), person:persons(name), payment_mode:payment_modes(name)
    `).single();
    if (error) throw error;
    setTransactions((items) => [fromDatabase(data as unknown as DatabaseTransaction), ...items]);
  }

  async function updateTransaction(id: string, input: TransactionInput) {
    if (!supabase) {
      setTransactions((items) => items.map((item) => item.id === id ? { ...input, id } : item));
      return;
    }
    if (!referenceIds) throw new Error("Database options are still loading.");
    const { data, error } = await supabase.from("transactions").update({
      transaction_date: input.date,
      type: input.type,
      category_id: referenceIds.categories[input.category],
      amount: input.amount,
      person_id: referenceIds.persons[input.person],
      counterparty: input.counterparty,
      payment_mode_id: referenceIds.paymentModes[input.paymentMode],
      description: input.description,
      attachment_url: input.attachmentUrl ?? null,
    }).eq("id", id).select(`
      id, transaction_date, type, amount, counterparty, description, attachment_url,
      category:categories(name), person:persons(name), payment_mode:payment_modes(name)
    `).single();
    if (error) throw error;
    const updated = fromDatabase(data as unknown as DatabaseTransaction);
    setTransactions((items) => items.map((item) => item.id === id ? updated : item));
  }

  async function deleteTransaction(id: string) {
    if (supabase) {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    }
    setTransactions((items) => items.filter((item) => item.id !== id));
  }

  async function uploadAttachment(file: File) {
    if (!supabase) throw new Error("Connect Supabase before uploading attachments.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Please sign in before uploading an attachment.");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage
      .from("transaction-attachments")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    return path;
  }

  async function getAttachmentUrl(path: string) {
    if (!supabase) return path;
    const { data, error } = await supabase.storage
      .from("transaction-attachments")
      .createSignedUrl(path, 60 * 10);
    if (error) throw error;
    return data.signedUrl;
  }

  return (
    <TrackerContext.Provider value={{
      transactions,
      loading,
      databaseConnected: Boolean(supabase),
      addTransaction,
      updateTransaction,
      deleteTransaction,
      uploadAttachment,
      getAttachmentUrl,
    }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TrackerContext);
  if (!context) throw new Error("useTransactions must be used within TransactionProvider");
  return context;
}
