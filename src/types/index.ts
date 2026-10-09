export type UserRole = 'superadmin' | 'administrator' | 'pelanggan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  pelangganId?: string; // Linked customer ID if role is pelanggan
}

export type PelangganStatus = 'active' | 'isolated' | 'pending' | 'inactive';
export type KoneksiType = 'PPPoE' | 'IP_Static' | 'Hotspot_Ruijie';

export interface InternetPackage {
  id: string;
  name: string;
  speedMbps: number;
  priceMonthly: number;
  description: string;
  ruijieProfile: string;
}

export interface Pelanggan {
  id: string;
  nomorPelanggan: string; // e.g. NET-2026-001
  nama: string;
  nik: string;
  phone: string; // WA
  email: string;
  alamat: string;
  rt: string;
  rw: string;
  odpCode: string; // e.g. ODP-SKM-03 / Port 4
  koneksiType: KoneksiType;
  packageId: string;
  ipAddress: string;
  pppoeUser: string;
  pppoePassword?: string;
  ruijieDeviceMac: string;
  ruijieOntSN: string;
  dueDateDay: number; // e.g. tanggal 10 atau 20
  status: PelangganStatus;
  autoIsolirEnabled: boolean;
  registeredAt: string;
  activatedAt?: string;
  lastIsolatedAt?: string;
  lastPaymentAt?: string;
  bandwidthUsageGb: number;
}

export type TagihanStatus = 'unpaid' | 'paid' | 'overdue' | 'isolated';

export interface Tagihan {
  id: string;
  nomorInvoice: string; // e.g. INV/2026/10/0042
  pelangganId: string;
  pelangganNama: string;
  pelangganPhone: string;
  periode: string; // e.g. "Oktober 2026"
  packageId: string;
  packageName: string;
  amount: number;
  denda: number;
  total: number;
  dueDate: string; // YYYY-MM-DD
  status: TagihanStatus;
  paidAt?: string;
  paymentMethod?: 'DANA_QRIS' | 'DANA_WALLET' | 'TUNAI_KASIR' | 'TRANSFER_BANK';
  danaTransactionId?: string;
  waNotifSent: boolean;
  waReceiptSent: boolean;
  waReminderSentAt?: string;
  waReminderCount?: number;
}

export interface Transaksi {
  id: string;
  transaksiCode: string;
  invoiceId?: string;
  voucherId?: string;
  tipe: 'TAGIHAN_BULANAN' | 'VOUCHER_HOTSPOT' | 'BIAYA_PASANG_BARU';
  customerName: string;
  customerPhone: string;
  nominal: number;
  feeGateway: number;
  netRevenue: number;
  method: 'DANA_QRIS' | 'DANA_WALLET' | 'TUNAI_KASIR';
  danaReferenceId?: string;
  waktu: string;
  status: 'SUCCESS' | 'PENDING' | 'SETTLED' | 'FAILED';
}

export interface RuijieDevice {
  id: string;
  name: string;
  model: string; // e.g. "Ruijie RG-EG105G-V2"
  ip: string;
  mac: string;
  serialNumber: string;
  role: 'GATEWAY' | 'CORE_SWITCH' | 'ACCESS_POINT_REYEE' | 'OLT_EPON';
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  latencyMs: number;
  cpuLoadPercent: number;
  memPercent: number;
  temperatureC: number;
  uptime: string;
  connectedClients: number;
  firmwareVersion: string;
  lastSyncAt: string;
}

export interface RuijieIsolirLog {
  id: string;
  pelangganId: string;
  pelangganNama: string;
  ipAddress: string;
  action: 'ISOLIR' | 'UNISOLIR';
  reason: string;
  executedBy: 'SYSTEM_CRON_AUTO' | 'DANA_WEBHOOK_INSTANT' | 'MANUAL_ADMIN';
  ruijieStatus: 'SUCCESS' | 'FAILED';
  responseTimeMs: number;
  timestamp: string;
}

