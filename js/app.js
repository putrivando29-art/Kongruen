/* Router berbasis hash: #/beranda, #/petunjuk, #/materi/:tab, #/lab/:alat, #/misi/:kasus, #/evaluasi, #/hasil */
(function () {
  const GM = window.GM;
  const ROUTES = {
    beranda: { page: () => GM.HomePage, title: 'Beranda' },
    petunjuk: { page: () => GM.GuidePage, title: 'Petunjuk Permainan' },
    tujuan: { page: () => GM.TujuanPage, title: 'Tujuan Pembelajaran' },
    materi: { page: () => GM.MaterialPage, title: 'Materi' },
    lab: { page: () => GM.LabPage, title: 'Laboratorium Geometri' },
    misi: { page: () => GM.MissionGame, title: 'Misi Detektif' },
    evaluasi: { page: () => GM.QuizPage, title: 'Evaluasi' },
    hasil: { page: () => GM.ResultPage, title: 'Hasil Investigasi' },
    masuk: { page: () => GM.LoginPage, title: 'Masuk' },
    guru: { page: () => GM.TeacherPage, title: 'Dasbor Guru' }
  };
  // Halaman yang mewajibkan login bila Firebase aktif dan requireLogin = true
  const PROTECTED = ['misi', 'evaluasi', 'hasil'];
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
    const c = GM.cloud;
    try {
      if (c && c.requireLogin && PROTECTED.includes(name) && !c.user) {
        if (!c.resolved) {
          app.innerHTML = `<div class="container page"><div class="card center"><p>${GM.icon('clock', 18)} Memeriksa status akun ...</p></div></div>`;
        } else {
          GM.LoginPage.rememberTarget(location.hash);
          current = GM.LoginPage;
          current.render(app, []);
        }
      } else {
        current.render(app, parts.slice(1));
      }
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
    // Muat ulang halaman saat status login berubah (masuk/keluar/peran dimuat).
    if (GM.cloud && GM.cloud.enabled) GM.cloud.onChange((type) => { if (type === 'auth') route(); });
    if (!location.hash) history.replaceState(null, '', '#/beranda');
    route();
    if (!GM.store.storageOk) GM.toast('Penyimpanan tidak tersedia', 'Progres hanya bertahan selama halaman terbuka.', 'lock');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
