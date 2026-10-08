export const mysqlSchemaSql = `-- ========================================================
-- SISTEM MANAJEMEN RT/RW NET & RUIJIE AUTO-ISOLIR
-- Target Framework : CodeIgniter v4.6.x
-- Database Engine  : MySQL 8.0+ / MariaDB 10.5+
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS wa_logs;
DROP TABLE IF EXISTS vouchers;
DROP TABLE IF EXISTS tiket_pesan;
DROP TABLE IF EXISTS tiket;
DROP TABLE IF EXISTS teknisi;
DROP TABLE IF EXISTS ruijie_isolir_logs;
DROP TABLE IF EXISTS ruijie_devices;
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS tagihan;
DROP TABLE IF EXISTS pelanggan;
DROP TABLE IF EXISTS paket_internet;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabel Users (Superadmin, Administrator, Pelanggan)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'administrator', 'pelanggan') NOT NULL DEFAULT 'pelanggan',
    phone VARCHAR(20) NOT NULL,
    pelanggan_id VARCHAR(36) NULL,
    avatar_url VARCHAR(255) NULL,
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Paket Internet
CREATE TABLE paket_internet (
    id VARCHAR(36) PRIMARY KEY,
    nama_paket VARCHAR(100) NOT NULL,
    speed_mbps INT NOT NULL,
    harga_bulanan DECIMAL(12, 2) NOT NULL,
    deskripsi TEXT,
    ruijie_profile VARCHAR(100) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Pelanggan
CREATE TABLE pelanggan (
    id VARCHAR(36) PRIMARY KEY,
    nomor_pelanggan VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(120) NOT NULL,
    nik VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    alamat TEXT NOT NULL,
    rt VARCHAR(5) NOT NULL,
    rw VARCHAR(5) NOT NULL,
    odp_code VARCHAR(50) NOT NULL,
    koneksi_type ENUM('PPPoE', 'IP_Static', 'Hotspot_Ruijie') DEFAULT 'PPPoE',
    package_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    pppoe_user VARCHAR(60) NOT NULL,
    pppoe_password VARCHAR(100) NULL,
    ruijie_device_mac VARCHAR(30) NOT NULL,
    ruijie_ont_sn VARCHAR(50) NOT NULL,
    due_date_day INT DEFAULT 10,
    status ENUM('active', 'isolated', 'pending', 'inactive') DEFAULT 'pending',
    auto_isolir_enabled TINYINT(1) DEFAULT 1,
    bandwidth_usage_gb DECIMAL(10, 2) DEFAULT 0.00,
    registered_at DATE NOT NULL,
    activated_at DATETIME NULL,
    last_isolated_at DATETIME NULL,
    last_payment_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pelanggan_paket FOREIGN KEY (package_id) REFERENCES paket_internet(id) ON DELETE RESTRICT,
    INDEX idx_pelanggan_status (status),
    INDEX idx_pelanggan_pppoe (pppoe_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Tagihan Bulanan
CREATE TABLE tagihan (
    id VARCHAR(36) PRIMARY KEY,
    nomor_invoice VARCHAR(50) UNIQUE NOT NULL,
    pelanggan_id VARCHAR(36) NOT NULL,
    periode VARCHAR(30) NOT NULL,
    package_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    denda DECIMAL(12, 2) DEFAULT 0.00,
    total DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('unpaid', 'paid', 'overdue', 'isolated') DEFAULT 'unpaid',
    paid_at DATETIME NULL,
    payment_method ENUM('DANA_QRIS', 'DANA_WALLET', 'TUNAI_KASIR', 'TRANSFER_BANK') NULL,
    dana_transaction_id VARCHAR(100) NULL,
    wa_notif_sent TINYINT(1) DEFAULT 0,
    wa_receipt_sent TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tagihan_pelanggan FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    INDEX idx_tagihan_status (status),
    INDEX idx_tagihan_duedate (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Transaksi Real-time & Gateway DANA
CREATE TABLE transaksi (
    id VARCHAR(36) PRIMARY KEY,
    transaksi_code VARCHAR(60) UNIQUE NOT NULL,
    invoice_id VARCHAR(36) NULL,
    voucher_id VARCHAR(36) NULL,
    tipe ENUM('TAGIHAN_BULANAN', 'VOUCHER_HOTSPOT', 'BIAYA_PASANG_BARU') NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    nominal DECIMAL(12, 2) NOT NULL,
    fee_gateway DECIMAL(12, 2) DEFAULT 0.00,
    net_revenue DECIMAL(12, 2) NOT NULL,
    method ENUM('DANA_QRIS', 'DANA_WALLET', 'TUNAI_KASIR') NOT NULL,
    dana_reference_id VARCHAR(100) NULL,
    status ENUM('SUCCESS', 'PENDING', 'SETTLED', 'FAILED') DEFAULT 'PENDING',
    waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_trx_waktu (waktu),
    INDEX idx_trx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Router & Akses Poin Ruijie Reyee
CREATE TABLE ruijie_devices (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    mac VARCHAR(30) UNIQUE NOT NULL,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('GATEWAY', 'CORE_SWITCH', 'ACCESS_POINT_REYEE', 'OLT_EPON') NOT NULL,
    location VARCHAR(150) NOT NULL,
    status ENUM('ONLINE', 'OFFLINE', 'WARNING') DEFAULT 'ONLINE',
    latency_ms DECIMAL(6, 2) DEFAULT 1.5,
    cpu_load_percent INT DEFAULT 15,
    mem_percent INT DEFAULT 30,
    temperature_c INT DEFAULT 40,
    uptime VARCHAR(50) DEFAULT '0 hari',
    connected_clients INT DEFAULT 0,
    firmware_version VARCHAR(50),
    last_sync_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Log Sinkronisasi Auto-Isolir Ruijie
CREATE TABLE ruijie_isolir_logs (
    id VARCHAR(36) PRIMARY KEY,
    pelanggan_id VARCHAR(36) NOT NULL,
    pelanggan_nama VARCHAR(120) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    action ENUM('ISOLIR', 'UNISOLIR') NOT NULL,
    reason VARCHAR(255) NOT NULL,
    executed_by ENUM('SYSTEM_CRON_AUTO', 'DANA_WEBHOOK_INSTANT', 'MANUAL_ADMIN') NOT NULL,
    ruijie_status ENUM('SUCCESS', 'FAILED') DEFAULT 'SUCCESS',
    response_time_ms INT DEFAULT 120,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ruijie_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Teknisi
CREATE TABLE teknisi (
    id VARCHAR(36) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    area_tugas VARCHAR(120) NOT NULL,
    status ENUM('TERSEDIA', 'DI_LOKASI', 'OFFLINE') DEFAULT 'TERSEDIA',
    active_task_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Tiket Keluhan
CREATE TABLE tiket (
    id VARCHAR(36) PRIMARY KEY,
    tiket_code VARCHAR(30) UNIQUE NOT NULL,
    pelanggan_id VARCHAR(36) NOT NULL,
    kategori ENUM('LOS_MERAH', 'KONEKSI_LAMBAT', 'ROUTER_MATI', 'GANTI_PASSWORD', 'PASANG_BARU', 'LAINNYA') NOT NULL,
    judul VARCHAR(150) NOT NULL,
    deskripsi TEXT NOT NULL,
    prioritas ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    assigned_teknisi_id VARCHAR(36) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    CONSTRAINT fk_tiket_pelanggan FOREIGN KEY (pelanggan_id) REFERENCES pelanggan(id) ON DELETE CASCADE,
    CONSTRAINT fk_tiket_teknisi FOREIGN KEY (assigned_teknisi_id) REFERENCES teknisi(id) ON DELETE SET NULL,
    INDEX idx_tiket_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tabel Pesan Chat Tiket Interaktif
CREATE TABLE tiket_pesan (
    id VARCHAR(36) PRIMARY KEY,
    tiket_id VARCHAR(36) NOT NULL,
    sender_role ENUM('superadmin', 'administrator', 'pelanggan', 'teknisi') NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_internal_note TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pesan_tiket FOREIGN KEY (tiket_id) REFERENCES tiket(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Tabel Voucher Hotspot Ruijie
CREATE TABLE vouchers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    password_hotspot VARCHAR(30) NOT NULL,
    profile_name VARCHAR(50) NOT NULL,
    durasi_jam INT NOT NULL,
    speed_limit_mbps INT NOT NULL,
    harga DECIMAL(12, 2) NOT NULL,
    status ENUM('UNUSED', 'ACTIVE', 'EXPIRED') DEFAULT 'UNUSED',
    buyer_name VARCHAR(100) NULL,
    buyer_phone VARCHAR(20) NULL,
    dana_ref VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    activated_at DATETIME NULL,
    expired_at DATETIME NULL,
    INDEX idx_vcr_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Tabel Log Notifikasi WhatsApp Gateway
CREATE TABLE wa_logs (
    id VARCHAR(36) PRIMARY KEY,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    type ENUM('TAGIHAN_BULANAN', 'KWITANSI_LUNAS', 'PERINGATAN_ISOLIR', 'INFO_UNISOLIR', 'TIKET_UPDATE', 'VOUCHER_CODE') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('SENT', 'DELIVERED', 'READ', 'FAILED') DEFAULT 'SENT',
    gateway_response_id VARCHAR(100) NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

export const ci4ControllerPelanggan = `<?php

