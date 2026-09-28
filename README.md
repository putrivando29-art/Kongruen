# GeoMatch: Detektif Bangun Geometri

**Pecahkan Kasus, Temukan Hubungan Geometri!**

GeoMatch adalah media pembelajaran berbasis permainan untuk materi **Kekongruenan dan Kesebangunan Segitiga serta Segiempat** (kelas IX SMP). Siswa berperan sebagai detektif geometri yang memecahkan kasus dengan menganalisis panjang sisi, besar sudut, dan hubungan antarbangun.

## Fitur

| Halaman | Isi |
|---|---|
| Beranda (`#/beranda`) | Hero, info materi, papan progres, koleksi badge |
| Petunjuk (`#/petunjuk`) | Aturan investigasi, sistem skor, badge |
| Materi (`#/materi/:tab`) | 8 tab: kekongruenan (demo translasi/rotasi/refleksi), SSS/SAS/ASA/AAS/RHS (kartu interaktif), sifat & CPCTC (klik pasangan), kesebangunan (slider k), AA/SSS/SAS sebanding (+ alat periksa), segiempat (tabel sifat + contoh penyangkal), teorema (Thales, garis tinggi, Pythagoras, luas, garis tengah trapesium), penerapan (6 soal interaktif) |
| Laboratorium (`#/lab/:alat`) | Deteksi Kongruensi (seret titik, putar, cermin, ubah ukuran), Deteksi Kesebangunan (slider k 0,5 sampai 3), Perbandingan Segiempat (6 jenis bangun) |
| Misi Detektif (`#/misi/:kasus`) | 5 kasus, 20 poin per kasus, petunjuk bertahap, umpan balik, pembahasan bertahap, badge |
| Evaluasi (`#/evaluasi`) | 10 PG + 5 uraian, tingkat mudah/sedang/sulit, timer opsional 30 menit, skor otomatis, pembahasan |
| Hasil (`#/hasil`) | Skor akhir, benar/salah, persentase, badge, rekomendasi materi |

Progres (kasus, skor, badge, materi yang dibuka, jawaban evaluasi) disimpan di `localStorage` sehingga tetap ada setelah halaman dimuat ulang.

Semua status "kongruen/sebangun" di laboratorium dihitung dari koordinat, panjang sisi, dan besar sudut (toleransi 0,05 cm, 0,5°, dan 1% untuk rasio), bukan dari kesan visual.

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
js/data/        missions.js (5 kasus), quiz.js (soal evaluasi)
js/components/  navbar.js
js/pages/       home.js, guide.js, material.js, lab.js, mission.js, quiz.js, result.js
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

Pada spesifikasi awal, Kasus 3 menyebut segitiga bersisi 4 cm, 5 cm, 6 cm dengan sudut 50°, 60°, 70°. Data itu tidak mungkin terjadi: menurut aturan kosinus, segitiga 4-5-6 memiliki sudut sekitar 41,4°, 55,8°, dan 82,8° (misalnya cos C = (5² + 6² − 4²)/(2·5·6) = 0,75). Kasus 3 memakai sisi 4, 5, 6 cm dengan sudut yang benar tersebut. Jawaban (kongruen) dan tujuan kasus tidak berubah.
