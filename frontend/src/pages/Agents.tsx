import React from 'react';

const AgentsPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Meet our experts</p>
        <h1 className="text-4xl font-bold text-gray-900">Our Professional <span className="text-gray-400 font-light italic">Agents</span></h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: 'Sarah Montgomery', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
          { name: 'David Chen', role: 'Head of Real Estate', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
          { name: 'Elena Rodriguez', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
          { name: 'Michael Smith', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
        ].map((member, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all group">
            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-50" />
            <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mt-1 mb-6">{member.role}</p>
            <div className="flex justify-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-facebook-f text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-twitter text-xs"></i></div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><i className="fab fa-linkedin-in text-xs"></i></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AgentsPage;