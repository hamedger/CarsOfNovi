"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Send, Mail } from "lucide-react";
import PaymentNotice from "@/components/PaymentNotice";
import { SHOP_EMAIL } from "@/lib/site";
import {
  buildEstimateMailtoUrl,
  createEstimateReferenceId,
  submitEstimateViaFormSubmit,
} from "@/lib/estimateSubmit";

type FormData = {
  name: string;
  phone: string;
  email: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vin: string;
  licensePlate: string;
  serviceNeeded: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

const services = [
  "Engine Repair",
  "Diagnostics",
  "Brake Service",
  "Suspension Repair",
  "Oil Change",
  "Electrical Repair",
  "Transmission Service",
  "AC / Heating",
  "Tire Service",
  "Other",
];

const initialData: FormData = {
  name: "",
  phone: "",
  email: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vin: "",
  licensePlate: "",
  serviceNeeded: "",
  message: "",
};

function InputField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = (error?: string) =>
  `w-full bg-[#0A0A0A] border ${error ? "border-red-500/60" : "border-[#2A2A2A]"} rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all`;

export default function EstimateSection() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [successRef, setSuccessRef] = useState("");
  const [serverError, setServerError] = useState("");
  const [pendingMailtoRef, setPendingMailtoRef] = useState<string | null>(null);
  const [sentViaMailto, setSentViaMailto] = useState(false);

  const validateForm = (): FieldErrors => {
    const clientErrors: FieldErrors = {};
    if (!formData.name || formData.name.trim().length < 2) clientErrors.name = "Name must be at least 2 characters.";
    if (!formData.phone || !/^\+?[\d\s\-()]{7,15}$/.test(formData.phone)) clientErrors.phone = "Please enter a valid phone number.";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) clientErrors.email = "Please enter a valid email address.";
    if (!formData.vehicleYear || isNaN(Number(formData.vehicleYear)) || Number(formData.vehicleYear) < 1980 || Number(formData.vehicleYear) > new Date().getFullYear() + 1)
      clientErrors.vehicleYear = "Please enter a valid vehicle year.";
    if (!formData.vehicleMake || formData.vehicleMake.trim().length < 2) clientErrors.vehicleMake = "Please enter the vehicle make.";
    if (!formData.vehicleModel || formData.vehicleModel.trim().length < 1) clientErrors.vehicleModel = "Please enter the vehicle model.";
    if (!formData.licensePlate || formData.licensePlate.trim().length < 2) clientErrors.licensePlate = "Please enter a valid license plate.";
    if (formData.vin && !/^[A-HJ-NPR-Z0-9]{17}$/i.test(formData.vin.trim())) clientErrors.vin = "VIN must be 17 characters (letters and numbers).";
    if (!formData.serviceNeeded) clientErrors.serviceNeeded = "Please select a service.";
    return clientErrors;
  };

  const openMailtoEstimate = (refId?: string) => {
    const referenceId = refId ?? createEstimateReferenceId();
    window.location.href = buildEstimateMailtoUrl(formData, referenceId);
    setSuccessRef(referenceId);
    setSentViaMailto(true);
    setStatus("success");
    setFormData(initialData);
    setErrors({});
    setServerError("");
    setPendingMailtoRef(null);
  };

  const handleMailtoClick = () => {
    setServerError("");
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    openMailtoEstimate(pendingMailtoRef ?? undefined);
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setServerError("");

    const clientErrors = validateForm();

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus("idle");
      return;
    }

    const refId = createEstimateReferenceId();

    try {
      const result = await submitEstimateViaFormSubmit(formData, refId);

      if (result.ok) {
        setSuccessRef(refId);
        setSentViaMailto(false);
        setStatus("success");
        setFormData(initialData);
        setErrors({});
        setPendingMailtoRef(null);
        return;
      }

      if (result.needsActivation) {
        setPendingMailtoRef(refId);
        setServerError(
          `We're finishing a one-time setup for online forms. Check ${SHOP_EMAIL} for an "Activate Form" email from FormSubmit and click the link once. Or send your request using the button below.`
        );
        setStatus("error");
        return;
      }

      setServerError(
        result.message || "Could not send online. Use the email button below or call (248) 347-2021."
      );
      setPendingMailtoRef(refId);
      setStatus("error");
    } catch {
      setServerError("Network error. Use the email button below or call (248) 347-2021.");
      setPendingMailtoRef(refId);
      setStatus("error");
    }
  };

  return (
    <section id="estimate" className="relative py-24 bg-black">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/30 to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0EA5E9]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#0EA5E9] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Free Estimate
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Request an Estimate
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Tell us about your vehicle and needed service. We&apos;ll get back to you within 48 hr.
          </p>
          <div className="mt-6 max-w-lg mx-auto">
            <PaymentNotice prominent />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-10"
              >
                <CheckCircle className="text-green-400 mx-auto mb-4" size={52} />
                <h3 className="text-white font-display text-2xl font-bold mb-2">
                  Request Received!
                </h3>
                <p className="text-gray-400 mb-4">
                  {sentViaMailto
                    ? "Your email app should open — tap Send to complete your estimate request."
                    : "We'll review your request and contact you shortly."}
                </p>
                <p className="text-xs text-gray-500 font-mono bg-[#111] border border-[#1F1F1F] px-4 py-2 rounded-lg inline-block">
                  Reference: {successRef}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setSentViaMailto(false);
                    }}
                    className="text-[#0EA5E9] text-sm hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name *" id="name" error={errors.name}>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={set("name")}
                      className={inputClass(errors.name)}
                    />
                  </InputField>
                  <InputField label="Phone *" id="phone" error={errors.phone}>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="(248) 347-2021"
                      value={formData.phone}
                      onChange={set("phone")}
                      className={inputClass(errors.phone)}
                    />
                  </InputField>
                </div>

                {/* Email */}
                <InputField label="Email Address *" id="email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@email.com"
                    value={formData.email}
                    onChange={set("email")}
                    className={inputClass(errors.email)}
                  />
                </InputField>

                {/* Vehicle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InputField label="Year *" id="vehicleYear" error={errors.vehicleYear}>
                    <input
                      id="vehicleYear"
                      type="number"
                      placeholder="2020"
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      value={formData.vehicleYear}
                      onChange={set("vehicleYear")}
                      className={inputClass(errors.vehicleYear)}
                    />
                  </InputField>
                  <InputField label="Make *" id="vehicleMake" error={errors.vehicleMake}>
                    <input
                      id="vehicleMake"
                      type="text"
                      placeholder="Toyota"
                      value={formData.vehicleMake}
                      onChange={set("vehicleMake")}
                      className={inputClass(errors.vehicleMake)}
                    />
                  </InputField>
                  <InputField label="Model *" id="vehicleModel" error={errors.vehicleModel}>
                    <input
                      id="vehicleModel"
                      type="text"
                      placeholder="Camry"
                      value={formData.vehicleModel}
                      onChange={set("vehicleModel")}
                      className={inputClass(errors.vehicleModel)}
                    />
                  </InputField>
                  <InputField label="License Plate *" id="licensePlate" error={errors.licensePlate}>
                    <input
                      id="licensePlate"
                      type="text"
                      placeholder="ABC1234"
                      value={formData.licensePlate}
                      onChange={set("licensePlate")}
                      className={inputClass(errors.licensePlate)}
                    />
                  </InputField>
                  <InputField label="VIN (Optional)" id="vin" error={errors.vin}>
                    <input
                      id="vin"
                      type="text"
                      placeholder="1HGCM82633A004352"
                      value={formData.vin}
                      onChange={set("vin")}
                      className={inputClass(errors.vin)}
                    />
                  </InputField>
                </div>

                {/* Service */}
                <InputField label="Service Needed *" id="serviceNeeded" error={errors.serviceNeeded}>
                  <select
                    id="serviceNeeded"
                    value={formData.serviceNeeded}
                    onChange={set("serviceNeeded")}
                    className={`${inputClass(errors.serviceNeeded)} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a service...
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </InputField>

                {/* Message */}
                <InputField label="Additional Details" id="message" error={errors.message}>
                  <textarea
                    id="message"
                    placeholder="Describe your issue or any additional information..."
                    rows={4}
                    value={formData.message}
                    onChange={set("message")}
                    className={`${inputClass()} resize-none`}
                  />
                </InputField>

                {/* Server error */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {pendingMailtoRef && status === "error" && (
                  <button
                    type="button"
                    onClick={handleMailtoClick}
                    className="w-full flex items-center justify-center gap-2 border border-[#0EA5E9]/40 bg-[#0EA5E9]/10 hover:bg-[#0EA5E9]/20 text-[#0EA5E9] font-semibold text-sm py-3.5 rounded-xl transition-colors"
                  >
                    <Mail size={18} />
                    Send via your email app instead
                  </button>
                )}

                <PaymentNotice />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-xl transition-colors shadow-lg shadow-[#0EA5E9]/20"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Estimate Request
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gray-500 leading-relaxed">
                  We typically respond within 48 hr. No commitment required.
                  <br />
                  <button
                    type="button"
                    onClick={handleMailtoClick}
                    className="text-[#0EA5E9] hover:underline mt-1"
                  >
                    Send using your email app
                  </button>
                  {" · "}
                  <a href="tel:+12483472021" className="text-[#0EA5E9] hover:underline">
                    (248) 347-2021
                  </a>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
