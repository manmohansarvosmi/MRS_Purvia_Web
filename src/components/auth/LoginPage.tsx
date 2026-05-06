import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ChevronRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      // API Integration using axios instance
      const response = await api.post('/auth/login', { username, password });
      const data = response.data;

      // Handle both standard and BaseResponse structures
      const token = data.data?.token || data.token;

      if (token) {
        localStorage.setItem('userToken', token);
        toast.success('LOGIN SUCCESSFUL', {
          description: 'Welcome back to Purvia ERP.',
        });
        onLogin(token);
      } else {
        toast.error('AUTH ERROR', {
          description: 'Token not found in server response.',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid username or password.';
      toast.error('LOGIN FAILED', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Refinements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-500/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-2xl shadow-slate-200 mb-6 border border-slate-50 overflow-hidden"
          >
            <img src={logo} alt="MRS Logo" className="w-full h-full object-contain p-2" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
            MRS <span className="text-primary">PURVIA</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Enterprise Management System
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personnel Login</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-primary font-medium transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <button type="button" className="text-[10px] font-bold text-primary uppercase hover:underline">Forgot?</button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-primary font-medium transition-all"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Login to ERP <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Biometric Ready</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">Secured Access</span>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};
