import {
  InternetPackage,
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
  User
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Pak Budi Santoso (Owner Net)',
    email: 'superadmin@rtrw.net',
    role: 'superadmin',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-2',
    name: 'Rian Hidayat (Admin & NOC)',
    email: 'admin@rtrw.net',
    role: 'administrator',
    phone: '082198765432',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-3',
    name: 'Ahmad Yani',
    email: 'ahmad@gmail.com',
    role: 'pelanggan',
    phone: '085711223344',
    pelangganId: 'cust-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-4',
    name: 'Siti Rohmah (Status Isolir)',
    email: 'siti@gmail.com',
    role: 'pelanggan',
    phone: '085899887766',
    pelangganId: 'cust-2',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-5',
    name: 'Bambang Prakoso (Menunggu Aktivasi)',
    email: 'bambang@gmail.com',
    role: 'pelanggan',
    phone: '081377889900',
    pelangganId: 'cust-5',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  }
];

export const initialPackages: InternetPackage[] = [
  {
    id: 'pkg-1',
    name: 'Paket Hemat 10 Mbps',
    speedMbps: 10,
    priceMonthly: 125000,
    description: 'Cocok untuk browsing, medsos & belajar online (1-3 perangkat)',
    ruijieProfile: 'PROFILE_10M_UNLIMITED',
  },
  {
    id: 'pkg-2',
    name: 'Paket Keluarga 20 Mbps',
    speedMbps: 20,
    priceMonthly: 185000,
    description: 'Streaming HD Netflix & Youtube lancar tanpa buffering (3-5 perangkat)',
    ruijieProfile: 'PROFILE_20M_UNLIMITED',
  },
  {
    id: 'pkg-3',
    name: 'Paket Gamer 30 Mbps',
    speedMbps: 30,
    priceMonthly: 250000,
    description: 'Ping stabil low-latency untuk Mobile Legends, Valorant & Work From Home',
    ruijieProfile: 'PROFILE_30M_LOWPING',
  },
  {
    id: 'pkg-4',
    name: 'Paket Usaha/Bisnis 50 Mbps',
    speedMbps: 50,
    priceMonthly: 395000,
    description: 'Prioritas bandwidth simetris untuk toko, cafe, pos ronda & kantor desa',
    ruijieProfile: 'PROFILE_50M_PRIORITY',
  },
];