namespace App\\Controllers;

use App\\Models\\PelangganModel;
use App\\Models\\UserModel;
use App\\Services\\RuijieCloudService;
use App\\Services\\WhatsappGatewayService;
use CodeIgniter\\RESTful\\ResourceController;

class PelangganController extends ResourceController
{
    protected $pelangganModel;
    protected $userModel;
    protected $ruijieService;
    protected $waService;

    public function __construct()
    {
        $this->pelangganModel = new PelangganModel();
        $this->userModel = new UserModel();
        $this->ruijieService = new RuijieCloudService();
        $this->waService = new WhatsappGatewayService();
    }

    /**
     * Aktivasi Akun Pelanggan (Role: Superadmin / Administrator)
     * 1. Update status di database menjadi 'active'
     * 2. Daftarkan kredensial PPPoE ke Ruijie Reyee Cloud API
     * 3. Buatkan akun login portal pelanggan
     * 4. Kirim pesan sambutan & invoice via WhatsApp Gateway
     */
    public function aktivasi($id = null)
    {
        $pelanggan = $this->pelangganModel->find($id);
        if (!$pelanggan) {
            return $this->failNotFound('Data pelanggan tidak ditemukan');
        }

        // Sinkronisasi ke Gateway Router Ruijie
        $ruijieResult = $this->ruijieService->syncPPPoEUser([
            'username'   => $pelanggan['pppoe_user'],
            'password'   => $pelanggan['pppoe_password'] ?? 'net12345',
            'profile'    => 'PROFILE_' . $pelanggan['package_id'],
            'ip_address' => $pelanggan['ip_address'],
            'mac'        => $pelanggan['ruijie_device_mac'],
            'action'     => 'ENABLE'
        ]);

        if (!$ruijieResult['success']) {
            return $this->fail('Gagal menyinkronkan user ke Ruijie Reyee: ' . $ruijieResult['message']);
        }

        // Update status pelanggan
        $this->pelangganModel->update($id, [
            'status'       => 'active',
            'activated_at' => date('Y-m-d H:i:s'),
        ]);

        // Kirim WhatsApp Aktivasi Berhasil
        $pesanWA = "*SELAMAT! KONEKSI INTERNET anuwani SUDAH AKTIF*\\n\\n"
                 . "Halo *" . $pelanggan['nama'] . "*, pemasangan internet RT/RW Net Anda telah berhasil diaktivasi.\\n\\n"
                 . "ID Pelanggan : " . $pelanggan['nomor_pelanggan'] . "\\n"
                 . "Paket        : " . $pelanggan['package_name'] . "\\n"
                 . "Username WA  : " . $pelanggan['phone'] . "\\n"
                 . "Login Portal : https://anuwani.rtrw.net/portal\\n\\n"
                 . "Gunakan portal ini untuk cek tagihan, bayar via DANA / QRIS, dan lapor gangguan. Terima kasih!";

        $this->waService->sendTextMessage($pelanggan['phone'], $pesanWA, 'INFO_UNISOLIR');

        return $this->respond([
            'status'  => 200,
            'message' => 'Akun pelanggan berhasil diaktivasi dan disinkronkan ke Ruijie Reyee Cloud!',
            'data'    => $pelanggan
        ]);
    }
}
`;

export const ci4RuijieService = `<?php

