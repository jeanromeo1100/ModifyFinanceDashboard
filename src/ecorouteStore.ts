import { useSyncExternalStore } from "react";

export type CompanyStatus = "Active" | "Pending" | "Suspended" | "Rejected";
export type Company = {
  id: string;
  name: string;
  type: "Waste operator" | "Municipal partner";
  license: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
  requested: string;
  users: number;
  status: CompanyStatus;
  isNew?: boolean;
  rejectionReason?: string;
  rejectionNotes?: string;
  history: string[];
  activeCollections?: number;
};

export type MessageRole = "Admin" | "Manager" | "Finance" | "Employee" | "Customer";
export type Message = {
  id: string;
  role: MessageRole;
  title: string;
  text: string;
  time: string;
  channel: "App" | "SMS" | "App + SMS";
  category: "SMS" | "Alerts" | "Payments" | "Collections" | "Inbox" | "System";
  unread: boolean;
  action?: string;
  relatedPage?: string;
};

export type Invoice = {
  id: string;
  customerId: string;
  customer: string;
  period: string;
  plan: string;
  amount: number;
  dueDate: string;
  status: "Unpaid" | "Overdue" | "Paid" | "Partially paid";
  paidAmount: number;
};

export type Payment = {
  id: string;
  receipt: string;
  invoiceId: string;
  customerId: string;
  customer: string;
  period: string;
  amount: number;
  method: string;
  reference: string;
  date: string;
  status: "Paid" | "Failed" | "Pending confirmation";
  recordedBy: string;
  manual?: boolean;
  credit?: number;
};

export type ActivityEntry = { id: string; time: string; user: string; action: string; module: string; record: string; status: string };
export type UserRecord = { id: string; name: string; email: string; role: string; company: string; status: "Active" | "Pending" | "Inactive" | "Locked" };

export const servicePlans = [
  { name: "Household Basic", customerType: "Household", kg: "Up to 120 kg / month", waste: "General", period: "Monthly", price: 5000, status: "Active" },
  { name: "Household Standard", customerType: "Household", kg: "Up to 240 kg / month", waste: "General, Organic, Recyclable", period: "Monthly", price: 6000, status: "Active" },
  { name: "Household Large / Shared compound", customerType: "Household", kg: "Up to 500 kg / month", waste: "General, Organic, Recyclable", period: "Monthly", price: 10000, status: "Active" },
  { name: "Business Weekly", customerType: "Business", kg: "Up to 150 kg / week", waste: "Commercial, General", period: "Weekly", price: 5000, status: "Active" },
  { name: "Company / Institution", customerType: "Company / Institution", kg: "Over 1,000 kg / month", waste: "Bulky or mixed", period: "Monthly", price: 20000, status: "Active" },
  { name: "Custom", customerType: "Any", kg: "Custom", waste: "Any", period: "Monthly or Weekly", price: 0, status: "Active" },
];

export const zones = [
  { name: "Nyarugunga", district: "Kicukiro", day: "Monday", next: "05 Oct 2026", route: "Kicukiro-Nyarugunga Route", vehicle: "RW 412 A", team: "Team Alpha", driver: "Eric Niyonzima", customers: 184, paid: 152, collected: 912000, outstanding: 192000 },
  { name: "Remera", district: "Gasabo", day: "Tuesday", next: "06 Oct 2026", route: "Gasabo-Remera Route", vehicle: "RW 307 K", team: "Team Delta", driver: "Claude Mugenzi", customers: 156, paid: 131, collected: 786000, outstanding: 150000 },
  { name: "Niboye", district: "Kicukiro", day: "Wednesday", next: "07 Oct 2026", route: "Kicukiro-Niboye Route", vehicle: "Unassigned", team: "Team Bravo", driver: "Alice Uwera", customers: 132, paid: 112, collected: 672000, outstanding: 120000 },
  { name: "Nyamirambo", district: "Nyarugenge", day: "Thursday", next: "08 Oct 2026", route: "Nyarugenge-Nyamirambo Route", vehicle: "RW 118 T", team: "Team Echo", driver: "Patrick Tuyishime", customers: 211, paid: 178, collected: 1068000, outstanding: 198000 },
  { name: "Kimironko", district: "Gasabo", day: "Friday", next: "09 Oct 2026", route: "Gasabo-Kimironko Route", vehicle: "RW 307 K", team: "Team Delta", driver: "Claude Mugenzi", customers: 198, paid: 169, collected: 845000, outstanding: 145000 },
  { name: "Gasaraba", district: "Kicukiro", day: "Saturday", next: "10 Oct 2026", route: "Kicukiro-Gasaraba Route", vehicle: "RW 601 G", team: "Team Beta", driver: "Jean Claude N.", customers: 94, paid: 78, collected: 468000, outstanding: 96000 },
];