export const initialPelanggan: Pelanggan[] = [
  {
    id: 'cust-1',
    nomorPelanggan: 'NET-2026-001',
    nama: 'Ahmad Yani',
    nik: '3201198505120001',
    phone: '085711223344',
    email: 'ahmad@gmail.com',
    alamat: 'Jl. Merpati No. 14 Blok A',
    rt: '03',
    rw: '05',
    odpCode: 'ODP-SKM-01/PORT-02',
    koneksiType: 'PPPoE',
    packageId: 'pkg-3',
    ipAddress: '10.10.20.14',
    pppoeUser: 'net_ahmadyani',
    ruijieDeviceMac: '20:4e:7f:81:9a:10',
    ruijieOntSN: 'RJEP20241019001',
    dueDateDay: 10,
    status: 'active',
    autoIsolirEnabled: true,
    registeredAt: '2026-01-15',
    activatedAt: '2026-01-16',
    lastPaymentAt: '2026-10-02',
    bandwidthUsageGb: 342.8,
  },
  {
    id: 'cust-2',
    nomorPelanggan: 'NET-2026-002',
    nama: 'Siti Rohmah',
    nik: '3201199008230004',
    phone: '085899887766',
    email: 'siti@gmail.com',
    alamat: 'Jl. Kenanga No. 07 Blok B',
    rt: '02',
    rw: '05',
    odpCode: 'ODP-SKM-02/PORT-05',
    koneksiType: 'PPPoE',
    packageId: 'pkg-2',
    ipAddress: '10.254.0.88', // Isolir pool IP
    pppoeUser: 'net_sitirohmah',
    ruijieDeviceMac: '20:4e:7f:a2:bb:45',
    ruijieOntSN: 'RJEP20241019002',
    dueDateDay: 5,
    status: 'isolated',
    autoIsolirEnabled: true,
    registeredAt: '2026-02-10',
    activatedAt: '2026-02-11',
    lastIsolatedAt: '2026-10-06 00:05',
    bandwidthUsageGb: 198.2,
  },
  {
    id: 'cust-3',
    nomorPelanggan: 'NET-2026-003',
    nama: 'Hendra Gunawan',
    nik: '3201198302190002',
    phone: '081288990011',
    email: 'hendra.gunawan@gmail.com',
    alamat: 'Jl. Cendrawasih No. 22',
    rt: '04',
    rw: '05',
    odpCode: 'ODP-SKM-01/PORT-07',
    koneksiType: 'PPPoE',
    packageId: 'pkg-1',
    ipAddress: '10.10.20.19',
    pppoeUser: 'net_hendrag',
    ruijieDeviceMac: '20:4e:7f:c3:44:19',
    ruijieOntSN: 'RJEP20241019003',
    dueDateDay: 15,
    status: 'active',
    autoIsolirEnabled: true,
    registeredAt: '2026-03-01',
    activatedAt: '2026-03-02',
    lastPaymentAt: '2026-09-14',
    bandwidthUsageGb: 120.4,
  },
  {
    id: 'cust-4',
    nomorPelanggan: 'NET-2026-004',
    nama: 'Warung Bu Sri & Kopi',
    nik: '3201197701140003',
    phone: '081977665544',
    email: 'warung.sri@gmail.com',
    alamat: 'Pos Ronda RW 05 Depan Gapura',
    rt: '01',
    rw: '05',
    odpCode: 'ODP-SKM-03/PORT-01',
    koneksiType: 'IP_Static',
    packageId: 'pkg-4',
    ipAddress: '10.10.10.5',
    pppoeUser: 'net_warungsri',
    ruijieDeviceMac: '20:4e:7f:ee:90:72',
    ruijieOntSN: 'RJEP20241019004',
    dueDateDay: 10,
    status: 'active',
    autoIsolirEnabled: false,
    registeredAt: '2026-03-20',
    activatedAt: '2026-03-21',
    lastPaymentAt: '2026-10-04',
    bandwidthUsageGb: 785.3,
  },
  {
    id: 'cust-5',
    nomorPelanggan: 'NET-2026-005',
    nama: 'Bambang Prakoso',
    nik: '3201199411030007',
    phone: '081377889900',
    email: 'bambang@gmail.com',
    alamat: 'Jl. Mawar No. 03 RT 02/RW 05',
    rt: '02',
    rw: '05',
    odpCode: 'ODP-SKM-02/PORT-08',
    koneksiType: 'PPPoE',
    packageId: 'pkg-2',
    ipAddress: '10.10.20.55',
    pppoeUser: 'net_bambangp',
    ruijieDeviceMac: '20:4e:7f:55:aa:33',
    ruijieOntSN: 'RJEP20241019005',
    dueDateDay: 10,
    status: 'pending', // Menunggu aktivasi
    autoIsolirEnabled: true,
    registeredAt: '2026-10-07',
    bandwidthUsageGb: 0,
  },
  {
    id: 'cust-6',
    nomorPelanggan: 'NET-2026-006',
    nama: 'Dedi Supriadi',
    nik: '3201198807150005',
    phone: '081233445566',
    email: 'dedi.supriadi@gmail.com',
    alamat: 'Jl. Merak No. 12 RT 03/RW 05',
    rt: '03',
    rw: '05',
    odpCode: 'ODP-SKM-01/PORT-04',
    koneksiType: 'PPPoE',
    packageId: 'pkg-2',
    ipAddress: '10.10.20.66',
    pppoeUser: 'net_dedisupriadi',
    ruijieDeviceMac: '20:4e:7f:66:bc:88',
    ruijieOntSN: 'RJEP20241019006',
    dueDateDay: 10,
    status: 'active',
    autoIsolirEnabled: true,
    registeredAt: '2026-04-12',
    activatedAt: '2026-04-13',
    lastPaymentAt: '2026-09-09',
    bandwidthUsageGb: 241.5,
  },
  {
    id: 'cust-7',
    nomorPelanggan: 'NET-2026-007',
    nama: 'Rina Wulandari',
    nik: '3201199304210008',
    phone: '085611224488',
    email: 'rina.wulandari@gmail.com',
    alamat: 'Jl. Melati No. 08 RT 01/RW 05',
    rt: '01',
    rw: '05',
    odpCode: 'ODP-SKM-02/PORT-03',
    koneksiType: 'PPPoE',
    packageId: 'pkg-3',
    ipAddress: '10.10.20.77',
    pppoeUser: 'net_rinawulandari',
    ruijieDeviceMac: '20:4e:7f:77:de:99',
    ruijieOntSN: 'RJEP20241019007',
    dueDateDay: 10,
    status: 'active',
    autoIsolirEnabled: true,
    registeredAt: '2026-05-18',
    activatedAt: '2026-05-19',
    lastPaymentAt: '2026-09-10',
    bandwidthUsageGb: 310.2,
  },
  {
    id: 'cust-8',
    nomorPelanggan: 'NET-2026-008',
    nama: 'Pak RT Joko Susilo',
    nik: '3201197409120002',
    phone: '087811992233',
    email: 'joko.rt02@gmail.com',
    alamat: 'Rumah Dinas RT 02/RW 05',
    rt: '02',
    rw: '05',
    odpCode: 'ODP-SKM-01/PORT-01',
    koneksiType: 'PPPoE',
    packageId: 'pkg-1',
    ipAddress: '10.10.20.88',
    pppoeUser: 'net_jokosusilo',
    ruijieDeviceMac: '20:4e:7f:88:ef:11',
    ruijieOntSN: 'RJEP20241019008',
    dueDateDay: 9,
    status: 'active',
    autoIsolirEnabled: true,
    registeredAt: '2026-01-10',
    activatedAt: '2026-01-11',
    lastPaymentAt: '2026-09-08',
    bandwidthUsageGb: 145.8,
  }
];

