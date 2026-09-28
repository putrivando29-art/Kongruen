/* Router berbasis hash: #/beranda, #/petunjuk, #/materi/:tab, #/lab/:alat, #/misi/:kasus, #/evaluasi, #/hasil */
(function () {
  const GM = window.GM;
  const ROUTES = {
    beranda: { page: () => GM.HomePage, title: 'Beranda' },
    petunjuk: { page: () => GM.GuidePage, title: 'Petunjuk Permainan' },
    materi: { page: () => GM.MaterialPage, title: 'Materi' },
    lab: { page: () => GM.LabPage, title: 'Laboratorium Geometri' },
    misi: { page: () => GM.MissionGame, title: 'Misi Detektif' },
    evaluasi: { page: () => GM.QuizPage, title: 'Evaluasi' },
    hasil: { page: () => GM.ResultPage, title: 'Hasil Investigasi' }
  };
  let current = null;
  let lastKey = '';

  function route() {
    const parts = (location.hash || '#/beranda').replace(/^#\/?/, '').split('/').filter(Boolean);
    const name = ROUTES[parts[0]] ? parts[0] : 'beranda';
    const key = name + '/' + parts.slice(1).join('/');
    const app = document.getElementById('app');
    if (current && current.destroy) current.destroy();
    GM.clearResize();
    current = ROUTES[name].page();
    GM.Navbar.setActive(name);
    try {
      current.render(app, parts.slice(1));
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="container page"><div class="card"><h2>Terjadi kesalahan</h2><p>Halaman tidak dapat dimuat. Coba muat ulang halaman.</p><a class="btn btn-primary" href="#/beranda">Kembali ke Beranda</a></div></div>`;
    }
    document.title = `${ROUTES[name].title} · GeoMatch: Detektif Bangun Geometri`;
    // Gulir ke atas hanya jika berpindah halaman/tab
    if (key !== lastKey) window.scrollTo(0, 0);
    lastKey = key;
  }

  function start() {
    GM.Navbar.mount(document.getElementById('navbar'));
    window.addEventListener('hashchange', route);
    if (!location.hash) history.replaceState(null, '', '#/beranda');
    route();
    if (!GM.store.storageOk) GM.toast('Penyimpanan tidak tersedia', 'Progres hanya bertahan selama halaman terbuka.', 'lock');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
