import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  AlertTriangle,
  CreditCard,
  Receipt,
  Download,
  LifeBuoy,
  Gauge,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Play
} from 'lucide-react';

interface DashboardPelangganProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPelanggan: React.FC<DashboardPelangganProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    pelangganList,
    tagihanList,
    packages,
    setSelectedTagihanForPayment,
    setSelectedInvoiceForPrint
  } = useApp();

  // Find linked customer data
  const customerData = pelangganList.find(p => p.id === currentUser.pelangganId) || pelangganList[0];
  const pkg = packages.find(p => p.id === customerData.packageId);
  const myBills = tagihanList.filter(t => t.pelangganId === customerData.id);
  const currentUnpaidBill = myBills.find(t => t.status === 'unpaid' || t.status === 'isolated');
  const lastPaidBill = myBills.find(t => t.status === 'paid');

  // Interactive Speedtest Simulator state
  const [speedTesting, setSpeedTesting] = useState(false);
  const [speedResult, setSpeedResult] = useState<{ ping: number; download: number; upload: number } | null>(null);

  const runSpeedtest = () => {
    setSpeedTesting(true);
    setSpeedResult(null);

    setTimeout(() => {
      const maxSpeed = pkg ? pkg.speedMbps : 20;
      const download = Number((maxSpeed * (0.92 + Math.random() * 0.08)).toFixed(1));
      const upload = Number((maxSpeed * (0.85 + Math.random() * 0.12)).toFixed(1));
      const ping = Math.floor(4 + Math.random() * 6);
      setSpeedResult({ ping, download, upload });
      setSpeedTesting(false);
    }, 1800);
  };

  const isIsolated = customerData.status === 'isolated';

  return (
    <div className="space-y-6">

      {/* ISOLIR ALERT BANNER IF CUSTOMER IS ISOLATED */}
      {isIsolated && (
        <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl shadow-sm text-rose-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900">
                  Layanan Internet Anda Sedang Ditangguhkan (Auto-Isolir Ruijie)
                </h3>
                <p className="text-xs text-rose-700 mt-1 max-w-2xl leading-relaxed">
                  Koneksi internet Anda dialihkan sementara ke portal isolir karena tagihan bulan ini melewati tanggal jatuh tempo ({customerData.dueDateDay} Okt).
                  Lakukan pembayaran sekarang melalui <strong>DANA / QRIS</strong>, koneksi akan <strong>langsung aktif kembali dalam 2 detik</strong> tanpa perlu konfirmasi manual admin!
                </p>
              </div>
            </div>

            {currentUnpaidBill && (
              <button
                onClick={() => setSelectedTagihanForPayment(currentUnpaidBill)}
                className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Bayar Rp {currentUnpaidBill.total.toLocaleString('id-ID')} via DANA</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Welcome & Account Identity Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Halo, {customerData.nama}!
              </h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                customerData.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : customerData.status === 'isolated'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {customerData.status === 'active' ? '● KONEKSI NORMAL' :
                 customerData.status === 'isolated' ? '● TERISOLIR RUIJIE' : '● MENUNGGU AKTIVASI'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              No. Pelanggan: <span className="font-mono font-semibold text-slate-700">{customerData.nomorPelanggan}</span> · Alamat: {customerData.alamat} (RT {customerData.rt}/RW {customerData.rw})
            </p>
          </div>

          {/* Quick Pay CTA if has unpaid bill */}
          {currentUnpaidBill && !isIsolated && (
            <button
              onClick={() => setSelectedTagihanForPayment(currentUnpaidBill)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Bayar Tagihan Rp {currentUnpaidBill.total.toLocaleString('id-ID')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Paket Langganan Saya */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Paket Internet Aktif
            </div>
            <div className="text-xl font-bold text-slate-900">{pkg?.name}</div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-sky-600">{pkg?.speedMbps} Mbps</span>
              <span className="text-xs text-slate-500">Unlimited Kuota</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {pkg?.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>Biaya Langganan:</span>
            <span className="font-bold text-slate-900">Rp {pkg?.priceMonthly.toLocaleString('id-ID')}/bln</span>
          </div>
        </div>

        {/* Card 2: Status Perangkat Ruijie di Rumah */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Perangkat Router Ruijie
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isIsolated ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className="font-bold text-sm text-slate-900">
                {isIsolated ? 'Profile Isolir (64 Kbps)' : 'Ruijie Reyee ONT Online'}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>IP Address:</span>
                <span className="font-mono font-medium text-slate-800">{customerData.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>Akun PPPoE:</span>
                <span className="font-mono font-medium text-slate-800">{customerData.pppoeUser}</span>
              </div>
              <div className="flex justify-between">
                <span>ODP Port:</span>
                <span className="font-medium text-slate-800">{customerData.odpCode}</span>
              </div>
              <div className="flex justify-between">
                <span>SN Router:</span>
                <span className="font-mono text-slate-700">{customerData.ruijieOntSN}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pemakaian Bulan Ini:</span>
            <span className="font-bold text-slate-800">{customerData.bandwidthUsageGb} GB</span>
          </div>
        </div>

        {/* Card 3: Tagihan & Pembayaran */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Informasi Tagihan Berjalan
            </div>
            {currentUnpaidBill ? (
              <div>
                <div className="text-xs font-medium text-rose-600">
                  Tagihan Belum Lunas (Periode {currentUnpaidBill.periode})
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  Rp {currentUnpaidBill.total.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Jatuh Tempo: <span className="font-bold text-slate-700">{currentUnpaidBill.dueDate}</span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setSelectedTagihanForPayment(currentUnpaidBill)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Bayar via DANA / QRIS</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semua Tagihan Sudah Lunas!</span>
                </div>
                <p className="text-xs text-slate-500">
                  Terima kasih telah membayar tepat waktu. Tagihan berikutnya akan terbit pada tanggal 1 bulan depan.
                </p>
                {lastPaidBill && (
                  <button
                    onClick={() => setSelectedInvoiceForPrint(lastPaidBill)}
                    className="mt-2 text-xs text-sky-600 hover:underline flex items-center space-x-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Kwitansi Terakhir ({lastPaidBill.periode})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Metode Tersedia:</span>
            <span className="font-semibold text-slate-700">DANA QRIS & Saldo DANA</span>
          </div>
        </div>

      </div>

      {/* Speedtest Widget & Quick Helpdesk Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Interactive Speedtest Simulator to RT/RW Net Core NOC */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Uji Kecepatan Koneksi (Speedtest NOC)
              </h2>
            </div>
            <span className="text-[11px] text-slate-500">Server: Gateway NOC Sukamaju</span>
          </div>

          <div className="py-6 text-center">
            {speedResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[11px] text-slate-500">Latency (Ping)</div>
                    <div className="text-lg font-bold text-slate-900">{speedResult.ping} ms</div>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-xl">
                    <div className="text-[11px] text-sky-600">Unduh (Download)</div>
                    <div className="text-lg font-bold text-sky-700">{speedResult.download} Mbps</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <div className="text-[11px] text-emerald-600">Unggah (Upload)</div>
                    <div className="text-lg font-bold text-emerald-700">{speedResult.upload} Mbps</div>
                  </div>
                </div>

                <button
                  onClick={runSpeedtest}
                  disabled={speedTesting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors inline-flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Uji Ulang Kecepatan</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Periksa stabilitas bandwidth dari router Ruijie di rumah ke server gateway RT/RW Net.
                </p>
                <button
                  onClick={runSpeedtest}
                  disabled={speedTesting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow inline-flex items-center space-x-2 disabled:opacity-50"
                >
                  {speedTesting ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Mengukur Bandwidth Ruijie...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Mulai Tes Kecepatan</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customer Helpdesk & Ticket Quick Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <LifeBuoy className="w-5 h-5 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900">
                Pusat Bantuan & Lapor Gangguan
              </h2>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Mengalami kendala kabel putus (LOS Merah), wifi lambat, atau ingin request perubahan password Wi-Fi? Buka tiket komplain langsung agar teknisi segera meluncur ke lokasi.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setActiveTab('tiket')}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <LifeBuoy className="w-4 h-4 text-amber-400" />
                <span>Buka Tiket Laporan Gangguan</span>
              </button>

              <button
                onClick={() => setActiveTab('voucher')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Beli Voucher Wi-Fi untuk Tamu / Tetangga (QRIS DANA)</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Kontak WhatsApp NOC 24 Jam:</span>
            <span className="font-semibold text-emerald-600">0812-3456-7890</span>
          </div>
        </div>

      </div>

      {/* Bill History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Riwayat Tagihan Internet Saya
        </h2>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-2.5">Invoice</th>
                <th className="py-2.5">Periode</th>
                <th className="py-2.5">Jatuh Tempo</th>
                <th className="py-2.5">Total Tagihan</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-medium text-slate-700">
                    {bill.nomorInvoice}
                  </td>
                  <td className="py-3 font-semibold text-slate-900">
                    {bill.periode}
                  </td>
                  <td className="py-3 text-slate-600">
                    {bill.dueDate}
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    Rp {bill.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                      bill.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      bill.status === 'isolated' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bill.status === 'paid' ? 'LUNAS' :
                       bill.status === 'isolated' ? 'TERISOLIR' : 'BELUM BAYAR'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {bill.status === 'paid' ? (
                      <button
                        onClick={() => setSelectedInvoiceForPrint(bill)}
                        className="px-2.5 py-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded font-semibold text-xs inline-flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Kwitansi</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedTagihanForPayment(bill)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs inline-flex items-center space-x-1 shadow-sm"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Bayar DANA</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