export const initialTagihan: Tagihan[] = [
  {
    id: 'inv-101',
    nomorInvoice: 'INV/2026/10/0001',
    pelangganId: 'cust-1',
    pelangganNama: 'Ahmad Yani',
    pelangganPhone: '085711223344',
    periode: 'Oktober 2026',
    packageId: 'pkg-3',
    packageName: 'Paket Gamer 30 Mbps',
    amount: 250000,
    denda: 0,
    total: 250000,
    dueDate: '2026-10-10',
    status: 'paid',
    paidAt: '2026-10-02 14:22:10',
    paymentMethod: 'DANA_QRIS',
    danaTransactionId: 'DANA-TX-998821033',
    waNotifSent: true,
    waReceiptSent: true,
  },
  {
    id: 'inv-102',
    nomorInvoice: 'INV/2026/10/0002',
    pelangganId: 'cust-2',
    pelangganNama: 'Siti Rohmah',
    pelangganPhone: '085899887766',
    periode: 'Oktober 2026',
    packageId: 'pkg-2',
    packageName: 'Paket Keluarga 20 Mbps',
    amount: 185000,
    denda: 10000,
    total: 195000,
    dueDate: '2026-10-05',
    status: 'isolated', // Terisolir Ruijie karena lewat tgl 5
    waNotifSent: true,
    waReceiptSent: false,
  },
  {
    id: 'inv-103',
    nomorInvoice: 'INV/2026/10/0003',
    pelangganId: 'cust-3',
    pelangganNama: 'Hendra Gunawan',
    pelangganPhone: '081288990011',
    periode: 'Oktober 2026',
    packageId: 'pkg-1',
    packageName: 'Paket Hemat 10 Mbps',
    amount: 125000,
    denda: 0,
    total: 125000,
    dueDate: '2026-10-11',
    status: 'unpaid',
    waNotifSent: true,
    waReceiptSent: false,
    waReminderCount: 0,
  },
  {
    id: 'inv-104',
    nomorInvoice: 'INV/2026/10/0004',
    pelangganId: 'cust-4',
    pelangganNama: 'Warung Bu Sri & Kopi',
    pelangganPhone: '081977665544',
    periode: 'Oktober 2026',
    packageId: 'pkg-4',
    packageName: 'Paket Usaha/Bisnis 50 Mbps',
    amount: 395000,
    denda: 0,
    total: 395000,
    dueDate: '2026-10-10',
    status: 'paid',
    paidAt: '2026-10-04 09:15:30',
    paymentMethod: 'DANA_WALLET',
    danaTransactionId: 'DANA-TX-774411902',
    waNotifSent: true,
    waReceiptSent: true,
  },
  {
    id: 'inv-105',
    nomorInvoice: 'INV/2026/10/0005',
    pelangganId: 'cust-6',
    pelangganNama: 'Dedi Supriadi',
    pelangganPhone: '081233445566',
    periode: 'Oktober 2026',
    packageId: 'pkg-2',
    packageName: 'Paket Keluarga 20 Mbps',
    amount: 185000,
    denda: 0,
    total: 185000,
    dueDate: '2026-10-10',
    status: 'unpaid',
    waNotifSent: true,
    waReceiptSent: false,
    waReminderCount: 0,
  },
  {
    id: 'inv-106',
    nomorInvoice: 'INV/2026/10/0006',
    pelangganId: 'cust-7',
    pelangganNama: 'Rina Wulandari',
    pelangganPhone: '085611224488',
    periode: 'Oktober 2026',
    packageId: 'pkg-3',
    packageName: 'Paket Gamer 30 Mbps',
    amount: 250000,
    denda: 0,
    total: 250000,
    dueDate: '2026-10-10',
    status: 'unpaid',
    waNotifSent: true,
    waReceiptSent: false,
    waReminderCount: 0,
  },
  {
    id: 'inv-107',
    nomorInvoice: 'INV/2026/10/0007',
    pelangganId: 'cust-8',
    pelangganNama: 'Pak RT Joko Susilo',
    pelangganPhone: '087811992233',
    periode: 'Oktober 2026',
    packageId: 'pkg-1',
    packageName: 'Paket Hemat 10 Mbps',
    amount: 125000,
    denda: 0,
    total: 125000,
    dueDate: '2026-10-09',
    status: 'unpaid',
    waNotifSent: true,
    waReceiptSent: false,
    waReminderCount: 0,
  }
];

