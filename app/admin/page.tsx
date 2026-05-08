"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList, Phone, Mail, Car, Wrench, Calendar,
  Tag, Plus, Pencil, Trash2, X, Check, ChevronDown,
  ChevronUp, BookOpen, AlertCircle, ToggleLeft, ToggleRight,
  LogOut, Reply, Send, CheckCircle2, Loader2, Link, DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Submission {
  id: string; name: string; phone: string; email: string;
  vehicleYear: string; vehicleMake: string; vehicleModel: string;
  vin: string; licensePlate: string;
  serviceNeeded: string; message: string; submittedAt: string;
}

interface Coupon {
  id: string; badge: string; title: string; subtitle: string;
  description: string; code: string; terms: string;
  expires: string; accent: string; active: boolean;
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "EST-MOCK-1001",
    name: "Michael Turner",
    phone: "(248) 555-0172",
    email: "michael.turner@example.com",
    vehicleYear: "2019",
    vehicleMake: "Honda",
    vehicleModel: "Accord",
    vin: "1HGCV1F37KA123456",
    licensePlate: "NVI-4821",
    serviceNeeded: "Brake inspection and front pad replacement",
    message: "Hearing a squeaking noise when braking at low speeds.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "EST-MOCK-1002",
    name: "Sarah Johnson",
    phone: "(313) 555-0198",
    email: "sarah.johnson@example.com",
    vehicleYear: "2016",
    vehicleMake: "Ford",
    vehicleModel: "Escape",
    vin: "1FMCU0GX2GUA98765",
    licensePlate: "ESC-9210",
    serviceNeeded: "Check engine light diagnosis",
    message: "Light came on yesterday and fuel mileage dropped.",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "EST-MOCK-1003",
    name: "David Kim",
    phone: "(734) 555-0134",
    email: "david.kim@example.com",
    vehicleYear: "2021",
    vehicleMake: "Toyota",
    vehicleModel: "RAV4",
    vin: "",
    licensePlate: "RAV-3312",
    serviceNeeded: "Oil change and tire rotation",
    message: "",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
];

