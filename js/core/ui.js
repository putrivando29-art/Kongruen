/* Utilitas antarmuka: format angka, rumus (KaTeX), ikon, toast, modal. */
(function () {
  const GM = (window.GM = window.GM || {});

  /* ---------- Angka ---------- */
  // Format angka gaya Indonesia (koma desimal), buang nol di belakang.
  GM.fmt = function (n, d = 1) {
    if (!isFinite(n)) return '–';
    const f = Math.pow(10, d);
    let r = Math.round(n * f) / f;
    if (Object.is(r, -0)) r = 0;
    return String(r).replace('.', ',');
  };
  // Versi untuk KaTeX: koma desimal ditulis {,} agar tidak diberi spasi.
  GM.fmtTex = function (n, d = 1) {
    return GM.fmt(n, d).replace(',', '{,}');
  };
  // Membaca input angka yang mungkin memakai koma.
  GM.parseNum = function (s) {
    if (s === null || s === undefined) return NaN;
    const t = String(s).trim().replace(/\s/g, '').replace(',', '.');
    if (t === '' || !/^-?\d*\.?\d+$/.test(t)) return NaN;
    return parseFloat(t);
  };
  GM.clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  GM.esc = function (s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };

  /* ---------- Rumus ---------- */
  function fallbackTex(s) {
    return GM.esc(
      s.replace(/\\dfrac|\\tfrac/g, '\\frac')
        .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
        .replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\cong/g, '≅').replace(/\\sim/g, '~')
        .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\parallel/g, '∥').replace(/\\perp/g, '⊥')
        .replace(/\\neq/g, '≠').replace(/\\approx/g, '≈').replace(/\\leftrightarrow/g, '↔').replace(/\\Rightarrow/g, '⇒')
        .replace(/\^\{?\\circ\}?/g, '°').replace(/\\circ/g, '°').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
        .replace(/\^\{?2\}?/g, '²').replace(/_\{?(\d)\}?/g, (m, d) => '₀₁₂₃₄₅₆₇₈₉'[d])
        .replace(/\\(text|mathrm|textbf|overline)\{([^{}]*)\}/g, '$2').replace(/\\quad|\\qquad|\\,|\\;/g, ' ')
        .replace(/\\\\/g, ' ; ').replace(/\\[a-zA-Z]+/g, '').replace(/[{}]/g, '')
    );
  }
  GM.tex = function (src, display) {
    if (window.katex) {
      try {
        return window.katex.renderToString(src, { displayMode: !!display, throwOnError: false, strict: 'ignore' });
      } catch (e) { /* jatuh ke cadangan */ }
    }
    const t = fallbackTex(src);
    return display ? `<div class="tex-fallback" style="text-align:center">${t}</div>` : `<span class="tex-fallback">${t}</span>`;
  };
  // Mengubah $...$ (inline) dan $$...$$ (display) dalam teks menjadi rumus.
  GM.md = function (str) {
    return String(str)
      .replace(/\$\$([\s\S]+?)\$\$/g, (m, a) => GM.tex(a, true))
      .replace(/\$([^$]+?)\$/g, (m, a) => GM.tex(a, false));
  };
  GM.formula = (src) => `<div class="formula">${GM.tex(src, true)}</div>`;

  /* ---------- Ikon (SVG garis sederhana) ---------- */
  const P = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 5v16"/><path d="M8 7h7M8 11h5"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 10l1.5 1.5 3-3M8.5 16h7"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8 21h8M9.5 17h5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    hat: '<path d="M3 16c3 2 15 2 18 0"/><path d="M6 15.5l1.5-8.5c.2-1 1-1.5 2-1.2l2.5.7 2.5-.7c1-.3 1.8.2 2 1.2l1.5 8.5"/><path d="M6.8 12.5c3 1 7.4 1 10.4 0"/>',
    triangle: '<path d="M12 4l9 16H3z"/>',
    square: '<rect x="4" y="4" width="16" height="16" rx="1"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    medal: '<circle cx="12" cy="14" r="6"/><path d="M8.5 9L6 3h4l2 4 2-4h4l-2.5 6"/><path d="M12 11.5l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>',
    rotl: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>',
    rotr: '<path d="M20 12a8 8 0 1 1-2.4-5.7L20 8.5"/><path d="M20 4v4.5h-4.5"/>',
    mirror: '<path d="M12 3v18" stroke-dasharray="2 2.5"/><path d="M9 7L3 17h6zM15 7l6 10h-6z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    angle: '<path d="M4 20h16M4 20L15 5"/><path d="M10 20a6 6 0 0 0-2.3-4.8"/>',
    scale: '<path d="M4 20L20 4M14 4h6v6M4 14v6h6"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    tree: '<path d="M12 21v-5"/><path d="M12 3l6 8h-3l4 5H5l4-5H6z"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
    grid: '<rect x="4" y="4" width="16" height="16"/><path d="M4 12h16M12 4v16"/>',
    plan: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 12h9v8M12 4v4M16 12h5"/>',
    pattern: '<path d="M3 20L8 11l5 9zM8 11l5 9 5-9zM13 20l5-9 5 9" transform="translate(-1 -3)"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    shuffle: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'
  };
  GM.icon = function (name, size = 20, sw = 2) {
    return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  };

  /* ---------- Toast ---------- */
  GM.toast = function (title, msg, icon = 'medal') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.innerHTML = `<div class="t-ico">${GM.icon(icon, 22)}</div><div><strong>${GM.esc(title)}</strong><span>${GM.esc(msg)}</span></div>`;
    root.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3800);
  };

  /* ---------- Modal konfirmasi ---------- */
  GM.confirm = function (title, msg, okLabel = 'Ya, lanjutkan') {
    return new Promise((resolve) => {
      const back = document.createElement('div');
      back.className = 'modal-back';
      back.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mdl-t">
        <h3 id="mdl-t">${GM.esc(title)}</h3><p class="muted">${GM.esc(msg)}</p>
        <div class="btn-row" style="justify-content:flex-end">
          <button class="btn btn-outline" data-a="no">Batal</button>
          <button class="btn btn-primary" data-a="yes">${GM.esc(okLabel)}</button>
        </div></div>`;
      const done = (v) => { back.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') done(false); };
      back.addEventListener('click', (e) => {
        if (e.target === back) return done(false);
        const a = e.target.closest('[data-a]');
        if (a) done(a.dataset.a === 'yes');
      });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(back);
      back.querySelector('[data-a="yes"]').focus();
    });
  };

  /* ---------- Registri gambar yang digambar ulang saat ukuran layar berubah ---------- */
  const redraws = new Set();
  GM.onResize = function (fn) { redraws.add(fn); return fn; };
  GM.clearResize = function () { redraws.clear(); };
  let rt = null;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) < 2) return; // abaikan resize tinggi (keyboard HP)
    lastW = window.innerWidth;
    clearTimeout(rt);
    rt = setTimeout(() => redraws.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }), 120);
  });

  GM.redrawAll = function () { redraws.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); };

  /* ---------- Bantuan warna (pembelajaran berdiferensiasi) ---------- */
  GM.colorHelp = () => !!(GM.store && GM.store.get().settings && GM.store.get().settings.colorHelp);
  GM.colorToggle = function () {
    return `<label class="switch color-toggle" title="Pasangan sisi/sudut seletak diberi warna yang sama"><input type="checkbox" data-color-toggle ${GM.colorHelp() ? 'checked' : ''}> Bantuan warna (sisi &amp; sudut seletak)</label>`;
  };
  // Satu pendengar global untuk semua sakelar bantuan warna.
  document.addEventListener('change', (e) => {
    const t = e.target.closest && e.target.closest('[data-color-toggle]');
    if (!t) return;
    GM.store.update((s) => { s.settings.colorHelp = t.checked; });
    document.querySelectorAll('[data-color-toggle]').forEach((x) => { x.checked = t.checked; });
    GM.redrawAll();
  });

  GM.go = function (hash) { if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = hash; };
})();