export const initialTransaksi: Transaksi[] = [
  {
    id: 'tx-01',
    transaksiCode: 'TRX-DANA-20261002-001',
    invoiceId: 'inv-101',
    tipe: 'TAGIHAN_BULANAN',
    customerName: 'Ahmad Yani',
    customerPhone: '085711223344',
    nominal: 250000,
    feeGateway: 1750, // 0.7% QRIS fee
    netRevenue: 248250,
    method: 'DANA_QRIS',
    danaReferenceId: 'DANA-TX-998821033',
    waktu: '2026-10-02 14:22:10',
    status: 'SETTLED',
  },
  {
    id: 'tx-02',
    transaksiCode: 'TRX-DANA-20261004-002',
    invoiceId: 'inv-104',
    tipe: 'TAGIHAN_BULANAN',
    customerName: 'Warung Bu Sri & Kopi',
    customerPhone: '081977665544',
    nominal: 395000,
    feeGateway: 2000,
    netRevenue: 393000,
    method: 'DANA_WALLET',
    danaReferenceId: 'DANA-TX-774411902',
    waktu: '2026-10-04 09:15:30',
    status: 'SETTLED',
  },
  {
    id: 'tx-03',
    transaksiCode: 'TRX-VCR-20261007-009',
    tipe: 'VOUCHER_HOTSPOT',
    customerName: 'Tamu Warga (Doni Saputra)',
    customerPhone: '087811998800',
    nominal: 10000,
    feeGateway: 70,
    netRevenue: 9930,
    method: 'DANA_QRIS',
    danaReferenceId: 'DANA-TX-QRIS-331100',
    waktu: '2026-10-07 19:40:12',
    status: 'SETTLED',
  }
];