const activeCompanies = [
  ["Simate Garbage Ltd", "LIC-2031", "Pascal Rukundo", 18],
  ["Green Horizon Ltd", "LIC-2044", "Alice Uwera", 12],
  ["Isuku Kigali Services", "LIC-2003", "Jean Bosco M.", 24],
  ["Ubumwe Waste Solutions", "LIC-2011", "Dativa Ingabire", 9],
  ["Imanzi Recycling Rwanda", "LIC-2015", "Samuel Imanzi", 14],
  ["Clean Kigali Cooperative", "LIC-2018", "Aline Mukamana", 22],
  ["Virunga Eco Services", "LIC-2020", "Emmanuel Habineza", 8],
  ["Akagera Green Works", "LIC-2023", "Sandrine Uwase", 16],
  ["Umuganda Environmental", "LIC-2025", "Patrick Ndayisaba", 11],
  ["Rwanda Circular Ltd", "LIC-2027", "Grace Uwamahoro", 7],
  ["Inzira Nziza Services", "LIC-2029", "Claude Mugenzi", 10],
  ["Kigali Resource Recovery", "LIC-2030", "Beata Mutoni", 13],
] as const;

const seedCompanies: Company[] = [
  { id: "COM-2088", name: "Kigali Clean City", type: "Municipal partner", license: "LIC-2088", contact: "Mugisha David", phone: "+250 788 701 004", email: "david@kcc.rw", address: "Remera, Gasabo, Kigali", requested: "03 Oct 2026", users: 1, status: "Pending", history: ["03 Oct 2026 · Registration submitted"] },
  { id: "COM-2091", name: "EcoSafe Rwanda", type: "Waste operator", license: "LIC-2091", contact: "Mutesi Alice", phone: "+250 733 700 114", email: "alice@ecosafe.rw", address: "Niboye, Kicukiro, Kigali", requested: "02 Oct 2026", users: 1, status: "Pending", history: ["02 Oct 2026 · Registration submitted"] },
  { id: "COM-2094", name: "Umucyo Recycling", type: "Waste operator", license: "LIC-2094", contact: "Claudine Uwera", phone: "+250 788 294 118", email: "hello@umucyo.rw", address: "Kimironko, Gasabo, Kigali", requested: "01 Oct 2026", users: 1, status: "Pending", history: ["01 Oct 2026 · Registration submitted"] },
  ...activeCompanies.map(([name, license, contact, users], index): Company => ({
    id: `COM-${2000 + index}`,
    name, type: index === 5 ? "Municipal partner" : "Waste operator", license, contact, users,
    phone: `+250 788 ${String(310000 + index * 1137).slice(0, 6)}`, email: `contact@${name.toLowerCase().replaceAll(/[^a-z]+/g, "")}.rw`,
    address: `${zones[index % zones.length].name}, ${zones[index % zones.length].district}, Kigali`,
    requested: `${String(12 + index).padStart(2, "0")} Jan 2026`, status: "Active", history: ["2026 · Registration submitted", "2026 · Company accepted"],
    activeCollections: index === 0 ? 148 : 0,
  })),
  { id: "COM-1990", name: "Kigali Sanitation Partners", type: "Municipal partner", license: "LIC-1988", contact: "Jeanne Mukantwari", phone: "+250 788 221 020", email: "office@ksp.rw", address: "Gasaraba, Kicukiro, Kigali", requested: "11 Dec 2025", users: 6, status: "Suspended", history: ["11 Dec 2025 · Registration submitted", "15 Dec 2025 · Company accepted", "02 Oct 2026 · Company suspended"] },
  { id: "COM-1994", name: "CleanWave Ltd", type: "Waste operator", license: "LIC-1994", contact: "Eric Kayitare", phone: "+250 780 291 884", email: "info@cleanwave.rw", address: "Kicukiro, Kigali", requested: "18 Sep 2026", users: 1, status: "Rejected", rejectionReason: "Incomplete license documents", history: ["18 Sep 2026 · Registration submitted", "20 Sep 2026 · Registration rejected: Incomplete license documents"] },
];

