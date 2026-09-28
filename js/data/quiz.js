/* Soal evaluasi: 10 pilihan ganda + 5 uraian. Semua kunci telah dihitung ulang. */
(function () {
  const GM = window.GM;

  GM.QUIZ_MC = [
    {
      id: 'm1', level: 'mudah', topic: 'Definisi kekongruenan', tab: 'kongruensi',
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
      id: 'm2', level: 'mudah', topic: 'Definisi kesebangunan', tab: 'kesebangunan',
      q: 'Pernyataan berikut yang benar adalah ...',
      options: [
        'Dua bangun yang sebangun pasti kongruen.',
        'Dua bangun yang kongruen pasti sebangun.',
        'Dua bangun sebangun jika luasnya sama.',
        'Semua persegi panjang pasti sebangun.'
      ],
      answer: 1,
      explain: 'Kekongruenan adalah kesebangunan dengan faktor skala $k = 1$, jadi bangun yang kongruen pasti sebangun. Sebaliknya tidak berlaku: bangun sebangun dengan $k \\neq 1$ tidak kongruen. Persegi panjang $6 \\times 4$ dan $8 \\times 5$ tidak sebangun karena $\\frac{8}{6} \\neq \\frac{5}{4}$.'
    },
    {
      id: 'm3', level: 'mudah', topic: 'Syarat SAS', tab: 'syarat-kongruen',
      q: 'Pada $\\triangle ABC$ dan $\\triangle PQR$ diketahui $AB = PQ = 5$ cm, $AC = PR = 7$ cm, dan $\\angle A = \\angle P = 60^\\circ$. Kedua segitiga kongruen berdasarkan kriteria ...',
      options: ['SSS', 'SAS', 'ASA', 'AAS'],
      answer: 1,
      explain: '$\\angle A$ diapit oleh sisi $AB$ dan $AC$, sedangkan $\\angle P$ diapit oleh $PQ$ dan $PR$. Dua pasang sisi sama panjang dan sudut apitnya sama besar, jadi kriterianya SAS (Sisi-Sudut-Sisi).'
    },
    {
      id: 'm4', level: 'sedang', topic: 'Syarat ASA', tab: 'syarat-kongruen',
      q: 'Pada $\\triangle ABC$ dan $\\triangle DEF$ diketahui $\\angle A = \\angle D$, $\\angle B = \\angle E$, dan $AB = DE$. Kriteria kekongruenan yang sesuai adalah ...',
      options: ['SSS', 'SAS', 'ASA', 'RHS'],
      answer: 2,
      explain: 'Sisi $AB$ terletak di antara $\\angle A$ dan $\\angle B$ (sisi apit). Dua pasang sudut sama besar dan sisi yang diapitnya sama panjang, jadi kriterianya ASA (Sudut-Sisi-Sudut).'
    },
    {
      id: 'm5', level: 'sedang', topic: 'Syarat SSS, SAS, ASA, AAS', tab: 'syarat-kongruen',
      q: 'Data berikut yang <b>tidak</b> menjamin dua segitiga kongruen adalah ...',
      options: [
        'Ketiga pasang sisi bersesuaian sama panjang.',
        'Dua pasang sisi sama panjang dan sudut apitnya sama besar.',
        'Ketiga pasang sudut bersesuaian sama besar.',
        'Dua pasang sudut sama besar dan sisi apitnya sama panjang.'
      ],
      answer: 2,
      explain: 'Tiga pasang sudut yang sama besar (AAA) hanya menjamin kedua segitiga <b>sebangun</b>, bukan kongruen. Contoh: segitiga sama sisi bersisi $2$ cm dan $5$ cm sama-sama bersudut $60^\\circ$, tetapi ukurannya berbeda. Pilihan lain adalah SSS, SAS, dan ASA.'
    },
    {
      id: 'm6', level: 'sedang', topic: 'Syarat AA', tab: 'syarat-sebangun',
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
      id: 'm7', level: 'sedang', topic: 'Faktor skala dan perbandingan sisi', tab: 'kesebangunan',
      q: 'Diketahui $\\triangle ABC \\sim \\triangle PQR$ dengan $AB = 6$ cm, $BC = 8$ cm, $AC = 10$ cm, dan $PQ = 9$ cm. Panjang $QR$ adalah ...',
      options: ['10 cm', '12 cm', '14 cm', '15 cm'],
      answer: 1,
      explain: 'Faktor skala $k = \\frac{PQ}{AB} = \\frac{9}{6} = 1{,}5$. Maka $QR = k \\times BC = 1{,}5 \\times 8 = 12$ cm.'
    },
    {
      id: 'm8', level: 'sedang', topic: 'Kesebangunan persegi panjang', tab: 'segiempat',
      q: 'Sebuah persegi panjang berukuran $12$ cm $\\times$ $8$ cm. Persegi panjang yang sebangun dengannya adalah ...',
      options: ['$15$ cm $\\times$ $10$ cm', '$14$ cm $\\times$ $10$ cm', '$16$ cm $\\times$ $10$ cm', '$18$ cm $\\times$ $14$ cm'],
      answer: 0,
      explain: 'Semua sudut persegi panjang $90^\\circ$, jadi cukup periksa perbandingan sisi. $\\frac{15}{12} = 1{,}25$ dan $\\frac{10}{8} = 1{,}25$ (sama). Pilihan lain: $\\frac{14}{12} \\approx 1{,}17 \\neq 1{,}25$; $\\frac{16}{12} \\approx 1{,}33 \\neq 1{,}25$; $\\frac{18}{12} = 1{,}5 \\neq \\frac{14}{8} = 1{,}75$.'
    },
    {
      id: 'm9', level: 'sulit', topic: 'Teorema Thales', tab: 'teorema',
      q: 'Pada $\\triangle ABC$, titik $D$ pada $AB$ dan titik $E$ pada $AC$ sehingga $DE \\parallel BC$. Jika $AD = 4$ cm, $DB = 6$ cm, dan $AE = 6$ cm, panjang $EC$ adalah ...',
      options: ['4 cm', '6 cm', '8 cm', '9 cm'],
      answer: 3,
      explain: 'Karena $DE \\parallel BC$, berlaku $\\frac{AD}{DB} = \\frac{AE}{EC}$. Maka $\\frac{4}{6} = \\frac{6}{EC}$, sehingga $EC = \\frac{6 \\times 6}{4} = 9$ cm.'
    },
    {
      id: 'm10', level: 'sulit', topic: 'Garis tinggi segitiga siku-siku', tab: 'teorema',
      q: '$\\triangle ABC$ siku-siku di $C$. Garis tinggi $CD$ tegak lurus $AB$ dengan $D$ pada $AB$. Jika $AD = 4$ cm dan $DB = 9$ cm, panjang $CD$ adalah ...',
      options: ['5 cm', '6 cm', '6,5 cm', '13 cm'],
      answer: 1,
      explain: 'Pada segitiga siku-siku berlaku $CD^2 = AD \\times DB = 4 \\times 9 = 36$, sehingga $CD = \\sqrt{36} = 6$ cm.'
    }
  ];

  GM.QUIZ_ESSAY = [
    {
      id: 'e1', level: 'mudah', topic: 'SSS sebanding dan faktor skala', tab: 'syarat-sebangun',
      q: '$\\triangle ABC$ memiliki sisi $6$ cm, $8$ cm, dan $10$ cm. $\\triangle PQR$ memiliki sisi $9$ cm, $12$ cm, dan $15$ cm. Selidiki apakah kedua segitiga sebangun, lalu tentukan faktor skala dari $\\triangle ABC$ ke $\\triangle PQR$.',
      finalLabel: 'Faktor skala k =', unit: '', final: 1.5,
      model: [
        'Pasangkan sisi dari yang terpendek: $6 \\leftrightarrow 9$, $8 \\leftrightarrow 12$, $10 \\leftrightarrow 15$.',
        '$\\frac{9}{6} = 1{,}5$; $\\frac{12}{8} = 1{,}5$; $\\frac{15}{10} = 1{,}5$. Semua perbandingan sama.',
        'Jadi $\\triangle ABC \\sim \\triangle PQR$ (SSS sebanding) dengan $k = 1{,}5$. Karena $k \\neq 1$, keduanya tidak kongruen.'
      ]
    },
    {
      id: 'e2', level: 'sedang', topic: 'Syarat AAS dan CPCTC', tab: 'syarat-kongruen',
      q: 'Pada $\\triangle ABC$ dan $\\triangle DEF$ diketahui $\\angle A = \\angle D = 40^\\circ$, $\\angle B = \\angle E = 75^\\circ$, dan $BC = EF = 8$ cm. Tunjukkan bahwa kedua segitiga kongruen, sebutkan kriterianya, lalu tentukan besar $\\angle F$.',
      finalLabel: 'Besar ∠F =', unit: '°', final: 65,
      model: [
        'Sisi $BC$ tidak terletak di antara $\\angle A$ dan $\\angle B$ (sisi tidak diapit). Dua pasang sudut sama besar dan satu pasang sisi tidak diapit sama panjang, jadi $\\triangle ABC \\cong \\triangle DEF$ berdasarkan AAS.',
        '$\\angle C = 180^\\circ - 40^\\circ - 75^\\circ = 65^\\circ$.',
        'Bagian-bagian bersesuaian dari segitiga kongruen sama besar (CPCTC), jadi $\\angle F = \\angle C = 65^\\circ$. (Setelah $\\angle C$ dihitung, pembuktian juga dapat memakai ASA: $\\angle B$, $BC$, $\\angle C$.)'
      ]
    },
    {
      id: 'e3', level: 'sedang', topic: 'SAS sebanding dan perbandingan luas', tab: 'syarat-sebangun',
      q: 'Pada $\\triangle KLM$: $KL = 4$ cm, $KM = 5$ cm, $\\angle K = 60^\\circ$. Pada $\\triangle XYZ$: $XY = 8$ cm, $XZ = 10$ cm, $\\angle X = 60^\\circ$. Apakah kedua segitiga sebangun? Tentukan perbandingan luas $\\triangle XYZ$ terhadap $\\triangle KLM$.',
      finalLabel: 'Nilai L(XYZ) : L(KLM) =', unit: ': 1', final: 4,
      model: [
        '$\\frac{XY}{KL} = \\frac{8}{4} = 2$ dan $\\frac{XZ}{KM} = \\frac{10}{5} = 2$. Dua pasang sisi sebanding.',
        'Sudut apitnya sama: $\\angle X = \\angle K = 60^\\circ$. Jadi $\\triangle XYZ \\sim \\triangle KLM$ (SAS sebanding) dengan $k = 2$.',
        'Perbandingan luas bangun sebangun: $\\frac{L_2}{L_1} = k^2 = 2^2 = 4$. Jadi luas $\\triangle XYZ$ adalah $4$ kali luas $\\triangle KLM$ (perbandingan $4 : 1$).'
      ]
    },
    {
      id: 'e4', level: 'sulit', topic: 'Penerapan: tinggi benda dengan bayangan', tab: 'penerapan',
      q: 'Pada saat yang sama, sebuah tongkat setinggi $1{,}2$ m yang berdiri tegak memiliki bayangan $1{,}6$ m, sedangkan sebuah gedung memiliki bayangan $20$ m. Tentukan tinggi gedung tersebut.',
      finalLabel: 'Tinggi gedung =', unit: 'm', final: 15,
      model: [
        'Sinar matahari datang dengan sudut yang sama, dan tongkat serta gedung sama-sama tegak lurus tanah. Segitiga tongkat-bayangan dan segitiga gedung-bayangan sebangun (AA).',
        '$\\frac{\\text{tinggi gedung}}{\\text{tinggi tongkat}} = \\frac{\\text{bayangan gedung}}{\\text{bayangan tongkat}}$, sehingga $\\frac{t}{1{,}2} = \\frac{20}{1{,}6}$.',
        '$t = \\frac{1{,}2 \\times 20}{1{,}6} = \\frac{24}{1{,}6} = 15$ m.'
      ]
    },
    {
      id: 'e5', level: 'sulit', topic: 'Garis tinggi segitiga siku-siku dan Pythagoras', tab: 'teorema',
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
