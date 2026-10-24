/* Komponen Navbar */
(function () {
  const GM = window.GM;
  const LINKS = [
    { id: 'beranda', label: 'Beranda', icon: 'home' },
    { id: 'tujuan', label: 'Tujuan', icon: 'flag' },
    { id: 'petunjuk', label: 'Petunjuk', icon: 'help' },
    { id: 'materi', label: 'Materi', icon: 'book' },
    { id: 'lab', label: 'Lab', long: 'oratorium', icon: 'flask' },
    { id: 'misi', label: 'Misi', long: ' Detektif', icon: 'target' },
    { id: 'evaluasi', label: 'Evaluasi', icon: 'clipboard' },
    { id: 'hasil', label: 'Hasil', icon: 'trophy' }
  ];
  let active = 'beranda';
  let root = null;

  // Tautan Dasbor Guru hanya muncul untuk akun guru.
  function links() {
    const c = GM.cloud;
    return c && c.role === 'guru' ? LINKS.concat([{ id: 'guru', label: 'Guru', icon: 'clipboard' }]) : LINKS;
  }

  function account() {
    const c = GM.cloud;
    if (!c || !c.enabled) return '';
    if (!c.resolved) return '<span class="nav-user muted-light">...</span>';
    if (!c.user) return `<a class="nav-user" href="#/masuk">${GM.icon('lock', 16)} Masuk</a>`;
    const name = (c.profile && c.profile.name) || c.user.email;
    const dot = c.role === 'siswa' ? `<span class="sync-dot ${c.syncState}" title="${{ saving: 'Menyimpan', saved: 'Tersimpan di server', error: 'Gagal menyimpan', offline: 'Offline', idle: 'Siap' }[c.syncState]}"></span>` : '';
    return `<a class="nav-user" href="#/masuk" title="Akun: ${GM.esc(name)}">${dot}${GM.icon(c.role === 'guru' ? 'clipboard' : 'hat', 16)} <span class="nu-name">${GM.esc(name.split(' ')[0])}</span></a>`;
  }

  function html() {
    const st = GM.store.missionStats();
    return `<nav class="container nav-inner" aria-label="Navigasi utama">
      <a class="brand" href="#/beranda" aria-label="GeoMatch beranda">
        <span class="brand-logo"><svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 50 L26 14 L38 50 Z" fill="#BFDBFE" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="43" cy="33" r="11" fill="none" stroke="#BBF7D0" stroke-width="5"/><path d="M51 41 L58 48" stroke="#BBF7D0" stroke-width="6" stroke-linecap="round"/></svg></span>
        <span class="brand-text"><strong>GeoMatch</strong><span>Detektif Bangun Geometri</span></span>
      </a>
      <ul class="nav-links" id="nav-links">
        ${links().map((l) => `<li><a href="#/${l.id}" data-id="${l.id}" class="${l.id === active ? 'active' : ''}" ${l.id === active ? 'aria-current="page"' : ''}>${GM.icon(l.icon, 18)}<span>${l.label}${l.long ? `<span class="lbl-long">${l.long}</span>` : ''}</span></a></li>`).join('')}
      </ul>
      <span class="nav-score" title="Skor misi detektif">${GM.icon('star', 16)} ${st.score}/${st.max}</span>
      ${account()}
      <button class="nav-toggle" id="nav-toggle" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-links">${GM.icon('menu', 22)}</button>
    </nav>`;
  }

  function render() {
    if (!root) return;
    root.innerHTML = html();
    const btn = root.querySelector('#nav-toggle');
    const list = root.querySelector('#nav-links');
    btn.addEventListener('click', () => {
      const open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    list.addEventListener('click', (e) => {
      if (e.target.closest('a')) list.classList.remove('open');
    });
  }

  GM.Navbar = {
    mount(el) {
      root = el;
      render();
      GM.store.subscribe(render);
      if (GM.cloud) GM.cloud.onChange(render);
    },
    setActive(id) { active = id; render(); }
  };
})();