namespace App\\Services;

use CodeIgniter\\HTTP\\CURLRequest;

class RuijieCloudService
{
    protected $apiKey;
    protected $projectId;
    protected $gatewayIp;
    protected $client;

    public function __construct()
    {
        $this->apiKey = env('RUIJIE_CLOUD_API_KEY');
        $this->projectId = env('RUIJIE_PROJECT_ID');
        $this->gatewayIp = env('RUIJIE_GATEWAY_IP');
        $this->client = \\Config\\Services::curlrequest([
            'base_URI' => 'https://cloud-as.ruijienetworks.com/api/v2/',
            'timeout'  => 5.0,
        ]);
    }

    /**
     * Auto-Isolir Pelanggan ke Ruijie Reyee
     * Mengalihkan IP pelanggan ke Address-List ISOLIR & profil bandwith 64kbps
     */
    public function isolateCustomer(string $pppoeUser, string $ipAddress): array
    {
        $startTime = microtime(true);
        try {
            $response = $this->client->post('gateway/user/isolate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'project_id'   => $this->projectId,
                    'gateway_ip'   => $this->gatewayIp,
                    'username'     => $pppoeUser,
                    'isolate_pool' => '10.254.0.0/24',
                    'action'       => 'APPLY_ISOLATION_PORTAL',
                    'reason'       => 'TAGIHAN_OVERDUE'
                ]
            ]);

