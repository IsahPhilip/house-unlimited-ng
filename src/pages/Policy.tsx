import React from 'react';

const PolicyPage = ({ title, content }: { title: string, content: string[] }) => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">{title}</h1>
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {content.map((p, i) => (
          <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  </div>
);

export default PolicyPage;