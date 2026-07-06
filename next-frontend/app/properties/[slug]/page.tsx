import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IMAGE_SIZES, OptimizedImage } from "@/components/optimized-image";
import { getPropertyBySlug, getPropertySlugs, getSiteSettings } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";
import { PropertyEnquiry } from "./property-enquiry";
import { Bed, Bath, Square, MapPin, Phone, Mail, ArrowLeft, Tag } from "lucide-react";

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) return { title: "Property Not Found" };

  return {
    title: `${property.title} | House Unlimited Nigeria`,
    description: property.excerpt,
    openGraph: {
      title: `${property.title} | House Unlimited Nigeria`,
      description: property.excerpt,
      images: property.image ? [property.image] : []
    }
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const [property, settings] = await Promise.all([
    getPropertyBySlug(slug),
    getSiteSettings()
  ]);

  if (!property) notFound();

  const siteUrl = settings.siteUrl;

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: siteUrl + "/properties" },
      { "@type": "ListItem", position: 3, name: property.title, item: siteUrl + "/properties/" + property.slug }
    ]
  };

  const numericArea = property.area
    ? Number.parseFloat(String(property.area).replace(/[^0-9.]/g, ""))
    : undefined;

  const listingSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.excerpt || property.content || "",
    url: siteUrl + "/properties/" + property.slug,
    image: property.image,
    additionalProperty: [
      property.bedrooms !== undefined && { "@type": "PropertyValue", name: "Bedrooms", value: String(property.bedrooms) },
      property.bathrooms !== undefined && { "@type": "PropertyValue", name: "Bathrooms", value: String(property.bathrooms) },
      property.type && { "@type": "PropertyValue", name: "Property Type", value: property.type },
      property.status && { "@type": "PropertyValue", name: "Status", value: property.status }
    ].filter(Boolean)
  };

  if (property.price) {
    listingSchema.offers = {
      "@type": "Offer",
      price: String(property.price).replace(/[^0-9.]/g, ""),
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/properties/" + property.slug
    };
  }

  if (property.location) {
    listingSchema.address = {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: "Federal Capital Territory",
      addressCountry: "NG"
    };
  }

  if (numericArea) {
    listingSchema.floorSize = { "@type": "QuantitativeValue", value: numericArea, unitCode: "SQM" };
  }

  const stats = [
    property.bedrooms != null && { icon: Bed, value: property.bedrooms, label: "Bedrooms" },
    property.bathrooms != null && { icon: Bath, value: property.bathrooms, label: "Bathrooms" },
    property.area && { icon: Square, value: property.area, label: "Area" },
    property.type && { icon: Tag, value: property.type, label: "Type" }
  ].filter(Boolean) as { icon: React.ElementType; value: string | number; label: string }[];

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="property-breadcrumb-jsonld" />
      <JsonLd data={listingSchema} id="property-listing-jsonld" />

      <div className="bg-gray-50 min-h-screen animate-in fade-in duration-500">

        {/* Hero Image */}
        {property.image && (
          <div className="relative w-full h-[55vh] min-h-[380px] overflow-hidden bg-gray-900">
            <OptimizedImage
              src={property.image}
              alt={property.title}
              sizes={IMAGE_SIZES.hero}
              className="object-cover opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

            {/* Breadcrumb overlay */}
            <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4">
              <Link href="/properties" className="inline-flex items-center text-white/80 hover:text-white text-sm font-medium transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Properties
              </Link>
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  {property.listingType && (
                    <span className="inline-block bg-[#005555] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      {property.listingType === "off-plan" ? "Off-Plan" : "Completed"}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{property.title}</h1>
                  {property.location && (
                    <div className="flex items-center text-white/70 mt-2 text-sm">
                      <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      {property.location}
                    </div>
                  )}
                </div>
                <div className="md:text-right flex-shrink-0">
                  {property.price && (
                    <div className="text-3xl font-bold text-white">{property.price}</div>
                  )}
                  {property.status && (
                    <div className="text-white/60 text-sm mt-1 uppercase tracking-widest font-medium">{property.status}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* Stats bar */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white rounded-2xl p-5 flex items-center space-x-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-[#d8eeee] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#005555]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 leading-none">{value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Gallery */}
              {property.gallery && property.gallery.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Gallery</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <OptimizedImage
                          src={image}
                          alt={`${property.title} — photo ${index + 1}`}
                          sizes={IMAGE_SIZES.propertyThumb}
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-3">About This Property</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property <span className="text-gray-400 font-light italic">Description</span></h2>
                <div
                  className="prose prose-gray prose-sm max-w-none leading-relaxed text-gray-600"
                  dangerouslySetInnerHTML={{ __html: property.content || property.excerpt }}
                />
              </div>

              {/* Details table */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-3">Specifications</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property <span className="text-gray-400 font-light italic">Details</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Property Type", value: property.type },
                    { label: "Location", value: property.location },
                    { label: "Bedrooms", value: property.bedrooms },
                    { label: "Bathrooms", value: property.bathrooms },
                    { label: "Area", value: property.area },
                    { label: "Status", value: property.status },
                    { label: "Listing Type", value: property.listingType === "off-plan" ? "Off-Plan" : property.listingType === "completed" ? "Completed" : undefined }
                  ]
                    .filter((item) => item.value != null && item.value !== "")
                    .map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                        <span className="text-sm font-bold text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Enquiry form */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-1">Make an Enquiry</p>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Interested in <span className="text-gray-400 font-light italic">this property?</span></h3>
                <PropertyEnquiry propertyTitle={property.title} />
              </div>

              {/* Contact info */}
              <div className="bg-slate-900 rounded-3xl p-7 text-white">
                <p className="text-xs font-bold text-[#005555] uppercase tracking-widest mb-1">Direct Contact</p>
                <h3 className="text-lg font-bold mb-6">Speak to an <span className="text-gray-400 font-light italic">Agent</span></h3>
                <div className="space-y-4">
                  <a href={`tel:${settings.phone}`} className="flex items-center space-x-4 group">
                    <div className="w-10 h-10 bg-[#005555] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#004444] transition-colors">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                      <p className="font-bold text-sm">{settings.phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${settings.email}`} className="flex items-center space-x-4 group">
                    <div className="w-10 h-10 bg-[#005555] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#004444] transition-colors">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                      <p className="font-bold text-sm">{settings.email}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#005555] rounded-3xl p-7 text-white">
                <p className="text-xs font-bold text-[#d8eeee] uppercase tracking-widest mb-2">Browse More</p>
                <h3 className="text-lg font-bold mb-4">Looking for more <span className="text-[#d8eeee] italic font-light">options?</span></h3>
                <Link
                  href="/properties"
                  className="inline-flex items-center bg-white text-[#005555] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d8eeee] transition-colors"
                >
                  View All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