type Store = {
  companies: Company[];
  users: UserRecord[];
  messages: Message[];
  invoices: Invoice[];
  payments: Payment[];
  activities: ActivityEntry[];
};

const seed: Store = {
  companies: seedCompanies,
  users: [
    { id: "ADM-0001", name: "System Administrator", email: "admin@ecoroute.rw", role: "Admin", company: "EcoRoute", status: "Active" },
    { id: "MGR-0018", name: "Diane Mukamana", email: "manager@ecoroute.rw", role: "Manager", company: "Simate Garbage Ltd", status: "Active" },
    { id: "FIN-0012", name: "Claudine Uwase", email: "finance@ecoroute.rw", role: "Finance", company: "Simate Garbage Ltd", status: "Active" },
    { id: "EMP-0041", name: "Eric Niyonzima", email: "employee@ecoroute.rw", role: "Driver", company: "Simate Garbage Ltd", status: "Active" },
    { id: "CUS-2048", name: "Jean Romeo", email: "jean.romeo@example.com", role: "Customer", company: "—", status: "Active" },
  ],
  messages: [
    { id: "CUS-M1", role: "Customer", title: "October invoice due", text: "Your October invoice of RWF 6,000 is due 10 Oct 2026.", time: "Today · 08:00", channel: "App + SMS", category: "Payments", unread: true, action: "Pay now", relatedPage: "Payment" },
    { id: "CUS-M2", role: "Customer", title: "Collection reminder", text: "Your collection is scheduled Monday at 08:00–11:00.", time: "Today · 07:30", channel: "App", category: "Collections", unread: true, action: "View schedule", relatedPage: "My Schedule / History" },
    { id: "CUS-M3", role: "Customer", title: "Payment received", text: "September payment received. Receipt RCT-90284.", time: "04 Oct · 10:42", channel: "App + SMS", category: "Payments", unread: false, action: "View payment", relatedPage: "My Payments / Invoices" },
    { id: "FIN-M1", role: "Finance", title: "Payment pending", text: "Aline Uwase payment is waiting for provider confirmation.", time: "18 min ago", channel: "App", category: "Payments", unread: true, action: "View payment", relatedPage: "Payments & Billing" },
    { id: "MGR-M1", role: "Manager", title: "Daily payment summary", text: "Four payments received today across Nyarugunga and Remera.", time: "Today · 17:00", channel: "App", category: "Inbox", unread: true, action: "View payments", relatedPage: "Payments & Billing" },
    { id: "EMP-M1", role: "Employee", title: "Route changed", text: "Stop 14 moved after KG 218 because of road works.", time: "08:12", channel: "App", category: "Alerts", unread: true, action: "View route", relatedPage: "My Routes" },
    { id: "EMP-M2", role: "Employee", title: "Vehicle inspection due", text: "RW 412 A inspection is due after today’s shift.", time: "Yesterday", channel: "App", category: "Alerts", unread: true, action: "View vehicle", relatedPage: "Dashboard" },
    { id: "ADM-M1", role: "Admin", title: "Security alert", text: "Three sign-in events require review.", time: "Today · 08:20", channel: "App", category: "Alerts", unread: true, action: "View activity", relatedPage: "Activity Log" },
  ],
  invoices: [
    { id: "INV-2026-00098", customerId: "CUS-2048", customer: "Jean Romeo", period: "September 2026", plan: "Household Standard", amount: 6000, dueDate: "10 Sep 2026", status: "Paid", paidAmount: 6000 },
    { id: "INV-2026-00125", customerId: "CUS-2048", customer: "Jean Romeo", period: "October 2026", plan: "Household Standard", amount: 6000, dueDate: "10 Oct 2026", status: "Unpaid", paidAmount: 0 },
  ],
  payments: [
    { id: "TXN-90284", receipt: "RCT-90284", invoiceId: "INV-2026-00098", customerId: "CUS-2048", customer: "Jean Romeo", period: "September 2026", amount: 6000, method: "MTN Mobile Money", reference: "TXN-90284", date: "04 Oct 2026", status: "Paid", recordedBy: "System confirmation" },
  ],
  activities: [
    { id: "ACT-1", time: "05 Oct · 08:31", user: "Diane Mukamana", action: "Route assigned", module: "Routes", record: "RW 412 A", status: "Success" },
  ],
};