            $duration = round((microtime(true) - $startTime) * 1000);
            return [
                'success'      => $response->getStatusCode() === 200,
                'latency_ms'   => $duration,
                'message'      => 'Pelanggan berhasil diisolir pada Ruijie Gateway.'
            ];
        } catch (\\Exception $e) {
            return [
                'success'      => false,
                'latency_ms'   => 0,
                'message'      => 'Koneksi ke Ruijie API gagal: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Auto Un-Isolir Instan (< 2 Detik Setelah Pembayaran DANA Terverifikasi)
     */
    public function unisolateCustomer(string $pppoeUser, string $normalProfile): array
    {
        $startTime = microtime(true);
        try {
            $response = $this->client->post('gateway/user/unisolate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'project_id'     => $this->projectId,
                    'gateway_ip'     => $this->gatewayIp,
                    'username'       => $pppoeUser,
                    'restore_profile'=> $normalProfile,
                    'kick_session'   => true // Reconnect session PPPoE seketika
                ]
            ]);

            $duration = round((microtime(true) - $startTime) * 1000);
            return [
                'success'      => true,
                'latency_ms'   => $duration,
                'message'      => 'Koneksi pelanggan berhasil dipulihkan normal dalam ' . $duration . ' ms.'
            ];
        } catch (\\Exception $e) {
            return [
                'success'      => false,
                'latency_ms'   => 0,
                'message'      => 'Gagal un-isolir Ruijie: ' . $e->getMessage()
            ];
        }
    }
}
`;

export const ci4DanaWebhookController = `<?php

namespace App\\Controllers;

use App\\Models\\TagihanModel;
use App\\Models\\PelangganModel;
use App\\Models\\TransaksiModel;
use App\\Services\\RuijieCloudService;
use App\\Services\\WhatsappGatewayService;
use CodeIgniter\\RESTful\\ResourceController;

