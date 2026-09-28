/* Halaman Hasil Investigasi */
(function () {
  const GM = window.GM;

  function message(p) {
    if (p >= 90) return { t: 'Penguasaan materi sangat baik.', c: 'mint' };
    if (p >= 75) return { t: 'Pemahaman materi baik.', c: '' };
    if (p >= 60) return { t: 'Perlu latihan tambahan.', c: 'warn' };
    return { t: 'Pelajari kembali materi dasar.', c: 'bad' };
  }

  function confetti() {
    const cols = ['#BBF7D0', '#BFDBFE', '#FDE68A', '#FFFFFF', '#93C5FD'];
    let s = '';
    for (let i = 0; i < 26; i++) {
      s += `<i style="left:${(i * 37) % 100}%;background:${cols[i % cols.length]};animation-duration:${3 + (i % 5) * 0.7}s;animation-delay:${(i % 7) * 0.4}s"></i>`;
    }
    return `<div class="confetti" aria-hidden="true">${s}</div>`;
  }

  function ring(p) {
    const r = 62, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 150 150" role="img" aria-label="Persentase keberhasilan ${p} persen">
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="14"/>
      <circle cx="75" cy="75" r="${r}" fill="none" stroke="${p >= 75 ? '#15803D' : p >= 60 ? '#F59E0B' : '#DC2626'}" stroke-width="14" stroke-linecap="round"
        stroke-dasharray="${(c * p) / 100} ${c}" transform="rotate(-90 75 75)" style="transition:stroke-dasharray 1s"/>
      <text x="75" y="84" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="30" fill="#17324D">${p}%</text>
    </svg>`;
  }

  function render(el) {
    const st = GM.store.missionStats();
    const s = GM.store.get();

    if (!st.allDone) {
      el.innerHTML = `<div class="container page">
        <div class="card center" style="max-width:640px;margin:0 auto">
          <div class="icon-bubble navy" style="margin:0 auto 12px;width:64px;height:64px">${GM.icon('lock', 30)}</div>
          <h1>Investigasi Belum Selesai</h1>
          <p class="muted">Selesaikan semua kasus untuk membuka hasil akhir. Saat ini ${st.completed} dari ${st.total} kasus sudah selesai.</p>
          <div class="progress" style="margin:14px 0"><span style="width:${(st.completed / st.total) * 100}%"></span></div>
          <div class="btn-row" style="justify-content:center">
            <a class="btn btn-primary" href="#/misi">${GM.icon('play', 18)} Lanjutkan Investigasi</a>
            <a class="btn btn-outline" href="#/materi/kongruensi">${GM.icon('book', 18)} Pelajari Materi</a>
          </div>
        </div>
        ${s.quiz.result ? quizBlock(s.quiz.result) : ''}
      </div>`;
      return;
    }

    const pct = st.percent;
    const msg = message(pct);
    const wrongCases = GM.MISSIONS.filter((m) => s.missions[m.id] && s.missions[m.id].firstCorrect === false);
    const badges = GM.store.BADGES.map((b) => {
      const got = s.badges.includes(b.id);
      return `<div class="badge ${got ? 'earned' : ''}"><div class="b-ico">${GM.icon(got ? b.icon : 'lock', 20)}</div><div><strong>${b.name}</strong><small>${got ? 'Diperoleh' : 'Belum diperoleh'} · ${b.desc}</small></div></div>`;
    }).join('');

    el.innerHTML = `<div class="container page">
      <section class="result-hero">
        ${confetti()}
        <span class="hero-tag" style="position:relative">${GM.icon('trophy', 18)} Laporan Akhir Detektif</span>
        <h1 style="position:relative">INVESTIGASI SELESAI!</h1>
        <div class="big-score" style="position:relative">${st.score}<small> / 100</small></div>
        <p style="position:relative;color:#D6E4F5;margin:0">Skor akhir Misi Detektif</p>
      </section>

      <div class="grid grid-2" style="margin-top:18px;align-items:start">
        <div class="card">
          <h2>${GM.icon('clipboard', 22)} Rekap Kasus</h2>
          <div class="summary-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
            <div class="sum-tile"><b>${st.score}</b><span>Skor akhir</span></div>
            <div class="sum-tile"><b>${pct}%</b><span>Persentase keberhasilan</span></div>
            <div class="sum-tile ok"><b>${st.correct}</b><span>Jawaban benar</span></div>
            <div class="sum-tile bad"><b>${st.wrong}</b><span>Jawaban salah</span></div>
          </div>
          <h4 style="margin-top:16px">Cara menghitung</h4>
          ${GM.formula(`\\text{Persentase keberhasilan} = \\frac{\\text{Jumlah jawaban benar}}{\\text{Jumlah seluruh soal}} \\times 100\\% = \\frac{${st.correct}}{${st.total}} \\times 100\\% = ${pct}\\%`)}
          <div class="table-wrap"><table class="data compact">
            <tr><th>Kasus</th><th>Hasil percobaan pertama</th><th>Poin</th></tr>
            ${GM.MISSIONS.map((m) => { const d = s.missions[m.id] || {}; return `<tr><td>${m.id}. ${m.title}</td><td class="${d.firstCorrect ? 'ok' : 'bad'}">${d.firstCorrect ? 'Benar' : 'Salah'}</td><td>${d.firstCorrect ? 20 : 0}</td></tr>`; }).join('')}
          </table></div>
        </div>
        <div>
          <div class="card center">
            ${ring(pct)}
            <div class="callout ${msg.c}" style="text-align:left"><div class="callout-title">${GM.icon('bulb', 18)} Pesan untukmu</div><p>${msg.t}</p></div>
          </div>
          <div class="card">
            <h3>${GM.icon('medal', 20)} Badge yang diperoleh</h3>
            <div class="badge-row">${badges}</div>
          </div>
          <div class="card">
            <h3>${GM.icon('book', 20)} Rekomendasi materi</h3>
            ${wrongCases.length
              ? `<p class="small muted">Berdasarkan kasus yang belum tepat pada percobaan pertama:</p><ul class="info-list">${wrongCases.map((m) => `<li><span class="dot" style="background:var(--bad)"></span><div><b>Kasus ${m.id}: ${m.title}</b><br><a href="#/materi/${m.topic.tab}">Pelajari: ${m.topic.label}</a></div></li>`).join('')}</ul>`
              : `<p>Semua kasus terjawab benar pada percobaan pertama. Lanjutkan ke <a href="#/materi/teorema">Teorema Thales dan garis tinggi</a> atau uji dirimu di <a href="#/evaluasi">Evaluasi</a>.</p>`}
          </div>
        </div>
      </div>

      ${s.quiz.result ? quizBlock(s.quiz.result) : ''}

      <div class="card center" style="margin-top:18px">
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-primary btn-lg" id="r-again">${GM.icon('refresh', 18)} Ulangi Investigasi</button>
          <a class="btn btn-outline btn-lg" href="#/materi/kongruensi">${GM.icon('book', 18)} Pelajari Materi</a>
          <a class="btn btn-mint btn-lg" href="#/evaluasi">${GM.icon('clipboard', 18)} Kerjakan Evaluasi</a>
        </div>
      </div>
    </div>`;

    el.querySelector('#r-again').addEventListener('click', async () => {
      if (!(await GM.confirm('Ulangi investigasi?', 'Skor, status kasus, dan badge misi akan dihapus agar kamu bisa bermain dari awal.', 'Ya, ulangi'))) return;
      GM.store.resetMissions();
      GM.MissionGame.reset();
      GM.go('#/misi/1');
    });
  }

  function quizBlock(r) {
    return `<div class="card" style="margin-top:18px">
      <h3>${GM.icon('clipboard', 20)} Hasil Evaluasi Terakhir</h3>
      <div class="summary-grid">
        <div class="sum-tile"><b>${r.mcScore}</b><span>Skor pilihan ganda</span></div>
        <div class="sum-tile ok"><b>${r.mcCorrect}</b><span>PG benar</span></div>
        <div class="sum-tile bad"><b>${r.mcWrong}</b><span>PG salah</span></div>
        <div class="sum-tile"><b>${r.essayOk}/${r.essayTotal}</b><span>Uraian tepat</span></div>
      </div>
      <a class="btn btn-outline btn-sm" style="margin-top:12px" href="#/evaluasi">Lihat pembahasan evaluasi ${GM.icon('right', 16)}</a>
    </div>`;
  }

  GM.ResultPage = { render };
})();
