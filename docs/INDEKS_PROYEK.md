# Indeks Proyek GeoMatch: Detektif Bangun Geometri

**Pecahkan Kasus, Temukan Hubungan Geometri!**

| Butir | Keterangan |
|---|---|
| Jenis produk | Website pembelajaran berbasis permainan (game-based learning) |
| Materi | Kekongruenan dan Kesebangunan Segitiga serta Segiempat |
| Sasaran | Siswa SMP kelas IX (Elemen Geometri, Fase D) |
| Acuan kurikulum | Dokumen REVISI TP: 1 CP, 10 TP, 5 ATP, 3 tahap |
| Bahasa | Indonesia |
| Teknologi | HTML, CSS, JavaScript murni (tanpa build), SVG, KaTeX (lokal), localStorage |
| Hosting | Situs statis, siap Netlify (`netlify.toml`) |
| Repositori | `putrivando29-art/Kongruen`, branch `claude/geomatch-geometry-detective-xe7iof` |

---

## 1. Rangkuman Website

GeoMatch menempatkan siswa sebagai detektif di sebuah laboratorium geometri. Siswa memecahkan kasus dengan memeriksa panjang sisi, besar sudut, dan pasangan unsur yang seletak, bukan dengan menebak dari tampilan gambar. Isi website mengikuti 10 Tujuan Pembelajaran yang dibagi dalam tiga tahap:

| Tahap | TP | ATP | Pendekatan | Fokus |
|---|---|---|---|---|
| 1. Memahami konsep | TP 1-4 | ATP 1, ATP 2 | RME & Saintifik | Pengertian dan sifat kekongruenan/kesebangunan segitiga dan segiempat |
| 2. Menentukan ukuran | TP 5-8 | ATP 3, ATP 4 | Inkuiri terbimbing & berdiferensiasi (color-coding, GeoGebra) | Menentukan panjang sisi dan besar sudut pada bangun kongruen/sebangun |
| 3. Memecahkan masalah | TP 9-10 | ATP 5 | PBL / PjBL | Masalah kontekstual dan pengukuran tak langsung |

**Capaian Pembelajaran (CP):** Menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat, dan menggunakannya untuk menyelesaikan masalah.

---

## 2. Peta Halaman

| No | Halaman | Alamat | Isi utama |
|---|---|---|---|
| 1 | Beranda | `#/beranda` | Sambutan detektif, ilustrasi dua segitiga sebangun beranimasi, tombol Mulai Investigasi / Pelajari Materi / Lihat Petunjuk, papan progres, koleksi badge, peta TP |
| 2 | Tujuan | `#/tujuan` | CP, TP 1-10, ATP 1-5, pendekatan, materi per tahap, tabel dukungan ATP, tabel capaian per TP |
| 3 | Petunjuk | `#/petunjuk` | 6 aturan investigasi, sistem skor, badge, tiga kemungkinan jawaban |
| 4 | Materi | `#/materi/:tab` | 10 tab (satu per TP), dikelompokkan per tahap |
| 5 | Laboratorium | `#/lab/:alat` | 4 alat interaktif |
| 6 | Misi Detektif | `#/misi/:kasus` | 10 kasus (satu per TP) |
| 7 | Evaluasi | `#/evaluasi` | 10 pilihan ganda + 5 uraian |
| 8 | Hasil | `#/hasil` | Laporan akhir investigasi dan capaian per TP |
| 9 | Masuk | `#/masuk` | Daftar/masuk siswa, masuk guru, lupa kata sandi (jika Firebase aktif) |
| 10 | Dasbor Guru | `#/guru` | Rekap seluruh siswa, filter kelas, capaian per TP, rincian dan jawaban uraian, unduh CSV |

---

## 3. Indeks Materi (10 Tab)

Setiap tab dibuka dengan kartu TP: nomor TP, ATP, langkah pendekatan, dan satu masalah pemantik / pertanyaan inkuiri / orientasi masalah.

