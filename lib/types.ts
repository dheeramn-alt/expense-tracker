export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  person: string;
  counterparty: string;
  paymentMode: string;
  description: string;
  attachmentUrl?: string;
};

export type TransactionInput = Omit<Transaction, "id">;
