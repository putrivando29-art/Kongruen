# Tutorial Login Siswa dan Dasbor Guru GeoMatch dengan Firebase

Tutorial ini menjelaskan cara mengaktifkan login siswa, penyimpanan hasil pengerjaan di server, dan dasbor guru pada website GeoMatch, dari awal sampai siap dipakai di kelas.

| Butir | Keterangan |
|---|---|
| Layanan | Firebase dari Google: **Authentication** (login) dan **Cloud Firestore** (database) |
| Biaya | Paket gratis (Spark) cukup untuk satu atau beberapa kelas; lihat bagian 13 |
| Waktu penyiapan | Sekitar 30-60 menit untuk pertama kali |
| Yang dibutuhkan | Akun Google, akses ke repositori GitHub GeoMatch, situs Netlify (opsional tetapi disarankan) |
| Berkas yang diubah | Hanya `js/firebase-config.js` |
| Berkas aturan keamanan | `firestore.rules` (disalin ke Firebase Console) |

Catatan: tampilan dan nama menu Firebase Console dapat sedikit berubah dari waktu ke waktu. Jika nama tombol berbeda, cari menu dengan arti yang sama. Dokumentasi resmi: https://firebase.google.com/docs/web/setup

---

## 1. Cara Kerja Sistem

```
Siswa  -> Daftar/Masuk (Firebase Authentication)
       -> Mengerjakan materi, misi, latihan, evaluasi
       -> Progres dikirim otomatis ke Firestore (dokumen progress/<uid siswa>)

Guru   -> Masuk dengan akun guru (dibuat admin di Firebase Console)
       -> Dasbor Guru membaca semua dokumen progress
       -> Melihat skor, capaian per TP, jawaban uraian, dan mengunduh rekap CSV
```

Data yang disimpan di Firestore:

| Koleksi | Isi | Siapa yang boleh membaca | Siapa yang boleh menulis |
|---|---|---|---|
| `users/{uid}` | Nama, kelas, email, peran `siswa` | Siswa itu sendiri dan guru | Siswa itu sendiri |
| `progress/{uid}` | Seluruh progres (misi, latihan, evaluasi, jawaban uraian) dan ringkasan skor | Siswa itu sendiri dan guru | Siswa itu sendiri |
| `teachers/{uid}` | Penanda akun guru (nama guru) | Guru itu sendiri | Hanya admin lewat Firebase Console |

Seorang akun disebut **guru** jika ada dokumen `teachers/<UID akun tersebut>`. Dokumen ini tidak bisa dibuat dari website, sehingga siswa tidak dapat menjadikan dirinya guru.

---

## 2. Membuat Proyek Firebase

1. Buka https://console.firebase.google.com dan masuk dengan akun Google sekolah atau akun Google guru.
2. Klik **Create a project** (atau **Add project** / **Buat proyek**).
3. Isi nama proyek, misalnya `geomatch-smpn1`. Firebase akan membuat **Project ID** unik (contoh: `geomatch-smpn1`). Catat Project ID ini.
4. Saat ditanya Google Analytics, boleh dimatikan (tidak dibutuhkan GeoMatch). Klik **Create project**.
5. Tunggu sampai proyek selesai dibuat, lalu klik **Continue**.

---

## 3. Mendaftarkan Aplikasi Web dan Mengambil Konfigurasi

1. Di halaman **Project Overview**, klik ikon **Web** (simbol `</>`).
2. Isi **App nickname**, misalnya `GeoMatch Web`. Kotak **Firebase Hosting** tidak perlu dicentang (website dihosting di Netlify).
3. Klik **Register app**.
4. Firebase menampilkan kode berisi objek `firebaseConfig`, kira-kira seperti ini (nilai di bawah hanya contoh):

