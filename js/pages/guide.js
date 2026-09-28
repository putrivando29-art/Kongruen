/* Halaman Petunjuk Permainan */
(function () {
  const GM = window.GM;

  const RULES = [
    ['Amati dua bangun yang ditampilkan.', 'Setiap kasus menampilkan dua bangun datar lengkap dengan label titik sudut.'],
    ['Periksa panjang sisi dan besar sudut.', 'Gunakan data pada "Berkas Bukti". Jangan menilai hanya dari tampilan gambar.'],
    ['Identifikasi sisi dan sudut yang bersesuaian.', 'Pasangkan sisi terpendek dengan sisi terpendek, sudut terkecil dengan sudut terkecil, dan seterusnya.'],
    ['Tentukan hubungan kedua bangun.', 'Kongruen, sebangun tetapi tidak kongruen, atau tidak kongruen dan tidak sebangun.'],
    ['Jawab pertanyaan berdasarkan konsep matematika.', 'Pilih jawaban lalu tekan "Periksa Jawaban". Gunakan "Minta Petunjuk" bila perlu.'],
    ['Baca pembahasan setelah menjawab.', 'Pembahasan ditampilkan bertahap agar kamu memahami alasan matematisnya.']
  ];

  function render(el) {
    el.innerHTML = `<div class="container page">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('help', 14)} Petunjuk Permainan</span>
        <h1>Cara Menjadi Detektif GeoMatch</h1>
        <p>Kamu adalah detektif di Laboratorium Geometri. Setiap kasus berisi dua bangun datar misterius. Tugasmu: membuktikan hubungan keduanya dengan ukuran sisi dan sudut.</p>
      </div>
      <div class="grid grid-2" style="align-items:start">
        <div class="card">
          <h2>${GM.icon('search', 22)} Aturan Investigasi</h2>
          <div class="steps-list">
            ${RULES.map(([t, d]) => `<div class="step-item"><div class="step-num"></div><div><strong>${t}</strong><div class="muted small">${d}</div></div></div>`).join('')}
          </div>
        </div>
        <div>
          <div class="card">
            <h2>${GM.icon('star', 22)} Sistem Skor</h2>
            <table class="score-table">
              <tr><td>Jawaban benar (percobaan pertama)</td><td style="color:var(--ok)">20 poin</td></tr>
              <tr><td>Jawaban salah</td><td style="color:var(--bad)">0 poin</td></tr>
              <tr><td>Jumlah kasus</td><td>5 kasus</td></tr>
              <tr><td>Skor maksimal</td><td>100 poin</td></tr>
            </table>
            <div class="callout warn" style="margin-top:16px">
              <div class="callout-title">${GM.icon('bulb', 18)} Penting</div>
              <p>Poin hanya dihitung dari jawaban pertama. Jika salah, kamu tetap boleh <b>Coba Lagi</b> untuk belajar, atau membuka pembahasan. Kasus berikutnya terbuka setelah kasus sebelumnya selesai. Semua kasus harus diselesaikan untuk memperoleh hasil akhir.</p>
            </div>
          </div>
          <div class="card">
            <h3>${GM.icon('medal', 20)} Badge yang bisa diraih</h3>
            <div class="badge-row">
              ${GM.store.BADGES.map((b) => `<div class="badge earned"><div class="b-ico">${GM.icon(b.icon, 20)}</div><div><strong>${b.name}</strong><small>${b.desc}</small></div></div>`).join('')}
            </div>
          </div>
          <div class="card">
            <h3>Tiga kemungkinan jawaban</h3>
            <ul class="info-list">
              <li><span class="dot" style="background:var(--ok)"></span><div><b>Kongruen</b> ${GM.tex('(\\cong)')}: semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar.</div></li>
              <li><span class="dot" style="background:var(--royal)"></span><div><b>Sebangun tetapi tidak kongruen</b> ${GM.tex('(\\sim)')}: sudut bersesuaian sama besar, sisi bersesuaian sebanding dengan ${GM.tex('k \\neq 1')}.</div></li>
              <li><span class="dot" style="background:var(--bad)"></span><div><b>Tidak kongruen dan tidak sebangun</b>: ada sudut bersesuaian yang berbeda atau perbandingan sisi yang tidak sama.</div></li>
            </ul>
          </div>
          <div class="btn-row" style="margin-top:18px">
            <a class="btn btn-primary btn-lg" href="#/misi">${GM.icon('play', 18)} Mulai Misi</a>
            <a class="btn btn-outline" href="#/materi/kongruensi">${GM.icon('book', 18)} Pelajari Materi dulu</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  GM.GuidePage = { render };
})();
