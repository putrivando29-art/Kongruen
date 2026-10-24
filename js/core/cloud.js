/* Login dan penyimpanan progres ke Firebase (Authentication + Cloud Firestore).
   Struktur data Firestore:
     users/{uid}     : profil siswa { uid, name, kelas, email, role: 'siswa', createdAt }
     progress/{uid}  : progres siswa { uid, name, kelas, email, stateJson, summary, updatedAt }
     teachers/{uid}  : penanda akun guru { name } (dibuat manual oleh admin di Firebase Console)
   Hak akses diatur oleh firestore.rules. */
(function () {
  const GM = window.GM;
  const CFG = window.GEOMATCH_FIREBASE || {};
  const enabled = !!(CFG.config && CFG.config.apiKey && CFG.config.projectId);
  const SDK = ['vendor/firebase/firebase-app-compat.js', 'vendor/firebase/firebase-auth-compat.js', 'vendor/firebase/firebase-firestore-compat.js'];
  const OWNER_KEY = 'geomatch.owner';

  let auth = null, db = null, fb = null;
  let user = null, profile = null, role = null;
  let resolved = !enabled;            // status login sudah diketahui?
  let rolePromise = Promise.resolve(null);
  let roleUid = null;                 // uid yang perannya sedang/sudah dimuat
  let signingUp = false, applyingRemote = false;
  let syncState = 'idle';             // idle | saving | saved | error | offline
  let pushTimer = null, dirty = false;
  let initError = '';
  const listeners = new Set();
  const emit = (type) => listeners.forEach((cb) => { try { cb(type); } catch (e) { console.error(e); } });

  /* ---------- Pesan kesalahan berbahasa Indonesia ---------- */
  const ERR = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan. Periksa email atau daftar terlebih dahulu.',
    'auth/wrong-password': 'Kata sandi salah.',
    'auth/invalid-credential': 'Email atau kata sandi salah.',
    'auth/invalid-login-credentials': 'Email atau kata sandi salah.',
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Kata sandi minimal 6 karakter.',
    'auth/missing-password': 'Kata sandi belum diisi.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.',
    'auth/network-request-failed': 'Tidak ada koneksi internet atau server tidak dapat dihubungi.',
    'auth/operation-not-allowed': 'Metode login Email/Password belum diaktifkan di Firebase Console.',
    'auth/configuration-not-found': 'Firebase Authentication belum diaktifkan. Di Firebase Console buka Authentication, klik Get started, lalu aktifkan Email/Password.',
    'auth/unauthorized-domain': 'Domain website ini belum didaftarkan di Firebase (Authentication > Settings > Authorized domains).',
    'permission-denied': 'Akses ditolak oleh aturan keamanan Firestore. Periksa firestore.rules.',
    'unavailable': 'Server Firestore tidak dapat dihubungi. Periksa koneksi internet.'
  };
  const msg = (e) => (e && (ERR[e.code] || ERR[(e.code || '').replace('firestore/', '')])) || (e && e.message) || 'Terjadi kesalahan.';

  /* ---------- Memuat SDK (disimpan lokal di vendor/firebase) ---------- */
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = () => rej(new Error('Gagal memuat ' + src));
      document.head.appendChild(s);
    });
  }

  async function init() {
    try {
      if (!window.firebase) for (const src of SDK) await loadScript(src);
      fb = window.firebase;
      fb.initializeApp(CFG.config);
      auth = fb.auth();
      db = fb.firestore();
      if (CFG.useEmulator) {
        auth.useEmulator('http://127.0.0.1:9099');
        db.useEmulator('127.0.0.1', 8080);
      }
      auth.onAuthStateChanged((u) => {
        user = u; profile = null; role = null;
        if (!u) { resolved = true; rolePromise = Promise.resolve(null); emit('auth'); return; }
        if (signingUp) return; // pendaftaran memuat profil sendiri
        roleUid = u.uid;
        rolePromise = loadRole(u);
        rolePromise.finally(() => { resolved = true; emit('auth'); });
      });
    } catch (e) {
      console.error(e);
      initError = msg(e);
      resolved = true;
      emit('auth');
    }
  }

  async function loadRole(u) {
    try {
      const t = await db.collection('teachers').doc(u.uid).get();
      if (t.exists) {
        role = 'guru';
        profile = { name: (t.data() && t.data().name) || u.displayName || u.email, email: u.email };
        return role;
      }
      const d = await db.collection('users').doc(u.uid).get();
      role = 'siswa';
      profile = d.exists ? d.data() : { name: u.displayName || u.email, kelas: '', email: u.email };
      await pullProgress();
      return role;
    } catch (e) {
      console.error(e);
      initError = msg(e);
      role = null;
      return null;
    }
  }

  /* ---------- Sinkronisasi progres siswa ---------- */
  function summary(st) {
    const ms = GM.store.missionStats(st);
    const q = st.quiz || {};
    const r = q.submitted && q.result ? q.result : null;
    return {
      missionScore: ms.score, missionsDone: ms.completed, missionsCorrect: ms.correct, missionsWrong: ms.wrong,
      quizSubmitted: !!r, quizScore: r ? r.mcScore : null, essayOk: r ? r.essayOk : null,
      tp: GM.tpReport(st).map((x) => x.status),
      materialCount: GM.MaterialPage ? GM.MaterialPage.TABS.filter((t) => (st.material || {})[t.id]).length : Object.keys(st.material || {}).length,
      practiceTotal: Object.values(st.practice || {}).reduce((a, b) => a + b, 0),
      appsSolved: Object.keys(st.apps || {}).length,
      badges: (st.badges || []).length
    };
  }

  async function pullProgress() {
    const ref = db.collection('progress').doc(user.uid);
    const snap = await ref.get();
    let owner = null;
    try { owner = localStorage.getItem(OWNER_KEY); } catch (e) { /* abaikan */ }
    if (snap.exists && snap.data().stateJson) {
      applyingRemote = true;
      try { GM.store.replace(JSON.parse(snap.data().stateJson)); } finally { applyingRemote = false; }
    } else if (owner && owner !== user.uid) {
      // Progres di perangkat milik akun lain: mulai dari kosong.
      applyingRemote = true;
      try { GM.store.resetAll(); } finally { applyingRemote = false; }
      await push();
    } else {
      // Belum ada data di server: unggah progres yang sudah ada di perangkat.
      await push();
    }
    try { localStorage.setItem(OWNER_KEY, user.uid); } catch (e) { /* abaikan */ }
  }

  async function push() {
    if (!user || role !== 'siswa' || !db) return;
    clearTimeout(pushTimer);
    dirty = false;
    const st = GM.store.get();
    syncState = 'saving'; emit('sync');
    try {
      await db.collection('progress').doc(user.uid).set({
        uid: user.uid,
        name: (profile && profile.name) || user.displayName || user.email,
        kelas: (profile && profile.kelas) || '',
        email: user.email,
        stateJson: JSON.stringify(st),
        summary: summary(st),
        updatedAt: fb.firestore.FieldValue.serverTimestamp()
      });
      syncState = 'saved';
    } catch (e) {
      console.error(e);
      syncState = navigator.onLine === false ? 'offline' : 'error';
      initError = msg(e);
      dirty = true;
    }
    emit('sync');
  }

  function schedulePush() {
    if (applyingRemote || !user || role !== 'siswa') return;
    dirty = true;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 2500);
  }

  /* ---------- API publik ---------- */
  const cloud = {
    enabled,
    requireLogin: enabled && CFG.requireLogin !== false,
    get user() { return user; },
    get profile() { return profile; },
    get role() { return role; },
    get resolved() { return resolved; },
    get syncState() { return syncState; },
    get error() { return initError; },
    onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
    errorMessage: msg,

    async signUpStudent({ name, kelas, email, password }) {
      signingUp = true;
      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const u = cred.user;
        await u.updateProfile({ displayName: name });
        const data = { uid: u.uid, name, kelas, email, role: 'siswa', createdAt: fb.firestore.FieldValue.serverTimestamp() };
        await db.collection('users').doc(u.uid).set(data);
        user = u; role = 'siswa'; profile = { uid: u.uid, name, kelas, email }; roleUid = u.uid; rolePromise = Promise.resolve(role);
        await pullProgress();
        resolved = true;
        emit('auth');
        return role;
      } finally {
        signingUp = false;
      }
    },

    async signIn(email, password) {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      // tunggu sampai pendengar login mulai memuat peran (guru/siswa) akun ini
      for (let i = 0; i < 100 && roleUid !== uid; i++) await new Promise((r) => setTimeout(r, 50));
      return rolePromise;
    },

    async signOut() {
      if (dirty) await push();
      await auth.signOut();
      try { localStorage.removeItem(OWNER_KEY); } catch (e) { /* abaikan */ }
      applyingRemote = true;
      try { GM.store.resetAll(); } finally { applyingRemote = false; }
      syncState = 'idle';
    },

    resetPassword(email) { return auth.sendPasswordResetEmail(email); },

    async updateProfile({ name, kelas }) {
      await db.collection('users').doc(user.uid).set({ uid: user.uid, name, kelas, email: user.email, role: 'siswa' }, { merge: true });
      profile = Object.assign({}, profile, { name, kelas });
      await push();
      emit('auth');
    },

    saveNow: push,

    // ---- khusus guru ----
    async listStudents() {
      const snap = await db.collection('progress').get();
      return snap.docs.map((d) => {
        const x = d.data();
        let state = null;
        try { state = JSON.parse(x.stateJson || 'null'); } catch (e) { state = null; }
        return { id: d.id, name: x.name || '(tanpa nama)', kelas: x.kelas || '-', email: x.email || '', summary: x.summary || {}, state, updatedAt: x.updatedAt && x.updatedAt.toDate ? x.updatedAt.toDate() : null };
      });
    }
  };

  GM.cloud = cloud;
  if (enabled) {
    GM.store.subscribe(schedulePush);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && dirty) push(); });
    window.addEventListener('online', () => { if (dirty) push(); });
    init();
  }
})();
