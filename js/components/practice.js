/* Latihan Seletak: generator soal acak untuk TP 5–8 (ATP 3 dan ATP 4).
   Siswa menentukan panjang sisi/besar sudut yang hilang pada dua bangun kongruen atau sebangun. */
(function () {
  const GM = window.GM;
  const geo = GM.geo;
  const f = GM.fmt;
  const ft = GM.fmtTex;

  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const TRIPLES = [[5, 6, 7], [4, 7, 9], [6, 8, 9], [5, 8, 10], [7, 8, 12], [6, 9, 11], [8, 10, 13], [4, 5, 7]];
  const PERM3 = [['P', 'Q', 'R'], ['P', 'R', 'Q'], ['Q', 'P', 'R'], ['Q', 'R', 'P'], ['R', 'P', 'Q'], ['R', 'Q', 'P']];
  function dihedral4() {
    const base = ['P', 'Q', 'R', 'S'];
    const out = [];
    for (let r = 0; r < 4; r++) {
      out.push(base.map((_, i) => base[(i + r) % 4]));
      out.push(base.map((_, i) => base[((r - i) % 4 + 4) % 4]));
    }
    return out;
  }
  const L3 = ['A', 'B', 'C'], L4 = ['A', 'B', 'C', 'D'];
  const sideName = (L, i) => L[i] + L[(i + 1) % L.length];
  const pairsText = (L1, L2) => L1.map((a, i) => `${a} \\leftrightarrow ${L2[i]}`).join(',\\ ');
  const shuffled = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const placeRandom = (pts) => geo.place(pts, rnd([0, 40, 90, 150, 200, 270]), Math.random() < 0.5);
  const blank = (n) => Array(n).fill('');

  /* ---------- Generator ---------- */
  function triCong() {
    const n2 = rnd(PERM3);
    const rel = '\\cong';
    const mode = rnd(['side', 'alg', 'angle']);
    if (mode === 'angle') {
      let A, B, C;
      do { A = rnd([40, 45, 50, 55, 60, 65]); B = rnd([50, 55, 60, 65, 70, 75, 80]); C = 180 - A - B; } while (A === B || C < 35 || C === A || C === B);
      const AB = ri(5, 9);
      const P = geo.triASA(A, AB, B);
      const ang = [A, B, C];
      const j = ri(0, 2);
      const sl2 = blank(3), al2 = blank(3); al2[j] = '?';
      return {
        shapes: [{ pts: P, labels: L3, sideLabels: [`${AB} cm`, '', ''], angleLabels: [`${A}°`, `${B}°`, ''] }, { pts: placeRandom(P), labels: n2, sideLabels: sl2, angleLabels: al2 }],
        given: [`$\\triangle ABC ${rel} \\triangle ${n2.join('')}$`, `$AB = ${AB}$ cm, $\\angle A = ${A}^\\circ$, $\\angle B = ${B}^\\circ$`],
        ask: `Tentukan besar $\\angle ${n2[j]}$.`, answer: ang[j], unit: '°',
        steps: [
          `Dari notasi: $${pairsText(L3, n2)}$.`,
          `$\\angle ${n2[j]}$ seletak dengan $\\angle ${L3[j]}$.`,
          j === 2 ? `$\\angle C = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ$.` : `$\\angle ${L3[j]} = ${ang[j]}^\\circ$ (diketahui).`,
          `Sudut seletak pada bangun kongruen sama besar: $\\angle ${n2[j]} = ${ang[j]}^\\circ$.`
        ]
      };
    }
    const s = shuffled(rnd(TRIPLES));
    const P = geo.triSSS(s[0], s[1], s[2]);
    const i = ri(0, 2);
    const ask = sideName(n2, i), known = sideName(L3, i);
    const sl2 = blank(3);
    const base = {
      given: [`$\\triangle ABC ${rel} \\triangle ${n2.join('')}$`, `$AB = ${s[0]}$ cm, $BC = ${s[1]}$ cm, $CA = ${s[2]}$ cm`],
      shapes: [{ pts: P, labels: L3, sideLabels: s.map((v) => `${v} cm`) }, { pts: placeRandom(P), labels: n2, sideLabels: sl2 }]
    };
    const stepPair = [`Dari notasi: $${pairsText(L3, n2)}$.`, `Sisi $${ask}$ seletak dengan sisi $${known}$, jadi $${ask} = ${known} = ${s[i]}$ cm.`];
    if (mode === 'side') {
      sl2[i] = '?';
      return Object.assign(base, { ask: `Tentukan panjang $${ask}$.`, answer: s[i], unit: 'cm', steps: stepPair });
    }
    const a = rnd([2, 3]);
    let x = ri(2, 4);
    let b = s[i] - a * x;
    if (b < -5) { x = 2; b = s[i] - a * x; }
    const expr = b === 0 ? `${a}x` : `${a}x ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
    sl2[i] = `(${expr.replace('-', '−')}) cm`;
    base.given.push(`$${ask} = (${expr})$ cm`);
    return Object.assign(base, {
      ask: 'Tentukan nilai $x$.', answer: x, unit: '',
      steps: stepPair.concat([`Persamaan: $${expr} = ${s[i]}$, sehingga $${a}x = ${s[i] - b}$ dan $x = ${x}$.`])
    });
  }

  function triSim() {
    const n2 = rnd(PERM3);
    const k = rnd([1.5, 2, 2.5, 3, 0.5]);
    if (Math.random() < 0.3) {
      let A, B, C;
      do { A = rnd([35, 40, 45, 50, 55, 60]); B = rnd([50, 60, 65, 70, 75, 80]); C = 180 - A - B; } while (A === B || C < 35 || C === A || C === B);
      const P = geo.triASA(A, 6, B);
      const ang = [A, B, C];
      const j = ri(1, 2);
      const al2 = blank(3); al2[j] = '?';
      return {
        shapes: [{ pts: P, labels: L3, sideLabels: ['6 cm', '', ''], angleLabels: [`${A}°`, `${B}°`, ''] }, { pts: placeRandom(geo.scale(P, k)), labels: n2, sideLabels: [`${f(6 * k, 2)} cm`, '', ''], angleLabels: al2 }],
        given: [`$\\triangle ABC \\sim \\triangle ${n2.join('')}$`, `$AB = 6$ cm, $\\angle A = ${A}^\\circ$, $\\angle B = ${B}^\\circ$`, `$${sideName(n2, 0)} = ${ft(6 * k)}$ cm`],
        ask: `Tentukan besar $\\angle ${n2[j]}$.`, answer: ang[j], unit: '°',
        steps: [
          `Dari notasi: $${pairsText(L3, n2)}$, jadi $\\angle ${n2[j]}$ seletak dengan $\\angle ${L3[j]}$.`,
          j === 2 ? `$\\angle C = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ$.` : `$\\angle B = ${B}^\\circ$ (diketahui).`,
          `Pada bangun sebangun, sudut seletak <b>sama besar</b> (tidak dikalikan $k$): $\\angle ${n2[j]} = ${ang[j]}^\\circ$.`
        ]
      };
    }
    const s = shuffled(rnd(TRIPLES));
    const P = geo.triSSS(s[0], s[1], s[2]);
    const i0 = ri(0, 2);
    let i1 = ri(0, 2); while (i1 === i0) i1 = ri(0, 2);
    const sl2 = blank(3);
    sl2[i0] = `${f(k * s[i0], 2)} cm`; sl2[i1] = '?';
    const g = sideName(n2, i0), a = sideName(n2, i1);
    return {
      shapes: [{ pts: P, labels: L3, sideLabels: s.map((v) => `${v} cm`) }, { pts: placeRandom(geo.scale(P, k)), labels: n2, sideLabels: sl2 }],
      given: [`$\\triangle ABC \\sim \\triangle ${n2.join('')}$`, `$AB = ${s[0]}$ cm, $BC = ${s[1]}$ cm, $CA = ${s[2]}$ cm`, `$${g} = ${ft(k * s[i0], 2)}$ cm`],
      ask: `Tentukan panjang $${a}$.`, answer: k * s[i1], unit: 'cm',
      steps: [
        `Dari notasi: $${pairsText(L3, n2)}$. Jadi $${g} \\leftrightarrow ${sideName(L3, i0)}$ dan $${a} \\leftrightarrow ${sideName(L3, i1)}$.`,
        `Faktor skala: $k = \\frac{${g}}{${sideName(L3, i0)}} = \\frac{${ft(k * s[i0], 2)}}{${s[i0]}} = ${ft(k, 2)}$.`,
        `Perbandingan senilai: $\\frac{${a}}{${s[i1]}} = ${ft(k, 2)}$, sehingga $${a} = ${ft(k, 2)} \\times ${s[i1]} = ${ft(k * s[i1], 2)}$ cm.`
      ]
    };
  }

  function quadBase() {
    const type = rnd(['jajargenjang', 'layanglayang', 'persegipanjang', 'trapesium']);
    if (type === 'jajargenjang') {
      const a = ri(5, 8), b = ri(3, a - 1), t = rnd([55, 60, 65, 70, 75, 80]);
      return { type, name: 'jajargenjang', pts: geo.quad(type, { a, b, t }), sides: [a, b, a, b], angles: [t, 180 - t, t, 180 - t], knownS: [0, 1], knownA: [0], prop: ['sisi yang berhadapan sama panjang', 'sudut yang berhadapan sama besar dan sudut yang berdekatan berjumlah $180^\\circ$'] };
    }
    if (type === 'layanglayang') {
      const p = ri(3, 5), q = ri(p + 2, 8), t = rnd([60, 70, 80, 90, 100]);
      return { type, name: 'layang-layang', pts: geo.quad(type, { p, q, t }), sides: [p, q, q, p], angles: null, knownS: [0, 1], knownA: [], prop: ['dua pasang sisi yang berdekatan sama panjang', ''] };
    }
    if (type === 'persegipanjang') {
      const p = ri(5, 9), l = ri(2, p - 1);
      return { type, name: 'persegi panjang', pts: geo.quad(type, { p, l }), sides: [p, l, p, l], angles: [90, 90, 90, 90], knownS: [0, 1], knownA: [], prop: ['sisi yang berhadapan sama panjang', 'semua sudutnya $90^\\circ$'] };
    }
    const T = rnd([{ a: 10, b: 4, h: 4, x: 3, s: [10, 5, 4, 5] }, { a: 8, b: 4, h: 3, x: 0, s: [8, 5, 4, 3] }, { a: 12, b: 6, h: 4, x: 3, s: [12, 5, 6, 5] }]);
    return { type, name: 'trapesium', pts: geo.quad(type, T), sides: T.s, angles: null, knownS: [0, 1, 2, 3], knownA: [], prop: ['', ''] };
  }

  function quadProblem(similar) {
    const Q = quadBase();
    const n2 = rnd(dihedral4());
    const k = similar ? rnd([1.5, 2, 2.5, 0.5]) : 1;
    const rel = similar ? '\\sim' : '\\cong';
    const sl1 = blank(4), al1 = blank(4);
    Q.knownS.forEach((i) => (sl1[i] = `${Q.sides[i]} cm`));
    Q.knownA.forEach((i) => (al1[i] = `${Q.angles[i]}°`));
    const sl2 = blank(4), al2 = blank(4);
    const head = `${Q.name[0].toUpperCase()}${Q.name.slice(1)} $ABCD ${rel}$ ${Q.name} $${n2.join('')}$`;
    const givenFirst = Q.knownS.map((i) => `$${sideName(L4, i)} = ${Q.sides[i]}$ cm`).concat(Q.knownA.map((i) => `$\\angle ${L4[i]} = ${Q.angles[i]}^\\circ$`)).join(', ');
    const given = [head, givenFirst];
    const steps = [`Dari notasi: $${pairsText(L4, n2)}$.`];
    let i0 = 0;
    if (similar) {
      i0 = Q.knownS[0];
      sl2[i0] = `${f(k * Q.sides[i0], 2)} cm`;
      given.push(`$${sideName(n2, i0)} = ${ft(k * Q.sides[i0], 2)}$ cm`);
      steps.push(`Faktor skala: $k = \\frac{${sideName(n2, i0)}}{${sideName(L4, i0)}} = \\frac{${ft(k * Q.sides[i0], 2)}}{${Q.sides[i0]}} = ${ft(k, 2)}$.`);
    }
    const askAngle = Q.angles && Math.random() < 0.4;
    if (askAngle) {
      const j = rnd([1, 2, 3]);
      al2[j] = '?';
      const aj = Q.angles[j];
      steps.push(`$\\angle ${n2[j]}$ seletak dengan $\\angle ${L4[j]}$. Sifat ${Q.name}: ${Q.prop[1]}. Jadi $\\angle ${L4[j]} = ${aj}^\\circ$.`);
      steps.push(similar ? `Sudut seletak pada bangun sebangun sama besar (tidak dikalikan $k$): $\\angle ${n2[j]} = ${aj}^\\circ$.` : `Sudut seletak sama besar: $\\angle ${n2[j]} = ${aj}^\\circ$.`);
      return { shapes: [{ pts: Q.pts, labels: L4, sideLabels: sl1, angleLabels: al1 }, { pts: placeRandom(geo.scale(Q.pts, k)), labels: n2, sideLabels: sl2, angleLabels: al2 }], given, ask: `Tentukan besar $\\angle ${n2[j]}$.`, answer: aj, unit: '°', steps };
    }
    const cand = [0, 1, 2, 3].filter((i) => i !== i0 && (Q.type === 'trapesium' || !Q.knownS.includes(i) || similar));
    const i = rnd(cand);
    sl2[i] = '?';
    const si = Q.sides[i];
    const known = Q.knownS.includes(i);
    steps.push(`Sisi $${sideName(n2, i)}$ seletak dengan sisi $${sideName(L4, i)}$.` + (known ? ` $${sideName(L4, i)} = ${si}$ cm (diketahui).` : ` Sifat ${Q.name}: ${Q.prop[0]}, sehingga $${sideName(L4, i)} = ${si}$ cm.`));
    steps.push(similar ? `$${sideName(n2, i)} = k \\times ${sideName(L4, i)} = ${ft(k, 2)} \\times ${si} = ${ft(k * si, 2)}$ cm.` : `Sisi seletak sama panjang: $${sideName(n2, i)} = ${si}$ cm.`);
    return { shapes: [{ pts: Q.pts, labels: L4, sideLabels: sl1, angleLabels: al1 }, { pts: placeRandom(geo.scale(Q.pts, k)), labels: n2, sideLabels: sl2, angleLabels: al2 }], given, ask: `Tentukan panjang $${sideName(n2, i)}$.`, answer: k * si, unit: 'cm', steps };
  }

  const GEN = {
    5: triCong,
    6: () => quadProblem(false),
    7: triSim,
    8: () => quadProblem(true)
  };

  /* ---------- Komponen ---------- */
  function mount(el, tp) {
    let prob = null, solved = false, shown = 0;
    el.innerHTML = `<div class="practice">
      <div class="btn-row" style="justify-content:space-between;margin-bottom:10px">
        ${GM.colorToggle()}
        <span class="chip chip-mint" data-p="count"></span>
      </div>
      <div class="tool-grid">
        <div><div class="figure grid-bg" data-p="fig"></div><div class="figure-cap">Gambar mengikuti ukuran sebenarnya; posisi bangun kedua diputar atau dicerminkan secara acak.</div></div>
        <div>
          <ul class="evidence-list" data-p="given"></ul>
          <p class="question" style="margin-top:12px" data-p="ask"></p>
          <div class="input-row"><input type="text" inputmode="decimal" data-p="inp" aria-label="Jawaban" placeholder="Jawaban" style="max-width:160px"><span class="muted" data-p="unit"></span>
            <button class="btn btn-primary btn-sm" data-p="check">${GM.icon('search', 16)} Periksa</button></div>
          <div data-p="fb"></div>
          <div class="btn-row" style="margin-top:10px">
            <button class="btn btn-outline btn-sm" data-p="step">${GM.icon('down', 16)} Langkah penyelesaian</button>
            <button class="btn btn-mint btn-sm" data-p="new">${GM.icon('shuffle', 16)} Soal baru</button>
          </div>
          <ol class="explain-steps" data-p="steps" style="margin-top:10px"></ol>
        </div>
      </div></div>`;
    const $ = (k) => el.querySelector(`[data-p="${k}"]`);
    const count = () => { $('count').innerHTML = `${GM.icon('check', 14)} Benar: ${(GM.store.get().practice || {})[tp] || 0} soal`; };
    let draw = null;
    function load() {
      prob = GEN[tp]();
      solved = false; shown = 0;
      el.querySelector('.figure').innerHTML = '';
      draw = GM.svg.mount($('fig'), () => ({
        shapes: prob.shapes.map((s, i) => Object.assign({ color: i ? 'b' : 'a' }, s)),
        opts: { pairs: true, label: 'Dua bangun pada soal latihan' }
      }), { aspect: 0.6, maxWidth: 640 });
      $('given').innerHTML = prob.given.map((g) => `<li><span>${GM.md(g)}</span></li>`).join('');
      $('ask').innerHTML = GM.md(prob.ask);
      $('unit').textContent = prob.unit;
      $('inp').value = '';
      $('fb').innerHTML = '';
      $('steps').innerHTML = '';
      $('step').disabled = false;
      count();
    }
    function check() {
      const v = GM.parseNum($('inp').value);
      if (isNaN(v)) { $('fb').innerHTML = `<div class="feedback info"><div class="f-ico">${GM.icon('bulb', 18)}</div><div>Tuliskan jawaban berupa angka, misalnya 12 atau 7,5.</div></div>`; return; }
      const ok = Math.abs(v - prob.answer) < 0.01;
      $('fb').innerHTML = ok
        ? `<div class="feedback ok"><div class="f-ico">${GM.icon('check', 18, 3)}</div><div><strong>Benar!</strong>Kamu menemukan pasangan seletak dengan tepat.</div></div>`
        : `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div><strong>Belum tepat.</strong>Cocokkan urutan huruf pada notasi untuk menemukan unsur yang seletak${GM.colorHelp() ? ', lalu perhatikan warnanya' : ''}.</div></div>`;
      if (ok && !solved) {
        solved = true;
        GM.store.update((s) => { s.practice = s.practice || {}; s.practice[tp] = (s.practice[tp] || 0) + 1; });
        count();
      }
    }
    $('check').addEventListener('click', check);
    $('inp').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    $('new').addEventListener('click', load);
    $('step').addEventListener('click', () => {
      shown++;
      $('steps').innerHTML = prob.steps.slice(0, shown).map((s, i) => `<li><span class="es-n">${i + 1}</span><div class="es-body">${GM.md(s)}</div></li>`).join('');
      if (shown >= prob.steps.length) $('step').disabled = true;
    });
    load();
  }

  GM.Practice = { mount, GEN };
})();