| TP | Tab (`#/materi/...`) | Isi | Interaksi |
|---|---|---|---|
| 1 | `kongruen-segitiga` | Pengertian, notasi ≅, syarat, translasi/rotasi/refleksi, kriteria SSS, SAS, ASA, AAS, RHS, peringatan AAA dan SSA, sifat refleksif/simetris/transitif, bagian seletak (CPCTC) | Eksplorasi karton virtual (ATP 1), kartu kriteria yang dapat diklik, klik sisi/sudut untuk melihat pasangannya |
| 2 | `kongruen-segiempat` | Pengertian dan syarat segiempat kongruen, sifat, syarat praktis per jenis segiempat, contoh dan bukan contoh, diagonal jajargenjang | Eksplorasi karton virtual segiempat (ATP 1) |
| 3 | `sebangun-segitiga` | Pengertian, notasi ~, faktor skala, perbandingan keliling ($K_2/K_1 = k$) dan luas ($L_2/L_1 = k^2$), kongruen sebagai kasus $k = 1$, syarat AA, SSS sebanding, SAS sebanding | Alat periksa SSS sebanding |
| 4 | `sebangun-segiempat` | Syarat segiempat sebangun, galeri 6 bangun, tabel sifat segiempat, contoh penyangkal | Eksplorasi pembesaran foto dengan slider k (ATP 2) |
| 5 | `ukuran-kongruen-segitiga` | Langkah menemukan unsur seletak, contoh soal bervariabel | Latihan Seletak acak (ATP 3) |
| 6 | `ukuran-kongruen-segiempat` | Langkah seletak dan sifat khusus bangun, contoh layang-layang | Latihan Seletak acak (ATP 3) |
| 7 | `ukuran-sebangun-segitiga` | Perbandingan senilai, contoh, Teorema Thales, garis tinggi segitiga siku-siku, Pythagoras | Latihan Seletak acak (ATP 4), Thales dan garis tinggi interaktif |
| 8 | `ukuran-sebangun-segiempat` | Contoh persegi panjang sebangun, perbandingan keliling dan luas, garis tengah trapesium | Latihan Seletak acak (ATP 4), garis tengah trapesium interaktif |
| 9 | `masalah-kongruen` | Langkah PBL, 4 masalah: lebar sungai (ASA), kuda-kuda atap (RHS), kerangka layang-layang (SSS), motif jajargenjang (SSS) | Isian jawaban dengan umpan balik dan pembahasan |
| 10 | `masalah-sebangun` | Langkah PBL, 7 masalah: tinggi pohon (bayangan), tinggi gedung (cermin), lebar sungai, peta, foto, ubin, denah | Isian jawaban, Proyek Mini PjBL dengan laporan yang dapat disalin |

---

## 4. Indeks Laboratorium

| Alat | Alamat | Yang dapat dilakukan siswa | Indikator yang ditampilkan |
|---|---|---|---|
| Deteksi Kongruensi | `#/lab/kongruensi` | Menggeser titik sudut, memindahkan, memutar 15°, mencerminkan, memperbesar/memperkecil, mengatur dua sisi dan sudut apit | Sisi dan sudut seletak sama/tidak, rasio sisi, faktor skala, status, 3 tantangan |
| Deteksi Kesebangunan | `#/lab/kesebangunan` | Mengubah △ABC, menggeser faktor skala 0,5 sampai 3, mengganggu ∠D | Label sisi otomatis, rasio, $k$, status KONGRUEN/SEBANGUN/TIDAK SEBANGUN, $K_2/K_1$, $L_2/L_1$ |
| Perbandingan Segiempat | `#/lab/segiempat` | Memilih 2 dari 6 jenis segiempat dan mengatur ukurannya, 5 contoh cepat | Pasangan titik terbaik, rasio sisi, sudut, status |
| Media GeoGebra | `#/lab/geogebra` | Memuat applet GeoGebra (dilatasi segitiga dengan slider k) dan mengikuti lembar inkuiri | Hasil pengukuran di GeoGebra (memerlukan internet) |

Status pada laboratorium dihitung dari koordinat, panjang sisi, dan besar sudut (toleransi 0,05 cm, 0,5°, dan 1% untuk rasio).

---

## 5. Indeks Misi Detektif

Skor: 10 poin untuk jawaban benar pada percobaan pertama, 0 poin jika salah, maksimal 100. Setiap kasus memiliki petunjuk bertahap, umpan balik hijau/merah, pembahasan bertahap, tombol Coba Lagi, Kasus Berikutnya, dan Kembali ke Materi.

