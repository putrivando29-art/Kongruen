/* Data 5 kasus utama Misi Detektif. */
(function () {
  const GM = window.GM;
  const geo = GM.geo;

  const REL = [
    { key: 'A', text: 'Kongruen' },
    { key: 'B', text: 'Sebangun tetapi tidak kongruen' },
    { key: 'C', text: 'Tidak kongruen dan tidak sebangun' }
  ];

  // Segitiga kedua digambar dengan posisi/arah berbeda agar siswa tidak menebak dari tampilan.
  const turn = (pts, deg, flip) => {
    let q = flip ? geo.reflectV(pts) : pts;
    q = geo.rotate(q, deg);
    return geo.normalize(q);
  };

  GM.MISSIONS = [
    {
      id: 1,
      title: 'Dua Segitiga Identik',
      story: 'Di meja laboratorium ditemukan dua kepingan segitiga. Petugas curiga salah satunya adalah salinan dari yang lain. Buktikan dengan ukuran, bukan dengan tebakan!',
      given: [
        'Segitiga $ABC$: $AB = 3$ cm, $BC = 4$ cm, $CA = 5$ cm.',
        'Segitiga $DEF$: $DE = 3$ cm, $EF = 4$ cm, $FD = 5$ cm.'
      ],
      question: 'Apakah kedua segitiga kongruen?',
      options: REL,
      answer: 'A',
      topic: { tab: 'syarat-kongruen', label: 'Syarat kekongruenan segitiga (SSS)' },
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
      id: 2,
      title: 'Segitiga Hasil Pembesaran',
      story: 'Sebuah foto barang bukti diperbesar oleh tim forensik. Tugasmu memastikan apakah bentuk segitiga pada foto tetap sama setelah diperbesar.',
      given: [
        'Segitiga pertama: sisi $3$ cm, $4$ cm, dan $5$ cm.',
        'Segitiga kedua: sisi $6$ cm, $8$ cm, dan $10$ cm.'
      ],
      question: 'Bagaimana hubungan kedua segitiga?',
      options: REL,
      answer: 'B',
      topic: { tab: 'syarat-sebangun', label: 'Syarat kesebangunan segitiga (SSS sebanding)' },
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
        const A = geo.triSSS(3, 4, 5);
        const B = geo.triSSS(6, 8, 10);
        return [
          { pts: A, labels: ['A', 'B', 'C'], sideLabels: true, color: 'a', title: 'Segitiga 1' },
          { pts: B, labels: ['P', 'Q', 'R'], sideLabels: true, color: 'b', title: 'Segitiga 2' }
        ];
      }
    },
    {
      id: 3,
      title: 'Pemeriksaan Sudut',
      story: 'Dua jejak berbentuk segitiga ditemukan di lokasi berbeda. Salah satunya tampak terbalik. Periksa sisi dan sudutnya dengan teliti sebelum menarik kesimpulan.',
      given: [
        'Segitiga $ABC$: $AB = 4$ cm, $BC = 5$ cm, $CA = 6$ cm.',
        'Sudut-sudutnya: $\\angle A \\approx 55{,}8^\\circ$, $\\angle B \\approx 82{,}8^\\circ$, $\\angle C \\approx 41{,}4^\\circ$.',
        'Segitiga $DEF$: $DE = 4$ cm, $EF = 5$ cm, $FD = 6$ cm.',
        'Sudut-sudutnya: $\\angle D \\approx 55{,}8^\\circ$, $\\angle E \\approx 82{,}8^\\circ$, $\\angle F \\approx 41{,}4^\\circ$.'
      ],
      question: 'Apakah kedua segitiga kongruen?',
      options: REL,
      answer: 'A',
      topic: { tab: 'kongruensi', label: 'Pengertian dan syarat kekongruenan' },
      hints: [
        'Arah dan posisi gambar tidak mengubah ukuran. Bandingkan pasangan sisi dan pasangan sudut satu per satu.',
        'Periksa: apakah semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar?'
      ],
      steps: [
        'Bandingkan sisi bersesuaian: $AB = DE = 4$ cm, $BC = EF = 5$ cm, $CA = FD = 6$ cm.',
        'Bandingkan sudut bersesuaian: $\\angle A = \\angle D \\approx 55{,}8^\\circ$, $\\angle B = \\angle E \\approx 82{,}8^\\circ$, $\\angle C = \\angle F \\approx 41{,}4^\\circ$. Jumlahnya $55{,}8^\\circ + 82{,}8^\\circ + 41{,}4^\\circ = 180^\\circ$.',
        'Semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar. Syarat kekongruenan terpenuhi (cukup dibuktikan dengan SSS).',
        'Kesimpulan: $\\triangle ABC \\cong \\triangle DEF$. Segitiga $DEF$ hanyalah hasil pemutaran dan pencerminan dari $\\triangle ABC$, sehingga bentuk dan ukurannya tetap sama.'
      ],
      figure() {
        const A = geo.triSSS(4, 5, 6);
        return [
          { pts: A, labels: ['A', 'B', 'C'], sideLabels: true, angleLabels: true, color: 'a', title: '△ABC' },
          { pts: turn(A, 200, true), labels: ['D', 'E', 'F'], sideLabels: true, angleLabels: true, color: 'b', title: '△DEF' }
        ];
      }
    },
    {
      id: 4,
      title: 'Misteri Faktor Skala',
      story: 'Seorang arsitek membuat model segitiga dan versi besarnya. Catatan faktor skalanya hilang. Temukan kembali nilai faktor skala tersebut!',
      given: [
        'Segitiga pertama: sisi $5$ cm, $7$ cm, dan $9$ cm.',
        'Segitiga kedua: sisi $10$ cm, $14$ cm, dan $18$ cm.'
      ],
      question: 'Tentukan faktor skala dari segitiga pertama ke segitiga kedua.',
      options: [
        { key: 'A', text: '$k = 1$' },
        { key: 'B', text: '$k = 2$' },
        { key: 'C', text: '$k = 3$' }
      ],
      answer: 'B',
      topic: { tab: 'kesebangunan', label: 'Faktor skala pada kesebangunan' },
      hints: [
        'Faktor skala dari bangun pertama ke bangun kedua: $k = \\dfrac{\\text{sisi bangun kedua}}{\\text{sisi bangun pertama}}$.',
        'Coba hitung untuk pasangan sisi terpendek terlebih dahulu, lalu periksa pasangan lainnya.'
      ],
      steps: [
        'Pasangkan sisi bersesuaian: $5 \\leftrightarrow 10$, $7 \\leftrightarrow 14$, $9 \\leftrightarrow 18$.',
        'Faktor skala: $$k = \\frac{10}{5} = \\frac{14}{7} = \\frac{18}{9} = 2$$',
        'Semua pasangan menghasilkan nilai yang sama, jadi $k = 2$. Setiap sisi segitiga kedua dua kali sisi segitiga pertama: sisi baru $= k \\times$ sisi asli.',
        'Kesimpulan: faktor skalanya $k = 2$ (jawaban B). Seluruh sisi mengalami pembesaran dua kali.'
      ],
      figure() {
        return [
          { pts: geo.triSSS(5, 7, 9), labels: ['A', 'B', 'C'], sideLabels: true, color: 'a', title: 'Segitiga 1' },
          { pts: geo.triSSS(10, 14, 18), labels: ['P', 'Q', 'R'], sideLabels: true, color: 'b', title: 'Segitiga 2' }
        ];
      }
    },
    {
      id: 5,
      title: 'Persegi yang Sebangun',
      story: 'Dua ubin persegi ditemukan di gudang. Kepala gudang ingin tahu apakah kedua ubin itu memiliki hubungan geometri tertentu.',
      given: [
        'Persegi $A$ memiliki panjang sisi $4$ cm.',
        'Persegi $B$ memiliki panjang sisi $8$ cm.'
      ],
      question: 'Bagaimana hubungan kedua persegi?',
      options: REL,
      answer: 'B',
      topic: { tab: 'segiempat', label: 'Kesebangunan segiempat' },
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
    }
  ];

  GM.FEEDBACK = {
    ok: 'Benar! Kamu berhasil menemukan hubungan kedua bangun.',
    bad: 'Belum tepat. Periksa kembali sisi dan sudut yang bersesuaian.'
  };
})();
