import React, { useState } from 'react';
import {
  mysqlSchemaSql,
  ci4ControllerPelanggan,
  ci4RuijieService,
  ci4DanaWebhookController,
  ci4CronAutoIsolir,
  ci4WhatsappBotVoucherController,
  ci4RuijieCliScript,
  ci4RuijieBashScript
} from '../data/ci4Codebase';
import {
  FileCode2,
  Database,
  Copy,
  Check,
  Download,
  Terminal,
  FolderTree,
  Server,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export const Ci4ExportView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'MYSQL' | 'PELANGGAN_CTRL' | 'RUIJIE_SERVICE' | 'DANA_WEBHOOK' | 'CRON_COMMAND' | 'WA_BOT_CTRL' | 'RUIJIE_SCRIPTS'>('MYSQL');
  const [copied, setCopied] = useState(false);

  const getCodeContent = () => {
    switch (activeCodeTab) {
      case 'MYSQL':
        return mysqlSchemaSql;
      case 'PELANGGAN_CTRL':
        return ci4ControllerPelanggan;
      case 'RUIJIE_SERVICE':
        return ci4RuijieService;
      case 'DANA_WEBHOOK':
        return ci4DanaWebhookController;
      case 'CRON_COMMAND':
        return ci4CronAutoIsolir;
      case 'WA_BOT_CTRL':
        return ci4WhatsappBotVoucherController;
      case 'RUIJIE_SCRIPTS':
        return `${ci4RuijieCliScript}\n\n# ==============================================================================\n# LINUX SERVER CRON BASH SCRIPT (anuwani_ruijie_sync.sh)\n# ==============================================================================\n\n${ci4RuijieBashScript}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([mysqlSchemaSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rtrwnet_mysql_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-3 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Arsitektur CodeIgniter v4.6.x & Database MySQL</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Source Code CodeIgniter 4.6.x & DDL Skema MySQL
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Berikut adalah struktur kode sumber PHP CodeIgniter v4.6.x dan skema database MySQL lengkap siap pakai untuk sistem RT/RW Net Anda. Anda dapat menyalin kode, mengunduh file <code>.sql</code>, atau mengimplementasikannya langsung pada hosting / VPS Linux cPanel Anda.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadSql}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Skema MySQL (.sql)</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center space-x-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kode Tersalin!' : 'Salin Kode Aktif'}</span>
          </button>
        </div>
      </div>

      {/* Code Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-medium">
        <button
          onClick={() => setActiveCodeTab('MYSQL')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'MYSQL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>1. Database MySQL (DDL Schema & Indexes)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('PELANGGAN_CTRL')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'PELANGGAN_CTRL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5 text-sky-600" />
          <span>2. PelangganController.php (Aktivasi)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('RUIJIE_SERVICE')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'RUIJIE_SERVICE' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-indigo-600" />
          <span>3. RuijieCloudService.php (Auto-Isolir API)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('DANA_WEBHOOK')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'DANA_WEBHOOK' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5 text-amber-600" />
          <span>4. DanaPaymentController.php (Webhook & Unisolir)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('CRON_COMMAND')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'CRON_COMMAND' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-rose-600" />
          <span>5. BillingAutoIsolir.php (CLI Cron Job)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('WA_BOT_CTRL')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'WA_BOT_CTRL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>6. WhatsappBotVoucherController.php (Beli via WA)</span>
        </button>

        <button
          onClick={() => setActiveCodeTab('RUIJIE_SCRIPTS')}
          className={`px-3 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
            activeCodeTab === 'RUIJIE_SCRIPTS' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-600" />
          <span>7. Script Ruijie Reyee (CLI & Bash Sync)</span>
        </button>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="ml-2 text-slate-200">
              {activeCodeTab === 'MYSQL' ? 'database/rtrwnet_mysql_schema.sql' :
               activeCodeTab === 'PELANGGAN_CTRL' ? 'app/Controllers/PelangganController.php' :
               activeCodeTab === 'RUIJIE_SERVICE' ? 'app/Services/RuijieCloudService.php' :
               activeCodeTab === 'DANA_WEBHOOK' ? 'app/Controllers/DanaPaymentController.php' :
               activeCodeTab === 'CRON_COMMAND' ? 'app/Commands/BillingAutoIsolir.php' :
               activeCodeTab === 'WA_BOT_CTRL' ? 'app/Controllers/WhatsappBotVoucherController.php' :
               'scripts/ruijie_gateway_and_sync.cfg'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>

        <pre className="p-5 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[500px] leading-relaxed selection:bg-emerald-900">
          <code>{getCodeContent()}</code>
        </pre>
      </div>

      {/* CI4 Setup Guide & Directory Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Directory structure */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <FolderTree className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Struktur Direktori CodeIgniter 4.6.x
            </h3>
          </div>

          <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-xl overflow-x-auto leading-relaxed">
{`app/
├── Commands/
│   └── BillingAutoIsolir.php   <-- Cron Job php spark billing:autoisolir
├── Config/
│   ├── Database.php            <-- MySQL connection
│   └── Routes.php              <-- REST API & Webhook endpoints
├── Controllers/
│   ├── PelangganController.php <-- Aktivasi & Manajemen User
│   ├── BillingController.php   <-- Tagihan & Transaksi
│   ├── DanaPaymentController.php <-- Webhook DANA & QRIS
│   ├── TiketController.php     <-- Helpdesk Keluhan
│   └── VoucherController.php   <-- Kios Voucher Hotspot
├── Models/
│   ├── PelangganModel.php
│   ├── TagihanModel.php
│   └── TransaksiModel.php
└── Services/
    ├── RuijieCloudService.php  <-- Auto-Isolir Ruijie Reyee API
    └── WhatsappGatewayService.php <-- Fonnte / Wablas Bot`}
          </pre>
        </div>

        {/* Deployment instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Panduan Menjalankan di Server / Hosting
            </h3>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
            <li>
              <strong>Import Database MySQL</strong>: Jalankan skrip <code>rtrwnet_mysql_schema.sql</code> di phpMyAdmin atau terminal <code>mysql -u user -p rtrw_db &lt; schema.sql</code>.
            </li>
            <li>
              <strong>Konfigurasi .env</strong>:
              <pre className="mt-1 p-2 bg-slate-50 rounded font-mono text-[10px] text-slate-800">
{`database.default.hostname = localhost
database.default.database = rtrw_db
database.default.username = root
database.default.password = secret
RUIJIE_CLOUD_API_KEY = rj_cloud_api_v2_f8190cbb1234
DANA_WEBHOOK_SECRET = whsec_dana_ruijie_auto_sync`}
              </pre>
            </li>
            <li>
              <strong>Crontab Server Linux (Auto-Isolir)</strong>:
              <pre className="mt-1 p-2 bg-slate-50 rounded font-mono text-[10px] text-slate-800">
                1 0 * * * cd /var/www/rtrw-ci4 && php spark billing:autoisolir &gt;&gt; /var/log/autoisolir.log 2&gt;&amp;1
              </pre>
            </li>
          </ol>
        </div>

      </div>

    </div>
  );
};
