/* Game utama: Misi Detektif (5 kasus) */
(function () {
  const GM = window.GM;

  let ui = null; // { id, selected, mode: 'answer'|'wrong'|'done'|'practice', hints, steps, lastResult }

  function header() {
    const st = GM.store.missionStats();
    const s = GM.store.get();
    return `
      <div class="mission-top">
        <div>
          <span class="eyebrow" style="display:inline-flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--royal);background:var(--sky-l);padding:4px 10px;border-radius:999px;margin-bottom:10px">${GM.icon('target', 14)} Misi Detektif</span>
          <h1 style="margin-bottom:8px">Ruang Investigasi</h1>
          <div class="progress-label"><span>Progres kasus</span><span>${st.completed} dari ${st.total} kasus selesai</span></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${st.total}" aria-valuenow="${st.completed}"><span style="width:${(st.completed / st.total) * 100}%"></span></div>
        </div>
        <div class="score-box">
          <div class="sb"><b>${st.score}</b><span>Skor / 100</span></div>
          <div class="sb mint"><b>${st.correct}</b><span>Benar</span></div>
          <div class="sb" style="background:#fff;color:var(--navy);border:1px solid var(--line)"><b>${s.badges.length}</b><span style="color:var(--muted)">Badge</span></div>
        </div>
      </div>
      <div class="case-steps" role="tablist" aria-label="Daftar kasus">
        ${GM.MISSIONS.map((m) => {
          const d = s.missions[m.id] || {};
          const unlocked = GM.store.isUnlocked(m.id);
          const cls = [ui && ui.id === m.id ? 'current' : '', d.done ? 'done' : '', d.done && d.firstCorrect === false ? 'missed' : ''].join(' ');
          return `<button class="case-dot ${cls}" data-case="${m.id}" ${unlocked ? '' : 'disabled'} role="tab" aria-selected="${ui && ui.id === m.id}" title="${unlocked ? m.title : 'Terkunci: selesaikan kasus sebelumnya'}">
            <span class="cd-n">${d.done ? GM.icon(d.firstCorrect ? 'check' : 'eye', 14, 3) : unlocked ? m.id : GM.icon('lock', 13)}</span>Kasus ${m.id}</button>`;
        }).join('')}
      </div>`;
  }

  function caseCard(m) {
    const d = GM.store.get().missions[m.id] || {};
    const reveal = ui.mode === 'done';
    const locked = ui.mode === 'done' || ui.mode === 'wrong';
    const opts = m.options.map((o) => {
      let cls = '';
      if (reveal && o.key === m.answer) cls = 'correct';
      else if ((reveal || ui.mode === 'wrong') && o.key === ui.selected && o.key !== m.answer) cls = 'wrong';
      else if (o.key === ui.selected) cls = 'selected';
      return `<label class="opt ${cls} ${locked ? 'locked' : ''}">
        <input type="radio" name="opt" value="${o.key}" ${o.key === ui.selected ? 'checked' : ''} ${locked ? 'disabled' : ''}>
        <span class="o-key">${o.key}</span><span>${GM.md(o.text)}</span></label>`;
    }).join('');

    let feedback = '';
    if (ui.lastResult === true) feedback = `<div class="feedback ok"><div class="f-ico">${GM.icon('check', 20, 3)}</div><div><strong>${GM.FEEDBACK.ok}</strong>${d.firstCorrect ? '+20 poin masuk ke skormu.' : ui.mode === 'practice' || d.firstCorrect === false ? 'Poin hanya diberikan untuk jawaban benar pada percobaan pertama, tetapi kamu kini memahami kasusnya.' : ''}</div></div>`;
    else if (ui.lastResult === false) feedback = `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 20, 3)}</div><div><strong>${GM.FEEDBACK.bad}</strong>Gunakan petunjuk, lalu tekan "Coba Lagi". Atau buka pembahasan untuk mempelajari jawabannya.</div></div>`;
    else if (reveal && d.revealed && !d.firstCorrect) feedback = `<div class="feedback info"><div class="f-ico">${GM.icon('eye', 18)}</div><div><strong>Pembahasan dibuka.</strong>Jawaban yang benar adalah ${m.answer}. Pelajari langkah-langkahnya di bawah.</div></div>`;
    else if (reveal && d.firstCorrect) feedback = `<div class="feedback ok"><div class="f-ico">${GM.icon('check', 20, 3)}</div><div><strong>Kasus terpecahkan pada percobaan pertama.</strong>+20 poin.</div></div>`;

    const hints = m.hints.slice(0, ui.hints).map((h, i) => `<div class="hint-box"><div class="hint-title">${GM.icon('bulb', 18)} Petunjuk ${i + 1}</div><div>${GM.md(h)}</div></div>`).join('');

    let explain = '';
    if (reveal) {
      const n = Math.min(ui.steps, m.steps.length);
      explain = `<div class="explain">
        <h3>${GM.icon('book', 20)} Pembahasan matematis</h3>
        <ol class="explain-steps">${m.steps.slice(0, n).map((s, i) => `<li><span class="es-n">${i + 1}</span><div class="es-body">${GM.md(s)}</div></li>`).join('')}</ol>
        ${n < m.steps.length ? `<div class="btn-row"><button class="btn btn-outline btn-sm" data-act="step">${GM.icon('down', 16)} Langkah berikutnya (${n}/${m.steps.length})</button><button class="btn btn-sm" style="background:transparent;color:var(--royal)" data-act="allsteps">Tampilkan semua</button></div>` : ''}
      </div>`;
    }

    const last = m.id === GM.MISSIONS.length;
    const allDone = GM.store.missionStats().allDone;
    let buttons = '';
    if (ui.mode === 'answer' || ui.mode === 'practice') {
      buttons = `<button class="btn btn-primary" data-act="check" ${ui.selected ? '' : 'disabled'}>${GM.icon('search', 18)} Periksa Jawaban</button>
        <button class="btn btn-outline" data-act="hint" ${ui.hints >= m.hints.length ? 'disabled' : ''}>${GM.icon('bulb', 18)} Minta Petunjuk${ui.hints ? ` (${ui.hints}/${m.hints.length})` : ''}</button>`;
    } else if (ui.mode === 'wrong') {
      buttons = `<button class="btn btn-primary" data-act="retry">${GM.icon('refresh', 18)} Coba Lagi</button>
        <button class="btn btn-outline" data-act="hint" ${ui.hints >= m.hints.length ? 'disabled' : ''}>${GM.icon('bulb', 18)} Minta Petunjuk</button>
        <button class="btn btn-outline" data-act="reveal">${GM.icon('eye', 18)} Lihat Pembahasan</button>`;
    } else {
      buttons = (last || allDone) && allDone
        ? `<a class="btn btn-mint" href="#/hasil">${GM.icon('trophy', 18)} Lihat Hasil Investigasi</a>`
        : '';
      if (!last) buttons += `<button class="btn btn-primary" data-act="next">Kasus Berikutnya ${GM.icon('right', 18)}</button>`;
      buttons += `<button class="btn btn-outline" data-act="retry">${GM.icon('refresh', 18)} Coba Lagi</button>`;
    }
    buttons += `<a class="btn btn-outline" href="#/materi/${m.topic.tab}" title="${m.topic.label}">${GM.icon('book', 18)} Kembali ke Materi</a>`;

    return `<article class="card case-card" aria-labelledby="case-title">
      <div class="case-head">
        <span class="case-no">KASUS #${String(m.id).padStart(2, '0')}</span>
        <h2 id="case-title">${m.title}</h2>
        ${ui.mode === 'practice' ? '<span class="chip chip-warn" style="margin-left:auto">Mode latihan (skor tidak berubah)</span>' : ''}
      </div>
      <div class="case-body">
        <div class="case-evidence">
          <div class="story">${GM.icon('hat', 18)} ${m.story}</div>
          <div class="figure grid-bg" id="case-fig"></div>
          <div class="figure-cap">Gambar digambar sesuai perbandingan ukuran sebenarnya. Posisi atau arah bangun bisa berbeda.</div>
          <h4 style="margin-top:14px">${GM.icon('clipboard', 18)} Berkas Bukti (diketahui)</h4>
          <ul class="evidence-list">${m.given.map((g) => `<li><span>${GM.md(g)}</span></li>`).join('')}</ul>
        </div>
        <div class="case-work">
          <div class="question">${GM.md(m.question)}</div>
          <div class="options" role="radiogroup" aria-label="Pilihan jawaban">${opts}</div>
          ${hints}
          ${feedback}
          <div class="btn-row">${buttons}</div>
          ${explain}
        </div>
      </div>
    </article>`;
  }

  function render(el, params) {
    const s = GM.store.get();
    let id = parseInt(params[0], 10);
    if (!id || !GM.store.isUnlocked(id) || id < 1 || id > GM.MISSIONS.length) {
      // Kasus pertama yang belum selesai, atau kasus terakhir.
      id = (GM.MISSIONS.find((m) => !(s.missions[m.id] && s.missions[m.id].done)) || GM.MISSIONS[GM.MISSIONS.length - 1]).id;
    }
    if (!ui || ui.id !== id) {
      const d = s.missions[id] || {};
      ui = { id, selected: d.done ? d.lastChoice || null : null, mode: d.done ? 'done' : 'answer', hints: 0, steps: d.done ? GM.MISSIONS[id - 1].steps.length : 1, lastResult: null };
    }
    GM.store.update((st) => { st.currentCase = id; });
    draw(el);
  }

  function draw(el) {
    const m = GM.MISSIONS[ui.id - 1];
    const st = GM.store.missionStats();
    const redraw = !!el.querySelector('#case-wrap');
    el.innerHTML = `<div class="container page ${redraw ? 'no-anim' : ''}">
      ${header()}
      ${st.allDone ? `<div class="callout mint" style="margin-bottom:16px"><div class="callout-title">${GM.icon('trophy', 18)} Semua kasus terpecahkan!</div><p>Kamu bisa meninjau ulang setiap kasus atau langsung <a href="#/hasil">melihat hasil investigasi</a>.</p></div>` : ''}
      <div id="case-wrap">${caseCard(m)}</div>
      <div class="btn-row" style="margin-top:16px;justify-content:space-between">
        <a class="btn btn-outline btn-sm" href="#/petunjuk">${GM.icon('help', 16)} Petunjuk permainan</a>
        <button class="btn btn-danger-soft btn-sm" data-act="resetall">${GM.icon('refresh', 16)} Ulangi Investigasi dari awal</button>
      </div>
    </div>`;
    GM.svg.mount(el.querySelector('#case-fig'), () => ({ shapes: m.figure(), opts: { label: 'Ilustrasi kasus ' + m.id, gap: 70 } }), { aspect: 0.62, maxWidth: 640 });
    bind(el, m);
  }

  function bind(el, m) {
    el.querySelectorAll('input[name="opt"]').forEach((r) => r.addEventListener('change', () => {
      ui.selected = r.value;
      ui.lastResult = null;
      el.querySelectorAll('.opt').forEach((o) => o.classList.toggle('selected', o.querySelector('input').checked));
      const btn = el.querySelector('[data-act="check"]');
      if (btn) btn.disabled = false;
      const fb = el.querySelector('.feedback');
      if (fb) fb.remove();
    }));
    el.querySelectorAll('[data-case]').forEach((b) => b.addEventListener('click', () => GM.go('#/misi/' + b.dataset.case)));
    el.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act, el, m)));
  }

  async function act(a, el, m) {
    const d = () => GM.store.get().missions[m.id] || {};
    if (a === 'check') {
      if (!ui.selected) return;
      const right = ui.selected === m.answer;
      if (ui.mode === 'practice') {
        ui.lastResult = right;
        ui.mode = right ? 'done' : 'wrong';
        if (right) ui.steps = m.steps.length;
      } else {
        GM.store.update((s) => {
          const r = s.missions[m.id] || (s.missions[m.id] = { attempts: 0, hints: 0 });
          r.attempts = (r.attempts || 0) + 1;
          if (r.firstCorrect === undefined) r.firstCorrect = right;
          r.lastChoice = ui.selected;
          if (right) r.done = true;
        });
        ui.lastResult = right;
        ui.mode = right ? 'done' : 'wrong';
        ui.steps = 1;
      }
    } else if (a === 'hint') {
      if (ui.hints < m.hints.length) {
        ui.hints++;
        GM.store.update((s) => { const r = s.missions[m.id] || (s.missions[m.id] = { attempts: 0, hints: 0 }); r.hints = (r.hints || 0) + 1; });
      }
    } else if (a === 'retry') {
      ui.mode = d().done ? 'practice' : 'answer';
      ui.selected = null;
      ui.lastResult = null;
    } else if (a === 'reveal') {
      GM.store.update((s) => {
        const r = s.missions[m.id] || (s.missions[m.id] = { attempts: 0, hints: 0 });
        r.done = true; r.revealed = true;
        if (r.firstCorrect === undefined) r.firstCorrect = false;
      });
      ui.mode = 'done';
      ui.lastResult = null;
      ui.steps = 1;
    } else if (a === 'step') {
      ui.steps++;
    } else if (a === 'allsteps') {
      ui.steps = m.steps.length;
    } else if (a === 'next') {
      ui = null;
      GM.go('#/misi/' + (m.id + 1));
      return;
    } else if (a === 'resetall') {
      const yes = await GM.confirm('Ulangi investigasi?', 'Skor, status kasus, dan badge misi akan dihapus. Progres materi dan evaluasi tetap tersimpan.', 'Ya, ulangi');
      if (!yes) return;
      GM.store.resetMissions();
      ui = null;
      GM.go('#/misi/1');
      return;
    }
    const y = window.scrollY;
    draw(el);
    window.scrollTo(0, y);
    if (a === 'check' || a === 'reveal' || a === 'step') {
      const target = el.querySelector(a === 'check' ? '.feedback' : '.explain-steps li:last-child');
      if (target && target.getBoundingClientRect().bottom > window.innerHeight) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  GM.MissionGame = { render, reset() { ui = null; } };
})();
