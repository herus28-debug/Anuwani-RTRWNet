import React, { useState } from 'react';
import { Pelanggan, InternetPackage } from '../types';
import {
  X,
  Terminal,
  Copy,
  Check,
  Download,
  Lock,
  Unlock,
  User,
  ShieldAlert,
  Zap,
  Server
} from 'lucide-react';

interface CustomerRuijieScriptModalProps {
  customer: Pelanggan;
  pkg?: InternetPackage;
  onClose: () => void;
}

export const CustomerRuijieScriptModal: React.FC<CustomerRuijieScriptModalProps> = ({
  customer,
  pkg,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const speed = pkg?.speedMbps || 20;

  const scriptAddUser = `! 1. Tambah Akun PPPoE & Binding IP/MAC pada Ruijie Reyee
username ${customer.pppoeUser} password 0 ${customer.pppoePassword}
username ${customer.pppoeUser} ip-address ${customer.ipAddress}
username ${customer.pppoeUser} mac-address ${customer.ruijieDeviceMac}
username ${customer.pppoeUser} traffic-policy TP_${speed}M
username ${customer.pppoeUser} description "${customer.nama} - ODP ${customer.odpCode}"
write memory`;

  const scriptIsolir = `! 2. Eksekusi Isolir Pelanggan ${customer.nama}
interface Virtual-Access user ${customer.pppoeUser}
 ip access-group ACL_ISOLIR_ANUWANI in
 traffic-policy TP_ISOLIR_THROTTLE
exit
clear pppoe session username ${customer.pppoeUser}`;

  const scriptUnisolir = `! 3. Buka Isolir Pelanggan ${customer.nama} (Normal Kembali)
interface Virtual-Access user ${customer.pppoeUser}
 no ip access-group ACL_ISOLIR_ANUWANI in
 traffic-policy TP_${speed}M
exit
clear pppoe session username ${customer.pppoeUser}`;

  const scriptCurlApi = `# 4. Eksekusi API Ruijie Reyee Cloud via cURL
curl -X POST "https://cloud-as.ruijienetworks.com/api/v2/gateway/user/${customer.status === 'isolated' ? 'unisolate' : 'isolate'}" \\
  -H "Authorization: Bearer YOUR_RUIJIE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "${customer.pppoeUser}",
    "ip_address": "${customer.ipAddress}",
    "project_id": "PRJ-RUIJIE-SUKAMAJU-2026",
    "speed_mbps": ${speed}
  }'`;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                <Terminal className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Script CLI Ruijie: {customer.nama}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              No. {customer.nomorPelanggan} · IP: <span className="font-mono">{customer.ipAddress}</span> · PPPoE: <span className="font-mono text-slate-700">{customer.pppoeUser}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Status Saat Ini:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              customer.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
              customer.status === 'isolated' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {customer.status.toUpperCase()}
            </span>
          </div>

          <div className="text-[11px] text-slate-600">
            Paket: <strong>{pkg?.name} ({speed} Mbps)</strong> · ODP: <strong>{customer.odpCode}</strong>
          </div>
        </div>

        {/* Snippet 1: Tambah Akun PPPoE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>A. Registrasi Akun PPPoE & Binding MAC</span>
            </span>
            <button
              onClick={() => handleCopy('add', scriptAddUser)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
            >
              {copiedKey === 'add' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'add' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto">
            <code>{scriptAddUser}</code>
          </pre>
        </div>

        {/* Snippet 2: Isolir Manual */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-700 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>B. Perintah CLI Isolir (Tunggakan Tagihan)</span>
            </span>
            <button
              onClick={() => handleCopy('isolir', scriptIsolir)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              {copiedKey === 'isolir' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'isolir' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-rose-200 rounded-xl text-xs font-mono overflow-x-auto">
            <code>{scriptIsolir}</code>
          </pre>
        </div>

        {/* Snippet 3: Buka Isolir */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-700 flex items-center space-x-1.5">
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>C. Perintah CLI Buka Isolir (Normal Kembali)</span>
            </span>
            <button
              onClick={() => handleCopy('unisolir', scriptUnisolir)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copiedKey === 'unisolir' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'unisolir' ? 'Tersalin' : 'Salin Perintah'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-emerald-200 rounded-xl text-xs font-mono overflow-x-auto">
            <code>{scriptUnisolir}</code>
          </pre>
        </div>

        {/* Snippet 4: cURL API */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>D. cURL HTTP API Ruijie Reyee Cloud</span>
            </span>
            <button
              onClick={() => handleCopy('curl', scriptCurlApi)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center space-x-1"
            >
              {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'curl' ? 'Tersalin' : 'Salin cURL'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto">
            <code>{scriptCurlApi}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
