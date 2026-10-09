import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WhatsAppFeatureToggles } from '../types';
import {
  Settings,
  Server,
  CreditCard,
  MessageSquare,
  Building,
  CheckCircle2,
  Save,
  KeyRound,
  Sliders,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Palette,
  Sparkles,
  Wifi,
  Eye,
  RefreshCw,
  Landmark,
  BadgePercent
} from 'lucide-react';

const defaultWaFeatures: WhatsAppFeatureToggles = {
  enableNotifAktivasi: true,
  enableNotifTagihan: true,
  enableNotifKwitansiLunas: true,
  enableNotifPeringatanIsolir: true,
  enableNotifUnisolir: true,
  enableNotifTiket: true,
  enableBotVoucherHotspot: true,
};

// Preset Logo sample SVG data URIs for instant selection
const PRESET_LOGOS = [
  {
    id: 'preset-1',
    name: 'Anuwani Cyber Blue (Default)',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="100%" stop-color="%2306b6d4"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g1)"/><path d="M50 20 A30 30 0 0 1 80 50" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/><path d="M50 34 A16 16 0 0 1 66 50" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="7" fill="white"/><path d="M24 75 L42 45 L58 75 L50 75 L42 58 L34 75 Z" fill="white"/><text x="50" y="90" font-family="Arial,sans-serif" font-weight="900" font-size="11" fill="white" text-anchor="middle">ANUWANI</text></svg>'
  },
  {
    id: 'preset-2',
    name: 'Anuwani Fiber Emerald',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23059669"/><stop offset="100%" stop-color="%2310b981"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g2)"/><circle cx="50" cy="42" r="8" fill="white"/><path d="M28 26 C39 15 61 15 72 26" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/><path d="M36 34 C43 27 57 27 64 34" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"/><path d="M30 78 L50 56 L70 78" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"/><text x="50" y="90" font-family="Arial,sans-serif" font-weight="900" font-size="10" fill="white" text-anchor="middle">ANUWANI NET</text></svg>'
  },
  {
    id: 'preset-3',
    name: 'Anuwani Royal Indigo',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234f46e5"/><stop offset="100%" stop-color="%237c3aed"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g3)"/><polygon points="50,18 78,42 66,76 34,76 22,42" fill="none" stroke="white" stroke-width="6"/><circle cx="50" cy="46" r="10" fill="white"/><text x="50" y="90" font-family="Arial,sans-serif" font-weight="900" font-size="11" fill="white" text-anchor="middle">ANUWANI</text></svg>'
  },
  {
    id: 'preset-4',
    name: 'Anuwani Sunset Amber',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ea580c"/><stop offset="100%" stop-color="%23f59e0b"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g4)"/><path d="M50 20 L25 60 L75 60 Z" fill="none" stroke="white" stroke-width="6"/><circle cx="50" cy="46" r="6" fill="white"/><text x="50" y="85" font-family="Arial,sans-serif" font-weight="900" font-size="11" fill="white" text-anchor="middle">ANUWANI</text></svg>'
  }
];

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  
  const [formData, setFormData] = useState(() => ({
    ...settings,
    ispName: settings?.ispName || 'Anuwani RT/RW NET',
    brandShortName: settings?.brandShortName || 'Anuwani',
    tagline: settings?.tagline || 'Internet Super Cepat, Hemat & Handal untuk Komunitas Warga',
    logoUrl: settings?.logoUrl || '',
    primaryColor: settings?.primaryColor || '#0284c7',
    companyLegalName: settings?.companyLegalName || 'PT ANUWANI DIGITAL NETWORK INDONESIA',
    companyAddress: settings?.companyAddress || 'Jl. Melati Raya No. 12, RW 05 Kelurahan Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16413',
    companyEmail: settings?.companyEmail || 'info@anuwani.net.id',
    companyPhone: settings?.companyPhone || '021-87654321',
    companyNpwp: settings?.companyNpwp || '01.234.567.8-412.000',
    companyWebsite: settings?.companyWebsite || 'https://anuwani.rtrw.net',
    billingFooterNote: settings?.billingFooterNote || 'Terima kasih atas pembayaran tepat waktu. Internet cepat, lingkungan guyub rukun.',
    bankAccount: settings?.bankAccount || 'Bank BCA 883019281 a.n PT Anuwani Digital Network',
    bankName: settings?.bankName || 'Bank Central Asia (BCA)',
    bankHolder: settings?.bankHolder || 'PT Anuwani Digital Network',
    waFeatures: {
      ...defaultWaFeatures,
      ...(settings?.waFeatures || {})
    }
  }));

  const [activeTabSection, setActiveTabSection] = useState<'branding' | 'ruijie' | 'dana' | 'whatsapp'>('branding');
  const [saved, setSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggleWaFeature = (key: keyof WhatsAppFeatureToggles) => {
    setFormData(prev => {
      const currentFeatures = {
        ...defaultWaFeatures,
        ...(prev?.waFeatures || {})
      };
      return {
        ...prev,
        waFeatures: {
          ...currentFeatures,
          [key]: !currentFeatures[key]
        }
      };
    });
  };

  // Image Upload handler (convert to Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, logoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleResetToAnuwaniPreset = (presetUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logoUrl: presetUrl,
      brandShortName: 'Anuwani',
      ispName: 'Anuwani RT/RW NET'
    }));
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pengaturan Sistem & Branding Perusahaan
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
              Branding Anuwani
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola identitas resmi PT / RT-RW Net Anuwani, unggah logo, alamat NOC, perizinan, integrasi Ruijie Reyee & WhatsApp Bot.
          </p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan Identitas Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 pb-px text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTabSection('branding')}
          className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTabSection === 'branding'
              ? 'border-sky-600 text-sky-700 bg-sky-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building className="w-4 h-4 text-sky-600" />
          <span>Identitas & Logo Usaha (Anuwani)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('ruijie')}
          className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTabSection === 'ruijie'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4 text-indigo-600" />
          <span>Ruijie Reyee Cloud (Auto-Isolir)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('dana')}
          className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTabSection === 'dana'
              ? 'border-[#118EEA] text-[#118EEA] bg-sky-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#118EEA]" />
          <span>DANA Payment Gateway & Rekening</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('whatsapp')}
          className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTabSection === 'whatsapp'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp Gateway & Bot</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">

        {/* SECTION 1: IDENTITAS PERUSAHAAN & LOGO */}
        {activeTabSection === 'branding' && (
          <div className="space-y-6">

            {/* Preview Banner Hero */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-2xl p-5 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt={formData.brandShortName}
                      className="w-16 h-16 rounded-2xl object-contain bg-white/10 p-1.5 border border-white/20 backdrop-blur-sm shadow-xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-xl">
                      <Wifi className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Branding Aktif"></span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {formData.brandShortName || 'Anuwani'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                      {formData.companyLegalName || 'PT Anuwani Digital Network'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">
                    {formData.tagline}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                    <span>NOC: {formData.waContactCenter}</span>
                    <span>•</span>
                    <span>Wilayah: {formData.rtRwCoverage}</span>
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[11px] text-slate-400">Live Branding Status</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-end space-x-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>TERHUBUNG KE SEMUA MODUL</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Header · Invoice · Struk PDF · Bot WA</div>
              </div>
            </div>

            {/* Logo Manager Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Logo Resmi & Lambang Brand (Anuwani)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">Mendukung format PNG, JPG, SVG, WebP (Maks 2MB)</span>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {uploadError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Current Logo Preview */}
                <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preview Logo Sekarang</span>
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-2 shadow-inner">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo Usaha"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                        <Wifi className="w-8 h-8 text-sky-500 mb-1" />
                        <span className="text-[10px] font-semibold">Icon Default</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-[11px] font-semibold transition-all inline-flex items-center space-x-1 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Logo</span>
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus Logo Kustom"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>

                {/* Preset Logos Anuwani */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Atau Pilih Cepat Logo Vektor Anuwani Siap Pakai:</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleResetToAnuwaniPreset(preset.url)}
                        className={`p-3 rounded-xl border flex flex-col items-center space-y-2 transition-all ${
                          formData.logoUrl === preset.url
                            ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-10 h-10 rounded-lg shadow-sm"
                        />
                        <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-xl text-[11px] text-sky-800 leading-relaxed">
                    💡 <strong>Tips Logo:</strong> Logo yang Anda pilih atau unggah otomatis muncul pada navbar header, sidebar sistem, faktur tagihan pelanggan, struk kwitansi pembayaran DANA, dan laporan PDF bulanan.
                  </div>
                </div>

              </div>
            </div>

            {/* Identitas Usaha & Legalitas Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Building className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Identitas Lengkap Perusahaan / ISP RT-RW Net
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Usaha ISP / RT-RW Net <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ispName}
                    onChange={(e) => setFormData({ ...formData, ispName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Contoh: Anuwani RT/RW NET"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Pendek Brand / Singkatan
                  </label>
                  <input
                    type="text"
                    value={formData.brandShortName}
                    onChange={(e) => setFormData({ ...formData, brandShortName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Contoh: Anuwani"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Badan Hukum Resmi (PT / CV / Koperasi)
                  </label>
                  <input
                    type="text"
                    value={formData.companyLegalName}
                    onChange={(e) => setFormData({ ...formData, companyLegalName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Contoh: PT ANUWANI DIGITAL NETWORK"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tagline / Motto Layanan
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Contoh: Internet Super Cepat, Hemat & Handal untuk Komunitas Warga"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nomor NPWP / NIB Usaha
                  </label>
                  <input
                    type="text"
                    value={formData.companyNpwp}
                    onChange={(e) => setFormData({ ...formData, companyNpwp: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="01.234.567.8-412.000"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Alamat Lengkap Kantor Pusat / Sentral NOC
                  </label>
                  <input
                    type="text"
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Jl. Melati Raya No. 12, RW 05 Kelurahan Sukamaju..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Wilayah Jangkauan ODP / Distribusi FO
                  </label>
                  <input
                    type="text"
                    value={formData.rtRwCoverage}
                    onChange={(e) => setFormData({ ...formData, rtRwCoverage: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="RT 01 s/d RT 06, RW 05"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email Kontak Perusahaan
                  </label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="info@anuwani.net.id"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Telepon Kantor / Hunting
                  </label>
                  <input
                    type="text"
                    value={formData.companyPhone}
                    onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="021-87654321"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Website Resmi / Portal Pelanggan
                  </label>
                  <input
                    type="text"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="https://anuwani.rtrw.net"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nomor WhatsApp Pusat Bantuan / NOC 24 Jam
                  </label>
                  <input
                    type="text"
                    value={formData.waContactCenter}
                    onChange={(e) => setFormData({ ...formData, waContactCenter: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="0812-3456-7890"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Catatan Kaki Struk Tagihan (Invoice Footer)
                  </label>
                  <input
                    type="text"
                    value={formData.billingFooterNote}
                    onChange={(e) => setFormData({ ...formData, billingFooterNote: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Terima kasih atas pembayaran tepat waktu."
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: RUIJIE REYEE CLOUD CONFIG */}
        {activeTabSection === 'ruijie' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Server className="w-4 h-4 text-indigo-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Integrasi Ruijie Reyee Cloud API & Auto-Isolir Router
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sinkronisasi mikrotik/ruijie cloud untuk eksekusi putus sambung bandwidth seketika (&lt;2 detik).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ruijie Cloud Project ID</label>
                <input
                  type="text"
                  value={formData.ruijieCloudProjectId}
                  onChange={(e) => setFormData({ ...formData, ruijieCloudProjectId: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">IP Gateway Ruijie Reyee (NOC)</label>
                <input
                  type="text"
                  value={formData.ruijieGatewayIp}
                  onChange={(e) => setFormData({ ...formData, ruijieGatewayIp: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Ruijie Cloud API Key (Bearer Token)</label>
                <input
                  type="password"
                  value={formData.ruijieCloudApiKey}
                  onChange={(e) => setFormData({ ...formData, ruijieCloudApiKey: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DANA & BANK PAYMENT */}
        {activeTabSection === 'dana' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-[#118EEA]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Gateway Pembayaran DANA (QRIS Dinamis & Webhook Auto-Unisolir)
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kredensial merchant production untuk verifikasi transaksi instan via DANA QRIS.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">DANA Merchant ID</label>
                  <input
                    type="text"
                    value={formData.danaMerchantId}
                    onChange={(e) => setFormData({ ...formData, danaMerchantId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">DANA Webhook Secret (HMAC SHA-256)</label>
                  <input
                    type="password"
                    value={formData.danaWebhookSecret}
                    onChange={(e) => setFormData({ ...formData, danaWebhookSecret: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">DANA Production API Secret Key</label>
                  <input
                    type="password"
                    value={formData.danaApiKey}
                    onChange={(e) => setFormData({ ...formData, danaApiKey: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Rekening Bank Penampung Resmi (Transfer Manual)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Bank BCA"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Atas Nama Rekening</label>
                  <input
                    type="text"
                    value={formData.bankHolder}
                    onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="PT Anuwani Digital Network"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Rekening & Format Tampil</label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Bank BCA 883019281 a.n PT Anuwani Digital Network"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: WHATSAPP GATEWAY */}
        {activeTabSection === 'whatsapp' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Konfigurasi WhatsApp Gateway & Saklar Seluruh Fitur Otomatis
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                WA BOT ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Provider WhatsApp Gateway</label>
                <select
                  value={formData.waGatewayProvider}
                  onChange={(e) => setFormData({ ...formData, waGatewayProvider: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="FONNTE">Fonnte (Official Provider Recommended)</option>
                  <option value="WABLAS">Wablas API Gateway</option>
                  <option value="BAILEYS">Baileys Self-Hosted Node.js Server</option>
                  <option value="WASSENGER">Wassenger Cloud API</option>
                  <option value="RUANGGWA">RuangWA Gateway</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Anti-Banned Delay (Detik per Pesan)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.waDelaySeconds}
                  onChange={(e) => setFormData({ ...formData, waDelaySeconds: parseInt(e.target.value) || 2 })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Gateway API Token / Auth Secret</label>
                <input
                  type="password"
                  value={formData.waGatewayToken}
                  onChange={(e) => setFormData({ ...formData, waGatewayToken: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="fonnte_token_xxxxxxxxxxxx"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Webhook URL Masuk (Inbound Message / Bot)</label>
                <input
                  type="text"
                  value={formData.waWebhookUrl}
                  onChange={(e) => setFormData({ ...formData, waWebhookUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Toggle Switches for All Features Using WhatsApp Gateway */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status Aktifasi Fitur WhatsApp (Saklar Otomatis):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'enableNotifAktivasi', label: '1. Notifikasi Aktivasi Akun Baru' },
                  { key: 'enableNotifTagihan', label: '2. Tagihan Bulanan Terbit & H-3' },
                  { key: 'enableNotifKwitansiLunas', label: '3. Kwitansi Pembayaran Lunas (DANA/Tunai)' },
                  { key: 'enableNotifPeringatanIsolir', label: '4. Eksekusi Auto-Isolir Ruijie' },
                  { key: 'enableNotifUnisolir', label: '5. Pemulihan Koneksi (Un-Isolir)' },
                  { key: 'enableNotifTiket', label: '6. Update Tiket Gangguan & Teknisi' },
                  { key: 'enableBotVoucherHotspot', label: '7. Beli Voucher via WhatsApp Bot' },
                ].map((item) => {
                  const isEnabled = Boolean(formData.waFeatures?.[item.key as keyof WhatsAppFeatureToggles]);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleToggleWaFeature(item.key as keyof WhatsAppFeatureToggles)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isEnabled
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="font-semibold text-[11px]">{item.label}</span>
                      {isEnabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button Fixed on Bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-[11px] text-slate-500">
            Perubahan branding dan identitas perusahaan akan tersimpan secara persisten di sistem anuwani.
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg inline-flex items-center space-x-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan Branding</span>
          </button>
        </div>

      </form>

    </div>
  );
};