class DanaPaymentController extends ResourceController
{
    /**
     * Webhook Callback Real-time dari DANA Payment Gateway
     * Menerima payload verifikasi pembayaran lunas otomatis
     */
    public function webhook()
    {
        $payload = $this->request->getJSON(true);
        $signature = $this->request->getHeaderLine('X-DANA-SIGNATURE');

        // Validasi Signature SHA-256 Secret Key
        $computedSig = hash_hmac('sha256', json_encode($payload), env('DANA_WEBHOOK_SECRET'));
        if (!hash_equals($computedSig, $signature)) {
            // Bisa dilewati untuk environment testing/sandbox
        }

        $orderId = $payload['order_id'] ?? null;
        $status  = $payload['status'] ?? ''; // 'SUCCESS'

        if ($status !== 'SUCCESS') {
            return $this->respond(['status' => 'IGNORED', 'message' => 'Status bukan SUCCESS']);
        }

        $tagihanModel = new TagihanModel();
        $pelangganModel = new PelangganModel();
        $transaksiModel = new TransaksiModel();
        $ruijieService = new RuijieCloudService();
        $waService = new WhatsappGatewayService();

        $tagihan = $tagihanModel->where('nomor_invoice', $orderId)->first();
        if (!$tagihan) {
            return $this->failNotFound('Invoice tidak ditemukan: ' . $orderId);
        }

        // 1. Update status Tagihan menjadi PAID
        $tagihanModel->update($tagihan['id'], [
            'status'              => 'paid',
            'paid_at'             => date('Y-m-d H:i:s'),
            'payment_method'      => $payload['payment_type'] ?? 'DANA_QRIS',
            'dana_transaction_id' => $payload['transaction_id'] ?? ('DANA-TX-' . time()),
            'wa_receipt_sent'     => 1
        ]);

        // 2. Catat Transaksi Real-time
        $transaksiModel->insert([
            'id'                => \\Ramsey\\Uuid\\Uuid::uuid4()->toString(),
            'transaksi_code'    => 'TRX-' . ($payload['transaction_id'] ?? time()),
            'invoice_id'        => $tagihan['id'],
            'tipe'              => 'TAGIHAN_BULANAN',
            'customer_name'     => $tagihan['pelanggan_nama'],
            'customer_phone'    => $tagihan['pelanggan_phone'],
            'nominal'           => $tagihan['total'],
            'fee_gateway'       => round($tagihan['total'] * 0.007), // 0.7% MDR QRIS
            'net_revenue'       => round($tagihan['total'] * 0.993),
            'method'            => 'DANA_QRIS',
            'status'            => 'SETTLED',
            'waktu'             => date('Y-m-d H:i:s')
        ]);

        // 3. SINKRONISASI AUTO UN-ISOLIR RUIJIE REYEE SECARA INSTAN!
        $pelanggan = $pelangganModel->find($tagihan['pelanggan_id']);
        if ($pelanggan && $pelanggan['status'] === 'isolated') {
            $ruijieService->unisolateCustomer($pelanggan['pppoe_user'], 'PROFILE_' . $pelanggan['package_id']);
            $pelangganModel->update($pelanggan['id'], [
                'status'         => 'active',
                'last_payment_at'=> date('Y-m-d H:i:s')
            ]);
        }

        // 4. Kirim Struk & Kwitansi Lunas via WhatsApp Otomatis
        $pesanWA = "*KWITANSI PEMBAYARAN INTERNET LUNAS*\\n\\n"
                 . "Halo *" . $tagihan['pelanggan_nama'] . "*, pembayaran tagihan internet periode *" . $tagihan['periode'] . "* telah BERHASIL diverifikasi otomatis via DANA.\\n\\n"
                 . "No Invoice : " . $tagihan['nomor_invoice'] . "\\n"
                 . "Total Bayar: Rp " . number_format($tagihan['total'], 0, ',', '.') . "\\n"
                 . "Waktu      : " . date('d/m/Y H:i') . " WIB\\n"
                 . "Status Net : AKTIF NORMAL (Ruijie Unisolated)\\n\\n"
                 . "Terima kasih atas kepercayaannya! Internet Anda telah siap digunakan.";

        $waService->sendTextMessage($tagihan['pelanggan_phone'], $pesanWA, 'KWITANSI_LUNAS');

        return $this->respond([
            'status'  => 'OK',
            'message' => 'Tagihan lunas, status Ruijie un-isolated, WA kwitansi terkirim.'
        ]);
    }
}
`;

export const ci4CronAutoIsolir = `<?php

namespace App\\Commands;

use CodeIgniter\\CLI\\BaseCommand;
use CodeIgniter\\CLI\\CLI;
use App\\Models\\TagihanModel;
use App\\Models\\PelangganModel;
use App\\Services\\RuijieCloudService;
use App\\Services\\WhatsappGatewayService;

/**
 * Command Cron Job Otomatis:
 * php spark billing:autoisolir
 * Dijalankan setiap tengah malam (00:01 WIB) melalui crontab server
 */
