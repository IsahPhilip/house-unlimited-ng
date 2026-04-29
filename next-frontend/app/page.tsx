import Link from "next/link";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import { PostPreviewCard } from "@/components/post-preview-card";
import { GraphQLHealthCheck } from "@/components/graphql-health-check";
import { getFeaturedProperties, getRecentPosts, getSiteSettings } from "@/lib/wordpress";
import maitamaHero from "../../frontend/src/img/maitama-ii.jpeg";
import {
  ArrowRight,
  Briefcase,
  Building2,
  DollarSign,
  Home as HomeIcon,
  MapPin,
  Phone,
  Search,
  Smartphone,
  Star,
  Trees
} from "lucide-react";

export default async function HomePage() {
  const [settings, properties, posts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProperties(),
    getRecentPosts()
  ]);

  const services = [
    { title: 'Buy a Home', desc: 'Find the right home faster with verified listings and guided tours.' },
    { title: 'Buy Land', desc: 'Discover verified land parcels with clear documentation and strong value.' },
    { title: 'Sell a Home', desc: 'Price it right, market it well, and close with confidence.' },
    { title: 'Luxury Properties', desc: 'Discreet, curated access to premium homes and estates.' },
    { title: 'Investment Sales', desc: 'Identify high‑value house and land opportunities with strong upside.' },
  ];

  const testimonials = [
    { name: 'Jenny Wilson', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', img: 'https://i.pravatar.cc/150?u=jenny' },
    { name: 'Esther Howard', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', img: 'https://i.pravatar.cc/150?u=esther' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center bg-gray-50">
        <div className="absolute inset-0 z-0">
          <img src={maitamaHero.src} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-teal-600 font-semibold mb-4 tracking-wide uppercase tracking-[0.2em] text-xs font-bold">Find Your Dream Property Easily</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Instant Property Deals: <br />
              <span className="text-teal-600">Buy and Sell</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-lg">Experience the next generation of real estate discovery. We use cutting-edge AI to match you with your perfect home.</p>

            <div className="bg-white p-2 rounded-2xl shadow-2xl inline-flex flex-col w-full md:w-auto transition-all">
              <div className="flex p-1">
                <button className="px-8 py-2.5 rounded-xl font-bold transition-all bg-teal-600 text-white">Buy & Sell</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 items-center">
                <div className="relative">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Location</p>
                  <input
                    type="text"
                    placeholder="e.g. Maitama 2, Abuja"
                    className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Type</p>
                  <select className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer">
                    <option>House</option>
                    <option>Land</option>
                  </select>
                </div>
                <div className="border-l border-gray-100 pl-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Price Range</p>
                  <select className="text-gray-900 font-bold text-sm bg-transparent border-none p-0 focus:ring-0 outline-none w-full cursor-pointer">
                    <option>N50,000,000 - 100,000,000</option>
                    <option>N150,000,000 - 300,000,000</option>
                    <option>N300,000,000+</option>
                  </select>
                </div>
                <Link href="/properties" className="bg-teal-600 text-white h-14 w-14 md:w-full rounded-xl flex items-center justify-center font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">
                  <Search className="md:hidden w-5 h-5" />
                  <span className="hidden md:block">Search</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <GraphQLHealthCheck />
        </div>
      </section>

      {/* Verified Listings Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <div className="lg:col-span-2">
              <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Trust & Transparency</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Verified Listings, Clearer Decisions
              </h2>
              <p className="text-gray-600 mb-6">
                We verify identity, ownership, and on-site details before a listing goes live. That means less noise,
                faster shortlists, and more confident decisions.
              </p>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Verification Coverage</span>
                  <span className="font-bold text-teal-600">98%+</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Listings are verified within 48 hours in most cases.</p>
              </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: HomeIcon, label: 'Verified Owners', detail: 'ID, title & ownership checks' },
                { icon: Building2, label: 'On‑Site Inspection', detail: 'Condition & amenities validated' },
                { icon: DollarSign, label: 'Price Validation', detail: 'Benchmarking vs. market comps' },
                { icon: Smartphone, label: 'Secure Inquiry', detail: 'Protected messaging and logs' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-gray-900 font-bold text-sm mb-1">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.detail}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Services</p>
            <h2 className="text-4xl font-bold text-gray-900">What We <span className="text-gray-400 font-light italic">Offer</span></h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Comprehensive real estate solutions tailored to your needs, from buying and selling to investment opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <div className="kicker">Featured listings</div>
              <h2 className="page-title" style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}>
                Properties from WordPress
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl">Premium properties verified and ready for you. Each listing includes detailed information and high-quality images.</p>
              {properties[0] ? (
                <p className="text-sm text-gray-500 mt-4">
                  Preview route: <Link href={`/properties/${properties[0].slug}`} className="text-teal-600 hover:text-teal-700">/properties/{properties[0].slug}</Link>
                </p>
              ) : null}
            </div>
            <Link className="button button-secondary" href="/properties">
              See all properties
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyPreviewCard key={property.slug} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No properties available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Testimonials</p>
            <h2 className="text-4xl font-bold text-gray-900">What Our <span className="text-gray-400 font-light italic">Clients Say</span></h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Real experiences from satisfied customers who found their perfect property with us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex text-teal-600">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <div className="kicker">Editorial</div>
              <h2 className="page-title" style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}>
                Blog posts rendered for SEO
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl">Stay informed with the latest real estate insights, market trends, and investment opportunities.</p>
              {posts[0] ? (
                <p className="text-sm text-gray-500 mt-4">
                  Preview route: <Link href={`/blog/${posts[0].slug}`} className="text-teal-600 hover:text-teal-700">/blog/{posts[0].slug}</Link>
                </p>
              ) : null}
            </div>
            <Link className="button button-secondary" href="/blog">
              See all posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => <PostPreviewCard key={post.slug} post={post} />)
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
