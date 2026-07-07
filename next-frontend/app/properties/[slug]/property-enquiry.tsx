"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export function PropertyEnquiry({ propertyTitle }: { propertyTitle: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in "${propertyTitle}". Please send me more details.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("subject", `Property Enquiry: ${propertyTitle}`);
      payload.append("message", formData.message);
      payload.append("type", "property_inquiry");
      if (formData.phone.trim()) payload.append("phone", formData.phone);

      const response = await fetch(`/api/contact/submit`, {
        method: "POST",
        body: payload
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        const data = await response.json().catch(() => null);
        setSubmitError(data?.message || "Failed to send enquiry. Please try again.");
      }
    } catch {
      setSubmitError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-green-800">Enquiry Sent!</h4>
            <p className="text-green-600 text-sm mt-1">We'll get back to you within 24 hours.</p>
          </div>
        </div>
        <button onClick={() => setSubmitSuccess(false)} className="mt-4 text-green-600 hover:text-green-800 font-bold text-sm">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{submitError}</p>
        </div>
      )}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full bg-gray-50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#005555] outline-none border-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full bg-gray-50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#005555] outline-none border-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone (Optional)</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+234 000 000 0000"
          className="w-full bg-gray-50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#005555] outline-none border-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full bg-gray-50 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#005555] outline-none border-none resize-none"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#005555] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#005555]/20 hover:bg-[#004444] ${isSubmitting ? "opacity-50 cursor-wait" : ""}`}
      >
        {isSubmitting ? "Sending..." : "Send Enquiry"}
      </button>
      <p className="text-xs text-gray-400 text-center">We typically respond within 24 hours.</p>
    </form>
  );
}
