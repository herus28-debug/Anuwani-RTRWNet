import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HotspotVoucher } from '../types';
import { WhatsAppVoucherSimulator } from './WhatsAppVoucherSimulator';
import confetti from 'canvas-confetti';
import {
  Radio,
  Wifi,
  QrCode,
  Zap,
  CheckCircle2,
  Copy,
  Clock,
  Download,
  Share2,
  X,
  CreditCard,
  MessageSquare,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface VoucherPlan {
  id: string;
  name: string;
  durasiJam: number;
  speedMbps: number;
  harga: number;
  tagline: string;
  popular?: boolean;
}

const voucherPlans: VoucherPlan[] = [
  {
    id: 'vplan-1',
    name: '2 Jam Kilat',
    durasiJam: 2,
    speedMbps: 5,
    harga: 3000,
    tagline: 'Cocok untuk nonton youtube & chatting di pos ronda',
  },
  {
    id: 'vplan-2',
    name: '6 Jam Hemat',
    durasiJam: 6,
    speedMbps: 7,
    harga: 5000,
    tagline: 'Cukup untuk belajar kelompok & meeting siang hari',
  },
  {
    id: 'vplan-3',
    name: '24 Jam Seharian',
    durasiJam: 24,
    speedMbps: 10,
    harga: 10000,
    tagline: 'Paling favorit! 24 jam nonstop bebas streaming HD',
    popular: true,
  },
  {
    id: 'vplan-4',
    name: '7 Hari Mingguan',
    durasiJam: 168,
    speedMbps: 15,
    harga: 30000,
    tagline: 'Pilihan hemat untuk tamu yang menginap seminggu',
  },
  {
    id: 'vplan-5',
    name: '30 Hari Hotspot',
    durasiJam: 720,
    speedMbps: 20,
    harga: 60000,
    tagline: 'Aktif satu bulan penuh di seluruh titik AP Ruijie RT/RW',
  },
];

export const VoucherKiosk: React.FC = () => {
  const { voucherList, beliVoucherHotspot, settings } = useApp();

  // Mode switcher: Default to 'WHATSAPP' as requested ("cukup menggunakan whatsapp, tidak perlu aplikasi")
  const [activeKioskMode, setActiveKioskMode] = useState<'WHATSAPP' | 'WEB_KIOSK'>('WHATSAPP');

  const [selectedPlan, setSelectedPlan] = useState<VoucherPlan | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [purchasedVoucher, setPurchasedVoucher] = useState<HotspotVoucher | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenPlan = (plan: VoucherPlan) => {
    setSelectedPlan(plan);
    setPurchasedVoucher(null);
    setBuyerName('');
    setBuyerPhone('');
  };

  const handlePayVoucher = async () => {
    if (!selectedPlan) return;
    setIsPaying(true);

    try {
      await new Promise(res => setTimeout(res, 800));

      const vcr = await beliVoucherHotspot(
        selectedPlan.name,
        selectedPlan.harga,
        selectedPlan.durasiJam,
        selectedPlan.speedMbps,
        buyerName || 'Warga Hotspot',
        buyerPhone,
        'PORTAL_WEB'
      );

      setPurchasedVoucher(vcr);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      alert('Gagal memproses voucher');
    } finally {
      setIsPaying(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const officialWaLink = `https://wa.me/6281234567890?text=${encodeURIComponent(
    'Halo Bot anuwani, saya mau beli voucher wifi'
  )}`;

  return (
    <div className="space-y-6">

      {/* Primary Sub-Navigation Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-200/80 rounded-2xl">
        <div className="inline-flex p-1 bg-white rounded-xl text-xs font-semibold shadow-xs">
          
          {/* Mode 1: WhatsApp Bot (Tanpa Aplikasi) */}
          <button
            onClick={() => setActiveKioskMode('WHATSAPP')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              activeKioskMode === 'WHATSAPP'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Beli Cukup via WhatsApp (Tanpa Aplikasi)</span>
            <span className="text-[10px] bg-emerald-950/40 text-emerald-200 px-1.5 py-0.2 rounded font-bold">
              POPULER
            </span>
          </button>

          {/* Mode 2: Web Kiosk Catalog */}
          <button
            onClick={() => setActiveKioskMode('WEB_KIOSK')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              activeKioskMode === 'WEB_KIOSK'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-sky-200" />
            <span>Katalog Kios Web (QRIS DANA)</span>
          </button>
        </div>

        {/* Quick WhatsApp Link CTA */}
        <div className="flex items-center space-x-2 px-2 text-xs text-slate-600">
          <span className="text-emerald-700 font-bold hidden md:inline">Bot WhatsApp NOC:</span>
          <a
            href={officialWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300 transition-colors inline-flex items-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>{settings.waContactCenter}</span>
          </a>
        </div>
      </div>

      {/* Render Mode: WhatsApp Simulator vs Web Kiosk */}
      {activeKioskMode === 'WHATSAPP' ? (
        <WhatsAppVoucherSimulator />
      ) : (
        /* Web Kiosk Mode */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
                <Radio className="w-3.5 h-3.5" />
                <span>Kios Wi-Fi Hotspot Warga Publik · QRIS DANA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Katalog Voucher Internet Hotspot Ruijie
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pilih paket voucher di bawah ini dan bayar menggunakan QRIS DANA langsung dari browser atau chat bot WhatsApp.
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Buy Notification Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-emerald-900 shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-emerald-950">
                  Malas Buka Website? Beli Cukup Lewat WhatsApp Saja!
                </div>
                <div className="text-[11px] text-emerald-700">
                  Ketik <strong>BELI</strong> ke nomor WhatsApp Bot <strong>{settings.waContactCenter}</strong>, bayar QRIS, kode voucher langsung masuk.
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveKioskMode('WHATSAPP')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buka Chat Bot WhatsApp</span>
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {voucherPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  plan.popular ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  {plan.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded mb-2 inline-block">
                      Paling Populer
                    </span>
                  )}
                  <h3 className="font-bold text-base text-slate-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-xl font-extrabold text-sky-600">
                      Rp {plan.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Speed: <strong className="text-slate-800">{plan.speedMbps} Mbps</strong> · Durasi: {plan.durasiJam} Jam
                  </div>
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenPlan(plan)}
                  className="mt-5 w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Beli via DANA</span>
                </button>
              </div>
            ))}
          </div>

          {/* Recent Public Vouchers Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Riwayat Voucher Hotspot Aktif
              </h2>
              <span className="text-xs text-slate-500">
                Terhubung ke Access Point Ruijie Reyee Pos Kamling & Balai Warga
              </span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-2.5">Kode Voucher</th>
                    <th className="py-2.5">Password</th>
                    <th className="py-2.5">Paket</th>
                    <th className="py-2.5">Harga</th>
                    <th className="py-2.5">Saluran Beli</th>
                    <th className="py-2.5">Pembeli</th>
                    <th className="py-2.5 text-center">Status</th>
                    <th className="py-2.5 text-right">Kadaluarsa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {voucherList.map((vcr) => (
                    <tr key={vcr.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-sky-700">
                        {vcr.code}
                      </td>
                      <td className="py-3 font-mono text-slate-700">
                        {vcr.passwordHotspot}
                      </td>
                      <td className="py-3 font-medium text-slate-900">
                        {vcr.profileName}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        Rp {vcr.harga.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                          vcr.channel === 'WHATSAPP_BOT' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {vcr.channel === 'WHATSAPP_BOT' ? 'WhatsApp Bot' : 'Portal Web'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">
                        {vcr.buyerName || 'Tamu Warga'}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {vcr.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-500 text-[11px]">
                        {vcr.expiredAt || 'Belum diaktifkan'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Checkout Voucher QRIS DANA (Web Mode) */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 my-8">
            
            {/* DANA Header */}
            <div className="bg-[#118EEA] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white px-2 py-0.5 rounded text-[#118EEA] font-extrabold text-sm">
                  DANA
                </div>
                <div className="text-xs font-medium">Beli Voucher Hotspot QRIS</div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {purchasedVoucher ? (
                /* Success View with Voucher Card */
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Voucher Hotspot Berhasil Diterbitkan!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sambungkan ke WiFi <strong>ANUWANI_HOTSPOT_WARGA</strong> dan masukkan kode di bawah:
                    </p>
                  </div>

                  {/* Voucher Card Slip */}
                  <div className="p-4 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl space-y-3 text-left shadow-lg">
                    <div className="flex justify-between items-center text-xs text-sky-300">
                      <span>VOUCHER WI-FI RESMI</span>
                      <span>{selectedPlan.name}</span>
                    </div>

                    <div className="p-3 bg-white/10 backdrop-blur rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-300 uppercase">Username / Kode Voucher</div>
                      <div className="text-xl font-mono font-extrabold tracking-wider text-amber-300">
                        {purchasedVoucher.code}
                      </div>
                      <div className="text-[10px] text-slate-300 uppercase mt-2">Password Hotspot</div>
                      <div className="text-base font-mono font-bold text-white">
                        {purchasedVoucher.passwordHotspot}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Speed: Hingga {selectedPlan.speedMbps} Mbps</span>
                      <span>Durasi: {selectedPlan.durasiJam} Jam</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyVoucherCode(purchasedVoucher.code)}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-2.5 bg-[#118EEA] hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Checkout View */
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{selectedPlan.name}</div>
                      <div className="text-slate-500">Durasi {selectedPlan.durasiJam} Jam ({selectedPlan.speedMbps} Mbps)</div>
                    </div>
                    <div className="text-base font-extrabold text-[#118EEA]">
                      Rp {selectedPlan.harga.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pembeli (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Doni Saputra"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp (Untuk kirim kode voucher)
                    </label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                    />
                  </div>

                  {/* DANA QRIS Simulation Box */}
                  <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 text-center space-y-2">
                    <div className="w-32 h-32 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white">
                      <div className="w-full h-full bg-white p-1 rounded flex flex-col items-center justify-center">
                        <QrCode className="w-20 h-20 text-[#118EEA]" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Scan QRIS DANA di atas atau klik tombol konfirmasi di bawah
                    </div>
                  </div>

                  <button
                    onClick={handlePayVoucher}
                    disabled={isPaying}
                    className="w-full py-3 bg-[#118EEA] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
                  >
                    {isPaying ? (
                      <span>Memproses Pembayaran DANA...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Simulasikan Bayar Rp {selectedPlan.harga.toLocaleString('id-ID')} via DANA</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
