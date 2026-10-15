/* Soal evaluasi: 10 pilihan ganda + 5 uraian, setiap soal dipetakan ke Tujuan Pembelajaran (tp).
   Semua kunci telah dihitung ulang. */
(function () {
  const GM = window.GM;

  GM.QUIZ_MC = [
    {
      id: 'm1', tp: 1, level: 'mudah', topic: 'Pengertian kekongruenan segitiga', tab: 'kongruen-segitiga',
      q: 'Dua bangun datar dikatakan kongruen jika ...',
      options: [
        'bentuknya sama, tetapi ukurannya boleh berbeda',
        'bentuk dan ukurannya sama persis',
        'luas kedua bangun sama',
        'keliling kedua bangun sama'
      ],
      answer: 1,
      explain: 'Kongruen berarti bentuk <b>dan</b> ukuran sama persis: semua sisi bersesuaian sama panjang dan semua sudut bersesuaian sama besar. Luas atau keliling yang sama belum cukup. Contoh: persegi panjang $4 \\times 1$ dan persegi $2 \\times 2$ sama-sama berluas $4$ cm², tetapi bentuknya berbeda.'
    },
    {
      id: 'm3', tp: 1, level: 'mudah', topic: 'Sifat kekongruenan segitiga (SAS)', tab: 'kongruen-segitiga',
      q: 'Pada $\\triangle ABC$ dan $\\triangle PQR$ diketahui $AB = PQ = 5$ cm, $AC = PR = 7$ cm, dan $\\angle A = \\angle P = 60^\\circ$. Kedua segitiga kongruen berdasarkan kriteria ...',
      options: ['SSS', 'SAS', 'ASA', 'AAS'],
      answer: 1,
      explain: '$\\angle A$ diapit oleh sisi $AB$ dan $AC$, sedangkan $\\angle P$ diapit oleh $PQ$ dan $PR$. Dua pasang sisi sama panjang dan sudut apitnya sama besar, jadi kriterianya SAS (Sisi-Sudut-Sisi).'
    },
    {
      id: 'q2', tp: 2, level: 'mudah', topic: 'Pengertian kekongruenan segiempat', tab: 'kongruen-segiempat',
      q: 'Persegi $ABCD$ bersisi $5$ cm dan belah ketupat $PQRS$ bersisi $5$ cm dengan $\\angle P = 70^\\circ$. Pernyataan yang benar adalah ...',
      options: [
        'Kongruen, karena semua sisi bersesuaian sama panjang.',
        'Tidak kongruen, karena sudut-sudut bersesuaian tidak sama besar.',
        'Kongruen, karena kelilingnya sama, yaitu $20$ cm.',
        'Sebangun dengan faktor skala $k = 1$.'
      ],
      answer: 1,
      explain: 'Dua segiempat kongruen jika <b>semua</b> sisi bersesuaian sama panjang <b>dan</b> semua sudut bersesuaian sama besar. Sudut persegi $90^\\circ$, sedangkan sudut belah ketupat $70^\\circ$ dan $110^\\circ$. Karena sudutnya berbeda, keduanya tidak kongruen dan juga tidak sebangun.'
    },
    {
      id: 'm6', tp: 3, level: 'sedang', topic: 'Sifat kesebangunan segitiga (AA)', tab: 'sebangun-segitiga',
      q: 'Pada $\\triangle ABC$, $\\angle A = 50^\\circ$ dan $\\angle B = 70^\\circ$. Pada $\\triangle KLM$, $\\angle K = 50^\\circ$ dan $\\angle M = 60^\\circ$. Hubungan kedua segitiga adalah ...',
      options: [
        'Sebangun, karena dua pasang sudut bersesuaian sama besar (AA).',
        'Kongruen, karena semua sudutnya sama besar.',
        'Tidak sebangun, karena $\\angle B \\neq \\angle M$.',
        'Tidak dapat ditentukan tanpa panjang sisi.'
      ],
      answer: 0,
      explain: '$\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$ dan $\\angle L = 180^\\circ - 50^\\circ - 60^\\circ = 70^\\circ$. Jadi $\\angle A = \\angle K$, $\\angle B = \\angle L$, $\\angle C = \\angle M$. Dua pasang sudut bersesuaian sama besar sudah cukup (AA), sehingga $\\triangle ABC \\sim \\triangle KLM$. Kongruen tidak dapat disimpulkan karena tidak ada data sisi.'
    },
    {
      id: 'm8', tp: 4, level: 'sedang', topic: 'Sifat kesebangunan segiempat', tab: 'sebangun-segiempat',
      q: 'Sebuah persegi panjang berukuran $12$ cm $\\times$ $8$ cm. Persegi panjang yang sebangun dengannya adalah ...',
      options: ['$15$ cm $\\times$ $10$ cm', '$14$ cm $\\times$ $10$ cm', '$16$ cm $\\times$ $10$ cm', '$18$ cm $\\times$ $14$ cm'],
      answer: 0,
      explain: 'Semua sudut persegi panjang $90^\\circ$, jadi cukup periksa perbandingan sisi. $\\frac{15}{12} = 1{,}25$ dan $\\frac{10}{8} = 1{,}25$ (sama). Pilihan lain: $\\frac{14}{12} \\approx 1{,}17 \\neq 1{,}25$; $\\frac{16}{12} \\approx 1{,}33 \\neq 1{,}25$; $\\frac{18}{12} = 1{,}5 \\neq \\frac{14}{8} = 1{,}75$.'
    },
    {
      id: 'q5', tp: 5, level: 'sedang', topic: 'Besar sudut pada segitiga kongruen', tab: 'ukuran-kongruen-segitiga',
      q: 'Diketahui $\\triangle KLM \\cong \\triangle XYZ$ dengan $KL = 8$ cm, $LM = 10$ cm, $\\angle K = 45^\\circ$, dan $\\angle L = 75^\\circ$. Besar $\\angle Z$ adalah ...',
      options: ['$45^\\circ$', '$60^\\circ$', '$75^\\circ$', '$80^\\circ$'],
      answer: 1,
      explain: 'Dari notasi, $K \\leftrightarrow X$, $L \\leftrightarrow Y$, $M \\leftrightarrow Z$, jadi $\\angle Z$ seletak dengan $\\angle M$. $\\angle M = 180^\\circ - 45^\\circ - 75^\\circ = 60^\\circ$, sehingga $\\angle Z = 60^\\circ$.'
    },
    {
      id: 'q6', tp: 6, level: 'sedang', topic: 'Sisi dan sudut pada segiempat kongruen', tab: 'ukuran-kongruen-segiempat',
      q: 'Jajargenjang $ABCD \\cong$ jajargenjang $PQRS$. Diketahui $AB = 9$ cm, $BC = 5$ cm, dan $\\angle A = 65^\\circ$. Panjang $RS$ dan besar $\\angle R$ berturut-turut adalah ...',
      options: ['$9$ cm dan $65^\\circ$', '$5$ cm dan $115^\\circ$', '$9$ cm dan $115^\\circ$', '$5$ cm dan $65^\\circ$'],
      answer: 0,
      explain: 'Pasangan seletak: $RS \\leftrightarrow CD$ dan $\\angle R \\leftrightarrow \\angle C$. Pada jajargenjang, $CD = AB = 9$ cm dan sudut yang berhadapan sama besar, sehingga $\\angle C = \\angle A = 65^\\circ$. Jadi $RS = 9$ cm dan $\\angle R = 65^\\circ$.'
    },
    {
      id: 'm7', tp: 7, level: 'sedang', topic: 'Panjang sisi pada segitiga sebangun', tab: 'ukuran-sebangun-segitiga',
      q: 'Diketahui $\\triangle ABC \\sim \\triangle PQR$ dengan $AB = 6$ cm, $BC = 8$ cm, $AC = 10$ cm, dan $PQ = 9$ cm. Panjang $QR$ adalah ...',
      options: ['10 cm', '12 cm', '14 cm', '15 cm'],
      answer: 1,
      explain: 'Faktor skala $k = \\frac{PQ}{AB} = \\frac{9}{6} = 1{,}5$. Maka $QR = k \\times BC = 1{,}5 \\times 8 = 12$ cm.'
    },
    {
      id: 'm9', tp: 7, level: 'sulit', topic: 'Teorema Thales (segitiga sebangun)', tab: 'ukuran-sebangun-segitiga',
      q: 'Pada $\\triangle ABC$, titik $D$ pada $AB$ dan titik $E$ pada $AC$ sehingga $DE \\parallel BC$. Jika $AD = 4$ cm, $DB = 6$ cm, dan $AE = 6$ cm, panjang $EC$ adalah ...',
      options: ['4 cm', '6 cm', '8 cm', '9 cm'],
      answer: 3,
      explain: 'Karena $DE \\parallel BC$, berlaku $\\frac{AD}{DB} = \\frac{AE}{EC}$. Maka $\\frac{4}{6} = \\frac{6}{EC}$, sehingga $EC = \\frac{6 \\times 6}{4} = 9$ cm.'
    },
    {
      id: 'q8', tp: 8, level: 'sulit', topic: 'Panjang sisi pada segiempat sebangun', tab: 'ukuran-sebangun-segiempat',
      q: 'Trapesium $ABCD \\sim$ trapesium $PQRS$ dengan $AB \\parallel DC$ dan $PQ \\parallel SR$. Diketahui $AB = 12$ cm, $DC = 8$ cm, $AD = 6$ cm, dan $PQ = 18$ cm. Panjang $SR$ dan $PS$ berturut-turut adalah ...',
      options: ['$12$ cm dan $9$ cm', '$12$ cm dan $6$ cm', '$10$ cm dan $9$ cm', '$16$ cm dan $9$ cm'],
      answer: 0,
      explain: 'Faktor skala $k = \\frac{PQ}{AB} = \\frac{18}{12} = 1{,}5$. Maka $SR = 1{,}5 \\times DC = 1{,}5 \\times 8 = 12$ cm dan $PS = 1{,}5 \\times AD = 1{,}5 \\times 6 = 9$ cm.'
    }
  ];

  GM.QUIZ_ESSAY = [
    {
      id: 'e1', tp: 3, level: 'mudah', topic: 'Sifat kesebangunan segitiga (SSS sebanding)', tab: 'sebangun-segitiga',
      q: '$\\triangle ABC$ memiliki sisi $6$ cm, $8$ cm, dan $10$ cm. $\\triangle PQR$ memiliki sisi $9$ cm, $12$ cm, dan $15$ cm. Selidiki apakah kedua segitiga sebangun, lalu tentukan faktor skala dari $\\triangle ABC$ ke $\\triangle PQR$.',
      finalLabel: 'Faktor skala k =', unit: '', final: 1.5,
      model: [
        'Pasangkan sisi dari yang terpendek: $6 \\leftrightarrow 9$, $8 \\leftrightarrow 12$, $10 \\leftrightarrow 15$.',
        '$\\frac{9}{6} = 1{,}5$; $\\frac{12}{8} = 1{,}5$; $\\frac{15}{10} = 1{,}5$. Semua perbandingan sama.',
        'Jadi $\\triangle ABC \\sim \\triangle PQR$ (SSS sebanding) dengan $k = 1{,}5$. Karena $k \\neq 1$, keduanya tidak kongruen.'
      ]
    },
    {
      id: 'e2', tp: 5, level: 'sedang', topic: 'Sisi dan sudut pada segitiga kongruen', tab: 'ukuran-kongruen-segitiga',
      q: 'Pada $\\triangle ABC$ dan $\\triangle DEF$ diketahui $\\angle A = \\angle D = 40^\\circ$, $\\angle B = \\angle E = 75^\\circ$, dan $BC = EF = 8$ cm. Tunjukkan bahwa kedua segitiga kongruen, sebutkan kriterianya, lalu tentukan besar $\\angle F$.',
      finalLabel: 'Besar ∠F =', unit: '°', final: 65,
      model: [
        'Sisi $BC$ tidak terletak di antara $\\angle A$ dan $\\angle B$ (sisi tidak diapit). Dua pasang sudut sama besar dan satu pasang sisi tidak diapit sama panjang, jadi $\\triangle ABC \\cong \\triangle DEF$ berdasarkan AAS.',
        '$\\angle C = 180^\\circ - 40^\\circ - 75^\\circ = 65^\\circ$.',
        'Bagian-bagian seletak dari segitiga kongruen sama besar, jadi $\\angle F = \\angle C = 65^\\circ$. (Setelah $\\angle C$ dihitung, pembuktian juga dapat memakai ASA: $\\angle B$, $BC$, $\\angle C$.)'
      ]
    },
    {
      id: 'e3', tp: 9, level: 'sedang', topic: 'Masalah kontekstual kekongruenan', tab: 'masalah-kongruen',
      q: 'Kuda-kuda atap berbentuk segitiga sama kaki $ABC$ dengan $AC = BC = 5$ m dan bentang $AB = 8$ m. Tiang penyangga $CD$ dipasang tegak lurus $AB$ dengan $D$ pada $AB$. Buktikan $\\triangle ADC \\cong \\triangle BDC$, lalu tentukan panjang tiang $CD$.',
      finalLabel: 'Panjang CD =', unit: 'm', final: 3,
      model: [
        '$\\angle ADC = \\angle BDC = 90^\\circ$, hipotenusa $AC = BC = 5$ m, dan kaki $CD$ milik bersama. Jadi $\\triangle ADC \\cong \\triangle BDC$ (RHS).',
        'Sisi seletak sama panjang, sehingga $AD = DB = \\frac{8}{2} = 4$ m.',
        'Teorema Pythagoras pada $\\triangle ADC$: $CD = \\sqrt{AC^2 - AD^2} = \\sqrt{25 - 16} = \\sqrt{9} = 3$ m.'
      ]
    },
    {
      id: 'e4', tp: 10, level: 'sulit', topic: 'Masalah kontekstual kesebangunan (bayangan)', tab: 'masalah-sebangun',
      q: 'Pada saat yang sama, sebuah tongkat setinggi $1{,}2$ m yang berdiri tegak memiliki bayangan $1{,}6$ m, sedangkan sebuah gedung memiliki bayangan $20$ m. Tentukan tinggi gedung tersebut.',
      finalLabel: 'Tinggi gedung =', unit: 'm', final: 15,
      model: [
        'Sinar matahari datang dengan sudut yang sama, dan tongkat serta gedung sama-sama tegak lurus tanah. Segitiga tongkat-bayangan dan segitiga gedung-bayangan sebangun (AA).',
        '$\\frac{\\text{tinggi gedung}}{\\text{tinggi tongkat}} = \\frac{\\text{bayangan gedung}}{\\text{bayangan tongkat}}$, sehingga $\\frac{t}{1{,}2} = \\frac{20}{1{,}6}$.',
        '$t = \\frac{1{,}2 \\times 20}{1{,}6} = \\frac{24}{1{,}6} = 15$ m.'
      ]
    },
    {
      id: 'e5', tp: 7, level: 'sulit', topic: 'Garis tinggi segitiga siku-siku (segitiga sebangun)', tab: 'ukuran-sebangun-segitiga',
      q: '$\\triangle ABC$ siku-siku di $C$ dengan garis tinggi $CD \\perp AB$. Diketahui $AD = 9$ cm dan $DB = 16$ cm. Tentukan panjang $CD$, $AC$, dan $BC$, lalu periksa hasilnya dengan Teorema Pythagoras.',
      finalLabel: 'Panjang AC =', unit: 'cm', final: 15,
      model: [
        '$AB = AD + DB = 9 + 16 = 25$ cm.',
        '$CD^2 = AD \\times DB = 9 \\times 16 = 144$, jadi $CD = 12$ cm.',
        '$AC^2 = AD \\times AB = 9 \\times 25 = 225$, jadi $AC = 15$ cm. $BC^2 = DB \\times AB = 16 \\times 25 = 400$, jadi $BC = 20$ cm.',
        'Pemeriksaan: $AC^2 + BC^2 = 225 + 400 = 625 = 25^2 = AB^2$. Hasil sesuai Teorema Pythagoras.'
      ]
    }
  ];

  GM.QUIZ_MINUTES = 30;
})();
