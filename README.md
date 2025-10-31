# SIMS PPOB API Backend

Proyek ini merupakan proyek backend untuk aplikasi SIMS PPOB (Payment Point Online Bank), yang dibuat sebagai bagian dari *Technical Test*. Aplikasi ini dibangun menggunakan Node.js, Express, dan PostgreSQL, dengan fokus pada *clean code*, keamanan (JWT), dan konsistensi data (Transaksi Atomik).

Aplikasi ini di-deploy dan dapat diakses secara *live* melalui Vercel, dengan database PostgreSQL yang di-hosting di Neon.tech. 

Aplikasi ini dideploy pada link berikut https://sims-ppob-express-backend.vercel.app/

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5.x-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

## 📋 Fitur Utama

API ini mencakup fungsionalitas penuh dari kontrak API yang diberikan, dibagi menjadi 5 modul utama:

* **1. Autentikasi (Membership):**
    * Registrasi user baru dengan validasi dan *hashing* password (`bcryptjs`).
    * Login user dengan validasi dan pembuatan **JSON Web Token (JWT)**.
* **2. Manajemen Profil:**
    * *Endpoint* terproteksi (`authMiddleware`) untuk mendapatkan profil user.
    * Update data profil (nama depan, nama belakang).
    * Update foto profil (menggunakan `multer` untuk *file upload*).
* **3. Informasi (Publik & Privat):**
    * Menampilkan daftar *Banner* (Endpoint Publik).
    * Menampilkan daftar Layanan/Servis (Endpoint Privat, memerlukan JWT).
* **4. Transaksi (Uang Masuk):**
    * Mengecek saldo user (`GET /balance`).
    * Melakukan Top Up saldo menggunakan **Transaksi Database Atomik** (`BEGIN`, `COMMIT`, `ROLLBACK`) untuk memastikan integritas data (mencatat di `transactions` dan memperbarui `users.balance`).
* **5. Transaksi (Uang Keluar & Riwayat):**
    * Melakukan Pembayaran (`POST /transaction`) menggunakan **Transaksi Database Atomik** untuk mengecek kecukupan saldo, mengurangi saldo, dan mencatat transaksi.
    * Menampilkan riwayat transaksi (`GET /transaction/history`) dengan fungsionalitas paginasi (`limit` dan `offset`) dan pengurutan (terbaru dulu).

## 🛠️ Teknologi & Stack

* **Bahasa:** JavaScript (Node.js)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Klien Database:** `node-postgres` (pg)
* **Autentikasi:** `jsonwebtoken` (JWT)
* **Hashing Password:** `bcryptjs`
* **File Uploads:** `multer`
* **Environment Variables:** `dotenv`
* **CORS:** `cors`
* **Deployment (Aplikasi):** Vercel
* **Deployment (Database):** Neon.tech (Serverless PostgreSQL)
* **Testing:** Postman

## 📁 Struktur Proyek

Berikut struktur dari proyek ini.
```
sims-ppob-express-backend/
│
├── api/
│   └── index.js            # Entry point utama untuk Vercel (Serverless Function)
│
├── src/
│   ├── config/
│   │   └── db.js           # Konfigurasi koneksi database (Pool) dgn SSL
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── infoController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── authMiddleware.js # Middleware verifikasi JWT
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── infoRoutes.js
│   │   └── transactionRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── infoService.js
│   │   └── transactionService.js # Logika bisnis & transaksi atomik
│   └── utils/
│       ├── fileUpload.js     # Konfigurasi Multer
│       ├── invoiceGenerator.js # Generator ID unik transaksi
│       └── response.js       # Format response JSON standar
│
├── .gitignore
├── db_design.sql           # Desain database (DDL) & Seed Data
├── package.json
├── package-lock.json
└── SIMS_PPOB_API.postman_collection.json # Koleksi pengujian Postman
```

## 📄 Penjelasan File Penting

#### `db_design.sql`

Ini adalah **cetak biru (blueprint)** untuk seluruh database. File ini berisi:

1.  **DDL (Data Definition Language):** Semua kueri `CREATE TABLE` untuk `users`, `banners`, `services`, dan `transactions`.
2.  **Foreign Keys:** Relasi antara `transactions` dan `users`.
3.  **Trigger PostgreSQL:** Fungsi `update_updated_at_column()` yang secara otomatis memperbarui kolom `updated_at` setiap kali data *user* diubah.
4.  **Seed Data:** Kueri `INSERT INTO` untuk mengisi tabel `banners` dan `services` dengan data awal sesuai kontrak API.

#### `SIMS_PPOB_API.postman_collection.json`

Ini adalah koleksi Postman lengkap yang digunakan untuk menguji **setiap *endpoint*** dalam API ini.

* **Otomatisasi Token:** Koleksi ini dikonfigurasi untuk secara otomatis mengambil `token` JWT dari *response* `POST /login` dan menyimpannya sebagai variabel koleksi.
* **Otomatisasi Auth:** Semua *request* privat (seperti `/profile`, `/services`, `/transaction`, dll.) sudah diatur untuk menggunakan variabel `token` tersebut secara otomatis sebagai *Bearer Token* di *header* otorisasi.

## 🚀 Instalasi & Setup Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda:

1.  **Clone Repository**

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database PostgreSQL**
    * Buat database baru di PostgreSQL lokal Anda (misalnya, menggunakan pgAdmin).
    * Beri nama database (misal: `sims_ppob_db`).
    * Buka **Query Tool** di pgAdmin, **salin** seluruh isi file `db_design.sql`, dan **jalankan** skrip tersebut untuk membuat tabel dan *seed data*.

4.  **Konfigurasi Environment Variables**
    * Buat file `.env` di *root* proyek.
    * Salin isi dari `.env.example` (jika ada) atau tambahkan variabel berikut:

    ```env
    # Konfigurasi Database Lokal
    DB_USER=postgres
    DB_HOST=localhost
    DB_NAME=sims_ppob_db
    DB_PASSWORD=password-anda
    DB_PORT=5432
    
    # Konfigurasi JWT
    JWT_SECRET=buat-jwt-secret-anda
    JWT_EXPIRES_IN=12h
    
    # Port Server
    PORT=3000
    ```

5.  **Jalankan Server (Development)**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

## 🌐 Deployment

Layanan API ini di-deploy menggunakan infrastruktur *serverless*:

* **Aplikasi (Backend):** Di-hosting di **Vercel**, terhubung langsung ke *repository* GitHub untuk CI/CD (Deploy otomatis setiap `git push`).
* **Database:** Menggunakan **Neon.tech** (Serverless PostgreSQL).
* **Konfigurasi Koneksi:** Koneksi antara Vercel dan Neon diwajibkan menggunakan **SSL** (`ssl: { require: true }`) untuk keamanan data, yang sudah diatur dalam file `src/config/db.js`.
