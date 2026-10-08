import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Wifi,
  Radio,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  Code2,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const { currentUser, logout, pelangganList } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const isolatedCount = pelangganList.filter(p => p.status === 'isolated').length;
  const pendingCount = pelangganList.filter(p => p.status === 'pending').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Auto-Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar (Auto Collapse)'}
              aria-label="Toggle Sidebar Auto Collapse"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center space-x-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-md">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">anuwani</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    RT/RW Net
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Ruijie Reyee Cloud NOC · CodeIgniter v4.6 & MySQL
                </p>
              </div>
            </button>
          </div>

          {/* Quick System Telemetry Status (NOC Vibe) */}
          <div className="hidden xl:flex items-center space-x-5 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Ruijie Cloud:</span>
              <span className="text-emerald-400 font-medium">Online (1.8ms)</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span className="text-slate-400">DANA Gateway:</span>
              <span className="text-sky-300 font-medium">Ready QRIS</span>
            </div>

            {currentUser.role !== 'pelanggan' && isolatedCount > 0 && (
              <button 
                onClick={() => setActiveTab('ruijie')}
                className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition-colors"
                title={`${isolatedCount} Pelanggan Terisolir`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isolatedCount} Terisolir</span>
              </button>
            )}

            {currentUser.role !== 'pelanggan' && pendingCount > 0 && (
              <button 
                onClick={() => setActiveTab('pelanggan')}
                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 transition-colors"
                title={`${pendingCount} Menunggu Aktivasi`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{pendingCount} Verifikasi Baru</span>
              </button>
            )}
          </div>

          {/* Right Header Navigation & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Public Voucher Button (Anyone can buy) */}
            <button
              onClick={() => setActiveTab('voucher')}
              className={`flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-colors ${
                activeTab === 'voucher'
                  ? 'bg-sky-700 border-sky-600 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Kios Voucher Hotspot Warga / Publik (QRIS DANA)"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Kios Voucher</span>
            </button>

            {/* CodeIgniter 4 & MySQL Codebase Hub Button (Admin & Superadmin only) */}
            {currentUser.role !== 'pelanggan' && (
              <button
                onClick={() => setActiveTab('ci4')}
                className={`hidden md:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-colors ${
                  activeTab === 'ci4'
                    ? 'bg-emerald-900 border-emerald-600 text-emerald-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Lihat Source Code CodeIgniter 4.6 & Skema MySQL"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Source CI4 & MySQL</span>
              </button>
            )}

            {/* User Role Switcher Dropdown & Profile */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl text-xs transition-colors focus:outline-none"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <div className="font-semibold text-slate-100 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Profile Popover & Mandatory Logout */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3.5 backdrop-blur-md">
                  {/* User Profile Header */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          currentUser.role === 'superadmin'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : currentUser.role === 'administrator'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          Role: {currentUser.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Info */}
                  <div className="space-y-1.5 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nomor Kontak:</span>
                      <span className="font-mono font-medium text-slate-200">{currentUser.phone}</span>
                    </div>
                    {currentUser.pelangganId && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">ID Pelanggan:</span>
                        <span className="font-mono font-bold text-sky-400">{currentUser.pelangganId}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Sesi Login:</span>
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Aktif & Terotentikasi</span>
                      </span>
                    </div>
                  </div>

                  {/* Security Notice: Must Logout to Change Role */}
                  <div className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-[11px] text-slate-300 leading-relaxed">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Keamanan Akses Role</span>
                    </div>
                    Pengguna tidak dapat langsung mengganti role dalam sesi ini. Untuk berganti peran atau masuk dengan akun lain, silakan lakukan <strong>logout terlebih dahulu</strong>.
                  </div>

                  {/* Logout Action Button */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        logout();
                      }}
                      className="w-full px-3 py-2.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-600/40 hover:border-rose-600 text-rose-300 hover:text-white rounded-xl text-center flex items-center justify-center space-x-2 transition-all font-semibold active:scale-95 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Akun Sekarang</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
