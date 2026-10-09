import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Radio,
  ArrowRight,
  ShieldCheck,
  Server,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';

interface LoginPageProps {
  onOpenPublicVoucher: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenPublicVoucher }) => {
  const { login, settings } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string = 'admin123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(demoEmail, demoPass);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Top Bar with Public Voucher Link */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.brandShortName || settings.ispName}
              className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-0.5 border border-slate-700 shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-lg">
              <Wifi className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                {settings.brandShortName || 'Anuwani'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                RT/RW NET OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {settings.tagline || 'Ruijie Reyee Cloud NOC · CodeIgniter v4.6 & MySQL'}
            </p>
          </div>
        </div>

        {/* Public Hotspot Voucher button (Bisa siapa saja tanpa login & via WhatsApp) */}
        <button
          onClick={onOpenPublicVoucher}
          className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 font-semibold transition-all shadow-md active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Beli Voucher Cukup via WhatsApp</span>
        </button>
      </header>

      {/* Center Container: Login Card & Demo Quick Access */}
      <div className="relative z-10 max-w-5xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Info / Pitch (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Sistem Login Multi-Role
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Manajemen Billing & Auto-Isolir Ruijie RT/RW Net
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Setiap user wajib login untuk mengakses menu dan fasilitas yang sesuai dengan hak akses rolenya (Super Admin, Administrator, atau Portal Pelanggan).
            </p>
          </div>

          <div className="space-y-2.5 pt-2 text-xs text-slate-300">
            <div className="flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Superadmin & Admin:</strong> NOC telemetry, aktivasi akun baru, kasir, monitoring teknisi & router Ruijie.</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <Server className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span><strong>Pelanggan:</strong> Cek tagihan bulanan, bayar instant via DANA QRIS (Auto-unisolir &lt; 2s), dan tiket komplain.</span>
            </div>
          </div>

          {/* Quick Demo Selector */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Klik Cepat Demo Login:</span>
              <span className="text-[10px] text-sky-400">Pilih Role</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('superadmin@rtrw.net')}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Super Admin</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <div className="text-[10px] text-slate-400">Pak Budi (Owner Net)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@rtrw.net')}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Administrator</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="text-[10px] text-slate-400">Rian Hidayat (NOC & Kasir)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ahmad@gmail.com', 'user123')}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Pelanggan Aktif</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[10px] text-slate-400">Ahmad Yani (30 Mbps)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('siti@gmail.com', 'user123')}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-left border border-slate-700/60 transition-colors"
              >
                <div className="font-bold text-rose-300 flex items-center justify-between">
                  <span>Pelanggan Isolir</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-400">Siti Rohmah (Uji Unisolir DANA)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Login Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">
              Masuk ke Akun Anda
            </h2>
            <p className="text-xs text-slate-400">
              Gunakan email & kata sandi yang telah terdaftar di sistem {settings.brandShortName || 'Anuwani'}.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="superadmin@rtrw.net atau email pelanggan"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">
                  Kata Sandi (Password)
                </label>
                <span className="text-[11px] text-slate-500">
                  Demo password: <code>admin123</code> / <code>user123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-950 border-slate-800 text-sky-600 focus:ring-0"
                />
                <span>Ingat sesi masuk di perangkat ini</span>
              </label>

              <span className="text-slate-500">
                Bantuan NOC: 0812-3456-7890
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Framework: <strong className="text-slate-200">CodeIgniter v4.6.x</strong></span>
            <span>Database: <strong className="text-slate-200">MySQL 8.0+</strong></span>
            <span>Gateway: <strong className="text-emerald-400">Ruijie Reyee & DANA</strong></span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 {settings.companyLegalName || settings.ispName || 'Anuwani RT/RW Net'}. Hak cipta dilindungi.
        </div>
        <div>
          Auto-isolir sync & verifikasi DANA Payment Gateway real-time.
        </div>
      </footer>

    </div>
  );
};
