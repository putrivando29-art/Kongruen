/* Perhitungan geometri. Titik = [x, y] dalam satuan cm, sumbu y ke atas. */
(function () {
  const GM = window.GM;
  const D2R = Math.PI / 180;

  const geo = {
    D2R,
    dist: (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]),

    // Besar sudut di titik v (derajat) antara ruas v-p dan v-q.
    angleAt(p, v, q) {
      const a = [p[0] - v[0], p[1] - v[1]];
      const b = [q[0] - v[0], q[1] - v[1]];
      const la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]);
      if (!la || !lb) return 0;
      const c = (a[0] * b[0] + a[1] * b[1]) / (la * lb);
      return Math.acos(Math.max(-1, Math.min(1, c))) / D2R;
    },
    // sides[i] = panjang ruas titik i ke titik i+1
    sides(pts) { return pts.map((p, i) => geo.dist(p, pts[(i + 1) % pts.length])); },
    // angles[i] = sudut dalam di titik i
    angles(pts) {
      const n = pts.length;
      return pts.map((v, i) => geo.angleAt(pts[(i - 1 + n) % n], v, pts[(i + 1) % n]));
    },
    perimeter(pts) { return geo.sides(pts).reduce((a, b) => a + b, 0); },
    area(pts) {
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        s += x1 * y2 - x2 * y1;
      }
      return Math.abs(s) / 2;
    },

    /* ---------- Segitiga ---------- */
    // Segitiga dari tiga sisi: AB, BC, CA. A=(0,0), B=(AB,0), C di atas.
    triSSS(AB, BC, CA) {
      const x = (CA * CA + AB * AB - BC * BC) / (2 * AB);
      const y = Math.sqrt(Math.max(0, CA * CA - x * x));
      return [[0, 0], [AB, 0], [x, y]];
    },
    // Segitiga dari dua sisi dan sudut apit di A.
    triSAS(AB, AC, angA) {
      return [[0, 0], [AB, 0], [AC * Math.cos(angA * D2R), AC * Math.sin(angA * D2R)]];
    },
    // Segitiga dari dua sudut dan sisi apitnya: angA di A, angB di B, sisi AB.
    triASA(angA, AB, angB) {
      const angC = 180 - angA - angB;
      const AC = (AB * Math.sin(angB * D2R)) / Math.sin(angC * D2R);
      return [[0, 0], [AB, 0], [AC * Math.cos(angA * D2R), AC * Math.sin(angA * D2R)]];
    },
    // Posisi baru (putar dan/atau cermin) lalu digeser ke kuadran positif.
    place(pts, deg, flip) {
      let q = flip ? geo.reflectV(pts) : pts;
      q = geo.rotate(q, deg || 0);
      return geo.normalize(q);
    },
    validTri(a, b, c) { return a + b > c + 1e-9 && a + c > b + 1e-9 && b + c > a + 1e-9; },

    /* ---------- Transformasi ---------- */
    centroid(pts) {
      const n = pts.length;
      return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
    },
    bbox(pts) {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
    },
    translate: (pts, dx, dy) => pts.map((p) => [p[0] + dx, p[1] + dy]),
    rotate(pts, deg, c) {
      c = c || geo.centroid(pts);
      const r = deg * D2R, cs = Math.cos(r), sn = Math.sin(r);
      return pts.map(([x, y]) => [c[0] + (x - c[0]) * cs - (y - c[1]) * sn, c[1] + (x - c[0]) * sn + (y - c[1]) * cs]);
    },
    // Pencerminan terhadap garis vertikal x = c[0]
    reflectV(pts, c) {
      c = c || geo.centroid(pts);
      return pts.map(([x, y]) => [2 * c[0] - x, y]);
    },
    scale(pts, k, c) {
      c = c || geo.centroid(pts);
      return pts.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
    },
    // Geser agar kotak pembatas mulai di (0,0)
    normalize(pts) {
      const b = geo.bbox(pts);
      return geo.translate(pts, -b.minX, -b.minY);
    },

    /* ---------- Segiempat ---------- */
    QUAD_TYPES: {
      persegi: {
        name: 'Persegi',
        params: [{ id: 's', label: 'Sisi', min: 1, max: 8, step: 0.5, unit: 'cm', def: 4 }]
      },
      persegipanjang: {
        name: 'Persegi panjang',
        params: [
          { id: 'p', label: 'Panjang', min: 1, max: 9, step: 0.5, unit: 'cm', def: 6 },
          { id: 'l', label: 'Lebar', min: 1, max: 8, step: 0.5, unit: 'cm', def: 4 }
        ]
      },
      jajargenjang: {
        name: 'Jajargenjang',
        params: [
          { id: 'a', label: 'Alas', min: 1, max: 8, step: 0.5, unit: 'cm', def: 6 },
          { id: 'b', label: 'Sisi miring', min: 1, max: 7, step: 0.5, unit: 'cm', def: 4 },
          { id: 't', label: 'Sudut lancip', min: 30, max: 85, step: 5, unit: '°', def: 60 }
        ]
      },
      belahketupat: {
        name: 'Belah ketupat',
        params: [
          { id: 's', label: 'Sisi', min: 1, max: 7, step: 0.5, unit: 'cm', def: 4 },
          { id: 't', label: 'Sudut lancip', min: 30, max: 85, step: 5, unit: '°', def: 60 }
        ]
      },
      trapesium: {
        name: 'Trapesium',
        params: [
          { id: 'a', label: 'Sisi sejajar bawah', min: 2, max: 9, step: 0.5, unit: 'cm', def: 7 },
          { id: 'b', label: 'Sisi sejajar atas', min: 1, max: 8.5, step: 0.5, unit: 'cm', def: 3 },
          { id: 'h', label: 'Tinggi', min: 1, max: 6, step: 0.5, unit: 'cm', def: 3 },
          { id: 'x', label: 'Geser sisi atas', min: 0, max: 6, step: 0.5, unit: 'cm', def: 2 }
        ]
      },
      layanglayang: {
        name: 'Layang-layang',
        params: [
          { id: 'p', label: 'Sisi pendek', min: 1, max: 6, step: 0.5, unit: 'cm', def: 3 },
          { id: 'q', label: 'Sisi panjang', min: 1.5, max: 8, step: 0.5, unit: 'cm', def: 5 },
          { id: 't', label: 'Sudut puncak', min: 40, max: 150, step: 5, unit: '°', def: 100 }
        ]
      }
    },
    defaultParams(type) {
      const o = {};
      geo.QUAD_TYPES[type].params.forEach((p) => (o[p.id] = p.def));
      return o;
    },
    // Menyesuaikan parameter agar bangun tetap sah (mis. trapesium: atas < bawah).
    fixParams(type, p) {
      const q = Object.assign({}, p);
      if (type === 'trapesium') {
        if (q.b > q.a - 0.5) q.b = Math.max(1, q.a - 0.5);
        if (q.x > q.a - q.b + 1) q.x = q.a - q.b + 1;
      }
      if (type === 'layanglayang' && q.q <= q.p) q.q = q.p + 0.5;
      return q;
    },
    // Titik-titik segiempat, berlawanan arah jarum jam.
    quad(type, p) {
      const r = D2R;
      switch (type) {
        case 'persegi': return [[0, 0], [p.s, 0], [p.s, p.s], [0, p.s]];
        case 'persegipanjang': return [[0, 0], [p.p, 0], [p.p, p.l], [0, p.l]];
        case 'jajargenjang': {
          const dx = p.b * Math.cos(p.t * r), dy = p.b * Math.sin(p.t * r);
          return [[0, 0], [p.a, 0], [p.a + dx, dy], [dx, dy]];
        }
        case 'belahketupat': {
          const dx = p.s * Math.cos(p.t * r), dy = p.s * Math.sin(p.t * r);
          return [[0, 0], [p.s, 0], [p.s + dx, dy], [dx, dy]];
        }
        case 'trapesium': return [[0, 0], [p.a, 0], [p.x + p.b, p.h], [p.x, p.h]];
        case 'layanglayang': {
          // Puncak T di atas; dua sisi pendek membentuk sudut puncak t.
          const hx = p.p * Math.sin((p.t / 2) * r), hy = p.p * Math.cos((p.t / 2) * r);
          const drop = Math.sqrt(Math.max(0.0001, p.q * p.q - hx * hx));
          const T = [0, 0], L = [-hx, -hy], B = [0, -hy - drop], R = [hx, -hy];
          return geo.normalize([T, L, B, R]);
        }
      }
      return [];
    },

    /* ---------- Pencocokan dua poligon ----------
       Mencoba semua korespondensi titik (putaran dan pencerminan urutan),
       lalu memilih yang paling cocok. Hasil berdasarkan ukuran, bukan gambar. */
    match(P, Q, tolAngle = 0.5, tolRatio = 0.01) {
      const n = P.length;
      if (Q.length !== n) return null;
      const aP = geo.angles(P), aQ = geo.angles(Q), sP = geo.sides(P), sQ = geo.sides(Q);
      let best = null;
      for (const o of [1, -1]) {
        for (let s = 0; s < n; s++) {
          const map = [];
          for (let i = 0; i < n; i++) map.push(((s + o * i) % n + n) % n);
          const angDiff = Math.max(...aP.map((a, i) => Math.abs(a - aQ[map[i]])));
          const ratios = sP.map((len, i) => {
            const j = map[i], j2 = map[(i + 1) % n];
            // ruas Q antara titik j dan j2
            const lenQ = geo.dist(Q[j], Q[j2]);
            return lenQ / len;
          });
          const mean = ratios.reduce((a, b) => a + b, 0) / n;
          const spread = (Math.max(...ratios) - Math.min(...ratios)) / mean;
          const cost = angDiff / 10 + spread * 10;
          if (!best || cost < best.cost - 1e-9) best = { map, angDiff, ratios, k: mean, spread, cost };
        }
      }
      best.anglesEqual = best.angDiff < tolAngle;
      best.ratiosEqual = best.spread < tolRatio;
      best.similar = best.anglesEqual && best.ratiosEqual;
      best.congruent = best.similar && Math.abs(best.k - 1) < tolRatio;
      return best;
    }
  };

  GM.geo = geo;
})();
