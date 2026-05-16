"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

type ReviewItem = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
  vehicle?: string;
};

const fallbackReviews: ReviewItem[] = [
  {
    authorName: "Marcus T.",
    vehicle: "2019 Ford F-150",
    rating: 5,
    text: "Brought my truck in for a transmission issue another shop had been chasing for months. The team at C.A.R.S. diagnosed and fixed it in two days. Honest pricing, no upsells. My new go-to shop.",
    relativeTime: "March 2025",
  },
  {
    authorName: "Sarah K.",
    vehicle: "2021 Honda Accord",
    rating: 5,
    text: "I was nervous about finding a new mechanic after moving to Novi. C.A.R.S. made it easy — they walked me through everything, showed me the worn parts, and got my car back same day. Outstanding service.",
    relativeTime: "January 2025",
  },
  {
    authorName: "David R.",
    vehicle: "2017 BMW 3 Series",
    rating: 5,
    text: "Finally a shop that handles European cars without charging dealership prices. The electrical diagnosis was thorough and they fixed the root cause, not just the symptom. Highly recommend.",
    relativeTime: "April 2025",
  },
  {
    authorName: "Priya M.",
    vehicle: "2020 Toyota RAV4",
    rating: 5,
    text: "Needed brake pads and an oil change on short notice. They squeezed me in, finished in under two hours, and the estimate matched the final bill exactly. Refreshingly honest.",
    relativeTime: "February 2025",
  },
  {
    authorName: "James W.",
    vehicle: "2016 Chevrolet Silverado",
    rating: 5,
    text: "These guys know their stuff. Suspension rebuild on my Silverado came out perfect. Drives better than it did when I bought it. Fair prices and the work is backed up.",
    relativeTime: "March 2025",
  },
  {
    authorName: "Linda H.",
    vehicle: "2018 Jeep Grand Cherokee",
    rating: 5,
    text: "From the front desk to the service bay, everyone was professional and friendly. They kept me updated throughout the repair. Won't take my Jeep anywhere else.",
    relativeTime: "April 2025",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-[#0EA5E9] fill-[#0EA5E9]" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const STATIC_RATING = 5.0;
const STATIC_TOTAL_REVIEWS = 200;

export default function TestimonialsSection() {
  const reviews = fallbackReviews;
  const totalReviewLabel = `${STATIC_TOTAL_REVIEWS}+ reviews`;

  return (
    <section id="reviews" className="relative py-24 bg-[#050505]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#0EA5E9] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Customer Reviews
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-[#0EA5E9] fill-[#0EA5E9]" />
              ))}
            </div>
            <span className="text-white font-semibold">{STATIC_RATING.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">· {totalReviewLabel}</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {reviews.map((t) => (
            <motion.div
              key={`${t.authorName}-${t.text.slice(0, 24)}`}
              variants={cardVariants}
              className="group bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#0EA5E9]/20 transition-colors flex flex-col"
            >
              <Quote
                size={28}
                className="text-[#0EA5E9]/30 mb-4 group-hover:text-[#0EA5E9]/50 transition-colors"
              />
              <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5">{t.text}</p>
              <div className="flex items-end justify-between gap-2 pt-4 border-t border-[#1F1F1F]">
                <div>
                  <p className="text-white font-semibold text-sm">{t.authorName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.vehicle || "Google Review"}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={t.rating} />
                  <p className="text-gray-600 text-xs mt-1">{t.relativeTime}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
