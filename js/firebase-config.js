/* =====================================================================
   KONFIGURASI FIREBASE GEOMATCH
   ---------------------------------------------------------------------
   Isi bagian `config` dengan nilai dari Firebase Console:
   Project settings (ikon roda gigi) > General > Your apps > Web app > SDK setup and configuration > Config.
   Lihat langkah lengkapnya di docs/TUTORIAL_FIREBASE.md.

   Selama apiKey dan projectId masih kosong, website tetap berjalan
   seperti biasa tanpa login (progres hanya tersimpan di perangkat).
   ===================================================================== */
window.GEOMATCH_FIREBASE = {
  config: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },

  // true  = siswa wajib masuk (login) sebelum membuka Misi, Evaluasi, dan Hasil.
  // false = login boleh dilewati; progres siswa yang tidak login tidak terkirim ke guru.
  requireLogin: true,

  // Hanya untuk pengujian lokal dengan Firebase Emulator Suite. Biarkan false saat online.
  useEmulator: false
};
