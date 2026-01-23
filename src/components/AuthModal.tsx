import React, { useState } from 'react';
import { Modal } from './Modal';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  setMode: (m: 'signin' | 'signup') => void;
  onSuccess: (u: User) => void;
  onForgotPasswordClick: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  setMode, 
  onSuccess,
  onForgotPasswordClick
}) => {
  const [currentAuthFlow, setCurrentAuthFlow] = useState<'signin' | 'signup' | 'forgot-password'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Update currentAuthFlow when mode prop changes
  React.useEffect(() => {
    setCurrentAuthFlow(mode);
  }, [mode]);



  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAuthFlow === 'signin') {
      onSuccess({ name: name || 'Demo User', email });
      onClose();
    } else if (currentAuthFlow === 'signup') {
      onSuccess({ name: name || 'Demo User', email });
      onClose();
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onForgotPasswordClick(email); // Notify parent component (App.tsx) with the email
    // Optionally, show a success message or transition to a "check your email" state
    onClose(); // Close the modal after sending the request
  };

  const getTitle = () => {
    switch (currentAuthFlow) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'forgot-password': return 'Forgot Password';
      default: return 'Auth';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {currentAuthFlow === 'signin' || currentAuthFlow === 'signup' ? (
        <form onSubmit={handleModalSubmit} className="space-y-4">
          {currentAuthFlow === 'signup' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input 
                required 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com" 
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
            />
            {currentAuthFlow === 'signin' && (
              <div className="text-right text-sm">
                <button 
                  type="button" 
                  onClick={() => setCurrentAuthFlow('forgot-password')} 
                  className="text-blue-600 font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 mt-4"
          >
            {currentAuthFlow === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-6">
            {currentAuthFlow === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setMode(currentAuthFlow === 'signin' ? 'signup' : 'signin');
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              {currentAuthFlow === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">Enter your email address to receive a password reset link.</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com" 
              className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 mt-4"
          >
            Send Reset Link
          </button>
          <p className="text-center text-sm text-gray-500 mt-6">
            <button 
              type="button"
              onClick={() => setCurrentAuthFlow('signin')}
              className="text-blue-600 font-bold hover:underline"
            >
              Back to Sign In
            </button>
          </p>
        </form>
      )}
    </Modal>
  );
};