| Kasus | TP | Judul | Jawaban |
|---|---|---|---|
| 1 | 1 | Dua Segitiga Identik | Kongruen (SSS) |
| 2 | 2 | Ubin Kembar Palsu | Tidak kongruen dan tidak sebangun (persegi vs belah ketupat) |
| 3 | 3 | Segitiga Hasil Pembesaran | Sebangun tetapi tidak kongruen ($k = 2$) |
| 4 | 4 | Persegi yang Sebangun | Sebangun tetapi tidak kongruen ($k = 2$) |
| 5 | 5 | Variabel yang Tersembunyi | $x = 3$, $y = 20$ |
| 6 | 6 | Bingkai Jendela Kembar | $RS = 6$ cm, $\angle Q = 110^\circ$ |
| 7 | 7 | Misteri Faktor Skala | $k = 2$, $x = 14$ |
| 8 | 8 | Trapesium di Cetak Biru | $RS = 6$ m, $PS = 7{,}5$ m |
| 9 | 9 | Lebar Sungai Tanpa Menyeberang | $32$ m (ASA) |
| 10 | 10 | Tinggi Gedung dari Cermin | $12$ m (AA) |

Badge: Detektif Pemula (1 kasus), Analis Geometri (3 kasus), Master GeoMatch (10 kasus).

---

## 6. Indeks Evaluasi

10 soal pilihan ganda (skor otomatis, 10 poin per soal) dan 5 soal uraian (kolom langkah penyelesaian + jawaban akhir yang diperiksa otomatis). Tingkat kesulitan: 4 mudah, 7 sedang, 4 sulit. Timer opsional 30 menit.

| TP | Soal |
|---|---|
| 1 | PG 1 (pengertian kongruen), PG 2 (SAS) |
| 2 | PG 3 (persegi vs belah ketupat) |
| 3 | PG 4 (AA), Uraian 1 (SSS sebanding dan $k$) |
| 4 | PG 5 (persegi panjang sebangun) |
| 5 | PG 6 (sudut segitiga kongruen), Uraian 2 (AAS dan $\angle F$) |
| 6 | PG 7 (jajargenjang kongruen) |
| 7 | PG 8 (sisi segitiga sebangun), PG 9 (Thales), Uraian 5 (garis tinggi) |
| 8 | PG 10 (trapesium sebangun) |
| 9 | Uraian 3 (kuda-kuda atap, RHS) |
| 10 | Uraian 4 (tinggi gedung dengan bayangan) |

Setelah dikirim: kunci, pembahasan, ringkasan hasil per tingkat kesulitan, rekomendasi materi, dan capaian per TP.

---

## 7. Fitur Pendukung

| Fitur | Keterangan |
|---|---|
| Bantuan warna (color-coding) | Sisi dan sudut seletak diberi warna sama; dapat dinyalakan/dimatikan (pembelajaran berdiferensiasi) |
| Latihan Seletak | Generator soal acak untuk TP 5-8: notasi, ukuran, dan posisi bangun berubah setiap soal |
| Progres tersimpan | Skor, kasus, badge, materi yang dibuka, latihan, dan jawaban evaluasi tersimpan di localStorage (`geomatch.progress.v2`) |
| Login dan Dasbor Guru | Firebase Authentication + Cloud Firestore; progres siswa tersinkron otomatis, guru memantau semua siswa. Panduan: `docs/TUTORIAL_FIREBASE.md` |
| Capaian per TP | Dihitung dari jawaban pertama kasus misi dan soal evaluasi terkait; bersifat indikasi, bukan penilaian resmi |
| Responsif | Dapat dibuka di laptop dan smartphone (diuji pada lebar 390 px sampai 1366 px) |
| Rumus | Ditampilkan dengan KaTeX yang disimpan lokal |

---

## 8. Struktur Berkas

