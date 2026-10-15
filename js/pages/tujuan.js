/* Halaman Tujuan Pembelajaran: CP, TP, ATP, pendekatan, materi, dan capaian per TP. */
(function () {
  const GM = window.GM;
  const C = () => GM.CURRICULUM;

  const STATUS = {
    tercapai: '<span class="chip chip-mint">Tercapai</span>',
    penguatan: '<span class="chip chip-warn">Perlu penguatan</span>',
    belum: '<span class="chip">Belum dinilai</span>'
  };

  function reportCard() {
    const rows = GM.tpReport();
    return `<div class="card" style="margin-top:18px">
      <h3>${GM.icon('flag', 20)} Capaian per Tujuan Pembelajaran</h3>
      <p class="small muted">Status dihitung dari jawaban pertama pada kasus misi dan soal evaluasi yang terkait dengan TP tersebut. "Tercapai" berarti semua bukti yang ada benar; "Perlu penguatan" berarti ada bukti yang belum tepat.</p>
      <div class="table-wrap"><table class="data compact">
        <tr><th>TP</th><th>Kasus misi</th><th>Soal evaluasi</th><th>Latihan seletak</th><th>Status</th></tr>
        ${rows.map((r) => `<tr>
          <td><a href="#/materi/${r.tp.tab}"><b>TP ${r.tp.n}</b></a></td>
          <td>Kasus ${r.tp.mission}: ${r.mission === true ? '<span style="color:var(--ok);font-weight:700">benar</span>' : r.mission === false ? '<span style="color:var(--bad);font-weight:700">salah</span>' : '<span class="muted">belum</span>'}</td>
          <td>${r.quiz ? r.quiz + ' benar' : '<span class="muted">belum</span>'}</td>
          <td>${[5, 6, 7, 8].includes(r.tp.n) ? r.practice + ' soal' : '<span class="muted">–</span>'}</td>
          <td>${STATUS[r.status]}</td></tr>`).join('')}
      </table></div>
    </div>`;
  }

  function render(el) {
    const c = C();
    el.innerHTML = `<div class="container page">
      <div class="page-head">
        <span class="eyebrow">${GM.icon('flag', 14)} Tujuan Pembelajaran</span>
        <h1>Peta Belajar GeoMatch</h1>
        <p>Seluruh isi website (materi, laboratorium, misi, dan evaluasi) disusun berdasarkan Capaian Pembelajaran, Tujuan Pembelajaran, dan Alur Tujuan Pembelajaran berikut.</p>
      </div>
      <div class="card">
        <div class="btn-row"><span class="chip chip-navy">Elemen: ${c.elemen}</span><span class="chip">Fase: ${c.fase}</span></div>
        <h3 style="margin-top:12px">Capaian Pembelajaran (CP)</h3>
        <p>${c.cp}</p>
      </div>
      ${c.stages.map((st) => `<div class="card">
        <h2>${st.name}</h2>
        <div class="grid grid-2">
          <div>
            <h4>Tujuan Pembelajaran (TP)</h4>
            <ul class="info-list">${st.tps.map((n) => {
              const tp = GM.tpOf(n);
              const m = GM.MISSIONS[tp.mission - 1];
              return `<li><span class="dot" style="background:var(--royal)"></span><div><b>TP ${n}:</b> ${tp.text}
                <div class="btn-row" style="margin-top:6px"><a class="btn btn-outline btn-sm" href="#/materi/${tp.tab}">${GM.icon('book', 14)} Materi</a><a class="btn btn-outline btn-sm" href="#/misi/${tp.mission}">${GM.icon('target', 14)} Kasus ${tp.mission}: ${m.title}</a></div></div></li>`;
            }).join('')}</ul>
          </div>
          <div>
            <h4>Alur Tujuan Pembelajaran (ATP)</h4>
            <ul class="info-list">${st.atp.map((a) => `<li><span class="dot" style="background:var(--ok)"></span><div><b>${a.code}:</b> ${a.text}</div></li>`).join('')}</ul>
            <h4 style="margin-top:14px">Pendekatan</h4>
            <p>${st.approach}</p>
            <ol class="alur">${st.steps.map((x) => `<li>${x}</li>`).join('')}</ol>
            <h4 style="margin-top:14px">Materi</h4>
            <ul class="clean">${st.materi.map((x) => `<li>${x}</li>`).join('')}</ul>
          </div>
        </div>
      </div>`).join('')}
      <div class="card">
        <h3>${GM.icon('layers', 20)} Bagaimana website ini mendukung setiap ATP</h3>
        <div class="table-wrap"><table class="data">
          <tr><th>ATP</th><th>Fitur di website</th></tr>
          <tr><td><b>ATP 1</b></td><td>Eksplorasi karton virtual pada TP 1 dan TP 2 (geser, putar, cerminkan sampai berimpit), serta <a href="#/lab/kongruensi">Deteksi Kongruensi</a>.</td></tr>
          <tr><td><b>ATP 2</b></td><td>Eksplorasi pembesaran foto pada TP 4 dan <a href="#/lab/kesebangunan">Deteksi Kesebangunan</a> (slider faktor skala 0,5 sampai 3).</td></tr>
          <tr><td><b>ATP 3</b></td><td>Latihan Seletak acak pada TP 5 dan TP 6 dengan bantuan warna (color-coding) dan soal bervariabel.</td></tr>
          <tr><td><b>ATP 4</b></td><td>Latihan Seletak acak pada TP 7 dan TP 8 dengan perbandingan senilai, Teorema Thales, dan garis tinggi segitiga siku-siku.</td></tr>
          <tr><td><b>ATP 5</b></td><td>Masalah kontekstual TP 9 dan TP 10 (lebar sungai, tinggi pohon dengan bayangan, tinggi gedung dengan cermin) dan Proyek Mini PjBL.</td></tr>
        </table></div>
      </div>
      ${reportCard()}
    </div>`;
  }

  GM.TujuanPage = { render, reportCard };
})();
