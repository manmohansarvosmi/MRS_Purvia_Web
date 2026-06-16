import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ChevronRight, Fingerprint, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../../assets/mrs_logo.png';
import api from '@/src/lib/api';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const data = response.data;
      const token = data.data?.token || data.token;

      if (token) {
        localStorage.setItem('userToken', token);
        toast.success('AUTHENTICATION SUCCESSFUL');
        onLogin(token);
      } else {
        toast.error('AUTH ERROR: Token not found');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials.';
      toast.error('ACCESS DENIED', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: '#EAECF0' }}>
      
      {/* ── Background Branding ── */}
      <div className="absolute top-0 right-0 p-8">
        <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Purvia ERP • v4.0.0
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo Container */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white border border-slate-200 mb-6 flex items-center justify-center shadow-sm" style={{ borderRadius: 4 }}>
            <img src={logo} alt="MRS Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900" style={{ letterSpacing: '-0.02em' }}>
            MRS <span style={{ color: '#C8102E' }}>PURVIA</span>
          </h1>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
            Enterprise Systems Access
          </p>
        </div>

        {/* Login Panel */}
        <div className="bg-white border border-slate-200 shadow-2xl p-8" style={{ borderRadius: 4 }}>
          <div className="mb-8">
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1E2330', textTransform: 'uppercase' }}>Personnel Sign In</h2>
            <div className="h-0.5 w-8 bg-primary mt-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="erp-label">Control Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@mrs"
                  className="erp-input !pl-9"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="erp-label">Access Password</label>
                <button type="button" style={{ fontSize: 9, fontWeight: 700, color: '#C8102E', textTransform: 'uppercase' }} className="hover:underline">Recovery</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="erp-input !pl-9"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-11 flex justify-center items-center gap-2"
              style={{ fontSize: 11, letterSpacing: '0.05em' }}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>SIGN IN TO GATEWAY <ChevronRight size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Secure Access</span>
            </div>
            <Fingerprint size={16} className="text-slate-200" />
          </div>
        </div>

        <div className="mt-10 text-center">
            <p style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
                CORPORATE ERP INFRASTRUCTURE
            </p>
            <p style={{ fontSize: 9, color: '#CBD5E1', marginTop: 4 }}>
                Unauthorized attempts will be logged and reported.
            </p>
        </div>
      </motion.div>
    </div>
  );
};
