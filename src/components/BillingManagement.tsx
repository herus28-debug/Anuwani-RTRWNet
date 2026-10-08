import React, { useState } from 'react';
import { useApp, getDaysUntilDue } from '../context/AppContext';
import { Tagihan, Transaksi } from '../types';
import { MonthlyFinancialReportModal } from './MonthlyFinancialReportModal';
import {
  Receipt,
  CreditCard,
  Zap,
  Download,
  Calendar,
  Send,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export const BillingManagement: React.FC = () => {
  const {
    tagihanList,
    transaksiList,
    currentUser,
    pelangganList,
    generateTagihanBulanBaru,
    bayarTagihanTunai,
    setSelectedTagihanForPayment,
    setSelectedInvoiceForPrint,
    kirimWhatsAppNotif
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'TAGIHAN' | 'TRANSAKSI'>('TAGIHAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
  const [newPeriode, setNewPeriode] = useState('November 2026');
  const [newDueDateDay, setNewDueDateDay] = useState(10);

  // Filter bills
  const filteredTagihan = tagihanList.filter(t => {
    const matchesSearch =
      t.pelangganNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nomorInvoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.periode.toLowerCase().includes(searchQuery.toLowerCase());

    if (currentUser.role === 'pelanggan' && t.pelangganId !== currentUser.pelangganId) {
      return false;
    }

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'near_due') {
      const days = getDaysUntilDue(t.dueDate);
      return matchesSearch && t.status === 'unpaid' && days >= 0 && days <= 3;
    }
    return matchesSearch && t.status === filterStatus;
  });

  // Filter transactions
  const filteredTransaksi = transaksiList.filter(trx => {
    return (
      trx.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.transaksiCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const count = generateTagihanBulanBaru(newPeriode, newDueDateDay);
    setShowGenerateModal(false);
    alert(`Berhasil membuat ${count} tagihan baru untuk periode ${newPeriode}! Notifikasi WhatsApp otomatis telah dikirimkan ke pelanggan.`);
  };

  const handleResendWA = (t: Tagihan) => {
    const msg = `*PENGINGAT TAGIHAN INTERNET anuwani*\n\nHalo *${t.pelangganNama}*,\nTagihan internet periode *${t.periode}* sebesar *Rp ${t.total.toLocaleString('id-ID')}* telah terbit.\nJatuh tempo: *${t.dueDate}*.\n\nBayar lebih praktis via DANA / QRIS di portal:\n👉 https://anuwani.rtrw.net/portal/bayar/${t.id}`;
    kirimWhatsAppNotif(t.pelangganPhone, t.pelangganNama, 'TAGIHAN_BULANAN', msg);
    alert(`Notifikasi tagihan WhatsApp berhasil dikirim ke ${t.pelangganNama} (${t.pelangganPhone})!`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring Tagihan & Transaksi Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Integrasi DANA Payment Gateway, verifikasi otomatis real-time & notifikasi WhatsApp.
          </p>
        </div>

        {currentUser.role !== 'pelanggan' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFinancialReportModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Unduh laporan keuangan bulanan lengkap dalam format PDF untuk arsip akuntansi"
            >
              <FileText className="w-4 h-4" />
              <span>Laporan Keuangan (PDF)</span>
            </button>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate Tagihan Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('TAGIHAN')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'TAGIHAN' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tagihan Bulanan ({tagihanList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('TRANSAKSI')}
            className={`px-4 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'TRANSAKSI' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Transaksi Real-time ({transaksiList.length})
          </button>
        </div>

        {activeSubTab === 'TAGIHAN' && (
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="near_due">⚠️ Mendekati Jatuh Tempo (H-3)</option>
              <option value="unpaid">Belum Bayar</option>
              <option value="paid">Lunas</option>
              <option value="isolated">Terisolir Ruijie</option>
            </select>

            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari invoice atau pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'TAGIHAN' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-4">Pelanggan & Paket</th>
                  <th className="py-3 px-4">Periode & Jatuh Tempo</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Info Pembayaran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTagihan.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      <div>{t.nomorInvoice}</div>
                      <div className="text-[10px] text-slate-400">ID: {t.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{t.pelangganNama}</div>
                      <div className="text-[11px] text-slate-500">{t.packageName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{t.periode}</div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 flex-wrap">
                        <span>Tenggat: {t.dueDate}</span>
                        {t.status === 'unpaid' && (() => {
                          const days = getDaysUntilDue(t.dueDate);
                          if (days === 0) return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 animate-pulse border border-rose-300">Hari ini!</span>;
                          if (days === 1) return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-300">Besok (H-1)</span>;
                          if (days === 2 || days === 3) return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-300">H-{days}</span>;
                          return null;
                        })()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      <div>Rp {t.total.toLocaleString('id-ID')}</div>
                      {t.denda > 0 && (
                        <div className="text-[10px] text-rose-600 font-normal">+ Denda Rp {t.denda.toLocaleString('id-ID')}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'isolated' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status === 'paid' ? 'LUNAS' :
                         t.status === 'isolated' ? 'TERISOLIR' : 'BELUM BAYAR'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {t.status === 'paid' ? (
                        <div>
                          <div className="font-semibold text-slate-800">
                            {t.paymentMethod === 'DANA_QRIS' ? 'DANA QRIS (Otomatis)' :
                             t.paymentMethod === 'DANA_WALLET' ? 'DANA E-Wallet' : 'Tunai Kasir'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{t.paidAt}</div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">
                          Menunggu transfer / QRIS DANA
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {t.status === 'paid' ? (
                          <button
                            onClick={() => setSelectedInvoiceForPrint(t)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Kwitansi</span>
                          </button>
                        ) : (
                          <>
                            {/* DANA Gateway Button */}
                            <button
                              onClick={() => setSelectedTagihanForPayment(t)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1 shadow-sm"
                              title="Bayar via Gateway DANA (QRIS / Saldo) - Auto Un-Isolir Ruijie"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>Bayar DANA</span>
                            </button>

                            {/* Kasir Manual Button (Admin/Superadmin only) */}
                            {currentUser.role !== 'pelanggan' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Konfirmasi pembayaran TUNAI kasir untuk ${t.pelangganNama} sebesar Rp ${t.total.toLocaleString('id-ID')}?`)) {
                                    bayarTagihanTunai(t.id);
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                                title="Terima uang tunai di posko/kasir"
                              >
                                Kasir
                              </button>
                            )}

                            {/* Send WA reminder */}
                            {currentUser.role !== 'pelanggan' && (
                              <button
                                onClick={() => handleResendWA(t)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Kirim Ulang Notifikasi WA Tagihan"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Real-Time Financial Transactions Tab */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Ref Transaksi</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Tipe Transaksi</th>
                  <th className="py-3 px-4">Gateway / Metode</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-right">Fee DANA (0.7%)</th>
                  <th className="py-3 px-4 text-right">Net Masuk Kas</th>
                  <th className="py-3 px-4 text-center">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransaksi.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {trx.transaksiCode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {trx.waktu}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {trx.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {trx.tipe === 'TAGIHAN_BULANAN' ? 'Tagihan Internet' : 'Voucher Hotspot Ruijie'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {trx.method === 'DANA_QRIS' ? 'DANA QRIS Dinamis' :
                       trx.method === 'DANA_WALLET' ? 'DANA E-Wallet' : 'Tunai Kasir'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      Rp {trx.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-600 font-mono">
                      - Rp {trx.feeGateway.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-700 font-bold font-mono">
                      Rp {trx.netRevenue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Generate Tagihan Bulanan Otomatis */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Generate Tagihan Bulanan Otomatis
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-4 text-xs">
              <p className="text-slate-500 leading-relaxed">
                Sistem akan membuat tagihan massal untuk seluruh pelanggan aktif, menetapkan tenggat jatuh tempo, dan mengirimkan notifikasi tagihan WhatsApp otomatis.
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Periode Tagihan</label>
                <input
                  type="text"
                  required
                  value={newPeriode}
                  onChange={(e) => setNewPeriode(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Contoh: November 2026"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Default Tanggal Jatuh Tempo (Tenggat)</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={newDueDateDay}
                  onChange={(e) => setNewDueDateDay(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400">Pelanggan yang telat bayar setelah tanggal ini akan terkena auto-isolir Ruijie.</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Proses & Kirim WA Massal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monthly Financial Report PDF Modal */}
      <MonthlyFinancialReportModal
        isOpen={showFinancialReportModal}
        onClose={() => setShowFinancialReportModal(false)}
      />

    </div>
  );
};
