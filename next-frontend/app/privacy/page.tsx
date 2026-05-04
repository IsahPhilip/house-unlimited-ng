import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Privacy Policy",
    description: `Read the privacy policy for ${settings.title}.`
  };
}

const sections = [
  {
    heading: "Information We Collect",
    body:
      "We collect the details you submit through contact forms, property enquiries, newsletter signups, and other direct interactions with House Unlimited Nigeria. This may include your name, phone number, email address, preferred property locations, and any additional information you choose to share."
  },
  {
    heading: "How We Use Your Information",
    body:
      "We use your information to respond to enquiries, recommend suitable properties, provide client support, share relevant updates, and improve our services. We do not sell your personal information to third parties."
  },
  {
    heading: "Marketing Communications",
    body:
      "If you subscribe to our updates, we may send you listing alerts, company news, and promotional messages. You can opt out of marketing emails at any time by using the unsubscribe option in the message or by contacting our team directly."
  },
  {
    heading: "Data Sharing",
    body:
      "We may share limited information with trusted service providers, legal advisers, or transaction partners only when necessary to support our operations, comply with legal obligations, or help complete a property-related service you requested."
  },
  {
    heading: "Data Security",
    body:
      "We take reasonable administrative and technical steps to protect your data from unauthorized access, loss, or misuse. While no online system is completely risk-free, we work to keep your information secure and handled responsibly."
  },
  {
    heading: "Your Rights",
    body:
      "You may request access to the personal information we hold about you, ask for corrections, or request deletion where appropriate. For privacy-related requests, please contact House Unlimited Nigeria through the details on our contact page."
  }
];

export default async function PrivacyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Privacy</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy <span className="text-gray-400 italic font-light">Policy</span></h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            This policy explains how {settings.title} collects, uses, and protects personal information across our website and client touchpoints.
          </p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