export const initialRuijieDevices: RuijieDevice[] = [
  {
    id: 'rj-gw-01',
    name: 'Ruijie Gateway Core NOC',
    model: 'Ruijie RG-EG105G-V2 (Cloud Managed)',
    ip: '192.168.10.1',
    mac: '70:a8:e3:10:20:01',
    serialNumber: 'RJEG105G240901',
    role: 'GATEWAY',
    location: 'Ruang Server NOC RT 03',
    status: 'ONLINE',
    latencyMs: 1.8,
    cpuLoadPercent: 18,
    memPercent: 32,
    temperatureC: 41,
    uptime: '48 hari 14 jam',
    connectedClients: 84,
    firmwareVersion: 'ReyeeOS 1.228.1925',
    lastSyncAt: '2026-10-07 21:45:00',
  },
  {
    id: 'rj-sw-01',
    name: 'Ruijie Managed PoE Switch 24P',
    model: 'Ruijie RG-NBS3100-24GT4SFP-P',
    ip: '192.168.10.2',
    mac: '70:a8:e3:30:40:02',
    serialNumber: 'RJNBS31240911',
    role: 'CORE_SWITCH',
    location: 'Rack ODF Pusat Sukamaju',
    status: 'ONLINE',
    latencyMs: 0.9,
    cpuLoadPercent: 12,
    memPercent: 24,
    temperatureC: 39,
    uptime: '48 hari 14 jam',
    connectedClients: 42,
    firmwareVersion: 'ReyeeOS 1.210.0815',
    lastSyncAt: '2026-10-07 21:45:00',
  },
  {
    id: 'rj-ap-01',
    name: 'Ruijie AP Outdoor Pos Kamling',
    model: 'Ruijie Reyee RG-RAP2200(E) Wi-Fi 5 AP',
    ip: '192.168.10.15',
    mac: '70:a8:e3:55:60:11',
    serialNumber: 'RJRAP220240933',
    role: 'ACCESS_POINT_REYEE',
    location: 'Tiang Utama Pos Ronda RW 05',
    status: 'ONLINE',
    latencyMs: 3.2,
    cpuLoadPercent: 26,
    memPercent: 44,
    temperatureC: 45,
    uptime: '19 hari 08 jam',
    connectedClients: 29,
    firmwareVersion: 'ReyeeOS 1.220.1001',
    lastSyncAt: '2026-10-07 21:45:00',
  },
  {
    id: 'rj-ap-02',
    name: 'Ruijie AP Balai Warga RT 02',
    model: 'Ruijie Reyee RG-RAP1200(F) Wall AP',
    ip: '192.168.10.16',
    mac: '70:a8:e3:55:70:22',
    serialNumber: 'RJRAP120240944',
    role: 'ACCESS_POINT_REYEE',
    location: 'Gedung Serbaguna RT 02',
    status: 'ONLINE',
    latencyMs: 2.4,
    cpuLoadPercent: 14,
    memPercent: 30,
    temperatureC: 38,
    uptime: '22 hari 01 jam',
    connectedClients: 13,
    firmwareVersion: 'ReyeeOS 1.220.1001',
    lastSyncAt: '2026-10-07 21:45:00',
  }
];

export const initialRuijieIsolirLogs: RuijieIsolirLog[] = [
  {
    id: 'iso-01',
    pelangganId: 'cust-2',
    pelangganNama: 'Siti Rohmah',
    ipAddress: '10.10.20.15 -> 10.254.0.88',
    action: 'ISOLIR',
    reason: 'Jatuh tempo terlewati (Tenggat 5 Okt 2026)',
    executedBy: 'SYSTEM_CRON_AUTO',
    ruijieStatus: 'SUCCESS',
    responseTimeMs: 142,
    timestamp: '2026-10-06 00:05:12',
  },
  {
    id: 'iso-02',
    pelangganId: 'cust-1',
    pelangganNama: 'Ahmad Yani',
    ipAddress: '10.254.0.12 -> 10.10.20.14',
    action: 'UNISOLIR',
    reason: 'Pembayaran DANA QRIS Lunas terverifikasi instan',
    executedBy: 'DANA_WEBHOOK_INSTANT',
    ruijieStatus: 'SUCCESS',
    responseTimeMs: 98,
    timestamp: '2026-10-02 14:22:12',
  }
];

export const initialTeknisi: Teknisi[] = [
  {
    id: 'tek-1',
    nama: 'Bagus Setiawan',
    phone: '081233445566',
    areaTugas: 'Sektor RT 01 - 03 (ODP 1 & 2)',
    status: 'TERSEDIA',
    activeTaskCount: 0,
    rating: 4.9,
  },
  {
    id: 'tek-2',
    nama: 'Dodi Firmansyah',
    phone: '081344556677',
    areaTugas: 'Sektor RT 04 - 06 (ODP 3 & 4)',
    status: 'DI_LOKASI',
    activeTaskCount: 1,
    rating: 4.8,
  },
  {
    id: 'tek-3',
    nama: 'Ilham Kurnia',
    phone: '085722334455',
    areaTugas: 'Spesialis Splicing FO & Ruijie Config',
    status: 'TERSEDIA',
    activeTaskCount: 0,
    rating: 5.0,
  }
];

