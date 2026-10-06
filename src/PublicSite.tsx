import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  CircleCheck,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  LocateFixed,
  MapPin,
  Menu,
  MessageSquareText,
  WalletCards,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type { Role } from "./App";
import { addUser, getStore, registerCompany } from "./ecorouteStore";

type Screen = "login" | "company" | "customer" | null;

const authorizedAccounts: Record<string, { password: string; role: Role; name: string; phone?: string; category?: string; assignment?: string; task?: string }> = {
  "admin@ecoroute.rw": { password: "admin123", role: "Admin", name: "System Administrator" },
  "manager@ecoroute.rw": { password: "manager123", role: "Manager", name: "Diane Mukamana" },
  "finance@ecoroute.rw": {
    password: "finance123",
    role: "Finance",
    name: "Claudine Uwase",
    phone: "+250 788 420 116",
    category: "Finance & Billing Officer",
    assignment: "Finance operations",
    task: "Manage authorized billing, payments, receipts and reconciliation",
  },
  "employee@ecoroute.rw": {
    password: "employee123",
    role: "Employee",
    name: "Eric Niyonzima",
    phone: "+250 788 304 112",
    category: "Driver",
    assignment: "RW 412 A · Team Alpha · Route KG 45",
    task: "Complete 18 assigned collection stops in Nyarugunga",
  },
  "customer@ecoroute.rw": { password: "customer123", role: "Customer", name: "Jean Romeo" },
};

const photoUrl =
  "https://images.unsplash.com/photo-1771172195097-d61aa2103b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button className="flex items-center gap-3 text-left" onClick={() => window.scrollTo(0, 0)}>
      <span
        className={`grid size-10 place-items-center rounded-2xl ${
          light ? "bg-white text-emerald-800" : "bg-emerald-700 text-white"
        }`}
      >
        <Leaf size={20} />
      </span>
      <span>
        <span className={`block text-base font-bold ${light ? "text-white" : "text-slate-950"}`}>
          Isuku Route
        </span>
        <span
          className={`block text-[9px] font-semibold uppercase tracking-[0.16em] ${
            light ? "text-emerald-100" : "text-emerald-700"
          }`}
        >
          AI-powered EcoRoute
        </span>
      </span>
    </button>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">{label}</span>
      <input
        className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

const LOCATION_TREE: Record<string, Record<string, string[]>> = {
  "Kigali City": {
    Gasabo: ["Remera", "Kimironko", "Kacyiru", "Kinyinya"],
    Kicukiro: ["Nyarugunga", "Niboye", "Gikondo", "Kagarama"],
    Nyarugenge: ["Nyamirambo", "Kimisagara", "Muhima", "Rwezamenyo"],
  },
  "Eastern Province": {
    Bugesera: ["Gashora", "Juru", "Mayange", "Nyamata"],
    Rwamagana: ["Gishari", "Kigabiro", "Muhazi", "Munyaga"],
    Kayonza: ["Kabarondo", "Mukarange", "Rukara", "Murundi"],
  },
  "Northern Province": {
    Musanze: ["Cyuve", "Kimonyi", "Muhoza", "Muko"],
    Gicumbi: ["Byumba", "Kageyo", "Miyove", "Rukomo"],
    Rulindo: ["Base", "Bushoki", "Kinihira", "Shyorongi"],
  },
  "Southern Province": {
    Huye: ["Butare", "Ngoma", "Tumba", "Mukura"],
    Nyanza: ["Busasamana", "Kibirizi", "Mukingo", "Rwabicuma"],
    Muhanga: ["Cyeza", "Nyamabuye", "Shyogwe", "Rongi"],
  },
  "Western Province": {
    Rubavu: ["Gisenyi", "Rugerero", "Nyamyumba", "Kanama"],
    Rusizi: ["Kamembe", "Gihundwe", "Mururu", "Bugarama"],
    Karongi: ["Bwishyura", "Gitesi", "Mubuga", "Rubengera"],
  },
};