```
const firebaseConfig = {
  apiKey: "AIzaSy...contoh...",
  authDomain: "geomatch-smpn1.firebaseapp.com",
  projectId: "geomatch-smpn1",
  storageBucket: "geomatch-smpn1.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

5. Salin keenam nilai tersebut. Bagian kode `npm install` dan `import` yang ditampilkan Firebase **tidak perlu** diikuti, karena GeoMatch sudah menyertakan SDK Firebase di folder `vendor/firebase/`.
6. Jika jendela ini tertutup, konfigurasi dapat dilihat lagi di **Project settings** (ikon roda gigi) > **General** > **Your apps**.

Catatan keamanan: `apiKey` Firebase untuk aplikasi web memang ditaruh di kode yang dapat dilihat publik. Keamanan data dijaga oleh aturan Firestore (langkah 6), bukan dengan merahasiakan apiKey. Penjelasan resmi: https://firebase.google.com/docs/projects/api-keys

---

## 4. Mengaktifkan Login Email dan Kata Sandi

1. Di menu kiri, buka **Build** > **Authentication**.
2. Klik **Get started**.
3. Buka tab **Sign-in method**.
4. Pilih **Email/Password**, aktifkan sakelar pertama (**Email/Password**), lalu klik **Save**. Sakelar kedua (Email link / passwordless) tidak perlu diaktifkan.

---

## 5. Membuat Database Cloud Firestore

1. Di menu kiri, buka **Build** > **Firestore Database**.
2. Klik **Create database**.
3. Jika diminta memilih edisi, pilih edisi standar.
4. Pilih **lokasi** database. Untuk Indonesia, pilih lokasi terdekat yang tersedia (misalnya `asia-southeast2 (Jakarta)` jika ada di daftar). Lokasi **tidak dapat diubah** setelah dibuat.
5. Pilih **Start in production mode**, lalu klik **Create**.

---

## 6. Memasang Aturan Keamanan (Wajib)

Tanpa langkah ini, website tidak bisa menyimpan data (mode produksi menolak semua akses).

1. Di **Firestore Database**, buka tab **Rules**.
2. Hapus seluruh isi editor.
3. Buka berkas `firestore.rules` di repositori GeoMatch, salin **seluruh** isinya, lalu tempel ke editor.
4. Klik **Publish**.

Yang dijamin oleh aturan ini (sudah diuji dengan Firebase Emulator, 17 skenario lulus):

| Skenario | Hasil |
|---|---|
| Siswa menyimpan dan membaca progresnya sendiri | Diizinkan |
| Siswa membaca atau mengubah progres siswa lain | Ditolak |
| Siswa melihat daftar semua siswa | Ditolak |
| Siswa mengisi peran `guru` di profilnya | Ditolak |
| Siswa membuat dokumen `teachers` | Ditolak |
| Pengunjung tanpa login membaca data | Ditolak |
| Guru membaca semua progres dan profil siswa | Diizinkan |
| Guru mengubah progres siswa | Ditolak |

---

## 7. Mengisi Konfigurasi di Website

1. Buka berkas `js/firebase-config.js` di repositori (lewat GitHub: buka berkas > ikon pensil **Edit**).
2. Isi bagian `config` dengan nilai dari langkah 3:

```
window.GEOMATCH_FIREBASE = {
  config: {
    apiKey: 'AIzaSy...isi milikmu...',
    authDomain: 'geomatch-smpn1.firebaseapp.com',
    projectId: 'geomatch-smpn1',
    storageBucket: 'geomatch-smpn1.firebasestorage.app',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef123456'
  },
  requireLogin: true,
  useEmulator: false
};
```

3. Pengaturan tambahan:

| Pengaturan | Nilai | Arti |
|---|---|---|
| `requireLogin` | `true` | Siswa wajib masuk sebelum membuka Misi, Evaluasi, dan Hasil (disarankan) |
| `requireLogin` | `false` | Login boleh dilewati; hasil siswa yang tidak login tidak terkirim ke guru |
| `useEmulator` | `false` | Wajib `false` untuk website online |

4. Simpan perubahan (di GitHub: **Commit changes**). Jika situs Netlify terhubung ke repositori, Netlify akan memperbarui situs otomatis dalam 1-2 menit.

Selama `apiKey` dan `projectId` masih kosong, website tetap berjalan seperti sebelumnya tanpa login.

---

## 8. Mendaftarkan Domain Netlify di Firebase

Firebase hanya mengizinkan login dari domain yang terdaftar.

1. Buka **Authentication** > tab **Settings** > **Authorized domains**.
2. Klik **Add domain**.
3. Masukkan domain Netlify tanpa `https://`, misalnya `geomatch-smpn1.netlify.app`. Jika memakai domain sendiri, tambahkan juga domain tersebut.
4. Klik **Add**. Domain `localhost` biasanya sudah ada secara bawaan untuk uji coba di komputer.

