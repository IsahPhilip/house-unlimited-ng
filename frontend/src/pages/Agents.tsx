import React from 'react';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

const AgentsPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Meet our experts</p>
        <h1 className="text-4xl font-bold text-gray-900">Our Professional <span className="text-gray-400 font-light italic">Agents</span></h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: 'Julia Abege', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
          { name: 'ARC Terzungwe Abege', role: 'Chairman & Lead Architect', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
          { name: 'House Unlimited Nigeria Team', role: 'Client Advisory', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400' },
          { name: 'House Unlimited Nigeria Team', role: 'Investment & Strategy', image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=400' },
        ].map((member, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group">
            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-teal-50" />
            <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
            <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mt-1 mb-6">{member.role}</p>
            <div className="flex justify-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AgentsPage;
