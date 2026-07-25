
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | House Unlimited Nigeria',
  description: 'Find answers to common questions about buying verified land and luxury properties in Abuja, Nigeria, with a focus on remote investment, fraud prevention, and high-yield opportunities.',
};

const faqs = [
  {
    question: "How can diaspora investors safely buy verified land or properties in Abuja without risk of title fraud?",
    answer: "Diaspora investors can safely acquire property in Abuja by insisting on independent title verification through the Abuja Geographic Information Systems (AGIS) prior to making any payment. Partnering with a verified agency ensures property titles, owner IDs, and C of O documents are fully authenticated before transactions take place.",
    details: [
        "Verification Standard: House Unlimited Nigeria provides 98%+ verification coverage on all listings.",
        "Speed: Title, ownership, and encumbrance checks are completed within 48 hours.",
        "Document Checks: Full validation of Certificates of Occupancy (C of O), Right of Occupancy (R of O), and Governor's Consent."
    ]
  },
  {
    question: "What is the process for verifying a Certificate of Occupancy (C of O) in Abuja remotely?",
    answer: "Remote C of O verification requires submitting the file number, plot number, and legal documentation to AGIS for a formal search. House Unlimited Nigeria handles this process on-ground in Abuja, providing investors with official search reports and price validation without requiring physical travel."
  },
  {
    question: "Can I inspect and purchase a luxury home in Abuja while living abroad?",
    answer: "Yes, you can inspect and purchase luxury properties in Abuja completely remotely through guided virtual tours, live video walkthroughs, and high-fidelity architectural renders. Legal documents and contracts of sale can be safely reviewed and executed digitally.",
    details: [
        "Guided Virtual Tours: On-site walkthroughs scheduled according to your time zone.",
        "On-Ground Office: Physical coordination from our Abuja office at Suite S23 Febson Mall, Wuse.",
        "Price Validation: Independent assessment to ensure fair market value and prevent markup fraud."
    ]
  },
  {
    question: "How do off-plan property investments work in Abuja for international buyers?",
    answer: "Off-plan property investments allow diaspora buyers to purchase luxury terraces or apartments in high-growth corridors before completion at lower entry prices. Investors pay in structured milestones aligned with construction progress verified by on-ground inspection teams."
  },
  {
    question: "Which areas in Abuja offer the highest ROI and capital appreciation for real estate investors?",
    answer: "Prime residential and high-growth corridors in Abuja—including Maitama, Asokoro, Wuse II, Katampe Extension, and Guzape—yield the highest capital appreciation and rental demand. Properties with guaranteed C of O titles in these districts consistently attract diplomatic and corporate tenants."
  }
];

const faqClusters = {
    "Title Verification & Fraud Prevention": [faqs[0], faqs[1]],
    "Remote Inspections & Transaction Security": [faqs[2], faqs[3]],
    "High-Yield Corridors & Investment Returns": [faqs[4]],
}

const JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer + (faq.details ? `\n\n<ul>${faq.details.map(d => `<li>${d}</li>`).join('')}</ul>` : '')
    }
  }))
};

export default function FAQPage() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JsonLdSchema) }}
        />
      </Head>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-gray-500">
                Can’t find the answer you’re looking for? Reach out to our{' '}
                <a href="/contact" className="font-medium text-cyan-600 hover:text-cyan-500">
                  customer support
                </a>{' '}
                team.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
            {Object.entries(faqClusters).map(([title, clusterFaqs]) => (
                <div key={title} className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                    <dl className="space-y-12">
                        {clusterFaqs.map((faq) => (
                        <div key={faq.question}>
                            <dt className="text-lg leading-6 font-medium text-gray-900">{faq.question}</dt>
                            <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                            {faq.details && (
                                <dd className="mt-2 text-base text-gray-500">
                                    <ul className="list-disc list-inside">
                                        {faq.details.map((detail, i) => <li key={i}>{detail}</li>)}
                                    </ul>
                                </dd>
                            )}
                        </div>
                        ))}
                    </dl>
                </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
