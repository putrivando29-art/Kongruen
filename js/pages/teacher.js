/* Dasbor Guru: memantau progres seluruh siswa dari Firestore. */
(function () {
  const GM = window.GM;
  let students = [];
  let filter = { kelas: '', q: '', sort: 'name' };
  let selected = null;
  let loadedAt = null;

  const ST = {
    tercapai: { c: '#15803D', bg: '#DCFCE7', t: 'Tercapai' },
    penguatan: { c: '#B45309', bg: '#FEF3C7', t: 'Perlu penguatan' },
    belum: { c: '#94A3B8', bg: '#F1F5F9', t: 'Belum dinilai' }
  };
  const fmtDate = (d) => (d ? d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-');

  function tpCells(tp) {
    return `<div class="tp-strip">${(tp || []).map((s, i) => { const x = ST[s] || ST.belum; return `<span title="TP ${i + 1}: ${x.t}" style="background:${x.bg};color:${x.c};border-color:${x.c}">${i + 1}</span>`; }).join('')}</div>`;
  }

  function visible() {
    const q = filter.q.toLowerCase();
    const list = students.filter((s) => (!filter.kelas || s.kelas === filter.kelas) && (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)));
    const by = {
      name: (a, b) => a.name.localeCompare(b.name, 'id'),
      score: (a, b) => (b.summary.missionScore || 0) - (a.summary.missionScore || 0),
      quiz: (a, b) => (b.summary.quizScore ?? -1) - (a.summary.quizScore ?? -1),
      recent: (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
    };
    return list.sort(by[filter.sort]);
  }

  function stats(list) {
    const n = list.length;
    const avg = (f) => { const v = list.map(f).filter((x) => typeof x === 'number'); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : '-'; };
    return `<div class="summary-grid">
      <div class="sum-tile"><b>${n}</b><span>Siswa ditampilkan</span></div>
      <div class="sum-tile"><b>${avg((s) => s.summary.missionScore)}</b><span>Rata-rata skor misi</span></div>
      <div class="sum-tile ok"><b>${list.filter((s) => s.summary.missionsDone === GM.MISSIONS.length).length}</b><span>Menyelesaikan 10 kasus</span></div>
      <div class="sum-tile"><b>${avg((s) => s.summary.quizSubmitted ? s.summary.quizScore : null)}</b><span>Rata-rata PG evaluasi (${list.filter((s) => s.summary.quizSubmitted).length} siswa)</span></div>
    </div>
    <h4 style="margin-top:14px">Ketercapaian per TP (jumlah siswa berstatus "Tercapai")</h4>
    <div class="tp-bars">${GM.CURRICULUM.tps.map((tp, i) => {
      const ok = list.filter((s) => (s.summary.tp || [])[i] === 'tercapai').length;
      const pen = list.filter((s) => (s.summary.tp || [])[i] === 'penguatan').length;
      return `<div class="tp-bar" title="${GM.esc(tp.text)}"><span class="lbl">TP ${tp.n}</span><div class="progress"><span style="width:${n ? (ok / n) * 100 : 0}%"></span></div><span class="num">${ok}/${n}${pen ? ` · <b style="color:#B45309">${pen} penguatan</b>` : ''}</span></div>`;
    }).join('')}</div>`;
  }

  function table(list) {
    if (!list.length) return `<div class="callout"><p>${students.length ? 'Tidak ada siswa yang cocok dengan filter.' : 'Belum ada siswa yang mendaftar atau menyimpan progres.'}</p></div>`;
    return `<div class="table-wrap"><table class="data compact">
      <tr><th>Nama</th><th>Kelas</th><th>Kasus</th><th>Skor misi</th><th>Evaluasi PG</th><th>Uraian</th><th>Capaian TP 1–10</th><th>Terakhir aktif</th></tr>
      ${list.map((s) => `<tr class="row-click ${selected === s.id ? 'row-sel' : ''}" data-id="${s.id}" tabindex="0">
        <td><b>${GM.esc(s.name)}</b><br><span class="small muted">${GM.esc(s.email)}</span></td>
        <td>${GM.esc(s.kelas)}</td>
        <td>${s.summary.missionsDone ?? 0}/10</td>
        <td><b>${s.summary.missionScore ?? 0}</b></td>
        <td>${s.summary.quizSubmitted ? `<b>${s.summary.quizScore}</b>` : '<span class="muted">belum</span>'}</td>
        <td>${s.summary.quizSubmitted ? `${s.summary.essayOk}/5` : '<span class="muted">-</span>'}</td>
        <td>${tpCells(s.summary.tp)}</td>
        <td class="small">${fmtDate(s.updatedAt)}</td>
      </tr>`).join('')}
    </table></div>`;
  }

  function detail(s) {
    const st = s.state || {};
    const ms = st.missions || {};
    const q = st.quiz || {};
    const r = q.submitted ? q.result : null;
    const missionRows = GM.MISSIONS.map((m) => {
      const d = ms[m.id] || {};
      const res = d.firstCorrect === true ? '<span style="color:var(--ok);font-weight:700">Benar</span>' : d.firstCorrect === false ? '<span style="color:var(--bad);font-weight:700">Salah</span>' : '<span class="muted">Belum</span>';
      return `<tr><td>${m.id}</td><td>TP ${m.tp}</td><td>${GM.esc(m.title)}</td><td>${res}</td><td>${d.attempts || 0}</td><td>${d.hints || 0}</td><td>${d.revealed ? 'Ya' : '-'}</td></tr>`;
    }).join('');
    const mcRows = GM.QUIZ_MC.map((it, i) => {
      const a = (q.answers || {})[it.id];
      const ok = a === it.answer;
      return `<tr><td>PG ${i + 1}</td><td>TP ${it.tp}</td><td>${a === undefined ? '<span class="muted">kosong</span>' : 'ABCD'[a]}</td><td>${'ABCD'[it.answer]}</td><td>${r ? (ok ? '<span style="color:var(--ok);font-weight:700">Benar</span>' : '<span style="color:var(--bad);font-weight:700">Salah</span>') : '<span class="muted">belum dikirim</span>'}</td></tr>`;
    }).join('');
    const essays = GM.QUIZ_ESSAY.map((it, i) => {
      const fin = (q.finals || {})[it.id] || '';
      const v = GM.parseNum(fin);
      const ok = !isNaN(v) && Math.abs(v - it.final) < 0.01;
      return `<div class="essay-box"><div class="q-head"><b>Uraian ${i + 1}</b><span class="chip chip-navy">TP ${it.tp}</span><span class="chip">${GM.esc(it.topic)}</span>
        <span class="chip ${fin ? (ok ? 'chip-mint' : 'chip-bad') : ''}" style="margin-left:auto">Jawaban akhir: ${GM.esc(fin || '-')} ${it.unit} ${fin ? (ok ? '(tepat)' : `(kunci ${GM.fmt(it.final, 2)})`) : ''}</span></div>
        <div class="essay-text">${GM.esc((q.essays || {})[it.id] || '').replace(/\n/g, '<br>') || '<span class="muted">Belum ada langkah penyelesaian yang ditulis.</span>'}</div></div>`;
    }).join('');
    const rep = GM.tpReport(st);
    const tabs = GM.MaterialPage.TABS;
    return `<div class="card" id="t-detail">
      <div class="btn-row" style="justify-content:space-between">
        <div><h2 style="margin:0">${GM.esc(s.name)}</h2><p class="muted" style="margin:0">Kelas ${GM.esc(s.kelas)} · ${GM.esc(s.email)} · terakhir aktif ${fmtDate(s.updatedAt)}</p></div>
        <button class="btn btn-outline btn-sm" data-close>${GM.icon('x', 16)} Tutup</button>
      </div>
      <div class="summary-grid" style="margin-top:14px">
        <div class="sum-tile"><b>${s.summary.missionScore ?? 0}</b><span>Skor misi (dari 100)</span></div>
        <div class="sum-tile"><b>${s.summary.missionsDone ?? 0}/10</b><span>Kasus selesai</span></div>
        <div class="sum-tile"><b>${s.summary.materialCount ?? 0}/10</b><span>Materi TP dibuka</span></div>
        <div class="sum-tile"><b>${s.summary.practiceTotal ?? 0}</b><span>Latihan seletak benar</span></div>
      </div>
      <h3 style="margin-top:18px">Capaian per TP</h3>
      <div class="table-wrap"><table class="data compact"><tr><th>TP</th><th>Tujuan</th><th>Kasus</th><th>Evaluasi</th><th>Latihan</th><th>Materi dibuka</th><th>Status</th></tr>
        ${rep.map((x) => { const t = ST[x.status]; return `<tr><td><b>TP ${x.tp.n}</b></td><td class="small">${GM.esc(x.tp.text.replace('Peserta didik mampu ', ''))}</td><td>${x.mission === true ? 'Benar' : x.mission === false ? 'Salah' : '-'}</td><td>${x.quiz || '-'}</td><td>${[5, 6, 7, 8].includes(x.tp.n) ? x.practice : '-'}</td><td>${x.visited ? 'Ya' : 'Belum'}</td><td><span class="chip" style="background:${t.bg};color:${t.c}">${t.t}</span></td></tr>`; }).join('')}
      </table></div>
      <h3 style="margin-top:18px">Misi Detektif</h3>
      <div class="table-wrap"><table class="data compact"><tr><th>No</th><th>TP</th><th>Kasus</th><th>Percobaan pertama</th><th>Jumlah percobaan</th><th>Petunjuk dipakai</th><th>Buka pembahasan</th></tr>${missionRows}</table></div>
      <h3 style="margin-top:18px">Evaluasi ${r ? `<span class="chip chip-mint">Dikirim · PG ${r.mcScore}</span>` : '<span class="chip">Belum dikirim</span>'}</h3>
      <div class="table-wrap"><table class="data compact"><tr><th>Soal</th><th>TP</th><th>Jawaban</th><th>Kunci</th><th>Hasil</th></tr>${mcRows}</table></div>
      <h4 style="margin-top:14px">Jawaban uraian (perlu dinilai guru)</h4>
      ${essays}
      <h3 style="margin-top:18px">Aktivitas lain</h3>
      <p class="small">Materi dibuka: ${tabs.filter((t) => (st.material || {})[t.id]).map((t) => 'TP ' + t.tp).join(', ') || '-'}.<br>
      Soal kontekstual terjawab benar: ${Object.keys(st.apps || {}).length}. Badge: ${(st.badges || []).length}/3.</p>
    </div>`;
  }

  function csv(list) {
    const head = ['Nama', 'Kelas', 'Email', 'Kasus selesai', 'Skor misi', 'Kasus benar', 'Kasus salah', 'Evaluasi dikirim', 'Skor PG', 'Uraian tepat', ...GM.CURRICULUM.tps.map((t) => 'TP ' + t.n), 'Materi dibuka', 'Latihan benar', 'Terakhir aktif'];
    const rows = list.map((s) => {
      const m = s.summary;
      return [s.name, s.kelas, s.email, m.missionsDone ?? 0, m.missionScore ?? 0, m.missionsCorrect ?? 0, m.missionsWrong ?? 0, m.quizSubmitted ? 'Ya' : 'Belum', m.quizSubmitted ? m.quizScore : '', m.quizSubmitted ? m.essayOk : '',
        ...(m.tp || Array(10).fill('belum')).map((x) => (ST[x] || ST.belum).t), m.materialCount ?? 0, m.practiceTotal ?? 0, s.updatedAt ? s.updatedAt.toISOString() : ''];
    });
    const esc = (v) => { const t = String(v ?? ''); return /[",;\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
    // Pemisah titik koma agar langsung terbaca rapi di Excel berbahasa Indonesia.
    const text = '﻿' + [head, ...rows].map((r) => r.map(esc).join(';')).join('\r\n');
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `rekap-geomatch-${filter.kelas || 'semua'}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function draw(el) {
    const list = visible();
    const kelasList = [...new Set(students.map((s) => s.kelas))].sort();
    const p = GM.cloud.profile || {};
    el.innerHTML = `<div class="container page no-anim">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('clipboard', 14)} Dasbor Guru</span>
        <h1>Pemantauan Hasil Siswa</h1>
        <p>Masuk sebagai <b>${GM.esc(p.name || GM.cloud.user.email)}</b>. Data diambil dari Firestore${loadedAt ? ` pada ${fmtDate(loadedAt)}` : ''}. Klik baris siswa untuk melihat rincian, termasuk jawaban uraian.</p>
      </div>
      <div class="card">
        <div class="btn-row">
          <div class="control" style="margin:0;min-width:140px"><label for="t-kelas">Kelas</label><select id="t-kelas"><option value="">Semua kelas</option>${kelasList.map((k) => `<option ${k === filter.kelas ? 'selected' : ''}>${GM.esc(k)}</option>`).join('')}</select></div>
          <div class="control" style="margin:0;flex:1 1 200px"><label for="t-q">Cari nama/email</label><input type="text" id="t-q" value="${GM.esc(filter.q)}" placeholder="ketik nama siswa"></div>
          <div class="control" style="margin:0;min-width:160px"><label for="t-sort">Urutkan</label><select id="t-sort">
            ${[['name', 'Nama (A-Z)'], ['score', 'Skor misi tertinggi'], ['quiz', 'Skor evaluasi tertinggi'], ['recent', 'Terakhir aktif']].map(([v, t]) => `<option value="${v}" ${filter.sort === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="btn-row" style="align-self:flex-end">
            <button class="btn btn-outline btn-sm" id="t-refresh">${GM.icon('refresh', 16)} Muat ulang</button>
            <button class="btn btn-mint btn-sm" id="t-csv" ${list.length ? '' : 'disabled'}>${GM.icon('down', 16)} Unduh rekap (CSV)</button>
          </div>
        </div>
      </div>
      <div class="card">${stats(list)}</div>
      <div class="card"><h3>Daftar siswa</h3>
        <p class="small muted">Kotak TP: <span class="legend" style="background:#DCFCE7;color:#15803D">tercapai</span> <span class="legend" style="background:#FEF3C7;color:#B45309">perlu penguatan</span> <span class="legend" style="background:#F1F5F9;color:#94A3B8">belum dinilai</span>. Status adalah indikasi dari kasus misi dan soal evaluasi; jawaban uraian tetap perlu dinilai guru.</p>
        ${table(list)}</div>
      ${selected && students.find((s) => s.id === selected) ? detail(students.find((s) => s.id === selected)) : ''}
    </div>`;
    const $ = (id) => el.querySelector('#' + id);
    $('t-kelas').addEventListener('change', (e) => { filter.kelas = e.target.value; draw(el); });
    $('t-sort').addEventListener('change', (e) => { filter.sort = e.target.value; draw(el); });
    $('t-q').addEventListener('input', (e) => { filter.q = e.target.value; const pos = e.target.selectionStart; draw(el); const n = el.querySelector('#t-q'); n.focus(); n.setSelectionRange(pos, pos); });
    $('t-refresh').addEventListener('click', () => load(el));
    $('t-csv').addEventListener('click', () => csv(list));
    el.querySelectorAll('[data-id]').forEach((tr) => {
      const open = () => { selected = tr.dataset.id; draw(el); const d = el.querySelector('#t-detail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    });
    const close = el.querySelector('[data-close]');
    if (close) close.addEventListener('click', () => { selected = null; draw(el); });
  }

  async function load(el) {
    el.innerHTML = `<div class="container page"><div class="card center"><p>${GM.icon('clock', 18)} Memuat data siswa dari Firestore ...</p></div></div>`;
    try {
      students = await GM.cloud.listStudents();
      loadedAt = new Date();
      draw(el);
    } catch (e) {
      el.innerHTML = `<div class="container page"><div class="card"><div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div><strong>Data siswa tidak dapat dimuat.</strong>${GM.esc(GM.cloud.errorMessage(e))}</div></div>
        <button class="btn btn-primary" id="t-retry">${GM.icon('refresh', 18)} Coba lagi</button></div></div>`;
      el.querySelector('#t-retry').addEventListener('click', () => load(el));
    }
  }

  function render(el) {
    const c = GM.cloud;
    if (!c || !c.enabled) { GM.LoginPage.render(el); return; }
    if (!c.resolved) { el.innerHTML = `<div class="container page"><div class="card center"><p>${GM.icon('clock', 18)} Memeriksa status akun ...</p></div></div>`; return; }
    if (c.role !== 'guru') {
      el.innerHTML = `<div class="container page"><div class="card" style="max-width:560px;margin:0 auto">
        <h2>${GM.icon('lock', 22)} Khusus guru</h2>
        <p>Halaman ini hanya dapat dibuka oleh akun guru.</p>
        <a class="btn btn-primary" href="#/masuk">${GM.icon('right', 18)} Masuk sebagai guru</a></div></div>`;
      return;
    }
    load(el);
  }

  GM.TeacherPage = { render };
})();
