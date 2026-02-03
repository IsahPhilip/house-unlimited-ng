import React from 'react';
import { Mail } from 'lucide-react';
import { Page } from '../types';

interface ResetPasswordEmailSentPageProps {
  email: string;
  onNavigate: (page: Page) => void;
}

const ResetPasswordEmailSentPage: React.FC<ResetPasswordEmailSentPageProps> = ({ email, onNavigate }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Mail className="w-16 h-16 text-teal-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) to reset your password.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-200"
          >
            Back to Home
          </button>
          <p className="text-sm text-gray-500">
            Didn't receive the email?{' '}
            <button
              onClick={() => {
                // In a real app, this would resend the email
                alert('Reset link resent! Check your email.');
              }}
              className="text-teal-600 font-bold hover:underline"
            >
              Click here to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordEmailSentPage;