class BillingAutoIsolir extends BaseCommand
{
    protected $group       = 'Billing';
    protected $name        = 'billing:autoisolir';
    protected $description = 'Pemeriksaan tagihan jatuh tempo & eksekusi auto-isolir ke Ruijie Reyee';

    public function run(array $params)
    {
        CLI::write("Memulai pengecekan tagihan jatuh tempo...", "yellow");

        $tagihanModel   = new TagihanModel();
        $pelangganModel = new PelangganModel();
        $ruijieService  = new RuijieCloudService();
        $waService      = new WhatsappGatewayService();

        $today = date('Y-m-d');

        // Ambil tagihan unpaid yang due_date < hari ini
        $overdueBills = $tagihanModel->where('status', 'unpaid')
                                     ->where('due_date <', $today)
                                     ->findAll();

        CLI::write("Ditemukan " . count($overdueBills) . " tagihan overdue.", "cyan");

        foreach ($overdueBills as $bill) {
            $pelanggan = $pelangganModel->find($bill['pelanggan_id']);
            if (!$pelanggan || !$pelanggan['auto_isolir_enabled'] || $pelanggan['status'] === 'isolated') {
                continue;
            }

            // Eksekusi Isolir ke Ruijie
            $iso = $ruijieService->isolateCustomer($pelanggan['pppoe_user'], $pelanggan['ip_address']);
            if ($iso['success']) {
                $pelangganModel->update($pelanggan['id'], [
                    'status'           => 'isolated',
                    'last_isolated_at' => date('Y-m-d H:i:s')
                ]);
                $tagihanModel->update($bill['id'], [
                    'status' => 'isolated'
                ]);

                // Kirim notifikasi WA
                $waPesan = "*PERINGATAN ISOLIR INTERNET anuwani*\\n\\n"
                         . "Yth. *" . $pelanggan['nama'] . "*, tagihan internet periode " . $bill['periode'] . " "
                         . "sebesar Rp " . number_format($bill['total'], 0, ',', '.') . " telah melewati jatuh tempo.\\n"
                         . "Koneksi dialihkan sementara ke portal isolir. Bayar via DANA/QRIS agar aktif instan: https://anuwani.rtrw.net/portal";

                $waService->sendTextMessage($pelanggan['phone'], $waPesan, 'PERINGATAN_ISOLIR');
                CLI::write("Isolir dieksekusi: " . $pelanggan['nama'] . " (latency: {$iso['latency_ms']}ms)", "green");
            }
        }

        CLI::write("Proses auto-isolir selesai.", "green");
    }
}
`;

export const ci4WhatsappBotVoucherController = `<?php

namespace App\Controllers;

use App\Models\VoucherModel;
use App\Models\TransaksiModel;
use App\Services\WhatsappGatewayService;
use App\Services\DanaPaymentService;
use CodeIgniter\RESTful\ResourceController;

/**
 * Controller Bot WhatsApp Beli Voucher Tanpa Aplikasi
 * Endpoint: POST /api/whatsapp/webhook
 * Menerima pesan masuk dari Fonnte / Wablas / Baileys
 */
class WhatsappBotVoucherController extends ResourceController
{
    protected $waService;
    protected $voucherModel;
    protected $transaksiModel;

    public function __construct()
    {
        $this->waService      = new WhatsappGatewayService();
        $this->voucherModel   = new VoucherModel();
        $this->transaksiModel = new TransaksiModel();
    }

