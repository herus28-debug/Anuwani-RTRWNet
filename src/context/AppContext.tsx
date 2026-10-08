import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Pelanggan,
  Tagihan,
  Transaksi,
  RuijieDevice,
  RuijieIsolirLog,
  Teknisi,
  Tiket,
  HotspotVoucher,
  WhatsAppLog,
  SystemSettings,
  InternetPackage
} from '../types';
import {
  initialUsers,
  initialPackages,
  initialPelanggan,
  initialTagihan,
  initialTransaksi,
  initialRuijieDevices,
  initialRuijieIsolirLogs,
  initialTeknisi,
  initialTiket,
  initialVouchers,
  initialWhatsAppLogs,
  initialSettings
} from '../data/initialData';

// Sisa hari menuju tanggal jatuh tempo (0 = hari ini, 1 = besok, 2 = lusa, 3 = H-3, <0 = lewat jatuh tempo)
export const getDaysUntilDue = (dueDateStr: string): number => {
  if (!dueDateStr) return 999;
  const parts = dueDateStr.split('-');
  if (parts.length < 3) return 999;

  const dueYear = parseInt(parts[0], 10);
  const dueMonth = parseInt(parts[1], 10) - 1;
  const dueDay = parseInt(parts[2], 10);

  const dueDate = new Date(dueYear, dueMonth, dueDay);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = dueDate.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  switchUserRole: (role: UserRole, targetPelangganId?: string) => void;
  allUsers: User[];
  packages: InternetPackage[];
  pelangganList: Pelanggan[];
  tagihanList: Tagihan[];
  transaksiList: Transaksi[];
  ruijieDevices: RuijieDevice[];
  ruijieLogs: RuijieIsolirLog[];
  teknisiList: Teknisi[];
  tiketList: Tiket[];
  voucherList: HotspotVoucher[];
  whatsAppLogs: WhatsAppLog[];
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Actions
  aktivasiPelanggan: (pelangganId: string) => { success: boolean; message: string };
  tambahPelanggan: (data: Omit<Pelanggan, 'id' | 'nomorPelanggan' | 'registeredAt' | 'bandwidthUsageGb'>) => Pelanggan;
  manualIsolirRuijie: (pelangganId: string, reason?: string) => Promise<boolean>;
  manualUnisolirRuijie: (pelangganId: string) => Promise<boolean>;
  bayarTagihanDana: (tagihanId: string, paymentMethod: 'DANA_QRIS' | 'DANA_WALLET') => Promise<{ success: boolean; txId: string }>;
  bayarTagihanTunai: (tagihanId: string) => void;
  generateTagihanBulanBaru: (periode: string, dueDateDay: number) => number;
  beliVoucherHotspot: (profileName: string, harga: number, durasiJam: number, speedMbps: number, buyerName: string, buyerPhone: string, channel?: 'WHATSAPP_BOT' | 'PORTAL_WEB') => Promise<HotspotVoucher>;
  beliVoucherViaWhatsAppBot: (phone: string, buyerName: string, durasiJam: number, harga: number, profileName: string, speedMbps: number) => Promise<HotspotVoucher>;
  tambahTiket: (kategori: Tiket['kategori'], judul: string, deskripsi: string, prioritas: Tiket['prioritas'], pelangganId?: string) => Tiket;
  kirimPesanTiket: (tiketId: string, message: string) => void;
  updateStatusTiket: (tiketId: string, status: Tiket['status'], assignedTeknisiId?: string) => void;
  kirimWhatsAppNotif: (phone: string, name: string, type: WhatsAppLog['type'], message: string) => void;
  syncRuijieCloud: () => Promise<void>;
  kirimPengingatJatuhTempoH3: (tagihanId: string) => Promise<{ success: boolean; message: string }>;
  kirimBroadcastPengingatH3: () => Promise<{ sentCount: number; message: string }>;
  
  // UI states
  selectedTagihanForPayment: Tagihan | null;
  setSelectedTagihanForPayment: (tagihan: Tagihan | null) => void;
  selectedInvoiceForPrint: Tagihan | null;
  setSelectedInvoiceForPrint: (tagihan: Tagihan | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'rtrw_net_os_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    return saved ? JSON.parse(saved) : initialUsers[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auth');
    return saved ? JSON.parse(saved) : true;
  });

  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      // Check customer email
      const cust = pelangganList.find(p => p.email.toLowerCase() === cleanEmail);
      if (cust) {
        const custUser: User = {
          id: `usr-${cust.id}`,
          name: cust.nama,
          email: cust.email,
          role: 'pelanggan',
          phone: cust.phone,
          pelangganId: cust.id,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        };
        setCurrentUser(custUser);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'auth', 'true');
        return { success: true, message: `Selamat datang, ${cust.nama}!` };
      }
      return { success: false, message: 'Email tidak terdaftar pada sistem RT/RW Net.' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth', 'true');
    return { success: true, message: `Login berhasil sebagai ${user.name} (${user.role})` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth', 'false');
  };

  const [pelangganList, setPelangganList] = useState<Pelanggan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'pelanggan');
    return saved ? JSON.parse(saved) : initialPelanggan;
  });

  const [tagihanList, setTagihanList] = useState<Tagihan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tagihan');
    return saved ? JSON.parse(saved) : initialTagihan;
  });

  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'transaksi');
    return saved ? JSON.parse(saved) : initialTransaksi;
  });

  const [ruijieDevices, setRuijieDevices] = useState<RuijieDevice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'ruijie');
    return saved ? JSON.parse(saved) : initialRuijieDevices;
  });

  const [ruijieLogs, setRuijieLogs] = useState<RuijieIsolirLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'ruijie_logs');
    return saved ? JSON.parse(saved) : initialRuijieIsolirLogs;
  });

  const [teknisiList, setTeknisiList] = useState<Teknisi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'teknisi');
    return saved ? JSON.parse(saved) : initialTeknisi;
  });

  const [tiketList, setTiketList] = useState<Tiket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tiket');
    return saved ? JSON.parse(saved) : initialTiket;
  });

  const [voucherList, setVoucherList] = useState<HotspotVoucher[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'vouchers');
    return saved ? JSON.parse(saved) : initialVouchers;
  });

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'wa_logs');
    return saved ? JSON.parse(saved) : initialWhatsAppLogs;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
    if (!saved) return initialSettings;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...initialSettings,
        ...parsed,
        waFeatures: {
          ...initialSettings.waFeatures,
          ...(parsed?.waFeatures || {})
        },
        waTemplates: {
          ...initialSettings.waTemplates,
          ...(parsed?.waTemplates || {})
        }
      };
    } catch {
      return initialSettings;
    }
  });

  const [selectedTagihanForPayment, setSelectedTagihanForPayment] = useState<Tagihan | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Tagihan | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'pelanggan', JSON.stringify(pelangganList));
  }, [pelangganList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tagihan', JSON.stringify(tagihanList));
  }, [tagihanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'transaksi', JSON.stringify(transaksiList));
  }, [transaksiList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'ruijie_logs', JSON.stringify(ruijieLogs));
  }, [ruijieLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tiket', JSON.stringify(tiketList));
  }, [tiketList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'vouchers', JSON.stringify(voucherList));
  }, [voucherList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'wa_logs', JSON.stringify(whatsAppLogs));
  }, [whatsAppLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  // Helper Switch role
  const switchUserRole = (role: UserRole, targetPelangganId?: string) => {
    if (role === 'superadmin') {
      setCurrentUser(initialUsers[0]);
    } else if (role === 'administrator') {
      setCurrentUser(initialUsers[1]);
    } else {
      // Find customer
      const targetId = targetPelangganId || 'cust-1';
      const cust = pelangganList.find(p => p.id === targetId) || pelangganList[0];
      const existingUser = initialUsers.find(u => u.pelangganId === targetId);
      if (existingUser) {
        setCurrentUser(existingUser);
      } else {
        setCurrentUser({
          id: `usr-${cust.id}`,
          name: cust.nama,
          email: cust.email,
          role: 'pelanggan',
          phone: cust.phone,
          pelangganId: cust.id,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        });
      }
    }
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      waFeatures: {
        ...(prev?.waFeatures || initialSettings.waFeatures),
        ...(newSettings.waFeatures || {})
      },
      waTemplates: {
        ...(prev?.waTemplates || initialSettings.waTemplates),
        ...(newSettings.waTemplates || {})
      }
    }));
  };

  // Kirim WhatsApp helper
  const kirimWhatsAppNotif = (phone: string, name: string, type: WhatsAppLog['type'], message: string) => {
    const newLog: WhatsAppLog = {
      id: `wa-${Date.now()}`,
      recipientPhone: phone,
      recipientName: name,
      type,
      message,
      status: 'DELIVERED',
      timestamp: new Date().toLocaleString('id-ID'),
      gatewayResponseId: `${settings.waGatewayProvider}-MSG-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setWhatsAppLogs(prev => [newLog, ...prev]);
  };

  // Aktivasi akun pelanggan baru
  const aktivasiPelanggan = (pelangganId: string) => {
    const cust = pelangganList.find(p => p.id === pelangganId);
    if (!cust) return { success: false, message: 'Pelanggan tidak ditemukan' };

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const pkg = initialPackages.find(p => p.id === cust.packageId);

    // 1. Update Pelanggan status
    setPelangganList(prev => prev.map(p => {
      if (p.id === pelangganId) {
        return {
          ...p,
          status: 'active',
          activatedAt: formattedDate,
        };
      }
      return p;
    }));

    // 2. Ruijie Cloud Sync Log
    const newRuijieLog: RuijieIsolirLog = {
      id: `iso-${Date.now()}`,
      pelangganId: cust.id,
      pelangganNama: cust.nama,
      ipAddress: cust.ipAddress,
      action: 'UNISOLIR',
      reason: 'Aktivasi Baru: Pendaftaran PPPoE & Binding ODP Port',
      executedBy: 'MANUAL_ADMIN',
      ruijieStatus: 'SUCCESS',
      responseTimeMs: 110,
      timestamp: now.toLocaleString('id-ID'),
    };
    setRuijieLogs(prev => [newRuijieLog, ...prev]);

    // 3. WhatsApp Notification to customer
    const waMsg = `*SELAMAT! KONEKSI INTERNET anuwani ANDA TELAH AKTIF*\n\nHalo *${cust.nama}*,\nRegistrasi dan pemasangan internet RT/RW Net Anda telah disetujui & diaktivasi oleh Admin.\n\nDetail Akun Pelanggan:\n- No. Pelanggan : *${cust.nomorPelanggan}*\n- Paket : *${pkg?.name || 'Paket Internet'}*\n- IP Address : *${cust.ipAddress}*\n- Akun PPPoE : *${cust.pppoeUser}*\n- ODP Port : *${cust.odpCode}*\n- Jatuh Tempo : Tiap tanggal ${cust.dueDateDay}\n\nLogin Portal Pelanggan:\nUsername: ${cust.email}\nPassword: user123\nPortal: https://anuwani.rtrw.net/portal\n\nUntuk bantuan teknis & pertanyaan hubungi WhatsApp NOC: ${settings.waContactCenter}.\nTerima kasih!`;
    kirimWhatsAppNotif(cust.phone, cust.nama, 'INFO_UNISOLIR', waMsg);

    return { success: true, message: `Pelanggan ${cust.nama} berhasil diaktivasi dan disinkronkan ke Ruijie Reyee Cloud!` };
  };

  // Tambah pelanggan baru
  const tambahPelanggan = (data: Omit<Pelanggan, 'id' | 'nomorPelanggan' | 'registeredAt' | 'bandwidthUsageGb'>) => {
    const count = pelangganList.length + 1;
    const nomorPelanggan = `NET-2026-${String(count).padStart(3, '0')}`;
    const newId = `cust-${Date.now()}`;
    const newPelanggan: Pelanggan = {
      ...data,
      id: newId,
      nomorPelanggan,
      registeredAt: new Date().toISOString().split('T')[0],
      bandwidthUsageGb: 0,
      status: 'pending',
    };

    setPelangganList(prev => [newPelanggan, ...prev]);

    // Kirim WA sambutan pendaftaran
    const msg = `*PENDAFTARAN PASANG BARU INTERNET DITERIMA*\n\nHalo *${data.nama}*,\nTerima kasih telah mendaftar layanan ${settings.ispName}.\nNomor Antrian: *${nomorPelanggan}*.\nPetugas kami akan melakukan verifikasi ODP dan instalasi router Ruijie di lokasi Anda segera.`;
    kirimWhatsAppNotif(data.phone, data.nama, 'TIKET_UPDATE', msg);

    return newPelanggan;
  };

  // Manual Isolir Ruijie
  const manualIsolirRuijie = async (pelangganId: string, reason = 'Isolir Manual oleh Administrator'): Promise<boolean> => {
    const cust = pelangganList.find(p => p.id === pelangganId);
    if (!cust) return false;

    // Simulate fast API round-trip to Ruijie Reyee Cloud
    await new Promise(res => setTimeout(res, 220));

    setPelangganList(prev => prev.map(p => {
      if (p.id === pelangganId) {
        return {
          ...p,
          status: 'isolated',
          lastIsolatedAt: new Date().toLocaleString('id-ID'),
        };
      }
      return p;
    }));

    // Update associated unpaid bills
    setTagihanList(prev => prev.map(t => {
      if (t.pelangganId === pelangganId && t.status === 'unpaid') {
        return { ...t, status: 'isolated' };
      }
      return t;
    }));

    // Log Ruijie command
    const newLog: RuijieIsolirLog = {
      id: `iso-${Date.now()}`,
      pelangganId: cust.id,
      pelangganNama: cust.nama,
      ipAddress: `${cust.ipAddress} -> 10.254.0.0/24 (ISOLIR POOL)`,
      action: 'ISOLIR',
      reason,
      executedBy: 'MANUAL_ADMIN',
      ruijieStatus: 'SUCCESS',
      responseTimeMs: 145,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    setRuijieLogs(prev => [newLog, ...prev]);

    // Kirim notifikasi WA
    const msg = `*PEMBERITAHUAN ISOLIR SEMENTARA KONEKSI INTERNET*\n\nYth. *${cust.nama}*,\nKoneksi internet Anda dialihkan ke portal isolir sementara.\nAlasan: ${reason}.\nSilakan hubungi WhatsApp kami atau bayar tagihan Anda agar koneksi otomatis aktif kembali.`;
    kirimWhatsAppNotif(cust.phone, cust.nama, 'PERINGATAN_ISOLIR', msg);

    return true;
  };

  // Manual Un-isolir Ruijie
  const manualUnisolirRuijie = async (pelangganId: string): Promise<boolean> => {
    const cust = pelangganList.find(p => p.id === pelangganId);
    if (!cust) return false;

    await new Promise(res => setTimeout(res, 180));

    setPelangganList(prev => prev.map(p => {
      if (p.id === pelangganId) {
        return {
          ...p,
          status: 'active',
          lastPaymentAt: new Date().toLocaleString('id-ID'),
        };
      }
      return p;
    }));

    const newLog: RuijieIsolirLog = {
      id: `iso-${Date.now()}`,
      pelangganId: cust.id,
      pelangganNama: cust.nama,
      ipAddress: `10.254.0.0/24 -> ${cust.ipAddress} (RESTORED)`,
      action: 'UNISOLIR',
      reason: 'Pemulihan Manual / Pembayaran Diterima Admin',
      executedBy: 'MANUAL_ADMIN',
      ruijieStatus: 'SUCCESS',
      responseTimeMs: 94,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    setRuijieLogs(prev => [newLog, ...prev]);

    const msg = `*PEMBERITAHUAN: LAYANAN INTERNET ANDA TELAH AKTIF KEMBALI*\n\nHalo *${cust.nama}*,\nStatus isolir telah dicabut pada router Ruijie. Kecepatan dan koneksi internet Anda telah normal kembali.\nSelamat beraktivitas!`;
    kirimWhatsAppNotif(cust.phone, cust.nama, 'INFO_UNISOLIR', msg);

    return true;
  };

  // Bayar Tagihan via DANA (QRIS / Wallet) -> Webhook Instant Auto-Unisolir Ruijie
  const bayarTagihanDana = async (tagihanId: string, paymentMethod: 'DANA_QRIS' | 'DANA_WALLET'): Promise<{ success: boolean; txId: string }> => {
    const tagihan = tagihanList.find(t => t.id === tagihanId);
    if (!tagihan) return { success: false, txId: '' };

    const txId = `DANA-TX-${Date.now()}`;
    const waktu = new Date().toLocaleString('id-ID');

    // 1. Update Tagihan ke Paid
    setTagihanList(prev => prev.map(t => {
      if (t.id === tagihanId) {
        return {
          ...t,
          status: 'paid',
          paidAt: waktu,
          paymentMethod,
          danaTransactionId: txId,
          waReceiptSent: true,
        };
      }
      return t;
    }));

    // 2. Tambah Catatan Transaksi Real-time
    const feeGateway = paymentMethod === 'DANA_QRIS' ? Math.round(tagihan.total * 0.007) : 2000;
    const newTrx: Transaksi = {
      id: `tx-${Date.now()}`,
      transaksiCode: `TRX-${txId}`,
      invoiceId: tagihan.id,
      tipe: 'TAGIHAN_BULANAN',
      customerName: tagihan.pelangganNama,
      customerPhone: tagihan.pelangganPhone,
      nominal: tagihan.total,
      feeGateway,
      netRevenue: tagihan.total - feeGateway,
      method: paymentMethod,
      danaReferenceId: txId,
      waktu,
      status: 'SETTLED',
    };
    setTransaksiList(prev => [newTrx, ...prev]);

    // 3. SINKRONISASI AUTO UN-ISOLIR RUIJIE REYEE SECARA INSTAN!
    const cust = pelangganList.find(p => p.id === tagihan.pelangganId);
    if (cust && cust.status === 'isolated') {
      // Un-isolate instantly!
      setPelangganList(prev => prev.map(p => {
        if (p.id === cust.id) {
          return {
            ...p,
            status: 'active',
            lastPaymentAt: waktu,
          };
        }
        return p;
      }));

      const newLog: RuijieIsolirLog = {
        id: `iso-${Date.now()}`,
        pelangganId: cust.id,
        pelangganNama: cust.nama,
        ipAddress: `10.254.0.0/24 -> ${cust.ipAddress}`,
        action: 'UNISOLIR',
        reason: 'Auto-Unisolir Real-time: Pembayaran DANA Terverifikasi Otomatis',
        executedBy: 'DANA_WEBHOOK_INSTANT',
        ruijieStatus: 'SUCCESS',
        responseTimeMs: 82, // Instant Ruijie API response
        timestamp: waktu,
      };
      setRuijieLogs(prev => [newLog, ...prev]);
    }

    // 4. Kirim WhatsApp Kwitansi Otomatis
    const receiptMsg = `*KWITANSI PEMBAYARAN INTERNET LUNAS (anuwani)*\n\nTerima kasih *${tagihan.pelangganNama}*,\nPembayaran tagihan internet periode *${tagihan.periode}* telah BERHASIL diverifikasi secara otomatis melalui DANA.\n\nDetail Transaksi:\n- No Invoice : *${tagihan.nomorInvoice}*\n- Ref DANA : *${txId}*\n- Paket : *${tagihan.packageName}*\n- Total Bayar : *Rp ${tagihan.total.toLocaleString('id-ID')}*\n- Status Ruijie : *NORMAL ACTIVE*\n- Waktu : ${waktu} WIB\n\nStruk pembayaran ini sah sebagai bukti pelunasan digital.\n_Layanan Pelanggan RT 03/RW 05: ${settings.waContactCenter}_`;
    kirimWhatsAppNotif(tagihan.pelangganPhone, tagihan.pelangganNama, 'KWITANSI_LUNAS', receiptMsg);

    return { success: true, txId };
  };

  // Bayar Tunai Kasir
  const bayarTagihanTunai = (tagihanId: string) => {
    const tagihan = tagihanList.find(t => t.id === tagihanId);
    if (!tagihan) return;

    const waktu = new Date().toLocaleString('id-ID');
    setTagihanList(prev => prev.map(t => {
      if (t.id === tagihanId) {
        return {
          ...t,
          status: 'paid',
          paidAt: waktu,
          paymentMethod: 'TUNAI_KASIR',
          waReceiptSent: true,
        };
      }
      return t;
    }));

    const newTrx: Transaksi = {
      id: `tx-${Date.now()}`,
      transaksiCode: `TRX-CASH-${Date.now()}`,
      invoiceId: tagihan.id,
      tipe: 'TAGIHAN_BULANAN',
      customerName: tagihan.pelangganNama,
      customerPhone: tagihan.pelangganPhone,
      nominal: tagihan.total,
      feeGateway: 0,
      netRevenue: tagihan.total,
      method: 'TUNAI_KASIR',
      waktu,
      status: 'SETTLED',
    };
    setTransaksiList(prev => [newTrx, ...prev]);

    // Un-isolate if isolated
    const cust = pelangganList.find(p => p.id === tagihan.pelangganId);
    if (cust && cust.status === 'isolated') {
      manualUnisolirRuijie(cust.id);
    }

    const msg = `*BUKTI PEMBAYARAN TUNAI INTERNET anuwani*\n\nTerima kasih *${tagihan.pelangganNama}*, tagihan internet periode *${tagihan.periode}* sebesar *Rp ${tagihan.total.toLocaleString('id-ID')}* telah kami terima secara TUNAI di Kasir/Kolektor.\nStatus: LUNAS. Terima kasih!`;
    kirimWhatsAppNotif(tagihan.pelangganPhone, tagihan.pelangganNama, 'KWITANSI_LUNAS', msg);
  };

  // Generate tagihan bulanan baru
  const generateTagihanBulanBaru = (periode: string, dueDateDay: number): number => {
    let generatedCount = 0;
    const newBills: Tagihan[] = [];
    const dateYear = new Date().getFullYear();
    const dateMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const dueDateStr = `${dateYear}-${dateMonth}-${String(dueDateDay).padStart(2, '0')}`;

    pelangganList.forEach((cust, idx) => {
      if (cust.status === 'active' || cust.status === 'isolated') {
        const pkg = initialPackages.find(p => p.id === cust.packageId);
        if (!pkg) return;

        // Check if invoice already exists
        const exists = tagihanList.some(t => t.pelangganId === cust.id && t.periode === periode);
        if (!exists) {
          const invId = `inv-${Date.now()}-${idx}`;
          const invNum = `INV/${dateYear}/${dateMonth}/${String(tagihanList.length + generatedCount + 1).padStart(4, '0')}`;
          
          const newBill: Tagihan = {
            id: invId,
            nomorInvoice: invNum,
            pelangganId: cust.id,
            pelangganNama: cust.nama,
            pelangganPhone: cust.phone,
            periode,
            packageId: pkg.id,
            packageName: pkg.name,
            amount: pkg.priceMonthly,
            denda: 0,
            total: pkg.priceMonthly,
            dueDate: dueDateStr,
            status: 'unpaid',
            waNotifSent: true,
            waReceiptSent: false,
          };
          newBills.push(newBill);
          generatedCount++;

          // Auto WA tagihan terbit
          const waText = `*TAGIHAN INTERNET BULAN ${periode.toUpperCase()} TERBIT*\n\nHalo *${cust.nama}*,\nTagihan internet Anda untuk periode *${periode}* telah terbit sebesar *Rp ${pkg.priceMonthly.toLocaleString('id-ID')}*.\nJatuh tempo: *${dueDateStr}*.\n\nBayar lebih praktis via DANA / QRIS di portal pelanggan:\n👉 https://anuwani.rtrw.net/portal/bayar/${invId}\n\nTerima kasih atas kepercayaannya!`;
          kirimWhatsAppNotif(cust.phone, cust.nama, 'TAGIHAN_BULANAN', waText);
        }
      }
    });

    if (newBills.length > 0) {
      setTagihanList(prev => [...newBills, ...prev]);
    }
    return generatedCount;
  };

  // Beli Voucher Hotspot via QRIS DANA
  const beliVoucherHotspot = async (
    profileName: string,
    harga: number,
    durasiJam: number,
    speedMbps: number,
    buyerName: string,
    buyerPhone: string,
    channel: 'WHATSAPP_BOT' | 'PORTAL_WEB' = 'PORTAL_WEB'
  ): Promise<HotspotVoucher> => {
    // Generate code
    const randomCode = `NET${durasiJam}H-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomPass = `${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const waktu = now.toLocaleString('id-ID');
    const danaRef = `DANA-QRIS-VCR-${Date.now()}`;

    const newVoucher: HotspotVoucher = {
      id: `vcr-${Date.now()}`,
      code: randomCode,
      passwordHotspot: randomPass,
      profileName,
      durasiJam,
      speedLimitMbps: speedMbps,
      harga,
      status: 'ACTIVE',
      buyerName,
      buyerPhone,
      danaRef,
      channel,
      createdAt: waktu,
      activatedAt: waktu,
      expiredAt: new Date(now.getTime() + durasiJam * 3600 * 1000).toLocaleString('id-ID'),
    };

    setVoucherList(prev => [newVoucher, ...prev]);

    // Transaksi
    const newTrx: Transaksi = {
      id: `tx-${Date.now()}`,
      transaksiCode: `TRX-${danaRef}`,
      voucherId: newVoucher.id,
      tipe: 'VOUCHER_HOTSPOT',
      customerName: buyerName || (channel === 'WHATSAPP_BOT' ? `Pengguna WA (${buyerPhone})` : 'Tamu Hotspot'),
      customerPhone: buyerPhone || '-',
      nominal: harga,
      feeGateway: Math.round(harga * 0.007),
      netRevenue: Math.round(harga * 0.993),
      method: 'DANA_QRIS',
      danaReferenceId: danaRef,
      waktu,
      status: 'SETTLED',
    };
    setTransaksiList(prev => [newTrx, ...prev]);

    // WhatsApp kirim voucher jika no HP diisi
    if (buyerPhone && buyerPhone.length > 8) {
      const msg = `*KODE VOUCHER HOTSPOT WIFI anuwani*\n\nHalo *${buyerName || 'Warga/Tamu'}*,\nPembayaran voucher *${profileName}* via QRIS DANA berhasil terverifikasi otomatis!\n\nDetail Login Wi-Fi Ruijie Hotspot:\n- SSID : *ANUWANI_HOTSPOT_WARGA*\n- Username : *${newVoucher.code}*\n- Password : *${newVoucher.passwordHotspot}*\n- Durasi : ${durasiJam} Jam\n- Kecepatan : Hingga ${speedMbps} Mbps\n\nHubungkan perangkat Anda ke Wi-Fi dan masukkan username di atas pada halaman login hotspot. Selamat menikmati internet!`;
      kirimWhatsAppNotif(buyerPhone, buyerName || 'Warga Hotspot', 'VOUCHER_CODE', msg);
    }

    return newVoucher;
  };

  // Beli Voucher Langsung Cukup via WhatsApp Bot (Tanpa Aplikasi)
  const beliVoucherViaWhatsAppBot = async (
    phone: string,
    buyerName: string,
    durasiJam: number,
    harga: number,
    profileName: string,
    speedMbps: number
  ): Promise<HotspotVoucher> => {
    return beliVoucherHotspot(
      profileName,
      harga,
      durasiJam,
      speedMbps,
      buyerName || 'Pembeli WhatsApp',
      phone,
      'WHATSAPP_BOT'
    );
  };

  // Tambah tiket keluhan
  const tambahTiket = (
    kategori: Tiket['kategori'],
    judul: string,
    deskripsi: string,
    prioritas: Tiket['prioritas'],
    pelangganId?: string
  ): Tiket => {
    const custId = pelangganId || (currentUser.pelangganId ? currentUser.pelangganId : pelangganList[0].id);
    const cust = pelangganList.find(p => p.id === custId) || pelangganList[0];
    const code = `TKT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(tiketList.length + 1).padStart(3, '0')}`;
    const now = new Date().toLocaleString('id-ID');

    const newTiket: Tiket = {
      id: `tkt-${Date.now()}`,
      tiketCode: code,
      pelangganId: cust.id,
      pelangganNama: cust.nama,
      pelangganPhone: cust.phone,
      alamat: cust.alamat,
      kategori,
      judul,
      deskripsi,
      prioritas,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
      pesanList: [
        {
          id: `msg-${Date.now()}`,
          senderRole: currentUser.role,
          senderName: currentUser.name,
          message: deskripsi,
          timestamp: now,
        }
      ]
    };

    setTiketList(prev => [newTiket, ...prev]);

    // Notif WA ke admin/teknisi
    kirimWhatsAppNotif(
      settings.waContactCenter,
      'Helpdesk NOC',
      'TIKET_UPDATE',
      `*TIKET GANGGUAN BARU [${code}]*\nPelanggan: ${cust.nama} (${cust.phone})\nAlamat: ${cust.alamat}\nKategori: ${kategori}\nKeluhan: ${judul}\nPrioritas: ${prioritas}`
    );

    return newTiket;
  };

  // Kirim pesan dalam tiket
  const kirimPesanTiket = (tiketId: string, message: string) => {
    const now = new Date().toLocaleString('id-ID');
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: currentUser.role,
      senderName: currentUser.name,
      message,
      timestamp: now,
    };

    setTiketList(prev => prev.map(t => {
      if (t.id === tiketId) {
        return {
          ...t,
          updatedAt: now,
          pesanList: [...t.pesanList, newMsg]
        };
      }
      return t;
    }));
  };

  // Update status tiket
  const updateStatusTiket = (tiketId: string, status: Tiket['status'], assignedTeknisiId?: string) => {
    const now = new Date().toLocaleString('id-ID');
    const tek = assignedTeknisiId ? teknisiList.find(t => t.id === assignedTeknisiId) : undefined;

    setTiketList(prev => prev.map(t => {
      if (t.id === tiketId) {
        return {
          ...t,
          status,
          updatedAt: now,
          assignedTeknisiId: assignedTeknisiId || t.assignedTeknisiId,
          assignedTeknisiNama: tek ? tek.nama : t.assignedTeknisiNama,
          resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? now : t.resolvedAt,
        };
      }
      return t;
    }));

    // Auto WA pemberitahuan ke pelanggan jika tiket selesai
    const targetTiket = tiketList.find(t => t.id === tiketId);
    if (targetTiket) {
      if (status === 'RESOLVED') {
        kirimWhatsAppNotif(
          targetTiket.pelangganPhone,
          targetTiket.pelangganNama,
          'TIKET_UPDATE',
          `*TIKET GANGGUAN ${targetTiket.tiketCode} SELESAI*\n\nHalo *${targetTiket.pelangganNama}*,\nLaporan gangguan "*${targetTiket.judul}*" telah selesai ditangani oleh teknisi ${tek?.nama || 'NOC'}.\nKoneksi internet Anda sudah normal kembali. Silakan coba kembali. Terima kasih!`
        );
      } else if (status === 'IN_PROGRESS' && tek) {
        kirimWhatsAppNotif(
          targetTiket.pelangganPhone,
          targetTiket.pelangganNama,
          'TIKET_UPDATE',
          `*PETUGAS TEKNISI MENUJU LOKASI*\n\nHalo *${targetTiket.pelangganNama}*,\nTeknisi kami *${tek.nama}* (${tek.phone}) sedang menuju alamat Anda untuk pengecekan tiket *${targetTiket.tiketCode}*.`
        );
      }
    }
  };

  // Sinkronisasi Ruijie Cloud
  const syncRuijieCloud = async () => {
    await new Promise(res => setTimeout(res, 600));
    const now = new Date().toLocaleString('id-ID');
    setRuijieDevices(prev => prev.map(d => ({
      ...d,
      lastSyncAt: now,
      latencyMs: Number((1.2 + Math.random() * 1.5).toFixed(1)),
      connectedClients: Math.floor(d.connectedClients * 0.95 + Math.random() * 5),
    })));
  };

  // Kirim Pengingat WhatsApp H-3 Jatuh Tempo untuk satu tagihan
  const kirimPengingatJatuhTempoH3 = async (tagihanId: string): Promise<{ success: boolean; message: string }> => {
    const t = tagihanList.find(item => item.id === tagihanId);
    if (!t) return { success: false, message: 'Tagihan tidak ditemukan' };

    const daysLeft = getDaysUntilDue(t.dueDate);
    const dayLabel = daysLeft === 0 ? 'hari ini' : daysLeft === 1 ? 'besok' : `${daysLeft} hari lagi`;

    const reminderMsg = `*PENGINGAT RESMI JATUH TEMPO INTERNET anuwani (H-3)*\n\nHalo *${t.pelangganNama}*,\nKami menginformasikan bahwa tagihan internet periode *${t.periode}* sebesar *Rp ${t.total.toLocaleString('id-ID')}* akan jatuh tempo *${dayLabel}* (tanggal *${t.dueDate}*).\n\n⚠️ *Perhatian:* Sistem Ruijie Cloud kami menerapkan *Auto-Isolir Otomatis* tepat pada pukul 00:00 jika tagihan belum terbayar.\n\nBayar praktis & otomatis verifikasi via QRIS DANA (koneksi aktif 24 jam tanpa terputus):\n👉 https://anuwani.rtrw.net/portal/bayar/${t.id}\n\nTerima kasih atas kerjasamanya! 🙏`;

    kirimWhatsAppNotif(t.pelangganPhone, t.pelangganNama, 'TAGIHAN_BULANAN', reminderMsg);

    const now = new Date().toLocaleString('id-ID');
    setTagihanList(prev => prev.map(item => {
      if (item.id === tagihanId) {
        return {
          ...item,
          waReminderSentAt: now,
          waReminderCount: (item.waReminderCount || 0) + 1,
        };
      }
      return item;
    }));

    return {
      success: true,
      message: `Pengingat WhatsApp H-3 berhasil dikirim ke ${t.pelangganNama} (${t.pelangganPhone})`
    };
  };

  // Kirim Broadcast Pengingat WhatsApp H-3 ke Semua Pelanggan Mendekati Jatuh Tempo
  const kirimBroadcastPengingatH3 = async (): Promise<{ sentCount: number; message: string }> => {
    const targetBills = tagihanList.filter(t => {
      if (t.status !== 'unpaid') return false;
      const days = getDaysUntilDue(t.dueDate);
      return days >= 0 && days <= 3;
    });

    for (const t of targetBills) {
      await kirimPengingatJatuhTempoH3(t.id);
    }

    return {
      sentCount: targetBills.length,
      message: `Berhasil mengirim broadcast pengingat H-3 ke ${targetBills.length} pelanggan!`
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        switchUserRole,
        allUsers: initialUsers,
        packages: initialPackages,
        pelangganList,
        tagihanList,
        transaksiList,
        ruijieDevices,
        ruijieLogs,
        teknisiList,
        tiketList,
        voucherList,
        whatsAppLogs,
        settings,
        updateSettings,

        aktivasiPelanggan,
        tambahPelanggan,
        manualIsolirRuijie,
        manualUnisolirRuijie,
        bayarTagihanDana,
        bayarTagihanTunai,
        generateTagihanBulanBaru,
        beliVoucherHotspot,
        beliVoucherViaWhatsAppBot,
        tambahTiket,
        kirimPesanTiket,
        updateStatusTiket,
        kirimWhatsAppNotif,
        syncRuijieCloud,
        kirimPengingatJatuhTempoH3,
        kirimBroadcastPengingatH3,

        selectedTagihanForPayment,
        setSelectedTagihanForPayment,
        selectedInvoiceForPrint,
        setSelectedInvoiceForPrint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
