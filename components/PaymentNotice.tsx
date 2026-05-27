import { CreditCard } from "lucide-react";
import { CREDIT_CARD_SURCHARGE_NOTICE } from "@/lib/site";

type PaymentNoticeProps = {
  className?: string;
  compact?: boolean;
  prominent?: boolean;
};

export default function PaymentNotice({
  className = "",
  compact = false,
  prominent = false,
}: PaymentNoticeProps) {
  if (prominent) {
    return (
      <div
        className={`flex items-center justify-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center ${className}`}
        role="note"
      >
        <CreditCard size={18} className="text-amber-400 shrink-0" aria-hidden />
        <p className="text-sm sm:text-base text-amber-100 font-medium leading-snug">
          <span className="text-amber-300 font-semibold">3% surcharge</span> applies to all
          credit card payments.
        </p>
      </div>
    );
  }

  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 rounded-xl border border-[#0EA5E9]/30 bg-[#0EA5E9]/5 ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      } ${className}`}
    >
      <CreditCard
        size={compact ? 15 : 18}
        className="text-[#0EA5E9] shrink-0 mt-0.5"
        aria-hidden
      />
      <p className={`text-gray-200 leading-relaxed ${compact ? "text-xs" : "text-sm"}`}>
        {CREDIT_CARD_SURCHARGE_NOTICE}
      </p>
    </div>
  );
}
