/* Komponen Navbar */
(function () {
  const GM = window.GM;
  const LINKS = [
    { id: 'beranda', label: 'Beranda', icon: 'home' },
    { id: 'petunjuk', label: 'Petunjuk', icon: 'help' },
    { id: 'materi', label: 'Materi', icon: 'book' },
    { id: 'lab', label: 'Laboratorium', icon: 'flask' },
    { id: 'misi', label: 'Misi', long: ' Detektif', icon: 'target' },
    { id: 'evaluasi', label: 'Evaluasi', icon: 'clipboard' },
    { id: 'hasil', label: 'Hasil', icon: 'trophy' }
  ];
  let active = 'beranda';
  let root = null;

  function html() {
    const st = GM.store.missionStats();
    return `<nav class="container nav-inner" aria-label="Navigasi utama">
      <a class="brand" href="#/beranda" aria-label="GeoMatch beranda">
        <span class="brand-logo"><svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 50 L26 14 L38 50 Z" fill="#BFDBFE" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><circle cx="43" cy="33" r="11" fill="none" stroke="#BBF7D0" stroke-width="5"/><path d="M51 41 L58 48" stroke="#BBF7D0" stroke-width="6" stroke-linecap="round"/></svg></span>
        <span class="brand-text"><strong>GeoMatch</strong><span>Detektif Bangun Geometri</span></span>
      </a>
      <ul class="nav-links" id="nav-links">
        ${LINKS.map((l) => `<li><a href="#/${l.id}" data-id="${l.id}" class="${l.id === active ? 'active' : ''}" ${l.id === active ? 'aria-current="page"' : ''}>${GM.icon(l.icon, 18)}<span>${l.label}${l.long ? `<span class="lbl-long">${l.long}</span>` : ''}</span></a></li>`).join('')}
      </ul>
      <span class="nav-score" title="Skor misi detektif">${GM.icon('star', 16)} ${st.score}/${st.max}</span>
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
    },
    setActive(id) { active = id; render(); }
  };
})();