function SelectField({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      <span className="mb-2 block">{label}</span>
      <select
        className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Progress({ step, company }: { step: number; company?: boolean }) {
  const labels = company
    ? ["Your account", "Company details", "Verification"]
    : ["Personal details", "Location", "Confirmation"];
  return (
    <div className="mt-7 grid grid-cols-3 gap-2">
      {labels.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        const active = number === step;
        return (
          <div className={`border-t-4 pt-3 ${number <= step ? "border-emerald-500" : "border-slate-200"}`} key={label}>
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${
                number <= step ? "text-emerald-800" : "text-slate-400"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                  complete
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : active
                      ? "border-emerald-500 text-emerald-700"
                      : "border-slate-300"
                }`}
              >
                {complete ? <Check size={14} /> : number}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Login({
  onClose,
  onAuthorized,
  onCustomer,
}: {
  onClose: () => void;
  onAuthorized: (role: Role) => void;
  onCustomer: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const quickLogin = (accountEmail: string) => {
    const account = authorizedAccounts[accountEmail];
    localStorage.setItem("ecoroute-current-user", JSON.stringify({ ...account, email: accountEmail }));
    onAuthorized(account.role);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const createdAccounts = JSON.parse(localStorage.getItem("ecoroute-created-accounts") ?? "[]") as Array<{
      email: string;
      password: string;
      role: Role;
      name: string;
    }>;
    const created = createdAccounts.find((item) => item.email === normalizedEmail);
    const account = authorizedAccounts[normalizedEmail] ?? created;
    const accountCompany = (account as { company?: string } | undefined)?.company;
    const company = getStore().companies.find((item) => item.email.toLowerCase() === normalizedEmail || item.name === accountCompany || (!accountCompany && ["Manager", "Finance", "Employee"].includes(account?.role ?? "") && item.name === "Simate Garbage Ltd"));
    if (company?.status === "Pending") {
      setError("Your company registration is pending approval.");
      return;
    }
    if (company?.status === "Rejected") {
      setError(`Your registration was rejected: ${company.rejectionReason ?? "Contact the administrator"}.`);
      return;
    }
    if (company?.status === "Suspended") {
      setError("Your company account is suspended. Contact the administrator.");
      return;
    }
    const unavailableAccounts = JSON.parse(localStorage.getItem("ecoroute-unavailable-accounts") ?? "[]") as string[];
    if (unavailableAccounts.includes(normalizedEmail)) {
      setError("Your account is inactive. Contact your administrator.");
      return;
    }
    if (!account || account.password !== password) {
      setError("Access denied. Check your email and password or contact your administrator.");
      return;
    }
    localStorage.setItem("ecoroute-current-user", JSON.stringify({ ...account, email: normalizedEmail }));
    onAuthorized(account.role);
  };

  return (
    <Modal onClose={onClose} width="max-w-md">
      <div className="text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-700 text-white">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Authorized access
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to the workspace assigned to your account.
        </p>
      </div>
      <div className="mt-7">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Quick prototype access
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            ["Admin", "admin@ecoroute.rw", ShieldCheck],
            ["Manager", "manager@ecoroute.rw", Building2],
            ["Finance", "finance@ecoroute.rw", WalletCards],
            ["Customer", "customer@ecoroute.rw", UserRound],
            ["Employee", "employee@ecoroute.rw", UsersRound],
          ].map(([label, accountEmail, Icon]) => {
            const RoleIcon = Icon as typeof ShieldCheck;
            return (
              <button
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                key={label as string}
                onClick={() => quickLogin(accountEmail as string)}
                type="button"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white">
                  <RoleIcon size={17} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">{label as string}</span>
                  <span className="block text-[10px] text-slate-400">Enter workspace</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Or use credentials</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <Field
          label="Email address"
          onChange={setEmail}
          placeholder="you@company.rw"
          required
          type="email"
          value={email}
        />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Password</span>
          <span className="relative block">
            <input
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type={visible ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              onClick={() => setVisible(!visible)}
              type="button"
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && (
          <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-5 text-white">{error}</div>
        )}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800">
          Sign in securely <ArrowRight size={16} />
        </button>
      </form>
      <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
        <strong>Prototype accounts:</strong> admin, manager, employee or customer
        <span className="block">Use role@ecoroute.rw · password: role123</span>
      </div>
      <p className="mt-5 text-center text-sm text-slate-500">
        New household customer?{" "}
        <button className="font-bold text-emerald-700" onClick={onCustomer}>
          Create an account
        </button>
      </p>
    </Modal>
  );
}

function Modal({
  children,
  onClose,
  width = "max-w-3xl",
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-4">
        <div className={`relative w-full ${width} rounded-3xl bg-white p-6 shadow-2xl sm:p-8`}>
          <button
            aria-label="Close"
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

function CompanyRegistration({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [documentAdded, setDocumentAdded] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", company: "", province: "",
    district: "", sector: "", street: "", bossPhone: "", officePhone: "", certificate: "", documentName: "",
    type: "Waste operator", license: "",
  });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const districts = form.province ? LOCATION_TREE[form.province] ?? {} : {};
  const sectors = form.district ? districts[form.district] ?? [] : [];
  const stepValid = step === 1
    ? Boolean(form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password.length >= 8 && /[A-Z]/.test(form.password) && /\d/.test(form.password) && form.password === form.confirmPassword)
    : step === 2
      ? Boolean(form.company.trim() && form.type && form.license.trim() && form.province && form.district && form.sector && form.street.trim() && form.bossPhone.trim())
      : registered
        ? Boolean(form.certificate.trim() && form.documentName.trim() && documentAdded)
        : documentAdded;
  if (submitted) {
    return (
      <Modal onClose={onClose} width="max-w-lg">
        <div className="py-6 text-center">
          <CircleCheck className="mx-auto text-emerald-600" size={52} />
          <h2 className="mt-5 text-3xl font-semibold text-slate-950">Application received</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Registration submitted. Waiting for administrator approval.
          </p>
          <div className="mx-auto mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            Reference: ECO-RW-2026-1048
          </div>
          <button className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white" onClick={onClose}>
            Return to website
          </button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Register company</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Create your company account</h2>
      <p className="mt-1 text-sm text-slate-500">Three steps. An administrator reviews every application.</p>
      <Progress company step={step} />
      <div className="mt-7">
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Full name" onChange={(value) => set("name", value)} placeholder="Company administrator's name" value={form.name} /></div>
            <div className="sm:col-span-2"><Field label="Primary email" onChange={(value) => set("email", value)} placeholder="admin@company.rw" type="email" value={form.email} /></div>
            <Field label="Password" onChange={(value) => set("password", value)} placeholder="At least 8 characters" type="password" value={form.password} />
            <Field label="Confirm password" onChange={(value) => set("confirmPassword", value)} placeholder="Repeat your password" type="password" value={form.confirmPassword} />
            <div className="sm:col-span-2 grid gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800 sm:grid-cols-2">
              {[[form.password.length >= 8, "At least 8 characters"], [/[A-Z]/.test(form.password), "One uppercase letter"], [/\d/.test(form.password), "One number"], [Boolean(form.confirmPassword && form.password === form.confirmPassword), "Passwords match"]].map(([valid, item]) => (
                <span className={`flex items-center gap-2 ${valid ? "text-emerald-800" : "text-slate-400"}`} key={item as string}><Check size={14} />{item as string}</span>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Business / company name" onChange={(value) => set("company", value)} placeholder="e.g. Kigali Clean Ltd" value={form.company} /></div>
            <SelectField label="Company type" onChange={(value) => set("type", value)} options={["Waste operator", "Municipal partner"]} value={form.type} />
            <Field label="License number" onChange={(value) => set("license", value)} placeholder="e.g. LIC-2108" value={form.license} />
            <SelectField label="Province" onChange={(value) => { setForm((current) => ({ ...current, province: value, district: "", sector: "" })); }} options={Object.keys(LOCATION_TREE)} placeholder="Select province" value={form.province} />
            <SelectField disabled={!form.province} label="District" onChange={(value) => setForm((current) => ({ ...current, district: value, sector: "" }))} options={Object.keys(districts)} placeholder="Select district" value={form.district} />
            <SelectField disabled={!form.district} label="Sector" onChange={(value) => set("sector", value)} options={sectors} placeholder="Select sector" value={form.sector} />
            <Field label="Street" onChange={(value) => set("street", value)} placeholder="e.g. KG 11 Ave" value={form.street} />
            <Field label="Phone number (boss)" onChange={(value) => set("bossPhone", value)} placeholder="+250 7xx xxx xxx" value={form.bossPhone} />
            <Field label="Office phone (optional)" onChange={(value) => set("officePhone", value)} placeholder="+250 7xx xxx xxx" value={form.officePhone} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-sm font-semibold text-slate-800">Is your company registered in RDB?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className={`rounded-2xl border p-4 text-left ${registered ? "border-2 border-emerald-500 bg-emerald-50" : "border-slate-200"}`} onClick={() => { setRegistered(true); setDocumentAdded(false); }}>
                <strong className="block text-slate-900">Yes, registered in RDB</strong>
                <span className="mt-1 block text-xs text-slate-500">Enter your business registration details.</span>
              </button>
              <button className={`rounded-2xl border p-4 text-left ${!registered ? "border-2 border-emerald-500 bg-emerald-50" : "border-slate-200"}`} onClick={() => { setRegistered(false); setDocumentAdded(false); }}>
                <strong className="block text-slate-900">No, not yet</strong>
                <span className="mt-1 block text-xs text-slate-500">Upload a recent tax bill instead.</span>
              </button>
            </div>
            {registered && <><Field label="RDB certificate number" onChange={(value) => set("certificate", value)} placeholder="e.g. 123456789" value={form.certificate} /><Field label="Company name on document" onChange={(value) => set("documentName", value)} placeholder="Exact registered company name" value={form.documentName} /></>}
            <label className="block rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
              {registered ? "Upload registration certificate" : "Upload a recent tax bill"}
              <input className="mt-3 block w-full text-xs" onChange={(event) => setDocumentAdded(Boolean(event.target.files?.[0]))} type="file" />
            </label>
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center gap-3">
        {step > 1 && (
          <button className="flex items-center gap-1 px-2 py-3 text-sm font-semibold text-slate-500" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <button
          className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-900/10 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          disabled={!stepValid}
          onClick={() => {
            if (step < 3) {
              setStep(step + 1);
              return;
            }
            registerCompany({
              name: form.company,
              type: form.type as "Waste operator" | "Municipal partner",
              license: form.license,
              contact: form.name,
              phone: form.bossPhone,
              email: form.email.toLowerCase(),
              address: `${form.street}, ${form.sector}, ${form.district}, ${form.province}`,
              password: form.password,
            });
            const existing = JSON.parse(localStorage.getItem("ecoroute-created-accounts") ?? "[]") as Array<{ email: string }>;
            const account = { email: form.email.toLowerCase(), password: form.password, role: "Manager" as Role, name: form.name, company: form.company };
            localStorage.setItem("ecoroute-created-accounts", JSON.stringify([account, ...existing.filter((item) => item.email !== account.email)]));
            addUser({ id: `USR-${Date.now()}`, name: form.name, email: account.email, role: "Manager", company: form.company, status: "Pending" });
            setSubmitted(true);
          }}
        >
          {step < 3 ? "Next" : "Finish & send application"} <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  );
}

function CustomerRegistration({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [locationStatus, setLocationStatus] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirmPassword: "", province: "", district: "", sector: "", street: "", coordinates: "", customerType: "Household", estimatedWaste: "120", wasteType: "General" });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const districts = form.province ? LOCATION_TREE[form.province] ?? {} : {};
  const sectors = form.district ? districts[form.district] ?? [] : [];
  const stepValid = step === 1
    ? Boolean(form.name.trim() && form.phone.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.password.length >= 8 && form.password === form.confirmPassword)
    : step === 2
      ? Boolean(form.province && form.district && form.sector && form.street.trim())
      : true;
  const addMyLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("Location is not supported by this browser."); return; }
    setLocationStatus("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        set("coordinates", coordinates);
        setLocationStatus(`Location added · ${coordinates}`);
      },
      () => setLocationStatus("Location permission was not granted. You can try again or enter your street manually."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const completeRegistration = () => {
    const account = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: "Customer" as Role,
      name: form.name.trim(),
      phone: form.phone.trim(),
      category: "Customer",
      assignment: `${form.street}, ${form.sector}, ${form.district}, ${form.province}`,
      task: "Registration submitted, pending approval",
    };
    const existing = JSON.parse(localStorage.getItem("ecoroute-created-accounts") ?? "[]") as Array<typeof account>;
    localStorage.setItem("ecoroute-created-accounts", JSON.stringify([account, ...existing.filter((item) => item.email !== account.email)]));
    addUser({ id: `CUS-${Date.now().toString().slice(-4)}`, name: account.name, email: account.email, role: "Customer", company: "—", status: "Active" });
    localStorage.setItem("ecoroute-current-user", JSON.stringify(account));
    localStorage.setItem("ecoroute-customer-location", JSON.stringify({ province: form.province, district: form.district, sector: form.sector, street: form.street, coordinates: form.coordinates, status: "Pending approval" }));
    onComplete();
  };
  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
        Customer registration · Step {step} of 3
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {step === 1 ? "Create your account" : step === 2 ? "Set your collection location" : "Confirm your location"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {step === 1
          ? "Enter your personal and contact details."
          : step === 2
            ? "Tell us where collections should take place."
            : "Review the details before creating your account."}
      </p>
      <Progress step={step} />
      <div className="mt-7">
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Full name" onChange={(value) => set("name", value)} placeholder="e.g. Jean Romeo" value={form.name} /></div>
            <Field label="Phone number" onChange={(value) => set("phone", value)} placeholder="+250 7xx xxx xxx" value={form.phone} />
            <Field label="Email address" onChange={(value) => set("email", value)} placeholder="you@example.com" type="email" value={form.email} />
            <Field label="Password" onChange={(value) => set("password", value)} placeholder="At least 8 characters" type="password" value={form.password} />
            <Field label="Confirm password" onChange={(value) => set("confirmPassword", value)} placeholder="Repeat your password" type="password" value={form.confirmPassword} />
            <SelectField label="Customer type" onChange={(value) => set("customerType", value)} options={["Household", "Business", "Company / Institution"]} value={form.customerType} />
            <Field label="Estimated waste (kg)" onChange={(value) => set("estimatedWaste", value)} placeholder="e.g. 120" type="number" value={form.estimatedWaste} />
            <SelectField label="Waste type" onChange={(value) => set("wasteType", value)} options={["General", "Organic", "Recyclable", "Bulky", "Commercial"]} value={form.wasteType} />
            <div className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-900">
              <strong>Suggested plan:</strong> {form.customerType === "Business" ? "Business Weekly · RWF 5,000 / week" : form.customerType === "Company / Institution" ? "Company / Institution · RWF 20,000 / month" : Number(form.estimatedWaste) <= 120 ? "Household Basic · RWF 5,000 / month" : Number(form.estimatedWaste) <= 240 ? "Household Standard · RWF 6,000 / month" : "Household Large · RWF 10,000 / month"}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Province / City" onChange={(value) => setForm((current) => ({ ...current, province: value, district: "", sector: "" }))} options={Object.keys(LOCATION_TREE)} placeholder="Select province" value={form.province} />
            <SelectField disabled={!form.province} label="District" onChange={(value) => setForm((current) => ({ ...current, district: value, sector: "" }))} options={Object.keys(districts)} placeholder="Select district" value={form.district} />
            <SelectField disabled={!form.district} label="Sector" onChange={(value) => set("sector", value)} options={sectors} placeholder="Select sector" value={form.sector} />
            <Field label="Address or street" onChange={(value) => set("street", value)} placeholder="Street, house or landmark" value={form.street} />
            <div className="relative min-h-52 overflow-hidden rounded-2xl bg-[#e6f0e5] sm:col-span-2">
              <div className="absolute inset-0 map-grid" />
              <div className="absolute left-[18%] top-[25%] h-56 w-2 rotate-45 rounded-full bg-white" />
              <div className="absolute left-1/2 top-[-15%] h-80 w-3 -rotate-[20deg] rounded-full bg-white" />
              <div className="absolute right-[18%] top-[12%] h-64 w-2 rotate-[65deg] rounded-full bg-white" />
              <span className="absolute left-[48%] top-[48%] grid size-9 place-items-center rounded-full bg-emerald-700 text-white shadow-lg"><MapPin size={18} /></span>
              <button className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow" onClick={addMyLocation}><LocateFixed size={15} />Add my location</button>
            </div>
            {locationStatus && <p className={`text-xs font-semibold sm:col-span-2 ${form.coordinates ? "text-emerald-700" : "text-slate-500"}`}>{locationStatus}</p>}
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-emerald-700" size={20} />
                <div>
                  <p className="font-semibold text-slate-900">{form.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{form.street}, {form.sector}, {form.district}, {form.province}</p>
                  <p className="mt-1 text-xs text-slate-400">{form.coordinates ? `Map location: ${form.coordinates}` : "Street location provided"}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              <ShieldCheck className="text-emerald-700" size={20} />
              Your profile is private and only assigned service teams can view collection details.
            </div>
          </div>
        )}
      </div>
      <div className="mt-7 flex items-center gap-3">
        {step > 1 && (
          <button className="flex items-center gap-1 px-2 py-3 text-sm font-semibold text-slate-500" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <button
          className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-emerald-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          disabled={!stepValid}
          onClick={() => (step < 3 ? setStep(step + 1) : completeRegistration())}
        >
          {step < 3 ? "Continue" : "Submit registration"} <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  );
}

export default function PublicSite({ onAuthorized }: { onAuthorized: (role: Role) => void }) {
  const [screen, setScreen] = useState<Screen>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbfcf7] text-slate-950">
      <div className="h-1.5 bg-emerald-950" />
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#fbfcf7]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 lg:px-8">
          <Brand />
          <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#companies">For companies</a>
            <a href="#customers">For customers</a>
            <a href="#about">About</a>
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <button className="px-3 py-2 text-sm font-bold text-emerald-950" onClick={() => setScreen("login")}>Sign in</button>
            <button className="flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/10" onClick={() => setScreen("company")}>
              Register company <ArrowRight size={15} />
            </button>
          </div>
          <button className="ml-auto grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="border-t border-slate-200 p-5 lg:hidden">
            <div className="grid gap-2 text-sm font-semibold text-slate-700">
              <a href="#how" onClick={() => setMobileMenu(false)}>How it works</a>
              <a href="#features" onClick={() => setMobileMenu(false)}>Features</a>
              <button className="mt-2 rounded-xl border border-emerald-800 p-3" onClick={() => setScreen("login")}>Sign in</button>
              <button className="rounded-xl bg-emerald-950 p-3 text-white" onClick={() => setScreen("company")}>Register company</button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              <span className="h-px w-6 bg-emerald-600" /> Cleaner routes. Clearer operations.
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-emerald-950 sm:text-6xl lg:text-7xl">
              Smarter waste collection. <span className="text-emerald-600">Cleaner communities.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600">
              EcoRoute connects waste companies, field teams and customers in one secure platform for scheduling, route management, collection tracking and payments.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/10" onClick={() => setScreen("company")}>
                Register your company <ArrowRight size={16} />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-emerald-900" onClick={() => setScreen("customer")}>
                Join as a customer <UserRound size={16} />
              </button>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {["AD", "MN", "EN"].map((item) => <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-emerald-100 text-[9px] font-bold text-emerald-800" key={item}>{item}</span>)}
              </div>
              One connected workspace for every collection role
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-emerald-100 p-3 shadow-2xl shadow-emerald-950/10">
              <div className="relative h-[480px] overflow-hidden rounded-[1.4rem]">
                <img alt="Recycling bin for cleaner city waste collection" className="h-full w-full object-cover" src={photoUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">Field-ready collections</span>
                  <p className="mt-4 max-w-sm text-3xl font-semibold tracking-tight">Every route, team and customer in sync.</p>
                  <p className="mt-3 text-xs text-emerald-100">Photo by Rob Wingate on Unsplash</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-5 rounded-2xl bg-white p-4 shadow-xl sm:left-[-2rem]">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Route size={19} /></span>
                <div><p className="text-xs text-slate-400">Route efficiency</p><p className="font-bold text-slate-900">94% this week</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-900/10 bg-[#f2f7ef]" id="features">
          <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Centralized platform", "One source of truth", Building2],
              ["02", "Smart route management", "Plan with confidence", Route],
              ["03", "Secure role access", "Only assigned workspaces", LockKeyhole],
              ["04", "Customer connection", "Timely service updates", UsersRound],
            ].map(([number, title, text, Icon]) => {
              const FeatureIcon = Icon as typeof Building2;
              return (
                <div className="border-emerald-900/10 p-7 lg:border-r" key={title as string}>
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-bold text-emerald-600">{number as string}</span>
                    <FeatureIcon className="text-emerald-700" size={19} />
                    <div><p className="text-sm font-bold text-emerald-950">{title as string}</p><p className="mt-1 text-xs text-slate-500">{text as string}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8" id="how">
          <div className="rounded-[2rem] bg-emerald-100 p-8">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Today’s route</p><span className="text-xs font-bold text-emerald-600">Live</span></div>
              <div className="relative mt-5 h-64 overflow-hidden rounded-xl bg-[#e7f0e3]">
                <div className="absolute inset-0 map-grid" />
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 500 260"><path d="M30 210 C120 180 115 65 205 92 S320 225 455 48" fill="none" stroke="#047857" strokeDasharray="8 7" strokeWidth="5" /></svg>
                {[["left-[12%] top-[68%]","1"],["left-[38%] top-[28%]","2"],["right-[34%] top-[60%]","3"],["right-[8%] top-[12%]","4"]].map(([pos, no]) => <span className={`absolute ${pos} grid size-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow`} key={no}>{no}</span>)}
              </div>
              <div className="mt-5 flex items-center text-sm font-bold text-slate-900"><span>Route 04 · 19 stops</span><span className="ml-auto text-emerald-700">68%</span></div>
              <div className="mt-2 h-2 rounded-full bg-emerald-50"><div className="h-full w-2/3 rounded-full bg-emerald-700" /></div>
            </div>
          </div>
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">How EcoRoute works</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-emerald-950 sm:text-5xl">One flow from first booking to final receipt.</h2>
            <div className="mt-8 divide-y divide-emerald-900/10 border-y border-emerald-900/10">
              {[
                ["01", "Set up your operation", "Register your company, vehicles, team and service areas."],
                ["02", "Plan the collection", "Create schedules and routes that connect locations with people."],
                ["03", "Keep everyone informed", "Drivers update progress while customers receive timely notices."],
                ["04", "Close the loop", "Record payment, issue a receipt and learn from reports."],
              ].map(([number, title, text]) => <div className="grid grid-cols-[3rem_1fr] py-5" key={number}><span className="text-xs font-bold text-emerald-600">{number}</span><div><p className="font-bold text-emerald-950">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div></div>)}
            </div>
          </div>
        </section>

        <section className="bg-emerald-950 px-5 py-20 text-white" id="companies">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <Sparkles size={28} />
            <h2 className="mt-5 text-4xl font-semibold tracking-tight">Ready to modernize your collections?</h2>
            <p className="mt-4 max-w-2xl text-emerald-100">Register your organization for review, or create a household account to connect with your service provider.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950" onClick={() => setScreen("company")}>Register company</button>
              <button className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold" onClick={() => setScreen("customer")}>Customer registration</button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-emerald-950 px-5 pb-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <Brand light />
          <p className="text-xs text-emerald-200 sm:ml-auto">AUCA final-year prototype · Kigali, Rwanda</p>
        </div>
      </footer>

      {screen === "login" && <Login onAuthorized={onAuthorized} onClose={() => setScreen(null)} onCustomer={() => setScreen("customer")} />}
      {screen === "company" && <CompanyRegistration onClose={() => setScreen(null)} />}
      {screen === "customer" && <CustomerRegistration onClose={() => setScreen(null)} onComplete={() => onAuthorized("Customer")} />}
    </div>
  );
}
