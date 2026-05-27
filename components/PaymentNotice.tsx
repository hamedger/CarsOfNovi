import { CreditCard } from "lucide-react";
import { CREDIT_CARD_SURCHARGE_NOTICE } from "@/lib/site";

type PaymentNoticeProps = {
  className?: string;
  compact?: boolean;
};

export default function PaymentNotice({ className = "", compact = false }: PaymentNoticeProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-[#1F1F1F] bg-[#111111] ${
        compact ? "px-3 py-2.5" : "px-4 py-3"
      } ${className}`}
    >
      <CreditCard
        size={compact ? 14 : 16}
        className="text-[#0EA5E9] shrink-0 mt-0.5"
        aria-hidden
      />
      <p className={`text-gray-400 leading-relaxed ${compact ? "text-xs" : "text-sm"}`}>
        {CREDIT_CARD_SURCHARGE_NOTICE}
      </p>
    </div>
  );
}
