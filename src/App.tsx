import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardSuperAdmin } from './components/DashboardSuperAdmin';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardPelanggan } from './components/DashboardPelanggan';
import { PelangganManagement } from './components/PelangganManagement';
import { BillingManagement } from './components/BillingManagement';
import { RuijieManagement } from './components/RuijieManagement';
import { TeknisiManagement } from './components/TeknisiManagement';
import { TiketManagement } from './components/TiketManagement';
import { VoucherKiosk } from './components/VoucherKiosk';
import { WhatsappGateway } from './components/WhatsappGateway';
import { Ci4ExportView } from './components/Ci4ExportView';
import { SettingsView } from './components/SettingsView';
import { DanaPaymentModal } from './components/DanaPaymentModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { Radio, ArrowLeft, Wifi } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Sidebar auto-collapse and mobile friendly drawer states
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // State for public guest viewing voucher kiosk without login
  const [isViewingPublicVoucher, setIsViewingPublicVoucher] = useState<boolean>(false);

  // Security & Role protection: Ensure Pelanggan cannot open admin NOC tabs
  useEffect(() => {
    if (currentUser.role === 'pelanggan') {
      const allowedForPelanggan = ['dashboard', 'billing', 'tiket', 'voucher'];
      if (!allowedForPelanggan.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (currentUser.role === 'administrator') {
      if (activeTab === 'settings') {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser.role, activeTab]);

  // If user is not authenticated and wants to buy voucher hotspot as public guest
  if (!isAuthenticated && isViewingPublicVoucher) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <header className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between max-w-7xl w-full mx-auto">
          <button
            onClick={() => setIsViewingPublicVoucher(false)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Login</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Kios Hotspot Tamu Publik</span>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <VoucherKiosk />
        </main>
      </div>
    );
  }

  // IF USER IS NOT LOGGED IN -> MANDATORY LOGIN SCREEN!
  if (!isAuthenticated) {
    return (
      <LoginPage onOpenPublicVoucher={() => setIsViewingPublicVoucher(true)} />
    );
  }

  // Render content based strictly on active tab & role
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'superadmin') {
          return <DashboardSuperAdmin setActiveTab={setActiveTab} />;
        } else if (currentUser.role === 'administrator') {
          return <DashboardAdmin setActiveTab={setActiveTab} />;
        } else {
          return <DashboardPelanggan setActiveTab={setActiveTab} />;
        }

      case 'pelanggan':
        return currentUser.role !== 'pelanggan' ? (
          <PelangganManagement />
        ) : (
          <DashboardPelanggan setActiveTab={setActiveTab} />
        );

      case 'billing':
        return <BillingManagement />;

      case 'ruijie':
        return currentUser.role !== 'pelanggan' ? (
          <RuijieManagement />
        ) : (
          <DashboardPelanggan setActiveTab={setActiveTab} />
        );

      case 'teknisi':
        return currentUser.role !== 'pelanggan' ? (
          <TeknisiManagement />
        ) : (
          <DashboardPelanggan setActiveTab={setActiveTab} />
        );

      case 'tiket':
        return <TiketManagement />;

      case 'voucher':
        return <VoucherKiosk />;

      case 'whatsapp':
        return currentUser.role !== 'pelanggan' ? (
          <WhatsappGateway />
        ) : (
          <DashboardPelanggan setActiveTab={setActiveTab} />
        );

      case 'ci4':
        return currentUser.role !== 'pelanggan' ? (
          <Ci4ExportView />
        ) : (
          <DashboardPelanggan setActiveTab={setActiveTab} />
        );

      case 'settings':
        return currentUser.role === 'superadmin' ? (
          <SettingsView />
        ) : (
          <DashboardSuperAdmin setActiveTab={setActiveTab} />
        );

      default:
        return <DashboardSuperAdmin setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Header with Hamburger and Collapse triggers */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar (Auto-collapse on desktop & Slide-over drawer on mobile) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Content Body with flexible width */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 transition-all duration-300">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals */}
      <DanaPaymentModal />
      <InvoicePrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
