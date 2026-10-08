import React from 'react';
import { useApp } from '../context/AppContext';
import { NearDueNotificationWidget } from './NearDueNotificationWidget';
import {
  Users,
  CheckCircle2,
  Wrench,
  Receipt,
  Server,
  Zap,
  ArrowRight,
  ShieldAlert,
  Clock
} from 'lucide-react';

interface DashboardAdminProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ setActiveTab }) => {
  const {
    pelangganList,
    tagihanList,
    ruijieDevices,
    tiketList,
    teknisiList,
    aktivasiPelanggan,
    manualUnisolirRuijie,
    bayarTagihanTunai
  } = useApp();

  const pendingPelanggan = pelangganList.filter(p => p.status === 'pending');
  const isolatedPelanggan = pelangganList.filter(p => p.status === 'isolated');
  const openTiket = tiketList.filter(t => t.status === 'OPEN');
  const unpaidBills = tagihanList.filter(t => t.status === 'unpaid');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Operasional & NOC (Administrator)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aktivasi pelanggan baru, pemantauan router Ruijie, kasir loket & koordinasi teknisi.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('pelanggan')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Manajemen Pelanggan
          </button>
        </div>
      </div>

      {/* Real-time Notification System: Pelanggan Mendekati Jatuh Tempo (H-3) */}
      <NearDueNotificationWidget onOpenBilling={() => setActiveTab('billing')} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Antrian Aktivasi Baru</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {pendingPelanggan.length} Pendaftar
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Menunggu verifikasi ODP & ONT Ruijie
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pelanggan Terisolir</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">
            {isolatedPelanggan.length} Pelanggan
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Auto-isolir aktif di router gateway
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tiket Gangguan Terbuka</span>
            <Wrench className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {openTiket.length} Laporan
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {teknisiList.filter(tk => tk.status === 'TERSEDIA').length} Teknisi standby
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Kesehatan Router Ruijie</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">
            100% ONLINE
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {ruijieDevices.length} Hardware Reyee Cloud terhubung
          </div>
        </div>

      </div>

      {/* Main Grid: Pending activations & Quick Cashier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Activations Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Antrian Pasang Baru (Perlu Aktivasi)
            </h2>
            <button
              onClick={() => setActiveTab('pelanggan')}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              Lihat Semua
            </button>
          </div>

          {pendingPelanggan.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada antrian aktivasi saat ini. Semua pelanggan sudah aktif.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingPelanggan.map(p => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{p.nama}</div>
                    <div className="text-[11px] text-slate-500">
                      {p.alamat} (RT {p.rt}) · ODP: <span className="font-semibold text-slate-700">{p.odpCode}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      SN ONT: {p.ruijieOntSN}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const res = aktivasiPelanggan(p.id);
                      alert(res.message);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    Aktivasi Akun
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unpaid Bills / Quick Cash Collector Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Kasir Pembayaran Tunai Cepat
            </h2>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-xs text-sky-600 hover:underline font-semibold"
            >
              Daftar Tagihan
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {unpaidBills.slice(0, 5).map(b => (
              <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{b.pelangganNama}</div>
                  <div className="text-slate-500 text-[11px]">{b.packageName} · {b.periode}</div>
                  <div className="font-bold text-slate-800">Rp {b.total.toLocaleString('id-ID')}</div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Konfirmasi pembayaran TUNAI untuk ${b.pelangganNama} (Rp ${b.total.toLocaleString('id-ID')})?`)) {
                      bayarTagihanTunai(b.id);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Terima Tunai
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
