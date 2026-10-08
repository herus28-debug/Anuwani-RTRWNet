import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WhatsAppLog, WhatsAppFeatureToggles, WhatsAppTemplates } from '../types';
import {
  MessageSquare,
  Send,
  CheckCheck,
  Clock,
  ShieldCheck,
  Settings,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Sliders,
  FileCode,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  Info
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

export const WhatsappGateway: React.FC = () => {
  const { whatsAppLogs, settings, updateSettings, kirimWhatsAppNotif } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'CONFIG' | 'FEATURE_TOGGLES' | 'TEMPLATES' | 'TEST' | 'LOGS'>('CONFIG');

  // Connection config state
  const [provider, setProvider] = useState(settings?.waGatewayProvider || 'FONNTE');
  const [token, setToken] = useState(settings?.waGatewayToken || '');
  const [delaySeconds, setDelaySeconds] = useState(settings?.waDelaySeconds || 2);
  const [webhookUrl, setWebhookUrl] = useState(settings?.waWebhookUrl || 'https://api.anuwani.rtrw.net/api/whatsapp/webhook');

  // Feature Toggles state
  const [features, setFeatures] = useState<WhatsAppFeatureToggles>(() => ({
    ...defaultWaFeatures,
    ...(settings?.waFeatures || {})
  }));

  // Template editor state
  const [templates, setTemplates] = useState<WhatsAppTemplates>(() => ({
    ...(settings?.waTemplates || {})
  }));
  const [activeTemplateKey, setActiveTemplateKey] = useState<keyof WhatsAppTemplates>('templateTagihan');

  // Test sender state
  const [testPhone, setTestPhone] = useState('081234567890');
  const [testName, setTestName] = useState('Budi Santoso');
  const [testMessage, setTestMessage] = useState(
    '*TEST NOTIFIKASI WHATSAPP BOT anuwani*\n\nSistem notifikasi WhatsApp Gateway RT/RW Net telah terhubung dengan baik ke gateway. Notifikasi tagihan & kwitansi pembayaran akan dikirimkan otomatis.'
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      waGatewayProvider: provider,
      waGatewayToken: token,
      waDelaySeconds: delaySeconds,
      waWebhookUrl: webhookUrl,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleToggleFeature = (key: keyof WhatsAppFeatureToggles) => {
    const updated = {
      ...defaultWaFeatures,
      ...features,
      [key]: !features?.[key]
    };
    setFeatures(updated);
    updateSettings({ waFeatures: updated });
  };

  const handleSaveTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ waTemplates: templates });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) return;

    kirimWhatsAppNotif(testPhone, testName, 'INFO_UNISOLIR', testMessage);
    alert(`Pesan uji coba berhasil dikirim ke nomor ${testPhone} melalui gateway ${provider}!`);
  };

  // Variable helper tags for template editor
  const templateVariables: Record<keyof WhatsAppTemplates, { label: string; desc: string; tags: string[] }> = {
    templateAktivasi: {
      label: '1. Notifikasi Aktivasi Akun Baru',
      desc: 'Terkirim saat Admin menekan tombol "Aktivasi Akun" untuk pelanggan baru.',
      tags: ['{NAMA}', '{NO_PELANGGAN}', '{PAKET}', '{IP_ADDRESS}', '{PPPOE_USER}', '{ODP_PORT}', '{JATUH_TEMPO}', '{EMAIL}', '{PASSWORD}'],
    },
    templateTagihan: {
      label: '2. Pemberitahuan Tagihan Terbit',
      desc: 'Terkirim saat tagihan bulanan dibuat atau di-generate massal (H-3 jatuh tempo).',
      tags: ['{ISP_NAME}', '{NAMA}', '{PERIODE}', '{NOMINAL}', '{JATUH_TEMPO}', '{LINK_BAYAR}'],
    },
    templateKwitansi: {
      label: '3. Kwitansi Pembayaran Lunas (DANA/Tunai)',
      desc: 'Terkirim detik setelah webhook DANA memverifikasi pembayaran berhasil.',
      tags: ['{ISP_NAME}', '{NAMA}', '{PERIODE}', '{NO_INVOICE}', '{TX_REF}', '{NOMINAL}', '{WAKTU}', '{KONTAK_NOC}'],
    },
    templatePeringatanIsolir: {
      label: '4. Peringatan & Eksekusi Auto-Isolir Ruijie',
      desc: 'Terkirim otomatis saat cron job mendeteksi tagihan melewati tenggat jatuh tempo.',
      tags: ['{NAMA}', '{PERIODE}', '{NOMINAL}', '{JATUH_TEMPO}', '{LINK_BAYAR}'],
    },
    templateUnisolir: {
      label: '5. Pemulihan Koneksi (Un-Isolir Ruijie)',
      desc: 'Terkirim setelah status isolir dicabut dan profil kecepatan Ruijie dipulihkan normal.',
      tags: ['{NAMA}', '{PAKET}'],
    },
    templateTiketUpdate: {
      label: '6. Update Tiket Gangguan & Teknisi Dispatch',
      desc: 'Terkirim saat status tiket berubah atau teknisi ditugaskan menuju lokasi.',
      tags: ['{NAMA}', '{KODE_TIKET}', '{JUDUL_TIKET}', '{STATUS_TIKET}', '{NAMA_TEKNISI}', '{NO_TEKNISI}', '{KETERANGAN}'],
    },
    templateVoucherSuccess: {
      label: '7. Pengiriman Kode Voucher Hotspot Wi-Fi',
      desc: 'Terkirim saat warga/tamu membeli voucher hotspot melalui QRIS DANA.',
      tags: ['{NAMA}', '{NAMA_PAKET}', '{KODE_VOUCHER}', '{PASSWORD_VOUCHER}', '{DURASI_JAM}', '{SPEED_MBPS}'],
    },
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pusat Konfigurasi WhatsApp Gateway
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              GATEWAY TERKONEKSI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola seluruh fitur otomatis, saklar notifikasi, kustomisasi template pesan & integrasi API gateway.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Konfigurasi Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/80 rounded-2xl text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('CONFIG')}
          className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeSubTab === 'CONFIG' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-sky-600" />
          <span>Koneksi API Gateway</span>
        </button>

        <button
          onClick={() => setActiveSubTab('FEATURE_TOGGLES')}
          className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeSubTab === 'FEATURE_TOGGLES' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Saklar 7 Fitur Otomatis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TEMPLATES')}
          className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeSubTab === 'TEMPLATES' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>Editor Template Pesan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TEST')}
          className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeSubTab === 'TEST' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-amber-600" />
          <span>Uji Coba Kirim WA</span>
        </button>

        <button
          onClick={() => setActiveSubTab('LOGS')}
          className={`px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeSubTab === 'LOGS' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Log Pengiriman ({whatsAppLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: KONEKSI API GATEWAY */}
      {activeSubTab === 'CONFIG' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Konfigurasi Koneksi Provider WhatsApp
                </h2>
                <p className="text-xs text-slate-500">
                  Parameter otentikasi multi-device API untuk mengirim notifikasi secara otomatis
                </p>
              </div>
              <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Aktif</span>
              </span>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Provider WhatsApp Gateway
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="FONNTE">Fonnte WhatsApp API (Resmi Multi-Device)</option>
                    <option value="WABLAS">Wablas Enterprise Gateway</option>
                    <option value="BAILEYS">Baileys Self-Hosted (Node.js/VPS)</option>
                    <option value="WASSENGER">Wassenger Cloud API</option>
                    <option value="RUANGGWA">Ruanggwa WhatsApp Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nomor WhatsApp Pengirim Bot NOC
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={settings.waContactCenter}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  API Token / Secret Key ({provider})
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="fonnte_token_xxx atau secret key provider"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Webhook URL Penerima Pesan (Incoming)
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Dipakai untuk bot voucher otomatis tanpa aplikasi.</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jeda Antar Pesan (Delay Anti-Spam / Banned)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={delaySeconds}
                      onChange={(e) => setDelaySeconds(Number(e.target.value))}
                      className="w-24 p-2.5 border border-slate-200 rounded-xl text-center font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-slate-500">Detik (Rekomendasi: 2 - 3 detik)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm inline-flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Gateway</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 text-xs shadow-sm">
              <div className="font-bold flex items-center space-x-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Tips Keamanan Gateway WhatsApp</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Pastikan nomor WhatsApp yang didaftarkan menggunakan nomor bisnis resmi ISP RT/RW Net. Gunakan jeda pengiriman minimal 2 detik untuk menghindari pemblokiran (*banned*) dari WhatsApp saat blast tagihan massal.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Protokol: HTTPS TLS 1.3 · HMAC Signature Enabled
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAKLAR 7 FITUR OTOMATIS */}
      {activeSubTab === 'FEATURE_TOGGLES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Saklar Pengiriman Otomatis Notifikasi WhatsApp (Feature Toggles)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aktifkan atau nonaktifkan fitur bot WhatsApp secara granular sesuai kebutuhan operasional RT/RW Net Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Toggle 1: Aktivasi Pelanggan */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  1. Notifikasi Aktivasi Akun Baru
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim otomatis akun PPPoE, password portal, dan rincian ODP saat admin menekan tombol aktivasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifAktivasi')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifAktivasi ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifAktivasi ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 2: Tagihan Bulanan Terbit */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  2. Pemberitahuan Tagihan Terbit (Billing)
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim tagihan otomatis beserta tautan pembayaran DANA / QRIS saat tagihan bulanan dibuat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifTagihan')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifTagihan ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifTagihan ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 3: Kwitansi Lunas DANA */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  3. Kwitansi Digital Lunas Instan
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim bukti tanda terima resmi detik setelah webhook pembayaran DANA QRIS berhasil diverifikasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifKwitansiLunas')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifKwitansiLunas ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifKwitansiLunas ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 4: Peringatan & Eksekusi Auto-Isolir */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  4. Peringatan & Eksekusi Auto-Isolir Ruijie
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim pesan peringatan penangguhan internet saat jatuh tempo terlewati dan cron job mengisolir router.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifPeringatanIsolir')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifPeringatanIsolir ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifPeringatanIsolir ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 5: Pemulihan Un-Isolir */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  5. Info Pemulihan Layanan (Un-Isolir Normal)
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim konfirmasi bahwa status isolir telah dicabut dan bandwidth normal kembali (&lt; 2 detik).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifUnisolir')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifUnisolir ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifUnisolir ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 6: Tiket Gangguan & Teknisi */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  6. Notifikasi Tiket Gangguan & Teknisi Dispatch
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Kirim update status tiket ke pelanggan dan nomor WA teknisi saat ada penugasan perbaikan ODP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableNotifTiket')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableNotifTiket ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableNotifTiket ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Toggle 7: Bot Beli Voucher Tanpa Aplikasi */}
            <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between space-x-3 hover:bg-slate-50 transition-colors md:col-span-2 bg-emerald-50/50">
              <div>
                <div className="font-bold text-xs text-emerald-950 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>7. Bot Pembelian Voucher Hotspot Wi-Fi (Tanpa Aplikasi)</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Mengaktifkan bot interaktif otomatis merespons kata kunci <code>BELI</code>, mengirim QRIS DANA, dan langsung membalas kredensial voucher ke WhatsApp warga.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleFeature('enableBotVoucherHotspot')}
                className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
                  features.enableBotVoucherHotspot ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                {features.enableBotVoucherHotspot ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: EDITOR TEMPLATE PESAN WHATSAPP */}
      {activeSubTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Template Selector (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5 shadow-sm">
            <div className="font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">
              Pilih Jenis Template Notifikasi:
            </div>

            {(Object.keys(templateVariables) as Array<keyof WhatsAppTemplates>).map((key) => {
              const info = templateVariables[key];
              const isSelected = activeTemplateKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTemplateKey(key)}
                  className={`w-full text-left p-3 rounded-xl transition-all text-xs ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">{info.label}</div>
                </button>
              );
            })}
          </div>

          {/* Template Editor Body (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {templateVariables[activeTemplateKey].label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {templateVariables[activeTemplateKey].desc}
                </p>
              </div>
            </div>

            {/* Variable Tags Cloud */}
            <div>
              <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                Variabel Dinamis Tersedia (Klik untuk Menyalin / Memasukkan):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {templateVariables[activeTemplateKey].tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setTemplates(prev => ({
                        ...prev,
                        [activeTemplateKey]: prev[activeTemplateKey] + ' ' + tag,
                      }));
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 rounded-md font-mono text-[10px] transition-colors"
                    title="Klik untuk menambahkan ke template"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Editor */}
            <form onSubmit={handleSaveTemplates} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Isi Pesan WhatsApp Format Markdown (*tebal*, _miring_):
                </label>
                <textarea
                  rows={10}
                  value={templates[activeTemplateKey]}
                  onChange={(e) => {
                    setTemplates({
                      ...templates,
                      [activeTemplateKey]: e.target.value,
                    });
                  }}
                  className="w-full p-3 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Perubahan akan langsung digunakan pada seluruh kiriman berikutnya.
                </span>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors inline-flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Template Ini</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* TAB 4: TEST SENDER */}
      {activeSubTab === 'TEST' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Uji Coba Pengiriman Pesan WhatsApp Real-Time
            </h2>
            <p className="text-xs text-slate-500">
              Kirimkan pesan uji coba langsung ke nomor HP Anda untuk memastikan token gateway dan format pesan berfungsi.
            </p>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp Tujuan</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="081234567890"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Penerima</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Isi Pesan Uji Coba</label>
              <textarea
                rows={4}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed font-sans"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors inline-flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Uji Coba Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: LOG PENGIRIMAN */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Riwayat Pesan WhatsApp Terkirim ({whatsAppLogs.length})
            </h2>
            <span className="text-xs text-slate-500">
              Log aktivitas transaksi, penagihan, tiket, dan voucher
            </span>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {whatsAppLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      log.type === 'KWITANSI_LUNAS' ? 'bg-emerald-100 text-emerald-800' :
                      log.type === 'PERINGATAN_ISOLIR' ? 'bg-rose-100 text-rose-800' :
                      log.type === 'TAGIHAN_BULANAN' ? 'bg-sky-100 text-sky-800' :
                      log.type === 'VOUCHER_CODE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.type}
                    </span>
                    <span className="font-bold text-slate-900">{log.recipientName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-600">{log.recipientPhone}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-line text-[11px] leading-relaxed font-sans">
                    {log.message}
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                    <span>ID Provider: <code className="text-slate-600">{log.gatewayResponseId}</code></span>
                    <span>·</span>
                    <span className="text-emerald-600 flex items-center space-x-1">
                      <CheckCheck className="w-3 h-3" />
                      <span>Status: {log.status}</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono text-right flex-shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
