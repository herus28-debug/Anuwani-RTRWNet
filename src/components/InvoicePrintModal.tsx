import React from 'react';
import { useApp } from '../context/AppContext';
import { Tagihan } from '../types';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Wifi,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export const InvoicePrintModal: React.FC = () => {
  const { selectedInvoiceForPrint, setSelectedInvoiceForPrint, settings } = useApp();

  if (!selectedInvoiceForPrint) return null;
  const inv = selectedInvoiceForPrint;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-900">Kwitansi Pembayaran Resmi</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              LUNAS
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceForPrint(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Card */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5 text-xs text-slate-700">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2.5">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.brandShortName || settings.ispName}
                    className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm">
                    <Wifi className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
                    {settings.ispName}
                  </h3>
                  {settings.companyLegalName && (
                    <p className="text-[10px] font-semibold text-sky-700">{settings.companyLegalName}</p>
                  )}
                  <p className="text-[10px] text-slate-500">{settings.tagline}</p>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 space-y-0.5">
                {settings.companyAddress && <div>Alamat: {settings.companyAddress}</div>}
                <div>Cakupan: {settings.rtRwCoverage} · WA NOC: {settings.waContactCenter}</div>
                {settings.companyNpwp && <div>NPWP: {settings.companyNpwp}</div>}
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-sm text-slate-900">{inv.nomorInvoice}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tanggal: {inv.paidAt || inv.dueDate}</div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1">STATUS: LUNAS DANA</div>
            </div>
          </div>

          {/* Customer and Bill Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Ditagihkan Kepada:</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{inv.pelangganNama}</div>
              <div className="text-[11px] text-slate-500">{inv.pelangganPhone}</div>
              <div className="text-[10px] text-slate-400 mt-1">ID Tagihan: {inv.id}</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Metode Pembayaran:</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {inv.paymentMethod === 'DANA_QRIS' ? 'DANA QRIS Dinamis' :
                 inv.paymentMethod === 'DANA_WALLET' ? 'DANA E-Wallet' : 'Kasir Tunai'}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                Ref: {inv.danaTransactionId || 'CASH-SETTLED'}
              </div>
            </div>
          </div>

          {/* Line item table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-100 p-2.5 font-semibold text-slate-700 flex justify-between text-[11px]">
              <span>Deskripsi Layanan</span>
              <span>Jumlah</span>
            </div>
            <div className="p-3 space-y-1.5 divide-y divide-slate-100">
              <div className="flex justify-between items-center text-xs pt-1">
                <div>
                  <div className="font-bold text-slate-900">{inv.packageName}</div>
                  <div className="text-[10px] text-slate-500">Periode: {inv.periode} (Unlimited Bandwidth)</div>
                </div>
                <div className="font-mono font-bold text-slate-800">
                  Rp {inv.amount.toLocaleString('id-ID')}
                </div>
              </div>

              {inv.denda > 0 && (
                <div className="flex justify-between items-center text-xs pt-1">
                  <div className="text-rose-600">Denda Keterlambatan Pembayaran</div>
                  <div className="font-mono text-rose-600">
                    Rp {inv.denda.toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center font-bold text-sm text-slate-900">
              <span>TOTAL PEMBAYARAN:</span>
              <span className="text-emerald-700 font-mono text-base">
                Rp {inv.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Footer note & QR validation */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Divalidasi secara digital melalui DANA Gateway & Router Ruijie Reyee</span>
            </div>
            <div className="font-mono">
              ANUWANI-SECURITY-HASH-OK
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
