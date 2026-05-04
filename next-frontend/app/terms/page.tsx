import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Terms and Conditions",
    description: `Review the user terms and conditions for ${settings.title}.`
  };
}

const sections = [
  {
    heading: "Use of This Website",
    body:
      "This website is provided for general information, property discovery, and enquiry purposes. By using the site, you agree to use it lawfully and in a way that does not interfere with the operation, security, or availability of the service."
  },
  {
    heading: "Property Information",
    body:
      "We work to keep listings, prices, descriptions, and availability as accurate as possible, but property information may change without notice. Nothing on this website should be treated as a final legal offer, valuation, or contractual commitment until confirmed directly with our team."
  },
  {
    heading: "Client Enquiries",
    body:
      "When you submit an enquiry, you agree to provide accurate contact information and genuine property requirements. House Unlimited Nigeria may contact you in response to your request and to support any related transaction or follow-up service."
  },
  {
    heading: "Intellectual Property",
    body:
      "All branding, written content, layout, photography, graphics, and other materials on this website remain the property of House Unlimited Nigeria or their respective owners unless otherwise stated. You may not reproduce or republish them without prior written permission."
  },
  {
    heading: "Third-Party Links and Services",
    body:
      "Some pages may reference third-party tools, media, maps, or external sites. We are not responsible for the content, availability, or privacy practices of those third-party services."
  },
  {
    heading: "Limitation of Liability",
    body:
      "House Unlimited Nigeria is not liable for indirect or consequential losses arising from use of this website, reliance on listing summaries, temporary downtime, or technical interruptions. Users should independently verify all key property and transaction details before making decisions."
  }
];

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & <span className="text-gray-400 italic font-light">Conditions</span></h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            These terms govern access to and use of the {settings.title} website, content, and public enquiry features.
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
