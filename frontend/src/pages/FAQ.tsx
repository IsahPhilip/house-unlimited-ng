import React from 'react';
import { FAQS } from '../utils/mockData';

const FAQPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Our Testimonials</p>
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked <span className="text-gray-400 italic font-light">Questions</span></h1>
      </div>
      <div className="space-y-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">{faq.question}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FAQPage;