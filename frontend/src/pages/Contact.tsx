import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    if (!formData.email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
          type: 'general'
        });
      } else {
        setSubmitError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800">Message Sent Successfully!</h4>
                      <p className="text-green-600 text-sm mt-1">Thank you for contacting us. We'll get back to you soon!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                  )}
                  
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Subject *</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What can we help you with?"
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Message *</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6} 
                        placeholder="Please provide details about your inquiry..."
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Inquiry Type</label>
                      <select 
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                        disabled={isSubmitting}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="property_inquiry">Property Inquiry</option>
                        <option value="partnership">Partnership</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-xs ${
                          isSubmitting ? 'opacity-50 cursor-wait' : 'hover:shadow-blue-300'
                        }`}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                      <p className="text-xs text-gray-500 mt-3">We typically respond within 24 hours. For urgent matters, please call us directly.</p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
