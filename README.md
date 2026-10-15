# GeoMatch: Detektif Bangun Geometri

**Pecahkan Kasus, Temukan Hubungan Geometri!**

GeoMatch adalah media pembelajaran berbasis permainan untuk materi **Kekongruenan dan Kesebangunan Segitiga serta Segiempat** (kelas IX SMP). Siswa berperan sebagai detektif geometri yang memecahkan kasus dengan menganalisis panjang sisi, besar sudut, dan hubungan antarbangun.

## Penyelarasan dengan Tujuan Pembelajaran

Seluruh isi disusun mengikuti dokumen REVISI TP (Elemen Geometri, Fase D): 1 CP, 10 TP, 5 ATP, dalam tiga tahap.

| Tahap | TP | ATP | Pendekatan | Fitur utama |
|---|---|---|---|---|
| 1. Memahami konsep | TP 1–4 | ATP 1, ATP 2 | RME & Saintifik | Masalah pemantik kontekstual, eksplorasi karton virtual (geser/putar/cermin sampai berimpit), eksplorasi pembesaran foto, kriteria SSS/SAS/ASA/AAS/RHS, AA/SSS/SAS sebanding, sifat segiempat |
| 2. Menentukan ukuran | TP 5–8 | ATP 3, ATP 4 | Inkuiri terbimbing & berdiferensiasi | Langkah menemukan unsur seletak, bantuan warna (color-coding) yang dapat dinyalakan/dimatikan, Latihan Seletak acak tanpa batas (variabel, perbandingan senilai), Thales, garis tinggi, media GeoGebra |
| 3. Memecahkan masalah | TP 9–10 | ATP 5 | PBL / PjBL | Lebar sungai (kongruen dan sebangun), kuda-kuda atap, layang-layang, tinggi pohon dengan bayangan, tinggi gedung dengan cermin, peta, foto, denah, Proyek Mini pengukuran dengan laporan |

Pemetaan TP ke materi, kasus misi, dan soal evaluasi ada di `js/data/curriculum.js` dan ditampilkan di halaman `#/tujuan` beserta capaian per TP.

## Fitur

| Halaman | Isi |
|---|---|
| Beranda (`#/beranda`) | Hero, papan progres, badge, peta TP |
| Tujuan (`#/tujuan`) | CP, TP 1–10, ATP 1–5, pendekatan, materi, dan tabel capaian per TP |
| Petunjuk (`#/petunjuk`) | Aturan investigasi, sistem skor, badge |
| Materi (`#/materi/:tab`) | 10 tab, satu per TP, dikelompokkan per tahap |
| Laboratorium (`#/lab/:alat`) | Deteksi Kongruensi, Deteksi Kesebangunan (k 0,5 sampai 3), Perbandingan Segiempat, Media GeoGebra |
| Misi Detektif (`#/misi/:kasus`) | 10 kasus (satu per TP), 10 poin per kasus, petunjuk, umpan balik, pembahasan bertahap, badge |
| Evaluasi (`#/evaluasi`) | 10 PG + 5 uraian berlabel TP, tingkat mudah/sedang/sulit, timer opsional, pembahasan, capaian per TP |
| Hasil (`#/hasil`) | Skor akhir, benar/salah, persentase, badge, rekomendasi, capaian per TP |

Progres disimpan di `localStorage` (kunci `geomatch.progress.v2`).

Catatan: Media GeoGebra dimuat dari `https://www.geogebra.org/apps/deployggb.js` saat tombol "Muat GeoGebra" ditekan, sehingga membutuhkan internet. Jika gagal dimuat, halaman menampilkan petunjuk membuat konstruksi yang sama secara manual di geogebra.org.

## Teknologi

- HTML, CSS, JavaScript murni (tanpa proses build).
- SVG untuk seluruh ilustrasi geometri (`js/core/svg.js`), dengan skala yang sama antar-bangun agar gambar proporsional.
- KaTeX 0.16.11 disimpan lokal di `vendor/katex/` (lisensi MIT), dengan cadangan CDN jsDelivr.

## Struktur

```
index.html
netlify.toml
css/style.css
js/core/        ui.js (format, ikon, toast), store.js (localStorage), geo.js (geometri), svg.js (renderer)
js/data/        curriculum.js (CP/TP/ATP), missions.js (10 kasus), quiz.js (soal evaluasi)
js/components/  navbar.js, practice.js (generator Latihan Seletak)
js/pages/       home.js, tujuan.js, guide.js, material.js, lab.js, mission.js, quiz.js, result.js
js/app.js       router berbasis hash
vendor/katex/   KaTeX
```

## Menjalankan secara lokal

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

Membuka `index.html` langsung dari file juga berfungsi (tidak memakai ES module).

## Deploy ke Netlify

Situs ini statis dan sudah memiliki `netlify.toml` (`publish = "."`, tanpa perintah build).

**Cara A: dari GitHub (otomatis setiap push)**
1. Masuk ke https://app.netlify.com lalu pilih **Add new site → Import an existing project**.
2. Pilih **GitHub**, lalu repositori `Kongruen`.
3. Pilih branch yang berisi kode ini. Build command dikosongkan, publish directory `.` (terbaca otomatis dari `netlify.toml`).
4. Klik **Deploy**. Netlify memberi alamat seperti `https://nama-situs.netlify.app`.

**Cara B: Netlify Drop (tanpa akun GitHub)**
1. Unduh repositori sebagai ZIP lalu ekstrak.
2. Buka https://app.netlify.com/drop dan seret folder hasil ekstrak ke halaman tersebut.

## Catatan akurasi data

Pada spesifikasi awal, kasus "Pemeriksaan Sudut" menyebut segitiga bersisi 4 cm, 5 cm, 6 cm dengan sudut 50°, 60°, 70°. Data itu tidak mungkin terjadi: menurut aturan kosinus, segitiga 4-5-6 memiliki sudut sekitar 41,4°, 55,8°, dan 82,8° (misalnya cos C = (5² + 6² − 4²)/(2·5·6) = 0,75). Versi sekarang tidak lagi memakai kasus itu (diganti kasus TP 5 tentang menentukan nilai variabel pada segitiga kongruen).
