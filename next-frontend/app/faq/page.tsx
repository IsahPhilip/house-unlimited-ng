import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/lib/json-ld";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | House Unlimited Nigeria",
  description:
    "Find answers to common questions about buying verified land and luxury properties in Abuja, Nigeria — covering title verification, remote investment, fraud prevention, and high-yield opportunities.",
  openGraph: {
    title: "Frequently Asked Questions | House Unlimited Nigeria",
    description:
      "Answers to common questions about buying verified land and luxury properties in Abuja, Nigeria."
  }
};

const faqs = [
  {
    question: "How can diaspora investors safely buy verified land or properties in Abuja without risk of title fraud?",
    answer:
      "Diaspora investors can safely acquire property in Abuja by insisting on independent title verification through the Abuja Geographic Information Systems (AGIS) prior to making any payment. Partnering with a verified agency ensures property titles, owner IDs, and C of O documents are fully authenticated before transactions take place.",
    details: [
      "Verification Standard: House Unlimited Nigeria provides 98%+ verification coverage on all listings.",
      "Speed: Title, ownership, and encumbrance checks are completed within 48 hours.",
      "Document Checks: Full validation of Certificates of Occupancy (C of O), Right of Occupancy (R of O), and Governor's Consent."
    ]
  },
  {
    question: "What is the process for verifying a Certificate of Occupancy (C of O) in Abuja remotely?",
    answer:
      "Remote C of O verification requires submitting the file number, plot number, and legal documentation to AGIS for a formal search. House Unlimited Nigeria handles this process on-ground in Abuja, providing investors with official search reports and price validation without requiring physical travel."
  },
  {
    question: "Can I inspect and purchase a luxury home in Abuja while living abroad?",
    answer:
      "Yes, you can inspect and purchase luxury properties in Abuja completely remotely through guided virtual tours, live video walkthroughs, and high-fidelity architectural renders. Legal documents and contracts of sale can be safely reviewed and executed digitally.",
    details: [
      "Guided Virtual Tours: On-site walkthroughs scheduled according to your time zone.",
      "On-Ground Office: Physical coordination from our Abuja office at Suite S23 Febson Mall, Wuse.",
      "Price Validation: Independent assessment to ensure fair market value and prevent markup fraud."
    ]
  },
  {
    question: "How do off-plan property investments work in Abuja for international buyers?",
    answer:
      "Off-plan property investments allow diaspora buyers to purchase luxury terraces or apartments in high-growth corridors before completion at lower entry prices. Investors pay in structured milestones aligned with construction progress verified by on-ground inspection teams."
  },
  {
    question: "Which areas in Abuja offer the highest ROI and capital appreciation for real estate investors?",
    answer:
      "Prime residential and high-growth corridors in Abuja — including Maitama, Asokoro, Wuse II, Katampe Extension, and Guzape — yield the highest capital appreciation and rental demand. Properties with guaranteed C of O titles in these districts consistently attract diplomatic and corporate tenants."
  }
];

const clusters: { title: string; indices: number[] }[] = [
  { title: "Title Verification & Fraud Prevention", indices: [0, 1] },
  { title: "Remote Inspections & Transaction Security", indices: [2, 3] },
  { title: "High-Yield Corridors & Investment Returns", indices: [4] }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        faq.answer +
        (faq.details
          ? "\n\n" + faq.details.map((d) => `• ${d}`).join("\n")
          : "")
    }
  }))
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema} id="faq-jsonld" />

      <div className="animate-in fade-in duration-500 bg-gray-50 min-h-screen">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center space-x-2 text-xs text-gray-400 font-medium mb-6">
              <Link href="/" className="hover:text-[#005555] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-600">FAQ</span>
            </nav>
            <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-2">Support</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Frequently Asked <span className="text-gray-400 font-light italic">Questions</span>
            </h1>
            <p className="text-gray-500 max-w-xl">
              Everything you need to know about buying verified properties in Abuja.
              Can&apos;t find your answer?{" "}
              <Link href="/contact" className="text-[#005555] font-bold hover:underline">
                Contact our team
              </Link>
              .
            </p>
          </div>
        </section>

        {/* FAQ clusters */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Sticky cluster nav */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-4">Topics</p>
                <nav className="space-y-2">
                  {clusters.map((c) => (
                    <a
                      key={c.title}
                      href={`#${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#005555] font-medium transition-colors py-1"
                    >
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                      {c.title}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-3">Still have questions?</p>
                  <Link
                    href="/contact"
                    className="block w-full bg-[#005555] text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-[#004444] transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </aside>

            {/* Questions */}
            <div className="lg:col-span-2 space-y-10">
              {clusters.map((cluster) => (
                <div
                  key={cluster.title}
                  id={cluster.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                >
                  <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-2">
                    {cluster.title}
                  </p>
                  <div className="space-y-4">
                    {cluster.indices.map((i) => {
                      const faq = faqs[i];
                      return (
                        <div
                          key={faq.question}
                          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                          <h2 className="text-base font-bold text-gray-900 mb-3 leading-snug">
                            {faq.question}
                          </h2>
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                          {faq.details && (
                            <ul className="mt-4 space-y-2">
                              {faq.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#005555] mt-2 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-[#005555] rounded-3xl p-8 text-white">
                <p className="text-xs font-bold text-[#d8eeee] uppercase tracking-widest mb-2">Still unsure?</p>
                <h3 className="text-xl font-bold mb-2">
                  Speak to an <span className="text-[#d8eeee] italic font-light">expert agent</span>
                </h3>
                <p className="text-[#d8eeee] text-sm mb-6">
                  Our team is available Monday – Friday, 8 AM – 5 PM WAT.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="bg-white text-[#005555] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d8eeee] transition-colors"
                  >
                    Send a Message
                  </Link>
                  <Link
                    href="/properties"
                    className="border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
