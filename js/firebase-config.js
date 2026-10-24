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
    apiKey: 'AIzaSyBNMF91GJhLY7o1dRPvtnjl53VE7tqj_4M',
    authDomain: 'geomatch-74f08.firebaseapp.com',
    projectId: 'geomatch-74f08',
    storageBucket: 'geomatch-74f08.firebasestorage.app',
    messagingSenderId: '682450836814',
    appId: '1:682450836814:web:4d2b99eb815342ef02121f'
  },

  // true  = siswa wajib masuk (login) sebelum membuka Misi, Evaluasi, dan Hasil.
  // false = login boleh dilewati; progres siswa yang tidak login tidak terkirim ke guru.
  requireLogin: true,

  // Hanya untuk pengujian lokal dengan Firebase Emulator Suite. Biarkan false saat online.
  useEmulator: false
};
