import { Transaction } from "./types";

export const expenseCategories = [
  "Land", "Foundation", "Cement", "Sand", "Metal", "Steel", "Bricks / Blocks",
  "Labour", "Mason", "Carpenter", "Electrician", "Plumbing", "Tiles", "Paint",
  "Wood", "Doors & Windows", "Roofing", "Electrical Materials",
  "Plumbing Materials", "Transport", "Food / Tea / Daily Site Expense",
  "Permit / Legal", "Other",
];

export const incomeCategories = [
  "Bank Loan", "Personal Savings", "Family Support", "Other Income",
];

export const persons = ["Dheeraj", "Deepika", "Bank", "Other"];
export const paymentModes = ["Cash", "UPI", "Bank Transfer", "Cheque", "Loan", "Other"];

export const demoTransactions: Transaction[] = [
  { id: "1", date: "2026-07-03", type: "expense", category: "Steel", amount: 184500, person: "Dheeraj", counterparty: "Malabar Steel Traders", paymentMode: "Bank Transfer", description: "TMT steel for first-floor slab" },
  { id: "2", date: "2026-07-02", type: "expense", category: "Labour", amount: 42000, person: "Deepika", counterparty: "Shaji & team", paymentMode: "UPI", description: "Weekly labour payment" },
  { id: "3", date: "2026-07-01", type: "income", category: "Bank Loan", amount: 500000, person: "Bank", counterparty: "SBI Housing Loan", paymentMode: "Loan", description: "Third loan disbursement" },
  { id: "4", date: "2026-06-28", type: "expense", category: "Cement", amount: 96750, person: "Dheeraj", counterparty: "BuildMart", paymentMode: "Cheque", description: "150 bags OPC cement" },
  { id: "5", date: "2026-06-25", type: "expense", category: "Sand", amount: 38500, person: "Deepika", counterparty: "River Sand Supply", paymentMode: "Cash", description: "Two loads of M-sand" },
  { id: "6", date: "2026-06-20", type: "expense", category: "Electrical Materials", amount: 61200, person: "Dheeraj", counterparty: "Power House Electricals", paymentMode: "UPI", description: "Conduits, boxes and wiring" },
  { id: "7", date: "2026-06-15", type: "income", category: "Personal Savings", amount: 250000, person: "Deepika", counterparty: "Savings account", paymentMode: "Bank Transfer", description: "Transferred house savings" },
  { id: "8", date: "2026-06-12", type: "expense", category: "Bricks / Blocks", amount: 145000, person: "Dheeraj", counterparty: "AAC Blocks Kerala", paymentMode: "Bank Transfer", description: "First-floor blocks" },
  { id: "9", date: "2026-05-30", type: "income", category: "Bank Loan", amount: 1200000, person: "Bank", counterparty: "SBI Housing Loan", paymentMode: "Loan", description: "Second loan disbursement" },
  { id: "10", date: "2026-05-20", type: "expense", category: "Foundation", amount: 385000, person: "Dheeraj", counterparty: "Various", paymentMode: "Bank Transfer", description: "Foundation materials and work" },
  { id: "11", date: "2026-04-10", type: "income", category: "Bank Loan", amount: 800000, person: "Bank", counterparty: "SBI Housing Loan", paymentMode: "Loan", description: "First loan disbursement" },
  { id: "12", date: "2026-04-04", type: "expense", category: "Permit / Legal", amount: 28500, person: "Deepika", counterparty: "Panchayat office", paymentMode: "UPI", description: "Building permit and plan fee" },
];

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
