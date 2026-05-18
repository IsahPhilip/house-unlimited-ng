import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, Clock3, MapPin, Users2 } from "lucide-react";
import { getJobRoles, getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Careers at House Unlimited Nigeria | Real Estate Jobs in Abuja",
    description: `Explore career opportunities at ${settings.title}. Join a leading real estate development company in Abuja and build meaningful work shaping smarter property decisions.`,
    openGraph: {
      title: "Careers at House Unlimited Nigeria | Real Estate Jobs in Abuja",
      description: `Explore career opportunities at ${settings.title}. Join a leading real estate development company in Abuja.`
    }
  };
}

export default async function CareersPage() {
  const [settings, openRoles] = await Promise.all([getSiteSettings(), getJobRoles(12)]);

  return (
    <div className="animate-in fade-in duration-500 bg-white">
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[#005555] font-semibold mb-3 uppercase tracking-widest text-xs font-bold">Careers</p>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Build meaningful work with a team shaping smarter real estate decisions.
            </h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
              We&apos;re building a team that combines trust, market intelligence, and strong execution. If you care about
              helping people make better property decisions, we&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#open-roles"
                className="inline-flex items-center rounded-full bg-[#005555] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#d8eeee] hover:bg-[#004242] transition-all"
              >
                View Open Roles
              </Link>
              <Link
                href="/contact?topic=careers"
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-bold text-gray-700 hover:border-[#005555] hover:text-[#005555] transition-colors"
              >
                General Career Enquiry
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Users2, label: "People First", text: "Collaborative, supportive, and growth-minded culture." },
              { icon: Briefcase, label: "Real Impact", text: "Work that directly shapes client outcomes and trust." },
              { icon: CheckCircle2, label: "High Standards", text: "Quality, integrity, and follow-through matter here." }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#d8eeee] text-[#005555] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.label}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mb-14">
            <p className="text-[#005555] font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Open Roles</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current opportunities at {settings.title}</h2>
            <p className="text-gray-600">
              These roles reflect the kind of talent we&apos;re actively looking for. If your background overlaps, you can
              apply directly from each card below.
            </p>
          </div>

          {openRoles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {openRoles.map((role) => (
              <article key={role.slug} className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="inline-flex items-center rounded-full bg-[#d8eeee] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#005555]">
                    <Clock3 className="w-3.5 h-3.5 mr-2" />
                    {role.employmentType}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 border border-gray-100">
                    <MapPin className="w-3.5 h-3.5 mr-2" />
                    {role.location}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{role.summary}</p>

                {role.content && (
                  <div className="wp-content prose prose-sm prose-slate max-w-none mb-8 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-ul:my-0">
                    <div dangerouslySetInnerHTML={{ __html: role.content }} />
                  </div>
                )}

                <Link
                  href={`/contact?topic=careers&role=${encodeURIComponent(role.title)}`}
                  className="inline-flex items-center rounded-full bg-[#005555] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#004242] transition-all shadow-lg shadow-[#d8eeee]"
                >
                  {role.applyLabel} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No roles published yet</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Open roles will appear here once they are added and published from WordPress `wp-admin`.
              </p>
              <Link
                href="/contact?topic=careers"
                className="inline-flex items-center rounded-full bg-[#005555] px-7 py-3 text-sm font-bold text-white hover:bg-[#004242] transition-all shadow-lg shadow-[#d8eeee]"
              >
                Send Career Enquiry
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-[#005555] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-3xl bg-[#004242] p-10 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-[#9fd1d1] text-xs font-bold uppercase tracking-widest mb-3">Don&apos;t See Your Role?</p>
              <h2 className="text-3xl font-bold mb-4">We still want to hear from exceptional people.</h2>
              <p className="text-[#d8eeee] text-sm leading-relaxed">
                If your experience aligns with sales, operations, client service, content, or property investment, send a
                career enquiry and tell us how you can contribute.
              </p>
            </div>
            <Link
              href="/contact?topic=careers"
              className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#005555] hover:bg-gray-100 transition-all shadow-lg"
            >
              Send Career Enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
