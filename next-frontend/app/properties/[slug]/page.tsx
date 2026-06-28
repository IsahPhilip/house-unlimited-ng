import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IMAGE_SIZES, OptimizedImage } from "@/components/optimized-image";
import { getPropertyBySlug, getPropertySlugs } from "@/lib/wordpress";
import { JsonLd } from "@/lib/json-ld";
import { Bed, Bath, Square, MapPin, Phone, Mail } from "lucide-react";

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

  if (!property) {
    return {
      title: "Property Not Found"
    };
  }

  return {
    title: property.title,
    description: property.excerpt,
    openGraph: {
      images: property.image ? [property.image] : []
    }
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const siteUrl = "https://houseunlimitednigeria.com";
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Properties", item: siteUrl + "/properties" },
      { "@type": "ListItem", position: 3, name: property.title, item: siteUrl + "/properties/" + property.slug },
    ],
  };

  const numericArea = property.area ? Number.parseFloat(String(property.area).replace(/[^0-9.]/g, "")) : undefined;

  const listingSchema = {
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
      property.status && { "@type": "PropertyValue", name: "Status", value: property.status },
      numericArea && { "@type": "PropertyValue", name: "Area", value: String(numericArea) },
    ].filter(Boolean),
  };

  if (property.price) {
    listingSchema.offers = {
      "@type": "Offer",
      price: String(property.price).replace(/[^0-9.]/g, ""),
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: siteUrl + "/properties/" + property.slug,
    };
  }

  if (property.location) {
    listingSchema.address = {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: "Federal Capital Territory",
      addressCountry: "NG",
    };
  }

  if (numericArea) {
    listingSchema.floorSize = { "@type": "QuantitativeValue", value: numericArea, unitCode: "SQM" };
  }

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="property-breadcrumb-jsonld" />
      <JsonLd data={listingSchema} id="property-listing-jsonld" />
      <div className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#005555] mb-1">{property.price}</div>
              <div className="text-sm text-gray-500">{property.status}</div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <Bed className="w-6 h-6 text-[#005555] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <Bath className="w-6 h-6 text-[#005555] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <Square className="w-6 h-6 text-[#005555] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">{property.area}</div>
              <div className="text-sm text-gray-600">Area</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-lg font-bold text-gray-900">{property.type}</div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            {property.image && (
              <div className="relative h-96 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <OptimizedImage
                  src={property.image}
                  alt={property.title}
                  sizes={IMAGE_SIZES.propertyMain}
                  className="object-cover"
                />
              </div>
            )}

            {/* Gallery */}
            {property.gallery && property.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.gallery.map((image, index) => (
                  <div key={index} className="relative h-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <OptimizedImage
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      sizes={IMAGE_SIZES.propertyThumb}
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: property.content || property.excerpt }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interested in this property?</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005555] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005555] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005555] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Your message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005555] focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#005555] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#003333] transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

            {/* Agent Contact */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#005555]" />
                  <span className="text-gray-600">+234 904 375 2708</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#005555]" />
                  <span className="text-gray-600">official@houseunlimitednigeria.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}