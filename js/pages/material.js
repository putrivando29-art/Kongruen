/* Halaman Materi Pembelajaran (8 tab) */
(function () {
  const GM = window.GM;
  const geo = GM.geo;
  const T = GM.tex;
  const F = GM.formula;
  const f = GM.fmt;

  const TABS = [
    { id: 'kongruensi', title: 'Kekongruenan', icon: 'layers' },
    { id: 'syarat-kongruen', title: 'Syarat Kongruen Segitiga', icon: 'triangle' },
    { id: 'sifat', title: 'Sifat Kekongruenan', icon: 'copy' },
    { id: 'kesebangunan', title: 'Kesebangunan', icon: 'scale' },
    { id: 'syarat-sebangun', title: 'Syarat Sebangun Segitiga', icon: 'angle' },
    { id: 'segiempat', title: 'Kesebangunan Segiempat', icon: 'square' },
    { id: 'teorema', title: 'Teorema & Rumus Penting', icon: 'ruler' },
    { id: 'penerapan', title: 'Penerapan Sehari-hari', icon: 'map' }
  ];

  /* ============ Utilitas kecil ============ */
  const ok = (b) => (b ? `<span style="color:var(--ok);font-weight:700">${GM.icon('check', 16, 3)}</span>` : `<span style="color:var(--bad);font-weight:700">${GM.icon('x', 16, 3)}</span>`);
  function slider(id, label, min, max, step, val, unit) {
    return `<div class="control"><label for="${id}"><span>${label}</span><output id="${id}-o">${f(val, 2)}${unit || ''}</output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
  }

  /* ============ TAB 1: KEKONGRUENAN ============ */
  function tabKongruensi() {
    return `
    <div class="card">
      <h2>${GM.icon('layers', 24)} Kekongruenan</h2>
      <p>Dua bangun datar dikatakan <b>kongruen</b> jika memiliki <b>bentuk dan ukuran yang sama persis</b>. Jika satu bangun dipindahkan, diputar, atau dibalik, bangun itu dapat menutupi bangun lainnya dengan tepat.</p>
      <div class="grid grid-2">
        <div>
          <h4>Notasi</h4>
          ${F('F_1 \\cong F_2')}
          <p class="small muted">Dibaca: "bangun ${T('F_1')} kongruen dengan bangun ${T('F_2')}".</p>
        </div>
        <div>
          <h4>Syarat</h4>
          <ol class="clean">
            <li>Semua sisi yang bersesuaian memiliki panjang yang sama.</li>
            <li>Semua sudut yang bersesuaian memiliki besar yang sama.</li>
          </ol>
        </div>
      </div>
      <div class="callout mint"><div class="callout-title">${GM.icon('bulb', 18)} Hubungan dengan kesebangunan</div>
        <p>Kekongruenan merupakan kesebangunan dengan faktor skala ${T('k = 1')}. Jadi, setiap pasangan bangun yang kongruen pasti sebangun.</p></div>
    </div>

    <div class="card">
      <h3>Transformasi yang mempertahankan kekongruenan</h3>
      <div class="grid grid-3">
        <div class="callout"><div class="callout-title">${GM.icon('right', 18)} Translasi (pergeseran)</div><p>Setiap titik digeser dengan jarak dan arah yang sama. Ukuran dan bentuk tidak berubah.</p></div>
        <div class="callout"><div class="callout-title">${GM.icon('rotr', 18)} Rotasi (perputaran)</div><p>Bangun diputar terhadap satu titik pusat dengan sudut tertentu. Panjang sisi dan besar sudut tetap.</p></div>
        <div class="callout"><div class="callout-title">${GM.icon('mirror', 18)} Refleksi (pencerminan)</div><p>Bangun dicerminkan terhadap sebuah garis. Arah bangun terbalik, tetapi ukurannya tetap.</p></div>
      </div>
    </div>

    <div class="card">
      <h3>${GM.icon('flask', 20)} Coba sendiri: geser, putar, dan cerminkan</h3>
      <p class="muted small">Segitiga biru ${T("A'B'C'")} adalah salinan segitiga abu-abu ${T('ABC')}. Seret segitiga biru atau gunakan tombol. Perhatikan bahwa panjang sisi dan besar sudutnya tidak pernah berubah. Tantangan: tumpuk segitiga biru tepat di atas segitiga abu-abu!</p>
      <div class="tool-grid">
        <div>
          <div class="figure grid-bg" id="tf-fig"></div>
          <div class="btn-row" style="margin-top:12px">
            <div class="seg" aria-label="Translasi">
              <button data-tf="left" title="Geser kiri 1 cm">${GM.icon('left', 16)}</button>
              <button data-tf="right" title="Geser kanan 1 cm">${GM.icon('right', 16)}</button>
              <button data-tf="up" title="Geser atas 1 cm">${GM.icon('up', 16)}</button>
              <button data-tf="down" title="Geser bawah 1 cm">${GM.icon('down', 16)}</button>
            </div>
            <button class="btn btn-outline btn-sm" data-tf="rotl">${GM.icon('rotl', 16)} Putar 15°</button>
            <button class="btn btn-outline btn-sm" data-tf="rotr">${GM.icon('rotr', 16)} Putar −15°</button>
            <button class="btn btn-outline btn-sm" data-tf="flip">${GM.icon('mirror', 16)} Cerminkan</button>
            <button class="btn btn-danger-soft btn-sm" data-tf="reset">${GM.icon('refresh', 16)} Ulang</button>
          </div>
        </div>
        <div>
          <div id="tf-status"></div>
          <div class="table-wrap" style="margin-top:12px"><table class="data compact" id="tf-table"></table></div>
          <p class="small muted" id="tf-count" style="margin-top:8px"></p>
        </div>
      </div>
    </div>`;
  }

  function initKongruensi(panel) {
    const WORLD = [22, 9];
    const orig = [[2, 2], [7, 2], [3.2, 6]];
    const start = () => geo.translate(geo.rotate(orig, 30), 11, 0);
    let pts = start();
    let cnt = { t: 0, r: 0, f: 0 };
    let lay = null;
    const box = panel.querySelector('#tf-fig');

    const draw = GM.svg.mount(box, (W) => ({
      shapes: [
        { pts: orig, labels: ['A', 'B', 'C'], color: 'ghost', dashed: true },
        { pts, labels: ["A'", "B'", "C'"], color: 'a', draggable: true }
      ],
      opts: { fixed: { scale: W / (WORLD[0] + 2), origin: [-1, -1] }, label: 'Segitiga ABC dan salinannya' }
    }), { height: (W) => Math.round((W * (WORLD[1] + 2)) / (WORLD[0] + 2)), after: (r) => { lay = r.lay; } });

    function coincide() {
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
      return perms.some((p) => p.every((j, i) => geo.dist(orig[i], pts[j]) < 0.15));
    }
    function update() {
      draw();
      const s1 = geo.sides(orig), s2 = geo.sides(pts), a1 = geo.angles(orig), a2 = geo.angles(pts);
      const names = [['AB', "A'B'"], ['BC', "B'C'"], ['CA', "C'A'"]];
      const an = [['∠A', "∠A'"], ['∠B', "∠B'"], ['∠C', "∠C'"]];
      panel.querySelector('#tf-table').innerHTML = `<tr><th>Asli</th><th>Salinan</th><th>Sama?</th></tr>` +
        names.map((n, i) => `<tr><td>${n[0]} = ${f(s1[i], 2)} cm</td><td>${n[1]} = ${f(s2[i], 2)} cm</td><td>${ok(Math.abs(s1[i] - s2[i]) < 0.01)}</td></tr>`).join('') +
        an.map((n, i) => `<tr><td>${n[0]} = ${f(a1[i], 1)}°</td><td>${n[1]} = ${f(a2[i], 1)}°</td><td>${ok(Math.abs(a1[i] - a2[i]) < 0.1)}</td></tr>`).join('');
      const hit = coincide();
      panel.querySelector('#tf-status').innerHTML = hit
        ? `<div class="status congruent pulse"><div class="s-ico">${GM.icon('check', 22, 3)}</div><div>Tepat berimpit!<small>Salinan menutupi segitiga asli dengan sempurna: ${T("\\triangle ABC \\cong \\triangle A'B'C'")}.</small></div></div>`
        : `<div class="status congruent"><div class="s-ico">${GM.icon('layers', 22)}</div><div>Tetap KONGRUEN<small>Bentuk dan ukuran tidak berubah oleh translasi, rotasi, maupun refleksi.</small></div></div>`;
      panel.querySelector('#tf-count').textContent = `Transformasi dilakukan: translasi ${cnt.t}×, rotasi ${cnt.r}×, refleksi ${cnt.f}×.`;
      if (hit) GM.store.update((s) => { s.lab.overlay = true; });
    }
    const keepInside = (q) => {
      const c = geo.centroid(q);
      const dx = GM.clamp(c[0], 1.5, WORLD[0] - 1.5) - c[0], dy = GM.clamp(c[1], 1.5, WORLD[1] - 1.5) - c[1];
      return geo.translate(q, dx, dy);
    };
    panel.querySelectorAll('[data-tf]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.tf;
      if (a === 'left') { pts = geo.translate(pts, -1, 0); cnt.t++; }
      if (a === 'right') { pts = geo.translate(pts, 1, 0); cnt.t++; }
      if (a === 'up') { pts = geo.translate(pts, 0, 1); cnt.t++; }
      if (a === 'down') { pts = geo.translate(pts, 0, -1); cnt.t++; }
      if (a === 'rotl') { pts = geo.rotate(pts, 15); cnt.r++; }
      if (a === 'rotr') { pts = geo.rotate(pts, -15); cnt.r++; }
      if (a === 'flip') { pts = geo.reflectV(pts); cnt.f++; }
      if (a === 'reset') { pts = start(); cnt = { t: 0, r: 0, f: 0 }; }
      pts = keepInside(pts);
      update();
    }));

    // Seret segitiga (langkah 0,5 cm)
    let drag = null;
    box.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('[data-drag="body"]');
      if (!t || !lay) return;
      const svg = box.querySelector('svg');
      const [x, y] = GM.svg.pointer(svg, e);
      drag = { w0: lay.toWorld(x, y), p0: pts };
      box.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    box.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const svg = box.querySelector('svg');
      const [x, y] = GM.svg.pointer(svg, e);
      const w = lay.toWorld(x, y);
      const dx = Math.round((w[0] - drag.w0[0]) * 2) / 2, dy = Math.round((w[1] - drag.w0[1]) * 2) / 2;
      const np = keepInside(geo.translate(drag.p0, dx, dy));
      if (np[0][0] !== pts[0][0] || np[0][1] !== pts[0][1]) { pts = np; drag.moved = true; update(); }
    });
    const end = () => { if (drag && drag.moved) cnt.t++; drag = null; update(); };
    box.addEventListener('pointerup', end);
    box.addEventListener('pointercancel', end);
    update();
  }

  /* ============ TAB 2: SYARAT KEKONGRUENAN ============ */
  const RULES = [
    {
      id: 'SSS', name: 'Sisi-Sisi-Sisi',
      def: 'Ketiga pasang sisi yang bersesuaian sama panjang.',
      build() {
        const p = geo.triSSS(5, 7, 6);
        return { p, sides: [0, 1, 2], angles: [], sideMarks: [1, 2, 3], angleMarks: [], sl: ['5 cm', '7 cm', '6 cm'], al: [] };
      },
      info: ['Sisi: $AB = PQ$, $BC = QR$, $CA = RP$ (tiga pasang).', 'Sudut: tidak perlu diketahui; sudut-sudutnya otomatis sama besar.'],
      example: '$\\triangle ABC$ dengan $AB = 5$ cm, $BC = 7$ cm, $CA = 6$ cm dan $\\triangle PQR$ dengan $PQ = 5$ cm, $QR = 7$ cm, $RP = 6$ cm.',
      concl: 'Ketiga pasang sisi sama panjang, maka $\\triangle ABC \\cong \\triangle PQR$ (SSS).'
    },
    {
      id: 'SAS', name: 'Sisi-Sudut-Sisi',
      def: 'Dua pasang sisi bersesuaian sama panjang dan sudut yang diapit kedua sisi itu sama besar.',
      build() {
        const r = geo.D2R;
        const p = [[6 * Math.cos(50 * r), 6 * Math.sin(50 * r)], [0, 0], [8, 0]];
        return { p, sides: [0, 1], angles: [1], sideMarks: [1, 2, 0], angleMarks: [0, 1, 0], sl: ['6 cm', '8 cm', ''], al: ['', '50°', ''] };
      },
      info: ['Sisi: $AB = PQ$ dan $BC = QR$.', 'Sudut: $\\angle B = \\angle Q$, yaitu sudut yang diapit kedua sisi tersebut.'],
      example: '$AB = PQ = 6$ cm, $\\angle B = \\angle Q = 50^\\circ$, $BC = QR = 8$ cm.',
      concl: '$\\angle B$ diapit oleh $AB$ dan $BC$, maka $\\triangle ABC \\cong \\triangle PQR$ (SAS).'
    },
    {
      id: 'ASA', name: 'Sudut-Sisi-Sudut',
      def: 'Dua pasang sudut bersesuaian sama besar dan sisi yang diapit kedua sudut tersebut sama panjang.',
      build() {
        const p = geo.triASA(40, 7, 65);
        return { p, sides: [0], angles: [0, 1], sideMarks: [1, 0, 0], angleMarks: [1, 2, 0], sl: ['7 cm', '', ''], al: ['40°', '65°', ''] };
      },
      info: ['Sudut: $\\angle A = \\angle P$ dan $\\angle B = \\angle Q$.', 'Sisi: $AB = PQ$, yaitu sisi yang terletak di antara kedua sudut.'],
      example: '$\\angle A = \\angle P = 40^\\circ$, $AB = PQ = 7$ cm, $\\angle B = \\angle Q = 65^\\circ$.',
      concl: 'Sisi $AB$ diapit oleh $\\angle A$ dan $\\angle B$, maka $\\triangle ABC \\cong \\triangle PQR$ (ASA).'
    },
    {
      id: 'AAS', name: 'Sudut-Sudut-Sisi',
      def: 'Dua pasang sudut bersesuaian sama besar dan satu pasang sisi yang tidak diapit kedua sudut itu sama panjang.',
      build() {
        const r = geo.D2R;
        const AB = (6 * Math.sin(75 * r)) / Math.sin(40 * r);
        const p = geo.triASA(40, AB, 65);
        return { p, sides: [1], angles: [0, 1], sideMarks: [0, 1, 0], angleMarks: [1, 2, 0], sl: ['', '6 cm', ''], al: ['40°', '65°', ''] };
      },
      info: ['Sudut: $\\angle A = \\angle P$ dan $\\angle B = \\angle Q$.', 'Sisi: $BC = QR$, sisi yang <b>tidak</b> terletak di antara $\\angle A$ dan $\\angle B$.'],
      example: '$\\angle A = \\angle P = 40^\\circ$, $\\angle B = \\angle Q = 65^\\circ$, $BC = QR = 6$ cm.',
      concl: 'Dua sudut dan satu sisi tidak diapit sama, maka $\\triangle ABC \\cong \\triangle PQR$ (AAS).'
    },
    {
      id: 'RHS', name: 'Hipotenusa-Sisi (HL)',
      def: 'Khusus segitiga siku-siku: hipotenusa dan salah satu kaki (sisi siku-siku) yang bersesuaian sama panjang.',
      build() {
        const p = [[0, 6], [8, 0], [0, 0]];
        return { p, sides: [0, 2], angles: [2], sideMarks: [2, 0, 1], angleMarks: [], sl: ['10 cm', '', '6 cm'], al: [] };
      },
      info: ['Sudut: $\\angle C = \\angle R = 90^\\circ$ (keduanya segitiga siku-siku).', 'Sisi: hipotenusa $AB = PQ$ dan kaki $CA = RP$.'],
      example: 'Siku-siku di $C$ dan $R$, hipotenusa $AB = PQ = 10$ cm, kaki $AC = PR = 6$ cm. Dengan Pythagoras, kaki lainnya $BC = QR = \\sqrt{10^2 - 6^2} = 8$ cm.',
      concl: 'Hipotenusa dan satu kaki sama panjang, maka $\\triangle ABC \\cong \\triangle PQR$ (RHS).'
    }
  ];

  function tabSyaratKongruen() {
    return `
    <div class="card">
      <h2>${GM.icon('triangle', 24)} Syarat Kekongruenan Segitiga</h2>
      <p>Untuk membuktikan dua segitiga kongruen, kita <b>tidak perlu</b> memeriksa keenam unsurnya (3 sisi dan 3 sudut). Cukup salah satu kriteria berikut. Klik kartu untuk melihat penjelasan dan ilustrasinya.</p>
      <div class="rule-grid" role="tablist" aria-label="Kriteria kekongruenan">
        ${RULES.map((r, i) => `<button class="rule-card ${i === 0 ? 'active' : ''}" data-rule="${i}" role="tab" aria-selected="${i === 0}"><span class="r-code">${r.id}</span><span class="r-name">${r.name}</span></button>`).join('')}
      </div>
      <div id="rule-detail"></div>
    </div>
    <div class="card">
      <div class="callout warn"><div class="callout-title">${GM.icon('bulb', 18)} Hati-hati: data ini TIDAK menjamin kongruen</div>
        <p><b>AAA (tiga sudut sama)</b> hanya menjamin sebangun. Contoh: segitiga sama sisi bersisi 2 cm dan 5 cm sama-sama bersudut ${T('60^\\circ')}, tetapi ukurannya berbeda.</p>
        <p><b>SSA (dua sisi dan sudut yang tidak diapit)</b> secara umum tidak cukup, karena dapat menghasilkan dua segitiga berbeda. Pengecualiannya adalah RHS, ketika sudut tersebut siku-siku.</p>
      </div>
    </div>`;
  }

  function initSyaratKongruen(panel) {
    const detail = panel.querySelector('#rule-detail');
    function show(i) {
      const r = RULES[i];
      const b = r.build();
      detail.innerHTML = `<div class="rule-detail"><hr class="divider">
        <div class="grid grid-2">
          <div>
            <span class="chip chip-navy">${r.id}</span> <span class="chip">${r.name}</span>
            <h3 style="margin-top:10px">Pengertian</h3>
            <p>${r.def}</p>
            <div class="figure grid-bg" id="rule-fig"></div>
            <div class="figure-cap">Unsur yang disorot oranye adalah unsur yang harus sama. Tanda garis/busur yang sama menunjukkan pasangan bersesuaian.</div>
          </div>
          <div>
            <h3>Informasi sisi dan sudut</h3>
            <ul class="info-list">${r.info.map((t) => `<li><span class="dot" style="background:var(--amber)"></span><div>${GM.md(t)}</div></li>`).join('')}</ul>
            <h3 style="margin-top:16px">Contoh sederhana</h3>
            <p>${GM.md(r.example)}</p>
            <div class="callout mint"><div class="callout-title">${GM.icon('check', 18)} Kesimpulan</div><p>${GM.md(r.concl)}</p></div>
          </div>
        </div></div>`;
      // Segitiga kedua dicerminkan (dan diputar) agar tampak berbeda posisi.
      const q = geo.place(b.p, r.id === 'RHS' ? 0 : 180, true);
      const mk = (pts, labels, color) => ({ pts, labels, color, hlSides: b.sides, hlAngles: b.angles, sideMarks: b.sideMarks, angleMarks: b.angleMarks, sideLabels: b.sl, angleLabels: b.al });
      GM.svg.mount(detail.querySelector('#rule-fig'), () => ({
        shapes: [mk(b.p, ['A', 'B', 'C'], 'a'), mk(q, ['P', 'Q', 'R'], 'b')],
        opts: { label: 'Ilustrasi kriteria ' + r.id }
      }), { aspect: 0.55 });
      panel.querySelectorAll('[data-rule]').forEach((c) => {
        const on = +c.dataset.rule === i;
        c.classList.toggle('active', on);
        c.setAttribute('aria-selected', on);
      });
    }
    panel.querySelectorAll('[data-rule]').forEach((c) => c.addEventListener('click', () => show(+c.dataset.rule)));
    show(0);
  }

  /* ============ TAB 3: SIFAT ============ */
  function tabSifat() {
    const props = [
      ['Refleksif', '\\triangle ABC \\cong \\triangle ABC', 'Setiap bangun kongruen dengan dirinya sendiri.'],
      ['Simetris', '\\triangle ABC \\cong \\triangle PQR \\Rightarrow \\triangle PQR \\cong \\triangle ABC', 'Jika bangun pertama kongruen dengan bangun kedua, maka bangun kedua kongruen dengan bangun pertama.'],
      ['Transitif', '\\triangle ABC \\cong \\triangle PQR \\text{ dan } \\triangle PQR \\cong \\triangle XYZ \\Rightarrow \\triangle ABC \\cong \\triangle XYZ', 'Jika dua bangun sama-sama kongruen dengan bangun ketiga, keduanya saling kongruen.']
    ];
    return `
    <div class="card">
      <h2>${GM.icon('copy', 24)} Sifat Kekongruenan</h2>
      <div class="grid grid-3">
        ${props.map(([n, fx, d]) => `<div class="card card-hover" style="box-shadow:none"><span class="chip">${n}</span><div class="formula" style="font-size:.85em">${T(fx, true)}</div><p class="small">${d}</p></div>`).join('')}
      </div>
    </div>
    <div class="card">
      <h3>CPCTC: bagian bersesuaian dari segitiga kongruen</h3>
      <p><b>CPCTC</b> (<i>Corresponding Parts of Congruent Triangles are Congruent</i>) artinya: jika dua segitiga sudah terbukti kongruen, maka <b>semua</b> bagian yang bersesuaian (sisi dan sudut) memiliki ukuran yang sama.</p>
      ${F('\\triangle ABC \\cong \\triangle PQR \\Rightarrow AB = PQ,\\; BC = QR,\\; CA = RP,\\; \\angle A = \\angle P,\\; \\angle B = \\angle Q,\\; \\angle C = \\angle R')}
      <p class="small muted">Urutan huruf pada notasi menunjukkan pasangan titik: A dengan P, B dengan Q, C dengan R.</p>
      <div class="tool-grid">
        <div><div class="figure grid-bg" id="cp-fig"></div><div class="figure-cap">Klik sebuah sisi atau sudut pada salah satu segitiga.</div></div>
        <div id="cp-info"><div class="callout"><div class="callout-title">${GM.icon('search', 18)} Cari pasangannya</div><p>Klik sisi atau sudut mana saja. Pasangannya pada segitiga lain akan ikut menyala, lengkap dengan ukurannya.</p></div></div>
      </div>
    </div>`;
  }

  function initSifat(panel) {
    const A = geo.triSSS(6, 5, 4);
    const B = geo.place(A, 140, true);
    let sel = null;
    const box = panel.querySelector('#cp-fig');
    const draw = GM.svg.mount(box, () => {
      const hs = sel && sel[0] === 's' ? [+sel.slice(1)] : [];
      const ha = sel && sel[0] === 'a' ? [+sel.slice(1)] : [];
      return {
        shapes: [
          { pts: A, labels: ['A', 'B', 'C'], color: 'a', sideLabels: true, angleLabels: true, hlSides: hs, hlAngles: ha },
          { pts: B, labels: ['P', 'Q', 'R'], color: 'b', sideLabels: true, angleLabels: true, hlSides: hs, hlAngles: ha }
        ],
        opts: { parts: true, label: 'Segitiga ABC kongruen dengan PQR' }
      };
    }, { aspect: 0.5 });
    box.addEventListener('click', (e) => {
      const p = e.target.closest('[data-part]');
      if (!p) return;
      sel = p.dataset.part;
      draw();
      const i = +sel.slice(1);
      const L1 = ['A', 'B', 'C'], L2 = ['P', 'Q', 'R'];
      let html;
      if (sel[0] === 's') {
        const len = geo.sides(A)[i];
        html = `Sisi ${T(L1[i] + L1[(i + 1) % 3])} bersesuaian dengan sisi ${T(L2[i] + L2[(i + 1) % 3])}.` + F(`${L1[i]}${L1[(i + 1) % 3]} = ${L2[i]}${L2[(i + 1) % 3]} = ${GM.fmtTex(len, 1)}\\text{ cm}`);
      } else {
        const ang = geo.angles(A)[i];
        html = `Sudut ${T('\\angle ' + L1[i])} bersesuaian dengan sudut ${T('\\angle ' + L2[i])}.` + F(`\\angle ${L1[i]} = \\angle ${L2[i]} \\approx ${GM.fmtTex(ang, 1)}^\\circ`);
      }
      panel.querySelector('#cp-info').innerHTML = `<div class="callout mint"><div class="callout-title">${GM.icon('check', 18)} Pasangan ditemukan</div><p>${html}</p><p class="small">Karena ${T('\\triangle ABC \\cong \\triangle PQR')}, ukuran keduanya pasti sama (CPCTC).</p></div>`;
    });
  }

  /* ============ TAB 4: KESEBANGUNAN ============ */
  function tabKesebangunan() {
    return `
    <div class="card">
      <h2>${GM.icon('scale', 24)} Kesebangunan</h2>
      <p>Dua bangun datar dikatakan <b>sebangun</b> jika memiliki <b>bentuk yang sama</b>, tetapi <b>ukurannya belum tentu sama</b>.</p>
      <div class="grid grid-2">
        <div><h4>Notasi</h4>${F('F_1 \\sim F_2')}</div>
        <div><h4>Syarat</h4><ol class="clean"><li>Sudut-sudut yang bersesuaian sama besar.</li><li>Sisi-sisi yang bersesuaian memiliki perbandingan yang sama.</li></ol></div>
      </div>
      <h3>Rumus penting</h3>
      <div class="grid grid-2">
        <div><p class="small muted" style="margin:0">Faktor skala</p>${F('k = \\frac{\\text{sisi bangun kedua}}{\\text{sisi bangun pertama}}')}</div>
        <div><p class="small muted" style="margin:0">Panjang sisi baru</p>${F('\\text{sisi baru} = k \\times \\text{sisi asli}')}</div>
        <div><p class="small muted" style="margin:0">Perbandingan keliling</p>${F('\\frac{K_2}{K_1} = k')}</div>
        <div><p class="small muted" style="margin:0">Perbandingan luas</p>${F('\\frac{L_2}{L_1} = k^2')}</div>
      </div>
      <div class="callout mint"><div class="callout-title">${GM.icon('bulb', 18)} Kekongruenan adalah kasus khusus</div><p>Jika ${T('k = 1')}, sisi-sisi bersesuaian sama panjang sehingga kedua bangun kongruen. Jadi kekongruenan merupakan kasus khusus kesebangunan ketika ${T('k = 1')}.</p></div>
      <p class="small muted">Catatan: jika ${T('k > 1')} terjadi pembesaran, jika ${T('0 < k < 1')} terjadi pengecilan.</p>
    </div>
    <div class="card">
      <h3>${GM.icon('flask', 20)} Eksperimen faktor skala pada persegi panjang</h3>
      <p class="muted small">Persegi panjang pertama berukuran 3 cm × 2 cm. Geser slider untuk mengubah faktor skala dan amati perubahan keliling serta luasnya.</p>
      <div class="tool-grid">
        <div><div class="figure grid-bg" id="ks-fig"></div></div>
        <div>
          ${slider('ks-k', 'Faktor skala k', 0.5, 3, 0.1, 2, '')}
          <div id="ks-out"></div>
        </div>
      </div>
    </div>`;
  }

  function initKesebangunan(panel) {
    const inp = panel.querySelector('#ks-k');
    const box = panel.querySelector('#ks-fig');
    const draw = GM.svg.mount(box, () => {
      const k = +inp.value;
      return {
        shapes: [
          { pts: geo.quad('persegipanjang', { p: 3, l: 2 }), labels: ['A', 'B', 'C', 'D'], sideLabels: true, color: 'a', title: 'Bangun 1', rightMarks: true },
          { pts: geo.quad('persegipanjang', { p: 3 * k, l: 2 * k }), labels: ['P', 'Q', 'R', 'S'], sideLabels: true, color: 'b', title: 'Bangun 2' }
        ],
        opts: { label: 'Dua persegi panjang sebangun' }
      };
    }, { aspect: 0.55 });
    function update() {
      const k = +inp.value;
      panel.querySelector('#ks-k-o').textContent = f(k, 1);
      draw();
      const K1 = 10, L1 = 6, K2 = 10 * k, L2 = 6 * k * k;
      const kt = GM.fmtTex(k, 1);
      panel.querySelector('#ks-out').innerHTML = `
        <div class="table-wrap"><table class="data compact">
          <tr><th></th><th>Bangun 1</th><th>Bangun 2</th></tr>
          <tr><td>Panjang</td><td>3 cm</td><td>${f(3 * k, 2)} cm</td></tr>
          <tr><td>Lebar</td><td>2 cm</td><td>${f(2 * k, 2)} cm</td></tr>
          <tr><td>Keliling</td><td>${K1} cm</td><td>${f(K2, 2)} cm</td></tr>
          <tr><td>Luas</td><td>${L1} cm²</td><td>${f(L2, 2)} cm²</td></tr>
        </table></div>
        ${F(`\\frac{K_2}{K_1} = \\frac{${GM.fmtTex(K2, 2)}}{10} = ${kt} = k`)}
        ${F(`\\frac{L_2}{L_1} = \\frac{${GM.fmtTex(L2, 2)}}{6} = ${GM.fmtTex(k * k, 2)} = k^2`)}
        ${Math.abs(k - 1) < 1e-9
          ? `<div class="status congruent"><div class="s-ico">${GM.icon('check', 20, 3)}</div><div>KONGRUEN (k = 1)<small>Sebangun sekaligus kongruen.</small></div></div>`
          : `<div class="status similar"><div class="s-ico">${GM.icon('scale', 20)}</div><div>SEBANGUN (k = ${f(k, 1)})<small>${k > 1 ? 'Pembesaran' : 'Pengecilan'}: bentuk sama, ukuran berbeda.</small></div></div>`}`;
    }
    inp.addEventListener('input', update);
    update();
  }

  /* ============ TAB 5: SYARAT KESEBANGUNAN ============ */
  function tabSyaratSebangun() {
    const block = (id, code, name, desc, ex, concl) => `
      <div class="card">
        <div class="grid grid-2">
          <div>
            <span class="chip chip-navy">${code}</span> <span class="chip">${name}</span>
            <p style="margin-top:10px">${desc}</p>
            <h4>Contoh</h4><p>${GM.md(ex)}</p>
            <div class="callout mint"><div class="callout-title">${GM.icon('check', 18)} Kesimpulan</div><p>${GM.md(concl)}</p></div>
          </div>
          <div><div class="figure grid-bg" id="${id}"></div></div>
        </div>
      </div>`;
    return `
    <div class="card">
      <h2>${GM.icon('angle', 24)} Syarat Kesebangunan Segitiga</h2>
      <p>Dua segitiga sebangun jika memenuhi salah satu syarat berikut. Perhatikan bahwa tiga syarat ini lebih ringan daripada syarat kekongruenan, karena ukuran boleh berbeda.</p>
    </div>
    ${block('ss-aa', 'AA', 'Sudut-Sudut', 'Dua pasang sudut bersesuaian sama besar. Sudut ketiga otomatis sama karena jumlah sudut segitiga selalu $180^\\circ$.',
      '$\\angle A = \\angle P = 40^\\circ$ dan $\\angle B = \\angle Q = 60^\\circ$. Maka $\\angle C = \\angle R = 180^\\circ - 40^\\circ - 60^\\circ = 80^\\circ$.',
      '$\\triangle ABC \\sim \\triangle PQR$ (AA). Di sini $AB = 4$ cm dan $PQ = 6$ cm, jadi $k = \\frac{6}{4} = 1{,}5$.')}
    ${block('ss-sss', 'SSS', 'Sisi-Sisi-Sisi Sebanding', 'Ketiga pasang sisi bersesuaian memiliki perbandingan (rasio) yang sama.',
      '$\\triangle ABC$: $4$ cm, $6$ cm, $8$ cm. $\\triangle PQR$: $6$ cm, $9$ cm, $12$ cm. $$\\frac{6}{4} = \\frac{9}{6} = \\frac{12}{8} = 1{,}5$$',
      'Ketiga rasio sama, maka $\\triangle ABC \\sim \\triangle PQR$ dengan $k = 1{,}5$.')}
    ${block('ss-sas', 'SAS', 'Sisi-Sudut-Sisi Sebanding', 'Dua pasang sisi bersesuaian sebanding dan sudut yang diapitnya sama besar.',
      '$AB = 4$, $AC = 6$, $\\angle A = 50^\\circ$; $PQ = 6$, $PR = 9$, $\\angle P = 50^\\circ$. $$\\frac{PQ}{AB} = \\frac{6}{4} = 1{,}5, \\quad \\frac{PR}{AC} = \\frac{9}{6} = 1{,}5$$',
      'Dua pasang sisi sebanding dan sudut apitnya sama, maka $\\triangle ABC \\sim \\triangle PQR$.')}
    <div class="card">
      <h3>${GM.icon('search', 20)} Alat periksa: SSS sebanding</h3>
      <p class="muted small">Masukkan panjang sisi dua segitiga (boleh desimal, misalnya 2,5). Alat ini memasangkan sisi dari yang terpendek, lalu menghitung rasionya.</p>
      <div class="grid grid-2">
        <div><h4>Segitiga 1</h4><div class="input-row">${[4, 6, 8].map((v, i) => `<input type="text" inputmode="decimal" id="c1-${i}" value="${v}" aria-label="Sisi ${i + 1} segitiga 1">`).join('')}</div></div>
        <div><h4>Segitiga 2</h4><div class="input-row">${[6, 9, 12].map((v, i) => `<input type="text" inputmode="decimal" id="c2-${i}" value="${v}" aria-label="Sisi ${i + 1} segitiga 2">`).join('')}</div></div>
      </div>
      <div class="btn-row" style="margin-top:12px"><button class="btn btn-primary" id="c-check">${GM.icon('search', 18)} Periksa</button></div>
      <div id="c-out" class="mini-result"></div>
    </div>`;
  }

  function initSyaratSebangun(panel) {
    const pair = (id, a, b, extra) => GM.svg.mount(panel.querySelector('#' + id), () => ({
      shapes: [Object.assign({ pts: a, labels: ['A', 'B', 'C'], color: 'a' }, extra[0]), Object.assign({ pts: b, labels: ['P', 'Q', 'R'], color: 'b' }, extra[1])]
    }), { aspect: 0.6, maxWidth: 560 });
    const aa1 = geo.triASA(40, 4, 60), aa2 = geo.triASA(40, 6, 60);
    const angL = ['40°', '60°', '80°'];
    pair('ss-aa', aa1, aa2, [{ angleLabels: angL, angleMarks: [1, 2, 0], sideLabels: ['4 cm', '', ''] }, { angleLabels: angL, angleMarks: [1, 2, 0], sideLabels: ['6 cm', '', ''] }]);
    pair('ss-sss', geo.triSSS(4, 6, 8), geo.triSSS(6, 9, 12), [{ sideLabels: ['4 cm', '6 cm', '8 cm'] }, { sideLabels: ['6 cm', '9 cm', '12 cm'] }]);
    pair('ss-sas', geo.triSAS(4, 6, 50), geo.triSAS(6, 9, 50), [{ sideLabels: ['4 cm', '', '6 cm'], angleLabels: ['50°', '', ''], angleMarks: [1, 0, 0], hlSides: [0, 2] }, { sideLabels: ['6 cm', '', '9 cm'], angleLabels: ['50°', '', ''], angleMarks: [1, 0, 0], hlSides: [0, 2] }]);

    panel.querySelector('#c-check').addEventListener('click', () => {
      const s1 = [0, 1, 2].map((i) => GM.parseNum(panel.querySelector('#c1-' + i).value));
      const s2 = [0, 1, 2].map((i) => GM.parseNum(panel.querySelector('#c2-' + i).value));
      const out = panel.querySelector('#c-out');
      if ([...s1, ...s2].some((v) => !(v > 0))) {
        out.innerHTML = `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div>Isi semua sisi dengan angka positif.</div></div>`;
        return;
      }
      if (!geo.validTri(...s1) || !geo.validTri(...s2)) {
        out.innerHTML = `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div>Salah satu data tidak membentuk segitiga. Ingat: jumlah dua sisi harus lebih panjang dari sisi ketiga.</div></div>`;
        return;
      }
      const a = [...s1].sort((x, y) => x - y), b = [...s2].sort((x, y) => x - y);
      const r = a.map((v, i) => b[i] / v);
      const same = Math.max(...r) - Math.min(...r) < 1e-6 * Math.max(...r) + 1e-9;
      const eq = r.map((v, i) => `\\frac{${GM.fmtTex(b[i], 2)}}{${GM.fmtTex(a[i], 2)}} = ${GM.fmtTex(v, 3)}`).join(',\\quad ');
      let verdict;
      if (same && Math.abs(r[0] - 1) < 1e-9) verdict = `<div class="status congruent"><div class="s-ico">${GM.icon('check', 20, 3)}</div><div>KONGRUEN<small>Semua rasio sama dengan 1 (SSS).</small></div></div>`;
      else if (same) verdict = `<div class="status similar"><div class="s-ico">${GM.icon('scale', 20)}</div><div>SEBANGUN, tidak kongruen<small>Semua rasio sama, k = ${f(r[0], 3)} (SSS sebanding).</small></div></div>`;
      else verdict = `<div class="status none"><div class="s-ico">${GM.icon('x', 20, 3)}</div><div>TIDAK SEBANGUN<small>Rasio sisi bersesuaian tidak sama.</small></div></div>`;
      out.innerHTML = F(eq) + verdict;
    });
  }

  /* ============ TAB 6: SEGIEMPAT ============ */
  const QROWS = [
    ['persegi', 'Persegi', '4 sisi sama panjang; sisi berhadapan sejajar', '4 sudut siku-siku (90°)', 'Sama panjang, saling tegak lurus, saling membagi dua sama panjang', '4', 'Selalu sebangun (semua sudut 90° dan rasio sisi pasti sama)', { s: 3 }],
    ['persegipanjang', 'Persegi panjang', 'Sisi berhadapan sama panjang dan sejajar', '4 sudut siku-siku (90°)', 'Sama panjang, saling membagi dua sama panjang', '2', 'Sebangun jika $\\frac{p_1}{p_2} = \\frac{l_1}{l_2}$', { p: 4, l: 2.5 }],
    ['jajargenjang', 'Jajargenjang', 'Sisi berhadapan sama panjang dan sejajar', 'Sudut berhadapan sama besar; sudut berdekatan berjumlah 180°', 'Saling membagi dua sama panjang', '0', 'Sudut bersesuaian sama dan rasio sisi berdekatan sama', { a: 4, b: 2.5, t: 60 }],
    ['belahketupat', 'Belah ketupat', '4 sisi sama panjang; sisi berhadapan sejajar', 'Sudut berhadapan sama besar', 'Saling tegak lurus, saling membagi dua sama panjang, membagi dua sudut', '2', 'Sebangun jika sudut bersesuaian sama besar', { s: 3, t: 60 }],
    ['trapesium', 'Trapesium', 'Tepat sepasang sisi sejajar', 'Dua sudut yang berdekatan pada kaki trapesium berjumlah 180°', 'Umumnya tidak sama panjang (sama panjang pada trapesium sama kaki)', '0 (sama kaki: 1)', 'Semua sudut sama dan semua rasio sisi sama', { a: 5, b: 2.5, h: 2.5, x: 1.25 }],
    ['layanglayang', 'Layang-layang', 'Dua pasang sisi berdekatan sama panjang', 'Sepasang sudut berhadapan sama besar', 'Saling tegak lurus; diagonal sumbu membagi dua diagonal lain', '1', 'Sudut sama dan rasio sisi pendek : sisi panjang sama', { p: 2, q: 3.5, t: 100 }]
  ];

  function tabSegiempat() {
    return `
    <div class="card">
      <h2>${GM.icon('square', 24)} Kesebangunan Segiempat</h2>
      <p>Dua segiempat dikatakan sebangun jika <b>kedua</b> syarat berikut terpenuhi sekaligus:</p>
      <ol class="clean"><li>Semua sudut yang bersesuaian sama besar.</li><li>Semua sisi yang bersesuaian memiliki perbandingan yang sama.</li></ol>
      <div class="callout warn"><div class="callout-title">${GM.icon('bulb', 18)} Berbeda dengan segitiga</div><p>Pada segiempat, satu syarat saja tidak cukup. Lihat dua contoh penyangkal di bawah.</p></div>
      <div class="grid grid-3" id="q-gallery"></div>
    </div>
    <div class="card">
      <h3>Tabel perbandingan sifat segiempat</h3>
      <div class="table-wrap"><table class="data">
        <tr><th>Bangun</th><th>Sisi</th><th>Sudut</th><th>Diagonal</th><th>Simetri lipat</th><th>Dua bangun sejenis sebangun jika ...</th></tr>
        ${QROWS.map((r) => `<tr><td><b>${r[1]}</b></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${GM.md(r[6])}</td></tr>`).join('')}
      </table></div>
    </div>
    <div class="card">
      <h3>${GM.icon('search', 20)} Contoh penyangkal</h3>
      <div class="grid grid-2">
        <div>
          <div class="figure grid-bg" id="cx1"></div>
          <div class="callout bad"><div class="callout-title">Persegi vs belah ketupat</div><p>Semua sisi 3 cm, jadi rasio sisinya sama (${T('k = 1')}). Namun sudutnya ${T('90^\\circ')} vs ${T('60^\\circ')} dan ${T('120^\\circ')}. <b>Tidak sebangun.</b></p></div>
        </div>
        <div>
          <div class="figure grid-bg" id="cx2"></div>
          <div class="callout bad"><div class="callout-title">Persegi vs persegi panjang</div><p>Semua sudut ${T('90^\\circ')}, tetapi ${T('\\frac{5}{3} \\neq \\frac{3}{3}')}. Rasio sisi tidak sama. <b>Tidak sebangun.</b></p></div>
        </div>
      </div>
      <div class="callout mint"><div class="callout-title">${GM.icon('check', 18)} Contoh sebangun</div><p>Persegi panjang ${T('6 \\times 4')} dan ${T('9 \\times 6')}: semua sudut ${T('90^\\circ')} dan ${T('\\frac{9}{6} = \\frac{6}{4} = 1{,}5')}. Kedua persegi panjang sebangun.</p></div>
      <a class="btn btn-primary" href="#/lab/segiempat">${GM.icon('flask', 18)} Bandingkan sendiri di Laboratorium</a>
    </div>`;
  }

  function initSegiempat(panel) {
    const gal = panel.querySelector('#q-gallery');
    gal.innerHTML = QROWS.map((r) => `<div class="card card-hover" style="box-shadow:none;padding:12px"><div class="figure" id="qg-${r[0]}"></div><h4 style="margin:8px 0 0">${r[1]}</h4></div>`).join('');
    QROWS.forEach((r) => {
      const pts = geo.quad(r[0], r[7]);
      GM.svg.mount(gal.querySelector('#qg-' + r[0]), () => ({ shapes: [{ pts, color: 'a', sideLabels: true, angleLabels: true }], opts: { pad: 40, label: r[1] } }), { aspect: 0.62, maxWidth: 380 });
    });
    GM.svg.mount(panel.querySelector('#cx1'), () => ({ shapes: [
      { pts: geo.quad('persegi', { s: 3 }), labels: ['A', 'B', 'C', 'D'], sideLabels: true, color: 'a' },
      { pts: geo.quad('belahketupat', { s: 3, t: 60 }), labels: ['P', 'Q', 'R', 'S'], sideLabels: true, angleLabels: true, color: 'b' }
    ] }), { aspect: 0.5, maxWidth: 560 });
    GM.svg.mount(panel.querySelector('#cx2'), () => ({ shapes: [
      { pts: geo.quad('persegi', { s: 3 }), labels: ['A', 'B', 'C', 'D'], sideLabels: true, color: 'a' },
      { pts: geo.quad('persegipanjang', { p: 5, l: 3 }), labels: ['P', 'Q', 'R', 'S'], sideLabels: true, color: 'b' }
    ] }), { aspect: 0.5, maxWidth: 560 });
  }

  /* ============ TAB 7: TEOREMA ============ */
  function tabTeorema() {
    return `
    <div class="card">
      <h2>${GM.icon('ruler', 24)} Teorema dan Rumus Penting</h2>
      <h3>1. Teorema Thales (garis sejajar dalam segitiga)</h3>
      <p>Jika ${T('DE \\parallel BC')} dengan ${T('D')} pada ${T('AB')} dan ${T('E')} pada ${T('AC')} dalam ${T('\\triangle ABC')}, maka ${T('\\triangle ADE \\sim \\triangle ABC')} (AA) dan berlaku:</p>
      <div class="grid grid-2">${F('\\frac{AD}{DB} = \\frac{AE}{EC}')}${F('\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}')}</div>
      <div class="tool-grid" style="margin-top:10px">
        <div><div class="figure grid-bg" id="th-fig"></div></div>
        <div>${slider('th-t', 'Posisi D (nilai AD : AB)', 0.1, 0.9, 0.05, 0.4, '')}<div id="th-out"></div></div>
      </div>
    </div>
    <div class="card">
      <h3>2. Garis tinggi pada segitiga siku-siku</h3>
      <p>Pada ${T('\\triangle ABC')} siku-siku di ${T('C')} dengan garis tinggi ${T('CD \\perp AB')}, terbentuk tiga segitiga yang saling sebangun: ${T('\\triangle ACB \\sim \\triangle ADC \\sim \\triangle CDB')}. Akibatnya:</p>
      <div class="grid grid-3">${F('CD^2 = AD \\times DB')}${F('AC^2 = AD \\times AB')}${F('BC^2 = DB \\times AB')}</div>
      <div class="tool-grid" style="margin-top:10px">
        <div><div class="figure grid-bg" id="gt-fig"></div></div>
        <div>${slider('gt-x', 'Panjang AD (AB = 10 cm)', 1, 9, 0.5, 3.6, ' cm')}<div id="gt-out"></div></div>
      </div>
    </div>
    <div class="card">
      <div class="grid grid-2">
        <div>
          <h3>3. Teorema Pythagoras</h3>
          <p>Pada segitiga siku-siku di ${T('C')} dengan hipotenusa ${T('AB')}:</p>
          ${F('AC^2 + BC^2 = AB^2')}
          <p class="small muted">Contoh: ${T('6^2 + 8^2 = 36 + 64 = 100 = 10^2')}.</p>
        </div>
        <div>
          <h3>4. Perbandingan luas bangun sebangun</h3>
          ${F('\\frac{L_2}{L_1} = k^2')}
          <p class="small muted">Contoh: jika ${T('k = 3')}, luas bangun kedua ${T('3^2 = 9')} kali luas bangun pertama.</p>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>5. Garis tengah trapesium</h3>
      <p>Ruas garis yang menghubungkan titik tengah kedua kaki trapesium sejajar dengan kedua sisi sejajar, dan panjangnya:</p>
      ${F('\\text{Midsegment} = \\frac{a + b}{2}')}
      <div class="tool-grid">
        <div><div class="figure grid-bg" id="mt-fig"></div></div>
        <div>${slider('mt-a', 'Sisi sejajar bawah a', 3, 10, 0.5, 8, ' cm')}${slider('mt-b', 'Sisi sejajar atas b', 1, 9.5, 0.5, 4, ' cm')}<div id="mt-out"></div></div>
      </div>
    </div>`;
  }

  function initTeorema(panel) {
    // --- Thales ---
    const B = [0, 0], C = [9, 0], A = [3, 6];
    const th = panel.querySelector('#th-t');
    const thBox = panel.querySelector('#th-fig');
    const thDraw = GM.svg.mount(thBox, () => {
      const t = +th.value;
      const D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
      const E = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
      return {
        shapes: [{ pts: [A, B, C], labels: ['A', 'B', 'C'], color: 'a' }],
        opts: {
          label: 'Teorema Thales',
          extra: (maps) => {
            const m = maps[0], d = m(D), e = m(E);
            return `<line x1="${d[0]}" y1="${d[1]}" x2="${e[0]}" y2="${e[1]}" stroke="#0F9D58" stroke-width="3"/>
              <circle cx="${d[0]}" cy="${d[1]}" r="4.5" fill="#0F9D58"/><circle cx="${e[0]}" cy="${e[1]}" r="4.5" fill="#0F9D58"/>
              <text class="v-label" x="${d[0] - 16}" y="${d[1] + 4}" text-anchor="middle">D</text><text class="v-label" x="${e[0] + 16}" y="${e[1] + 4}" text-anchor="middle">E</text>`;
          }
        }
      };
    }, { aspect: 0.62, maxWidth: 640 });
    function thUpdate() {
      const t = +th.value;
      panel.querySelector('#th-t-o').textContent = f(t, 2);
      thDraw();
      const AB = geo.dist(A, B), AC = geo.dist(A, C), BC = geo.dist(B, C);
      const AD = AB * t, DB = AB - AD, AE = AC * t, EC = AC - AE, DE = BC * t;
      const x = (v) => GM.fmtTex(v, 2);
      panel.querySelector('#th-out').innerHTML = `
        <div class="table-wrap"><table class="data compact mono">
          <tr><th>AD</th><th>DB</th><th>AE</th><th>EC</th><th>DE</th><th>BC</th></tr>
          <tr><td>${f(AD, 2)}</td><td>${f(DB, 2)}</td><td>${f(AE, 2)}</td><td>${f(EC, 2)}</td><td>${f(DE, 2)}</td><td>${f(BC, 2)}</td></tr>
        </table></div>
        ${F(`\\frac{AD}{DB} = \\frac{${x(AD)}}{${x(DB)}} = ${x(AD / DB)} \\qquad \\frac{AE}{EC} = \\frac{${x(AE)}}{${x(EC)}} = ${x(AE / EC)}`)}
        ${F(`\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC} = ${x(t)}`)}
        <p class="small muted">Satuan cm. Nilai dibulatkan 2 angka desimal. Geser slider: perbandingan selalu sama karena ${T('DE \\parallel BC')}.</p>`;
    }
    th.addEventListener('input', thUpdate);
    thUpdate();

    // --- Garis tinggi ---
    const gx = panel.querySelector('#gt-x');
    const gtBox = panel.querySelector('#gt-fig');
    const gtDraw = GM.svg.mount(gtBox, () => {
      const x = +gx.value, h = Math.sqrt(x * (10 - x));
      const Ap = [0, 0], Bp = [10, 0], Cp = [x, h], Dp = [x, 0];
      return {
        shapes: [{ pts: [Ap, Bp, Cp], labels: ['A', 'B', 'C'], color: 'a' }],
        opts: {
          label: 'Garis tinggi segitiga siku-siku',
          extra: (maps) => {
            const m = maps[0], c = m(Cp), d = m(Dp);
            return `<line x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}" stroke="#0F9D58" stroke-width="2.5" stroke-dasharray="6 5"/>
              <path d="M${d[0] + 11},${d[1]} v-11 h-11" fill="none" stroke="#0F9D58" stroke-width="1.8"/>
              <circle cx="${d[0]}" cy="${d[1]}" r="4" fill="#0F9D58"/><text class="v-label" x="${d[0]}" y="${d[1] + 22}" text-anchor="middle">D</text>`;
          }
        }
      };
    }, { aspect: 0.5, maxWidth: 640 });
    function gtUpdate() {
      const x = +gx.value;
      panel.querySelector('#gt-x-o').textContent = f(x, 1) + ' cm';
      gtDraw();
      const AD = x, DB = 10 - x, AB = 10, CD = Math.sqrt(AD * DB), AC = Math.sqrt(AD * AB), BC = Math.sqrt(DB * AB);
      const t = (v) => GM.fmtTex(v, 2);
      panel.querySelector('#gt-out').innerHTML = `
        <div class="table-wrap"><table class="data compact mono">
          <tr><th>AD</th><th>DB</th><th>CD</th><th>AC</th><th>BC</th></tr>
          <tr><td>${f(AD, 2)}</td><td>${f(DB, 2)}</td><td>${f(CD, 2)}</td><td>${f(AC, 2)}</td><td>${f(BC, 2)}</td></tr>
        </table></div>
        ${F(`CD^2 = ${t(CD * CD)} = ${t(AD)} \\times ${t(DB)}`)}
        ${F(`AC^2 = ${t(AC * AC)} = ${t(AD)} \\times 10`)}
        ${F(`BC^2 = ${t(BC * BC)} = ${t(DB)} \\times 10`)}
        ${F(`AC^2 + BC^2 = ${t(AC * AC)} + ${t(BC * BC)} = 100 = AB^2`)}
        <p class="small muted">Titik ${T('C')} bergerak pada setengah lingkaran berdiameter ${T('AB')}, sehingga ${T('\\angle C')} selalu ${T('90^\\circ')}.</p>`;
    }
    gx.addEventListener('input', gtUpdate);
    gtUpdate();

    // --- Garis tengah trapesium ---
    const ma = panel.querySelector('#mt-a'), mb = panel.querySelector('#mt-b');
    const mtDraw = GM.svg.mount(panel.querySelector('#mt-fig'), () => {
      const a = +ma.value, b = Math.min(+mb.value, a - 0.5), h = 4, x = (a - b) / 2 - 0.8;
      const P = [[0, 0], [a, 0], [x + b, h], [x, h]];
      const M1 = [(P[0][0] + P[3][0]) / 2, h / 2], M2 = [(P[1][0] + P[2][0]) / 2, h / 2];
      return {
        shapes: [{ pts: P, labels: ['A', 'B', 'C', 'D'], color: 'a', sideLabels: [`a = ${f(a, 1)}`, '', `b = ${f(b, 1)}`, ''] }],
        opts: {
          label: 'Garis tengah trapesium',
          extra: (maps) => {
            const m = maps[0], p = m(M1), q = m(M2);
            return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#0F9D58" stroke-width="3.5"/>
              <circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#0F9D58"/><circle cx="${q[0]}" cy="${q[1]}" r="4.5" fill="#0F9D58"/>
              <text class="s-label" x="${(p[0] + q[0]) / 2}" y="${p[1] - 8}" text-anchor="middle" style="fill:#0F9D58">${f((a + b) / 2, 2)} cm</text>`;
          }
        }
      };
    }, { aspect: 0.45, maxWidth: 640 });
    function mtUpdate() {
      if (+mb.value > +ma.value - 0.5) mb.value = +ma.value - 0.5;
      const a = +ma.value, b = +mb.value;
      panel.querySelector('#mt-a-o').textContent = f(a, 1) + ' cm';
      panel.querySelector('#mt-b-o').textContent = f(b, 1) + ' cm';
      mtDraw();
      panel.querySelector('#mt-out').innerHTML = F(`\\text{Midsegment} = \\frac{${GM.fmtTex(a, 1)} + ${GM.fmtTex(b, 1)}}{2} = ${GM.fmtTex((a + b) / 2, 2)}\\text{ cm}`) +
        `<p class="small muted">Titik hijau adalah titik tengah kaki ${T('AD')} dan ${T('BC')}.</p>`;
    }
    ma.addEventListener('input', mtUpdate);
    mb.addEventListener('input', mtUpdate);
    mtUpdate();
  }

  /* ============ TAB 8: PENERAPAN ============ */
  const APPS = [
    {
      id: 'pohon', icon: 'tree', title: 'Mengukur tinggi pohon dengan bayangan',
      text: 'Pada saat yang sama, tongkat setinggi $1{,}5$ m memiliki bayangan $2$ m, sedangkan bayangan pohon $12$ m. Sinar matahari membentuk sudut yang sama, sehingga kedua segitiga sebangun (AA).',
      ask: 'Berapa tinggi pohon?', unit: 'm', ans: 9,
      explain: '$\\frac{t}{1{,}5} = \\frac{12}{2}$, maka $t = 1{,}5 \\times 6 = 9$ m.',
      art: () => {
        const s = 22, g = 200;
        return `<svg viewBox="0 0 360 230" role="img" aria-label="Tongkat dan pohon beserta bayangannya">
          <line x1="10" y1="${g}" x2="350" y2="${g}" stroke="#94A3B8" stroke-width="2"/>
          <circle cx="330" cy="28" r="16" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/>
          <line x1="${30}" y1="${g}" x2="${30}" y2="${g - 1.5 * s * 0.75}" stroke="#17324D" stroke-width="4"/>
          <line x1="${30}" y1="${g - 1.5 * s * 0.75}" x2="${30 + 2 * s * 0.75}" y2="${g}" stroke="#F59E0B" stroke-dasharray="4 4" stroke-width="2"/>
          <line x1="${30}" y1="${g + 1}" x2="${30 + 2 * s * 0.75}" y2="${g + 1}" stroke="#475569" stroke-width="5"/>
          <text class="s-label" x="18" y="${g - 14}" text-anchor="end">1,5 m</text>
          <text class="s-label" x="${30 + s * 0.75}" y="${g + 20}" text-anchor="middle">2 m</text>
          <rect x="115" y="${g - 9 * s * 0.75}" width="8" height="${9 * s * 0.75}" fill="#8B5E3C"/>
          <circle cx="119" cy="${g - 9 * s * 0.75 + 6}" r="30" fill="#22C55E" opacity=".85"/>
          <line x1="119" y1="${g - 9 * s * 0.75}" x2="${119 + 12 * s * 0.75}" y2="${g}" stroke="#F59E0B" stroke-dasharray="4 4" stroke-width="2"/>
          <line x1="119" y1="${g + 1}" x2="${119 + 12 * s * 0.75}" y2="${g + 1}" stroke="#475569" stroke-width="5"/>
          <text class="s-label" x="${119 + 6 * s * 0.75}" y="${g + 20}" text-anchor="middle">12 m</text>
          <text class="s-label" x="100" y="${g - 50}" text-anchor="end">t = ?</text>
        </svg>`;
      }
    },
    {
      id: 'peta', icon: 'map', title: 'Menentukan jarak sebenarnya dengan skala peta',
      text: 'Sebuah peta berskala $1 : 200.000$. Jarak kota A ke kota B pada peta adalah $3{,}5$ cm. Peta sebangun dengan keadaan sebenarnya, dengan faktor skala $200.000$.',
      ask: 'Berapa jarak sebenarnya (dalam km)?', unit: 'km', ans: 7,
      explain: 'Jarak sebenarnya $= 3{,}5 \\times 200.000 = 700.000$ cm $= 7.000$ m $= 7$ km.',
      art: () => `<svg viewBox="0 0 360 200" role="img" aria-label="Peta dua kota">
          <rect x="14" y="14" width="332" height="172" rx="12" fill="#E0F2FE" stroke="#93C5FD"/>
          <path d="M14 120 C 90 90, 140 160, 220 120 S 320 80, 346 110" fill="none" stroke="#60A5FA" stroke-width="10" opacity=".5"/>
          <path d="M40 40 h60 v40 h-60z M250 40 h70 v50 h-70z" fill="#BBF7D0" opacity=".8"/>
          <circle cx="70" cy="140" r="8" fill="#DC2626"/><text class="v-label" x="70" y="170" text-anchor="middle">A</text>
          <circle cx="290" cy="140" r="8" fill="#2563EB"/><text class="v-label" x="290" y="170" text-anchor="middle">B</text>
          <line x1="78" y1="140" x2="282" y2="140" stroke="#17324D" stroke-width="2.5" stroke-dasharray="7 5"/>
          <text class="s-label" x="180" y="130" text-anchor="middle">3,5 cm</text>
          <rect x="230" y="22" width="108" height="22" rx="6" fill="#fff" stroke="#CBD5E1"/><text x="284" y="38" font-size="12" font-weight="700" text-anchor="middle" fill="#17324D">1 : 200.000</text>
        </svg>`
    },
    {
      id: 'foto', icon: 'photo', title: 'Memperbesar dan memperkecil foto',
      text: 'Foto berukuran lebar $4$ cm dan tinggi $6$ cm diperbesar secara sebangun sehingga lebarnya menjadi $10$ cm.',
      ask: 'Berapa tinggi foto setelah diperbesar?', unit: 'cm', ans: 15,
      explain: '$k = \\frac{10}{4} = 2{,}5$, maka tinggi baru $= 2{,}5 \\times 6 = 15$ cm.',
      art: () => {
        const s = 11;
        return `<svg viewBox="0 0 360 200" role="img" aria-label="Foto kecil dan foto hasil perbesaran">
          <rect x="30" y="${186 - 6 * s}" width="${4 * s}" height="${6 * s}" rx="3" fill="#BFDBFE" stroke="#2563EB" stroke-width="2.5"/>
          <circle cx="${30 + 2 * s}" cy="${186 - 4 * s}" r="${s * 0.9}" fill="#F59E0B" opacity=".7"/>
          <text class="s-label" x="${30 + 2 * s}" y="${186 - 6 * s - 8}" text-anchor="middle">4 cm</text>
          <text class="s-label" x="${30 + 4 * s + 8}" y="${186 - 3 * s}">6 cm</text>
          <path d="M120 120 h40" stroke="#17324D" stroke-width="2.5" marker-end="url(#arr)"/>
          <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#17324D"/></marker></defs>
          <text class="s-label" x="140" y="110" text-anchor="middle">k = ?</text>
          <rect x="190" y="${186 - 15 * s}" width="${10 * s}" height="${15 * s}" rx="4" fill="#BBF7D0" stroke="#0F9D58" stroke-width="2.5"/>
          <circle cx="${190 + 5 * s}" cy="${186 - 10 * s}" r="${s * 2.25}" fill="#F59E0B" opacity=".7"/>
          <text class="s-label" x="${190 + 5 * s}" y="${186 - 15 * s + 18}" text-anchor="middle">10 cm</text>
          <text class="s-label" x="${190 + 10 * s + 6}" y="${186 - 7 * s}">?</text>
        </svg>`;
      }
    },
    {
      id: 'ubin', icon: 'grid', title: 'Membandingkan ukuran ubin',
      text: 'Ubin A berbentuk persegi $20$ cm $\\times$ $20$ cm, ubin B berbentuk persegi $40$ cm $\\times$ $40$ cm. Keduanya sebangun dengan $k = 2$.',
      ask: 'Berapa banyak ubin A yang tepat menutupi satu ubin B?', unit: 'buah', ans: 4,
      explain: 'Perbandingan luas $\\frac{L_B}{L_A} = k^2 = 2^2 = 4$. Jadi dibutuhkan $4$ ubin A ($1600 : 400 = 4$).',
      art: () => `<svg viewBox="0 0 360 200" role="img" aria-label="Ubin kecil dan ubin besar">
          <rect x="40" y="110" width="70" height="70" fill="#BFDBFE" stroke="#2563EB" stroke-width="2.5"/>
          <text class="s-label" x="75" y="100" text-anchor="middle">20 cm</text><text class="v-label" x="75" y="152" text-anchor="middle">A</text>
          <rect x="180" y="40" width="140" height="140" fill="#BBF7D0" stroke="#0F9D58" stroke-width="2.5"/>
          <path d="M250 40 v140 M180 110 h140" stroke="#0F9D58" stroke-dasharray="5 5" stroke-width="1.5"/>
          <text class="s-label" x="250" y="30" text-anchor="middle">40 cm</text><text class="v-label" x="285" y="152" text-anchor="middle">B</text>
          <text class="v-label" x="215" y="80" text-anchor="middle">?</text>
        </svg>`
    },
    {
      id: 'motif', icon: 'pattern', title: 'Mengidentifikasi motif bangun kongruen',
      text: 'Motif lantai dibuat dari jajargenjang $ABCD$ yang dipotong sepanjang diagonal $AC$ menjadi dua segitiga. Pada jajargenjang, sisi yang berhadapan sama panjang.',
      ask: 'Kriteria apa yang membuktikan $\\triangle ABC \\cong \\triangle CDA$?', options: ['SSS', 'AA', 'Tidak kongruen'], ans: 0,
      explain: '$AB = CD$ dan $BC = DA$ (sisi berhadapan jajargenjang), serta $AC = CA$ (sisi bersama). Tiga pasang sisi sama panjang, jadi $\\triangle ABC \\cong \\triangle CDA$ (SSS). AA hanya menjamin sebangun.',
      art: () => `<svg viewBox="0 0 360 200" role="img" aria-label="Motif jajargenjang dengan diagonal">
          <polygon points="40,170 220,170 320,40 140,40" fill="#BFDBFE" stroke="#2563EB" stroke-width="2.5"/>
          <polygon points="40,170 220,170 320,40" fill="#BBF7D0" opacity=".8"/>
          <line x1="40" y1="170" x2="320" y2="40" stroke="#17324D" stroke-width="2.5"/>
          <text class="v-label" x="30" y="188">A</text><text class="v-label" x="222" y="190">B</text><text class="v-label" x="326" y="38">C</text><text class="v-label" x="124" y="36">D</text>
          <path d="M127 176 v-12 M133 176 v-12" stroke="#EA580C" stroke-width="2"/><path d="M227 34 v12 M233 34 v12" stroke="#EA580C" stroke-width="2"/>
          <path d="M265 102 l10 6" stroke="#EA580C" stroke-width="2"/><path d="M85 102 l10 6" stroke="#EA580C" stroke-width="2"/>
        </svg>`
    },
    {
      id: 'denah', icon: 'plan', title: 'Membuat denah bangunan',
      text: 'Denah rumah dibuat dengan skala $1 : 100$. Pada denah, sebuah kamar berukuran $4$ cm $\\times$ $3$ cm.',
      ask: 'Berapa luas kamar sebenarnya (dalam m²)?', unit: 'm²', ans: 12,
      explain: 'Ukuran sebenarnya: $4 \\times 100 = 400$ cm $= 4$ m dan $3 \\times 100 = 300$ cm $= 3$ m. Luas $= 4 \\times 3 = 12$ m².',
      art: () => `<svg viewBox="0 0 360 200" role="img" aria-label="Denah rumah">
          <rect x="30" y="20" width="300" height="160" fill="#fff" stroke="#17324D" stroke-width="4"/>
          <rect x="30" y="20" width="160" height="120" fill="#BFDBFE" stroke="#17324D" stroke-width="3"/>
          <path d="M190 140 h140 M250 20 v120" stroke="#17324D" stroke-width="3"/>
          <text class="v-label" x="110" y="85" text-anchor="middle">Kamar</text>
          <text class="s-label" x="110" y="14" text-anchor="middle">4 cm</text><text class="s-label" x="22" y="84" text-anchor="end">3 cm</text>
          <text x="290" y="170" font-size="12" font-weight="700" fill="#17324D" text-anchor="middle">Skala 1 : 100</text>
        </svg>`
    }
  ];

  function tabPenerapan() {
    return `
    <div class="card">
      <h2>${GM.icon('map', 24)} Penerapan dalam Kehidupan Sehari-hari</h2>
      <p>Kesebangunan dan kekongruenan dipakai setiap hari: dari mengukur benda tinggi hingga membuat denah. Jawab pertanyaan pada setiap kasus di bawah ini.</p>
    </div>
    <div class="grid grid-2">
      ${APPS.map((a) => `<div class="card app-card" data-app="${a.id}">
        <div style="display:flex;gap:12px;align-items:center"><div class="icon-bubble">${GM.icon(a.icon, 22)}</div><h3 style="margin:0">${a.title}</h3></div>
        <div class="figure grid-bg">${a.art()}</div>
        <p>${GM.md(a.text)}</p>
        <p><b>${GM.md(a.ask)}</b></p>
        ${a.options
          ? `<div class="btn-row">${a.options.map((o, i) => `<button class="btn btn-outline btn-sm" data-opt="${i}">${o}</button>`).join('')}</div>`
          : `<div class="answer-row"><input type="text" inputmode="decimal" aria-label="Jawaban" placeholder="Jawaban"><span class="unit">${a.unit}</span><button class="btn btn-primary btn-sm" data-check>Periksa</button></div>`}
        <div class="mini-result" aria-live="polite"></div>
      </div>`).join('')}
    </div>`;
  }

  function initPenerapan(panel) {
    const solved = GM.store.get().apps;
    APPS.forEach((a) => {
      const card = panel.querySelector(`[data-app="${a.id}"]`);
      const out = card.querySelector('.mini-result');
      const show = (right) => {
        out.innerHTML = right
          ? `<div class="feedback ok"><div class="f-ico">${GM.icon('check', 18, 3)}</div><div><strong>Benar!</strong>${GM.md(a.explain)}</div></div>`
          : `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div><strong>Belum tepat.</strong>Periksa kembali perbandingan sisi yang bersesuaian, lalu coba lagi.</div></div>`;
        if (right) GM.store.update((s) => { s.apps[a.id] = true; });
      };
      if (a.options) {
        card.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => show(+b.dataset.opt === a.ans)));
      } else {
        const inp = card.querySelector('input');
        const check = () => {
          const v = GM.parseNum(inp.value);
          if (isNaN(v)) { out.innerHTML = `<div class="feedback info"><div class="f-ico">${GM.icon('bulb', 18)}</div><div>Tuliskan jawaban berupa angka, misalnya 7 atau 2,5.</div></div>`; return; }
          show(Math.abs(v - a.ans) < 0.01);
        };
        card.querySelector('[data-check]').addEventListener('click', check);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      }
      if (solved[a.id]) out.innerHTML = `<div class="callout mint"><div class="callout-title">${GM.icon('check', 18)} Sudah kamu pecahkan</div><p>${GM.md(a.explain)}</p></div>`;
    });
  }

  /* ============ Halaman ============ */
  const RENDER = {
    kongruensi: [tabKongruensi, initKongruensi],
    'syarat-kongruen': [tabSyaratKongruen, initSyaratKongruen],
    sifat: [tabSifat, initSifat],
    kesebangunan: [tabKesebangunan, initKesebangunan],
    'syarat-sebangun': [tabSyaratSebangun, initSyaratSebangun],
    segiempat: [tabSegiempat, initSegiempat],
    teorema: [tabTeorema, initTeorema],
    penerapan: [tabPenerapan, initPenerapan]
  };

  function render(el, params) {
    let tab = params[0] && RENDER[params[0]] ? params[0] : 'kongruensi';
    GM.store.update((s) => { s.material[tab] = true; });
    const visited = GM.store.get().material;
    const idx = TABS.findIndex((t) => t.id === tab);
    const done = TABS.filter((t) => visited[t.id]).length;
    const prev = TABS[idx - 1], next = TABS[idx + 1];

    el.innerHTML = `<div class="container page">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('book', 14)} Materi Pembelajaran</span>
        <h1>Berkas Materi Detektif</h1>
        <p>Pelajari konsep kekongruenan dan kesebangunan langkah demi langkah. Setiap topik dilengkapi ilustrasi yang dapat kamu manipulasi.</p>
      </div>
      <div class="with-sidebar">
        <aside class="sidebar" aria-label="Daftar topik materi">
          <h4>Topik materi</h4>
          <div class="tab-list" role="tablist">
            ${TABS.map((t, i) => `<a class="tab-btn ${t.id === tab ? 'active' : ''} ${visited[t.id] ? 'visited' : ''}" href="#/materi/${t.id}" role="tab" aria-selected="${t.id === tab}" style="text-decoration:none"><span class="t-num">${i + 1}</span><span>${t.title}</span><span class="t-check">${GM.icon('check', 16, 3)}</span></a>`).join('')}
          </div>
          <div class="progress" aria-label="Progres materi"><span style="width:${(done / TABS.length) * 100}%"></span></div>
          <div class="side-foot">${done} dari ${TABS.length} topik sudah dibuka</div>
        </aside>
        <section class="tab-panel" id="tab-panel" role="tabpanel" aria-label="${TABS[idx].title}">
          ${RENDER[tab][0]()}
          <div class="tab-nav">
            ${prev ? `<a class="btn btn-outline" href="#/materi/${prev.id}">${GM.icon('left', 18)} ${prev.title}</a>` : '<span></span>'}
            ${next ? `<a class="btn btn-primary" href="#/materi/${next.id}">${next.title} ${GM.icon('right', 18)}</a>` : `<a class="btn btn-mint" href="#/misi">${GM.icon('target', 18)} Uji di Misi Detektif</a>`}
          </div>
        </section>
      </div>
    </div>`;
    RENDER[tab][1](el.querySelector('#tab-panel'));
    const act = el.querySelector('.tab-btn.active');
    if (act && act.scrollIntoView && window.innerWidth <= 900) act.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  GM.MaterialPage = { render, TABS };
})();
