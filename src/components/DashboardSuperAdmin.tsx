import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NearDueNotificationWidget } from './NearDueNotificationWidget';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  CreditCard,
  Users,
  Server,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  Receipt,
  MessageSquare,
  CheckCircle2,
  Clock,
  Play,
  RotateCw,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowUp,
  Filter,
  BarChart3,
  TrendingDown,
  Wallet,
  Coins,
  ArrowDownRight,
  PlusCircle,
  Download,
  FileSpreadsheet,
  Building2,
  Percent,
  Trash2,
  Plus,
  FileText
} from 'lucide-react';

interface DashboardSuperAdminProps {
  setActiveTab: (tab: string) => void;
}

// Custom Tooltip component for currency formatting
const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-slate-400">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-white">
              {typeof entry.value === 'number'
                ? `Rp ${entry.value.toLocaleString('id-ID')}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for customer counts
const CustomCustomerTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-slate-400">{entry.name}:</span>
            </div>
            <span className="font-mono font-bold text-white">
              {entry.value} {entry.name.toLowerCase().includes('bandwidth') ? 'GB' : 'Warga'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Expense vs Revenue Comparison Bar Chart
const CustomExpenseComparisonTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const totalExp = (data?.listrik || 0) + (data?.maintenance || 0) + (data?.gaji || 0) + (data?.bandwidth || 0) + (data?.lainnya || 0);
    const revenue = data?.inflow || 0;
    const diff = revenue - totalExp;

    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 backdrop-blur-md min-w-[260px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-100">{label}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
            Perbandingan Opex vs Pendapatan
          </span>
        </div>

        {/* Pendapatan (Revenue) */}
        <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-lg p-2 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>Total Pendapatan:</span>
            </span>
            <span className="font-mono text-white">Rp {revenue.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Komponen Pengeluaran Operasional */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Rincian Pengeluaran Operasional:
          </div>
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1.5 text-amber-300">
              <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
              <span>Biaya Listrik PLN NOC:</span>
            </span>
            <span className="font-mono text-white font-medium">Rp {(data?.listrik || 0).toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1.5 text-orange-300">
              <span className="w-2 h-2 rounded-sm bg-orange-500"></span>
              <span>Maintenance Jaringan FO:</span>
            </span>
            <span className="font-mono text-white font-medium">Rp {(data?.maintenance || 0).toLocaleString('id-ID')}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1.5 text-purple-300">
              <span className="w-2 h-2 rounded-sm bg-purple-500"></span>
              <span>Gaji & Honor Teknisi:</span>
            </span>
            <span className="font-mono text-white font-medium">Rp {(data?.gaji || 0).toLocaleString('id-ID')}</span>
          </div>

          {(data?.bandwidth || 0) > 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center space-x-1.5 text-blue-300">
                <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
                <span>Bandwidth Upstream ISP:</span>
              </span>
              <span className="font-mono text-white font-medium">Rp {(data?.bandwidth || 0).toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="border-t border-slate-800/80 pt-1.5 flex items-center justify-between font-bold text-rose-400">
            <span>Total Pengeluaran:</span>
            <span className="font-mono text-white">Rp {totalExp.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Net Selisih */}
        <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between font-bold">
          <span className="text-slate-300">Sisa Laba Bersih:</span>
          <span className={`font-mono ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {diff >= 0 ? '+' : ''}Rp {diff.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Cash Flow Area Chart (Arus Kas Masuk vs Arus Kas Keluar)
const CustomCashFlowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const isSurplus = (data?.surplus ?? 0) >= 0;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 backdrop-blur-md min-w-[240px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-slate-100">{label}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isSurplus
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
              : 'bg-rose-950 text-rose-400 border border-rose-800/80'
          }`}>
            {isSurplus ? '✓ Kas Surplus' : '⚠ Defisit'}
          </span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Arus Masuk (Pelanggan):</span>
            </span>
            <span className="font-mono font-bold text-white">
              Rp {(data?.inflow ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Arus Keluar (Operasional):</span>
            </span>
            <span className="font-mono font-bold text-white">
              Rp {(data?.outflow ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between font-bold">
            <span className="text-sky-300">Arus Kas Bersih (Surplus):</span>
            <span className={`font-mono ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isSurplus ? '+' : ''}Rp {(data?.surplus ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Rasio Biaya Operasional (Opex):</span>
            <span className="font-mono font-semibold text-amber-300">{data?.opexRatio ?? 0}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export interface OperationalExpenseItem {
  id: string;
  category: 'BANDWIDTH_ISP' | 'LISTRIK_NOC' | 'MAINTENANCE_FO' | 'GAJI_TEKNISI' | 'LAINNYA';
  categoryLabel: string;
  title: string;
  amount: number;
  date: string;
  month: string;
  vendor: string;
  paymentMethod: string;
  note?: string;
}

const initialOperationalExpenses: OperationalExpenseItem[] = [
  // Mei 2026: Total Rp 1.350.000
  { id: 'exp-01', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Sewa Dedicated Metro Link 300 Mbps', amount: 750000, date: '2026-05-05', month: 'Mei 2026', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer Virtual Account', note: 'Kapasitas port 300 Mbps CIR 1:1' },
  { id: 'exp-02', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Token Listrik PLN NOC & Ruijie Gateway', amount: 250000, date: '2026-05-08', month: 'Mei 2026', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'Daya 3500 VA + UPS APC 1500VA' },
  { id: 'exp-03', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: 'Klem Dropcore, Fast Connector & Pigtail', amount: 150000, date: '2026-05-14', month: 'Mei 2026', vendor: 'Toko Fiber Optic Mandiri', paymentMethod: 'Tunai Kasir', note: 'Restok perlengkapan instalasi baru' },
  { id: 'exp-04', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Insentif Penarikan Kabel & Piket NOC', amount: 200000, date: '2026-05-25', month: 'Mei 2026', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'Piket operasional akhir pekan' },

  // Jun 2026: Total Rp 1.550.000
  { id: 'exp-05', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Upgrade Upstream Dedicated 400 Mbps', amount: 850000, date: '2026-06-05', month: 'Jun 2026', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer VA', note: 'Penambahan alokasi bandwidth' },
  { id: 'exp-06', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Token Listrik PLN & Pendingin Ruang NOC', amount: 260000, date: '2026-06-08', month: 'Jun 2026', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'AC NOC 1 PK 24 Jam' },
  { id: 'exp-07', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: '1 Roll Dropcore 1 Core 1000m & Closure', amount: 190000, date: '2026-06-12', month: 'Jun 2026', vendor: 'Mitra Fiber Net', paymentMethod: 'Transfer', note: 'Ekspansi jaringan RT 02' },
  { id: 'exp-08', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Honor Teknisi Lapangan & Perapihan Jalur', amount: 250000, date: '2026-06-25', month: 'Jun 2026', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'Pembersihan sambungan FO' },

  // Jul 2026: Total Rp 1.850.000
  { id: 'exp-09', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Sewa Upstream Bandwidth 500 Mbps CIR 1:1', amount: 1000000, date: '2026-07-05', month: 'Jul 2026', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer VA', note: 'Upgrade link utama' },
  { id: 'exp-10', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Token Listrik PLN NOC & Baterai UPS', amount: 280000, date: '2026-07-07', month: 'Jul 2026', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'Pemeliharaan daya cadangan' },
  { id: 'exp-11', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: 'Penggantian ODP 8 Port Tiang 12 & Patch Cord', amount: 220000, date: '2026-07-16', month: 'Jul 2026', vendor: 'Mitra Fiber Net', paymentMethod: 'Tunai Kasir', note: 'Perbaikan port redaman tinggi' },
  { id: 'exp-12', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Insentif Lembur Penanganan Gangguan Pohon Tumbang', amount: 350000, date: '2026-07-26', month: 'Jul 2026', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'Splicing ulang FO putus' },

  // Agu 2026: Total Rp 2.200.000
  { id: 'exp-13', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Sewa Dedicated Upstream 600 Mbps CIR 1:1', amount: 1200000, date: '2026-08-05', month: 'Agu 2026', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer VA', note: 'Kebutuhan streaming warga' },
  { id: 'exp-14', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Tagihan Listrik PLN NOC & Router Reyee AP', amount: 310000, date: '2026-08-08', month: 'Agu 2026', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'Daya operasional bulanan' },
  { id: 'exp-15', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: 'Pembelian 2 Box ODP 16 Port & Splicer Protection', amount: 290000, date: '2026-08-15', month: 'Agu 2026', vendor: 'Mitra Fiber Net', paymentMethod: 'Transfer', note: 'Perluasan RT 03 / RW 02' },
  { id: 'exp-16', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Uang Transport & Honor Teknisi Penanganan Tiket', amount: 400000, date: '2026-08-25', month: 'Agu 2026', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'Insentif penyelesaian tiket' },

  // Sep 2026: Total Rp 2.550.000
  { id: 'exp-17', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Sewa Dedicated Upstream 750 Mbps CIR 1:1', amount: 1350000, date: '2026-09-05', month: 'Sep 2026', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer VA', note: 'Link utama Metro Ethernet' },
  { id: 'exp-18', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Tagihan Listrik PLN NOC & Router Gateway', amount: 350000, date: '2026-09-08', month: 'Sep 2026', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'Listrik pascabayar NOC' },
  { id: 'exp-19', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: 'Kabel Dropcore 2000m & Fusion Splicer Cleaning Kit', amount: 350000, date: '2026-09-18', month: 'Sep 2026', vendor: 'Mitra Fiber Net', paymentMethod: 'Transfer', note: 'Penggantian kabel jalur barat' },
  { id: 'exp-20', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Gaji Pokok & Bonus Teknisi Penanganan Cepat', amount: 500000, date: '2026-09-25', month: 'Sep 2026', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'SLA tiket 98%' },

  // Okt 2026: Live Base Total Rp 2.850.000
  { id: 'exp-21', category: 'BANDWIDTH_ISP', categoryLabel: 'Upstream Bandwidth', title: 'Sewa Dedicated Upstream ISP 1 Gbps Metro-E', amount: 1500000, date: '2026-10-02', month: 'Okt 2026 (Live)', vendor: 'PT Fiber Media Nusantara', paymentMethod: 'Transfer Virtual Account', note: 'Kapasitas Gigabit 1:1 untuk 50+ warga' },
  { id: 'exp-22', category: 'LISTRIK_NOC', categoryLabel: 'Listrik & Daya NOC', title: 'Tagihan Listrik PLN NOC, OLT EPON & Ruijie Gateway', amount: 380000, date: '2026-10-04', month: 'Okt 2026 (Live)', vendor: 'PLN Prabayar', paymentMethod: 'DANA Tagihan', note: 'Server utama & pendingin 24 Jam' },
  { id: 'exp-23', category: 'MAINTENANCE_FO', categoryLabel: 'Pemeliharaan FO & ODP', title: 'Pembelian 2 Roll Dropcore 1000m, Fast Connector & ODP', amount: 420000, date: '2026-10-05', month: 'Okt 2026 (Live)', vendor: 'Mitra Fiber Net Sukses', paymentMethod: 'Transfer Bank', note: 'Stok pasang baru & relokasi kabel' },
  { id: 'exp-24', category: 'GAJI_TEKNISI', categoryLabel: 'Honor Teknisi & Transport', title: 'Gaji Pokok Teknisi Lapangan & Transport Patroli ODP', amount: 550000, date: '2026-10-06', month: 'Okt 2026 (Live)', vendor: 'Tim Teknisi Lapangan', paymentMethod: 'Transfer Bank', note: 'Patroli jalur fiber & SLA di bawah 30 menit' },
];

export const DashboardSuperAdmin: React.FC<DashboardSuperAdminProps> = ({ setActiveTab }) => {
  const {
    pelangganList,
    tagihanList,
    transaksiList,
    ruijieDevices,
    ruijieLogs,
    tiketList,
    generateTagihanBulanBaru,
    aktivasiPelanggan,
    setSelectedTagihanForPayment,
    packages,
    settings
  } = useApp();

  const [cronRunning, setCronRunning] = useState(false);
  const [cronMessage, setCronMessage] = useState<string | null>(null);
  const [revenueFilter, setRevenueFilter] = useState<'ALL' | 'DANA_ONLY' | 'VOUCHER'>('ALL');
  const [chartTimeframe, setChartTimeframe] = useState<'6M' | '3M'>('6M');
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  // Laporan Keuangan Bulanan (Arus Kas Masuk vs Keluar) State
  const [operationalExpenses, setOperationalExpenses] = useState<OperationalExpenseItem[]>(initialOperationalExpenses);
  const [financialTimeframe, setFinancialTimeframe] = useState<'6M' | '3M'>('6M');
  const [showSurplusLine, setShowSurplusLine] = useState<boolean>(true);
  const [financialActiveTab, setFinancialActiveTab] = useState<'chart' | 'comparison' | 'breakdown' | 'table'>('comparison');
  const [comparisonBarMode, setComparisonBarMode] = useState<'stacked' | 'grouped'>('grouped');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<boolean>(false);
  const [expenseSuccessToast, setExpenseSuccessToast] = useState<string | null>(null);

  // New Expense Form State
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCategory, setNewExpCategory] = useState<'BANDWIDTH_ISP' | 'LISTRIK_NOC' | 'MAINTENANCE_FO' | 'GAJI_TEKNISI' | 'LAINNYA'>('BANDWIDTH_ISP');
  const [newExpAmount, setNewExpAmount] = useState<string>('');
  const [newExpVendor, setNewExpVendor] = useState('');
  const [newExpDate, setNewExpDate] = useState('2026-10-08');
  const [newExpNote, setNewExpNote] = useState('');
  const [newExpPaymentMethod, setNewExpPaymentMethod] = useState('Transfer Virtual Account');

  // Filter for expense list table
  const [expenseFilterCategory, setExpenseFilterCategory] = useState<string>('ALL');

  // Real-time Financial metrics calculation
  const totalRevenueThisMonth = transaksiList.reduce((acc, curr) => acc + curr.nominal, 0);
  const totalNetRevenue = transaksiList.reduce((acc, curr) => acc + curr.netRevenue, 0);
  const totalFees = transaksiList.reduce((acc, curr) => acc + curr.feeGateway, 0);

  const unpaidBills = tagihanList.filter(t => t.status === 'unpaid' || t.status === 'isolated');
  const totalUnpaidNominal = unpaidBills.reduce((acc, curr) => acc + curr.total, 0);

  const activePelanggan = pelangganList.filter(p => p.status === 'active').length;
  const isolatedPelanggan = pelangganList.filter(p => p.status === 'isolated').length;
  const pendingPelanggan = pelangganList.filter(p => p.status === 'pending');

  // Build Real-Time Monthly Revenue Trend Data (combining historical baseline + live October data)
  const monthlyRevenueData = useMemo(() => {
    // Current live October dynamic calculations
    const danaTrxMonth = transaksiList
      .filter(t => t.method === 'DANA_QRIS' || t.method === 'DANA_WALLET')
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const voucherTrxMonth = transaksiList
      .filter(t => t.tipe === 'VOUCHER_HOTSPOT')
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const cashTrxMonth = transaksiList
      .filter(t => t.method === 'TUNAI_KASIR')
      .reduce((acc, curr) => acc + curr.nominal, 0);

    const baseData = [
      {
        month: 'Mei 2026',
        totalRevenue: 2850000,
        netRevenue: 2830000,
        danaRevenue: 1950000,
        voucherRevenue: 350000,
        cashRevenue: 550000,
      },
      {
        month: 'Jun 2026',
        totalRevenue: 3420000,
        netRevenue: 3395000,
        danaRevenue: 2500000,
        voucherRevenue: 420000,
        cashRevenue: 500000,
      },
      {
        month: 'Jul 2026',
        totalRevenue: 4180000,
        netRevenue: 4150000,
        danaRevenue: 3200000,
        voucherRevenue: 480000,
        cashRevenue: 500000,
      },
      {
        month: 'Agu 2026',
        totalRevenue: 5120000,
        netRevenue: 5085000,
        danaRevenue: 4100000,
        voucherRevenue: 520000,
        cashRevenue: 500000,
      },
      {
        month: 'Sep 2026',
        totalRevenue: 5950000,
        netRevenue: 5910000,
        danaRevenue: 4850000,
        voucherRevenue: 600000,
        cashRevenue: 500000,
      },
      {
        month: 'Okt 2026 (Live)',
        // Dynamically incorporates any new DANA or cash transaction added in the app!
        totalRevenue: Math.max(6800000, 6000000 + totalRevenueThisMonth),
        netRevenue: Math.max(6740000, 5950000 + totalNetRevenue),
        danaRevenue: Math.max(5400000, 4800000 + danaTrxMonth),
        voucherRevenue: Math.max(750000, 700000 + voucherTrxMonth),
        cashRevenue: Math.max(650000, 500000 + cashTrxMonth),
      },
    ];

    return chartTimeframe === '3M' ? baseData.slice(3) : baseData;
  }, [totalRevenueThisMonth, totalNetRevenue, transaksiList, chartTimeframe]);

  // Real-Time Customer Growth and Status Trend Data
  const customerTrendData = useMemo(() => {
    const totalBandwidth = pelangganList.reduce((acc, curr) => acc + (curr.bandwidthUsageGb || 0), 0);

    return [
      { period: 'Mei 2026', aktif: 18, isolir: 1, pending: 2, bandwidthGb: 820 },
      { period: 'Jun 2026', aktif: 24, isolir: 2, pending: 1, bandwidthGb: 1140 },
      { period: 'Jul 2026', aktif: 32, isolir: 1, pending: 3, bandwidthGb: 1480 },
      { period: 'Agu 2026', aktif: 38, isolir: 3, pending: 2, bandwidthGb: 1890 },
      { period: 'Sep 2026', aktif: 45, isolir: 2, pending: 1, bandwidthGb: 2210 },
      {
        period: 'Okt 2026 (Real-Time)',
        // Dynamic based on live state!
        aktif: 45 + activePelanggan,
        isolir: isolatedPelanggan,
        pending: pendingPelanggan.length,
        bandwidthGb: Math.round(2300 + totalBandwidth),
      },
    ];
  }, [activePelanggan, isolatedPelanggan, pendingPelanggan.length, pelangganList]);

  // Package Distribution & Market Share Donut Chart
  const packageShareData = useMemo(() => {
    const colors = ['#0284c7', '#0d9488', '#f59e0b', '#6366f1'];
    return packages.map((pkg, idx) => {
      const count = pelangganList.filter(p => p.packageId === pkg.id).length;
      return {
        name: pkg.name,
        value: count,
        speed: `${pkg.speedMbps} Mbps`,
        color: colors[idx % colors.length],
      };
    });
  }, [packages, pelangganList]);

  // Payment Gateway Composition Data
  const paymentMethodData = useMemo(() => {
    let danaCount = 0;
    let walletCount = 0;
    let cashCount = 0;

    transaksiList.forEach(t => {
      if (t.method === 'DANA_QRIS') danaCount += t.nominal;
      else if (t.method === 'DANA_WALLET') walletCount += t.nominal;
      else cashCount += t.nominal;
    });

    return [
      { name: 'DANA QRIS (0.7%)', value: danaCount || 650000, color: '#118EEA' },
      { name: 'DANA E-Wallet', value: walletCount || 395000, color: '#38bdf8' },
      { name: 'Kasir Tunai / Kolektor', value: cashCount || 250000, color: '#10b981' },
    ];
  }, [transaksiList]);

  // ========================================================
  // LAPORAN KEUANGAN BULANAN: ARUS KAS MASUK VS KELUAR
  // ========================================================
  const monthlyCashFlowData = useMemo(() => {
    // Current October Live Inflow from Customer Payments & Vouchers
    const liveOctoberInflow = Math.max(6800000, 6000000 + totalRevenueThisMonth);

    // Baseline historical inflows
    const monthlyInflows: { [key: string]: number } = {
      'Mei 2026': 2850000,
      'Jun 2026': 3420000,
      'Jul 2026': 4180000,
      'Agu 2026': 5120000,
      'Sep 2026': 5950000,
      'Okt 2026 (Live)': liveOctoberInflow,
    };

    const months = ['Mei 2026', 'Jun 2026', 'Jul 2026', 'Agu 2026', 'Sep 2026', 'Okt 2026 (Live)'];

    const result = months.map(month => {
      const monthExpenses = operationalExpenses.filter(e => {
        if (month === 'Okt 2026 (Live)') {
          return e.month === 'Okt 2026 (Live)' || e.month === 'Okt 2026';
        }
        return e.month === month;
      });

      const totalOutflow = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
      const totalInflow = monthlyInflows[month] || 0;
      const surplus = totalInflow - totalOutflow;
      const opexRatio = totalInflow > 0 ? Math.round((totalOutflow / totalInflow) * 100) : 0;
      const profitMargin = totalInflow > 0 ? Math.round((surplus / totalInflow) * 100) : 0;

      // Category breakdowns
      const bandwidthOutflow = monthExpenses
        .filter(e => e.category === 'BANDWIDTH_ISP')
        .reduce((sum, item) => sum + item.amount, 0);
      const listrikOutflow = monthExpenses
        .filter(e => e.category === 'LISTRIK_NOC')
        .reduce((sum, item) => sum + item.amount, 0);
      const maintenanceOutflow = monthExpenses
        .filter(e => e.category === 'MAINTENANCE_FO')
        .reduce((sum, item) => sum + item.amount, 0);
      const gajiOutflow = monthExpenses
        .filter(e => e.category === 'GAJI_TEKNISI')
        .reduce((sum, item) => sum + item.amount, 0);
      const lainnyaOutflow = monthExpenses
        .filter(e => e.category === 'LAINNYA')
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        month,
        inflow: totalInflow,
        outflow: totalOutflow,
        surplus,
        opexRatio,
        profitMargin,
        bandwidth: bandwidthOutflow,
        listrik: listrikOutflow,
        maintenance: maintenanceOutflow,
        gaji: gajiOutflow,
        lainnya: lainnyaOutflow,
        expenseCount: monthExpenses.length,
      };
    });

    return financialTimeframe === '3M' ? result.slice(3) : result;
  }, [operationalExpenses, totalRevenueThisMonth, financialTimeframe]);

  // Executive Financial KPI Summary
  const financialSummary = useMemo(() => {
    const totalInflowPeriod = monthlyCashFlowData.reduce((acc, curr) => acc + curr.inflow, 0);
    const totalOutflowPeriod = monthlyCashFlowData.reduce((acc, curr) => acc + curr.outflow, 0);
    const totalSurplusPeriod = totalInflowPeriod - totalOutflowPeriod;
    const avgOpexRatio = totalInflowPeriod > 0 ? Math.round((totalOutflowPeriod / totalInflowPeriod) * 100) : 0;
    const avgProfitMargin = totalInflowPeriod > 0 ? Math.round((totalSurplusPeriod / totalInflowPeriod) * 100) : 0;

    // Current Live October figures
    const currentMonthData = monthlyCashFlowData[monthlyCashFlowData.length - 1];

    return {
      totalInflowPeriod,
      totalOutflowPeriod,
      totalSurplusPeriod,
      avgOpexRatio,
      avgProfitMargin,
      currentMonthInflow: currentMonthData?.inflow || 0,
      currentMonthOutflow: currentMonthData?.outflow || 0,
      currentMonthSurplus: currentMonthData?.surplus || 0,
      currentMonthOpexRatio: currentMonthData?.opexRatio || 0,
    };
  }, [monthlyCashFlowData]);

  // Cost breakdown by category for the period
  const expenseCategoryBreakdown = useMemo(() => {
    const categories = [
      { key: 'BANDWIDTH_ISP', name: 'Upstream Bandwidth Dedicated', color: '#0284c7' },
      { key: 'LISTRIK_NOC', name: 'Listrik & Pendingin NOC', color: '#f59e0b' },
      { key: 'MAINTENANCE_FO', name: 'Pemeliharaan FO & ODP', color: '#8b5cf6' },
      { key: 'GAJI_TEKNISI', name: 'Honor & Transport Teknisi', color: '#10b981' },
      { key: 'LAINNYA', name: 'Gateway & Software Lisensi', color: '#64748b' },
    ];

    const currentMonths = monthlyCashFlowData.map(d => d.month);
    const relevantExpenses = operationalExpenses.filter(e => 
      currentMonths.some(m => m.startsWith(e.month.replace(' (Live)', '')))
    );

    const totalExpense = relevantExpenses.reduce((sum, e) => sum + e.amount, 0);

    return categories.map(cat => {
      const amount = relevantExpenses
        .filter(e => e.category === cat.key)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return {
        ...cat,
        amount,
        percentage,
      };
    });
  }, [operationalExpenses, monthlyCashFlowData]);

  // Handler: Add new operational expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(newExpAmount.replace(/[^0-9]/g, ''), 10);
    if (!newExpTitle.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert('Mohon isi judul pengeluaran dan nominal dengan benar.');
      return;
    }

    const categoryLabels: { [key: string]: string } = {
      BANDWIDTH_ISP: 'Upstream Bandwidth',
      LISTRIK_NOC: 'Listrik & Daya NOC',
      MAINTENANCE_FO: 'Pemeliharaan FO & ODP',
      GAJI_TEKNISI: 'Honor Teknisi & Transport',
      LAINNYA: 'Operasional Lainnya',
    };

    const newExpense: OperationalExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newExpCategory,
      categoryLabel: categoryLabels[newExpCategory] || 'Operasional',
      title: newExpTitle.trim(),
      amount: amountNum,
      date: newExpDate || new Date().toISOString().split('T')[0],
      month: 'Okt 2026 (Live)',
      vendor: newExpVendor.trim() || 'Internal RT/RW Net',
      paymentMethod: newExpPaymentMethod,
      note: newExpNote.trim() || undefined,
    };

    setOperationalExpenses(prev => [newExpense, ...prev]);
    setShowAddExpenseModal(false);
    setNewExpTitle('');
    setNewExpAmount('');
    setNewExpVendor('');
    setNewExpNote('');
    setExpenseSuccessToast(`Berhasil mencatat biaya operasional: ${newExpense.title} (Rp ${amountNum.toLocaleString('id-ID')})`);
    setTimeout(() => setExpenseSuccessToast(null), 4000);
  };

  // Handler: Delete expense item
  const handleDeleteExpense = (id: string, title: string) => {
    if (window.confirm(`Hapus catatan biaya operasional "${title}"?`)) {
      setOperationalExpenses(prev => prev.filter(e => e.id !== id));
      setExpenseSuccessToast(`Biaya operasional "${title}" berhasil dihapus.`);
      setTimeout(() => setExpenseSuccessToast(null), 3000);
    }
  };

  // Handler: Download Financial Report as CSV
  const handleDownloadFinancialReport = () => {
    const headers = ['Periode', 'Kas Masuk (Rp)', 'Kas Keluar (Rp)', 'Arus Kas Bersih (Rp)', 'Rasio Opex (%)', 'Margin Bersih (%)'];
    const rows = monthlyCashFlowData.map(d => [
      d.month,
      d.inflow,
      d.outflow,
      d.surplus,
      `${d.opexRatio}%`,
      `${d.profitMargin}%`
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `LAPORAN ARUS KAS KEUANGAN BULANAN - ${(settings.companyLegalName || settings.ispName || 'ANUWANI RT/RW NET').toUpperCase()}\n`;
    csvContent += `Dicetak pada: ${new Date().toLocaleString('id-ID')}\n\n`;
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    csvContent += `\nTOTAL PERIODE,${financialSummary.totalInflowPeriod},${financialSummary.totalOutflowPeriod},${financialSummary.totalSurplusPeriod},${financialSummary.avgOpexRatio}%,${financialSummary.avgProfitMargin}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Keuangan_Bulanan_RTRWNet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger manual Cron Auto-Isolir Simulation
  const handleRunAutoIsolirCron = () => {
    setCronRunning(true);
    setCronMessage(null);
    setTimeout(() => {
      setCronRunning(false);
      setCronMessage(`Cron Job Berhasil: Memeriksa ${tagihanList.length} tagihan. Sinkronisasi Ruijie Reyee Cloud selesai.`);
    }, 900);
  };

  return (
    <div className="space-y-6 transition-all duration-300">
      
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandShortName || settings.ispName}
                className="w-8 h-8 rounded-lg object-contain bg-slate-100 p-0.5 border border-slate-200"
              />
            ) : null}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Super Admin & NOC
            </h1>
            <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Telemetry Live</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 flex items-center space-x-1.5">
            <span className="font-semibold text-sky-700">{settings.companyLegalName || settings.ispName || 'Anuwani RT/RW NET'}</span>
            <span>•</span>
            <span>{settings.tagline || 'Monitoring finansial & auto-isolir Ruijie Reyee Cloud terintegrasi.'}</span>
          </p>
        </div>

        {/* Quick Operations Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-sky-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            title="Kelola Identitas Usaha, Logo & Pengaturan Sistem"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Pengaturan Branding</span>
          </button>

          <button
            onClick={handleRunAutoIsolirCron}
            disabled={cronRunning}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Eksekusi script cron job auto-isolir pelanggan jatuh tempo"
          >
            {cronRunning ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{cronRunning ? 'Memproses Cron...' : 'Trigger Cron Auto-Isolir'}</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold hover:bg-sky-500 transition-all shadow-sm active:scale-95"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Generate Tagihan</span>
          </button>
        </div>
      </div>

      {cronMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{cronMessage}</span>
          </div>
          <button onClick={() => setCronMessage(null)} className="text-emerald-700 font-bold text-xs hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Real-time Notification System: Pelanggan Mendekati Jatuh Tempo (H-3) */}
      <NearDueNotificationWidget onOpenBilling={() => setActiveTab('billing')} />

      {/* Primary Financial & Operational Metrics (Smooth Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Pendapatan Bulan Ini */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Pendapatan Terkumpul</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 tracking-tight">
            Rp {totalRevenueThisMonth.toLocaleString('id-ID')}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 flex items-center space-x-1.5">
            <span className="text-emerald-600 font-semibold inline-flex items-center text-[11px]">
              <ArrowUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
            <span aria-hidden="true">·</span>
            <span>Net: <strong className="text-slate-700">Rp {totalNetRevenue.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {/* Metric 2: Piutang / Belum Terbayar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tagihan Tertunda (Outstanding)</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-700 tracking-tight">
            Rp {totalUnpaidNominal.toLocaleString('id-ID')}
          </div>
          <div className="mt-1.5 text-xs text-slate-500">
            <span>{unpaidBills.length} tagihan</span>
            <span aria-hidden="true"> · </span>
            <span className="text-amber-700 font-medium">Jatuh tempo tgl 10</span>
          </div>
        </div>

        {/* Metric 3: Pelanggan Aktif & Isolir */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Status Pelanggan RT/RW</span>
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{activePelanggan}</span>
            <span className="text-xs text-emerald-600 font-bold">Aktif</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-2xl font-extrabold text-rose-600">{isolatedPelanggan}</span>
            <span className="text-xs text-rose-600 font-bold">Isolir</span>
          </div>
          <div className="mt-1.5 text-xs text-slate-500">
            Total {pelangganList.length} warga terdaftar di jaringan
          </div>
        </div>

        {/* Metric 4: Ruijie Reyee Cloud NOC */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Infrastruktur Ruijie Reyee</span>
            <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>{ruijieDevices.length} Hardware</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              ONLINE
            </span>
          </div>
          <div className="mt-1.5 text-xs text-slate-500">
            Latency Avg: 1.8ms · Gateway RG-EG105G
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* DATA VISUALIZATION SECTION (RECHARTS INTEGRATION)        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Chart 1: Tren Pendapatan Bulanan & Arus Kas (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-sm bg-sky-600"></div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Tren Pendapatan Bulanan & Arus Kas Real-Time
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi grafik batang omset billing bulanan, penerimaan bersih & saluran gateway DANA
                </p>
              </div>

              {/* Chart Controls (Chart Mode Toggle & Timeframe) */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Bar / Area Toggle */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                      chartType === 'bar' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Diagram Batang Pendapatan Billing"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Bar Chart</span>
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                      chartType === 'area' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grafik Area Luas"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Area</span>
                  </button>
                </div>

                {/* Timeframe Controls */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setChartTimeframe('6M')}
                    className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                      chartTimeframe === '6M' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    6 Bulan
                  </button>
                  <button
                    onClick={() => setChartTimeframe('3M')}
                    className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                      chartTimeframe === '3M' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    3 Bulan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Chart Legend / Metric Indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-3 pb-1 text-xs text-slate-600">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-sky-600"></span>
                <span className="font-medium text-slate-700">Total Pendapatan (Rp)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                <span className="font-medium text-slate-700">Net Masuk Kas</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
                <span className="font-medium text-slate-700">Gateway DANA QRIS</span>
              </div>
            </div>

            {/* Recharts BarChart & AreaChart Container */}
            <div className="w-full h-72 sm:h-80 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart
                    data={monthlyRevenueData}
                    margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                    />
                    <Tooltip content={<CustomCurrencyTooltip />} />
                    <Bar
                      dataKey="totalRevenue"
                      name="Total Pendapatan"
                      fill="#0284c7"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={38}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="netRevenue"
                      name="Net Bersih"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={38}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="danaRevenue"
                      name="Via DANA QRIS"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={38}
                      animationDuration={800}
                    />
                  </BarChart>
                ) : (
                  <AreaChart
                    data={monthlyRevenueData}
                    margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorDana" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#cbd5e1' }}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                    />
                    <Tooltip content={<CustomCurrencyTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="totalRevenue"
                      name="Total Pendapatan"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                      animationDuration={800}
                    />
                    <Area
                      type="monotone"
                      dataKey="netRevenue"
                      name="Net Bersih"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNet)"
                      animationDuration={800}
                    />
                    <Area
                      type="monotone"
                      dataKey="danaRevenue"
                      name="Via DANA QRIS"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorDana)"
                      animationDuration={800}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sumber data: Ledger Transaksi DANA & Tagihan Lunas</span>
            <span className="text-emerald-700 font-semibold">Tingkat Penagihan Lunas: 92.4%</span>
          </div>
        </div>

        {/* Chart 2: Komposisi Paket & Metode Pembayaran (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Pangsa Metode Bayar & Paket
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dominasi saluran pembayaran DANA QRIS & E-Wallet
              </p>
            </div>

            {/* Donut Chart */}
            <div className="w-full h-52 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomCurrencyTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
              {paymentMethodData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    Rp {item.value.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Verifikasi otomatis tanpa mutasi manual bank
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* LAPORAN KEUANGAN BULANAN: ARUS KAS MASUK VS ARUS KAS KELUAR */}
      {/* VISUALISASI RECHARTS AREA CHART                         */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
        
        {/* Toast Notifikasi Sukses */}
        {expenseSuccessToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{expenseSuccessToast}</span>
            </div>
            <button
              onClick={() => setExpenseSuccessToast(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Laporan Keuangan Bulanan & Analisis Biaya Operasional
                  </h2>
                  <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Arus Kas & Opex Real-Time
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi grafik bar perbandingan pendapatan vs pengeluaran operasional (listrik, maintenance FO, gaji teknisi) & grafik area arus kas
                </p>
              </div>
            </div>
          </div>

          {/* Action & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Switcher Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFinancialActiveTab('comparison')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialActiveTab === 'comparison'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar Chart Opex vs Pendapatan</span>
              </button>
              <button
                onClick={() => setFinancialActiveTab('chart')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialActiveTab === 'chart'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Grafik Area Arus Kas</span>
              </button>
              <button
                onClick={() => setFinancialActiveTab('breakdown')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialActiveTab === 'breakdown'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Struktur Biaya</span>
              </button>
              <button
                onClick={() => setFinancialActiveTab('table')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialActiveTab === 'table'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buku Kas</span>
              </button>
            </div>

            {/* Timeframe 6M vs 3M */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFinancialTimeframe('6M')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialTimeframe === '6M'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                6 Bulan
              </button>
              <button
                onClick={() => setFinancialTimeframe('3M')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors text-[11px] ${
                  financialTimeframe === '3M'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                3 Bulan
              </button>
            </div>

            {/* Toggle Garis Surplus Bersih */}
            <button
              onClick={() => setShowSurplusLine(!showSurplusLine)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                showSurplusLine
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Tampilkan / Sembunyikan garis arus kas bersih surplus"
            >
              <Coins className="w-3.5 h-3.5 text-sky-600" />
              <span>Garis Surplus</span>
            </button>

            {/* Action Buttons: Add Expense & Download */}
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Catat Biaya</span>
            </button>

            <button
              onClick={handleDownloadFinancialReport}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
              title="Unduh laporan keuangan bulanan dalam format CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Executive Summary Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Arus Kas Masuk */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
              <span>Total Kas Masuk (Inflow)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              Rp {financialSummary.totalInflowPeriod.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Bulan ini: Rp {financialSummary.currentMonthInflow.toLocaleString('id-ID')}</span>
              <span className="text-emerald-700 font-bold flex items-center">
                <ArrowUp className="w-3 h-3 mr-0.5 text-emerald-600" />
                100% Lunas
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-100/80 text-[10px] text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Pembayaran tagihan pelanggan & voucher DANA</span>
            </div>
          </div>

          {/* Card 2: Total Arus Kas Keluar */}
          <div className="bg-gradient-to-br from-rose-50/70 via-white to-slate-50 rounded-2xl border border-rose-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-rose-800 font-semibold">
              <span>Total Kas Keluar (Outflow)</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              Rp {financialSummary.totalOutflowPeriod.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Bulan ini: Rp {financialSummary.currentMonthOutflow.toLocaleString('id-ID')}</span>
              <span className="text-rose-700 font-bold">
                {financialSummary.avgOpexRatio}% Beban
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-rose-100/80 text-[10px] text-rose-700 flex items-center space-x-1">
              <Activity className="w-3 h-3 text-rose-500" />
              <span>Sewa bandwidth, listrik NOC, FO & honor teknisi</span>
            </div>
          </div>

          {/* Card 3: Arus Kas Bersih (Surplus) */}
          <div className="bg-gradient-to-br from-sky-50/70 via-white to-slate-50 rounded-2xl border border-sky-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-sky-800 font-semibold">
              <span>Arus Kas Bersih (Surplus)</span>
              <Coins className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight">
              +Rp {financialSummary.totalSurplusPeriod.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Margin Laba Kas:</span>
              <span className="text-emerald-700 font-bold">
                {financialSummary.avgProfitMargin}% Margin
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-sky-100/80 text-[10px] text-sky-800 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-sky-500" />
              <span>Likuiditas kas RT/RW Net positif & stabil</span>
            </div>
          </div>

          {/* Card 4: Rasio Efisiensi Opex */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-slate-50 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold">
              <span>Rasio Beban Operasional</span>
              <Percent className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              {financialSummary.avgOpexRatio}%
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Target Aman: &lt; 50%</span>
              <span className="text-emerald-700 font-bold">Kategori Sehat</span>
            </div>
            <div className="mt-2 pt-2 border-t border-amber-100/80">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, financialSummary.avgOpexRatio)}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Baru: Visualisasi Bar Chart Perbandingan Pengeluaran Operasional vs Pendapatan */}
        {financialActiveTab === 'comparison' && (
          <div className="space-y-4">
            
            {/* Header Kontrol & Legend untuk Bar Chart */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 text-xs border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Legend Pendapatan */}
                <div className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <div className="w-3.5 h-3 rounded-xs bg-emerald-500 shadow-xs"></div>
                  <span className="font-bold text-emerald-900">
                    Pendapatan (Tagihan & Voucher)
                  </span>
                </div>

                {/* Legend Listrik PLN */}
                <div className="flex items-center space-x-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <div className="w-3.5 h-3 rounded-xs bg-amber-500 shadow-xs"></div>
                  <span className="font-bold text-amber-900">
                    Biaya Listrik PLN NOC
                  </span>
                </div>

                {/* Legend Maintenance FO */}
                <div className="flex items-center space-x-1.5 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                  <div className="w-3.5 h-3 rounded-xs bg-orange-500 shadow-xs"></div>
                  <span className="font-bold text-orange-900">
                    Maintenance Jaringan FO
                  </span>
                </div>

                {/* Legend Gaji Teknisi */}
                <div className="flex items-center space-x-1.5 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  <div className="w-3.5 h-3 rounded-xs bg-purple-500 shadow-xs"></div>
                  <span className="font-bold text-purple-900">
                    Gaji & Honor Teknisi
                  </span>
                </div>

                {/* Legend Bandwidth Upstream */}
                <div className="flex items-center space-x-1.5 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  <div className="w-3.5 h-3 rounded-xs bg-sky-500 shadow-xs"></div>
                  <span className="font-bold text-sky-900">
                    Sewa Bandwidth ISP
                  </span>
                </div>
              </div>

              {/* Tampilan Bar Mode: Berdampingan (Grouped) vs Bertumpuk (Stacked) */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 font-medium">Model Bar:</span>
                <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[11px]">
                  <button
                    onClick={() => setComparisonBarMode('grouped')}
                    className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                      comparisonBarMode === 'grouped'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Berdampingan (Grouped)
                  </button>
                  <button
                    onClick={() => setComparisonBarMode('stacked')}
                    className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                      comparisonBarMode === 'stacked'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Komposisi Bertumpuk (Stacked)
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart Perbandingan Opex vs Pendapatan */}
            <div className="w-full h-80 sm:h-96 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyCashFlowData}
                  margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip content={<CustomExpenseComparisonTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />

                  {/* Bar 1: Total Pendapatan Masuk */}
                  <Bar
                    dataKey="inflow"
                    name="Pendapatan Masuk"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />

                  {/* Bar Komponen Biaya Operasional */}
                  {comparisonBarMode === 'stacked' ? (
                    <>
                      <Bar
                        dataKey="bandwidth"
                        name="Bandwidth ISP"
                        stackId="opexStack"
                        fill="#0284c7"
                        maxBarSize={40}
                      />
                      <Bar
                        dataKey="listrik"
                        name="Biaya Listrik PLN NOC"
                        stackId="opexStack"
                        fill="#f59e0b"
                        maxBarSize={40}
                      />
                      <Bar
                        dataKey="maintenance"
                        name="Maintenance FO & ODP"
                        stackId="opexStack"
                        fill="#f97316"
                        maxBarSize={40}
                      />
                      <Bar
                        dataKey="gaji"
                        name="Gaji & Honor Teknisi"
                        stackId="opexStack"
                        fill="#a855f7"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </>
                  ) : (
                    <>
                      <Bar
                        dataKey="listrik"
                        name="Biaya Listrik PLN"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="maintenance"
                        name="Maintenance Jaringan FO"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="gaji"
                        name="Gaji & Honor Teknisi"
                        fill="#a855f7"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="bandwidth"
                        name="Bandwidth ISP"
                        fill="#0284c7"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={28}
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Cards: Perbandingan Pengeluaran Kunci vs Pendapatan Bulan Ini */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              
              {/* Box 1: Biaya Listrik PLN */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Biaya Listrik PLN NOC</span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-mono">
                    {monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow > 0
                      ? `${Math.round(((monthlyCashFlowData[monthlyCashFlowData.length - 1]?.listrik || 0) / monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow) * 100)}% dari omset`
                      : '0%'}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-slate-900">
                  Rp {(monthlyCashFlowData[monthlyCashFlowData.length - 1]?.listrik || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-amber-700/90 leading-tight">
                  Konsumsi listrik server OLT, router Ruijie, AC NOC & UPS 24 jam nonstop.
                </div>
              </div>

              {/* Box 2: Maintenance Jaringan FO */}
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-orange-800 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <span>Maintenance FO & ODP</span>
                  </div>
                  <span className="text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded-full font-mono">
                    {monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow > 0
                      ? `${Math.round(((monthlyCashFlowData[monthlyCashFlowData.length - 1]?.maintenance || 0) / monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow) * 100)}% dari omset`
                      : '0%'}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-slate-900">
                  Rp {(monthlyCashFlowData[monthlyCashFlowData.length - 1]?.maintenance || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-orange-700/90 leading-tight">
                  Kabel dropcore, fast connector, box ODP, sleeve splicer & pemeliharaan tiang.
                </div>
              </div>

              {/* Box 3: Gaji & Honor Teknisi */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-purple-800 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Gaji & Honor Teknisi</span>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded-full font-mono">
                    {monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow > 0
                      ? `${Math.round(((monthlyCashFlowData[monthlyCashFlowData.length - 1]?.gaji || 0) / monthlyCashFlowData[monthlyCashFlowData.length - 1]?.inflow) * 100)}% dari omset`
                      : '0%'}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-slate-900">
                  Rp {(monthlyCashFlowData[monthlyCashFlowData.length - 1]?.gaji || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-purple-700/90 leading-tight">
                  Honor teknisi instalasi baru, patroli redaman kabel FO & piket respon gangguan.
                </div>
              </div>

              {/* Box 4: Total Sisa Keuntungan Bersih Bulan Ini */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span>Sisa Kas Bersih (Surplus)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">
                    {monthlyCashFlowData[monthlyCashFlowData.length - 1]?.profitMargin}% Margin
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-emerald-700">
                  +Rp {(monthlyCashFlowData[monthlyCashFlowData.length - 1]?.surplus || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-[11px] text-emerald-700/90 leading-tight">
                  Surplus pendapatan setelah dikurangi total biaya operasional bulan berjalan.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 1: Grafik Area Arus Kas Masuk vs Keluar */}
        {financialActiveTab === 'chart' && (
          <div className="space-y-4">
            
            {/* Legend & Summary Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3 rounded-sm bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs"></div>
                  <span className="font-semibold text-slate-800">
                    Arus Kas Masuk (Pembayaran Pelanggan)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3 rounded-sm bg-gradient-to-r from-rose-500 to-red-500 shadow-xs"></div>
                  <span className="font-semibold text-slate-800">
                    Arus Kas Keluar (Biaya Operasional)
                  </span>
                </div>
                {showSurplusLine && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 border-t-2 border-dashed border-sky-500"></div>
                    <span className="font-semibold text-sky-800">
                      Arus Kas Bersih / Surplus
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Satuan: Rupiah (Rp jt) · Data Historis & Telemetri Real-Time
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-72 sm:h-80 md:h-96 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyCashFlowData}
                  margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCashInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="colorCashOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.40} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="colorCashSurplus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(1)}jt`}
                    tickLine={false}
                    axisLine={false}
                    width={68}
                  />
                  <Tooltip content={<CustomCashFlowTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    name="Arus Kas Masuk (Pelanggan)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCashInflow)"
                    animationDuration={800}
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    name="Arus Kas Keluar (Operasional)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCashOutflow)"
                    animationDuration={800}
                  />
                  {showSurplusLine && (
                    <Area
                      type="monotone"
                      dataKey="surplus"
                      name="Arus Kas Bersih (Surplus)"
                      stroke="#0284c7"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#colorCashSurplus)"
                      animationDuration={800}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Monthly Comparison Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
              {monthlyCashFlowData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-2.5 border border-slate-200/70 transition-all text-xs space-y-1"
                >
                  <div className="font-bold text-slate-800 text-[11px] truncate">
                    {item.month}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 font-semibold">Masuk:</span>
                    <span className="font-mono text-slate-900">
                      Rp {(item.inflow / 1000000).toFixed(2)}jt
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-rose-700 font-semibold">Keluar:</span>
                    <span className="font-mono text-slate-900">
                      Rp {(item.outflow / 1000000).toFixed(2)}jt
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-1 flex items-center justify-between text-[10px] font-bold">
                    <span className="text-sky-800">Net:</span>
                    <span className="font-mono text-emerald-700">
                      +Rp {(item.surplus / 1000000).toFixed(2)}jt
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: Struktur & Pos Biaya Operasional */}
        {financialActiveTab === 'breakdown' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>Alokasi pengeluaran operasional per kategori cost center untuk periode terpilih</span>
              <span className="font-semibold text-slate-700">
                Total Opex: Rp {financialSummary.totalOutflowPeriod.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseCategoryBreakdown.map((cat, idx) => {
                const IconComponent = cat.key === 'BANDWIDTH_ISP' ? Server :
                                      cat.key === 'LISTRIK_NOC' ? Zap :
                                      cat.key === 'MAINTENANCE_FO' ? Activity :
                                      cat.key === 'GAJI_TEKNISI' ? Users : Layers;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs text-slate-900">{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        Rp {cat.amount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Porsi Beban Operasional:</span>
                      <span className="font-bold font-mono text-slate-700">{cat.percentage}%</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Buku Kas & Riwayat Pengeluaran */}
        {financialActiveTab === 'table' && (
          <div className="space-y-3">
            {/* Filter Kategori Pengeluaran */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {['ALL', 'BANDWIDTH_ISP', 'LISTRIK_NOC', 'MAINTENANCE_FO', 'GAJI_TEKNISI'].map((catKey) => (
                  <button
                    key={catKey}
                    onClick={() => setExpenseFilterCategory(catKey)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      expenseFilterCategory === catKey
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {catKey === 'ALL' ? 'Semua Biaya' :
                     catKey === 'BANDWIDTH_ISP' ? 'Upstream Bandwidth' :
                     catKey === 'LISTRIK_NOC' ? 'Listrik & NOC' :
                     catKey === 'MAINTENANCE_FO' ? 'Pemeliharaan FO' : 'Teknisi'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Pengeluaran Baru</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Tanggal / Bulan</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Uraian Biaya</th>
                    <th className="py-2.5 px-3">Vendor / Penerima</th>
                    <th className="py-2.5 px-3">Metode Bayar</th>
                    <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {operationalExpenses
                    .filter(e => expenseFilterCategory === 'ALL' || e.category === expenseFilterCategory)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-mono text-slate-700 text-[11px]">{item.date}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{item.month}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.category === 'BANDWIDTH_ISP' ? 'bg-sky-100 text-sky-800' :
                            item.category === 'LISTRIK_NOC' ? 'bg-amber-100 text-amber-800' :
                            item.category === 'MAINTENANCE_FO' ? 'bg-purple-100 text-purple-800' :
                            item.category === 'GAJI_TEKNISI' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {item.categoryLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                          {item.note && <div className="text-[10px] text-slate-500 italic">{item.note}</div>}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{item.vendor}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{item.paymentMethod}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          Rp {item.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(item.id, item.title)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Hapus pos pengeluaran ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>
              Sinkronisasi otomatis dengan ledger penerimaan DANA Webhook & Kasir Tunai.
            </span>
          </div>
          <div className="font-semibold text-slate-700">
            Status Keuangan: <span className="text-emerald-700">Arus Kas Bersih Sehat (+{financialSummary.avgProfitMargin}%)</span>
          </div>
        </div>

      </div>

      {/* Chart 3: Tren Jumlah Pelanggan Aktif vs Terisolir Real-Time (Full Width / 2 Cols) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Tren Jumlah Pelanggan Aktif vs Terisolir Real-Time
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pertumbuhan pelanggan terhubung router Ruijie Reyee dan riwayat auto-isolir per bulan
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Pelanggan Aktif</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Terisolir Ruijie</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600">Total Bandwidth (GB)</span>
            </div>
          </div>
        </div>

        {/* Bar & Line Composed Chart */}
        <div className="w-full h-64 sm:h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={customerTrendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <Tooltip content={<CustomCustomerTooltip />} />
              <Bar
                dataKey="aktif"
                name="Pelanggan Aktif"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={28}
                animationDuration={800}
              />
              <Bar
                dataKey="isolir"
                name="Pelanggan Terisolir"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                barSize={14}
                animationDuration={800}
              />
              <Bar
                dataKey="pending"
                name="Menunggu Aktivasi"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
                barSize={10}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Data otomatis terupdate seketika saat tombol <strong>Aktivasi</strong> atau pembayaran <strong>DANA</strong> dieksekusi.
          </div>
          <div className="font-semibold text-slate-700">
            Kapasitas ODP: 64 Port · Terpakai: {pelangganList.length} Port
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Activation & Real-Time Transaction Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): Real-Time Financial Transactions & Ruijie Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Real-time Transactions Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Arus Kas & Transaksi Real-Time
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifikasi otomatis via DANA Gateway Webhook & Setoran Kasir
                </p>
              </div>
              <button
                onClick={() => setActiveTab('billing')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
              >
                <span>Lihat Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-2.5">Ref / Waktu</th>
                    <th className="py-2.5">Pelanggan</th>
                    <th className="py-2.5">Tipe</th>
                    <th className="py-2.5">Metode</th>
                    <th className="py-2.5 text-right">Nominal</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transaksiList.slice(0, 5).map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono text-[11px] text-slate-600">
                        <div>{trx.transaksiCode}</div>
                        <div className="text-[10px] text-slate-400">{trx.waktu}</div>
                      </td>
                      <td className="py-3 font-medium text-slate-900">
                        {trx.customerName}
                      </td>
                      <td className="py-3 text-slate-600">
                        {trx.tipe === 'TAGIHAN_BULANAN' ? 'Tagihan Internet' : 'Voucher Hotspot'}
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {trx.method === 'DANA_QRIS' ? 'DANA QRIS' :
                         trx.method === 'DANA_WALLET' ? 'DANA E-Wallet' : 'Tunai Kasir'}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        Rp {trx.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ruijie Auto-Isolir Live Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Aktivitas Auto-Isolir & Ruijie Reyee Cloud
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('ruijie')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
              >
                <span>Konsol Ruijie</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {ruijieLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        log.action === 'ISOLIR' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">{log.pelangganNama}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-mono">{log.ipAddress}</span>
                    </div>
                    <div className="text-xs text-slate-600">{log.reason}</div>
                    <div className="text-[10px] text-slate-400">
                      Trigger: <span className="font-medium text-slate-700">{log.executedBy}</span> · Latensi: {log.responseTimeMs}ms
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Pending Customer Activation & Open Tickets */}
        <div className="space-y-6">

          {/* Pending Activations Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Aktivasi Akun Pelanggan Baru
              </h2>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {pendingPelanggan.length} Menunggu
              </span>
            </div>

            {pendingPelanggan.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Tidak ada antrian aktivasi pelanggan baru saat ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-3">
                {pendingPelanggan.map((p) => (
                  <div key={p.id} className="py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-slate-900">{p.nama}</div>
                      <div className="text-[10px] font-mono text-slate-500">{p.nomorPelanggan}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      <div>Alamat: {p.alamat} (RT {p.rt}/RW {p.rw})</div>
                      <div>ODP Port: <span className="font-medium text-slate-700">{p.odpCode}</span></div>
                      <div>Ruijie ONT SN: <span className="font-mono text-slate-700">{p.ruijieOntSN}</span></div>
                    </div>
                    <div className="pt-1 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const res = aktivasiPelanggan(p.id);
                          alert(res.message);
                        }}
                        className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktivasi Sekarang</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Support Tickets */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Tiket Gangguan Pelanggan
              </h2>
              <button
                onClick={() => setActiveTab('tiket')}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                Semua Tiket
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {tiketList.slice(0, 3).map((t) => (
                <div key={t.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 truncate max-w-[170px]">
                      {t.judul}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                      t.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {t.pelangganNama} · {t.kategori}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Teknisi: {t.assignedTeknisiNama || 'Belum ditugaskan'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Ruijie Reyee Integration Status */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-2 shadow-sm">
            <div className="font-semibold flex items-center space-x-2 text-sky-400">
              <Server className="w-4 h-4" />
              <span>Ruijie Reyee Cloud API Config</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Terkoneksi ke Project ID <code className="text-sky-300">PRJ-RTRW-SUKAMAJU-01</code>.
              Eksekusi isolir PPPoE & un-isolir instan berjalan otomatis saat pembayaran DANA diterima.
            </p>
          </div>

        </div>

      </div>

      {/* Modal Form: Catat Biaya Operasional Baru */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Catat Biaya Operasional Baru</h3>
                  <p className="text-[11px] text-slate-500">Otomatis mengupdate grafik area arus kas keluar bulan berjalan</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Uraian / Judul Biaya Operasional <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sewa Bandwidth Upstream Dedicated 1 Gbps"
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Cost Center <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newExpCategory}
                    onChange={(e: any) => setNewExpCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  >
                    <option value="BANDWIDTH_ISP">Upstream Bandwidth ISP</option>
                    <option value="LISTRIK_NOC">Listrik & Pendingin NOC</option>
                    <option value="MAINTENANCE_FO">Pemeliharaan Fiber Optic & ODP</option>
                    <option value="GAJI_TEKNISI">Honor Teknisi & Transport Tiket</option>
                    <option value="LAINNYA">Software, Lisensi & Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nominal Biaya (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    placeholder="Contoh: 1500000"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Vendor / Pihak Penerima
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Fiber Media Nusantara / PLN"
                    value={newExpVendor}
                    onChange={(e) => setNewExpVendor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={newExpPaymentMethod}
                    onChange={(e) => setNewExpPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  >
                    <option value="Transfer Virtual Account">Transfer Virtual Account</option>
                    <option value="Transfer Bank BCA/BRI/Mandiri">Transfer Bank</option>
                    <option value="DANA Bisnis / QRIS">DANA Bisnis / QRIS</option>
                    <option value="Tunai Kasir NOC">Tunai Kasir NOC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan / Nomor Invoice
                  </label>
                  <input
                    type="text"
                    placeholder="No. Invoice / Keterangan port"
                    value={newExpNote}
                    onChange={(e) => setNewExpNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-xs active:scale-95 flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Biaya Operasional</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
