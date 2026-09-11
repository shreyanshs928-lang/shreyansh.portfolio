import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { login, currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // If user is already authenticated, redirect straight to admin dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(email.trim(), password.trim());
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Check your email and passcode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background radial soft light gradient */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="w-full max-w-md bg-[#18181b]/50 border border-[#27272a] backdrop-blur-xl p-8 rounded-lg shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#4f46e5]/10 border border-[#4f46e5]/30 flex items-center justify-center text-[#6366f1] mb-3">
            <Shield size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-wide font-display text-white">Portfolio Admin</h2>
          <p className="text-sm text-[#a1a1aa] mt-1">Authenticate to access the CMS editor</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800/40 text-red-400 text-sm rounded flex items-center gap-2">
            <Lock size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" size={18} />
              <input
                type="email"
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-10 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-10 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium text-sm py-3 rounded tracking-wide transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#27272a]/60 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
