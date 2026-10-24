/* Halaman Masuk / Daftar (siswa) dan Masuk Guru */
(function () {
  const GM = window.GM;
  const AFTER_KEY = 'geomatch.after';
  let mode = 'masuk'; // masuk | daftar | guru | lupa

  function rememberTarget(hash) { try { sessionStorage.setItem(AFTER_KEY, hash); } catch (e) { /* abaikan */ } }
  function takeTarget() {
    let h = null;
    try { h = sessionStorage.getItem(AFTER_KEY); sessionStorage.removeItem(AFTER_KEY); } catch (e) { /* abaikan */ }
    return h;
  }

  function notConfigured() {
    return `<div class="card" style="max-width:640px;margin:0 auto">
      <h2>${GM.icon('lock', 22)} Login belum diaktifkan</h2>
      <p>Website ini sedang berjalan tanpa akun: progres hanya tersimpan di perangkat ini dan tidak terkirim ke guru.</p>
      <p class="muted small">Untuk mengaktifkan login siswa dan dasbor guru, isi berkas <code>js/firebase-config.js</code> dengan konfigurasi proyek Firebase. Langkah lengkap ada di <code>docs/TUTORIAL_FIREBASE.md</code>.</p>
      <a class="btn btn-primary" href="#/beranda">${GM.icon('home', 18)} Kembali ke Beranda</a>
    </div>`;
  }

  function account(c) {
    const p = c.profile || {};
    const syncText = { saving: 'Menyimpan ke server ...', saved: 'Progres tersimpan di server.', error: 'Gagal menyimpan: ' + c.error, offline: 'Sedang offline. Progres akan dikirim saat online.', idle: 'Progres akan tersimpan otomatis.' }[c.syncState];
    return `<div class="card" style="max-width:640px;margin:0 auto">
      <span class="chip ${c.role === 'guru' ? 'chip-navy' : 'chip-mint'}">${c.role === 'guru' ? 'Akun guru' : 'Akun siswa'}</span>
      <h2 style="margin-top:10px">${GM.esc(p.name || c.user.email)}</h2>
      <p class="muted">${GM.esc(c.user.email)}${p.kelas ? ' · Kelas ' + GM.esc(p.kelas) : ''}</p>
      ${c.role === 'siswa' ? `<p class="small">${GM.icon('check', 16)} ${GM.esc(syncText)}</p>
        <details style="margin:10px 0"><summary class="small" style="cursor:pointer">Ubah nama atau kelas</summary>
          <div class="grid grid-2" style="margin-top:10px">
            <div class="control"><label for="pf-name">Nama lengkap</label><input type="text" id="pf-name" value="${GM.esc(p.name || '')}" maxlength="80"></div>
            <div class="control"><label for="pf-kelas">Kelas</label><input type="text" id="pf-kelas" value="${GM.esc(p.kelas || '')}" maxlength="30"></div>
          </div>
          <button class="btn btn-outline btn-sm" id="pf-save">Simpan profil</button> <span class="small muted" id="pf-msg"></span>
        </details>` : ''}
      ${c.role === null ? `<div class="feedback bad"><div class="f-ico">${GM.icon('x', 18, 3)}</div><div><strong>Profil akun tidak dapat dimuat.</strong>${GM.esc(c.error)}</div></div>` : ''}
      <div class="btn-row" style="margin-top:12px">
        ${c.role === 'guru' ? `<a class="btn btn-primary" href="#/guru">${GM.icon('clipboard', 18)} Buka Dasbor Guru</a>` : `<a class="btn btn-primary" href="#/misi">${GM.icon('play', 18)} Lanjutkan Investigasi</a>`}
        <button class="btn btn-danger-soft" id="lg-out">${GM.icon('left', 18)} Keluar</button>
      </div>
      <p class="small muted" style="margin-top:12px">Gunakan tombol Keluar jika perangkat ini dipakai bergantian, agar progresmu tidak tercampur dengan siswa lain.</p>
    </div>`;
  }

  function form() {
    const tab = (id, label) => `<button class="${mode === id || (id === 'masuk' && mode === 'lupa') ? 'active' : ''}" data-mode="${id}">${label}</button>`;
    let body = '';
    if (mode === 'masuk') body = `
      <div class="control"><label for="lg-email">Email</label><input type="text" inputmode="email" id="lg-email" autocomplete="username"></div>
      <div class="control"><label for="lg-pass">Kata sandi</label><input type="password" id="lg-pass" autocomplete="current-password"></div>
      <button class="btn btn-primary" id="lg-go" style="width:100%">${GM.icon('right', 18)} Masuk sebagai siswa</button>
      <p class="small" style="margin-top:10px"><a href="#" data-mode="lupa">Lupa kata sandi?</a> · Belum punya akun? <a href="#" data-mode="daftar">Daftar</a></p>`;
    if (mode === 'daftar') body = `
      <div class="control"><label for="lg-name">Nama lengkap</label><input type="text" id="lg-name" maxlength="80" autocomplete="name"></div>
      <div class="control"><label for="lg-kelas">Kelas (contoh: IX A)</label><input type="text" id="lg-kelas" maxlength="30"></div>
      <div class="control"><label for="lg-email">Email</label><input type="text" inputmode="email" id="lg-email" autocomplete="username"></div>
      <div class="control"><label for="lg-pass">Kata sandi (minimal 6 karakter)</label><input type="password" id="lg-pass" autocomplete="new-password"></div>
      <div class="control"><label for="lg-pass2">Ulangi kata sandi</label><input type="password" id="lg-pass2" autocomplete="new-password"></div>
      <button class="btn btn-primary" id="lg-go" style="width:100%">${GM.icon('check', 18)} Daftar akun siswa</button>`;
    if (mode === 'guru') body = `
      <div class="callout"><p class="small">Akun guru dibuat oleh admin sekolah di Firebase Console. Guru tidak dapat mendaftar dari halaman ini.</p></div>
      <div class="control"><label for="lg-email">Email guru</label><input type="text" inputmode="email" id="lg-email" autocomplete="username"></div>
      <div class="control"><label for="lg-pass">Kata sandi</label><input type="password" id="lg-pass" autocomplete="current-password"></div>
      <button class="btn btn-navy" id="lg-go" style="width:100%">${GM.icon('clipboard', 18)} Masuk sebagai guru</button>`;
    if (mode === 'lupa') body = `
      <p class="small muted">Masukkan email akunmu. Tautan untuk membuat kata sandi baru akan dikirim ke email tersebut.</p>
      <div class="control"><label for="lg-email">Email</label><input type="text" inputmode="email" id="lg-email" autocomplete="username"></div>
      <button class="btn btn-primary" id="lg-go" style="width:100%">${GM.icon('send', 18)} Kirim tautan atur ulang</button>
      <p class="small" style="margin-top:10px"><a href="#" data-mode="masuk">Kembali ke Masuk</a></p>`;
    return `<div class="card" style="max-width:480px;margin:0 auto">
      <div class="seg" role="tablist" style="width:100%;margin-bottom:16px">${tab('masuk', 'Masuk Siswa')}${tab('daftar', 'Daftar Siswa')}${tab('guru', 'Masuk Guru')}</div>
      <form id="lg-form" novalidate>${body}</form>
      <div id="lg-msg" aria-live="polite"></div>
    </div>`;
  }

  function render(el) {
    const c = GM.cloud;
    let inner;
    if (!c || !c.enabled) inner = notConfigured();
    else if (!c.resolved) inner = `<div class="card center" style="max-width:480px;margin:0 auto"><p>${GM.icon('clock', 18)} Memeriksa status akun ...</p></div>`;
    else if (c.user && (c.role || c.error)) inner = account(c);
    else inner = form();

    el.innerHTML = `<div class="container page">
      <div class="page-head center" style="text-align:center">
        <span class="eyebrow">${GM.icon('lock', 14)} Akun</span>
        <h1>Masuk ke GeoMatch</h1>
        <p style="margin:0 auto">Masuk agar hasil investigasi, latihan, dan evaluasimu tersimpan di server dan dapat dipantau oleh guru.</p>
      </div>
      ${inner}
    </div>`;
    bind(el);
  }

  function bind(el) {
    const c = GM.cloud;
    const $ = (id) => el.querySelector('#' + id);
    el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); mode = b.dataset.mode; render(el); }));
    const out = $('lg-out');
    if (out) out.addEventListener('click', async () => {
      out.disabled = true;
      await c.signOut();
      mode = 'masuk';
      GM.toast('Berhasil keluar', 'Sampai jumpa, Detektif!', 'check');
      GM.go('#/masuk');
    });
    const pf = $('pf-save');
    if (pf) pf.addEventListener('click', async () => {
      const name = $('pf-name').value.trim(), kelas = $('pf-kelas').value.trim().toUpperCase();
      if (!name) { $('pf-msg').textContent = 'Nama wajib diisi.'; return; }
      try { await c.updateProfile({ name, kelas }); $('pf-msg').textContent = 'Profil disimpan.'; } catch (e) { $('pf-msg').textContent = c.errorMessage(e); }
    });
    const f = $('lg-form');
    if (!f) return;
    const show = (kind, text) => { $('lg-msg').innerHTML = `<div class="feedback ${kind}"><div class="f-ico">${GM.icon(kind === 'ok' ? 'check' : kind === 'info' ? 'bulb' : 'x', 18, 3)}</div><div>${GM.esc(text)}</div></div>`; };
    f.addEventListener('submit', (e) => { e.preventDefault(); $('lg-go').click(); });
    $('lg-go').addEventListener('click', async () => {
      const email = ($('lg-email').value || '').trim();
      const btn = $('lg-go');
      if (!email) return show('bad', 'Email wajib diisi.');
      btn.disabled = true;
      show('info', 'Memproses ...');
      try {
        if (mode === 'lupa') {
          await c.resetPassword(email);
          show('ok', 'Jika email terdaftar, tautan atur ulang kata sandi sudah dikirim. Periksa juga folder spam.');
        } else if (mode === 'daftar') {
          const name = $('lg-name').value.trim(), kelas = $('lg-kelas').value.trim().toUpperCase();
          const p1 = $('lg-pass').value, p2 = $('lg-pass2').value;
          if (!name || !kelas) throw { message: 'Nama dan kelas wajib diisi.' };
          if (p1.length < 6) throw { message: 'Kata sandi minimal 6 karakter.' };
          if (p1 !== p2) throw { message: 'Kedua kata sandi tidak sama.' };
          await c.signUpStudent({ name, kelas, email, password: p1 });
          GM.toast('Akun dibuat', 'Selamat datang, ' + name + '!', 'check');
          GM.go(takeTarget() || '#/misi');
        } else {
          const role = await c.signIn(email, $('lg-pass').value);
          if (mode === 'guru' && role !== 'guru') {
            await c.signOut();
            throw { message: 'Akun ini belum terdaftar sebagai guru. Minta admin menambahkan dokumen teachers untuk akun ini.' };
          }
          if (!role) throw { message: c.error || 'Profil akun tidak dapat dimuat.' };
          GM.toast('Berhasil masuk', role === 'guru' ? 'Dasbor guru siap digunakan.' : 'Progresmu dimuat dari server.', 'check');
          GM.go(role === 'guru' ? '#/guru' : takeTarget() || '#/misi');
        }
      } catch (err) {
        show('bad', c.errorMessage(err));
      } finally {
        if (btn.isConnected) btn.disabled = false;
      }
    });
  }

  GM.LoginPage = { render, rememberTarget };
})();
