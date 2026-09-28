/* Halaman Beranda */
(function () {
  const GM = window.GM;

  function heroArt() {
    // Dua segitiga sebangun (3-4-5 dan skala 1,6) dengan garis putus-putus penghubung titik bersesuaian.
    return `<svg viewBox="0 0 480 360" role="img" aria-label="Dua segitiga sebangun dengan ukuran berbeda sedang diselidiki kaca pembesar">
      <defs>
        <linearGradient id="gA" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#BFDBFE"/><stop offset="1" stop-color="#93C5FD"/></linearGradient>
        <linearGradient id="gB" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#BBF7D0"/><stop offset="1" stop-color="#86EFAC"/></linearGradient>
      </defs>
      <rect x="10" y="10" width="460" height="340" rx="26" fill="rgba(255,255,255,.06)" stroke="rgba(191,219,254,.35)" stroke-dasharray="4 8"/>
      <g class="float-a">
        <polygon points="50,290 140,290 140,170" fill="url(#gA)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
        <path d="M128 290 v-12 h12" fill="none" stroke="#17324D" stroke-width="2"/>
        <text x="95" y="312" fill="#E0EDFF" font-size="15" font-weight="700" text-anchor="middle" font-family="Poppins">3</text>
        <text x="156" y="236" fill="#E0EDFF" font-size="15" font-weight="700" font-family="Poppins">4</text>
        <text x="80" y="222" fill="#E0EDFF" font-size="15" font-weight="700" font-family="Poppins">5</text>
        <text x="40" y="306" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">A</text>
        <text x="146" y="306" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">B</text>
        <text x="146" y="164" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">C</text>
      </g>
      <g class="float-b">
        <polygon points="220,300 364,300 364,108" fill="url(#gB)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
        <path d="M348 300 v-16 h16" fill="none" stroke="#17324D" stroke-width="2"/>
        <text x="292" y="324" fill="#DCFCE7" font-size="15" font-weight="700" text-anchor="middle" font-family="Poppins">4,8</text>
        <text x="378" y="210" fill="#DCFCE7" font-size="15" font-weight="700" font-family="Poppins">6,4</text>
        <text x="262" y="196" fill="#DCFCE7" font-size="15" font-weight="700" font-family="Poppins">8</text>
        <text x="206" y="318" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">P</text>
        <text x="370" y="318" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">Q</text>
        <text x="370" y="100" fill="#fff" font-size="16" font-weight="800" font-family="Poppins">R</text>
      </g>
      <path class="dash-move" d="M140 170 Q 250 120 364 108" fill="none" stroke="#FDE68A" stroke-width="2"/>
      <path class="dash-move" d="M50 290 Q 140 330 220 300" fill="none" stroke="#FDE68A" stroke-width="2"/>
      <g class="lens">
        <circle cx="78" cy="92" r="30" fill="rgba(255,255,255,.12)" stroke="#fff" stroke-width="6"/>
        <path d="M99 113 L124 138" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
        <text x="78" y="100" fill="#FDE68A" font-size="22" font-weight="800" text-anchor="middle" font-family="Poppins">k</text>
      </g>
      <g font-family="Inter" font-size="13" font-weight="600">
        <rect x="178" y="30" width="166" height="34" rx="17" fill="#17324D" stroke="#BBF7D0"/>
        <text x="261" y="52" fill="#BBF7D0" text-anchor="middle">k = 4,8 : 3 = 1,6</text>
      </g>
    </svg>`;
  }

  function render(el) {
    const st = GM.store.missionStats();
    const s = GM.store.get();
    const matDone = Object.keys(s.material).length;
    const quiz = s.quiz.result;
    const badges = GM.store.BADGES.map((b) => {
      const got = s.badges.includes(b.id);
      return `<div class="badge ${got ? 'earned' : ''}"><div class="b-ico">${GM.icon(got ? b.icon : 'lock', 20)}</div><div><strong>${b.name}</strong><small>${b.desc}</small></div></div>`;
    }).join('');

    el.innerHTML = `
    <section class="hero">
      <div class="container hero-inner">
        <div>
          <span class="hero-tag">${GM.icon('hat', 18)} Laboratorium Geometri · Kelas IX SMP</span>
          <h1>Selamat Datang, <span class="accent">Detektif Geometri!</span></h1>
          <p class="hero-sub">Amati bangun, temukan petunjuk, dan pecahkan misteri kekongruenan serta kesebangunan.</p>
          <div class="btn-row">
            <a class="btn btn-mint btn-lg" href="#/misi">${GM.icon('play', 18)} Mulai Investigasi</a>
            <a class="btn btn-ghost-light btn-lg" href="#/materi/kongruensi">${GM.icon('book', 18)} Pelajari Materi</a>
            <a class="btn btn-ghost-light btn-lg" href="#/petunjuk">${GM.icon('help', 18)} Lihat Petunjuk</a>
          </div>
        </div>
        <div class="hero-art">${heroArt()}</div>
      </div>
    </section>

    <div class="container stats-strip">
      <div class="card grid grid-4">
        <div class="stat"><div class="icon-bubble">${GM.icon('book', 22)}</div><div><div class="stat-label">Materi</div><div class="stat-value">Kekongruenan & Kesebangunan</div></div></div>
        <div class="stat"><div class="icon-bubble mint">${GM.icon('hat', 22)}</div><div><div class="stat-label">Kelas</div><div class="stat-value">IX SMP</div></div></div>
        <div class="stat"><div class="icon-bubble">${GM.icon('target', 22)}</div><div><div class="stat-label">Jumlah misi</div><div class="stat-value">5 kasus utama</div></div></div>
        <div class="stat"><div class="icon-bubble mint">${GM.icon('star', 22)}</div><div><div class="stat-label">Sistem skor</div><div class="stat-value">100 poin</div></div></div>
      </div>
    </div>

    <div class="container">
      <section class="section">
        <div class="card dash-card">
          <div>
            <h2 style="margin-bottom:6px">Papan Investigasimu</h2>
            <p class="muted">Progres tersimpan otomatis di perangkat ini, jadi kamu bisa melanjutkan kapan saja.</p>
            <div class="progress-label"><span>Kasus terpecahkan</span><span>${st.completed}/${st.total}</span></div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${st.total}" aria-valuenow="${st.completed}"><span style="width:${(st.completed / st.total) * 100}%"></span></div>
            <div class="progress-label" style="margin-top:14px"><span>Materi dibuka</span><span>${matDone}/8</span></div>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${matDone}"><span style="width:${(matDone / 8) * 100}%"></span></div>
            <div class="btn-row" style="margin-top:16px">
              <span class="chip">${GM.icon('star', 14)} Skor misi: ${st.score}/100</span>
              <span class="chip chip-mint">${GM.icon('clipboard', 14)} Evaluasi: ${quiz ? quiz.mcScore + '/100' : 'belum dikerjakan'}</span>
            </div>
          </div>
          <div>
            <h3>Koleksi Badge</h3>
            <div class="badge-row">${badges}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-title"><div><h2 style="margin:0">Peralatan Detektif</h2><p class="muted" style="margin:0">Semua fitur saling terhubung: pelajari, uji di laboratorium, lalu pecahkan kasus.</p></div></div>
        <div class="grid grid-3">
          ${feature('book', 'Materi Interaktif', '8 topik: kekongruenan, syarat SSS/SAS/ASA/AAS/RHS, kesebangunan, AA, segiempat, Teorema Thales, dan penerapannya.', '#/materi/kongruensi', 'Buka materi')}
          ${feature('flask', 'Laboratorium Geometri', 'Geser titik sudut, putar, cerminkan, dan ubah faktor skala. Status kongruen/sebangun dihitung dari ukuran.', '#/lab/kongruensi', 'Masuk laboratorium')}
          ${feature('target', 'Misi Detektif', '5 kasus utama dengan petunjuk, umpan balik otomatis, pembahasan bertahap, poin, dan badge.', '#/misi', 'Mulai misi')}
          ${feature('clipboard', 'Evaluasi', '10 soal pilihan ganda dan 5 soal uraian bertingkat (mudah, sedang, sulit) dengan timer opsional.', '#/evaluasi', 'Kerjakan evaluasi')}
          ${feature('trophy', 'Hasil Investigasi', 'Lihat skor akhir, persentase keberhasilan, badge, dan rekomendasi materi yang perlu diulang.', '#/hasil', 'Lihat hasil')}
          ${feature('help', 'Petunjuk Permainan', 'Pelajari aturan main dan sistem skor sebelum memulai investigasi pertamamu.', '#/petunjuk', 'Baca petunjuk')}
        </div>
      </section>

      <section class="section">
        <div class="card">
          <h3>${GM.icon('bulb', 20)} Petunjuk cepat seorang detektif</h3>
          <div class="grid grid-2">
            <div class="callout mint"><div class="callout-title">Kongruen ${GM.tex('(\\cong)')}</div><p>Bentuk <b>dan</b> ukuran sama persis. Semua sisi bersesuaian sama panjang, semua sudut bersesuaian sama besar. Faktor skala ${GM.tex('k = 1')}.</p></div>
            <div class="callout"><div class="callout-title">Sebangun ${GM.tex('(\\sim)')}</div><p>Bentuk sama, ukuran boleh berbeda. Sudut bersesuaian sama besar dan sisi bersesuaian sebanding: ${GM.tex('k = \\frac{\\text{sisi kedua}}{\\text{sisi pertama}}')}.</p></div>
          </div>
        </div>
      </section>
    </div>`;
  }

  function feature(icon, title, text, href, cta) {
    return `<a class="card card-hover feature-card" href="${href}" style="text-decoration:none;color:inherit;display:block">
      <div class="icon-bubble">${GM.icon(icon, 22)}</div>
      <h3>${title}</h3><p>${text}</p>
      <span class="btn btn-outline btn-sm">${cta} ${GM.icon('right', 16)}</span>
    </a>`;
  }

  GM.HomePage = { render };
})();
