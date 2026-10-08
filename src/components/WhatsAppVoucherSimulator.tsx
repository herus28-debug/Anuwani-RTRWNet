import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Send,
  Wifi,
  QrCode,
  Zap,
  CheckCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Smartphone,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isQris?: boolean;
  qrisNominal?: number;
  planName?: string;
  voucherCode?: string;
  voucherPass?: string;
  durasi?: number;
  speed?: number;
}

export const WhatsAppVoucherSimulator: React.FC = () => {
  const { beliVoucherViaWhatsAppBot, settings } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [userPhone, setUserPhone] = useState('085811223344');
  const [userName, setUserName] = useState('Pengunjung Warga');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: `👋 *Selamat datang di Bot Otomatis anuwani Hotspot!*\n\nBeli voucher internet Wi-Fi *cukup lewat WhatsApp ini*, tanpa perlu download aplikasi atau daftar akun apa pun!\n\nKetik *BELI* atau *MENU* untuk melihat paket voucher internet warga.`,
      time: '23:10',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userTime = getCurrentTime();
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: userTime,
    };

    setMessages(prev => [...prev, newMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    // Process Bot Response
    setTimeout(() => {
      processBotResponse(textToSend.trim().toUpperCase());
      setIsTyping(false);
    }, 700);
  };

  const processBotResponse = (cmd: string) => {
    const botTime = getCurrentTime();

    if (cmd === 'BELI' || cmd === 'MENU' || cmd.includes('VOUCHER') || cmd.includes('PAKET') || cmd.includes('HALO')) {
      const menuMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📶 *DAFTAR VOUCHER WI-FI anuwani (RUIJIE)*\n\n1️⃣ *2 Jam Kilat* : Rp 3.000 (5 Mbps)\n2️⃣ *6 Jam Hemat* : Rp 5.000 (7 Mbps)\n3️⃣ *24 Jam Seharian* : Rp 10.000 (10 Mbps) ⭐ *Paling Laris*\n4️⃣ *7 Hari Mingguan* : Rp 30.000 (15 Mbps)\n5️⃣ *30 Hari Hotspot* : Rp 60.000 (20 Mbps)\n\n👉 *Balas dengan mengetik angka 1 sampai 5 untuk memilih paket!*`,
        time: botTime,
      };
      setMessages(prev => [...prev, menuMsg]);
      return;
    }

    // Number matching
    let selectedPackage = null;
    if (cmd === '1' || cmd.includes('2 JAM')) {
      selectedPackage = { durasi: 2, harga: 3000, name: '2 Jam Kilat', speed: 5 };
    } else if (cmd === '2' || cmd.includes('6 JAM')) {
      selectedPackage = { durasi: 6, harga: 5000, name: '6 Jam Hemat', speed: 7 };
    } else if (cmd === '3' || cmd.includes('24 JAM') || cmd.includes('SEHARIAN')) {
      selectedPackage = { durasi: 24, harga: 10000, name: '24 Jam Seharian', speed: 10 };
    } else if (cmd === '4' || cmd.includes('7 HARI') || cmd.includes('MINGGU')) {
      selectedPackage = { durasi: 168, harga: 30000, name: '7 Hari Mingguan', speed: 15 };
    } else if (cmd === '5' || cmd.includes('30 HARI') || cmd.includes('BULAN')) {
      selectedPackage = { durasi: 720, harga: 60000, name: '30 Hari Hotspot', speed: 20 };
    }

    if (selectedPackage) {
      const qrisMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🧾 *TAGIHAN QRIS DANA VOUCHER*\n\nPaket: *${selectedPackage.name}*\nDurasi: *${selectedPackage.durasi} Jam*\nKecepatan: *Hingga ${selectedPackage.speed} Mbps*\nTotal Bayar: *Rp ${selectedPackage.harga.toLocaleString('id-ID')}*\n\nSilakan scan kode QRIS DANA di bawah ini menggunakan aplikasi DANA, BCA, GoPay, OVO, atau ShopeePay.\n\n_Setelah bayar berhasil, username & password voucher otomatis masuk ke WhatsApp ini dalam 2 detik!_`,
        time: botTime,
        isQris: true,
        qrisNominal: selectedPackage.harga,
        planName: selectedPackage.name,
        durasi: selectedPackage.durasi,
        speed: selectedPackage.speed,
      };
      setMessages(prev => [...prev, qrisMsg]);
      return;
    }

    // Default help response
    const defaultMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Maaf perintah tidak dikenali. Ketik *BELI* untuk memilih paket voucher, atau ketik angka *1 - 5* untuk langsung memesan.`,
      time: botTime,
    };
    setMessages(prev => [...prev, defaultMsg]);
  };

  const handleSimulatePaymentSuccess = async (plan: {
    name: string;
    harga: number;
    durasi: number;
    speed: number;
  }) => {
    setIsProcessingPayment(true);

    try {
      // Simulate DANA payment confirmation round-trip
      await new Promise(res => setTimeout(res, 900));

      // Trigger actual voucher creation and financial ledger recording
      const vcr = await beliVoucherViaWhatsAppBot(
        userPhone,
        userName,
        plan.durasi,
        plan.harga,
        plan.name,
        plan.speed
      );

      const botTime = getCurrentTime();

      const successMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `🎉 *PEMBAYARAN QRIS DANA BERHASIL!*\n\nTerima kasih *${userName}*, berikut detail akun Wi-Fi Hotspot Anda:\n\n📶 SSID : *ANUWANI_HOTSPOT_WARGA*\n👤 Username : *${vcr.code}*\n🔑 Password : *${vcr.passwordHotspot}*\n⏱️ Durasi : *${plan.durasi} Jam Unlimited*\n🚀 Speed : *Up to ${plan.speed} Mbps*\n\n📌 *Langkah Pakai:*\n1. Nyalakan Wi-Fi di HP dan pilih *ANUWANI_HOTSPOT_WARGA*\n2. Buka browser atau klik pop-up login\n3. Masukkan Username & Password di atas\n\nSelamat menikmati internet! Tidak perlu instal aplikasi apa pun.`,
        time: botTime,
        voucherCode: vcr.code,
        voucherPass: vcr.passwordHotspot,
      };

      setMessages(prev => [...prev, successMsg]);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      alert('Gagal memproses');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'm-1',
        sender: 'bot',
        text: `👋 *Selamat datang di Bot Otomatis anuwani Hotspot!*\n\nBeli voucher internet Wi-Fi *cukup lewat WhatsApp ini*, tanpa perlu download aplikasi atau daftar akun apa pun!\n\nKetik *BELI* atau *MENU* untuk melihat paket voucher internet warga.`,
        time: getCurrentTime(),
      }
    ]);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const officialWaLink = `https://wa.me/6281234567890?text=${encodeURIComponent(
    'Halo Bot anuwani, saya mau beli voucher wifi hotspot'
  )}`;

  return (
    <div className="space-y-6">

      {/* Top Banner explaining the WhatsApp-only feature */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Fitur Khusus: Beli Voucher Cukup Lewat WhatsApp</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Tidak Perlu Instal Aplikasi, Cukup Kirim Chat WhatsApp!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Warga dan tamu pos ronda tidak perlu ribet menginstal aplikasi atau mendaftar akun. Cukup chat ke nomor WhatsApp bot RT/RW Net, bayar dengan QRIS DANA, dan kode voucher langsung otomatis dikirim ke chat WhatsApp dalam hitungan detik.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={officialWaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Chat di WhatsApp Asli</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2-Column Layout: Simulator Smartphone (Left) + Quick Explainer & Real WhatsApp QR (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Column 1: Interactive Phone Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-3 sm:p-4 border border-slate-800 shadow-2xl">
          
          {/* Smartphone Mockup Frame */}
          <div className="bg-[#0b141a] rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-[580px] shadow-inner relative">
            
            {/* WhatsApp Green Top Bar */}
            <div className="bg-[#202c33] px-4 py-3 text-white flex items-center justify-between border-b border-slate-800/80 z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute bottom-0 right-0 border-2 border-[#202c33]"></span>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
                    <span>BOT VOUCHER anuwani</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800 font-normal">
                      Official
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    online · terhubung ke Ruijie Reyee & DANA
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-400">
                <button onClick={resetChat} title="Reset Chat" className="p-1 hover:text-white rounded-lg">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body with WhatsApp Background Pattern */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] bg-opacity-95 text-xs">
              
              {/* Encryption Banner */}
              <div className="p-2 bg-[#182229] border border-[#222e35] rounded-xl text-center text-[10px] text-[#8696a0] max-w-xs mx-auto">
                🔒 Pesan dienkripsi secara end-to-end. Nomor WhatsApp Bot ini resmi melayani pembelian voucher internet RT/RW Net.
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] p-3 rounded-2xl relative shadow-md leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                        : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {/* QRIS DANA Card inside Message */}
                    {msg.isQris && (
                      <div className="mt-3 p-3 bg-white text-slate-900 rounded-xl space-y-2 border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <div className="font-extrabold text-sm text-[#118EEA]">DANA QRIS</div>
                          <div className="text-[10px] text-slate-500 font-mono">NMID: ID102026RTRW99</div>
                        </div>

                        {/* Visual QR Code Mockup */}
                        <div className="w-36 h-36 mx-auto bg-slate-950 p-2 rounded-xl flex items-center justify-center">
                          <div className="w-full h-full bg-white p-1 rounded flex flex-col items-center justify-center">
                            <QrCode className="w-24 h-24 text-[#118EEA]" />
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-base font-extrabold text-slate-900">
                            Rp {msg.qrisNominal?.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Scan QRIS ini dengan aplikasi DANA / E-Wallet / Mobile Banking
                          </div>
                        </div>

                        {/* Interactive Simulator Trigger */}
                        <button
                          onClick={() => handleSimulatePaymentSuccess({
                            name: msg.planName || '24 Jam',
                            harga: msg.qrisNominal || 10000,
                            durasi: msg.durasi || 24,
                            speed: msg.speed || 10,
                          })}
                          disabled={isProcessingPayment}
                          className="w-full py-2 bg-[#118EEA] hover:bg-sky-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>{isProcessingPayment ? 'Memproses Webhook DANA...' : 'Simulasikan Pembayaran DANA Sukses'}</span>
                        </button>
                      </div>
                    )}

                    {/* Quick Copy Voucher Code Button */}
                    {msg.voucherCode && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Username: <strong>{msg.voucherCode}</strong>
                        </div>
                        <button
                          onClick={() => copyCode(msg.voucherCode!)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-[10px] flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
                        </button>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-[9px] text-[#8696a0] text-right mt-1 flex items-center justify-end space-x-1">
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs p-2 bg-[#202c33] rounded-xl w-32">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] text-slate-300 italic">mengetik...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Keyword Buttons for Fast Testing */}
            <div className="p-2 bg-[#111b21] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-500 text-[10px] font-semibold pl-1">Coba Ketik:</span>
              <button
                onClick={() => handleSendMessage('BELI')}
                className="px-2.5 py-1 bg-[#202c33] text-emerald-400 hover:bg-[#2a3942] rounded-lg border border-slate-700/60 whitespace-nowrap"
              >
                BELI
              </button>
              <button
                onClick={() => handleSendMessage('1')}
                className="px-2.5 py-1 bg-[#202c33] text-slate-200 hover:bg-[#2a3942] rounded-lg border border-slate-700/60 whitespace-nowrap"
              >
                1 (2 Jam Rp3k)
              </button>
              <button
                onClick={() => handleSendMessage('3')}
                className="px-2.5 py-1 bg-[#202c33] text-amber-300 hover:bg-[#2a3942] rounded-lg border border-slate-700/60 whitespace-nowrap"
              >
                3 (24 Jam Rp10k)
              </button>
              <button
                onClick={() => handleSendMessage('5')}
                className="px-2.5 py-1 bg-[#202c33] text-slate-200 hover:bg-[#2a3942] rounded-lg border border-slate-700/60 whitespace-nowrap"
              >
                5 (30 Hari)
              </button>
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-[#202c33] flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ketik 'BELI' atau angka paket (1-5)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#2a3942] text-white px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 bg-[#00a884] hover:bg-[#02906f] text-slate-900 rounded-xl transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4 fill-slate-900" />
              </button>
            </form>

          </div>
        </div>

        {/* Column 2: Information, Real QR Code & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: Bagaimana Cara Kerjanya? */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Keunggulan Beli Voucher via WhatsApp</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  1
                </div>
                <div>
                  <strong>Tanpa Download Aplikasi:</strong> Semua orang punya WhatsApp di smartphone mereka. Cukup kirim chat kata kunci <code>BELI</code>.
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  2
                </div>
                <div>
                  <strong>Bayar via QRIS DANA Otomatis:</strong> Bot langsung mengirimkan kode QRIS DANA. Bisa discan oleh semua e-wallet (DANA, BCA, GoPay, OVO).
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  3
                </div>
                <div>
                  <strong>Kode Hotspot Langsung Masuk (&lt; 2 Detik):</strong> Begitu DANA mengkonfirmasi mutasi, webhook Ruijie meng-generate voucher dan bot otomatis membalas ke WhatsApp pembeli.
                </div>
              </div>
            </div>
          </div>

          {/* Card: Konfigurasi Nomor WhatsApp Pembeli Simulasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-2">
              Profil Pembeli Simulasi Chat
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nomor HP Pembeli
                </label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nama Pembeli
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Nama Pembeli"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terhubung ke Gateway WhatsApp NOC</span>
              </div>
              <p>
                Nomor Bot WhatsApp: <strong className="font-mono">{settings.waContactCenter}</strong>
              </p>
            </div>
          </div>

          {/* Card: Tautan Langsung & Poster Tempel di Pos Ronda / Warkop */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-sm text-xs">
            <div className="font-bold text-sm text-amber-300 flex items-center space-x-1.5">
              <QrCode className="w-4 h-4" />
              <span>Poster Cetak Stiker / Barcode WhatsApp</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Pemilik RT/RW Net cukup menempelkan stiker barcode QR WhatsApp ini di tiang listrik, pos kamling, atau meja warkop. Warga tinggal scan kamera HP langsung terbuka chat WhatsApp bot untuk beli voucher!
            </p>

            <a
              href={officialWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buka Chat Bot di WhatsApp ({settings.waContactCenter})</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