```
index.html                  Halaman tunggal (memuat semua skrip)
netlify.toml                Konfigurasi deploy Netlify
css/style.css               Seluruh tampilan
assets/favicon.svg          Ikon situs
vendor/katex/               KaTeX 0.16.11 (lisensi MIT)
js/core/ui.js               Format angka, rumus, ikon, toast, modal, bantuan warna
js/core/store.js            Penyimpanan progres, skor, badge
js/core/cloud.js            Login Firebase dan sinkronisasi progres
js/firebase-config.js       Konfigurasi Firebase
firestore.rules             Aturan keamanan Firestore
vendor/firebase/            Firebase JS SDK 10.14.1
js/core/geo.js              Perhitungan geometri dan pencocokan bangun
js/core/svg.js              Penggambar bangun SVG berskala
js/data/curriculum.js       CP, TP, ATP, pemetaan TP, capaian per TP
js/data/missions.js         10 kasus misi
js/data/quiz.js             Soal evaluasi
js/components/navbar.js     Navigasi
js/components/practice.js   Generator Latihan Seletak
js/pages/*.js               Beranda, Tujuan, Petunjuk, Materi, Laboratorium, Misi, Evaluasi, Hasil, Masuk, Dasbor Guru
js/app.js                   Router berbasis hash
docs/INDEKS_PROYEK.md       Dokumen ini
docs/TUTORIAL_FIREBASE.md   Tutorial login dan dasbor guru
```

---

## 9. Rancangan Aktivitas Web (Singkat)

Rancangan berikut adalah **usulan** urutan pemakaian website, disusun mengikuti tiga tahap TP. Jumlah pertemuan dapat disesuaikan dengan alokasi waktu sekolah.

### Alur umum

```
Beranda -> Tujuan & Petunjuk -> Materi (TP) -> Laboratorium -> Misi (kasus TP) -> Evaluasi -> Hasil
```

### Aktivitas per tahap

| Tahap | Aktivitas siswa di website | Peran guru | Bukti belajar |
|---|---|---|---|
| **Orientasi** | Mendaftar akun (jika login aktif), membuka Beranda, membaca Tujuan dan Petunjuk | Menjelaskan TP dan aturan permainan, memastikan semua siswa berhasil masuk | Siswa mengetahui TP dan sistem skor; nama siswa muncul di Dasbor Guru |
| **Tahap 1: Memahami konsep (TP 1-4)** | Membaca masalah pemantik, eksplorasi karton virtual (geser, putar, cermin sampai berimpit), eksplorasi pembesaran foto, mengklik kartu SSS/SAS/ASA/AAS/RHS, mencoba alat periksa SSS sebanding, lalu mengerjakan Kasus 1-4 | Memandu langkah saintifik (mengamati, menanya, mengumpulkan informasi, menalar, mengomunikasikan) dan meminta siswa menyampaikan syarat yang ditemukan | Status "Tepat berimpit", jawaban Kasus 1-4 |
| **Tahap 2: Menentukan ukuran (TP 5-8)** | Membaca langkah unsur seletak, mempelajari contoh, mengerjakan Latihan Seletak dengan bantuan warna lalu tanpa bantuan warna, mencoba Thales, garis tinggi, dan GeoGebra, lalu mengerjakan Kasus 5-8 | Membimbing inkuiri, memberi bantuan berbeda sesuai kebutuhan siswa (warna, petunjuk, langkah penyelesaian) | Jumlah latihan benar per TP, jawaban Kasus 5-8 |
| **Tahap 3: Memecahkan masalah (TP 9-10)** | Menyelesaikan masalah kontekstual (sungai, kuda-kuda, layang-layang, bayangan, cermin), mengerjakan Kasus 9-10, melakukan Proyek Mini pengukuran di sekolah dan menyalin laporannya | Membentuk kelompok, mendampingi pengukuran, memfasilitasi presentasi dan evaluasi kesalahan pengukuran | Laporan Proyek Mini, jawaban Kasus 9-10 |
| **Evaluasi dan refleksi** | Mengerjakan Evaluasi (timer opsional), membaca pembahasan, membuka halaman Hasil dan capaian per TP, mempelajari ulang materi yang direkomendasikan | Memantau Dasbor Guru, menilai jawaban uraian, membahas soal yang banyak salah, menindaklanjuti TP berstatus "Perlu penguatan" | Skor PG, jawaban uraian, tabel capaian per TP |

### Catatan pelaksanaan

- Tanpa login, progres tersimpan di perangkat masing-masing. Dengan login Firebase aktif, progres mengikuti akun siswa sehingga dapat dilanjutkan di perangkat lain dan dipantau guru.
- Media GeoGebra memerlukan koneksi internet; fitur lain tetap berjalan tanpa CDN karena KaTeX disimpan lokal.
- Status capaian per TP hanya indikasi awal dari sedikit butir soal dan perlu dilengkapi penilaian guru, terutama untuk jawaban uraian dan laporan proyek.