const key = "ecoroute-shared-store-v2";
const listeners = new Set<() => void>();
let state: Store = (() => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...seed, ...JSON.parse(saved) } : seed;
  } catch {
    return seed;
  }
})();

function emit() {
  localStorage.setItem(key, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}

export function getStore() { return state; }
export function setStore(updater: (current: Store) => Store) { state = updater(state); emit(); }
export function useEcoStore() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => state);
}

export function addActivity(action: string, module: string, record: string, user = "System Administrator") {
  const entry: ActivityEntry = { id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user, action, module, record, status: "Success" };
  setStore((current) => ({ ...current, activities: [entry, ...current.activities] }));
}

export function registerCompany(input: Omit<Company, "id" | "requested" | "users" | "status" | "history" | "isNew">) {
  const company: Company = { ...input, id: `COM-${Date.now()}`, requested: "05 Oct 2026", users: 1, status: "Pending", isNew: true, history: ["05 Oct 2026 · Company registration submitted"] };
  const message: Message = { id: `MSG-${Date.now()}`, role: "Admin", title: "New company registration", text: `${company.name} (${company.type} · ${company.license}) was submitted by ${company.contact}.`, time: "Just now", channel: "App", category: "Inbox", unread: true, action: "View company", relatedPage: "Companies" };
  const activity: ActivityEntry = { id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user: company.contact, action: "Company registration submitted", module: "Companies", record: company.name, status: "Pending" };
  setStore((current) => ({ ...current, companies: [company, ...current.companies], messages: [message, ...current.messages], activities: [activity, ...current.activities] }));
}

export function updateCompany(id: string, patch: Partial<Company>, action: string) {
  const company = state.companies.find((item) => item.id === id);
  if (!company) return;
  const historyLine = `05 Oct 2026 · ${action}`;
  const updated = { ...company, ...patch, isNew: false, history: [historyLine, ...company.history] };
  const message: Message = { id: `MSG-${Date.now()}`, role: "Admin", title: action, text: `${company.name}: ${action}.`, time: "Just now", channel: "App", category: "System", unread: false, action: "View company", relatedPage: "Companies" };
  const contactMessage: Message = { ...message, id: `${message.id}-contact`, role: "Manager", channel: "App + SMS", unread: true };
  const activity: ActivityEntry = { id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user: "System Administrator", action, module: "Companies", record: company.name, status: "Success" };
  setStore((current) => ({
    ...current,
    companies: current.companies.map((item) => item.id === id ? updated : item),
    users: current.users.map((user) => user.company !== company.name ? user : { ...user, status: patch.status === "Active" ? "Active" : patch.status === "Pending" ? "Pending" : "Inactive" }),
    messages: [contactMessage, message, ...current.messages],
    activities: [activity, ...current.activities],
  }));
}

export function deleteCompany(id: string) {
  const company = state.companies.find((item) => item.id === id);
  if (!company) return;
  setStore((current) => ({
    ...current,
    companies: current.companies.filter((item) => item.id !== id),
    activities: [{ id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user: "System Administrator", action: "Company deleted", module: "Companies", record: company.name, status: "Success" }, ...current.activities],
  }));
}

export function addUser(user: UserRecord) {
  setStore((current) => ({ ...current, users: [user, ...current.users.filter((item) => item.email !== user.email)] }));
}

export function markMessage(id: string, unread = false) {
  setStore((current) => ({ ...current, messages: current.messages.map((message) => message.id === id ? { ...message, unread } : message) }));
}

export function markAllMessages(role: MessageRole) {
  setStore((current) => ({ ...current, messages: current.messages.map((message) => message.role === role ? { ...message, unread: false } : message) }));
}