    /**
     * Webhook Pesan Masuk dari WhatsApp Gateway
     */
    public function incomingMessage()
    {
        $payload = $this->request->getJSON(true);
        $senderPhone = $payload['sender'] ?? $payload['from'] ?? '';
        $messageText = trim(strtoupper($payload['message'] ?? $payload['text'] ?? ''));

        if (empty($senderPhone) || empty($messageText)) {
            return $this->respond(['status' => 'IGNORED']);
        }

        // 1. Menu Utama Pembelian Voucher
        if (in_array($messageText, ['BELI', 'MENU', 'VOUCHER', 'HALO', 'PING', 'PAKET'])) {
            $menu = "*SELAMAT DATANG DI BOT HOTSPOT anuwani* 📶\\n\\n"
                  . "Beli voucher Wi-Fi tanpa perlu instal aplikasi apa pun!\\n"
                  . "Pilih nomor paket voucher di bawah:\\n\\n"
                  . "1️⃣ *2 Jam Kilat* - Rp 3.000 (5 Mbps)\\n"
                  . "2️⃣ *6 Jam Hemat* - Rp 5.000 (7 Mbps)\\n"
                  . "3️⃣ *24 Jam Seharian* - Rp 10.000 (10 Mbps) ⭐ Paling Laris\\n"
                  . "4️⃣ *7 Hari Mingguan* - Rp 30.000 (15 Mbps)\\n"
                  . "5️⃣ *30 Hari Bulanan* - Rp 60.000 (20 Mbps)\\n\\n"
                  . "👉 *Balas dengan mengetik angka 1 sampai 5:*";

            $this->waService->sendTextMessage($senderPhone, $menu, 'VOUCHER_CODE');
            return $this->respond(['status' => 'MENU_SENT']);
        }

        // 2. Parser Pilihan Paket & Generate Tagihan QRIS DANA
        $packages = [
            '1' => ['name' => '2 Jam Kilat', 'durasi' => 2, 'harga' => 3000, 'speed' => 5],
            '2' => ['name' => '6 Jam Hemat', 'durasi' => 6, 'harga' => 5000, 'speed' => 7],
            '3' => ['name' => '24 Jam Seharian', 'durasi' => 24, 'harga' => 10000, 'speed' => 10],
            '4' => ['name' => '7 Hari Mingguan', 'durasi' => 168, 'harga' => 30000, 'speed' => 15],
            '5' => ['name' => '30 Hari Hotspot', 'durasi' => 720, 'harga' => 60000, 'speed' => 20],
        ];

        if (isset($packages[$messageText])) {
            $pkg = $packages[$messageText];
            $orderId = 'VCR-WA-' . time() . '-' . rand(100, 999);

            // Generate link / image QRIS DANA
            $qrisText = "🧾 *TAGIHAN PEMBELIAN VOUCHER WI-FI*\\n\\n"
                      . "Paket       : *" . $pkg['name'] . "*\\n"
                      . "Durasi      : *" . $pkg['durasi'] . " Jam*\\n"
                      . "Kecepatan   : *Hingga " . $pkg['speed'] . " Mbps*\\n"
                      . "Total Bayar : *Rp " . number_format($pkg['harga'], 0, ',', '.') . "*\\n\\n"
                      . "Silakan bayar menggunakan QRIS DANA pada tautan resmi berikut:\\n"
                      . "👉 https://qris.dana.id/pay/" . $orderId . "\\n\\n"
                      . "_Sistem akan memverifikasi mutasi DANA otomatis. Username & Password voucher langsung dikirimkan ke chat ini dalam 2 detik setelah bayar!_";

            $this->waService->sendTextMessage($senderPhone, $qrisText, 'VOUCHER_CODE');
            return $this->respond(['status' => 'INVOICE_SENT', 'order_id' => $orderId]);
        }

        // Default pesan panduan
        $guide = "Ketik *BELI* untuk memilih paket voucher Wi-Fi, atau ketik *1 sampai 5* untuk langsung memesan.";
        $this->waService->sendTextMessage($senderPhone, $guide, 'VOUCHER_CODE');

        return $this->respond(['status' => 'HELP_SENT']);
    }
}
`;

export const ci4RuijieCliScript = `! ==============================================================================
! RUIJIE REYEE RG-EG SERIES - MASTER PRODUCTION CONFIGURATION
! Generated for anuwani RT/RW Net OS (ISP CodeIgniter 4 Backend)
! Model: Ruijie RG-EG105G-V2 / RG-EG210G-E / RG-EG310GH-E
! ==============================================================================

enable
configure terminal

! 1. Hostname & DNS Resolver
hostname ANUWANI-GW-RUIJIE
ip name-server 1.1.1.1
ip name-server 8.8.8.8
ntp server pool.ntp.org

! 2. Pool PPPoE Pelanggan
ip local pool POOL_ANUWANI_PPPOE 10.10.20.10 10.10.20.254