export const initialTiket: Tiket[] = [
  {
    id: 'tkt-01',
    tiketCode: 'TKT-202610-001',
    pelangganId: 'cust-3',
    pelangganNama: 'Hendra Gunawan',
    pelangganPhone: '081288990011',
    alamat: 'Jl. Cendrawasih No. 22',
    kategori: 'KONEKSI_LAMBAT',
    judul: 'Kecepatan wifi drop saat malam hari',
    deskripsi: 'Halo admin, biasanya dapat 10 Mbps tapi semalam cuma dapat 2 Mbps dan anak saya zoom meeting terputus. Mohon dicek ya.',
    prioritas: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignedTeknisiId: 'tek-2',
    assignedTeknisiNama: 'Dodi Firmansyah',
    createdAt: '2026-10-07 16:30:00',
    updatedAt: '2026-10-07 17:15:00',
    pesanList: [
      {
        id: 'msg-1',
        senderRole: 'pelanggan',
        senderName: 'Hendra Gunawan',
        message: 'Halo admin, mohon dibantu kecepatan drop sejak jam 8 malam.',
        timestamp: '2026-10-07 16:30:00',
      },
      {
        id: 'msg-2',
        senderRole: 'administrator',
        senderName: 'Rian Hidayat (Admin)',
        message: 'Baik Pak Hendra, kami sudah assign Mas Dodi teknisi untuk cek redaman fiber di ODP-SKM-01.',
        timestamp: '2026-10-07 16:45:00',
      },
      {
        id: 'msg-3',
        senderRole: 'teknisi',
        senderName: 'Dodi (Teknisi)',
        message: 'Pak Hendra, saya sedang di ODP depan gang mengecek kabel patchcord. Mohon jangan matikan modem Ruijie dulu ya.',
        timestamp: '2026-10-07 17:15:00',
      }
    ]
  },
  {
    id: 'tkt-02',
    tiketCode: 'TKT-202610-002',
    pelangganId: 'cust-1',
    pelangganNama: 'Ahmad Yani',
    pelangganPhone: '085711223344',
    alamat: 'Jl. Merpati No. 14 Blok A',
    kategori: 'GANTI_PASSWORD',
    judul: 'Minta tolong ganti password wifi ruijie',
    deskripsi: 'Mau ganti password wifi rumah karena tetangga sebelah kebanyakan nebeng.',
    prioritas: 'LOW',
    status: 'RESOLVED',
    assignedTeknisiId: 'tek-1',
    assignedTeknisiNama: 'Bagus Setiawan',
    createdAt: '2026-10-03 09:00:00',
    updatedAt: '2026-10-03 09:30:00',
    resolvedAt: '2026-10-03 09:30:00',
    pesanList: [
      {
        id: 'msg-10',
        senderRole: 'pelanggan',
        senderName: 'Ahmad Yani',
        message: 'Admin, tolong ganti password SSID "Ahmad_Net" jadi "KeluargaYani2026" ya.',
        timestamp: '2026-10-03 09:00:00',
      },
      {
        id: 'msg-11',
        senderRole: 'administrator',
        senderName: 'Rian (Admin)',
        message: 'Sudah diupdate via Ruijie Reyee Cloud ya Pak Yani! Router sudah reboot otomatis dengan password baru.',
        timestamp: '2026-10-03 09:30:00',
      }
    ]
  }
];

export const initialVouchers: HotspotVoucher[] = [
  {
    id: 'vcr-1',
    code: 'NET2H-8821',
    passwordHotspot: '8821',
    profileName: '2 Jam Unlimited',
    durasiJam: 2,
    speedLimitMbps: 5,
    harga: 3000,
    status: 'UNUSED',
    createdAt: '2026-10-07 10:00:00',
  },
  {
    id: 'vcr-2',
    code: 'NET6H-4419',
    passwordHotspot: '4419',
    profileName: '6 Jam Hemat',
    durasiJam: 6,
    speedLimitMbps: 7,
    harga: 5000,
    status: 'UNUSED',
    createdAt: '2026-10-07 10:00:00',
  },
  {
    id: 'vcr-3',
    code: 'NET24H-9012',
    passwordHotspot: '9012',
    profileName: '24 Jam Full Day',
    durasiJam: 24,
    speedLimitMbps: 10,
    harga: 10000,
    status: 'ACTIVE',
    buyerName: 'Doni Saputra',
    buyerPhone: '087811998800',
    danaRef: 'DANA-TX-QRIS-331100',
    createdAt: '2026-10-07 19:40:00',
    activatedAt: '2026-10-07 19:42:00',
    expiredAt: '2026-10-08 19:42:00',
  },
  {
    id: 'vcr-4',
    code: 'NET7D-1029',
    passwordHotspot: '1029',
    profileName: '7 Hari Mingguan',
    durasiJam: 168,
    speedLimitMbps: 15,
    harga: 30000,
    status: 'UNUSED',
    createdAt: '2026-10-07 10:00:00',
  },
  {
    id: 'vcr-5',
    code: 'NET30D-5501',
    passwordHotspot: '5501',
    profileName: '30 Hari Hotspot',
    durasiJam: 720,
    speedLimitMbps: 20,
    harga: 60000,
    status: 'UNUSED',
    createdAt: '2026-10-07 10:00:00',
  }
];

