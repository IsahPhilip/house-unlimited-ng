import React, { useState } from 'react';
import { Page } from '../types';

interface ResetPasswordPageProps {
  email: string | null;
  token: string | null;
  onSubmit: (newPassword: string, token: string) => void;
  onNavigate: (page: Page) => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ email, token, onSubmit, onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!token) {
      setMessage('Invalid reset token. Please request a new password reset link.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await onSubmit(newPassword, token);
      setMessage('Password reset successfully! Redirecting to sign in...');
      setTimeout(() => {
        onNavigate('home');
      }, 2000);
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <i className="fas fa-lock text-6xl text-teal-500 mb-4"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Reset Your Password</h2>
        {email && (
          <p className="text-gray-600 mb-6">
            Enter a new password for <strong>{email}</strong>.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only" htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-teal-600 outline-none"
              disabled={isLoading}
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-200"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
