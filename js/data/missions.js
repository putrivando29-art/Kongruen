/* Data 10 kasus Misi Detektif: satu kasus untuk setiap Tujuan Pembelajaran (TP 1 sampai TP 10). */
(function () {
  const GM = window.GM;
  const geo = GM.geo;

  const REL = [
    { key: 'A', text: 'Kongruen' },
    { key: 'B', text: 'Sebangun tetapi tidak kongruen' },
    { key: 'C', text: 'Tidak kongruen dan tidak sebangun' }
  ];

  // Bangun kedua digambar dengan posisi/arah berbeda agar siswa tidak menebak dari tampilan.
  const turn = (pts, deg, flip) => geo.place(pts, deg, flip);

  GM.MISSIONS = [
    /* ================= TAHAP 1: MEMAHAMI KONSEP ================= */
    {
      id: 1, tp: 1,
      title: 'Dua Segitiga Identik',
      story: 'Di meja laboratorium ditemukan dua kepingan karton segitiga. Petugas curiga salah satunya adalah salinan dari yang lain. Buktikan dengan ukuran, bukan dengan tebakan!',
      given: [
        'Segitiga $ABC$: $AB = 3$ cm, $BC = 4$ cm, $CA = 5$ cm.',
        'Segitiga $DEF$: $DE = 3$ cm, $EF = 4$ cm, $FD = 5$ cm.'
      ],
      question: 'Apakah kedua segitiga kongruen?',
      options: REL,
      answer: 'A',
      hints: [
        'Pasangkan sisi-sisi yang bersesuaian: sisi terpendek dengan sisi terpendek, sisi terpanjang dengan sisi terpanjang.',
        'Jika setiap pasang sisi bersesuaian sama panjang, kriteria apa yang terpenuhi? Ingat singkatan S-S-S.'
      ],
      steps: [
        'Pasangkan sisi-sisi yang bersesuaian: $AB \\leftrightarrow DE$, $BC \\leftrightarrow EF$, $CA \\leftrightarrow FD$.',
        'Bandingkan panjangnya: $AB = DE = 3$ cm, $BC = EF = 4$ cm, $CA = FD = 5$ cm.',
        'Ketiga pasang sisi bersesuaian sama panjang, sehingga kriteria SSS (Sisi-Sisi-Sisi) terpenuhi. Faktor skalanya $k = \\frac{3}{3} = 1$.',
        'Kesimpulan: $\\triangle ABC \\cong \\triangle DEF$. Kedua segitiga kongruen berdasarkan kriteria SSS, walaupun posisinya digambar berbeda.'
      ],
      figure() {
        const A = geo.triSSS(3, 4, 5);
        return [
          { pts: A, labels: ['A', 'B', 'C'], sideLabels: true, color: 'a', title: '△ABC' },
          { pts: turn(A, 150, true), labels: ['D', 'E', 'F'], sideLabels: true, color: 'b', title: '△DEF' }
        ];
      }
    },
    {
      id: 2, tp: 2,
      title: 'Ubin Kembar Palsu',
      story: 'Seorang tukang mengaku memasang dua ubin yang "sama persis" karena semua sisinya sama panjang. Detektif harus memeriksa apakah klaim itu benar.',
      given: [
        'Persegi $ABCD$: semua sisi $4$ cm, semua sudut $90^\\circ$.',
        'Belah ketupat $PQRS$: semua sisi $4$ cm, $\\angle P = 60^\\circ$.'
      ],
      question: 'Bagaimana hubungan kedua segiempat?',
      options: REL,
      answer: 'C',
      hints: [
        'Pada segiempat, memeriksa sisi saja belum cukup. Periksa juga keempat pasang sudutnya.',
        'Pada belah ketupat, sudut yang berhadapan sama besar dan dua sudut yang berdekatan berjumlah $180^\\circ$. Berapa besar $\\angle Q$?'
      ],
      steps: [
        'Sisi bersesuaian: semua sisi $4$ cm, jadi perbandingan sisinya $\\frac{4}{4} = 1$.',
        'Sudut bersesuaian: persegi bersudut $90^\\circ$, sedangkan belah ketupat bersudut $\\angle P = \\angle R = 60^\\circ$ dan $\\angle Q = \\angle S = 180^\\circ - 60^\\circ = 120^\\circ$.',
        'Ada sudut bersesuaian yang tidak sama ($90^\\circ \\neq 60^\\circ$). Syarat kongruen (semua sisi <b>dan</b> semua sudut sama) tidak terpenuhi, dan syarat sebangun (semua sudut sama) juga tidak terpenuhi.',
        'Kesimpulan: kedua segiempat tidak kongruen dan tidak sebangun. Klaim tukang keliru: pada segiempat, sisi yang sama panjang belum menjamin kekongruenan.'
      ],
      figure() {
        return [
          { pts: geo.quad('persegi', { s: 4 }), labels: ['A', 'B', 'C', 'D'], sideLabels: true, angleLabels: true, color: 'a', title: 'Persegi ABCD' },
          { pts: geo.quad('belahketupat', { s: 4, t: 60 }), labels: ['P', 'Q', 'R', 'S'], sideLabels: true, angleLabels: true, color: 'b', title: 'Belah ketupat PQRS' }
        ];
      }
    },
    {
      id: 3, tp: 3,
      title: 'Segitiga Hasil Pembesaran',
      story: 'Sebuah foto barang bukti diperbesar oleh tim forensik. Tugasmu memastikan apakah bentuk segitiga pada foto tetap sama setelah diperbesar.',
      given: [
        'Segitiga pertama: sisi $3$ cm, $4$ cm, dan $5$ cm.',
        'Segitiga kedua: sisi $6$ cm, $8$ cm, dan $10$ cm.'
      ],
      question: 'Bagaimana hubungan kedua segitiga?',
      options: REL,
      answer: 'B',
      hints: [
        'Hitung perbandingan setiap pasang sisi bersesuaian: sisi segitiga kedua dibagi sisi segitiga pertama.',
        'Jika semua perbandingan bernilai sama, bangun itu sebangun. Kongruen hanya jika perbandingannya tepat 1.'
      ],
      steps: [
        'Pasangkan sisi bersesuaian dari yang terpendek: $3 \\leftrightarrow 6$, $4 \\leftrightarrow 8$, $5 \\leftrightarrow 10$.',
        'Hitung perbandingannya: $$\\frac{6}{3} = \\frac{8}{4} = \\frac{10}{5} = 2$$',
        'Ketiga perbandingan sama, sehingga kedua segitiga sebangun (SSS sebanding) dengan faktor skala $k = 2$.',
        'Karena $k = 2 \\neq 1$, ukuran kedua segitiga berbeda. Jadi kedua segitiga sebangun tetapi tidak kongruen.'
      ],
      figure() {
        return [
          { pts: geo.triSSS(3, 4, 5), labels: ['A', 'B', 'C'], sideLabels: true, color: 'a', title: 'Segitiga 1' },
          { pts: geo.triSSS(6, 8, 10), labels: ['P', 'Q', 'R'], sideLabels: true, color: 'b', title: 'Segitiga 2' }
        ];
      }
    },
    {
      id: 4, tp: 4,
      title: 'Persegi yang Sebangun',
      story: 'Dua ubin persegi ditemukan di gudang. Kepala gudang ingin tahu apakah kedua ubin itu memiliki hubungan geometri tertentu.',
      given: [
        'Persegi $A$ memiliki panjang sisi $4$ cm.',
        'Persegi $B$ memiliki panjang sisi $8$ cm.'
      ],
      question: 'Bagaimana hubungan kedua persegi?',
      options: REL,
      answer: 'B',
      hints: [
        'Semua sudut persegi besarnya $90^\\circ$. Jadi syarat sudut sudah pasti terpenuhi.',
        'Sekarang periksa perbandingan sisinya. Apakah perbandingannya sama untuk semua sisi, dan apakah nilainya 1?'
      ],
      steps: [
        'Sudut bersesuaian: semua sudut persegi $A$ dan persegi $B$ besarnya $90^\\circ$, jadi sama besar.',
        'Perbandingan sisi bersesuaian: $$\\frac{8}{4} = \\frac{8}{4} = \\frac{8}{4} = \\frac{8}{4} = 2$$',
        'Kedua syarat kesebangunan terpenuhi, dengan faktor skala $k = 2$. Perbandingan luasnya $\\frac{L_B}{L_A} = k^2 = \\frac{64}{16} = 4$.',
        'Karena $k = 2 \\neq 1$, panjang sisinya berbeda. Kedua persegi sebangun tetapi tidak kongruen.'
      ],
      figure() {
        return [
          { pts: geo.quad('persegi', { s: 4 }), labels: ['A₁', 'A₂', 'A₃', 'A₄'], sideLabels: ['4 cm', '4 cm', '4 cm', '4 cm'], color: 'a', title: 'Persegi A' },
          { pts: geo.quad('persegi', { s: 8 }), labels: ['B₁', 'B₂', 'B₃', 'B₄'], sideLabels: ['8 cm', '8 cm', '8 cm', '8 cm'], color: 'b', title: 'Persegi B' }
        ];
      }
    },

    /* ================= TAHAP 2: MENENTUKAN UKURAN ================= */
    {
      id: 5, tp: 5,
      title: 'Variabel yang Tersembunyi',
      story: 'Catatan ukuran sebuah segitiga salinan ditulis dengan kode aljabar oleh pelaku. Pecahkan kodenya dengan memasangkan unsur yang seletak!',
      given: [
        '$\\triangle ABC \\cong \\triangle DEF$.',
        'Pada $\\triangle ABC$: $AB = 7$ cm, $\\angle A = 50^\\circ$, $\\angle B = 70^\\circ$.',
        'Pada $\\triangle DEF$: $DE = (2x + 1)$ cm dan $\\angle F = (3y)^\\circ$.'
      ],
      question: 'Tentukan nilai $x$ dan $y$.',
      options: [
        { key: 'A', text: '$x = 3$ dan $y = 20$' },
        { key: 'B', text: '$x = 4$ dan $y = 20$' },
        { key: 'C', text: '$x = 3$ dan $y = 60$' }
      ],
      answer: 'A',
      hints: [
        'Urutan huruf pada notasi $\\triangle ABC \\cong \\triangle DEF$ menunjukkan pasangan titik: $A \\leftrightarrow D$, $B \\leftrightarrow E$, $C \\leftrightarrow F$. Sisi $DE$ seletak dengan sisi apa?',
        '$\\angle F$ seletak dengan $\\angle C$. Besar $\\angle C$ dapat dihitung dari jumlah sudut segitiga $180^\\circ$.'
      ],
      steps: [
        'Dari notasi, $A \\leftrightarrow D$, $B \\leftrightarrow E$, $C \\leftrightarrow F$. Maka $DE$ seletak dengan $AB$, dan $\\angle F$ seletak dengan $\\angle C$.',
        'Sisi seletak sama panjang: $2x + 1 = 7$, sehingga $2x = 6$ dan $x = 3$.',
        'Hitung $\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$.',
        'Sudut seletak sama besar: $3y = 60$, sehingga $y = 20$. Jawaban: $x = 3$ dan $y = 20$.'
      ],
      figure() {
        const A = geo.triASA(50, 7, 70);
        return [
          { pts: A, labels: ['A', 'B', 'C'], sideLabels: ['7 cm', '', ''], angleLabels: ['50°', '70°', '?'], color: 'a', title: '△ABC' },
          { pts: turn(A, 200, true), labels: ['D', 'E', 'F'], sideLabels: ['(2x + 1) cm', '', ''], angleLabels: ['', '', '(3y)°'], color: 'b', title: '△DEF' }
        ];
      },
      pairs: true
    },
    {
      id: 6, tp: 6,
      title: 'Bingkai Jendela Kembar',
      story: 'Dua bingkai kaca berbentuk jajargenjang dibuat kongruen. Satu bingkai rusak dan ukurannya harus dipulihkan dari bingkai yang masih utuh.',
      given: [
        'Jajargenjang $ABCD \\cong$ jajargenjang $PQRS$.',
        '$AB = 6$ cm, $BC = 4$ cm, $\\angle A = 70^\\circ$.'
      ],
      question: 'Tentukan panjang $RS$ dan besar $\\angle Q$.',
      options: [
        { key: 'A', text: '$RS = 6$ cm dan $\\angle Q = 110^\\circ$' },
        { key: 'B', text: '$RS = 4$ cm dan $\\angle Q = 70^\\circ$' },
        { key: 'C', text: '$RS = 6$ cm dan $\\angle Q = 70^\\circ$' }
      ],
      answer: 'A',
      hints: [
        'Dari notasi $ABCD \\cong PQRS$: $A \\leftrightarrow P$, $B \\leftrightarrow Q$, $C \\leftrightarrow R$, $D \\leftrightarrow S$. Jadi $RS$ seletak dengan $CD$, dan $\\angle Q$ seletak dengan $\\angle B$.',
        'Ingat sifat jajargenjang: sisi yang berhadapan sama panjang, dan dua sudut yang berdekatan berjumlah $180^\\circ$.'
      ],
      steps: [
        'Pasangan seletak: $RS \\leftrightarrow CD$ dan $\\angle Q \\leftrightarrow \\angle B$.',
        'Pada jajargenjang, $CD = AB = 6$ cm. Maka $RS = CD = 6$ cm.',
        'Sudut berdekatan pada jajargenjang berjumlah $180^\\circ$: $\\angle B = 180^\\circ - 70^\\circ = 110^\\circ$. Maka $\\angle Q = \\angle B = 110^\\circ$.',
        'Pemeriksaan: jumlah sudut segiempat $70^\\circ + 110^\\circ + 70^\\circ + 110^\\circ = 360^\\circ$. Jawaban A.'
      ],
      figure() {
        const A = geo.quad('jajargenjang', { a: 6, b: 4, t: 70 });
        return [
          { pts: A, labels: ['A', 'B', 'C', 'D'], sideLabels: ['6 cm', '4 cm', '', ''], angleLabels: ['70°', '', '', ''], color: 'a', title: 'ABCD' },
          { pts: turn(A, 180, false), labels: ['P', 'Q', 'R', 'S'], sideLabels: ['', '', '?', ''], angleLabels: ['', '?', '', ''], color: 'b', title: 'PQRS' }
        ];
      },
      pairs: true
    },
    {
      id: 7, tp: 7,
      title: 'Misteri Faktor Skala',
      story: 'Seorang arsitek membuat model segitiga dan versi besarnya. Catatan faktor skala dan satu ukuran sisinya hilang. Temukan kembali!',
      given: [
        '$\\triangle ABC \\sim \\triangle PQR$.',
        '$AB = 5$ cm, $BC = 7$ cm, $CA = 9$ cm.',
        '$PQ = 10$ cm, $QR = x$ cm, $RP = 18$ cm.'
      ],
      question: 'Tentukan faktor skala $k$ dari $\\triangle ABC$ ke $\\triangle PQR$ dan nilai $x$.',
      options: [
        { key: 'A', text: '$k = 2$ dan $x = 14$' },
        { key: 'B', text: '$k = 2$ dan $x = 12$' },
        { key: 'C', text: '$k = 3$ dan $x = 21$' }
      ],
      answer: 'A',
      hints: [
        'Faktor skala dari bangun pertama ke bangun kedua: $k = \\dfrac{\\text{sisi bangun kedua}}{\\text{sisi bangun pertama}}$ untuk sisi yang seletak.',
        'Susun perbandingan senilai: $\\dfrac{QR}{BC} = \\dfrac{PQ}{AB}$.'
      ],
      steps: [
        'Pasangan seletak: $AB \\leftrightarrow PQ$, $BC \\leftrightarrow QR$, $CA \\leftrightarrow RP$.',
        'Faktor skala: $k = \\frac{PQ}{AB} = \\frac{10}{5} = 2$. Periksa: $\\frac{RP}{CA} = \\frac{18}{9} = 2$.',
        'Perbandingan senilai: $\\frac{x}{7} = \\frac{10}{5}$, sehingga $5x = 70$ dan $x = 14$ (sama dengan $k \\times BC = 2 \\times 7$).',
        'Jawaban: $k = 2$ dan $x = 14$. Seluruh sisi mengalami pembesaran dua kali.'
      ],
      figure() {
        return [
          { pts: geo.triSSS(5, 7, 9), labels: ['A', 'B', 'C'], sideLabels: true, color: 'a', title: '△ABC' },
          { pts: geo.triSSS(10, 14, 18), labels: ['P', 'Q', 'R'], sideLabels: ['10 cm', 'x', '18 cm'], color: 'b', title: '△PQR' }
        ];
      },
      pairs: true
    },
    {
      id: 8, tp: 8,
      title: 'Trapesium di Cetak Biru',
      story: 'Cetak biru sebuah taman memuat dua kolam berbentuk trapesium yang sebangun. Sebagian ukuran kolam besar terhapus air hujan.',
      given: [
        'Trapesium $ABCD \\sim$ trapesium $PQRS$ dengan $AB \\parallel DC$ dan $PQ \\parallel SR$.',
        '$AB = 10$ m, $CD = 4$ m, $AD = 5$ m.',
        '$PQ = 15$ m.'
      ],
      question: 'Tentukan panjang $RS$ dan $PS$.',
      options: [
        { key: 'A', text: '$RS = 6$ m dan $PS = 7{,}5$ m' },
        { key: 'B', text: '$RS = 6$ m dan $PS = 5$ m' },
        { key: 'C', text: '$RS = 9$ m dan $PS = 7{,}5$ m' }
      ],
      answer: 'A',
      hints: [
        'Tentukan dulu faktor skala dari pasangan sisi seletak yang keduanya diketahui: $AB$ dan $PQ$.',
        'Setiap sisi trapesium besar = $k \\times$ sisi seletaknya pada trapesium kecil.'
      ],
      steps: [
        'Pasangan seletak: $AB \\leftrightarrow PQ$, $CD \\leftrightarrow RS$, $DA \\leftrightarrow SP$.',
        'Faktor skala: $k = \\frac{PQ}{AB} = \\frac{15}{10} = 1{,}5$.',
        '$RS = 1{,}5 \\times CD = 1{,}5 \\times 4 = 6$ m dan $PS = 1{,}5 \\times AD = 1{,}5 \\times 5 = 7{,}5$ m.',
        'Sudut-sudut seletak tetap sama besar (misalnya $\\angle P = \\angle A$), karena kesebangunan hanya mengubah ukuran sisi. Jawaban A.'
      ],
      figure() {
        return [
          { pts: geo.quad('trapesium', { a: 10, b: 4, h: 4, x: 3 }), labels: ['A', 'B', 'C', 'D'], sideLabels: ['10 m', '5 m', '4 m', '5 m'], color: 'a', title: 'ABCD' },
          { pts: geo.quad('trapesium', { a: 15, b: 6, h: 6, x: 4.5 }), labels: ['P', 'Q', 'R', 'S'], sideLabels: ['15 m', '', '?', '?'], color: 'b', title: 'PQRS' }
        ];
      },
      pairs: true
    },

    /* ================= TAHAP 3: MEMECAHKAN MASALAH ================= */
    {
      id: 9, tp: 9,
      title: 'Lebar Sungai Tanpa Menyeberang',
      story: 'Detektif harus mengetahui lebar sungai, tetapi tidak boleh menyeberang. Ia memakai patok dan segitiga kongruen di tepi sungai.',
      given: [
        'Pohon $B$ di seberang tepat berhadapan dengan titik $A$, sehingga $AB \\perp$ tepi sungai.',
        'Detektif berjalan menyusuri tepi: $AC = CD = 20$ m.',
        'Dari $D$ ia berjalan tegak lurus menjauhi sungai sampai titik $E$ yang segaris dengan $C$ dan $B$. Ternyata $DE = 32$ m.'
      ],
      question: 'Berapa lebar sungai $AB$?',
      options: [
        { key: 'A', text: '$20$ m' },
        { key: 'B', text: '$32$ m' },
        { key: 'C', text: '$40$ m' }
      ],
      answer: 'B',
      hints: [
        'Bandingkan $\\triangle ABC$ dan $\\triangle DEC$. Sudut apa saja yang sama besar? Perhatikan sudut siku-siku dan sudut bertolak belakang di $C$.',
        'Dua sudut dan sisi yang diapitnya sama: kriteria apa? Setelah kongruen, sisi seletak sama panjang.'
      ],
      steps: [
        '$\\angle BAC = \\angle EDC = 90^\\circ$ (keduanya tegak lurus tepi sungai).',
        '$AC = DC = 20$ m, dan $\\angle ACB = \\angle DCE$ karena keduanya sudut bertolak belakang.',
        'Dua sudut dan sisi yang diapitnya sama, maka $\\triangle ABC \\cong \\triangle DEC$ (ASA).',
        'Sisi seletak sama panjang: $AB = DE = 32$ m. Jadi lebar sungai $32$ m.'
      ],
      art() {
        const s = 4; // 4 px per meter
        const A = [60, 148], B = [60, 148 - 32 * s], C = [60 + 20 * s, 148], D = [60 + 40 * s, 148], E = [60 + 40 * s, 148 + 32 * s];
        return `<svg viewBox="0 0 300 300" role="img" aria-label="Pengukuran lebar sungai dengan segitiga kongruen">
          <rect x="0" y="${B[1] + 8}" width="300" height="${A[1] - B[1] - 14}" fill="#BFDBFE"/>
          <path d="M0 ${B[1] + 8} H300 M0 ${A[1] - 6} H300" stroke="#60A5FA" stroke-width="2"/>
          <circle cx="${B[0]}" cy="${B[1] - 2}" r="10" fill="#22C55E"/><rect x="${B[0] - 2}" y="${B[1] + 2}" width="4" height="6" fill="#8B5E3C"/>
          <path d="M${B[0]} ${B[1]} L${E[0]} ${E[1]}" stroke="#17324D" stroke-width="2" stroke-dasharray="6 4"/>
          <path d="M${B[0]} ${B[1]} V${A[1]} H${D[0]} V${E[1]}" fill="none" stroke="#2563EB" stroke-width="2.5"/>
          <path d="M${A[0]} ${A[1] - 12} h12 v12 M${D[0]} ${D[1] + 12} h-12 v-12" fill="none" stroke="#2563EB" stroke-width="1.6"/>
          ${[['A', A, -14, 16], ['B', B, -16, 0], ['C', C, 0, -10], ['D', D, 14, -6], ['E', E, 14, 4]].map(([t, p, dx, dy]) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#17324D"/><text class="v-label" x="${p[0] + dx}" y="${p[1] + dy}" text-anchor="middle">${t}</text>`).join('')}
          <text class="s-label" x="${(A[0] + C[0]) / 2}" y="${A[1] + 18}" text-anchor="middle">20 m</text>
          <text class="s-label" x="${(C[0] + D[0]) / 2}" y="${A[1] + 18}" text-anchor="middle">20 m</text>
          <text class="s-label" x="${D[0] + 10}" y="${(D[1] + E[1]) / 2}">32 m</text>
          <text class="s-label" x="${A[0] - 10}" y="${(A[1] + B[1]) / 2 + 4}" text-anchor="end">?</text>
        </svg>`;
      }
    },
    {
      id: 10, tp: 10,
      title: 'Tinggi Gedung dari Cermin',
      story: 'Detektif tidak dapat memanjat gedung tersangka. Ia meletakkan cermin datar di tanah, lalu mundur sampai puncak gedung terlihat tepat di tengah cermin.',
      given: [
        'Tinggi mata detektif dari tanah: $1{,}5$ m.',
        'Jarak kaki detektif ke cermin: $2$ m.',
        'Jarak cermin ke dasar gedung: $16$ m.',
        'Sinar dipantulkan dengan sudut datang = sudut pantul; detektif dan gedung tegak lurus tanah.'
      ],
      question: 'Berapa tinggi gedung tersebut?',
      options: [
        { key: 'A', text: '$12$ m' },
        { key: 'B', text: '$16$ m' },
        { key: 'C', text: '$21{,}3$ m' }
      ],
      answer: 'A',
      hints: [
        'Ada dua segitiga siku-siku yang bertemu di cermin. Karena sudut datang sama dengan sudut pantul, kedua segitiga memiliki dua pasang sudut sama (AA).',
        'Susun perbandingan senilai: $\\dfrac{\\text{tinggi gedung}}{\\text{tinggi mata}} = \\dfrac{\\text{jarak cermin ke gedung}}{\\text{jarak cermin ke detektif}}$.'
      ],
      steps: [
        'Kedua segitiga siku-siku (detektif dan gedung tegak lurus tanah) dan sudut di cermin sama besar (sudut datang = sudut pantul). Jadi kedua segitiga sebangun (AA).',
        'Sisi seletak: tinggi mata $\\leftrightarrow$ tinggi gedung, jarak detektif–cermin $\\leftrightarrow$ jarak gedung–cermin.',
        'Perbandingan senilai: $\\frac{t}{1{,}5} = \\frac{16}{2} = 8$.',
        '$t = 1{,}5 \\times 8 = 12$ m. (Pilihan $21{,}3$ m muncul jika perbandingannya terbalik: $\\frac{16 \\times 2}{1{,}5}$.)'
      ],
      art() {
        const s = 16, g = 262; // 16 px per meter
        const P = 34, M = P + 2 * s, G = M + 16 * s;
        return `<svg viewBox="0 0 360 290" role="img" aria-label="Mengukur tinggi gedung dengan cermin">
          <line x1="0" y1="${g}" x2="360" y2="${g}" stroke="#94A3B8" stroke-width="2"/>
          <rect x="${G}" y="${g - 12 * s}" width="26" height="${12 * s}" fill="#CBD5E1" stroke="#17324D" stroke-width="2"/>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${G + 6}" y="${g - 12 * s + 10 + i * 30}" width="14" height="14" fill="#fff" opacity=".8"/>`).join('')}
          <line x1="${P}" y1="${g}" x2="${P}" y2="${g - 1.5 * s}" stroke="#17324D" stroke-width="4" stroke-linecap="round"/>
          <circle cx="${P}" cy="${g - 1.5 * s - 6}" r="6" fill="#17324D"/>
          <rect x="${M - 9}" y="${g - 3}" width="18" height="5" fill="#38BDF8" stroke="#0369A1"/>
          <path d="M${P} ${g - 1.5 * s} L${M} ${g} L${G} ${g - 12 * s}" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="6 4"/>
          <text class="s-label" x="${P - 6}" y="${g - 10}" text-anchor="end">1,5 m</text>
          <text class="s-label" x="${(P + M) / 2}" y="${g + 18}" text-anchor="middle">2 m</text>
          <text class="s-label" x="${(M + G) / 2}" y="${g + 18}" text-anchor="middle">16 m</text>
          <text class="s-label" x="${G - 6}" y="${g - 6 * s}" text-anchor="end">t = ?</text>
          <text class="v-label" x="${M}" y="${g - 10}" text-anchor="middle">M</text>
        </svg>`;
      }
    }
  ];

  GM.FEEDBACK = {
    ok: 'Benar! Kamu berhasil menemukan hubungan kedua bangun.',
    bad: 'Belum tepat. Periksa kembali sisi dan sudut yang bersesuaian.'
  };
})();