const ACCENT_OPTIONS = [
  { label: "Blue", value: "#0EA5E9" },
  { label: "Red", value: "#EF4444" },
  { label: "Green", value: "#10B981" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Orange", value: "#F97316" },
  { label: "Yellow", value: "#EAB308" },
];

const EMPTY_COUPON: Omit<Coupon, "id"> = {
  badge: "", title: "", subtitle: "", description: "",
  code: "", terms: "One coupon per visit. Cannot combine with other offers.",
  expires: "", accent: "#0EA5E9", active: true,
};

// ─── Instruction Manual ───────────────────────────────────────────────────────

function InstructionManual() {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      num: "01",
      title: "Add a New Coupon",
      body: 'Click the "Add New Coupon" button. Fill in all required fields marked with *. Choose a color accent that matches the offer type (blue for general, red for urgent, green for savings). Click "Save Coupon" when done. It will appear on the website immediately.',
    },
    {
      num: "02",
      title: "Edit an Existing Coupon",
      body: 'Click the pencil (✏) icon on any coupon card. Update the fields you want to change — title, discount amount, expiry date, etc. Click "Save Changes" to apply. The live website updates instantly.',
    },
    {
      num: "03",
      title: "Disable / Enable a Coupon",
      body: "Use the toggle switch on each coupon card to hide it from the website without deleting it. Toggle it back on to show it again. Use this for seasonal offers or when a promotion ends.",
    },
    {
      num: "04",
      title: "Delete a Coupon",
      body: "Click the trash (🗑) icon and confirm deletion. This permanently removes the coupon. If you might use it again, disable it instead of deleting.",
    },
    {
      num: "05",
      title: "Coupon Code Best Practices",
      body: 'Keep codes short and memorable: "CARS-OIL10", "CARS-FREE". Use all caps. Include the discount amount in the code so staff can identify it quickly at the counter.',
    },
    {
      num: "06",
      title: "Expiry Dates",
      body: 'Format dates clearly: "June 30, 2026" or "December 31, 2026". Always set an expiry — open-ended coupons lead to customer disputes. Update the expiry date to extend a promotion rather than creating a duplicate coupon.',
    },
  ];

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-[#111] transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen size={18} className="text-[#0EA5E9]" />
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Admin Instruction Manual — Coupons</p>
            <p className="text-gray-500 text-xs mt-0.5">How to add, edit, disable, and delete coupons</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-[#1F1F1F]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#0EA5E9] text-xs font-bold font-mono">{step.num}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-[#0EA5E9]/5 border border-[#0EA5E9]/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-[#0EA5E9] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#0EA5E9] text-xs font-semibold mb-1">Important Notes</p>
                <ul className="text-gray-400 text-xs space-y-1 leading-relaxed">
                  <li>• Changes take effect on the live website immediately — no restart needed.</li>
                  <li>• Coupon codes must be unique. The system will warn you if a code already exists.</li>
                  <li>• Disabled coupons are hidden from customers but preserved for future use.</li>
                  <li>• The website only shows active coupons. If the Specials section disappears, all coupons are disabled.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Coupon Form ──────────────────────────────────────────────────────────────

function CouponForm({
  initial, onSave, onCancel,
}: {
  initial: Omit<Coupon, "id"> & { id?: string };
  onSave: (data: Omit<Coupon, "id"> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Required";
    if (!form.subtitle.trim()) errs.subtitle = "Required";
    if (!form.code.trim()) errs.code = "Required";
    if (!form.expires.trim()) errs.expires = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputCls = (err?: string) =>
    `w-full bg-[#0A0A0A] border ${err ? "border-red-500/60" : "border-[#2A2A2A]"} rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] transition-all`;

  return (
    <div className="bg-[#0A0A0A] border border-[#0EA5E9]/30 rounded-2xl p-6 mb-6">
      <h3 className="text-white font-semibold text-base mb-5">
        {form.id ? "Edit Coupon" : "New Coupon"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Title * <span className="text-gray-600 normal-case">(e.g. $10 OFF, FREE)</span></label>
          <input placeholder="$10 OFF" value={form.title} onChange={set("title")} className={inputCls(errors.title)} />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Subtitle * <span className="text-gray-600 normal-case">(service name)</span></label>
          <input placeholder="Full Synthetic Oil Change" value={form.subtitle} onChange={set("subtitle")} className={inputCls(errors.subtitle)} />
          {errors.subtitle && <p className="text-red-400 text-xs mt-1">{errors.subtitle}</p>}
        </div>

        {/* Badge */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Badge Label</label>
          <input placeholder="Most Popular / Limited Time / Free Service" value={form.badge} onChange={set("badge")} className={inputCls()} />
        </div>

        {/* Code */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Coupon Code *</label>
          <input placeholder="CARS-OIL10" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className={inputCls(errors.code)} />
          {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code}</p>}
        </div>

        {/* Expires */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Expiry Date *</label>
          <input placeholder="June 30, 2026" value={form.expires} onChange={set("expires")} className={inputCls(errors.expires)} />
          {errors.expires && <p className="text-red-400 text-xs mt-1">{errors.expires}</p>}
        </div>

        {/* Accent color */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Color</label>
          <div className="flex gap-2 flex-wrap">
            {ACCENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm((p) => ({ ...p, accent: opt.value }))}
                title={opt.label}
                className={`w-8 h-8 rounded-full border-2 transition-all ${form.accent === opt.value ? "border-white scale-110" : "border-transparent"}`}
                style={{ background: opt.value }}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
          <input placeholder="Short description of what's included" value={form.description} onChange={set("description")} className={inputCls()} />
        </div>

        {/* Terms */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Terms & Conditions</label>
          <textarea rows={2} value={form.terms} onChange={set("terms")} className={`${inputCls()} resize-none`} />
        </div>

        {/* Active toggle */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <button onClick={() => setForm((p) => ({ ...p, active: !p.active }))} className="text-[#0EA5E9]">
            {form.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-gray-600" />}
          </button>
          <span className="text-sm text-gray-300">{form.active ? "Active — visible on website" : "Disabled — hidden from website"}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          <Check size={15} />
          {saving ? "Saving..." : form.id ? "Save Changes" : "Save Coupon"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 bg-[#111] border border-[#2A2A2A] text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1A1A1A] transition-colors">
          <X size={15} />
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Reply Panel ─────────────────────────────────────────────────────────────

function ReplyPanel({
  submission,
  onClose,
  onSent,
}: {
  submission: Submission;
  onClose: () => void;
  onSent: (submissionId: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: submission.name,
          customerEmail: submission.email,
          referenceId: submission.id,
          vehicle: `${submission.vehicleYear} ${submission.vehicleMake} ${submission.vehicleModel}`,
          serviceNeeded: submission.serviceNeeded,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSent(submission.id);
        setStatus("sent");
      } else {
        setErrorMsg(data.message || "Failed to send.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#1F1F1F]">
      {status === "sent" ? (
        <div className="flex items-center gap-2 text-green-400 text-sm py-2">
          <CheckCircle2 size={16} />
          Reply sent to <strong>{submission.email}</strong>
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-300 text-xs">
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Reply to <span className="text-white font-semibold">{submission.name}</span>
              <span className="text-gray-600 ml-1">({submission.email})</span>
            </p>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
              <X size={14} />
            </button>
          </div>

          <textarea
            rows={4}
            placeholder={`Hi ${submission.name},\n\nThank you for your estimate request...`}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setStatus("idle"); setErrorMsg(""); }}
            className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all resize-none"
          />

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
              <AlertCircle size={12} />
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSend}
              disabled={!message.trim() || status === "sending"}
              className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {status === "sending"
                ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                : <><Send size={14} /> Send Reply</>}
            </button>
            <p className="text-xs text-gray-600">
              Sends from C.A.R.S. — reply-to: carsofnovi@gmail.com
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Payment Panel ────────────────────────────────────────────────────────────

function PaymentPanel({ submission, onClose }: { submission: Submission; onClose: () => void }) {
  const [paymentLink, setPaymentLink] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    if (!paymentLink.trim() || !amount) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: submission.name,
          customerEmail: submission.email,
          referenceId: submission.id,
          vehicle: `${submission.vehicleYear} ${submission.vehicleMake} ${submission.vehicleModel}`,
          serviceNeeded: submission.serviceNeeded,
          amount,
          note,
          paymentLink: paymentLink.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setErrorMsg(data.message || "Failed to send.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#1F1F1F]">
      {status === "sent" ? (
        <div className="flex items-center gap-2 text-green-400 text-sm py-2">
          <CheckCircle2 size={16} />
          Payment link sent to <strong>{submission.email}</strong>
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-300 text-xs">Close</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Send Payment Link to <span className="text-white font-semibold">{submission.name}</span>
              <span className="text-gray-600 ml-1">({submission.email})</span>
            </p>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-300 transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Amount */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Amount Due *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  min="0"
                  step="0.01"
                  onChange={(e) => { setAmount(e.target.value); setStatus("idle"); }}
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl pl-7 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Note (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Brake job + oil change"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all"
              />
            </div>
          </div>

          {/* Payment link */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              QuickBooks Payment Link *
            </label>
            <div className="relative">
              <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                placeholder="https://quickbooks.intuit.com/pay/..."
                value={paymentLink}
                onChange={(e) => { setPaymentLink(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl pl-9 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all"
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              In QuickBooks: create an invoice → Share → Copy link
            </p>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 text-xs mb-3">
              <AlertCircle size={12} />
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={!paymentLink.trim() || !amount || status === "sending"}
              className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {status === "sending"
                ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                : <><DollarSign size={14} /> Send Payment Link</>}
            </button>
            <p className="text-xs text-gray-600">
              Customer receives a branded email with a Pay Now button.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const RESPONDED_ESTIMATES_KEY = "cars-admin-responded-estimates";
  const CLOSED_ESTIMATES_KEY = "cars-admin-closed-estimates";
  const [estimateFilter, setEstimateFilter] = useState<"open" | "responded" | "closed">("open");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingEst, setLoadingEst] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [payingTo, setPayingTo] = useState<string | null>(null);
  const [respondedEstimateIds, setRespondedEstimateIds] = useState<string[]>([]);
  const [closedEstimateIds, setClosedEstimateIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/estimate")
      .then((r) => r.json())
      .then((d) => {
        const apiSubmissions = d.submissions || [];
        setSubmissions(apiSubmissions.length ? apiSubmissions : MOCK_SUBMISSIONS);
        setLoadingEst(false);
      })
      .catch(() => {
        setSubmissions(MOCK_SUBMISSIONS);
        setLoadingEst(false);
      });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(RESPONDED_ESTIMATES_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setRespondedEstimateIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      localStorage.removeItem(RESPONDED_ESTIMATES_KEY);
    }
  }, [RESPONDED_ESTIMATES_KEY]);

  useEffect(() => {
    localStorage.setItem(RESPONDED_ESTIMATES_KEY, JSON.stringify(respondedEstimateIds));
  }, [respondedEstimateIds, RESPONDED_ESTIMATES_KEY]);

  useEffect(() => {
    const stored = localStorage.getItem(CLOSED_ESTIMATES_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setClosedEstimateIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      localStorage.removeItem(CLOSED_ESTIMATES_KEY);
    }
  }, [CLOSED_ESTIMATES_KEY]);

  useEffect(() => {
    localStorage.setItem(CLOSED_ESTIMATES_KEY, JSON.stringify(closedEstimateIds));
  }, [closedEstimateIds, CLOSED_ESTIMATES_KEY]);

  const totalResponded = submissions.filter((submission) =>
    respondedEstimateIds.includes(submission.id)
  ).length;
  const totalClosed = submissions.filter((submission) =>
    closedEstimateIds.includes(submission.id)
  ).length;

  const openToRespondSubmissions = submissions.filter(
    (submission) =>
      !respondedEstimateIds.includes(submission.id) &&
      !closedEstimateIds.includes(submission.id)
  );
  const respondedSubmissions = submissions.filter(
    (submission) =>
      respondedEstimateIds.includes(submission.id) &&
      !closedEstimateIds.includes(submission.id)
  );
  const closedSubmissions = submissions.filter((submission) =>
    closedEstimateIds.includes(submission.id)
  );

  const visibleSubmissions =
    estimateFilter === "open"
      ? openToRespondSubmissions
      : estimateFilter === "responded"
        ? respondedSubmissions
        : closedSubmissions;

  const markEstimateResponded = (submissionId: string) => {
    setRespondedEstimateIds((prev) =>
      prev.includes(submissionId) ? prev : [...prev, submissionId]
    );
  };

  const toggleEstimateClosed = (submissionId: string) => {
    setClosedEstimateIds((prev) =>
      prev.includes(submissionId)
        ? prev.filter((id) => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0EA5E9] rounded-lg flex items-center justify-center font-bold text-white">C</div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">C.A.R.S. Admin</h1>
              <p className="text-gray-500 text-xs mt-0.5">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-400 hover:text-[#0EA5E9] transition-colors">← View Website</a>
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                router.push("/admin/login");
              }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Submissions</p>
                <p className="text-4xl font-bold text-[#0EA5E9] mt-1">{submissions.length}</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Today</p>
                <p className="text-4xl font-bold text-white mt-1">
                  {submissions.filter((s) => new Date(s.submittedAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Responded</p>
                <p className="text-4xl font-bold text-green-400 mt-1">{totalResponded}</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Total Closed</p>
                <p className="text-4xl font-bold text-amber-400 mt-1">{totalClosed}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setEstimateFilter("open")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  estimateFilter === "open"
                    ? "bg-[#0EA5E9]/10 border-[#0EA5E9]/40 text-[#0EA5E9]"
                    : "border-[#2A2A2A] text-gray-400 hover:text-white"
                }`}
              >
                Open to Respond ({openToRespondSubmissions.length})
              </button>
              <button
                onClick={() => setEstimateFilter("responded")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  estimateFilter === "responded"
                    ? "bg-green-500/10 border-green-500/40 text-green-400"
                    : "border-[#2A2A2A] text-gray-400 hover:text-white"
                }`}
              >
                Responded ({respondedSubmissions.length})
              </button>
              <button
                onClick={() => setEstimateFilter("closed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  estimateFilter === "closed"
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "border-[#2A2A2A] text-gray-400 hover:text-white"
                }`}
              >
                Closed ({closedSubmissions.length})
              </button>
            </div>

            {loadingEst ? (
              <p className="text-center py-20 text-gray-500">Loading...</p>
            ) : visibleSubmissions.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
                <p>
                  {estimateFilter === "open"
                    ? "No open estimates to respond."
                    : estimateFilter === "responded"
                      ? "No responded estimates yet."
                      : "No closed estimates yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-6 hover:border-[#0EA5E9]/30 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{sub.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">{sub.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#1A1A1A] px-3 py-1.5 rounded-full">
                          <Calendar size={12} />
                          {new Date(sub.submittedAt).toLocaleString()}
                        </div>
                        <button
                          onClick={() => { setPayingTo(null); setReplyingTo(replyingTo === sub.id ? null : sub.id); }}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                            replyingTo === sub.id
                              ? "bg-[#0EA5E9]/10 border-[#0EA5E9]/40 text-[#0EA5E9]"
                              : "border-[#2A2A2A] text-gray-400 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30"
                          }`}
                        >
                          <Reply size={12} />
                          {respondedEstimateIds.includes(sub.id) ? "Reply Again" : "Reply"}
                        </button>
                        <button
                          onClick={() => { setReplyingTo(null); setPayingTo(payingTo === sub.id ? null : sub.id); }}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                            payingTo === sub.id
                              ? "bg-green-500/10 border-green-500/40 text-green-400"
                              : "border-[#2A2A2A] text-gray-400 hover:text-green-400 hover:border-green-500/30"
                          }`}
                        >
                          <DollarSign size={12} />
                          Payment Link
                        </button>
                        <button
                          onClick={() => toggleEstimateClosed(sub.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                            closedEstimateIds.includes(sub.id)
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                              : "border-[#2A2A2A] text-gray-400 hover:text-amber-300 hover:border-amber-500/30"
                          }`}
                        >
                          <Check size={12} />
                          {closedEstimateIds.includes(sub.id) ? "Reopen" : "Close"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300"><Phone size={14} className="text-[#0EA5E9] shrink-0" />{sub.phone}</div>
                      <div className="flex items-center gap-2 text-gray-300"><Mail size={14} className="text-[#0EA5E9] shrink-0" />{sub.email}</div>
                      <div className="flex items-center gap-2 text-gray-300"><Car size={14} className="text-[#0EA5E9] shrink-0" />{sub.vehicleYear} {sub.vehicleMake} {sub.vehicleModel}</div>
                      <div className="flex items-center gap-2 text-gray-300"><Tag size={14} className="text-[#0EA5E9] shrink-0" />Plate: {sub.licensePlate}</div>
                      <div className="flex items-center gap-2 text-gray-300 md:col-span-2"><ClipboardList size={14} className="text-[#0EA5E9] shrink-0" />VIN: {sub.vin || "Not provided"}</div>
                      <div className="flex items-center gap-2 text-gray-300 md:col-span-2"><Wrench size={14} className="text-[#0EA5E9] shrink-0" />{sub.serviceNeeded}</div>
                    </div>
                    {sub.message && (
                      <div className="mt-4 pt-4 border-t border-[#1F1F1F] text-sm text-gray-400">
                        <p className="text-xs text-gray-500 mb-1">Message:</p>{sub.message}
                      </div>
                    )}
                    {replyingTo === sub.id && (
                      <ReplyPanel
                        submission={sub}
                        onClose={() => setReplyingTo(null)}
                        onSent={markEstimateResponded}
                      />
                    )}
                    {payingTo === sub.id && (
                      <PaymentPanel submission={sub} onClose={() => setPayingTo(null)} />
                    )}
                  </div>
                ))}
              </div>
            )}
        </>
      </div>
    </div>
  );
}
