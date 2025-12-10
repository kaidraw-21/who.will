import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-brutal-teal border-3 border-brutal-dark shadow-hard flex items-center justify-center">
              <span className="text-brutal-dark font-black text-4xl">W</span>
            </div>
            <h1 className="text-4xl font-black text-brutal-dark uppercase tracking-tighter italic">Who.Will?</h1>
          </div>
          <p className="text-brutal-dark font-bold">Enter your credentials to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border-3 border-brutal-dark shadow-hard-xl p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-brutal-coral border-l-3 border-b-3 border-brutal-dark -mr-10 -mt-10 rotate-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-brutal-yellow border-r-3 border-t-3 border-brutal-dark -ml-8 -mb-8 -rotate-12"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div>
              <label className="block text-brutal-dark font-bold text-sm uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brutal-dark" size={20} strokeWidth={2.5} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-3 border-brutal-dark bg-white text-brutal-dark font-bold placeholder-gray-400 focus:outline-none focus:shadow-hard-sm transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-brutal-dark font-bold text-sm uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brutal-dark" size={20} strokeWidth={2.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-3 border-brutal-dark bg-white text-brutal-dark font-bold placeholder-gray-400 focus:outline-none focus:shadow-hard-sm transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brutal-teal border-3 border-brutal-dark text-brutal-dark font-black text-lg uppercase tracking-wider shadow-hard hover:-translate-y-1 hover:-translate-x-1 hover:shadow-hard-lg active:translate-y-0 active:translate-x-0 active:shadow-hard transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
