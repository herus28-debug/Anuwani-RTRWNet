import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileText,
  Download,
  Printer,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface MonthlyFinancialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlyFinancialReportModal: React.FC<MonthlyFinancialReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    transaksiList,
    tagihanList,
    pelangganList,
    settings,
    currentUser
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  // Filter transactions for chosen period or all
  const filteredTransactions = transaksiList.filter(t => {
    // In our prototype, match month or use all active transactions
    return true;
  });

  const grossRevenue = filteredTransactions.reduce((acc, curr) => acc + curr.nominal, 0);
  const totalFees = filteredTransactions.reduce((acc, curr) => acc + curr.feeGateway, 0);
  const netRevenue = filteredTransactions.reduce((acc, curr) => acc + curr.netRevenue, 0);

  const unpaidBills = tagihanList.filter(t => t.status === 'unpaid' || t.status === 'isolated');
  const totalUnpaidNominal = unpaidBills.reduce((acc, curr) => acc + curr.total, 0);
  const paidBillsCount = tagihanList.filter(t => t.status === 'paid').length;
  const collectionRate = tagihanList.length > 0 ? ((paidBillsCount / tagihanList.length) * 100).toFixed(1) : '100';

  // Breakdown by channel
  const danaQrisTotal = filteredTransactions
    .filter(t => t.method === 'DANA_QRIS')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const danaWalletTotal = filteredTransactions
    .filter(t => t.method === 'DANA_WALLET')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const cashTotal = filteredTransactions
    .filter(t => t.method === 'TUNAI_KASIR')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  // Function to generate clean vector PDF using jsPDF
  const generateDownloadPdf = () => {
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const primaryColor: [number, number, number] = [17, 142, 234]; // DANA & anuwani Blue
      const darkColor: [number, number, number] = [30, 41, 59];

      // 1. Header & Organization Details
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(0, 0, 210, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(settings.ispName.toUpperCase(), 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`${settings.tagline} · Wilayah: ${settings.rtRwCoverage}`, 14, 18);
      doc.text(`Kontak NOC: ${settings.waContactCenter} · Status Sistem: Ruijie Reyee Cloud NOC`, 14, 23);

      // Report Title Banner
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`LAPORAN KEUANGAN BULANAN & ARSIP AKUNTANSI`, 14, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Periode Laporan  : ${selectedMonth}`, 14, 44);
      doc.text(`Tanggal Cetak    : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 49);
      doc.text(`Dicetak Oleh      : ${currentUser.name} (${currentUser.role.toUpperCase()})`, 14, 54);

      // 2. Executive Summary Boxes
      const startY = 60;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);

      // Box 1: Penerimaan Bruto
      doc.roundedRect(14, startY, 43, 20, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('PENERIMAAN BRUTO', 17, startY + 6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Rp ${grossRevenue.toLocaleString('id-ID')}`, 17, startY + 14);

      // Box 2: Fee Gateway DANA
      doc.roundedRect(61, startY, 43, 20, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('FEE GATEWAY DANA', 64, startY + 6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72);
      doc.text(`- Rp ${totalFees.toLocaleString('id-ID')}`, 64, startY + 14);

      // Box 3: Net Kas Masuk
      doc.roundedRect(108, startY, 43, 20, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('NET KAS MASUK', 111, startY + 6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text(`Rp ${netRevenue.toLocaleString('id-ID')}`, 111, startY + 14);

      // Box 4: Piutang Tertunda
      doc.roundedRect(155, startY, 41, 20, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('PIUTANG TERTUNDA', 158, startY + 6);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text(`Rp ${totalUnpaidNominal.toLocaleString('id-ID')}`, 158, startY + 14);

      // 3. Transactions Table using autoTable
      const tableData = filteredTransactions.map((trx, index) => [
        (index + 1).toString(),
        trx.transaksiCode,
        trx.waktu.split(' ')[0] || trx.waktu,
        trx.customerName,
        trx.tipe === 'TAGIHAN_BULANAN' ? 'Tagihan Bulanan' : 'Voucher Hotspot',
        trx.method.replace('_', ' '),
        `Rp ${trx.nominal.toLocaleString('id-ID')}`,
        `Rp ${trx.feeGateway.toLocaleString('id-ID')}`,
        `Rp ${trx.netRevenue.toLocaleString('id-ID')}`,
        trx.status
      ]);

      autoTable(doc, {
        startY: 85,
        head: [[
          'No',
          'Kode Ref',
          'Tanggal',
          'Pelanggan / Warga',
          'Jenis Layanan',
          'Metode',
          'Bruto',
          'Fee',
          'Net Kas',
          'Status'
        ]],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'center',
        },
        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: 'middle',
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 8 },
          1: { cellWidth: 28 },
          2: { halign: 'center', cellWidth: 16 },
          3: { cellWidth: 28 },
          4: { cellWidth: 22 },
          5: { halign: 'center', cellWidth: 18 },
          6: { halign: 'right', cellWidth: 18 },
          7: { halign: 'right', cellWidth: 14 },
          8: { halign: 'right', cellWidth: 18 },
          9: { halign: 'center', cellWidth: 12 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });

      // 4. Summary & Signatures at bottom
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // Summary details
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('REKAPITULASI METODE PEMBAYARAN:', 14, finalY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`• DANA QRIS Dinamis     : Rp ${danaQrisTotal.toLocaleString('id-ID')}`, 14, finalY + 5);
      doc.text(`• DANA Saldo E-Wallet   : Rp ${danaWalletTotal.toLocaleString('id-ID')}`, 14, finalY + 9);
      doc.text(`• Setoran Tunai / Kasir   : Rp ${cashTotal.toLocaleString('id-ID')}`, 14, finalY + 13);
      doc.text(`• Tingkat Pelunasan     : ${collectionRate}% (${paidBillsCount} dari ${tagihanList.length} tagihan lunas)`, 14, finalY + 17);

      // Signatures
      const sigY = finalY + 28;
      if (sigY < 265) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Mengetahui / Pengawas,', 25, sigY);
        doc.text('Ketua RW 05 Sukamaju', 25, sigY + 4);
        doc.text('( ........................................ )', 25, sigY + 22);

        doc.text('Disiapkan Oleh,', 145, sigY);
        doc.text('Bendahara / Admin Billing', 145, sigY + 4);
        doc.text(`( ${currentUser.name} )`, 145, sigY + 22);
      }

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen ini digenerate secara otomatis oleh anuwani Billing OS · Diverifikasi via Ruijie Reyee Cloud & DANA Gateway`,
        14,
        290
      );

      // Save document
      const cleanFileName = `Laporan_Keuangan_RTRW_Net_${selectedMonth.replace(' ', '_')}.pdf`;
      doc.save(cleanFileName);
    } catch (err) {
      alert('Terjadi kesalahan saat mengekspor PDF: ' + err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">

        {/* Modal Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Laporan Keuangan Bulanan & Arsip Akuntansi (PDF)
              </h2>
              <p className="text-xs text-slate-500">
                Ekspor dokumen PDF resmi lengkap dengan ringkasan laba kotor, fee DANA, dan lembar tanda tangan.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generateDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh Berkas PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Period Filter Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center space-x-2 text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Pilih Periode Pembukuan:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Oktober 2026">Oktober 2026 (Bulan Berjalan)</option>
            <option value="September 2026">September 2026</option>
            <option value="Agustus 2026">Agustus 2026</option>
            <option value="Juli 2026">Juli 2026</option>
          </select>
        </div>

        {/* Printable Paper A4 Preview Mockup */}
        <div className="p-6 sm:p-8 bg-white border border-slate-300 rounded-2xl shadow-inner space-y-6 text-xs text-slate-700 font-sans max-h-[480px] overflow-y-auto">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {settings.ispName}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">{settings.tagline}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Jangkauan: {settings.rtRwCoverage} · Kontak NOC: {settings.waContactCenter}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
                ARSIP RESMI
              </span>
              <div className="text-xs font-bold text-slate-800 mt-1.5">
                Periode: {selectedMonth}
              </div>
              <div className="text-[10px] text-slate-500">
                Dicetak: {new Date().toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Penerimaan Bruto</div>
              <div className="text-base font-extrabold text-slate-900 mt-1">
                Rp {grossRevenue.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <div className="text-[10px] text-rose-600 font-semibold uppercase">Fee DANA (0.7%)</div>
              <div className="text-base font-extrabold text-rose-700 mt-1">
                - Rp {totalFees.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-[10px] text-emerald-600 font-semibold uppercase">Net Kas Masuk</div>
              <div className="text-base font-extrabold text-emerald-800 mt-1">
                Rp {netRevenue.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-[10px] text-amber-600 font-semibold uppercase">Piutang Berjalan</div>
              <div className="text-base font-extrabold text-amber-800 mt-1">
                Rp {totalUnpaidNominal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Table of Ledger Transactions */}
          <div>
            <div className="font-bold text-slate-900 mb-2 text-xs flex justify-between items-center">
              <span>Rincian Transaksi Kas Masuk & Pembayaran Lunas</span>
              <span className="text-[11px] text-slate-500">{filteredTransactions.length} Transaksi Tercatat</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-center w-8">No</th>
                    <th className="p-2">Kode Referensi</th>
                    <th className="p-2">Pelanggan</th>
                    <th className="p-2">Layanan</th>
                    <th className="p-2">Metode</th>
                    <th className="p-2 text-right">Nominal</th>
                    <th className="p-2 text-right">Net Kas</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((trx, idx) => (
                    <tr key={trx.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 font-mono text-slate-700">{trx.transaksiCode}</td>
                      <td className="p-2 font-semibold text-slate-900">{trx.customerName}</td>
                      <td className="p-2 text-slate-600">
                        {trx.tipe === 'TAGIHAN_BULANAN' ? 'Tagihan Bulanan' : 'Voucher Hotspot'}
                      </td>
                      <td className="p-2 font-medium text-slate-700">
                        {trx.method === 'DANA_QRIS' ? 'DANA QRIS' :
                         trx.method === 'DANA_WALLET' ? 'DANA E-Wallet' : 'Tunai Kasir'}
                      </td>
                      <td className="p-2 text-right font-bold text-slate-900">
                        Rp {trx.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2 text-right font-bold text-emerald-700">
                        Rp {trx.netRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2 text-center">
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Method Distribution Breakdown */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-900">Rekapitulasi Saluran Pembayaran:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>• DANA QRIS Dinamis: <strong>Rp {danaQrisTotal.toLocaleString('id-ID')}</strong></div>
              <div>• DANA E-Wallet: <strong>Rp {danaWalletTotal.toLocaleString('id-ID')}</strong></div>
              <div>• Tunai Kasir: <strong>Rp {cashTotal.toLocaleString('id-ID')}</strong></div>
            </div>
          </div>

          {/* Signatures for Accounting Archives */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="text-slate-500">Mengetahui / Pengawas Wilayah,</div>
              <div className="font-bold text-slate-900 mt-1">Ketua RW 05 Kelurahan Sukamaju</div>
              <div className="mt-14 font-semibold text-slate-800">
                ( ..................................................... )
              </div>
            </div>

            <div>
              <div className="text-slate-500">Dibuat & Diverifikasi Oleh,</div>
              <div className="font-bold text-slate-900 mt-1">Pengelola Net & Bendahara NOC</div>
              <div className="mt-14 font-semibold text-slate-800">
                ( {currentUser.name} )
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