Jika langkah ini terlewat, siswa akan melihat pesan: "Domain website ini belum didaftarkan di Firebase".

---

## 9. Membuat Akun Guru

Akun guru dibuat oleh admin (pemilik proyek Firebase), bukan dari website.

**Langkah A: buat akun login guru**

1. Buka **Authentication** > tab **Users** > **Add user**.
2. Isi email guru dan kata sandi awal (minimal 6 karakter), lalu klik **Add user**.
3. Pada daftar pengguna, salin nilai kolom **User UID** milik guru tersebut (deretan huruf dan angka, misalnya `PqFDxXkyi4U0TUQhJOEMr99DCPZE`).

**Langkah B: tandai akun sebagai guru**

1. Buka **Firestore Database** > tab **Data**.
2. Klik **Start collection** (atau **+ Start collection**).
3. Collection ID: ketik `teachers` (huruf kecil semua, persis seperti ini). Klik **Next**.
4. Document ID: tempel **User UID** guru dari Langkah A. Jangan klik **Auto-ID**.
5. Tambahkan field: Field = `name`, Type = `string`, Value = nama guru (misalnya `Bu Sari`).
6. Klik **Save**.

Untuk guru berikutnya, ulangi Langkah A, lalu di koleksi `teachers` klik **Add document** dengan Document ID = UID guru baru.

Untuk mencabut akses guru, hapus dokumen `teachers/<UID>` tersebut.

---

## 10. Uji Coba Sebelum Dipakai di Kelas

Lakukan urutan berikut di situs Netlify:

1. **Siswa mendaftar:** buka situs, klik **Masuk** di kanan atas > tab **Daftar Siswa**. Isi nama, kelas (contoh `IX A`), email, dan kata sandi. Setelah berhasil, siswa diarahkan ke Misi Detektif.
2. **Siswa mengerjakan:** jawab satu kasus. Titik kecil di samping nama siswa pada navbar berubah hijau, artinya progres sudah tersimpan di server.
3. **Cek di Firebase:** di **Firestore Database** > **Data** akan muncul koleksi `users` dan `progress` berisi dokumen siswa tersebut.
4. **Keluar dan masuk lagi:** klik nama siswa > **Keluar**, lalu masuk lagi. Skor dan progres harus kembali seperti semula.
5. **Guru masuk:** klik **Masuk** > tab **Masuk Guru**, masukkan akun guru dari langkah 9. Guru diarahkan ke **Dasbor Guru** dan melihat siswa uji coba.
6. **Siswa tidak bisa masuk sebagai guru:** coba akun siswa di tab Masuk Guru. Harus muncul pesan "Akun ini belum terdaftar sebagai guru".

Jika keenam langkah berhasil, sistem siap dipakai.

---

## 11. Panduan Pemakaian untuk Siswa

1. Buka alamat website dari guru.
2. Klik **Masuk** (kanan atas) > **Daftar Siswa** untuk pertama kali. Isi nama lengkap dan kelas dengan benar karena guru menyaring data berdasarkan kelas.
3. Pertemuan berikutnya cukup **Masuk Siswa** dengan email dan kata sandi yang sama.
4. Progres tersimpan otomatis. Titik hijau di samping nama berarti sudah tersimpan; titik kuning berarti sedang menyimpan; titik merah berarti gagal atau sedang offline (progres dikirim ulang saat online).
5. Jika memakai komputer bersama, klik nama > **Keluar** setelah selesai, agar progres tidak tercampur dengan siswa lain.
6. Lupa kata sandi: di tab Masuk Siswa klik **Lupa kata sandi?**, lalu buka tautan yang dikirim ke email (periksa juga folder spam).
7. Nama atau kelas salah: klik nama > **Ubah nama atau kelas**.

