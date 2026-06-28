import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";

const questions = [
  {
    question: "How do I verify a property listing on House Unlimited Nigeria?",
    answer: "We verify identity, ownership documentation, and conduct on-site inspections before any listing goes live. This covers title checks, site validation, and price benchmarking against market comparables.",
  },
  {
    question: "What areas in Abuja do you cover?",
    answer: "We operate across prime Abuja districts including Maitama, Wuse, Garki, Asokoro, Jabi, and surrounding high-growth zones. Contact our team for availability in your preferred area.",
  },
  {
    question: "How do I schedule a property inspection?",
    answer: "You can schedule an inspection via the property inquiry form on any listing page or by calling us at +234 904 375 2708. We recommend booking at least 48 hours in advance.",
  },
  {
    question: "Are your listings available for rent or purchase?",
    answer:
      "Most listings are for sale, but selected properties are also available for rent. Each listing clearly states whether it is for sale, rent, or both.",
  },
  {
    question: "What documents are required to buy a property?",
    answer: "Typical requirements include a valid means of identification, proof of income, and any transaction-specific documentation. Our advisory team will guide you through the exact requirements for your purchase.",
  },
  {
    question: "How can I list my property with House Unlimited Nigeria?",
    answer: "Contact us via our enquiries page or call +234 904 375 2708. Our team will schedule a verification visit and publish your listing once all documentation checks are complete.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Real Estate FAQ | House Unlimited Nigeria",
    description:
      "Get answers to common questions about buying, selling, and investing in Abuja real estate with House Unlimited Nigeria.",
    openGraph: {
      title: "Real Estate FAQ | House Unlimited Nigeria",
      description:
        "Get answers to common questions about buying, selling, and investing in Abuja real estate.",
    },
  };
}

export default async function FAQPage() {
  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-[#005555] font-semibold mb-2 uppercase tracking-widest text-xs font-bold">FAQ</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Answers to common questions about buying, selling, and investing in Abuja real estate.</p>
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <details
              key={index}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm group"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer text-gray-900 font-bold text-sm">
                {item.question}
                <span className="ml-4 text-[#005555] text-xs">+</span>
              </summary>
              <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">Still have questions?</p>
          <a
            href="/contact"
 className="text-[#005555] font-bold text-sm hover:underline"
          >
            Talk to our team
          </a>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        }}
        id="faq-jsonld"
      />
    </div>
  );
}