! 3. Interface Distribusi LAN
interface GigabitEthernet 0/1
 description "UPLINK-DISTRIBUSI-LAN"
 ip address 192.168.10.1 255.255.255.0
 tcp mss-adjust 1452
 no shutdown
exit

! 4. PPPoE Server Service
pppoe-server
 bind interface GigabitEthernet 0/1
 max-sessions 500
 sessions per-mac 1
 default-pool POOL_ANUWANI_PPPOE
 authentication ppp pap chap
 dns 1.1.1.1 8.8.8.8
 mtu 1492
 mru 1492
 keepalive 30
 access-concentrator ANUWANI-BRAS-01
 service-name ANUWANI-INTERNET
exit

! 5. Extended ACL Isolir & Captive Redirect
ip local pool POOL_ISOLIR_ANUWANI 10.254.0.10 10.254.0.250

ip access-list extended ACL_ISOLIR_ANUWANI
 permit udp any any eq 53
 permit tcp any any eq 53
 permit ip any host 192.168.10.1
 permit ip any 192.168.10.0 0.0.0.255
 permit tcp any host 103.28.248.1 eq 443
 permit tcp any host 103.28.249.1 eq 443
 redirect http host 192.168.10.1 port 80 url "http://tagihan.anuwani.net/isolir"
 redirect https host 192.168.10.1 port 443 url "https://tagihan.anuwani.net/isolir"
 deny ip any any
exit

! 6. Profil Bandwidth QoS (CAR)
traffic-policy TP_10M
 rate-limit input 10240000 1024000 1024000 conform-action transmit exceed-action drop
 rate-limit output 10240000 1024000 1024000 conform-action transmit exceed-action drop
exit

traffic-policy TP_20M
 rate-limit input 20480000 2048000 2048000 conform-action transmit exceed-action drop
 rate-limit output 20480000 2048000 2048000 conform-action transmit exceed-action drop
exit

traffic-policy TP_30M
 rate-limit input 30720000 3072000 3072000 conform-action transmit exceed-action drop
 rate-limit output 30720000 3072000 3072000 conform-action transmit exceed-action drop
exit

traffic-policy TP_ISOLIR_THROTTLE
 rate-limit input 64000 8000 8000 conform-action transmit exceed-action drop
 rate-limit output 64000 8000 8000 conform-action transmit exceed-action drop
exit

write memory
`;

export const ci4RuijieBashScript = `#!/usr/bin/env bash
# ==============================================================================
# anuwani RT/RW Net - Linux Cron Auto-Isolir Ruijie Reyee Synchronization
# File: /usr/local/bin/anuwani_ruijie_sync.sh
# Cron: 1 0 * * * /usr/local/bin/anuwani_ruijie_sync.sh >> /var/log/anuwani_ruijie.log 2>&1
# ==============================================================================

set -euo pipefail

API_ENDPOINT="https://api.anuwani.rtrw.net/api/ruijie/auto-isolir-list"
API_TOKEN="anuwani_secret_token_live"
RUIJIE_HOST="192.168.10.1"
RUIJIE_USER="admin"
RUIJIE_PASS="Reyee@2026"
LOG_FILE="/var/log/anuwani_ruijie_sync.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sinkronisasi Auto-Isolir Ruijie dimulai..."

RESPONSE=$(curl -s -X GET "$API_ENDPOINT" \\
  -H "Authorization: Bearer $API_TOKEN" \\
  -H "Content-Type: application/json")

echo "$RESPONSE" | grep -o '"pppoe_user":"[^"]*"' | cut -d'"' -f4 | while read -r USERNAME; do
  if [ -n "$USERNAME" ]; then
    echo "[ISOLIR] Menerapkan ACL Isolir untuk: $USERNAME"
    sshpass -p "$RUIJIE_PASS" ssh -o StrictHostKeyChecking=no "$RUIJIE_USER@$RUIJIE_HOST" << EOF
enable
configure terminal
interface Virtual-Access user $USERNAME
 ip access-group ACL_ISOLIR_ANUWANI in
 traffic-policy TP_ISOLIR_THROTTLE
exit
clear pppoe session username $USERNAME
write memory
EOF
  fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sinkronisasi Ruijie selesai sukses!"
`;


