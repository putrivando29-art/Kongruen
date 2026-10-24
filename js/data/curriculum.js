/* Data kurikulum sesuai dokumen REVISI TP (Elemen Geometri, Fase D). */
(function () {
  const GM = window.GM;

  GM.CURRICULUM = {
    elemen: 'Geometri',
    fase: 'D',
    cp: 'Menjelaskan sifat-sifat kekongruenan dan kesebangunan pada segitiga dan segiempat, dan menggunakannya untuk menyelesaikan masalah.',
    stages: [
      {
        id: 1,
        name: 'Tahap 1: Memahami Konsep',
        short: 'Memahami konsep',
        tps: [1, 2, 3, 4],
        atp: [
          { code: 'ATP 1', text: 'Eksplorasi konkret/kertas karton untuk menemukan konsep sisi-sisi bersesuaian sama panjang dan sudut bersesuaian sama besar.' },
          { code: 'ATP 2', text: 'Mengamati pembesaran/pengecilan foto atau model skala untuk memahami perbandingan nilai sisi.' }
        ],
        approach: 'Realistic Mathematics Education (RME) & Pendekatan Saintifik untuk menemukan syarat bangun kongruen/sebangun lewat konteks nyata.',
        steps: ['Mengamati konteks nyata', 'Menanya', 'Mengumpulkan informasi (eksplorasi)', 'Menalar', 'Mengomunikasikan'],
        materi: ['Sifat-sifat kekongruenan pada segitiga', 'Sifat-sifat kekongruenan pada segiempat', 'Sifat-sifat kesebangunan pada segitiga', 'Sifat-sifat kesebangunan pada segiempat']
      },
      {
        id: 2,
        name: 'Tahap 2: Menentukan Ukuran',
        short: 'Menentukan sisi & sudut',
        tps: [5, 6, 7, 8],
        atp: [
          { code: 'ATP 3', text: 'Latihan mengidentifikasi pasangan sisi/sudut yang seletak dan menentukan nilai variabel pada dua bangun kongruen.' },
          { code: 'ATP 4', text: 'Menyelesaikan persamaan perbandingan senilai untuk mencari panjang sisi atau sudut yang hilang pada bangun sebangun.' }
        ],
        approach: 'Inkuiri Terbimbing & Pembelajaran Berdiferensiasi (bantuan color-coding dan media GeoGebra) untuk mempermudah identifikasi sisi seletak.',
        steps: ['Orientasi', 'Merumuskan masalah', 'Menduga pasangan seletak', 'Menguji dengan perhitungan', 'Menyimpulkan'],
        materi: ['Kekongruenan segitiga', 'Kekongruenan segiempat', 'Kesebangunan segitiga', 'Kesebangunan segiempat']
      },
      {
        id: 3,
        name: 'Tahap 3: Memecahkan Masalah',
        short: 'Masalah kontekstual',
        tps: [9, 10],
        atp: [
          { code: 'ATP 5', text: 'Problem-Based Learning: Menaksir tinggi pohon, gedung, atau lebar sungai menggunakan konsep bayangan atau cermin.' }
        ],
        approach: 'Problem-Based Learning (PBL) atau Project-Based Learning (PjBL) untuk menyelesaikan masalah pengukuran tak langsung di dunia nyata.',
        steps: ['Orientasi masalah', 'Mengorganisasi', 'Menyelidiki', 'Menyajikan hasil', 'Mengevaluasi'],
        materi: ['Kekongruenan segitiga dan segiempat', 'Kesebangunan segitiga dan segiempat']
      }
    ],
    // tab = id tab materi; mission = nomor kasus; quiz = id soal evaluasi
    tps: [
      { n: 1, stage: 1, tab: 'kongruen-segitiga', mission: 1, quiz: ['m1', 'm3'], text: 'Peserta didik mampu menjelaskan pengertian dan sifat kekongruenan pada segitiga dengan benar.' },
      { n: 2, stage: 1, tab: 'kongruen-segiempat', mission: 2, quiz: ['q2'], text: 'Peserta didik mampu menjelaskan pengertian dan sifat kekongruenan pada segiempat dengan benar.' },
      { n: 3, stage: 1, tab: 'sebangun-segitiga', mission: 3, quiz: ['m6', 'e1'], text: 'Peserta didik mampu menjelaskan pengertian dan sifat kesebangunan pada segitiga dengan benar.' },
      { n: 4, stage: 1, tab: 'sebangun-segiempat', mission: 4, quiz: ['m8'], text: 'Peserta didik mampu menjelaskan pengertian dan sifat kesebangunan pada segiempat dengan benar.' },
      { n: 5, stage: 2, tab: 'ukuran-kongruen-segitiga', mission: 5, quiz: ['q5', 'e2'], text: 'Peserta didik mampu menentukan panjang sisi dan besar sudut pada segitiga yang kongruen dengan benar.' },
      { n: 6, stage: 2, tab: 'ukuran-kongruen-segiempat', mission: 6, quiz: ['q6'], text: 'Peserta didik mampu menentukan panjang sisi dan besar sudut pada segiempat yang kongruen dengan benar.' },
      { n: 7, stage: 2, tab: 'ukuran-sebangun-segitiga', mission: 7, quiz: ['m7', 'm9', 'e5'], text: 'Peserta didik mampu menentukan panjang sisi dan besar sudut pada segitiga yang sebangun dengan benar.' },
      { n: 8, stage: 2, tab: 'ukuran-sebangun-segiempat', mission: 8, quiz: ['q8'], text: 'Peserta didik mampu menentukan panjang sisi dan besar sudut pada segiempat yang sebangun dengan benar.' },
      { n: 9, stage: 3, tab: 'masalah-kongruen', mission: 9, quiz: ['e3'], text: 'Peserta didik mampu menyelesaikan masalah kontekstual yang berkaitan dengan kekongruenan dengan benar.' },
      { n: 10, stage: 3, tab: 'masalah-sebangun', mission: 10, quiz: ['e4'], text: 'Peserta didik mampu menyelesaikan masalah kontekstual yang berkaitan dengan kesebangunan dengan benar.' }
    ]
  };

  // Ringkasan capaian per TP dari misi (percobaan pertama), evaluasi, dan latihan.
  GM.tpReport = function (st) {
    st = st || GM.store.get();
    const q = st.quiz && st.quiz.submitted ? st.quiz.result : null;
    return GM.CURRICULUM.tps.map((tp) => {
      const m = (st.missions || {})[tp.mission] || {};
      const items = q ? q.mc.concat(q.es).filter((x) => tp.quiz.includes(x.id)) : [];
      const qOk = items.filter((x) => x.ok).length;
      const practice = (st.practice || {})[tp.n] || 0;
      let status = 'belum';
      if (m.firstCorrect !== undefined || items.length) {
        const missionOk = m.firstCorrect !== false;
        const quizOk = !items.length || qOk === items.length;
        status = missionOk && quizOk ? 'tercapai' : 'penguatan';
      }
      return { tp, mission: m.firstCorrect, quiz: items.length ? `${qOk}/${items.length}` : null, practice, status, visited: !!(st.material || {})[tp.tab] };
    });
  };

  GM.tpOf = (n) => GM.CURRICULUM.tps.find((t) => t.n === n);
  GM.stageOf = (id) => GM.CURRICULUM.stages.find((s) => s.id === id);
})();
