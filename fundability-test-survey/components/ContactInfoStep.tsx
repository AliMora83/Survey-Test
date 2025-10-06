import React from 'react';
import type { ContactInfo, ContactInfoErrors } from '../types';

interface ContactInfoStepProps {
  contactInfo: ContactInfo;
  onChange: (contactInfo: ContactInfo) => void;
  onBlur: () => void;
  errors: ContactInfoErrors;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ contactInfo, onChange, onBlur, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...contactInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Let's start with your contact information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={contactInfo.fullName}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder="John Doe"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder="(123) 456-7890"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={contactInfo.email}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder="john.doe@example.com"
             className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-colors ${
              errors.email
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;