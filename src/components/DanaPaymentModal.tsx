import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  RotateCw,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const DanaPaymentModal: React.FC = () => {
  const {
    selectedTagihanForPayment,
    setSelectedTagihanForPayment,
    bayarTagihanDana,
    pelangganList,
    settings
  } = useApp();

  const [paymentMode, setPaymentMode] = useState<'QRIS' | 'WALLET'>('QRIS');
  const [danaPhone, setDanaPhone] = useState('081298765432');
  const [danaPin, setDanaPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(899); // 15 mins countdown

  useEffect(() => {
    if (!selectedTagihanForPayment) {
      setPaymentSuccess(false);
      setIsProcessing(false);
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTagihanForPayment]);

  if (!selectedTagihanForPayment) return null;

  const tagihan = selectedTagihanForPayment;
  const targetCustomer = pelangganList.find(p => p.id === tagihan.pelangganId);
  const wasIsolated = targetCustomer?.status === 'isolated';

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate DANA payment network handshake
      await new Promise(res => setTimeout(res, 800));

      const res = await bayarTagihanDana(
        tagihan.id,
        paymentMode === 'QRIS' ? 'DANA_QRIS' : 'DANA_WALLET'
      );

      if (res.success) {
        setTransactionRef(res.txId);
        setPaymentSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert('Gagal memproses pembayaran DANA');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 my-8">

        {/* DANA Header Bar */}
        <div className="bg-[#118EEA] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-white px-2 py-0.5 rounded-lg text-[#118EEA] font-extrabold tracking-wider text-base">
              DANA
            </div>
            <div className="text-xs font-medium text-sky-100">
              Payment Gateway · Verifikasi Otomatis
            </div>
          </div>

          <button
            onClick={() => setSelectedTagihanForPayment(null)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Payment Success View */}
          {paymentSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Pembayaran DANA Berhasil!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tagihan internet periode <strong>{tagihan.periode}</strong> telah LUNAS terverifikasi.
                </p>
              </div>

              {/* Instant Un-Isolir Ruijie Notification */}
              {wasIsolated && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>Sinkronisasi Auto-Unisolir Ruijie Berhasil (&lt; 2 Detik)!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Sistem telah mengirimkan payload un-isolate ke router Ruijie Reyee. Session PPPoE telah di-reset dan kecepatan internet telah dipulihkan normal kembali.
                  </p>
                </div>
              )}

              {/* Receipt Info */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Transaksi:</span>
                  <span className="font-mono font-bold text-slate-800">{transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Nominal:</span>
                  <span className="font-bold text-slate-900">Rp {tagihan.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notifikasi WA:</span>
                  <span className="text-emerald-700 font-semibold">Terkirim ke {tagihan.pelangganPhone}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTagihanForPayment(null)}
                className="w-full py-3 bg-[#118EEA] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition-colors shadow-md"
              >
                Selesai & Tutup
              </button>
            </div>
          ) : (
            /* Checkout & Payment Option View */
            <>
              {/* Order Details Header */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Merchant: {settings.ispName}</span>
                  <span className="font-mono font-medium">{tagihan.nomorInvoice}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{tagihan.packageName}</div>
                    <div className="text-[11px] text-slate-500">Pelanggan: {tagihan.pelangganNama}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[#118EEA]">
                      Rp {tagihan.total.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs: QRIS DANA vs DANA Wallet */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMode('QRIS')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    paymentMode === 'QRIS'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#118EEA]" />
                  <span>DANA QRIS Dinamis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('WALLET')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                    paymentMode === 'WALLET'
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#118EEA]" />
                  <span>Saldo Akun DANA</span>
                </button>
              </div>

              {/* Mode 1: DANA QRIS Dinamis */}
              {paymentMode === 'QRIS' ? (
                <div className="space-y-4 text-center">
                  <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-slate-200 inline-block shadow-sm">
                    {/* Authentic QRIS Mockup */}
                    <div className="w-48 h-48 mx-auto bg-slate-900 p-2 rounded-xl flex items-center justify-center text-white relative">
                      <div className="w-full h-full bg-white p-2 rounded-lg flex flex-col items-center justify-center">
                        {/* QR Grid Graphic */}
                        <div className="grid grid-cols-5 gap-1.5 w-32 h-32">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-sm ${
                                i === 0 || i === 4 || i === 20 || i === 6 || i === 12 || i === 18 || i === 24
                                  ? 'bg-slate-900'
                                  : (i * 7) % 3 === 0
                                  ? 'bg-[#118EEA]'
                                  : 'bg-slate-800'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <div className="mt-1 text-[9px] font-bold text-slate-700 tracking-wider">
                          NMID: ID102026RTRW99
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-xs font-semibold text-slate-800">
                      Scan via DANA / BCA / GoPay / Mandiri
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Kadaluarsa dalam: <strong className="text-slate-800 font-mono">{formatTimer(timerSeconds)}</strong></span>
                  </div>

                  {/* Simulator Button */}
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3 bg-[#118EEA] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Menunggu Konfirmasi Webhook DANA...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>Simulasikan Scan & Bayar via DANA Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Mode 2: DANA Wallet Saldo Direct */
                <div className="space-y-4">
                  <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-[#118EEA]" />
                    <span>Pembayaran langsung memotong saldo akun DANA terdaftar.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor HP Terdaftar DANA
                    </label>
                    <input
                      type="text"
                      value={danaPhone}
                      onChange={(e) => setDanaPhone(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PIN DANA (6 Digit)
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="••••••"
                      value={danaPin}
                      onChange={(e) => setDanaPin(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-center tracking-widest text-lg focus:ring-2 focus:ring-[#118EEA] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3 bg-[#118EEA] hover:bg-sky-600 text-white font-bold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Saldo DANA...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Konfirmasi & Bayar Rp {tagihan.total.toLocaleString('id-ID')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security & Instant SLA Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>DANA Verified Gateway</span>
                </span>
                <span>Auto Un-Isolir Ruijie SLA &lt; 2s</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
