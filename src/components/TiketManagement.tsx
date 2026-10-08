import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tiket, TiketKategori, TiketStatus, TiketPesan } from '../types';
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Wrench,
  Search,
  Filter,
  X
} from 'lucide-react';

export const TiketManagement: React.FC = () => {
  const {
    tiketList,
    currentUser,
    pelangganList,
    teknisiList,
    tambahTiket,
    kirimPesanTiket,
    updateStatusTiket
  } = useApp();

  const [selectedTiketId, setSelectedTiketId] = useState<string>(tiketList[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New ticket state
  const [kategori, setKategori] = useState<TiketKategori>('LOS_MERAH');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [prioritas, setPrioritas] = useState<Tiket['prioritas']>('HIGH');
  const [targetPelangganId, setTargetPelangganId] = useState(pelangganList[0]?.id || '');

  // Filter tickets for current user role
  const displayTickets = tiketList.filter(t => {
    if (currentUser.role === 'pelanggan') {
      return t.pelangganId === currentUser.pelangganId;
    }
    return true;
  });

  const activeTiket = tiketList.find(t => t.id === selectedTiketId) || displayTickets[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTiket) return;
    kirimPesanTiket(activeTiket.id, chatInput.trim());
    setChatInput('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim()) {
      alert('Mohon isi judul dan rincian keluhan');
      return;
    }

    const newTkt = tambahTiket(
      kategori,
      judul,
      deskripsi,
      prioritas,
      currentUser.role === 'pelanggan' ? currentUser.pelangganId : targetPelangganId
    );

    setSelectedTiketId(newTkt.id);
    setShowCreateModal(false);
    setJudul('');
    setDeskripsi('');
    alert(`Tiket keluhan ${newTkt.tiketCode} berhasil dibuat! Tim teknisi akan segera merespons.`);
  };

  const handleStatusChange = (newStatus: TiketStatus, tekId?: string) => {
    if (!activeTiket) return;
    updateStatusTiket(activeTiket.id, newStatus, tekId);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sistem Tiket Keluhan & Layanan Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Interaksi dua arah real-time, penugasan teknisi lapangan, dan update status gangguan.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Tiket Keluhan Baru</span>
        </button>
      </div>

      {/* 2-Column Split: Ticket List (Left) & Interactive Chat/Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">

        {/* Ticket List (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Daftar Keluhan ({displayTickets.length})
            </span>
            <span className="text-[11px] text-slate-500">
              {currentUser.role === 'pelanggan' ? 'Tiket Saya' : 'Semua Laporan Warga'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[550px]">
            {displayTickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Belum ada tiket keluhan yang dibuat.
              </div>
            ) : (
              displayTickets.map((t) => {
                const isSelected = activeTiket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTiketId(t.id)}
                    className={`w-full text-left p-4 transition-colors flex flex-col space-y-1.5 ${
                      isSelected ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{t.tiketCode}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-800' :
                        t.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-slate-900 truncate">
                      {t.judul}
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      {t.pelangganNama} · <span className="text-rose-600 font-medium">{t.kategori}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>{t.pesanList.length} Pesan</span>
                      <span>{t.updatedAt}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Interactive Chat & Action Details (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm">
          {activeTiket ? (
            <>
              {/* Ticket Top Bar */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-sky-600">{activeTiket.tiketCode}</span>
                      <span className="text-xs font-bold text-slate-900">{activeTiket.judul}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Pelanggan: <strong className="text-slate-700">{activeTiket.pelangganNama}</strong> ({activeTiket.pelangganPhone}) · Alamat: {activeTiket.alamat}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeTiket.prioritas === 'URGENT' ? 'bg-rose-100 text-rose-800' :
                    activeTiket.prioritas === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {activeTiket.prioritas}
                  </span>
                </div>

                {/* Status & Technician Control for Admin/Superadmin */}
                {currentUser.role !== 'pelanggan' && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-500 font-semibold">Tugaskan Teknisi:</span>
                    <select
                      value={activeTiket.assignedTeknisiId || ''}
                      onChange={(e) => handleStatusChange('IN_PROGRESS', e.target.value)}
                      className="p-1 border border-slate-200 rounded-lg bg-white text-xs"
                    >
                      <option value="">Pilih Teknisi...</option>
                      {teknisiList.map(tk => (
                        <option key={tk.id} value={tk.id}>
                          {tk.nama} ({tk.status})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center space-x-1.5 ml-auto">
                      <button
                        onClick={() => handleStatusChange('IN_PROGRESS')}
                        className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold"
                      >
                        Diproses
                      </button>
                      <button
                        onClick={() => handleStatusChange('RESOLVED')}
                        className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-xs font-bold"
                      >
                        Tandai Selesai
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Thread */}
              <div className="p-4 space-y-3 overflow-y-auto flex-1 max-h-[380px] bg-slate-50/30">
                {activeTiket.pesanList.map((m) => {
                  const isMe = m.senderRole === currentUser.role;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                        {m.senderName} ({m.senderRole}) · {m.timestamp}
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-sky-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {m.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ketik pesan atau update untuk pelanggan/teknisi..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Pilih tiket di sebelah kiri untuk melihat rincian percakapan.
            </div>
          )}
        </div>

      </div>

      {/* Modal Buat Tiket Keluhan Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Buka Tiket Laporan Gangguan Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              
              {currentUser.role !== 'pelanggan' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pilih Pelanggan</label>
                  <select
                    value={targetPelangganId}
                    onChange={(e) => setTargetPelangganId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {pelangganList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.nomorPelanggan} - RT {p.rt})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Gangguan</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as TiketKategori)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="LOS_MERAH">LOS Merah (Kabel FO Putus)</option>
                    <option value="KONEKSI_LAMBAT">Koneksi Lambat / Lemot</option>
                    <option value="ROUTER_MATI">Router Ruijie Mati Total</option>
                    <option value="GANTI_PASSWORD">Permintaan Ganti Password Wi-Fi</option>
                    <option value="PASANG_BARU">Instalasi Pasang Baru</option>
                    <option value="LAINNYA">Kendala Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tingkat Prioritas</label>
                  <select
                    value={prioritas}
                    onChange={(e) => setPrioritas(e.target.value as Tiket['prioritas'])}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="LOW">Rendah (Low)</option>
                    <option value="MEDIUM">Sedang (Medium)</option>
                    <option value="HIGH">Tinggi (High)</option>
                    <option value="URGENT">Mendesak (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Keluhan Singkat *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lampu indikator modem Ruijie warna merah kedip"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan sejak kapan kendala terjadi dan kondisi lampu indikator router..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Kirim Tiket Keluhan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
