import React, { useState } from 'react';
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
  ToggleRight
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

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(() => ({
    ...settings,
    waFeatures: {
      ...defaultWaFeatures,
      ...(settings?.waFeatures || {})
    }
  }));
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  return (
    <div className="space-y-6 max-w-4xl">

      <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Sistem RT/RW Net & Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Konfigurasi profil usaha, integrasi Ruijie Reyee Cloud API, DANA Payment & WhatsApp Bot.
          </p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">

        {/* Section 1: Profil ISP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Profil Usaha & Kontak RT/RW Net
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Usaha ISP / RT-RW Net</label>
              <input
                type="text"
                value={formData.ispName}
                onChange={(e) => setFormData({ ...formData, ispName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tagline Layanan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp Pusat Bantuan / NOC</label>
              <input
                type="text"
                value={formData.waContactCenter}
                onChange={(e) => setFormData({ ...formData, waContactCenter: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Wilayah Jangkauan ODP</label>
              <input
                type="text"
                value={formData.rtRwCoverage}
                onChange={(e) => setFormData({ ...formData, rtRwCoverage: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Ruijie Reyee Cloud API Config */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Server className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Integrasi Ruijie Reyee Cloud API (Auto-Isolir)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ruijie Cloud Project ID</label>
              <input
                type="text"
                value={formData.ruijieCloudProjectId}
                onChange={(e) => setFormData({ ...formData, ruijieCloudProjectId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">IP Gateway Ruijie Reyee (NOC)</label>
              <input
                type="text"
                value={formData.ruijieGatewayIp}
                onChange={(e) => setFormData({ ...formData, ruijieGatewayIp: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Ruijie Cloud API Key (Bearer Token)</label>
              <input
                type="password"
                value={formData.ruijieCloudApiKey}
                onChange={(e) => setFormData({ ...formData, ruijieCloudApiKey: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: DANA Payment Gateway */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-[#118EEA]" />
            <h2 className="text-sm font-bold text-slate-900">
              Gateway Pembayaran DANA (QRIS Dinamis & Webhook)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">DANA Merchant ID</label>
              <input
                type="text"
                value={formData.danaMerchantId}
                onChange={(e) => setFormData({ ...formData, danaMerchantId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">DANA Webhook Secret (HMAC SHA-256)</label>
              <input
                type="password"
                value={formData.danaWebhookSecret}
                onChange={(e) => setFormData({ ...formData, danaWebhookSecret: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">DANA Production API Secret Key</label>
              <input
                type="password"
                value={formData.danaApiKey}
                onChange={(e) => setFormData({ ...formData, danaApiKey: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: WhatsApp Gateway & Fitur Otomatis */}
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
                className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Gateway API Token / Auth Secret</label>
              <input
                type="password"
                value={formData.waGatewayToken}
                onChange={(e) => setFormData({ ...formData, waGatewayToken: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="fonnte_token_xxxxxxxxxxxx"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Webhook URL Masuk (Inbound Message / Bot)</label>
              <input
                type="text"
                value={formData.waWebhookUrl}
                onChange={(e) => setFormData({ ...formData, waWebhookUrl: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>

      </form>

    </div>
  );
};