export const initialWhatsAppLogs: WhatsAppLog[] = [
  {
    id: 'wa-01',
    recipientPhone: '085711223344',
    recipientName: 'Ahmad Yani',
    type: 'KWITANSI_LUNAS',
    message: `*KWITANSI PEMBAYARAN INTERNET anuwani*\n\nTerima kasih *Ahmad Yani*, pembayaran tagihan internet periode *Oktober 2026* telah BERHASIL diverifikasi otomatis via DANA QRIS.\n\nNo. Invoice: INV/2026/10/0001\nPaket: Paket Gamer 30 Mbps\nNominal: Rp 250.000 (LUNAS)\nWaktu: 02/10/2026 14:22 WIB\nStatus Ruijie: NORMAL ACTIVE\n\nStruk digital: https://anuwani.rtrw.net/invoice/INV-2026-10-0001\n\n_Layanan Pelanggan RT 03/RW 05: 0812-3456-7890_`,
    status: 'DELIVERED',
    timestamp: '2026-10-02 14:22:15',
    gatewayResponseId: 'FONNTE-MSG-99120',
  },
  {
    id: 'wa-02',
    recipientPhone: '085899887766',
    recipientName: 'Siti Rohmah',
    type: 'PERINGATAN_ISOLIR',
    message: `*PEMBERITAHUAN ISOLIR SEMENTARA anuwani*\n\nKepada Yth. *Siti Rohmah*,\nTagihan internet periode *Oktober 2026* sebesar *Rp 195.000* telah melewati tanggal jatuh tempo (05 Okt 2026).\n\nSistem kami telah mengaktifkan *Auto-Isolir Ruijie Reyee* secara otomatis. Untuk memulihkan koneksi kembali normal dalam 2 detik, silakan bayar sekarang via DANA / QRIS pada link berikut:\n👉 https://anuwani.rtrw.net/portal/bayar/inv-102\n\nSetelah bayar, internet otomatis aktif tanpa perlu konfirmasi manual admin. Terima kasih!`,
    status: 'DELIVERED',
    timestamp: '2026-10-06 00:05:20',
    gatewayResponseId: 'FONNTE-MSG-99144',
  }
];

