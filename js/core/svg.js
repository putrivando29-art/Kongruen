/* Renderer SVG untuk bangun geometri.
   Semua bangun dihitung dalam koordinat cm, lalu dipetakan ke layar dengan skala yang sama,
   sehingga gambar selalu proporsional terhadap ukuran sebenarnya. */
(function () {
  const GM = window.GM;
  const geo = GM.geo;

  const COLORS = {
    a: { stroke: '#2563EB', fill: 'rgba(37,99,235,.13)' },
    b: { stroke: '#0F9D58', fill: 'rgba(34,197,94,.14)' },
    c: { stroke: '#7C3AED', fill: 'rgba(124,58,237,.12)' },
    ghost: { stroke: '#94A3B8', fill: 'rgba(148,163,184,.12)' },
    navy: { stroke: '#17324D', fill: 'rgba(23,50,77,.08)' }
  };
  const MARK = '#EA580C';

  const nrm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
  const f1 = (n) => Math.round(n * 10) / 10;

  // Layout baris: beberapa bangun diletakkan berdampingan, skala sama, alas sejajar.
  function layoutRow(shapes, W, H, pad, gap, extraTop) {
    const boxes = shapes.map((s) => geo.bbox(s.pts));
    const totalW = boxes.reduce((a, b) => a + b.w, 0) || 1;
    const maxH = Math.max(...boxes.map((b) => b.h)) || 1;
    const availH = H - 2 * pad - extraTop;
    const s = Math.min((W - 2 * pad - gap * (shapes.length - 1)) / totalW, availH / maxH);
    const usedW = totalW * s + gap * (shapes.length - 1);
    let x = (W - usedW) / 2;
    const base = pad + extraTop + (availH + maxH * s) / 2;
    return {
      scale: s,
      maps: boxes.map((b) => {
        const ox = x - b.minX * s;
        x += b.w * s + gap;
        return (p) => [ox + p[0] * s, base - (p[1] - b.minY) * s];
      })
    };
  }

  // Layout tetap: koordinat dunia langsung (untuk bangun yang bisa digeser).
  function layoutFixed(shapes, W, H, scale, origin) {
    const o = origin || [0, 0];
    const m = (p) => [(p[0] - o[0]) * scale, H - (p[1] - o[1]) * scale];
    return { scale, maps: shapes.map(() => m), toWorld: (x, y) => [x / scale + o[0], (H - y) / scale + o[1]] };
  }

  function drawShape(shape, sp, idx, opt) {
    const n = sp.length;
    const col = COLORS[shape.color || 'a'] || COLORS.a;
    const c = geo.centroid(sp);
    const angles = geo.angles(shape.pts);
    let o = `<g class="shape" data-shape="${idx}">`;
    const ptsAttr = sp.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
    const drag = shape.draggable ? ` data-drag="body" data-shape="${idx}" class="drag-body"` : '';
    o += `<polygon points="${ptsAttr}" fill="${shape.fill || col.fill}" stroke="${col.stroke}" stroke-width="${shape.strokeWidth || 2.5}" stroke-linejoin="round" ${shape.dashed ? 'stroke-dasharray="7 6"' : ''}${drag}/>`;

    // Sorotan sisi
    (shape.hlSides || []).forEach((i) => {
      const a = sp[i], b = sp[(i + 1) % n];
      o += `<line class="hl-side" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    });

    // Busur sudut
    for (let i = 0; i < n; i++) {
      const v = sp[i], p = sp[(i - 1 + n) % n], q = sp[(i + 1) % n];
      const u1 = nrm([p[0] - v[0], p[1] - v[1]]), u2 = nrm([q[0] - v[0], q[1] - v[1]]);
      const minLen = Math.min(Math.hypot(p[0] - v[0], p[1] - v[1]), Math.hypot(q[0] - v[0], q[1] - v[1]));
      const marks = (shape.angleMarks && shape.angleMarks[i]) || 0;
      const hl = (shape.hlAngles || []).includes(i);
      const label = shape.angleLabels === true ? GM.fmt(angles[i], 1) + '°' : (shape.angleLabels && shape.angleLabels[i]) || '';
      const isRight = Math.abs(angles[i] - 90) < 0.05 && shape.rightMarks !== false;
      const r = Math.max(10, Math.min(24, minLen * 0.3));
      const cross = u1[0] * u2[1] - u1[1] * u2[0];
      const sweep = cross > 0 ? 1 : 0;
      const part = opt.parts ? ` data-part="a${i}" data-shape="${idx}"` : '';
      if (isRight) {
        const s = Math.min(13, minLen * 0.25);
        const a = [v[0] + u1[0] * s, v[1] + u1[1] * s], b = [v[0] + (u1[0] + u2[0]) * s, v[1] + (u1[1] + u2[1]) * s], d = [v[0] + u2[0] * s, v[1] + u2[1] * s];
        o += `<path d="M${a[0]},${a[1]} L${b[0]},${b[1]} L${d[0]},${d[1]}" fill="${hl ? 'rgba(245,158,11,.5)' : 'none'}" stroke="${hl ? MARK : col.stroke}" stroke-width="1.8"${part}/>`;
      } else if (marks || hl || label || opt.parts) {
        const a = [v[0] + u1[0] * r, v[1] + u1[1] * r], b = [v[0] + u2[0] * r, v[1] + u2[1] * r];
        o += `<path d="M${v[0]},${v[1]} L${a[0]},${a[1]} A${r},${r} 0 0 ${sweep} ${b[0]},${b[1]} Z" class="${hl ? 'hl-angle' : ''}" fill="${hl ? '' : marks ? 'rgba(234,88,12,.14)' : 'rgba(255,255,255,0)'}" stroke="none"${part}/>`;
        const cnt = Math.max(marks, hl || label ? 1 : 0);
        for (let k = 0; k < cnt; k++) {
          const rr = r - k * 4.5;
          const a2 = [v[0] + u1[0] * rr, v[1] + u1[1] * rr], b2 = [v[0] + u2[0] * rr, v[1] + u2[1] * rr];
          o += `<path d="M${a2[0]},${a2[1]} A${rr},${rr} 0 0 ${sweep} ${b2[0]},${b2[1]}" fill="none" stroke="${marks || hl ? MARK : col.stroke}" stroke-width="1.8" pointer-events="none"/>`;
        }
      }
      if (label) {
        const bis = nrm([u1[0] + u2[0], u1[1] + u2[1]]);
        const d = (isRight ? 14 : r) + 15;
        o += `<text class="a-label" x="${v[0] + bis[0] * d}" y="${v[1] + bis[1] * d + 4}" text-anchor="middle" pointer-events="none">${GM.esc(label)}</text>`;
      }
    }

    // Tanda sisi sama (garis kecil), label panjang sisi, area klik sisi
    const sides = geo.sides(shape.pts);
    for (let i = 0; i < n; i++) {
      const a = sp[i], b = sp[(i + 1) % n];
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const d = nrm([b[0] - a[0], b[1] - a[1]]);
      let nv = [d[1], -d[0]];
      if ((m[0] - c[0]) * nv[0] + (m[1] - c[1]) * nv[1] < 0) nv = [-nv[0], -nv[1]];
      if (opt.parts) {
        o += `<line class="part-hit" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" data-part="s${i}" data-shape="${idx}"/>`;
      }
      const t = (shape.sideMarks && shape.sideMarks[i]) || 0;
      for (let k = 0; k < t; k++) {
        const off = (k - (t - 1) / 2) * 5;
        const cx = m[0] + d[0] * off, cy = m[1] + d[1] * off;
        o += `<line x1="${cx - nv[0] * 6}" y1="${cy - nv[1] * 6}" x2="${cx + nv[0] * 6}" y2="${cy + nv[1] * 6}" stroke="${MARK}" stroke-width="2" pointer-events="none"/>`;
      }
      let lbl = '';
      if (shape.sideLabels === true) lbl = GM.fmt(sides[i], 1) + ' cm';
      else if (Array.isArray(shape.sideLabels)) lbl = shape.sideLabels[i] || '';
      if (lbl) {
        const dist = 15;
        o += `<text class="s-label" x="${m[0] + nv[0] * dist}" y="${m[1] + nv[1] * dist + 4}" text-anchor="middle" pointer-events="none">${GM.esc(lbl)}</text>`;
      }
    }

    // Label titik
    if (shape.labels) {
      for (let i = 0; i < n; i++) {
        const v = sp[i];
        const u = nrm([v[0] - c[0], v[1] - c[1]]);
        o += `<text class="v-label" x="${v[0] + u[0] * 17}" y="${v[1] + u[1] * 17 + 5}" text-anchor="middle" pointer-events="none">${GM.esc(shape.labels[i] || '')}</text>`;
      }
    }
    // Titik pegangan untuk digeser
    if (shape.handles) {
      for (let i = 0; i < n; i++) {
        o += `<circle class="handle" cx="${sp[i][0]}" cy="${sp[i][1]}" r="9" fill="#fff" stroke="${col.stroke}" stroke-width="3" data-drag="v" data-shape="${idx}" data-v="${i}"><title>Geser titik ${GM.esc((shape.labels || [])[i] || '')}</title></circle>`;
      }
    } else {
      for (let i = 0; i < n; i++) o += `<circle cx="${sp[i][0]}" cy="${sp[i][1]}" r="3" fill="${col.stroke}" pointer-events="none"/>`;
    }
    if (shape.title) {
      const b = geo.bbox(sp);
      o += `<text class="fig-title" x="${(b.minX + b.maxX) / 2}" y="${opt.titleY}" text-anchor="middle">${GM.esc(shape.title)}</text>`;
    }
    o += '</g>';
    return o;
  }

  /**
   * Membuat string SVG.
   * shapes: [{ pts, labels, sideLabels, angleLabels, sideMarks, angleMarks, hlSides, hlAngles, color, title, dashed, handles, draggable }]
   * opts: { width, height, pad, gap, fixed: { scale, origin }, extra: fungsi(map, scale) -> string, parts }
   */
  function render(shapes, opts = {}) {
    const W = Math.round(opts.width || 600), H = Math.round(opts.height || 300);
    const pad = opts.pad ?? 34, gap = opts.gap ?? 60;
    const hasTitle = shapes.some((s) => s.title);
    const lay = opts.fixed ? layoutFixed(shapes, W, H, opts.fixed.scale, opts.fixed.origin) : layoutRow(shapes, W, H, pad, gap, hasTitle ? 16 : 0);
    let body = '';
    if (opts.under) body += opts.under(lay.maps, lay.scale);
    shapes.forEach((sh, i) => {
      const sp = sh.pts.map(lay.maps[i]);
      body += drawShape(sh, sp, i, { parts: opts.parts, titleY: 18 });
    });
    if (opts.extra) body += opts.extra(lay.maps, lay.scale);
    return { svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${GM.esc(opts.label || 'Ilustrasi geometri')}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`, lay, W, H };
  }

  // Menggambar ke elemen dan menggambar ulang saat lebar layar berubah.
  function mount(el, build, opts = {}) {
    const draw = () => {
      if (!el.isConnected) return;
      const W = Math.max(260, Math.min(opts.maxWidth || 900, el.clientWidth || 600));
      const H = opts.height ? (typeof opts.height === 'function' ? opts.height(W) : opts.height) : Math.round(W * (opts.aspect || 0.5));
      const spec = build(W, H);
      const r = render(spec.shapes, Object.assign({ width: W, height: H }, spec.opts || {}));
      el.innerHTML = r.svg;
      if (opts.after) opts.after(r, el);
      return r;
    };
    GM.onResize(draw);
    draw();
    return draw;
  }

  // Koordinat pointer dalam sistem viewBox SVG.
  function pointer(svg, evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const m = svg.getScreenCTM();
    if (!m) return [0, 0];
    const r = pt.matrixTransform(m.inverse());
    return [r.x, r.y];
  }

  GM.svg = { render, mount, pointer, COLORS, f1 };
})();
