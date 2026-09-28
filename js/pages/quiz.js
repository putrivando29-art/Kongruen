/* Halaman Latihan dan Evaluasi: 10 PG + 5 uraian */
(function () {
  const GM = window.GM;
  let tick = null;
  let saveT = null;
  const LV = { mudah: 'Mudah', sedang: 'Sedang', sulit: 'Sulit' };

  function q() { return GM.store.get().quiz; }

  function grade() {
    const Q = q();
    const mc = GM.QUIZ_MC.map((it) => ({ id: it.id, level: it.level, topic: it.topic, tab: it.tab, ok: Q.answers[it.id] === it.answer, answered: Q.answers[it.id] !== undefined }));
    const es = GM.QUIZ_ESSAY.map((it) => {
      const v = GM.parseNum(Q.finals[it.id]);
      return { id: it.id, level: it.level, topic: it.topic, tab: it.tab, ok: !isNaN(v) && Math.abs(v - it.final) < 0.01, filled: !!(Q.essays[it.id] || '').trim() || !isNaN(v) };
    });
    const mcCorrect = mc.filter((x) => x.ok).length;
    const byLevel = {};
    ['mudah', 'sedang', 'sulit'].forEach((l) => {
      const items = [...mc, ...es].filter((x) => x.level === l);
      byLevel[l] = { ok: items.filter((x) => x.ok).length, total: items.length };
    });
    const weak = {};
    [...mc, ...es].filter((x) => !x.ok).forEach((x) => { weak[x.tab] = weak[x.tab] || []; weak[x.tab].push(x.topic); });
    const started = Q.startedAt || Date.now();
    return {
      mcCorrect, mcWrong: mc.length - mcCorrect, mcScore: mcCorrect * 10,
      essayOk: es.filter((x) => x.ok).length, essayTotal: es.length,
      byLevel, weak, mc, es,
      seconds: Math.max(0, Math.round((Date.now() - started) / 1000)),
      at: new Date().toISOString()
    };
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function mcCard(it, i, Q, done) {
    const chosen = Q.answers[it.id];
    const ok = chosen === it.answer;
    return `<div class="card q-card ${done ? (ok ? 'is-correct' : 'is-wrong') : ''}" id="q-${it.id}">
      <div class="q-head"><span class="q-num">Soal ${i + 1}</span><span class="chip diff-${it.level}">${LV[it.level]}</span><span class="chip">${it.topic}</span>
        ${done ? `<span class="chip ${ok ? 'chip-mint' : 'chip-bad'}" style="margin-left:auto">${ok ? 'Benar' : chosen === undefined ? 'Tidak dijawab' : 'Salah'}</span>` : ''}</div>
      <p>${GM.md(it.q)}</p>
      <div class="options">
        ${it.options.map((o, k) => {
          let cls = '';
          if (done && k === it.answer) cls = 'correct';
          else if (done && k === chosen) cls = 'wrong';
          else if (k === chosen) cls = 'selected';
          return `<label class="opt ${cls} ${done ? 'locked' : ''}"><input type="radio" name="${it.id}" value="${k}" ${k === chosen ? 'checked' : ''} ${done ? 'disabled' : ''}><span class="o-key">${'ABCD'[k]}</span><span>${GM.md(o)}</span></label>`;
        }).join('')}
      </div>
      ${done ? `<div class="q-explain callout ${ok ? 'mint' : ''}"><div class="callout-title">${GM.icon('book', 18)} Pembahasan (kunci: ${'ABCD'[it.answer]})</div><p>${GM.md(it.explain)}</p></div>` : ''}
    </div>`;
  }

  function essayCard(it, i, Q, done) {
    const v = GM.parseNum(Q.finals[it.id]);
    const ok = !isNaN(v) && Math.abs(v - it.final) < 0.01;
    return `<div class="card q-card ${done ? (ok ? 'is-correct' : 'is-wrong') : ''}" id="q-${it.id}">
      <div class="q-head"><span class="q-num">Uraian ${i + 1}</span><span class="chip diff-${it.level}">${LV[it.level]}</span><span class="chip">${it.topic}</span>
        ${done ? `<span class="chip ${ok ? 'chip-mint' : 'chip-bad'}" style="margin-left:auto">Jawaban akhir ${ok ? 'tepat' : 'belum tepat'}</span>` : ''}</div>
      <p>${GM.md(it.q)}</p>
      <label class="small muted" for="es-${it.id}">Tuliskan langkah penyelesaianmu:</label>
      <textarea id="es-${it.id}" data-essay="${it.id}" placeholder="Contoh: Pasangkan sisi bersesuaian, lalu hitung perbandingannya ..." ${done ? 'readonly' : ''}>${GM.esc(Q.essays[it.id] || '')}</textarea>
      <div class="input-row" style="margin-top:10px">
        <label for="fn-${it.id}" style="font-weight:600;flex:0 0 auto">${it.finalLabel}</label>
        <input type="text" inputmode="decimal" id="fn-${it.id}" data-final="${it.id}" value="${GM.esc(Q.finals[it.id] || '')}" placeholder="angka" style="max-width:140px" ${done ? 'readonly' : ''}>
        <span class="muted">${it.unit}</span>
      </div>
      ${done ? `<div class="q-explain callout ${ok ? 'mint' : ''}"><div class="callout-title">${GM.icon('book', 18)} Pembahasan (jawaban akhir: ${GM.fmt(it.final, 2)} ${it.unit})</div>
        <ol class="clean">${it.model.map((s) => `<li>${GM.md(s)}</li>`).join('')}</ol>
        <p class="small muted">Bandingkan langkah yang kamu tulis dengan pembahasan ini. Skor otomatis hanya untuk pilihan ganda; jawaban akhir uraian diperiksa sebagai umpan balik.</p></div>` : ''}
    </div>`;
  }

  function summary(r) {
    const tabs = GM.MaterialPage.TABS;
    const weak = Object.keys(r.weak);
    const msg = r.mcScore >= 90 ? 'Penguasaan materi sangat baik.' : r.mcScore >= 75 ? 'Pemahaman materi baik.' : r.mcScore >= 60 ? 'Perlu latihan tambahan.' : 'Pelajari kembali materi dasar.';
    return `<div class="card" id="quiz-summary">
      <h2>${GM.icon('clipboard', 22)} Ringkasan Hasil Belajar</h2>
      <p class="muted">${msg}</p>
      <div class="summary-grid">
        <div class="sum-tile"><b>${r.mcScore}</b><span>Skor pilihan ganda (0–100)</span></div>
        <div class="sum-tile ok"><b>${r.mcCorrect}</b><span>PG benar</span></div>
        <div class="sum-tile bad"><b>${r.mcWrong}</b><span>PG salah / kosong</span></div>
        <div class="sum-tile"><b>${r.essayOk}/${r.essayTotal}</b><span>Jawaban akhir uraian tepat</span></div>
      </div>
      <div class="grid grid-3" style="margin-top:14px">
        ${['mudah', 'sedang', 'sulit'].map((l) => `<div><div class="progress-label"><span>${LV[l]}</span><span>${r.byLevel[l].ok}/${r.byLevel[l].total}</span></div><div class="progress"><span style="width:${(r.byLevel[l].ok / r.byLevel[l].total) * 100}%"></span></div></div>`).join('')}
      </div>
      <p class="small muted" style="margin-top:10px">Waktu pengerjaan: ${fmtTime(r.seconds)}.</p>
      ${weak.length ? `<h4>${GM.icon('bulb', 18)} Materi yang disarankan untuk dipelajari kembali</h4>
        <div class="btn-row">${weak.map((t) => `<a class="btn btn-outline btn-sm" href="#/materi/${t}">${GM.icon('book', 16)} ${tabs.find((x) => x.id === t).title}</a>`).join('')}</div>`
        : `<div class="callout mint"><p>Semua jawaban tepat. Tantang dirimu di <a href="#/lab/kongruensi">Laboratorium Geometri</a>!</p></div>`}
      <div class="btn-row" style="margin-top:16px">
        <button class="btn btn-primary" data-q="again">${GM.icon('refresh', 18)} Ulangi Evaluasi</button>
        <a class="btn btn-outline" href="#/hasil">${GM.icon('trophy', 18)} Hasil Investigasi</a>
      </div>
    </div>`;
  }

  function render(el) {
    const Q = q();
    const done = Q.submitted && Q.result;
    const answered = GM.QUIZ_MC.filter((it) => Q.answers[it.id] !== undefined).length + GM.QUIZ_ESSAY.filter((it) => (Q.finals[it.id] || '').trim() || (Q.essays[it.id] || '').trim()).length;
    const total = GM.QUIZ_MC.length + GM.QUIZ_ESSAY.length;
    const redraw = !!el.querySelector('.quiz-bar');
    el.innerHTML = `<div class="container page ${redraw ? 'no-anim' : ''}">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('clipboard', 14)} Latihan dan Evaluasi</span>
        <h1>Ujian Kenaikan Pangkat Detektif</h1>
        <p>Evaluasi ini terpisah dari Misi Detektif. Terdiri atas 10 soal pilihan ganda (skor otomatis, 10 poin per soal) dan 5 soal uraian dengan kolom jawaban. Pembahasan muncul setelah kamu mengirim jawaban. Jawaban tersimpan otomatis.</p>
      </div>
      ${done ? summary(Q.result) : ''}
      <div class="card quiz-bar">
        <div style="flex:1 1 220px">
          <div class="progress-label"><span>Terjawab</span><span id="q-count">${answered}/${total}</span></div>
          <div class="progress"><span id="q-bar" style="width:${(answered / total) * 100}%"></span></div>
        </div>
        ${done ? `<span class="chip chip-mint">${GM.icon('check', 14)} Sudah dikirim</span>` : `
        <label class="switch"><input type="checkbox" id="q-timer" ${Q.timer ? 'checked' : ''}> Timer ${GM.QUIZ_MINUTES} menit</label>
        <span class="timer ${Q.timer ? '' : 'hidden'}" id="q-clock">${GM.icon('clock', 18)} <span>--:--</span></span>`}
      </div>
      <h2 style="margin-top:8px">A. Pilihan Ganda</h2>
      ${GM.QUIZ_MC.map((it, i) => mcCard(it, i, Q, done)).join('')}
      <h2 style="margin-top:28px">B. Uraian</h2>
      ${GM.QUIZ_ESSAY.map((it, i) => essayCard(it, i, Q, done)).join('')}
      ${done ? '' : `<div class="card" style="text-align:center">
        <p class="muted">Periksa kembali jawabanmu sebelum mengirim.</p>
        <button class="btn btn-primary btn-lg" data-q="submit">${GM.icon('send', 18)} Kirim Jawaban</button>
      </div>`}
    </div>`;
    bind(el, done);
  }

  function updateCount(el) {
    const Q = q();
    const answered = GM.QUIZ_MC.filter((it) => Q.answers[it.id] !== undefined).length + GM.QUIZ_ESSAY.filter((it) => (Q.finals[it.id] || '').trim() || (Q.essays[it.id] || '').trim()).length;
    const total = GM.QUIZ_MC.length + GM.QUIZ_ESSAY.length;
    const c = el.querySelector('#q-count'), b = el.querySelector('#q-bar');
    if (c) c.textContent = `${answered}/${total}`;
    if (b) b.style.width = `${(answered / total) * 100}%`;
  }

  function markStart() {
    if (!q().startedAt) GM.store.update((s) => { s.quiz.startedAt = Date.now(); });
  }

  function submit(el, auto) {
    stopTimer();
    const r = grade();
    GM.store.update((s) => {
      s.quiz.submitted = true;
      s.quiz.result = r;
      s.quiz.deadline = null;
      s.quizHistory = (s.quizHistory || []).concat([{ at: r.at, mcScore: r.mcScore, essayOk: r.essayOk }]).slice(-10);
    });
    render(el);
    if (auto) GM.toast('Waktu habis', 'Jawabanmu dikirim otomatis.', 'clock');
    const sm = el.querySelector('#quiz-summary');
    if (sm) sm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }

  function startTimer(el) {
    stopTimer();
    const Q = q();
    if (!Q.timer || !Q.deadline || Q.submitted) return;
    const clock = el.querySelector('#q-clock');
    const step = () => {
      const left = Math.max(0, Math.round((q().deadline - Date.now()) / 1000));
      if (clock) {
        clock.querySelector('span').textContent = fmtTime(left);
        clock.classList.toggle('low', left <= 60);
      }
      if (left <= 0) submit(el, true);
    };
    step();
    tick = setInterval(step, 1000);
  }

  function bind(el, done) {
    if (done) {
      const again = el.querySelector('[data-q="again"]');
      if (again) again.addEventListener('click', async () => {
        if (!(await GM.confirm('Ulangi evaluasi?', 'Semua jawaban evaluasi akan dikosongkan. Riwayat skor tetap disimpan.', 'Ya, ulangi'))) return;
        GM.store.resetQuiz();
        render(el);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }
    el.querySelectorAll('.options input[type=radio]').forEach((r) => r.addEventListener('change', () => {
      markStart();
      GM.store.update((s) => { s.quiz.answers[r.name] = +r.value; });
      r.closest('.options').querySelectorAll('.opt').forEach((o) => o.classList.toggle('selected', o.querySelector('input').checked));
      updateCount(el);
    }));
    const saveLater = (fn) => { clearTimeout(saveT); saveT = setTimeout(() => { GM.store.update(fn); updateCount(el); }, 300); };
    el.querySelectorAll('[data-essay]').forEach((t) => t.addEventListener('input', () => { markStart(); saveLater((s) => { s.quiz.essays[t.dataset.essay] = t.value; }); }));
    el.querySelectorAll('[data-final]').forEach((t) => t.addEventListener('input', () => { markStart(); saveLater((s) => { s.quiz.finals[t.dataset.final] = t.value; }); }));
    const tg = el.querySelector('#q-timer');
    tg.addEventListener('change', () => {
      GM.store.update((s) => {
        s.quiz.timer = tg.checked;
        s.quiz.deadline = tg.checked ? Date.now() + GM.QUIZ_MINUTES * 60 * 1000 : null;
        if (tg.checked && !s.quiz.startedAt) s.quiz.startedAt = Date.now();
      });
      el.querySelector('#q-clock').classList.toggle('hidden', !tg.checked);
      if (tg.checked) startTimer(el); else stopTimer();
    });
    el.querySelector('[data-q="submit"]').addEventListener('click', async () => {
      clearTimeout(saveT);
      // simpan isian terakhir yang mungkin belum tersimpan
      GM.store.update((s) => {
        el.querySelectorAll('[data-essay]').forEach((t) => { s.quiz.essays[t.dataset.essay] = t.value; });
        el.querySelectorAll('[data-final]').forEach((t) => { s.quiz.finals[t.dataset.final] = t.value; });
      });
      const Q = q();
      const empty = GM.QUIZ_MC.filter((it) => Q.answers[it.id] === undefined).length;
      if (empty && !(await GM.confirm('Masih ada soal kosong', `${empty} soal pilihan ganda belum dijawab. Soal kosong dinilai salah. Tetap kirim?`, 'Kirim sekarang'))) return;
      submit(el, false);
    });
    startTimer(el);
  }

  GM.QuizPage = { render, destroy: stopTimer };
})();