export interface Teknisi {
  id: string;
  nama: string;
  phone: string;
  areaTugas: string;
  status: 'TERSEDIA' | 'DI_LOKASI' | 'OFFLINE';
  activeTaskCount: number;
  rating: number;
}

export type TiketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TiketKategori = 'LOS_MERAH' | 'KONEKSI_LAMBAT' | 'ROUTER_MATI' | 'GANTI_PASSWORD' | 'PASANG_BARU' | 'LAINNYA';

export interface TiketPesan {
  id: string;
  senderRole: UserRole | 'teknisi';
  senderName: string;
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export interface Tiket {
  id: string;
  tiketCode: string; // e.g. TKT-202610-008
  pelangganId: string;
  pelangganNama: string;
  pelangganPhone: string;
  alamat: string;
  kategori: TiketKategori;
  judul: string;
  deskripsi: string;
  prioritas: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: TiketStatus;
  assignedTeknisiId?: string;
  assignedTeknisiNama?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  pesanList: TiketPesan[];
}

export interface HotspotVoucher {
  id: string;
  code: string;
  passwordHotspot: string;
  profileName: string; // "2 Jam", "24 Jam", dll
  durasiJam: number;
  speedLimitMbps: number;
  harga: number;
  status: 'UNUSED' | 'ACTIVE' | 'EXPIRED';
  buyerName?: string;
  buyerPhone?: string;
  danaRef?: string;
  channel?: 'WHATSAPP_BOT' | 'PORTAL_WEB';
  createdAt: string;
  activatedAt?: string;
  expiredAt?: string;
}

export interface WhatsAppLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  type: 'TAGIHAN_BULANAN' | 'KWITANSI_LUNAS' | 'PERINGATAN_ISOLIR' | 'INFO_UNISOLIR' | 'TIKET_UPDATE' | 'VOUCHER_CODE';
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
  gatewayResponseId?: string;
}

export interface WhatsAppFeatureToggles {
  enableNotifAktivasi: boolean;
  enableNotifTagihan: boolean;
  enableNotifKwitansiLunas: boolean;
  enableNotifPeringatanIsolir: boolean;
  enableNotifUnisolir: boolean;
  enableNotifTiket: boolean;
  enableBotVoucherHotspot: boolean;
}

export interface WhatsAppTemplates {
  templateAktivasi: string;
  templateTagihan: string;
  templateKwitansi: string;
  templatePeringatanIsolir: string;
  templateUnisolir: string;
  templateTiketUpdate: string;
  templateVoucherSuccess: string;
}

export interface SystemSettings {
  ispName: string;
  brandShortName?: string;
  tagline: string;
  logoUrl?: string; // Base64 data URL or external URL
  logoIconType?: 'wifi' | 'globe' | 'shield' | 'zap' | 'radio' | 'cpu'; // Fallback icon type
  primaryColor?: string; // Custom theme hex color
  companyLegalName?: string; // PT / CV / Koperasi / Usaha Mandiri
  companyAddress?: string; // Alamat kantor pusat / NOC
  companyEmail?: string;
  companyPhone?: string;
  companyNpwp?: string; // NPWP / NIB usaha
  companyWebsite?: string;
  billingFooterNote?: string;
  waContactCenter: string;
  rtRwCoverage: string;
  bankAccount: string;
  bankName?: string;
  bankHolder?: string;
  danaMerchantId: string;
  danaApiKey: string;
  danaWebhookSecret: string;
  danaQrActive: boolean;
  ruijieCloudApiKey: string;
  ruijieCloudProjectId: string;
  ruijieGatewayIp: string;
  ruijieAutoIsolirHour: number; // jam 00:00 tgl jatuh tempo
  waGatewayProvider: 'FONNTE' | 'WABLAS' | 'BAILEYS' | 'WASSENGER' | 'RUANGGWA';
  waGatewayToken: string;
  waDelaySeconds: number;
  waWebhookUrl: string;
  waFeatures: WhatsAppFeatureToggles;
  waTemplates: WhatsAppTemplates;
}
