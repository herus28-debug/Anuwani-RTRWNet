import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pelanggan, PelangganStatus, KoneksiType } from '../types';
import { CustomerRuijieScriptModal } from './CustomerRuijieScriptModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Wifi,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  X,
  Lock,
  Unlock,
  ChevronRight,
  Terminal
} from 'lucide-react';

export const PelangganManagement: React.FC = () => {
  const {
    pelangganList,
    packages,
    aktivasiPelanggan,
    tambahPelanggan,
    manualIsolirRuijie,
    manualUnisolirRuijie,
    kirimWhatsAppNotif
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedCustomerForScript, setSelectedCustomerForScript] = useState<Pelanggan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    phone: '',
    email: '',
    alamat: '',
    rt: '03',
    rw: '05',
    odpCode: 'ODP-SKM-01/PORT-03',
    koneksiType: 'PPPoE' as KoneksiType,
    packageId: packages[1]?.id || 'pkg-2',
    ipAddress: '10.10.20.70',
    pppoeUser: '',
    pppoePassword: 'net' + Math.floor(1000 + Math.random() * 9000),
    ruijieDeviceMac: '20:4e:7f:' + Math.floor(10 + Math.random() * 89) + ':aa:bb',
    ruijieOntSN: 'RJEP2026' + Math.floor(100000 + Math.random() * 900000),
    dueDateDay: 10,
    autoIsolirEnabled: true,
  });

  const filteredPelanggan = pelangganList.filter(p => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomorPelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ipAddress.includes(searchQuery);

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && p.status === filterStatus;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.phone || !formData.nik) {
      alert('Mohon lengkapi Nama, NIK, dan No WhatsApp!');
      return;
    }

    const generatedPppoeUser = formData.pppoeUser || `net_${formData.nama.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    tambahPelanggan({
      ...formData,
      pppoeUser: generatedPppoeUser,
      status: 'pending',
    });

    setShowAddModal(false);
    alert(`Pendaftaran ${formData.nama} berhasil dimasukkan ke antrian aktivasi!`);
  };

  const handleActivate = async (id: string) => {
    setActionLoadingId(id);
    const res = aktivasiPelanggan(id);
    setActionLoadingId(null);
    alert(res.message);
  };

  const handleIsolir = async (id: string) => {
    const reason = prompt('Masukkan alasan isolir manual:', 'Keterlambatan pembayaran tagihan');
    if (!reason) return;
    setActionLoadingId(id);
    await manualIsolirRuijie(id, reason);
    setActionLoadingId(null);
  };

  const handleUnisolir = async (id: string) => {
    setActionLoadingId(id);
    await manualUnisolirRuijie(id);
    setActionLoadingId(null);
  };

  return (
    <div className="space-y-6">

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen & Aktivasi Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pengelolaan data warga, penetapan port ODP, integrasi Ruijie Reyee & kontrol isolir.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Filter */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({pelangganList.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'pending' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Aktivasi ({pelangganList.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'active' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktif ({pelangganList.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('isolated')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterStatus === 'isolated' ? 'bg-white text-rose-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Terisolir Ruijie ({pelangganList.filter(p => p.status === 'isolated').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, ID, IP, atau ODP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">No. Pelanggan</th>
                <th className="py-3 px-4">Nama & Kontak</th>
                <th className="py-3 px-4">Alamat & ODP</th>
                <th className="py-3 px-4">Paket & IP PPPoE</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-center">Status Ruijie</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPelanggan.map((p) => {
                const pkg = packages.find(pk => pk.id === p.packageId);
                const isLoading = actionLoadingId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      <div>{p.nomorPelanggan}</div>
                      <div className="text-[10px] text-slate-400">Reg: {p.registeredAt}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.nama}</div>
                      <div className="text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MessageSquare className="w-3 h-3 text-emerald-500" />
                        <span>{p.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[180px]">{p.alamat}</div>
                      <div className="text-[11px] font-medium text-sky-700">
                        {p.odpCode} · RT {p.rt}/RW {p.rw}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {pkg?.name} ({pkg?.speedMbps}M)
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        IP: {p.ipAddress} · <span className="text-slate-700">{p.pppoeUser}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>Tanggal {p.dueDateDay}</div>
                      <div className="text-[10px] text-slate-400">
                        Auto-Isolir: {p.autoIsolirEnabled ? 'Aktif' : 'Non-aktif'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'isolated' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status === 'active' ? '● NORMAL AKTIF' :
                         p.status === 'isolated' ? '● TERISOLIR' : '● MENUNGGU AKTIVASI'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedCustomerForScript(p)}
                          className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                          title="Lihat & Salin Script CLI Ruijie Reyee untuk Pelanggan Ini"
                        >
                          <Terminal className="w-3 h-3 text-sky-600" />
                          <span className="hidden sm:inline">Script</span>
                        </button>

                        {p.status === 'pending' ? (
                          <button
                            onClick={() => handleActivate(p.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
                          >
                            {isLoading ? 'Mengaktivasi...' : 'Aktivasi Akun'}
                          </button>
                        ) : p.status === 'active' ? (
                          <button
                            onClick={() => handleIsolir(p.id)}
                            disabled={isLoading}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                            title="Isolir koneksi pelanggan ke Ruijie Reyee Cloud"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Isolir</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnisolir(p.id)}
                            disabled={isLoading}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                            title="Buka status isolir pada Ruijie"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Buka Isolir</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pendaftaran Pelanggan Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Formulir Pasang Baru / Registrasi Pelanggan
                </h3>
                <p className="text-xs text-slate-500">
                  Data akan diverifikasi sebelum diaktivasi ke Ruijie Reyee Cloud
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Joko Widodo"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIK KTP *</label>
                  <input
                    type="text"
                    required
                    placeholder="320119..."
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="nama@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Rumah & No</label>
                <input
                  type="text"
                  placeholder="Jl. Dahlia No. 12"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RT</label>
                  <input
                    type="text"
                    value={formData.rt}
                    onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">RW</label>
                  <input
                    type="text"
                    value={formData.rw}
                    onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tgl Jatuh Tempo</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={formData.dueDateDay}
                    onChange={(e) => setFormData({ ...formData, dueDateDay: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Paket Internet Langganan</label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.speedMbps} Mbps) - Rp {p.priceMonthly.toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ODP Box & Port</label>
                  <input
                    type="text"
                    value={formData.odpCode}
                    onChange={(e) => setFormData({ ...formData, odpCode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div className="font-semibold text-slate-800">Konfigurasi Ruijie Reyee ONT / PPPoE</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">IP Address Pelanggan</label>
                    <input
                      type="text"
                      value={formData.ipAddress}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">Ruijie ONT Serial Number</label>
                    <input
                      type="text"
                      value={formData.ruijieOntSN}
                      onChange={(e) => setFormData({ ...formData, ruijieOntSN: e.target.value })}
                      className="w-full p-1.5 border border-slate-200 rounded bg-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Daftarkan Pelanggan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Script CLI Ruijie Pelanggan Khusus */}
      {selectedCustomerForScript && (
        <CustomerRuijieScriptModal
          customer={selectedCustomerForScript}
          pkg={packages.find(pk => pk.id === selectedCustomerForScript.packageId)}
          onClose={() => setSelectedCustomerForScript(null)}
        />
      )}

    </div>
  );
};
