import React from 'react';
import { ArrowRight, Cpu, Eye, Gem, Linkedin, Twitter, Users } from 'lucide-react';

const AboutPage = () => (
  <div className="animate-in fade-in duration-500">
    {/* Hero / Story Section */}
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
           <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Story</p>
           <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">We help you find your <span className="text-teal-600">Perfect Home</span> since 1995.</h1>
           <p className="text-gray-600 mb-8 leading-relaxed text-sm">Founded in Los Angeles, Real Estate. has grown from a small family firm into a global leader in property management and brokerage. We believe everyone deserves a place they can truly call home, and we leverage the latest technology—including Gemini AI—to make that process as smooth as possible.</p>
           <div className="grid grid-cols-3 gap-8 mb-10">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-teal-600 mb-1">25+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Years Exp</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-teal-600 mb-1">10k+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Sales</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-3xl font-bold text-teal-600 mb-1">500+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Agents</p>
              </div>
           </div>
           <button className="bg-teal-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-teal-200 hover:shadow-teal-300 transition-all text-sm uppercase tracking-widest">Download Brochure</button>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]" alt="Modern Office" />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-teal-100 rounded-full -z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-600/10 rounded-3xl -z-0"></div>
          <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-xl z-20">
             <p className="text-teal-600 font-bold text-2xl">99%</p>
             <p className="text-gray-400 text-[10px] font-bold uppercase">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>

    {/* Purpose & Principles Section */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Philosophy</p>
          <h2 className="text-4xl font-bold text-gray-900">Purpose & <span className="text-gray-400 font-light italic">Principles</span></h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We are guided by a simple mission: to simplify the complex world of real estate through technology and human-centric design.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Radical Transparency', desc: 'We provide honest data and clear pricing, ensuring you have all the facts before making a decision.', icon: Eye },
            { title: 'AI-Driven Innovation', desc: 'We leverage Gemini AI to visualize possibilities and find matches that traditional search engines miss.', icon: Cpu },
            { title: 'People First', desc: 'Beyond the tech, our primary focus is the human experience of finding a place to call home.', icon: Users },
            { title: 'Uncompromising Integrity', desc: 'We hold ourselves and our agents to the highest ethical standards in every transaction.', icon: Gem },
          ].map((p, idx) => {
            const Icon = p.icon;
            return (
            <div key={idx} className="p-10 rounded-3xl bg-gray-50 border border-transparent hover:border-teal-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-teal-600">
                <Icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{p.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          )})}
        </div>
      </div>
    </section>

    {/* Meet the Team Section */}
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <p className="text-teal-400 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">The Brains Behind the Brand</p>
            <h2 className="text-4xl font-bold">Meet our <span className="text-teal-400 italic">Visionary</span> Team</h2>
          </div>
          <button className="text-teal-400 font-bold hover:underline flex items-center">
            Join our growing team <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Sarah Montgomery', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
            { name: 'David Chen', role: 'Head of Real Estate', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
            { name: 'Elena Rodriguez', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
            { name: 'Michael Smith', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
          ].map((member, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] mb-6">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-xs">
                    <Twitter className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold group-hover:text-teal-400 transition-colors">{member.name}</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-600/5 -skew-x-12 translate-x-1/2"></div>
    </section>
  </div>
);

export default AboutPage;