Progres yang dikerjakan sebelum login (jika `requireLogin` bernilai `false`) ikut terunggah saat siswa login pertama kali di perangkat tersebut. Jika akun sudah punya progres di server, progres server yang dipakai.

---

## 12. Panduan Dasbor Guru

Buka **Masuk** > **Masuk Guru**, lalu menu **Guru** di navbar (`#/guru`).

| Bagian | Fungsi |
|---|---|
| Filter kelas, pencarian, urutan | Menyaring siswa per kelas, mencari nama/email, mengurutkan berdasarkan nama, skor misi, skor evaluasi, atau terakhir aktif |
| Ringkasan | Jumlah siswa, rata-rata skor misi, jumlah siswa yang menyelesaikan 10 kasus, rata-rata skor PG evaluasi |
| Ketercapaian per TP | Jumlah siswa berstatus "Tercapai" dan "Perlu penguatan" untuk TP 1 sampai TP 10 |
| Daftar siswa | Kasus selesai, skor misi, skor PG, uraian tepat, kotak warna TP 1-10, waktu terakhir aktif |
| Rincian siswa (klik baris) | Capaian per TP, hasil tiap kasus (benar/salah percobaan pertama, jumlah percobaan, petunjuk dipakai, pembahasan dibuka), jawaban PG, **teks jawaban uraian** dan jawaban akhirnya |
| Muat ulang | Mengambil data terbaru dari Firestore |
| Unduh rekap (CSV) | Mengunduh tabel rekap yang dapat dibuka di Excel atau Google Sheets (pemisah titik koma) |

Arti warna kotak TP: hijau = tercapai, kuning = perlu penguatan, abu-abu = belum dinilai. Status ini **indikasi** dari 1 kasus dan 1-3 soal evaluasi per TP. Jawaban uraian dan laporan proyek tetap perlu dinilai guru.

---

## 13. Kuota Paket Gratis

Paket gratis (Spark) memiliki batas harian. Untuk Cloud Firestore, batas yang tercantum di halaman resmi saat tutorial ini dibuat adalah 1 GiB data tersimpan, 50.000 pembacaan dokumen per hari, 20.000 penulisan per hari, dan 20.000 penghapusan per hari. Angka dapat berubah, jadi periksa sumber resmi:

- https://firebase.google.com/pricing
- https://firebase.google.com/docs/firestore/quotas

Perkiraan pemakaian GeoMatch (perkiraan, bukan hasil pengukuran di kelas nyata):

- Setiap simpan progres = 1 penulisan. Website menunggu sekitar 2,5 detik setelah perubahan terakhir sebelum menyimpan, sehingga beberapa perubahan beruntun digabung menjadi satu penulisan.
- Setiap kali guru membuka atau memuat ulang dasbor = 1 pembacaan per siswa.
- Ukuran satu dokumen progres hanya beberapa kilobyte.

---

## 14. Pemecahan Masalah

| Pesan / gejala | Penyebab | Solusi |
|---|---|---|
| Halaman Masuk menampilkan "Login belum diaktifkan" | `js/firebase-config.js` masih kosong atau belum ter-deploy | Isi konfigurasi (langkah 7), tunggu Netlify selesai deploy, muat ulang dengan Ctrl+F5 |
| "Metode login Email/Password belum diaktifkan" | Langkah 4 terlewat | Aktifkan Email/Password di Authentication |
| "Domain website ini belum didaftarkan di Firebase" | Langkah 8 terlewat | Tambahkan domain Netlify ke Authorized domains |
| "Akses ditolak oleh aturan keamanan Firestore" | Aturan belum dipasang atau tidak lengkap | Ulangi langkah 6 dengan menyalin seluruh `firestore.rules` |
| Guru diarahkan keluar dengan pesan "belum terdaftar sebagai guru" | Dokumen `teachers` belum ada atau Document ID bukan UID guru | Periksa langkah 9B: nama koleksi `teachers`, Document ID = User UID |
| "Email atau kata sandi salah" | Salah ketik | Periksa kembali atau gunakan Lupa kata sandi |
| "Email ini sudah terdaftar" | Siswa mendaftar dua kali | Gunakan tab Masuk Siswa |
| "Terlalu banyak percobaan" | Salah kata sandi berulang kali | Tunggu beberapa menit |
| Titik merah di samping nama siswa | Internet terputus | Lanjutkan saja; progres dikirim ulang saat online. Jangan klik Keluar sebelum titik hijau |
| Dasbor guru kosong | Belum ada siswa yang mendaftar, atau proyek Firebase berbeda | Pastikan siswa memakai situs yang sama dan konfigurasi menunjuk ke proyek yang benar |