export function recordPayment(input: Omit<Payment, "id" | "receipt" | "date">) {
  const invoice = state.invoices.find((item) => item.id === input.invoiceId);
  const id = input.reference || `TXN-${Date.now().toString().slice(-5)}`;
  const receipt = `RCT-${Date.now().toString().slice(-5)}`;
  const date = "05 Oct 2026";
  const payment: Payment = { ...input, id, receipt, date };
  const applied = invoice ? Math.min(input.amount, invoice.amount - invoice.paidAmount) : input.amount;
  const invoices = state.invoices.map((item) => item.id !== input.invoiceId || input.status !== "Paid" ? item : {
    ...item,
    paidAmount: item.paidAmount + applied,
    status: item.paidAmount + applied >= item.amount ? "Paid" as const : "Partially paid" as const,
  });
  const period = invoice?.period ?? input.period;
  const customerMessage: Message = { id: `MSG-C-${Date.now()}`, role: "Customer", title: input.status === "Paid" ? "Payment received" : `${input.status} payment`, text: input.status === "Paid" ? `Payment received RWF ${input.amount.toLocaleString()} for ${period}. Receipt ${receipt}` : `Your payment for ${period} is ${input.status.toLowerCase()}. The invoice remains unpaid.`, time: "Just now", channel: "App + SMS", category: "Payments", unread: true, action: "View payment", relatedPage: "My Payments / Invoices" };
  const financeMessage: Message = { id: `MSG-F-${Date.now()}`, role: "Finance", title: input.status === "Paid" ? "Customer payment received" : input.status, text: `${input.customer} (${input.customerId}) ${input.status === "Paid" ? "has paid" : "payment"} RWF ${input.amount.toLocaleString()} for ${period}, monthly waste collection, Household Standard, Nyarugunga, via ${input.method} (${input.reference}).`, time: "Just now", channel: "App", category: "Payments", unread: true, action: "View payment", relatedPage: "Payments & Billing" };
  const managerMessage: Message = { id: `MSG-M-${Date.now()}`, role: "Manager", title: "Daily payment summary updated", text: `${input.customer} payment of RWF ${input.amount.toLocaleString()} was added to today’s summary.`, time: "Just now", channel: "App", category: "Payments", unread: true, action: "View payments", relatedPage: "Payments & Billing" };
  const activity: ActivityEntry = { id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user: input.recordedBy, action: input.manual ? "Manual payment recorded" : "Customer payment confirmed", module: "Payments", record: input.customer, status: input.status };
  setStore((current) => ({ ...current, invoices, payments: [payment, ...current.payments], messages: [customerMessage, financeMessage, managerMessage, ...current.messages], activities: [activity, ...current.activities] }));
  return payment;
}

export function updatePaymentStatus(id: string, status: "Paid" | "Failed") {
  const payment = state.payments.find((item) => item.id === id);
  if (!payment) return;
  const invoice = state.invoices.find((item) => item.id === payment.invoiceId);
  setStore((current) => ({
    ...current,
    payments: current.payments.map((item) => item.id === id ? { ...item, status } : item),
    invoices: current.invoices.map((item) => item.id !== payment.invoiceId || status !== "Paid" ? item : { ...item, paidAmount: Math.min(item.amount, item.paidAmount + payment.amount), status: item.paidAmount + payment.amount >= item.amount ? "Paid" : "Partially paid" }),
    messages: [{
      id: `MSG-${Date.now()}`,
      role: "Customer",
      title: status === "Paid" ? "Payment confirmed" : "Payment failed",
      text: status === "Paid" ? `Payment received RWF ${payment.amount.toLocaleString()} for ${invoice?.period ?? payment.period}. Receipt ${payment.receipt}` : `Payment ${payment.reference} was marked failed. Your invoice remains unpaid.`,
      time: "Just now",
      channel: "App + SMS",
      category: "Payments",
      unread: true,
      action: "View payment",
      relatedPage: "My Payments / Invoices",
    }, ...current.messages],
    activities: [{ id: `ACT-${Date.now()}`, time: "05 Oct 2026 · Now", user: "Claudine Uwase", action: status === "Paid" ? "Pending payment confirmed" : "Payment marked failed", module: "Payments", record: payment.customer, status }, ...current.activities],
  }));
}
