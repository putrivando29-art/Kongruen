/* Halaman Laboratorium Geometri: 3 alat interaktif */
(function () {
  const GM = window.GM;
  const geo = GM.geo;
  const T = GM.tex;
  const f = GM.fmt;

  const TOOLS = [
    { id: 'kongruensi', title: 'Deteksi Kongruensi', icon: 'search', desc: 'Geser titik, putar, cerminkan, dan ubah ukuran dua segitiga.' },
    { id: 'kesebangunan', title: 'Deteksi Kesebangunan', icon: 'scale', desc: 'Ubah faktor skala 0,5 sampai 3 dan amati perbandingan sisi.' },
    { id: 'segiempat', title: 'Perbandingan Segiempat', icon: 'square', desc: 'Bandingkan dua segiempat berdasarkan sisi dan sudut.' }
  ];

  const TOL = { side: 0.05, angle: 0.5, ratio: 0.01 };
  const ic = (b) => (b ? `<span style="color:var(--ok)">${GM.icon('check', 16, 3)}</span>` : `<span style="color:var(--bad)">${GM.icon('x', 16, 3)}</span>`);

  function statusBox(kind, title, sub) {
    const ico = kind === 'congruent' ? GM.icon('check', 22, 3) : kind === 'similar' ? GM.icon('scale', 22) : GM.icon('x', 22, 3);
    return `<div class="status ${kind}"><div class="s-ico">${ico}</div><div>${title}<small>${sub}</small></div></div>`;
  }

  // Analisis dua segitiga dengan korespondensi tetap A↔D, B↔E, C↔F.
  function analyzeTri(P, Q) {
    const s1 = geo.sides(P), s2 = geo.sides(Q), a1 = geo.angles(P), a2 = geo.angles(Q);
    const ratios = s2.map((v, i) => v / s1[i]);
    const sidesEq = s1.map((v, i) => Math.abs(v - s2[i]) < TOL.side);
    const angEq = a1.map((v, i) => Math.abs(v - a2[i]) < TOL.angle);
    const mean = ratios.reduce((a, b) => a + b, 0) / 3;
    const ratioEq = (Math.max(...ratios) - Math.min(...ratios)) / mean < TOL.ratio;
    const allAng = angEq.every(Boolean);
    const congruent = sidesEq.every(Boolean) && allAng;
    const similar = ratioEq && allAng;
    return { s1, s2, a1, a2, ratios, sidesEq, angEq, ratioEq, allAng, congruent, similar, k: mean };
  }

  /* ================= ALAT 1: DETEKSI KONGRUENSI ================= */
  function toolKongruensi() {
    return `
    <div class="card">
      <div class="panel-title">${GM.icon('search', 20)} Deteksi Kongruensi: ${T('\\triangle ABC')} dan ${T('\\triangle DEF')}</div>
      <p class="muted small">Seret titik bulat untuk mengubah bentuk, seret bagian dalam segitiga untuk memindahkannya. Pasangan bersesuaian: ${T('A \\leftrightarrow D')}, ${T('B \\leftrightarrow E')}, ${T('C \\leftrightarrow F')}.</p>
      <div class="tool-grid">
        <div>
          <div class="figure grid-bg" id="k-fig"></div>
          <div class="card" style="box-shadow:none;margin-top:12px;padding:14px">
            <div class="btn-row" style="justify-content:space-between">
              <div class="seg" role="group" aria-label="Pilih segitiga">
                <button class="active" data-sel="0">Ubah △ABC</button>
                <button data-sel="1">Ubah △DEF</button>
              </div>
              <div class="btn-row">
                <button class="btn btn-outline btn-sm" data-op="rotl" title="Putar 15° berlawanan jarum jam">${GM.icon('rotl', 16)} 15°</button>
                <button class="btn btn-outline btn-sm" data-op="rotr" title="Putar 15° searah jarum jam">${GM.icon('rotr', 16)} 15°</button>
                <button class="btn btn-outline btn-sm" data-op="flip">${GM.icon('mirror', 16)} Cermin</button>
                <button class="btn btn-outline btn-sm" data-op="up">${GM.icon('plus', 16)} ×1,25</button>
                <button class="btn btn-outline btn-sm" data-op="down">${GM.icon('minus', 16)} ×0,8</button>
              </div>
            </div>
            <hr class="divider" style="margin:12px 0">
            <div class="c-label" style="font-weight:700;margin-bottom:6px" id="k-form-title">Atur ukuran △ABC (dua sisi dan sudut apit)</div>
            <div class="grid grid-3" style="gap:10px">
              <div class="control" style="margin:0"><label for="k-s1" id="k-l1">AB (cm)</label><input type="text" inputmode="decimal" id="k-s1"></div>
              <div class="control" style="margin:0"><label for="k-s2" id="k-l2">AC (cm)</label><input type="text" inputmode="decimal" id="k-s2"></div>
              <div class="control" style="margin:0"><label for="k-a" id="k-l3">∠A (°)</label><input type="text" inputmode="decimal" id="k-a"></div>
            </div>
            <div class="btn-row" style="margin-top:10px">
              <button class="btn btn-primary btn-sm" id="k-apply">${GM.icon('check', 16)} Terapkan ukuran</button>
              <span class="small muted" id="k-msg"></span>
            </div>
          </div>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn btn-mint btn-sm" data-preset="copy">${GM.icon('copy', 16)} Salin △ABC ke △DEF</button>
            <button class="btn btn-outline btn-sm" data-preset="similar">${GM.icon('scale', 16)} Jadikan sebangun (k = 1,5)</button>
            <button class="btn btn-outline btn-sm" data-preset="random">${GM.icon('shuffle', 16)} Acak △DEF</button>
            <button class="btn btn-danger-soft btn-sm" data-preset="reset">${GM.icon('refresh', 16)} Ulang</button>
          </div>
        </div>
        <div>
          <div id="k-status"></div>
          <div class="table-wrap" style="margin-top:12px"><table class="data compact mono" id="k-sides"></table></div>
          <div class="table-wrap" style="margin-top:10px"><table class="data compact mono" id="k-angles"></table></div>
          <div id="k-k" style="margin-top:6px"></div>
          <h4 style="margin-top:14px">${GM.icon('target', 18)} Tantangan laboratorium</h4>
          <ul class="check-list" id="k-ch"></ul>
        </div>
      </div>
    </div>`;
  }

  function initKongruensi(root) {
    const WORLD = [26, 12];
    const initA = () => geo.translate(geo.triSAS(6, 5, 60), 1.5, 1.5);
    const initB = () => geo.translate(geo.rotate(geo.triSAS(5, 4.5, 75), 25, [0, 0]), 16, 2);
    let tris = [initA(), initB()];
    let sel = 0, lay = null, drag = null;
    const box = root.querySelector('#k-fig');
    const names = [['A', 'B', 'C'], ['D', 'E', 'F']];

    const draw = GM.svg.mount(box, (W) => ({
      shapes: [
        { pts: tris[0], labels: names[0], color: 'a', sideLabels: true, angleLabels: true, handles: true, draggable: true },
        { pts: tris[1], labels: names[1], color: 'b', sideLabels: true, angleLabels: true, handles: true, draggable: true }
      ],
      opts: { fixed: { scale: W / (WORLD[0] + 2), origin: [-1, -1] }, label: 'Segitiga ABC dan DEF yang dapat digeser' }
    }), { height: (W) => Math.round((W * (WORLD[1] + 2)) / (WORLD[0] + 2)), maxWidth: 1000, after: (r) => { lay = r.lay; } });

    const valid = (P) => geo.sides(P).every((s) => s >= 0.3) && geo.area(P) >= 0.15;
    const inside = (P) => {
      const b = geo.bbox(P);
      let dx = 0, dy = 0;
      if (b.minX < 0.2) dx = 0.2 - b.minX; if (b.maxX > WORLD[0] - 0.2) dx = WORLD[0] - 0.2 - b.maxX;
      if (b.minY < 0.2) dy = 0.2 - b.minY; if (b.maxY > WORLD[1] - 0.2) dy = WORLD[1] - 0.2 - b.maxY;
      return geo.translate(P, dx, dy);
    };
    const fits = (P) => { const b = geo.bbox(P); return b.w <= WORLD[0] - 0.4 && b.h <= WORLD[1] - 0.4; };

    function fillForm() {
      const P = tris[sel];
      const n = names[sel];
      root.querySelector('#k-form-title').textContent = `Atur ukuran △${n.join('')} (dua sisi dan sudut apit)`;
      root.querySelector('#k-l1').textContent = `${n[0]}${n[1]} (cm)`;
      root.querySelector('#k-l2').textContent = `${n[0]}${n[2]} (cm)`;
      root.querySelector('#k-l3').textContent = `∠${n[0]} (°)`;
      root.querySelector('#k-s1').value = f(geo.dist(P[0], P[1]), 2);
      root.querySelector('#k-s2').value = f(geo.dist(P[0], P[2]), 2);
      root.querySelector('#k-a').value = f(geo.angles(P)[0], 1);
    }

    function update(fromForm) {
      draw();
      const r = analyzeTri(tris[0], tris[1]);
      const sn = [['AB', 'DE'], ['BC', 'EF'], ['CA', 'FD']];
      root.querySelector('#k-sides').innerHTML = `<tr><th>Sisi △ABC</th><th>Sisi △DEF</th><th>Sama?</th><th>Rasio</th></tr>` +
        sn.map((n, i) => `<tr><td>${n[0]} = ${f(r.s1[i], 2)}</td><td>${n[1]} = ${f(r.s2[i], 2)}</td><td>${ic(r.sidesEq[i])}</td><td>${n[1]}/${n[0]} = ${f(r.ratios[i], 2)}</td></tr>`).join('');
      const an = [['∠A', '∠D'], ['∠B', '∠E'], ['∠C', '∠F']];
      root.querySelector('#k-angles').innerHTML = `<tr><th>Sudut △ABC</th><th>Sudut △DEF</th><th>Sama?</th></tr>` +
        an.map((n, i) => `<tr><td>${n[0]} = ${f(r.a1[i], 1)}°</td><td>${n[1]} = ${f(r.a2[i], 1)}°</td><td>${ic(r.angEq[i])}</td></tr>`).join('');
      root.querySelector('#k-k').innerHTML = r.ratioEq
        ? GM.formula(`k = \\frac{DE}{AB} = \\frac{EF}{BC} = \\frac{FD}{CA} \\approx ${GM.fmtTex(r.k, 2)}`)
        : `<p class="small muted">Faktor skala: rasio sisi tidak sama (${r.ratios.map((x) => f(x, 2)).join('; ')}), jadi tidak ada satu faktor skala.</p>`;
      let st;
      if (r.congruent) st = statusBox('congruent', 'KONGRUEN', 'Semua sisi dan sudut bersesuaian sama: △ABC ≅ △DEF (k = 1).');
      else if (r.similar) st = statusBox('similar', 'SEBANGUN, TIDAK KONGRUEN', `Sudut sama, sisi sebanding dengan k ≈ ${f(r.k, 2)}.`);
      else st = statusBox('none', 'TIDAK KONGRUEN & TIDAK SEBANGUN', r.allAng ? 'Sudut sama tetapi rasio sisi berbeda.' : 'Ada sudut bersesuaian yang berbeda, jadi juga tidak sebangun.');
      root.querySelector('#k-status').innerHTML = st;

      const lab = GM.store.get().lab;
      const reached = { congruent: r.congruent, similar: r.similar && !r.congruent, none: !r.similar };
      const newly = Object.keys(reached).filter((key) => reached[key] && !lab['k_' + key]);
      if (newly.length) GM.store.update((s) => newly.forEach((key) => (s.lab['k_' + key] = true)));
      const L = GM.store.get().lab;
      const ch = [['congruent', 'Buat △DEF kongruen dengan △ABC'], ['similar', 'Buat △DEF sebangun tetapi tidak kongruen'], ['none', 'Buat △DEF yang tidak sebangun dengan △ABC']];
      root.querySelector('#k-ch').innerHTML = ch.map(([key, t]) => `<li class="${L['k_' + key] ? 'ok' : ''}"><span class="ci">${GM.icon('check', 14, 3)}</span>${t}</li>`).join('');
      if (!fromForm) fillForm();
    }

    root.querySelectorAll('[data-sel]').forEach((b) => b.addEventListener('click', () => {
      sel = +b.dataset.sel;
      root.querySelectorAll('[data-sel]').forEach((x) => x.classList.toggle('active', x === b));
      fillForm();
    }));
    root.querySelectorAll('[data-op]').forEach((b) => b.addEventListener('click', () => {
      const P = tris[sel];
      let Q = P;
      const op = b.dataset.op;
      if (op === 'rotl') Q = geo.rotate(P, 15);
      if (op === 'rotr') Q = geo.rotate(P, -15);
      if (op === 'flip') Q = geo.reflectV(P);
      if (op === 'up') Q = geo.scale(P, 1.25);
      if (op === 'down') Q = geo.scale(P, 0.8);
      if (!fits(Q)) { root.querySelector('#k-msg').textContent = 'Terlalu besar untuk area kerja.'; return; }
      if (!valid(Q)) { root.querySelector('#k-msg').textContent = 'Terlalu kecil.'; return; }
      root.querySelector('#k-msg').textContent = '';
      tris[sel] = inside(Q);
      update();
    }));
    root.querySelector('#k-apply').addEventListener('click', () => {
      const s1 = GM.parseNum(root.querySelector('#k-s1').value), s2 = GM.parseNum(root.querySelector('#k-s2').value), a = GM.parseNum(root.querySelector('#k-a').value);
      const msg = root.querySelector('#k-msg');
      if (!(s1 >= 0.5 && s1 <= 12 && s2 >= 0.5 && s2 <= 12)) { msg.textContent = 'Panjang sisi harus antara 0,5 dan 12 cm.'; return; }
      if (!(a >= 5 && a <= 170)) { msg.textContent = 'Sudut harus antara 5° dan 170°.'; return; }
      const P = tris[sel];
      const dir = Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0]) / geo.D2R;
      // Pertahankan orientasi (searah/berlawanan jarum jam) segitiga saat ini.
      const cross = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[1][1] - P[0][1]) * (P[2][0] - P[0][0]);
      let Q = geo.triSAS(s1, s2, a);
      if (cross < 0) Q = Q.map(([x, y]) => [x, -y]);
      Q = geo.translate(geo.rotate(Q, dir, [0, 0]), P[0][0], P[0][1]);
      if (!fits(Q)) { msg.textContent = 'Segitiga terlalu besar untuk area kerja.'; return; }
      msg.textContent = 'Ukuran diterapkan.';
      tris[sel] = inside(Q);
      update(true);
    });
    root.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      const p = b.dataset.preset;
      if (p === 'copy') tris[1] = inside(geo.translate(geo.rotate(tris[0], -40), 13, 0));
      if (p === 'similar') {
        const Q = geo.scale(tris[0], 1.5);
        if (!fits(Q)) { root.querySelector('#k-msg').textContent = '△ABC terlalu besar untuk diperbesar 1,5 kali. Perkecil dulu.'; return; }
        const b = geo.bbox(Q);
        tris[1] = inside(geo.translate(Q, WORLD[0] - 0.5 - b.maxX, 0));
      }
      if (p === 'random') {
        const r = (a, b) => Math.round((a + Math.random() * (b - a)) * 2) / 2;
        tris[1] = inside(geo.translate(geo.rotate(geo.triSAS(r(3, 7), r(3, 7), r(35, 110)), r(-60, 60), [0, 0]), 16, 3));
      }
      if (p === 'reset') { tris = [initA(), initB()]; }
      update();
    }));

    // Seret titik sudut atau seluruh segitiga (langkah 0,1 cm)
    const snap = (v) => Math.round(v * 10) / 10;
    box.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('[data-drag]');
      if (!t || !lay) return;
      const [x, y] = GM.svg.pointer(box.querySelector('svg'), e);
      const s = +t.dataset.shape;
      drag = { s, v: t.dataset.drag === 'v' ? +t.dataset.v : -1, w0: lay.toWorld(x, y), p0: tris[s].map((p) => p.slice()) };
      if (sel !== s) root.querySelector(`[data-sel="${s}"]`).click();
      box.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    box.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const [x, y] = GM.svg.pointer(box.querySelector('svg'), e);
      const w = lay.toWorld(x, y);
      let Q;
      if (drag.v >= 0) {
        Q = drag.p0.map((p) => p.slice());
        Q[drag.v] = [GM.clamp(snap(w[0]), 0.2, WORLD[0] - 0.2), GM.clamp(snap(w[1]), 0.2, WORLD[1] - 0.2)];
        if (!valid(Q)) return;
      } else {
        Q = inside(geo.translate(drag.p0, snap(w[0] - drag.w0[0]), snap(w[1] - drag.w0[1])));
      }
      tris[drag.s] = Q;
      update();
    });
    const end = () => { drag = null; };
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    update();
  }

  /* ================= ALAT 2: DETEKSI KESEBANGUNAN ================= */
  function toolKesebangunan() {
    const sl = (id, label, min, max, step, val, unit) => `<div class="control"><label for="${id}"><span>${label}</span><output id="${id}-o"></output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" data-unit="${unit}"></div>`;
    return `
    <div class="card">
      <div class="panel-title">${GM.icon('scale', 20)} Deteksi Kesebangunan dengan Faktor Skala</div>
      <p class="muted small">${T('\\triangle DEF')} dibuat dari ${T('\\triangle ABC')} dengan faktor skala ${T('k')}. Geser slider dan amati label panjang sisi, perbandingan, serta status yang diperbarui otomatis.</p>
      <div class="tool-grid">
        <div>
          <div class="figure grid-bg" id="s-fig"></div>
          <div class="grid grid-2" style="margin-top:12px">
            <div class="card" style="box-shadow:none;padding:14px">
              <div class="panel-title">Segitiga pertama △ABC</div>
              ${sl('s-ab', 'Sisi AB', 2, 8, 0.5, 4, ' cm')}
              ${sl('s-ac', 'Sisi AC', 2, 8, 0.5, 3, ' cm')}
              ${sl('s-a', 'Sudut A', 30, 120, 5, 90, '°')}
            </div>
            <div class="card" style="box-shadow:none;padding:14px">
              <div class="panel-title">Segitiga kedua △DEF</div>
              ${sl('s-k', 'Faktor skala k', 0.5, 3, 0.1, 1.5, '')}
              ${sl('s-d', 'Uji coba: ubah ∠D sebesar', -30, 30, 5, 0, '°')}
              <p class="small muted" style="margin:0">Biarkan 0° agar ${T('\\triangle DEF')} tepat hasil perkalian skala. Ubah untuk melihat kasus tidak sebangun.</p>
            </div>
          </div>
        </div>
        <div>
          <div id="s-status"></div>
          <div class="formula" id="s-k-formula"></div>
          <div class="table-wrap"><table class="data compact mono" id="s-table"></table></div>
          <div id="s-extra" style="margin-top:10px"></div>
        </div>
      </div>
    </div>`;
  }

  function initKesebangunan(root) {
    const $ = (id) => root.querySelector('#' + id);
    const ids = ['s-ab', 's-ac', 's-a', 's-k', 's-d'];
    let P = [], Q = [];
    function compute() {
      const ab = +$('s-ab').value, ac = +$('s-ac').value, a = +$('s-a').value, k = +$('s-k').value, d = +$('s-d').value;
      P = geo.triSAS(ab, ac, a);
      Q = geo.triSAS(ab * k, ac * k, GM.clamp(a + d, 10, 165));
      return { k, d };
    }
    compute();
    const draw = GM.svg.mount($('s-fig'), () => ({
      shapes: [
        { pts: P, labels: ['A', 'B', 'C'], color: 'a', sideLabels: true, angleLabels: true, title: '△ABC' },
        { pts: Q, labels: ['D', 'E', 'F'], color: 'b', sideLabels: true, angleLabels: true, title: '△DEF' }
      ],
      opts: { label: 'Segitiga ABC dan hasil skalanya DEF' }
    }), { aspect: 0.55, maxWidth: 900 });

    function update() {
      ids.forEach((id) => { const el = $(id); $(id + '-o').textContent = (id === 's-d' && +el.value > 0 ? '+' : '') + f(+el.value, 1) + el.dataset.unit; });
      const { k } = compute();
      draw();
      const r = analyzeTri(P, Q);
      const sn = [['AB', 'DE'], ['BC', 'EF'], ['CA', 'FD']];
      $('s-table').innerHTML = `<tr><th>Pasangan</th><th>△ABC</th><th>△DEF</th><th>Rasio</th></tr>` +
        sn.map((n, i) => `<tr><td>${n[0]} ↔ ${n[1]}</td><td>${f(r.s1[i], 2)} cm</td><td>${f(r.s2[i], 2)} cm</td><td>${f(r.ratios[i], 2)}</td></tr>`).join('') +
        [['∠A', '∠D'], ['∠B', '∠E'], ['∠C', '∠F']].map((n, i) => `<tr><td>${n[0]} ↔ ${n[1]}</td><td>${f(r.a1[i], 1)}°</td><td>${f(r.a2[i], 1)}°</td><td>${ic(r.angEq[i])}</td></tr>`).join('');
      $('s-k-formula').innerHTML = GM.tex(`k = \\frac{\\text{sisi kedua}}{\\text{sisi pertama}} = \\frac{DE}{AB} = \\frac{${GM.fmtTex(r.s2[0], 2)}}{${GM.fmtTex(r.s1[0], 2)}} = ${GM.fmtTex(r.ratios[0], 2)}`, true) +
        GM.tex(`\\frac{EF}{BC} = ${GM.fmtTex(r.ratios[1], 2)}, \\quad \\frac{FD}{CA} = ${GM.fmtTex(r.ratios[2], 2)}`, true);
      if (r.congruent) $('s-status').innerHTML = statusBox('congruent', 'KONGRUEN', 'Seluruh sisi dan sudut bersesuaian sama (k = 1).');
      else if (r.similar) $('s-status').innerHTML = statusBox('similar', 'SEBANGUN', `Sudut bersesuaian sama besar dan semua rasio sisi = ${f(r.k, 2)}.`);
      else $('s-status').innerHTML = statusBox('none', 'TIDAK SEBANGUN', 'Rasio sisi tidak sama dan ada sudut bersesuaian yang berbeda.');
      const K1 = geo.perimeter(P), K2 = geo.perimeter(Q), L1 = geo.area(P), L2 = geo.area(Q);
      $('s-extra').innerHTML = r.similar
        ? GM.formula(`\\frac{K_2}{K_1} = \\frac{${GM.fmtTex(K2, 2)}}{${GM.fmtTex(K1, 2)}} = ${GM.fmtTex(K2 / K1, 2)} = k \\qquad \\frac{L_2}{L_1} = \\frac{${GM.fmtTex(L2, 2)}}{${GM.fmtTex(L1, 2)}} = ${GM.fmtTex(L2 / L1, 2)} = k^2`)
        : `<div class="callout bad"><p>Perubahan ${T('\\angle D')} membuat bentuk berubah. Dua rasio sisi masih ${f(k, 1)}, tetapi ${T('\\frac{EF}{BC}')} berbeda. Bangun tidak sebangun.</p></div>`;
      if (r.similar && !r.congruent && !GM.store.get().lab.s_similar) GM.store.update((s) => { s.lab.s_similar = true; });
    }
    ids.forEach((id) => $(id).addEventListener('input', update));
    update();
  }

  /* ================= ALAT 3: PERBANDINGAN SEGIEMPAT ================= */
  function toolSegiempat() {
    const opts = Object.entries(geo.QUAD_TYPES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
    const side = (i, label) => `<div class="card" style="box-shadow:none;padding:14px">
        <div class="panel-title">${label}</div>
        <div class="control"><label for="q${i}-type">Jenis bangun</label><select id="q${i}-type">${opts}</select></div>
        <div id="q${i}-params"></div>
      </div>`;
    return `
    <div class="card">
      <div class="panel-title">${GM.icon('square', 20)} Perbandingan Segiempat</div>
      <p class="muted small">Pilih jenis dan ukuran dua segiempat. Pemeriksaan memakai koordinat bangun (bukan tampilan gambar): semua kemungkinan pasangan titik diperiksa, lalu dipilih yang paling cocok.</p>
      <div class="btn-row" style="margin-bottom:12px">
        <span class="small muted">Contoh cepat:</span>
        <button class="btn btn-outline btn-sm" data-qp="0">Persegi 3 & 6</button>
        <button class="btn btn-outline btn-sm" data-qp="1">Persegi panjang 6×4 & 9×6</button>
        <button class="btn btn-outline btn-sm" data-qp="2">Persegi vs belah ketupat</button>
        <button class="btn btn-outline btn-sm" data-qp="3">Persegi panjang 6×4 & 8×5</button>
        <button class="btn btn-outline btn-sm" data-qp="4">Dua jajargenjang</button>
      </div>
      <div class="tool-grid">
        <div>
          <div class="figure grid-bg" id="q-fig"></div>
          <div class="grid grid-2" style="margin-top:12px">${side(1, 'Bangun 1 (ABCD)')}${side(2, 'Bangun 2 (PQRS)')}</div>
        </div>
        <div>
          <div id="q-status"></div>
          <div id="q-corr" class="small" style="margin:10px 0"></div>
          <div class="table-wrap"><table class="data compact mono" id="q-table"></table></div>
          <div id="q-note" style="margin-top:10px"></div>
        </div>
      </div>
    </div>`;
  }

  function initSegiempat(root) {
    const $ = (id) => root.querySelector('#' + id);
    const st = [{ type: 'persegipanjang', p: { p: 6, l: 4 } }, { type: 'persegipanjang', p: { p: 9, l: 6 } }];
    const L = [['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S']];
    const PRESETS = [
      [{ type: 'persegi', p: { s: 3 } }, { type: 'persegi', p: { s: 6 } }],
      [{ type: 'persegipanjang', p: { p: 6, l: 4 } }, { type: 'persegipanjang', p: { p: 9, l: 6 } }],
      [{ type: 'persegi', p: { s: 4 } }, { type: 'belahketupat', p: { s: 4, t: 60 } }],
      [{ type: 'persegipanjang', p: { p: 6, l: 4 } }, { type: 'persegipanjang', p: { p: 8, l: 5 } }],
      [{ type: 'jajargenjang', p: { a: 4, b: 2, t: 60 } }, { type: 'jajargenjang', p: { a: 6, b: 3, t: 60 } }]
    ];
    const pts = (i) => geo.quad(st[i].type, geo.fixParams(st[i].type, st[i].p));
    const draw = GM.svg.mount($('q-fig'), () => ({
      shapes: [
        { pts: pts(0), labels: L[0], color: 'a', sideLabels: true, angleLabels: true, title: geo.QUAD_TYPES[st[0].type].name },
        { pts: pts(1), labels: L[1], color: 'b', sideLabels: true, angleLabels: true, title: geo.QUAD_TYPES[st[1].type].name }
      ],
      opts: { label: 'Dua segiempat yang dibandingkan' }
    }), { aspect: 0.55, maxWidth: 900 });

    function params(i) {
      const t = st[i].type;
      st[i].p = geo.fixParams(t, Object.assign(geo.defaultParams(t), st[i].p));
      $(`q${i + 1}-type`).value = t;
      $(`q${i + 1}-params`).innerHTML = geo.QUAD_TYPES[t].params.map((p) => `<div class="control"><label for="q${i}-${p.id}"><span>${p.label}</span><output id="q${i}-${p.id}-o">${f(st[i].p[p.id], 1)}${p.unit === '°' ? '°' : ' cm'}</output></label>
        <input type="range" id="q${i}-${p.id}" min="${p.min}" max="${p.max}" step="${p.step}" value="${st[i].p[p.id]}" data-i="${i}" data-p="${p.id}"></div>`).join('');
      $(`q${i + 1}-params`).querySelectorAll('input').forEach((inp) => inp.addEventListener('input', () => {
        st[i].p[inp.dataset.p] = +inp.value;
        const fixed = geo.fixParams(st[i].type, st[i].p);
        Object.keys(fixed).forEach((k) => {
          if (fixed[k] !== st[i].p[k]) { st[i].p[k] = fixed[k]; const o = $(`q${i}-${k}`); if (o) o.value = fixed[k]; }
          const out = $(`q${i}-${k}-o`); const def = geo.QUAD_TYPES[st[i].type].params.find((x) => x.id === k);
          if (out && def) out.textContent = f(fixed[k], 1) + (def.unit === '°' ? '°' : ' cm');
        });
        update();
      }));
    }
    function update() {
      draw();
      const A = pts(0), B = pts(1);
      const m = geo.match(A, B);
      const aA = geo.angles(A), aB = geo.angles(B);
      const corr = m.map.map((j, i) => `${L[0][i]}↔${L[1][j]}`).join(', ');
      $('q-corr').innerHTML = `<b>Pasangan titik terbaik:</b> ${corr}`;
      $('q-table').innerHTML = `<tr><th>Sisi</th><th>Bangun 1</th><th>Bangun 2</th><th>Rasio</th></tr>` +
        [0, 1, 2, 3].map((i) => {
          const j = m.map[i], j2 = m.map[(i + 1) % 4];
          return `<tr><td>${L[0][i]}${L[0][(i + 1) % 4]} ↔ ${L[1][j]}${L[1][j2]}</td><td>${f(geo.dist(A[i], A[(i + 1) % 4]), 2)}</td><td>${f(geo.dist(B[j], B[j2]), 2)}</td><td>${f(m.ratios[i], 2)}</td></tr>`;
        }).join('') +
        `<tr><th>Sudut</th><th>Bangun 1</th><th>Bangun 2</th><th>Sama?</th></tr>` +
        [0, 1, 2, 3].map((i) => `<tr><td>∠${L[0][i]} ↔ ∠${L[1][m.map[i]]}</td><td>${f(aA[i], 1)}°</td><td>${f(aB[m.map[i]], 1)}°</td><td>${ic(Math.abs(aA[i] - aB[m.map[i]]) < 0.5)}</td></tr>`).join('');
      let html;
      if (m.congruent) html = statusBox('congruent', 'KONGRUEN', 'Sudut bersesuaian sama dan semua sisi bersesuaian sama panjang (k = 1).');
      else if (m.similar) html = statusBox('similar', 'SEBANGUN, TIDAK KONGRUEN', `Sudut bersesuaian sama dan semua rasio sisi = ${f(m.k, 2)}.`);
      else html = statusBox('none', 'TIDAK SEBANGUN', !m.anglesEqual && m.ratiosEqual ? 'Rasio sisi sama, tetapi sudutnya berbeda.' : m.anglesEqual ? 'Sudut sama, tetapi rasio sisi berbeda.' : 'Sudut dan rasio sisi berbeda.');
      $('q-status').innerHTML = html;
      $('q-note').innerHTML = m.similar ? GM.formula(`\\frac{L_2}{L_1} = \\frac{${GM.fmtTex(geo.area(B), 2)}}{${GM.fmtTex(geo.area(A), 2)}} = ${GM.fmtTex(geo.area(B) / geo.area(A), 2)} = k^2`)
        : `<p class="small muted">Ingat: dua segiempat sebangun hanya jika <b>semua</b> sudut bersesuaian sama <b>dan</b> semua rasio sisi sama.</p>`;
      if (m.similar && !m.congruent && !GM.store.get().lab.q_similar) GM.store.update((s) => { s.lab.q_similar = true; });
    }
    [1, 2].forEach((n) => $(`q${n}-type`).addEventListener('change', (e) => {
      st[n - 1] = { type: e.target.value, p: geo.defaultParams(e.target.value) };
      params(n - 1);
      update();
    }));
    root.querySelectorAll('[data-qp]').forEach((b) => b.addEventListener('click', () => {
      const pr = PRESETS[+b.dataset.qp];
      st[0] = { type: pr[0].type, p: Object.assign({}, pr[0].p) };
      st[1] = { type: pr[1].type, p: Object.assign({}, pr[1].p) };
      params(0); params(1); update();
    }));
    params(0); params(1); update();
  }

  /* ================= Halaman ================= */
  const MAP = {
    kongruensi: [toolKongruensi, initKongruensi],
    kesebangunan: [toolKesebangunan, initKesebangunan],
    segiempat: [toolSegiempat, initSegiempat]
  };

  function render(el, params) {
    const tool = MAP[params[0]] ? params[0] : 'kongruensi';
    el.innerHTML = `<div class="container page">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('flask', 14)} Laboratorium Geometri</span>
        <h1>Laboratorium Geometri</h1>
        <p>Uji dugaanmu secara langsung. Semua status dihitung dari koordinat, panjang sisi, dan besar sudut, bukan dari kesan visual.</p>
      </div>
      <div class="with-sidebar">
        <aside class="sidebar" aria-label="Alat laboratorium">
          <h4>Alat laboratorium</h4>
          <div class="tab-list">
            ${TOOLS.map((t, i) => `<a class="tab-btn ${t.id === tool ? 'active' : ''}" href="#/lab/${t.id}" style="text-decoration:none"><span class="t-num">${i + 1}</span><span>${t.title}</span></a>`).join('')}
          </div>
          <div class="side-foot" style="margin-top:10px">${TOOLS.find((t) => t.id === tool).desc}</div>
        </aside>
        <section class="tab-panel" id="lab-panel">${MAP[tool][0]()}</section>
      </div>
    </div>`;
    MAP[tool][1](el.querySelector('#lab-panel'));
  }

  GM.LabPage = { render };
})();