Untuk melihat pesan kesalahan teknis, buka Developer Tools browser (F12) > tab **Console**.

---

## 15. Perawatan Data

| Kebutuhan | Cara |
|---|---|
| Atur ulang kata sandi siswa | Siswa memakai **Lupa kata sandi?**, atau admin menghapus akun siswa di Authentication > Users lalu siswa mendaftar ulang |
| Menghapus data seorang siswa | Firestore > Data: hapus dokumen `progress/<UID>` dan `users/<UID>`; Authentication > Users: hapus akunnya |
| Tahun ajaran baru | Unduh rekap CSV untuk arsip, lalu hapus dokumen di koleksi `progress` (dan akun siswa lama bila perlu) |
| Menambah guru | Ulangi langkah 9 |

---

## 16. Keamanan, Privasi, dan Keterbatasan

- Simpan data siswa seminimal mungkin. GeoMatch hanya menyimpan nama, kelas, email, dan progres belajar.
- Ikuti kebijakan sekolah tentang data pribadi siswa, dan beri tahu siswa (serta orang tua bila diwajibkan sekolah) bahwa hasil belajar disimpan di layanan Firebase milik Google.
- Jangan membagikan akun pemilik proyek Firebase kepada siswa.
- **Keterbatasan:** skor dihitung di perangkat siswa lalu dikirim ke server. Aturan keamanan mencegah siswa membaca atau mengubah data siswa lain, tetapi siswa yang paham teknis secara teori dapat mengubah data miliknya sendiri. Karena itu, gunakan skor GeoMatch sebagai data formatif, bukan satu-satunya dasar nilai rapor.
- Siswa yang belum pernah mendaftar tidak muncul di dasbor guru.

---

## 17. Lampiran untuk Pengembang (Opsional)

**Memasang aturan lewat terminal** (alternatif langkah 6):

```
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project <PROJECT_ID>
```

Perintah ini membaca `firebase.json` dan `firestore.rules` di repositori.

**Uji coba lokal tanpa proyek sungguhan** dengan Firebase Emulator Suite (memerlukan Java):

```
firebase emulators:start --only auth,firestore --project demo-geomatch
```

Lalu ubah sementara `js/firebase-config.js`: isi `apiKey` dan `projectId` dengan nilai uji (misalnya `demo-key` dan `demo-geomatch`) serta `useEmulator: true`, dan jalankan situs dengan `python3 -m http.server 8000`. Kembalikan `useEmulator` ke `false` sebelum di-deploy.

**Berkas terkait:**

| Berkas | Fungsi |
|---|---|
| `js/firebase-config.js` | Konfigurasi proyek Firebase |
| `js/core/cloud.js` | Login, peran guru/siswa, sinkronisasi progres, daftar siswa untuk guru |
| `js/pages/login.js` | Halaman Masuk / Daftar / Masuk Guru (`#/masuk`) |
| `js/pages/teacher.js` | Dasbor Guru (`#/guru`) |
| `firestore.rules` | Aturan keamanan Firestore |
| `firebase.json` | Konfigurasi Firebase CLI dan emulator |
| `vendor/firebase/` | Firebase JS SDK 10.14.1 (compat), lisensi Apache 2.0 |
