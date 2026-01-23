import React from 'react';

const ContactPage = () => (
  <div className="py-24 bg-gray-50 min-h-screen animate-in fade-in duration-500">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-blue-600 font-semibold mb-2 uppercase tracking-widest text-xs font-bold">Get In Touch</p>
        <h1 className="text-4xl font-bold text-gray-900">Contact <span className="text-gray-400 font-light italic">Us</span></h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Have questions about a property or want to list your own? Our team is here to help you every step of the way.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📞</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                <p className="font-bold text-gray-900">+1 (408) 555-0120</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">✉️</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="font-bold text-gray-900">example@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📍</div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Office Location</p>
                <p className="font-bold text-gray-900 text-sm">2464 Royal Ln. Mesa, New Jersey 45463</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h4 className="font-bold mb-4">Working Hours</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Monday - Friday</span>
                <span className="font-bold">09 AM - 06 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Saturday</span>
                <span className="font-bold">10 AM - 04 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span className="font-bold text-blue-400">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="Your name" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="example@email.com" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message</label>
                <textarea rows={6} placeholder="Write your message here..." className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-xs">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;