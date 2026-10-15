/* Penyimpanan progres belajar di localStorage. */
(function () {
  const GM = window.GM;
  const KEY = 'geomatch.progress.v2'; // v2: struktur 10 kasus sesuai 10 TP
  const MISSION_COUNT = 10;
  const POINTS = 10;

  const BADGES = [
    { id: 'pemula', name: 'Detektif Pemula', need: 1, desc: 'Menyelesaikan 1 kasus', icon: 'search' },
    { id: 'analis', name: 'Analis Geometri', need: 3, desc: 'Menyelesaikan 3 kasus', icon: 'compass' },
    { id: 'master', name: 'Master GeoMatch', need: 10, desc: 'Menyelesaikan seluruh kasus', icon: 'trophy' }
  ];

  function defaults() {
    return {
      missions: {},        // { [id]: { done, firstCorrect, attempts, hints, revealed, lastChoice } }
      currentCase: 1,
      material: {},        // tab yang sudah dibuka
      lab: {},             // tantangan laboratorium yang sudah tercapai
      apps: {},            // soal penerapan yang sudah dijawab benar
      practice: {},        // { [tp]: jumlah soal latihan seletak yang dijawab benar }
      settings: { colorHelp: true },
      quiz: { answers: {}, essays: {}, finals: {}, submitted: false, result: null, timer: false, startedAt: null, remaining: null },
      quizHistory: [],
      badges: [],
      version: 1
    };
  }

  let state = defaults();
  let storageOk = true;
  const subs = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const d = defaults();
        state = Object.assign(d, data);
        state.quiz = Object.assign(defaults().quiz, data.quiz || {});
        state.settings = Object.assign(defaults().settings, data.settings || {});
      }
    } catch (e) {
      storageOk = false;
      state = defaults();
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; }
  }

  function missionStats() {
    let completed = 0, correct = 0, wrong = 0;
    for (let i = 1; i <= MISSION_COUNT; i++) {
      const m = state.missions[i];
      if (!m) continue;
      if (m.done) completed++;
      if (m.firstCorrect === true) correct++;
      else if (m.firstCorrect === false) wrong++;
    }
    const score = correct * POINTS;
    return {
      completed, correct, wrong, score, total: MISSION_COUNT, max: MISSION_COUNT * POINTS,
      percent: Math.round((correct / MISSION_COUNT) * 100),
      allDone: completed === MISSION_COUNT
    };
  }

  function checkBadges() {
    const { completed } = missionStats();
    const fresh = [];
    BADGES.forEach((b) => {
      if (completed >= b.need && !state.badges.includes(b.id)) {
        state.badges.push(b.id);
        fresh.push(b);
      }
    });
    return fresh;
  }

  GM.store = {
    KEY, BADGES, MISSION_COUNT, POINTS,
    get: () => state,
    get storageOk() { return storageOk; },
    update(fn) {
      fn(state);
      const fresh = checkBadges();
      save();
      subs.forEach((cb) => cb(state));
      fresh.forEach((b) => GM.toast('Badge baru: ' + b.name, b.desc + '. Hebat, Detektif!', b.icon));
      return fresh;
    },
    subscribe(cb) { subs.add(cb); return () => subs.delete(cb); },
    missionStats,
    earnedBadges: () => BADGES.filter((b) => state.badges.includes(b.id)),
    isUnlocked(id) { return id === 1 || !!(state.missions[id - 1] && state.missions[id - 1].done); },
    resetMissions() {
      GM.store.update((s) => { s.missions = {}; s.currentCase = 1; s.badges = []; });
    },
    resetQuiz() {
      GM.store.update((s) => { s.quiz = defaults().quiz; });
    },
    resetAll() {
      state = defaults();
      save();
      subs.forEach((cb) => cb(state));
    }
  };

  load();
})();
