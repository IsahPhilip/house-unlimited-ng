import Link from "next/link";
import { PropertyPreviewCard } from "@/components/property-preview-card";
import { PostPreviewCard } from "@/components/post-preview-card";
import { getFeaturedProperties, getRecentPosts, getSiteSettings, getTestimonials } from "@/lib/wordpress";
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
  const [settings, properties, posts, testimonialItems] = await Promise.all([
    getSiteSettings(),
    getFeaturedProperties(),
    getRecentPosts(),
    getTestimonials(6)
  ]);

  const services = [
    { title: 'Buy a Home', desc: 'Find the right home faster with verified listings and guided tours.' },
    { title: 'Buy Land', desc: 'Discover verified land parcels with clear documentation and strong value.' },
    { title: 'Investment Sales', desc: 'Identify high‑value house and land opportunities with strong upside.' },
  ];

  const fallbackTestimonials = [
    { name: 'Jenny Wilson', role: 'Customer', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', img: 'https://i.pravatar.cc/150?u=jenny' },
    { name: 'Esther Howard', role: 'Customer', text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa.', img: 'https://i.pravatar.cc/150?u=esther' },
  ];
  const testimonials = testimonialItems.length > 0
    ? testimonialItems.map((item) => ({
        name: item.name,
        text: item.text,
        role: item.role,
        img: item.image || `https://i.pravatar.cc/150?u=${item.slug}`
      }))
    : fallbackTestimonials;

  return (
    <div className="animate-in fade-in duration-500">
      <section className="relative h-[650px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={maitamaHero.src} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <p className="text-teal-600 font-semibold mb-4 tracking-wide uppercase tracking-[0.2em] text-xs font-bold">Find Your Dream Property Easily</p>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Luxury Homes & Investment<br />
              <span className="text-teal-600">Properties in Abuja</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-lg">Discover verified lands and homes in prime locations designed for smart investors and future homeowners.</p>

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

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Services</p>
            <h2 className="text-4xl font-bold text-gray-900">Who We <span className="text-gray-400 italic font-light">Serve</span></h2>
            <p className="text-gray-600 mt-3">Expert support for buying and selling properties.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const icons = [HomeIcon, Trees, DollarSign, Building2, Briefcase];
              const Icon = icons[index % icons.length];

              return (
                <div key={service.title} className="p-6 rounded-3xl transition-all bg-white border border-gray-100 hover:border-teal-500 hover:shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-12 gap-6 flex-wrap">
          <div>
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Featured Listings</p>
            <h2 className="text-4xl font-bold text-gray-900">Discover <span className="text-gray-400 italic font-light">Featured Properties</span></h2>
          </div>
          <Link href="/properties" className="bg-teal-600 text-white px-8 py-3 rounded-full flex items-center group font-bold text-sm shadow-lg shadow-teal-100">
            Visit All Properties <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyPreviewCard key={property.slug} property={property} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No featured properties available.</div>
          )}
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-gray-900">Built to <span className="text-gray-400 italic font-light">Outperform</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, title: 'Local Market Expertise', desc: 'Neighborhood-level insight that protects your investment.' },
                { icon: Search, title: 'Data-Driven Pricing', desc: 'Pricing strategies backed by real comps and demand data.' },
                { icon: Smartphone, title: 'Pro Photography & Marketing', desc: 'High-impact visuals and targeted campaigns that convert.' },
                { icon: Briefcase, title: 'Strong Negotiation', desc: 'We secure favorable terms without slowing the deal.' },
                { icon: Star, title: 'Concierge Service', desc: 'Personalized guidance from shortlist to closing.' },
              ].map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="relative bg-teal-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=800" alt="Happy family" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">A Partner, Not Just a Platform</h3>
                <p className="text-teal-100 mb-6">We combine market intelligence with hands-on support to help you move faster and smarter.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Verified listings only</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Expert agent support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                    <span className="text-sm">Secure transactions</span>
                  </div>
                </div>
                <Link
                  href="/properties"
                  className="mt-8 inline-flex bg-white text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                >
                  Start Your Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900">Simple Steps to <span className="text-gray-400 italic font-light">Your Home</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Book a consultation', text: 'Tell us your goals and preferred locations.' },
              { step: '02', title: 'Get a custom plan', text: 'We shortlist options tailored to your budget and needs.' },
              { step: '03', title: 'Tour or market homes', text: 'View verified listings or list with pro marketing.' },
              { step: '04', title: 'Close with confidence', text: 'Negotiation, paperwork, and secure closing handled.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-teal-600 text-sm font-bold mb-3">Step {item.step}</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Testimonials</p>
          <h2 className="text-4xl font-bold text-gray-900">What Our <span className="text-gray-400 italic font-light font-normal">Client Say About Us</span></h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <img src={testimonial.img} alt={testimonial.name} className="w-20 h-20 rounded-full border-4 border-teal-50 object-cover" />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="text-teal-200 text-6xl font-serif h-10 overflow-hidden leading-[1]">"</div>
                </div>
                <p className="text-gray-600 leading-relaxed italic text-sm">"{testimonial.text}"</p>
                <div className="mt-4 flex text-yellow-400 space-x-1">
                  {'★★★★★'.split('').map((s, index) => <span key={index} className="text-xs">{s}</span>)}
                  <span className="text-gray-900 font-bold ml-2 text-xs">5.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Editorial</p>
              <h2 className="text-4xl font-bold text-gray-900">From Our <span className="text-gray-400 italic font-light">Blog</span></h2>
              <p className="text-gray-600 mt-3 max-w-2xl">Stay informed with market updates, property advice, and investment insights from the WordPress backend.</p>
            </div>
            <Link className="bg-teal-600 text-white px-8 py-3 rounded-full flex items-center group font-bold text-sm shadow-lg shadow-teal-100" href="/blog">
              See all posts <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => <PostPreviewCard key={post.slug} post={post} />)
            ) : (
              <div className="col-span-full text-center text-gray-500">No blog posts available at the moment.</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-teal-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920" alt="Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Property?</h2>
                <p className="text-teal-100 mb-6 max-w-lg">
                  Start your real estate journey today. Whether you&apos;re buying or selling, we have the right solution for you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/properties"
                    className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Browse Properties for Sale
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Contact our team</p>
                      <p className="font-bold text-lg">{settings.phone}</p>
                    </div>
                  </div>
                  <Link href="/contact" className="block w-full bg-white text-teal-700 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all text-center">
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