export const initialSettings: SystemSettings = {
  ispName: 'Anuwani RT/RW NET',
  brandShortName: 'Anuwani',
  tagline: 'Internet Super Cepat, Hemat & Handal untuk Komunitas Warga',
  logoUrl: '',
  logoIconType: 'wifi',
  primaryColor: '#0284c7',
  companyLegalName: 'PT ANUWANI DIGITAL NETWORK INDONESIA',
  companyAddress: 'Jl. Melati Raya No. 12, RW 05 Kelurahan Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat 16413',
  companyEmail: 'info@anuwani.net.id',
  companyPhone: '021-87654321',
  companyNpwp: '01.234.567.8-412.000',
  companyWebsite: 'https://anuwani.rtrw.net',
  billingFooterNote: 'Terima kasih atas pembayaran tepat waktu. Internet cepat, lingkungan guyub rukun.',
  waContactCenter: '0812-3456-7890',
  rtRwCoverage: 'RT 01 s/d RT 06, RW 05 Kelurahan Sukamaju',
  bankAccount: 'Bank BCA 883019281 a.n PT Anuwani Digital Network',
  bankName: 'Bank Central Asia (BCA)',
  bankHolder: 'PT Anuwani Digital Network',
  danaMerchantId: 'DANA_MERCHANT_RTRW_998',
  danaApiKey: 'live_dana_sec_key_rtrw_net_992182049182',
  danaWebhookSecret: 'whsec_dana_ruijie_auto_sync_33918204',
  danaQrActive: true,
  ruijieCloudApiKey: 'rj_cloud_api_v2_f8190cbb123498acbd',
  ruijieCloudProjectId: 'PRJ-RTRW-SUKAMAJU-01',
  ruijieGatewayIp: '192.168.10.1',
  ruijieAutoIsolirHour: 0,
  waGatewayProvider: 'FONNTE',
  waGatewayToken: 'fonnte_token_rtrw_net_prod_secret_8819',
  waDelaySeconds: 2,
  waWebhookUrl: 'https://api.anuwani.rtrw.net/api/whatsapp/webhook',
  waFeatures: {
    enableNotifAktivasi: true,
    enableNotifTagihan: true,
    enableNotifKwitansiLunas: true,
    enableNotifPeringatanIsolir: true,
    enableNotifUnisolir: true,
    enableNotifTiket: true,
    enableBotVoucherHotspot: true,
  },
  waTemplates: {
    templateAktivasi: `*SELAMAT! KONEKSI INTERNET ANUWANI TELAH AKTIF*

Halo *{NAMA}*,
Registrasi dan pemasangan internet Anuwani RT/RW Net Anda telah berhasil diaktivasi.

Detail Akun Pelanggan:
- No. Pelanggan : *{NO_PELANGGAN}*
- Paket : *{PAKET}*
- IP Address : *{IP_ADDRESS}*
- Akun PPPoE : *{PPPOE_USER}*
- ODP Port : *{ODP_PORT}*
- Jatuh Tempo : Tiap tanggal {JATUH_TEMPO}

Login Portal Pelanggan:
Username: {EMAIL}
Password: {PASSWORD}
Portal: https://anuwani.rtrw.net/portal

Terima kasih atas kepercayaannya!`,

    templateTagihan: `*PENGINGAT TAGIHAN INTERNET {ISP_NAME}*

Halo *{NAMA}*,
Tagihan internet Anda untuk periode *{PERIODE}* telah terbit sebesar *Rp {NOMINAL}*.
Jatuh tempo: *{JATUH_TEMPO}*.

Bayar praktis otomatis un-isolir via DANA / QRIS di portal:
👉 {LINK_BAYAR}

Abaikan pesan ini jika sudah melakukan pembayaran. Terima kasih!`,

    templateKwitansi: `*KWITANSI PEMBAYARAN INTERNET LUNAS ({ISP_NAME})*

Terima kasih *{NAMA}*,
Pembayaran tagihan internet periode *{PERIODE}* telah BERHASIL diverifikasi otomatis via DANA.

Detail Transaksi:
- No Invoice : *{NO_INVOICE}*
- Ref DANA : *{TX_REF}*
- Total Bayar : *Rp {NOMINAL}*
- Status Ruijie : *NORMAL ACTIVE*
- Waktu : {WAKTU} WIB

Struk digital ini sah sebagai bukti pelunasan resmi.
_Layanan Bantuan: {KONTAK_NOC}_`,

    templatePeringatanIsolir: `*PEMBERITAHUAN ISOLIR SEMENTARA KONEKSI INTERNET*

Yth. *{NAMA}*,
Tagihan internet periode *{PERIODE}* sebesar *Rp {NOMINAL}* telah melewati tanggal jatuh tempo ({JATUH_TEMPO}).

Sistem telah mengalihkan koneksi ke *Portal Auto-Isolir Ruijie Reyee*.
Untuk memulihkan koneksi kembali normal dalam 2 detik, silakan bayar sekarang via DANA / QRIS:
👉 {LINK_BAYAR}

Setelah bayar, internet otomatis aktif seketika tanpa perlu konfirmasi manual.`,

    templateUnisolir: `*LAYANAN INTERNET TELAH NORMAL KEMBALI*

Halo *{NAMA}*,
Status isolir pada router Ruijie telah dicabut otomatis setelah pembayaran diterima.
Kecepatan internet paket *{PAKET}* telah dipulihkan normal kembali. Selamat beraktivitas!`,

    templateTiketUpdate: `*UPDATE TIKET GANGGUAN [{KODE_TIKET}]*

Halo *{NAMA}*,
Laporan gangguan *{JUDUL_TIKET}* telah diupdate:
Status: *{STATUS_TIKET}*
Teknisi Bertugas: *{NAMA_TEKNISI}* ({NO_TEKNISI})
Keterangan: {KETERANGAN}

Tim kami berkomitmen memberikan pelayanan internet terbaik.`,

    templateVoucherSuccess: `*KODE VOUCHER WI-FI HOTSPOT RUIJIE*

Halo *{NAMA}*,
Pembayaran voucher *{NAMA_PAKET}* via QRIS DANA telah berhasil!

Detail Akun Wi-Fi:
- SSID : *ANUWANI_HOTSPOT_WARGA*
- Username : *{KODE_VOUCHER}*
- Password : *{PASSWORD_VOUCHER}*
- Durasi : {DURASI_JAM} Jam
- Kecepatan : Hingga {SPEED_MBPS} Mbps

Tinggal sambungkan HP ke Wi-Fi dan login. Selamat internetan!`,
  },
};
