import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Server,
  Wrench,
  LifeBuoy,
  CreditCard,
  MessageSquare,
  Radio,
  FileCode2,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Wifi
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: number | string | null;
  badgeColor?: string;
  roles: ('superadmin' | 'administrator' | 'pelanggan')[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { currentUser, logout, pelangganList, tiketList, tagihanList, settings } = useApp();

  const pendingPelanggan = pelangganList.filter(p => p.status === 'pending').length;
  const isolatedPelanggan = pelangganList.filter(p => p.status === 'isolated').length;
  const openTiket = tiketList.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const unpaidBills = tagihanList.filter(t => t.status === 'unpaid' || t.status === 'isolated').length;

  // Role-Based Navigation Items Definition
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: currentUser.role === 'pelanggan' ? 'Status Internet Saya' : 'Ringkasan & NOC',
      shortLabel: 'NOC',
      icon: LayoutDashboard,
      color: 'text-sky-400',
      roles: ['superadmin', 'administrator', 'pelanggan'],
    },
    {
      id: 'pelanggan',
      label: 'Pelanggan & Aktivasi',
      shortLabel: 'Warga',
      icon: Users,
      color: 'text-emerald-400',
      badge: pendingPelanggan > 0 ? `+${pendingPelanggan}` : null,
      badgeColor: 'bg-amber-950 text-amber-300 border border-amber-800',
      roles: ['superadmin', 'administrator'],
    },
    {
      id: 'billing',
      label: currentUser.role === 'pelanggan' ? 'Tagihan & Bayar DANA' : 'Tagihan & Transaksi',
      shortLabel: 'Billing',
      icon: Receipt,
      color: 'text-amber-400',
      badge: currentUser.role !== 'pelanggan' && unpaidBills > 0 ? `${unpaidBills}` : null,
      badgeColor: 'bg-slate-800 text-slate-300',
      roles: ['superadmin', 'administrator', 'pelanggan'],
    },
    {
      id: 'ruijie',
      label: 'Router Ruijie & Isolir',
      shortLabel: 'Ruijie',
      icon: Server,
      color: 'text-cyan-400',
      badge: isolatedPelanggan > 0 ? `${isolatedPelanggan} iso` : null,
      badgeColor: 'bg-rose-950 text-rose-300 border border-rose-800',
      roles: ['superadmin', 'administrator'],
    },
    {
      id: 'teknisi',
      label: 'Monitoring Teknisi',
      shortLabel: 'Teknisi',
      icon: Wrench,
      color: 'text-indigo-400',
      roles: ['superadmin', 'administrator'],
    },
    {
      id: 'tiket',
      label: currentUser.role === 'pelanggan' ? 'Lapor Gangguan (Tiket)' : 'Tiket Keluhan',
      shortLabel: 'Tiket',
      icon: LifeBuoy,
      color: 'text-rose-400',
      badge: openTiket > 0 ? `${openTiket}` : null,
      badgeColor: 'bg-sky-950 text-sky-300 border border-sky-800',
      roles: ['superadmin', 'administrator', 'pelanggan'],
    },
    {
      id: 'whatsapp',
      label: 'Konfigurasi WhatsApp Gateway',
      shortLabel: 'WA Gateway',
      icon: MessageSquare,
      color: 'text-emerald-400',
      roles: ['superadmin', 'administrator'],
    },
    {
      id: 'voucher',
      label: currentUser.role === 'pelanggan' ? 'Beli Voucher Tamu' : 'Kios Voucher Hotspot',
      shortLabel: 'Voucher',
      icon: Radio,
      color: 'text-amber-400',
      roles: ['superadmin', 'administrator', 'pelanggan'],
    },
    {
      id: 'ci4',
      label: 'Source CI4 & MySQL',
      shortLabel: 'CI4 Code',
      icon: FileCode2,
      color: 'text-emerald-400',
      badge: 'v4.6',
      badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
      roles: ['superadmin', 'administrator'],
    },
    {
      id: 'settings',
      label: 'Pengaturan Sistem',
      shortLabel: 'Setting',
      icon: Settings,
      color: 'text-slate-400',
      roles: ['superadmin'], // Only Superadmin can access system settings
    },
  ];

  // Filter items based strictly on current user role
  const allowedNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        ></div>
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          /* Mobile Drawer states */
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop Width: Collapsed (w-20) vs Expanded (w-64) */
          isCollapsed ? 'lg:w-20 w-72' : 'lg:w-64 w-72'
        }`}
      >
        {/* Top Header Section inside Sidebar (Mobile only brand & Desktop toggle) */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          
          {/* Brand info on mobile or when expanded */}
          <div className={`flex items-center space-x-2.5 ${isCollapsed ? 'lg:hidden' : 'flex'}`}>
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandShortName || settings.ispName}
                className="w-8 h-8 rounded-lg object-contain bg-slate-800 p-0.5 border border-slate-700 shadow"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow">
                <Wifi className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold text-white tracking-tight truncate max-w-[130px]">
                {settings.brandShortName || 'Anuwani'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">Role: {currentUser.role}</div>
            </div>
          </div>

          {/* Desktop Auto-Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden lg:block">
              {currentUser.role === 'pelanggan' ? 'Portal Pelanggan' : 'Navigasi ' + currentUser.role}
            </div>
          )}

          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center rounded-xl transition-all text-xs font-medium group relative ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${
                  isCollapsed ? 'lg:justify-center lg:px-2 py-3 px-3.5' : 'justify-between px-3.5 py-2.5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.color}`} />
                  <span className={`truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </div>

                {/* Badge if exists and not collapsed */}
                {item.badge && !isCollapsed && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Hover Tooltip when Collapsed on Desktop */}
                {isCollapsed && (
                  <div className="hidden lg:group-hover:flex absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap z-50 border border-slate-800 items-center space-x-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] text-amber-300">({item.badge})</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile & Logout Section */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          
          {/* User Info */}
          <div className={`flex items-center space-x-2.5 ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-700"
              />
              <div className={`truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>
                <div className="text-xs font-bold text-white truncate max-w-[130px]">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className={`p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ${
                isCollapsed ? 'lg:mt-2 lg:w-full flex justify-center' : ''
              }`}
              title="Keluar dari Akun (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick SLA info if expanded */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 hidden lg:flex justify-between items-center">
              <span>Ruijie Engine</span>
              <span className="text-emerald-400 font-semibold">Ready &lt; 2s</span>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
