import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RuijieScriptGenerator } from './RuijieScriptGenerator';
import {
  Server,
  Zap,
  Activity,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Cpu,
  Thermometer,
  Wifi,
  Lock,
  Unlock,
  Radio,
  Clock,
  Layers,
  Settings,
  FileCode2
} from 'lucide-react';

export const RuijieManagement: React.FC = () => {
  const {
    ruijieDevices,
    ruijieLogs,
    pelangganList,
    syncRuijieCloud,
    manualIsolirRuijie,
    manualUnisolirRuijie,
    settings,
    updateSettings
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(ruijieDevices[0]);
  const [activeTab, setActiveTab] = useState<'DEVICES' | 'ISOLIR_ENGINE' | 'SCRIPTS' | 'API_CONSOLE'>('DEVICES');

  const isolatedCustomers = pelangganList.filter(p => p.status === 'isolated');
  const activeCustomers = pelangganList.filter(p => p.status === 'active');

  const handleForceSync = async () => {
    setIsSyncing(true);
    await syncRuijieCloud();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monitoring Router Ruijie Reyee & Engine Auto-Isolir
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sinkronisasi real-time Ruijie Reyee Cloud, telemetry gateway NOC & profil firewall isolir.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Ruijie Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Status Cloud API</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            Reyee Cloud Connected
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Project: <span className="font-mono text-slate-700">{settings.ruijieCloudProjectId}</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Latency Ruijie Gateway</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-sky-600">
            {ruijieDevices[0]?.latencyMs} ms
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Model: {ruijieDevices[0]?.model}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Status Isolir Ruijie</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-rose-600">{isolatedCustomers.length} Isolir</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xl font-bold text-emerald-600">{activeCustomers.length} Normal</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Un-Isolir Response: <span className="font-semibold text-emerald-700">&lt; 150 ms</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Perangkat Ruijie Aktif</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {ruijieDevices.length} Hardware Online
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Total {ruijieDevices.reduce((a, b) => a + b.connectedClients, 0)} Klien Wi-Fi / LAN
          </div>
        </div>

      </div>

      {/* Sub Tabs */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium">
        <button
          onClick={() => setActiveTab('DEVICES')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'DEVICES' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daftar Router & AP Ruijie ({ruijieDevices.length})
        </button>
        <button
          onClick={() => setActiveTab('ISOLIR_ENGINE')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'ISOLIR_ENGINE' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Konfigurasi Auto-Isolir & Port Isolir
        </button>
        <button
          onClick={() => setActiveTab('SCRIPTS')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
            activeTab === 'SCRIPTS' ? 'bg-white text-sky-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Generator Script Ruijie & CLI</span>
        </button>
        <button
          onClick={() => setActiveTab('API_CONSOLE')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'API_CONSOLE' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Konsol Event & Log API Ruijie ({ruijieLogs.length})
        </button>
      </div>

      {/* Tab 1: Devices Monitoring */}
      {activeTab === 'DEVICES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {ruijieDevices.map((dev) => (
            <div key={dev.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-sm text-slate-900">{dev.name}</h3>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{dev.model}</div>
                  <div className="text-[11px] text-sky-700 font-medium">{dev.location}</div>
                </div>

                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {dev.role}
                </span>
              </div>

              {/* Hardware Telemetry Specs */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">CPU Load</div>
                  <div className="text-xs font-bold text-slate-800">{dev.cpuLoadPercent}%</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Memory</div>
                  <div className="text-xs font-bold text-slate-800">{dev.memPercent}%</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Suhu</div>
                  <div className="text-xs font-bold text-slate-800">{dev.temperatureC}°C</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-[10px] text-slate-400">Klien Aktif</div>
                  <div className="text-xs font-bold text-sky-700">{dev.connectedClients} User</div>
                </div>
              </div>

              {/* Network Details */}
              <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>IP Management:</span>
                  <span className="font-bold text-slate-800">{dev.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>MAC Address:</span>
                  <span>{dev.mac}</span>
                </div>
                <div className="flex justify-between">
                  <span>Serial Number:</span>
                  <span>{dev.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Firmware ReyeeOS:</span>
                  <span className="text-slate-700">{dev.firmwareVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-slate-700">{dev.uptime}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Sinkronisasi Terakhir: {dev.lastSyncAt}</span>
                <span className="text-emerald-600 font-semibold">Ping Latency: {dev.latencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Auto-Isolir Engine Settings */}
      {activeTab === 'ISOLIR_ENGINE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Konfigurasi Auto-Isolir Ruijie Reyee Cloud
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aturan otomatis untuk mengalihkan traffic pelanggan yang menunggak ke portal isolir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isolir Address-List Name (Ruijie Gateway)
                </label>
                <input
                  type="text"
                  readOnly
                  value="ISOLIR_WARGA_RT_RW"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  IP Pool Isolir Subnet
                </label>
                <input
                  type="text"
                  readOnly
                  value="10.254.0.0/24"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
                />
                <span className="text-[11px] text-slate-400">DNS pada pool ini hanya mengizinkan akses ke gateway DANA & portal bayar.</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Bandwidth Rate-Limit saat Isolir
                </label>
                <input
                  type="text"
                  readOnly
                  value="64k / 64k (Bypass URL DANA & Portal Pelanggan)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Cron Job Eksekusi Auto-Isolir (Server)
                </label>
                <input
                  type="text"
                  readOnly
                  value="Setiap Hari pukul 00:01 WIB (0 0 * * *)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kecepatan Pemulihan (Un-Isolir SLA)
                </label>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                  <div className="font-bold flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Real-time Un-Isolir via DANA Webhook: &lt; 2 Detik</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700 leading-relaxed">
                    Saat pelanggan membayar via QRIS DANA, sistem langsung memanggil endpoint Ruijie <code>/gateway/user/unisolate</code>, mereset session PPPoE tanpa downtime router.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick List of Currently Isolated Customers */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-2">
              Daftar Pelanggan Saat Ini Terisolir ({isolatedCustomers.length})
            </h3>

            {isolatedCustomers.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 text-xs">
                Tidak ada pelanggan yang sedang terisolir. Semua koneksi berjalan normal!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {isolatedCustomers.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <div className="font-bold text-slate-900">{p.nama} ({p.nomorPelanggan})</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        IP: {p.ipAddress} · PPPoE: {p.pppoeUser}
                      </div>
                    </div>

                    <button
                      onClick={() => manualUnisolirRuijie(p.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    >
                      <Unlock className="w-3 h-3" />
                      <span>Buka Isolir Sekarang</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Script Generator & CLI Ruijie */}
      {activeTab === 'SCRIPTS' && (
        <RuijieScriptGenerator />
      )}

      {/* Tab 4: Ruijie API Live Console */}
      {activeTab === 'API_CONSOLE' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 border border-slate-800 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Live Event Log: Ruijie Reyee Cloud Gateway</span>
            </div>
            <span className="text-[11px]">API Host: cloud-as.ruijienetworks.com:443</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ruijieLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'ISOLIR' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-white font-bold">{log.pelangganNama}</span>
                    <span className="text-slate-500">[{log.ipAddress}]</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>

                <div className="text-slate-300 text-[11px]">
                  Reason: {log.reason}
                </div>

                <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                  <span>Trigger: <strong className="text-sky-400">{log.executedBy}</strong></span>
                  <span>Ruijie API Code: <strong className="text-emerald-400">200 OK</strong></span>
                  <span>Latency: <strong className="text-amber-400">{log.responseTimeMs}ms</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
