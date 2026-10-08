import React, { useState } from 'react';
import { useApp, getDaysUntilDue } from '../context/AppContext';
import { Tagihan } from '../types';
import {
  AlertTriangle,
  BellRing,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Users
} from 'lucide-react';

interface NearDueNotificationWidgetProps {
  onOpenBilling?: () => void;
}

export const NearDueNotificationWidget: React.FC<NearDueNotificationWidgetProps> = ({ onOpenBilling }) => {
  const {
    tagihanList,
    pelangganList,
    kirimPengingatJatuhTempoH3,
    kirimBroadcastPengingatH3,
    setSelectedTagihanForPayment,
    bayarTagihanTunai,
    settings
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);
  const [filterDay, setFilterDay] = useState<'ALL' | 'H0' | 'H1' | 'H2_H3'>('ALL');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter bills in H-3 window (unpaid, 0 <= getDaysUntilDue(dueDate) <= 3)
  const nearDueBills = tagihanList.filter(t => {
    if (t.status !== 'unpaid') return false;
    const days = getDaysUntilDue(t.dueDate);
    return days >= 0 && days <= 3;
  });

  // Filtered by sub-tab if chosen
  const displayedBills = nearDueBills.filter(t => {
    const days = getDaysUntilDue(t.dueDate);
    if (filterDay === 'H0') return days === 0;
    if (filterDay === 'H1') return days === 1;
    if (filterDay === 'H2_H3') return days === 2 || days === 3;
    return true;
  });

  const totalOutstanding = nearDueBills.reduce((acc, curr) => acc + curr.total, 0);
  const alreadyRemindedCount = nearDueBills.filter(t => (t.waReminderCount || 0) > 0).length;
  const notYetRemindedCount = nearDueBills.length - alreadyRemindedCount;

  // Single reminder send
  const handleSendReminder = async (t: Tagihan) => {
    setSendingId(t.id);
    setActionFeedback(null);
    try {
      const res = await kirimPengingatJatuhTempoH3(t.id);
      setActionFeedback(`✅ ${res.message}`);
      setTimeout(() => setActionFeedback(null), 4000);
    } catch {
      setActionFeedback('❌ Gagal mengirim pengingat WhatsApp');
    } finally {
      setSendingId(null);
    }
  };

  // Broadcast reminder to all
  const handleBroadcastAll = async () => {
    if (nearDueBills.length === 0) return;
    setIsBroadcasting(true);
    setActionFeedback(null);
    try {
      const res = await kirimBroadcastPengingatH3();
      setActionFeedback(`🚀 ${res.message}`);
      setTimeout(() => setActionFeedback(null), 5000);
    } catch {
      setActionFeedback('❌ Terjadi kendala saat mengirim broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // If there are no bills approaching due date, render a compact subtle all-clear indicator
  if (nearDueBills.length === 0) {
    return (
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-800 transition-all">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-950">Semua Tagihan Aman:</span>{' '}
            <span>Tidak ada pelanggan dalam jendela jatuh tempo H-3 yang belum membayar.</span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
          SLA 100%
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/5 border-2 border-amber-400/80 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
      
      {/* Top Banner Alert Bar */}
      <div className="p-4 sm:p-5 bg-amber-500/15 border-b border-amber-300/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs flex-shrink-0 animate-pulse">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-amber-950 tracking-tight">
                Notifikasi Sistem: {nearDueBills.length} Pelanggan Mendekati Jatuh Tempo (H-3)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-bounce">
                PERLU FOLLOW-UP
              </span>
            </div>
            <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
              Total piutang rawan terisolir: <strong className="font-mono text-amber-950">Rp {totalOutstanding.toLocaleString('id-ID')}</strong>. 
              Kirim pengingat WhatsApp lebih awal agar router Ruijie tidak terisolir otomatis di tengah malam.
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={handleBroadcastAll}
            disabled={isBroadcasting}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
            title="Kirim pesan pengingat WhatsApp resmi ke seluruh pelanggan di daftar H-3 sekaligus"
          >
            {isBroadcasting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isBroadcasting ? 'Mengirim WA...' : `Broadcast WA ke Semua (${nearDueBills.length})`}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-amber-200/80 hover:bg-amber-300/80 text-amber-900 rounded-xl transition-colors"
            title={isExpanded ? 'Sembunyikan Daftar' : 'Tampilkan Daftar'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Action Feedback Banner if exists */}
      {actionFeedback && (
        <div className="px-4 py-2.5 bg-slate-900 text-white text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-[11px] text-slate-400 hover:text-white"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Sub-Filters and Quick Summary Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/50">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-600 mr-1 hidden sm:inline">
                Filter Waktu:
              </span>
              <button
                onClick={() => setFilterDay('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterDay === 'ALL'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                Semua H-3 ({nearDueBills.length})
              </button>
              <button
                onClick={() => setFilterDay('H0')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterDay === 'H0'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                Hari Ini H-0 ({nearDueBills.filter(t => getDaysUntilDue(t.dueDate) === 0).length})
              </button>
              <button
                onClick={() => setFilterDay('H1')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterDay === 'H1'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                Besok H-1 ({nearDueBills.filter(t => getDaysUntilDue(t.dueDate) === 1).length})
              </button>
              <button
                onClick={() => setFilterDay('H2_H3')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterDay === 'H2_H3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                2 - 3 Hari Lagi ({nearDueBills.filter(t => {
                  const d = getDaysUntilDue(t.dueDate);
                  return d === 2 || d === 3;
                }).length})
              </button>
            </div>

            {/* Status Follow-up WhatsApp Summary */}
            <div className="flex items-center space-x-3 text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Diingatkan: <strong>{alreadyRemindedCount}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Belum: <strong>{notYetRemindedCount}</strong></span>
              </span>
            </div>
          </div>

          {/* List of Near-Due Customers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedBills.map((tagihan) => {
              const daysLeft = getDaysUntilDue(tagihan.dueDate);
              const pelanggan = pelangganList.find(p => p.id === tagihan.pelangganId);
              const isSendingThis = sendingId === tagihan.id;
              const hasBeenReminded = (tagihan.waReminderCount || 0) > 0;

              return (
                <div
                  key={tagihan.id}
                  className="bg-white rounded-xl border border-amber-300/80 p-3.5 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
                >
                  {/* Top Customer Info & Remaining Days Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {tagihan.pelangganNama}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {pelanggan?.nomorPelanggan || tagihan.nomorInvoice}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {tagihan.packageName} · {pelanggan?.odpCode || 'ODP RT/RW'}
                      </div>
                    </div>

                    {/* Sisa Hari Badge */}
                    <div className="flex-shrink-0">
                      {daysLeft === 0 ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          ⚠️ Jatuh Tempo Hari Ini!
                        </span>
                      ) : daysLeft === 1 ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          ⚡ Besok (H-1)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⏱️ {daysLeft} Hari Lagi (H-{daysLeft})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nominal and Due Date Info Card */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/70 text-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        Tagihan {tagihan.periode}
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        Rp {tagihan.total.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-semibold">Jatuh Tempo:</div>
                      <div className="font-mono text-slate-800 font-bold text-xs">
                        {tagihan.dueDate}
                      </div>
                    </div>
                  </div>

                  {/* Router Telemetry & Auto-Isolir Notice */}
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Router Ruijie: Aktif</span>
                    </span>
                    <span className="text-rose-700 font-semibold flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                      <span>Auto-Isolir 00:00</span>
                    </span>
                  </div>

                  {/* WhatsApp Reminder Status Log */}
                  <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400">Status Notifikasi:</span>
                    {hasBeenReminded ? (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Diingatkan ({tagihan.waReminderCount}x)</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        Belum Diingatkan
                      </span>
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Send WhatsApp 1-Click */}
                    <button
                      onClick={() => handleSendReminder(tagihan)}
                      disabled={isSendingThis}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                        hasBeenReminded
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                      title={`Kirim pesan pengingat tagihan H-3 ke nomor WhatsApp ${tagihan.pelangganPhone}`}
                    >
                      {isSendingThis ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>{hasBeenReminded ? 'Kirim Ulang WA' : 'Kirim WA H-3'}</span>
                    </button>

                    {/* Pay via DANA / Kasir */}
                    <button
                      onClick={() => setSelectedTagihanForPayment(tagihan)}
                      className="px-2.5 py-1.5 bg-[#118EEA] hover:bg-[#0c7acb] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                      title="Proses pembayaran via DANA QRIS atau kasir tunai"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bayar DANA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Footer */}
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Template pesan H-3 otomatis disesuaikan dari menu <strong>Konfigurasi WhatsApp Gateway</strong>.
              </span>
            </div>
            {onOpenBilling && (
              <button
                onClick={onOpenBilling}
                className="text-sky-700 font-bold hover:underline inline-flex items-center space-x-1 self-start sm:self-auto"
              >
                <span>Buka Modul Billing Lengkap</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
