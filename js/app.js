/* Objectif Code : suivi du plan d'apprentissage. Données stockées sur l'appareil (localStorage). */
(function () {
  'use strict';

  const KEY = 'objectif-code-v1';
  const GOAL = 35;
  const READY_SCORE = 36;
  const READY_COUNT = 10;
  const MASTER_STREAK = 3;
  const CAUSES = [
    'Règle inconnue',
    'Lu trop vite',
    'Mal observé la photo',
    'Piège de formulation',
    'Réponse multiple incomplète',
    'Autre'
  ];

  /* ---------- Utilitaires ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const isoOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const todayISO = () => isoOf(new Date());
  const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return isoOf(d); };
  const diffDays = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);
  const fmtShort = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtDate = iso => fmtShort.format(parseISO(iso));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const themeById = id => THEMES.find(t => t.id === id);
  const themeName = id => (themeById(id) || {}).name || 'Sans thème';
  const themeShort = id => (themeById(id) || {}).short || 'Sans thème';

  /* ---------- État ---------- */
  function defaults() {
    return { v: 1, onboarded: false, profile: { name: '', start: todayISO() }, theme: 'auto',
      tasks: {}, scores: [], errors: [], activity: {} };
  }
  let state;
  try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch (e) { state = defaults(); }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Impossible d\'enregistrer sur cet appareil'); }
  }
  function touch() { state.activity[todayISO()] = 1; }

  /* ---------- Calculs ---------- */
  const tkey = (n, i) => n + '-' + i;
  const pkey = (n, i, p) => n + '-' + i + '-p' + p;

  function taskDone(n, i) { return !!state.tasks[tkey(n, i)]; }
  function dayProgress(day) {
    const done = day.tasks.filter((_, i) => taskDone(day.n, i)).length;
    return { done, total: day.tasks.length, pct: day.tasks.length ? done / day.tasks.length : 0 };
  }
  function dayComplete(day) { const p = dayProgress(day); return p.done === p.total; }
  function currentDay() { return PLAN.find(d => !dayComplete(d)) || PLAN[PLAN.length - 1]; }
  function daysCompleted() { return PLAN.filter(dayComplete).length; }
  function plannedDate(day) { return addDays(state.profile.start, day.n - 1); }

  function series() {
    return state.scores.filter(s => s.type === 'serie')
      .slice().sort((a, b) => a.date.localeCompare(b.date) || a.ts - b.ts);
  }
  function readyStreak() {
    const s = series(); let c = 0;
    for (let i = s.length - 1; i >= 0; i--) { if (s[i].score >= READY_SCORE) c++; else break; }
    return c;
  }
  function avgLast(n) {
    const s = series().slice(-n);
    if (!s.length) return null;
    return s.reduce((a, b) => a + b.score, 0) / s.length;
  }
  function streakDays() {
    let d = todayISO(), c = 0;
    if (!state.activity[d]) d = addDays(d, -1);
    while (state.activity[d]) { c++; d = addDays(d, -1); }
    return c;
  }
  function themeStats() {
    const out = {};
    THEMES.forEach(t => { out[t.id] = { open: 0, total: 0, pctSum: 0, pctN: 0 }; });
    state.errors.forEach(e => { if (out[e.theme]) { out[e.theme].total++; if (!e.mastered) out[e.theme].open++; } });
    state.scores.forEach(s => { if (s.type === 'theme' && out[s.theme]) { out[s.theme].pctSum += s.score / s.total; out[s.theme].pctN++; } });
    return out;
  }
  function weakTheme() {
    const st = themeStats();
    const avg = id => st[id].pctN ? st[id].pctSum / st[id].pctN : 1;
    const withOpen = THEMES.filter(t => st[t.id].open > 0);
    if (withOpen.length) {
      return withOpen.sort((a, b) => st[b.id].open - st[a.id].open || avg(a.id) - avg(b.id))[0].id;
    }
    const withScores = THEMES.filter(t => st[t.id].pctN > 0);
    if (withScores.length) return withScores.sort((a, b) => avg(a.id) - avg(b.id))[0].id;
    return null;
  }
  function fill(text) {
    const w = weakTheme();
    return String(text)
      .replace(/\{WEAK_ID\}/g, w || '')
      .replace(/\{WEAK\}/g, w ? themeName(w) : 'le thème de ton choix');
  }
  function scoreClass(score, total) {
    const p = score / total;
    if (total === 40) return score >= READY_SCORE ? 'good' : score >= 30 ? 'mid' : 'bad';
    return p >= .9 ? 'good' : p >= .75 ? 'mid' : 'bad';
  }
  function reviewQueue() {
    return state.errors.filter(e => !e.mastered)
      .sort((a, b) => (a.lastReview || '').localeCompare(b.lastReview || '') || (a.ok || 0) - (b.ok || 0));
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Rendu : une journée ---------- */
  const kindLabel = { lesson: 'Cours', check: 'Tâche', score: 'Score', carnet: 'Carnet', review: 'Révision', fiches: 'Fiches' };

  function renderTask(day, i, task) {
    const done = taskDone(day.n, i);
    const k = tkey(day.n, i);
    let extra = '';
    if (task.kind === 'lesson') {
      const l = LESSONS[day.lesson];
      extra = '<ul class="points">' + l.points.map((p, pi) =>
        '<li><label><input type="checkbox" class="check sm" data-action="point" data-n="' + day.n + '" data-i="' + i + '" data-p="' + pi + '"' +
        (state.tasks[pkey(day.n, i, pi)] ? ' checked' : '') + '><span>' + esc(p) + '</span></label></li>').join('') + '</ul>';
    } else if (task.kind === 'score') {
      const rec = state.scores.find(s => s.task === k);
      if (rec) {
        extra = '<div class="task-actions"><span class="score-pill ' + scoreClass(rec.score, rec.total) + '">' + rec.score + '<small>/' + rec.total + '</small></span>' +
          (rec.theme ? '<span class="chip">' + esc(themeShort(rec.theme)) + '</span>' : '') +
          '<button class="btn small" data-action="score-redo" data-id="' + rec.id + '">Modifier</button></div>';
      } else {
        const th = fill(task.theme || '');
        const needTheme = task.stype === 'theme' && !th;
        extra = '<div class="task-actions"><div class="score-input">' +
          '<input type="number" inputmode="numeric" min="0" max="' + task.total + '" placeholder="?" aria-label="Score" id="in-' + k + '">' +
          '<span class="muted">/ ' + task.total + '</span></div>' +
          (needTheme ? '<select id="th-' + k + '" aria-label="Thème" style="width:auto;flex:1;min-width:140px">' + THEMES.map(t => '<option value="' + t.id + '">' + esc(t.short) + '</option>').join('') + '</select>' : '') +
          '<button class="btn primary small" data-action="score-save" data-n="' + day.n + '" data-i="' + i + '">Enregistrer</button></div>';
      }
    } else if (task.kind === 'carnet') {
      const added = state.errors.filter(e => e.date === todayISO()).length;
      extra = '<div class="task-actions"><button class="btn small primary" data-action="err-new" data-theme="' + esc(fill(task.theme || '')) + '">+ Ajouter une erreur</button>' +
        '<span class="small muted">' + added + ' ajoutée' + (added > 1 ? 's' : '') + ' aujourd\'hui</span></div>';
    } else if (task.kind === 'review') {
      const q = reviewQueue().length;
      extra = '<div class="task-actions"><button class="btn small" data-action="review" data-n="' + day.n + '" data-i="' + i + '"' + (q ? '' : ' disabled') + '>Réviser ' + q + ' fiche' + (q > 1 ? 's' : '') + '</button>' +
        (q ? '' : '<span class="small muted">Aucune fiche à revoir pour l\'instant : coche simplement la tâche.</span>') + '</div>';
    } else if (task.kind === 'fiches') {
      extra = '<div class="task-actions"><button class="btn small" data-action="goto-fiches">Ouvrir les fiches</button></div>';
    }
    return '<li class="task' + (done ? ' done' : '') + '">' +
      '<div class="task-row"><input type="checkbox" class="check" aria-label="Terminé" data-action="task" data-n="' + day.n + '" data-i="' + i + '"' + (done ? ' checked' : '') + '>' +
      '<div class="task-body"><div class="task-title">' + esc(fill(task.title)) + '</div>' +
      '<div class="day-meta"><span class="chip">' + kindLabel[task.kind] + '</span>' + (task.min ? '<span class="chip">' + task.min + ' min</span>' : '') + '</div>' +
      '<div class="task-detail">' + esc(fill(task.detail)) + '</div>' + extra + '</div></div></li>';
  }

  function renderDay(day, opts = {}) {
    const p = dayProgress(day);
    const ph = PHASES[day.phase];
    const minutes = day.tasks.reduce((a, t) => a + (t.min || 0), 0);
    const planned = plannedDate(day);
    const late = !dayComplete(day) && diffDays(planned, todayISO());
    let when = '<span class="chip">Prévu ' + fmtDate(planned) + '</span>';
    if (opts.current && late > 0) when = '<span class="chip yellow">Prévu ' + fmtDate(planned) + ' · ' + late + ' j de décalage</span>';
    if (dayComplete(day)) when = '<span class="chip green">Terminé</span>';
    return '<div class="day-head"><div class="day-num"><div><small>Jour</small>' + day.n + '</div></div><div>' +
      '<h2>' + esc(fill(day.title)) + '</h2>' +
      '<div class="day-meta"><span class="chip blue">' + esc(ph.name) + (day.week ? ' · S' + day.week : '') + '</span>' +
      '<span class="chip">≈ ' + minutes + ' min</span>' + when + '</div></div></div>' +
      '<p class="muted small" style="margin-top:10px">' + esc(fill(day.intro)) + '</p>' +
      '<div class="progress" aria-label="Avancement de la journée"><span style="width:' + Math.round(p.pct * 100) + '%"></span></div>' +
      '<div class="small muted" style="margin-top:4px">' + p.done + ' / ' + p.total + ' tâches</div>' +
      '<ul class="tasks">' + day.tasks.map((t, i) => renderTask(day, i, t)).join('') + '</ul>';
  }

  /* ---------- Vue : Aujourd'hui ---------- */
  function renderToday() {
    const day = currentDay();
    const ph = PHASES[day.phase];
    const done = daysCompleted();
    const last = series().slice(-1)[0];
    const avg5 = avgLast(5);
    const rs = readyStreak();
    const name = state.profile.name ? ', ' + esc(state.profile.name) : '';
    const allDone = done === PLAN.length;

    let dots = '';
    for (let i = 0; i < READY_COUNT; i++) dots += '<i class="' + (i < rs ? 'on' : '') + '"></i>';
    const ready = rs >= READY_COUNT;

    $('#view-today').innerHTML =
      '<div class="card hero">' +
        '<div><div class="eyebrow">Phase ' + (day.phase + 1) + ' sur 4 · ' + esc(ph.range) + '</div>' +
        '<h1>Bonjour' + name + '</h1>' +
        '<p class="muted" style="margin:2px 0 0">' + esc(ph.name) + ' : objectif ' + esc(ph.goal) + '.</p></div>' +
        '<div><div class="progress"><span style="width:' + (done / PLAN.length * 100).toFixed(1) + '%"></span></div>' +
        '<div class="small muted" style="margin-top:4px">' + done + ' jours terminés sur ' + PLAN.length + '</div></div>' +
        '<div class="stats">' +
          '<div class="stat"><b>' + day.n + '<small class="muted">/' + PLAN.length + '</small></b><span>Jour en cours</span></div>' +
          '<div class="stat"><b>' + streakDays() + '</b><span>Jours d\'affilée</span></div>' +
          '<div class="stat"><b>' + (last ? last.score + '<small class="muted">/40</small>' : '—') + '</b><span>Dernière série</span></div>' +
          '<div class="stat"><b>' + (avg5 != null ? avg5.toFixed(1).replace('.', ',') : '—') + '</b><span>Moyenne 5 séries</span></div>' +
        '</div>' +
        '<div class="ready' + (ready ? ' ok' : '') + '"><div style="flex:1"><b>' + (ready ? 'Prêt pour l\'examen !' : 'Prêt pour l\'examen ?') + '</b>' +
          '<div class="small">' + (ready ? 'Au moins ' + READY_SCORE + '/40 sur ' + READY_COUNT + ' séries de suite. Tu peux réserver ta date.' :
            rs + ' série' + (rs > 1 ? 's' : '') + ' de suite à ' + READY_SCORE + ' ou plus. Il en faut ' + READY_COUNT + ' avant de s\'inscrire.') + '</div></div>' +
          '<div class="ready-dots" aria-hidden="true">' + dots + '</div></div>' +
      '</div>' +
      (allDone ? '<div class="card celebrate"><b>Plan terminé, bravo !</b><p class="muted small">Continue les séries d\'examen jusqu\'au jour J pour garder le rythme.</p></div>' : '') +
      '<div class="card" id="todayCard">' + renderDay(day, { current: true }) + '</div>' +
      '<button class="btn block" data-action="goto-plan">Voir tout le plan</button>';
  }

  /* ---------- Vue : Plan ---------- */
  function ring(pct, label) {
    const r = 15, c = 2 * Math.PI * r;
    return '<svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="' + r + '"/>' +
      '<circle class="fg" cx="18" cy="18" r="' + r + '" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + (c * (1 - pct)).toFixed(2) + '" transform="rotate(-90 18 18)"/>' +
      '<text x="18" y="22" text-anchor="middle">' + label + '</text></svg>';
  }
  function renderPlan() {
    const cur = currentDay();
    let html = '<div class="card"><h2>Le plan complet</h2><p class="muted small" style="margin-top:6px">' + PLAN.length +
      ' jours d\'environ une heure. Touche un jour pour voir et cocher ses tâches. Tu peux prendre de l\'avance ou rattraper un jour manqué à tout moment.</p></div>';
    PHASES.forEach(ph => {
      const days = PLAN.filter(d => d.phase === ph.id);
      const done = days.filter(dayComplete).length;
      html += '<div class="phase-block"><div class="phase-title"><h3>Phase ' + (ph.id + 1) + ' · ' + esc(ph.name) + '</h3><span class="small muted">' + done + '/' + days.length + '</span></div>' +
        '<div class="small muted" style="padding:0 4px">' + esc(ph.range) + ' · objectif : ' + esc(ph.goal) + '</div>';
      let lastWeek = -1;
      days.forEach(d => {
        if (d.week !== lastWeek && d.week > 0) { html += '<div class="week-label">Semaine ' + d.week + '</div>'; }
        lastWeek = d.week;
        const p = dayProgress(d);
        html += '<button class="day-row' + (d.n === cur.n ? ' current' : '') + '" data-action="open-day" data-n="' + d.n + '">' +
          ring(p.pct, d.n) + '<div class="day-row-body"><div class="day-row-title">' + esc(fill(d.title)) + '</div>' +
          '<div class="day-row-sub">' + fmtDate(plannedDate(d)) + ' · ' + p.done + '/' + p.total + ' tâches' + (d.n === cur.n ? ' · en cours' : '') + '</div></div></button>';
      });
      html += '</div>';
    });
    $('#view-plan').innerHTML = html;
  }

  /* ---------- Vue : Scores ---------- */
  function lineChart(data) {
    const W = 640, H = 240, L = 30, R = 12, T = 12, B = 26;
    const minS = Math.min.apply(null, data.map(d => d.score));
    const yMin = Math.max(0, Math.floor(Math.min(minS - 2, 25) / 5) * 5), yMax = 40;
    const x = i => data.length === 1 ? (L + W - R) / 2 : L + (W - L - R) * i / (data.length - 1);
    const y = v => T + (H - T - B) * (1 - (v - yMin) / (yMax - yMin));
    let g = '';
    for (let v = yMin; v <= yMax; v += 5) {
      g += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    }
    g += '<line class="goal" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(GOAL) + '" y2="' + y(GOAL) + '"/>';
    g += '<line class="goal2" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(READY_SCORE) + '" y2="' + y(READY_SCORE) + '"/>';
    const pts = data.map((d, i) => x(i).toFixed(1) + ',' + y(d.score).toFixed(1)).join(' ');
    const avg = data.map((d, i) => {
      const s = data.slice(Math.max(0, i - 4), i + 1);
      return x(i).toFixed(1) + ',' + y(s.reduce((a, b) => a + b.score, 0) / s.length).toFixed(1);
    }).join(' ');
    if (data.length > 1) g += '<polyline class="avg" points="' + avg + '"/><polyline class="line" points="' + pts + '"/>';
    data.forEach((d, i) => { g += '<circle class="dot' + (d.score >= READY_SCORE ? ' ok' : '') + '" cx="' + x(i) + '" cy="' + y(d.score) + '" r="4"><title>' + fmtDate(d.date) + ' : ' + d.score + '/40</title></circle>'; });
    const step = Math.max(1, Math.ceil(data.length / 8));
    data.forEach((d, i) => { if (i % step === 0 || i === data.length - 1) g += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + (i + 1) + '</text>'; });
    g += '<line class="axis" x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '"/>';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Évolution des scores en série complète">' + g + '</svg>' +
      '<div class="legend"><span><i style="background:var(--blue)"></i>Score</span><span><i style="background:var(--yellow)"></i>Moyenne sur 5</span>' +
      '<span><i style="background:var(--red)"></i>Minimum 35</span><span><i style="background:var(--green)"></i>Cible 36</span></div>';
  }

  function renderScores() {
    const s = series();
    const best = s.length ? Math.max.apply(null, s.map(x => x.score)) : null;
    const passed = s.filter(x => x.score >= GOAL).length;
    const avg5 = avgLast(5);
    const st = themeStats();
    const themeRows = THEMES.map(t => {
      const n = st[t.id].pctN, pct = n ? st[t.id].pctSum / n : null;
      return '<div class="bar-row"><span>' + esc(t.short) + '</span><div class="bar-track"><div class="bar-fill' + (pct != null && pct < .8 ? ' warn' : '') + '" style="width:' + (pct != null ? Math.round(pct * 100) : 0) + '%"></div></div><b>' + (pct != null ? Math.round(pct * 100) + '%' : '—') + '</b></div>';
    }).join('');
    const hist = state.scores.slice().sort((a, b) => b.date.localeCompare(a.date) || b.ts - a.ts);

    $('#view-scores').innerHTML =
      '<div class="card"><div class="card-head"><h2>Séries complètes</h2><button class="btn primary small" data-action="score-new">+ Ajouter un score</button></div>' +
        '<div class="stats" style="margin-bottom:12px">' +
          '<div class="stat"><b>' + s.length + '</b><span>Séries faites</span></div>' +
          '<div class="stat"><b>' + (best != null ? best : '—') + '</b><span>Meilleur score</span></div>' +
          '<div class="stat"><b>' + (avg5 != null ? avg5.toFixed(1).replace('.', ',') : '—') + '</b><span>Moyenne 5 dernières</span></div>' +
          '<div class="stat"><b>' + passed + '</b><span>Séries à 35 ou plus</span></div>' +
        '</div>' +
        (s.length ? lineChart(s.slice(-40)) : '<div class="empty">Aucune série complète pour l\'instant. Les scores notés dans les tâches du jour apparaissent ici.</div>') +
      '</div>' +
      '<div class="card"><div class="card-head"><h2>Réussite par thème</h2></div><p class="small muted">Moyenne des séries thématiques. En rouge : moins de 80 %.</p><div class="bars">' + themeRows + '</div></div>' +
      '<div class="card"><div class="card-head"><h2>Historique</h2><span class="small muted">' + hist.length + '</span></div>' +
        (hist.length ? '<ul class="list">' + hist.map(h =>
          '<li><span class="score-pill ' + scoreClass(h.score, h.total) + '">' + h.score + '<small>/' + h.total + '</small></span>' +
          '<div class="grow"><div style="font-weight:600">' + (h.type === 'serie' ? 'Série complète' : 'Thème : ' + esc(themeShort(h.theme))) + '</div>' +
          '<div class="small muted">' + fmtDate(h.date) + '</div></div>' +
          '<button class="btn small danger" data-action="score-del" data-id="' + h.id + '" aria-label="Supprimer">Suppr.</button></li>').join('') + '</ul>'
          : '<div class="empty">Rien pour l\'instant.</div>') +
      '</div>';
  }

  /* ---------- Vue : Carnet ---------- */
  let carnetFilter = { theme: '', status: 'open' };
  function renderCarnet() {
    const st = themeStats();
    const total = state.errors.length, open = state.errors.filter(e => !e.mastered).length;
    const maxOpen = Math.max(1, ...THEMES.map(t => st[t.id].total));
    const bars = THEMES.map(t =>
      '<div class="bar-row"><span>' + esc(t.short) + '</span><div class="bar-track"><div class="bar-fill warn" style="width:' + Math.round(st[t.id].open / maxOpen * 100) + '%"></div></div><b>' + st[t.id].open + '</b></div>').join('');
    const weak = weakTheme();
    let list = state.errors.slice().sort((a, b) => b.date.localeCompare(a.date) || b.ts - a.ts);
    if (carnetFilter.theme) list = list.filter(e => e.theme === carnetFilter.theme);
    if (carnetFilter.status === 'open') list = list.filter(e => !e.mastered);
    if (carnetFilter.status === 'done') list = list.filter(e => e.mastered);

    $('#view-carnet').innerHTML =
      '<div class="card"><div class="card-head"><h2>Carnet d\'erreurs</h2></div>' +
        '<p class="small muted">Chaque erreur devient une fiche à réviser. Une fiche est maîtrisée après ' + MASTER_STREAK + ' bonnes réponses de suite en révision.</p>' +
        '<div class="stats" style="margin:10px 0 12px">' +
          '<div class="stat"><b>' + total + '</b><span>Fiches</span></div>' +
          '<div class="stat"><b>' + open + '</b><span>À revoir</span></div>' +
          '<div class="stat"><b>' + (total - open) + '</b><span>Maîtrisées</span></div>' +
          '<div class="stat"><b style="font-size:1rem">' + (weak ? esc(themeShort(weak)) : '—') + '</b><span>Thème le plus faible</span></div>' +
        '</div>' +
        '<div class="btn-row"><button class="btn primary" data-action="err-new">+ Ajouter une erreur</button>' +
        '<button class="btn" data-action="review"' + (open ? '' : ' disabled') + '>Réviser (' + open + ')</button></div></div>' +
      '<div class="card"><div class="card-head"><h2>Erreurs à revoir par thème</h2></div><div class="bars">' + bars + '</div></div>' +
      '<div class="card"><div class="filters" style="margin-bottom:12px">' +
        '<select data-action="filter-theme" aria-label="Filtrer par thème"><option value="">Tous les thèmes</option>' +
          THEMES.map(t => '<option value="' + t.id + '"' + (carnetFilter.theme === t.id ? ' selected' : '') + '>' + esc(t.short) + '</option>').join('') + '</select>' +
        '<select data-action="filter-status" aria-label="Filtrer par état">' +
          [['open', 'À revoir'], ['done', 'Maîtrisées'], ['all', 'Toutes']].map(o => '<option value="' + o[0] + '"' + (carnetFilter.status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') +
        '</select></div>' +
        (list.length ? '<div style="display:flex;flex-direction:column;gap:10px">' + list.map(e =>
          '<div class="err-card' + (e.mastered ? ' mastered' : '') + '">' +
            '<div class="day-meta"><span class="chip blue">' + esc(themeShort(e.theme)) + '</span>' + (e.cause ? '<span class="chip">' + esc(e.cause) + '</span>' : '') +
            (e.mastered ? '<span class="chip green">Maîtrisée</span>' : '<span class="chip">' + (e.ok || 0) + '/' + MASTER_STREAK + '</span>') + '</div>' +
            '<div class="err-q">' + esc(e.question) + '</div>' +
            (e.rule ? '<div class="err-rule">' + esc(e.rule) + '</div>' : '') +
            (e.note ? '<div class="err-why">' + esc(e.note) + '</div>' : '') +
            '<div class="err-foot"><span class="small muted">' + fmtDate(e.date) + '</span><div class="btn-row">' +
              '<button class="btn small" data-action="err-edit" data-id="' + e.id + '">Modifier</button>' +
              '<button class="btn small" data-action="err-master" data-id="' + e.id + '">' + (e.mastered ? 'À revoir' : 'Maîtrisée') + '</button>' +
              '<button class="btn small danger" data-action="err-del" data-id="' + e.id + '">Suppr.</button>' +
            '</div></div></div>').join('') + '</div>'
          : '<div class="empty">' + (total ? 'Aucune fiche avec ces filtres.' : 'Le carnet est vide. Ajoute ta première erreur après une série.') + '</div>') +
      '</div>';
  }

  /* ---------- Vue : Fiches ---------- */
  function renderFiches() {
    let html = '<div class="card"><h2>Fiches</h2><p class="small muted" style="margin-top:6px">Aide-mémoire, méthode et résumé de chaque thème. Elles restent disponibles hors connexion.</p></div>';
    FICHES.forEach((f, i) => {
      html += '<details class="fiche"' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.title) + '</summary><div class="fiche-body"><dl class="kv">' +
        f.items.map(it => '<dt>' + esc(it[0]) + '</dt><dd>' + esc(it[1]) + '</dd>').join('') + '</dl></div></details>';
    });
    html += '<h3 style="margin:8px 4px 0">Cours par thème</h3>';
    THEMES.forEach(t => {
      const ls = Object.values(LESSONS).filter(l => l.theme === t.id);
      html += '<details class="fiche"><summary>' + esc(t.name) + '</summary><div class="fiche-body">' +
        ls.map(l => '<h3 style="margin:10px 0 6px;font-size:.95rem">' + esc(l.title) + '</h3><ul style="margin:0;padding-left:18px;color:var(--muted);font-size:.92rem">' +
          l.points.map(p => '<li style="margin-bottom:4px">' + esc(p) + '</li>').join('') + '</ul>').join('') + '</div></details>';
    });
    $('#view-fiches').innerHTML = html;
  }

  /* ---------- Navigation ---------- */
  let currentTab = 'today';
  const renderers = { today: renderToday, plan: renderPlan, scores: renderScores, carnet: renderCarnet, fiches: renderFiches };
  function showTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.dataset.view !== tab; });
    document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    renderers[tab]();
    window.scrollTo({ top: 0 });
    try { history.replaceState(null, '', '#' + tab); } catch (e) { /* ignore */ }
  }
  function refresh() {
    renderers[currentTab]();
    if (modalCtx && modalCtx.kind === 'day') renderModalDay();
    updateSub();
  }
  function updateSub() {
    const d = currentDay();
    $('#brandSub').textContent = 'Jour ' + d.n + ' sur ' + PLAN.length + ' · ' + PHASES[d.phase].name;
  }

  /* ---------- Modale ---------- */
  const modal = $('#modal');
  let modalCtx = null;
  function openModal(title, html, ctx) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    modalCtx = ctx || null;
    if (!modal.open) modal.showModal();
  }
  function closeModal() { if (modal.open) modal.close(); }
  modal.addEventListener('close', () => { modalCtx = null; refresh(); });
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });

  function renderModalDay() {
    const day = PLAN[modalCtx.n - 1];
    $('#modalBody').innerHTML = renderDay(day) +
      '<div class="btn-row" style="margin-top:14px;justify-content:space-between">' +
      (day.n > 1 ? '<button class="btn small" data-action="open-day" data-n="' + (day.n - 1) + '">← Jour ' + (day.n - 1) + '</button>' : '<span></span>') +
      (day.n < PLAN.length ? '<button class="btn small" data-action="open-day" data-n="' + (day.n + 1) + '">Jour ' + (day.n + 1) + ' →</button>' : '') + '</div>';
  }

  /* Formulaire d'erreur */
  function errorForm(e, presetTheme) {
    e = e || {};
    const th = e.theme || presetTheme || weakTheme() || THEMES[0].id;
    openModal(e.id ? 'Modifier la fiche' : 'Nouvelle erreur',
      '<form id="errForm">' +
        '<div class="field"><label for="f-theme">Thème</label><select id="f-theme">' + THEMES.map(t => '<option value="' + t.id + '"' + (t.id === th ? ' selected' : '') + '>' + esc(t.name) + '</option>').join('') + '</select></div>' +
        '<div class="field"><label for="f-q">La question, en résumé</label><textarea id="f-q" required placeholder="Ex. : Feu orange fixe, je suis à 10 m du feu sur route mouillée">' + esc(e.question) + '</textarea></div>' +
        '<div class="field"><label for="f-rule">La règle exacte, en une phrase</label><textarea id="f-rule" placeholder="Ex. : Orange fixe = je m\'arrête, sauf si l\'arrêt est dangereux">' + esc(e.rule) + '</textarea><span class="hint">C\'est cette phrase qui sera à retrouver pendant les révisions.</span></div>' +
        '<div class="field"><label for="f-cause">Pourquoi je me suis trompé</label><select id="f-cause">' + CAUSES.map(c => '<option' + (c === e.cause ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></div>' +
        '<div class="field"><label for="f-note">Note (facultatif)</label><input type="text" id="f-note" value="' + esc(e.note) + '" placeholder="Ce qu\'il faut regarder la prochaine fois"></div>' +
        '<div class="btn-row"><button class="btn primary" type="submit">Enregistrer</button>' + (e.id ? '' : '<button class="btn" type="submit" data-again="1">Enregistrer et ajouter une autre</button>') + '</div>' +
      '</form>', { kind: 'err' });
    const form = $('#errForm');
    let again = false;
    form.querySelectorAll('[type="submit"]').forEach(b => b.addEventListener('click', () => { again = !!b.dataset.again; }));
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const q = $('#f-q').value.trim();
      if (!q) { $('#f-q').focus(); return; }
      const data = { theme: $('#f-theme').value, question: q, rule: $('#f-rule').value.trim(), cause: $('#f-cause').value, note: $('#f-note').value.trim() };
      if (e.id) Object.assign(state.errors.find(x => x.id === e.id), data);
      else state.errors.push(Object.assign({ id: uid(), date: todayISO(), ts: Date.now(), ok: 0, mastered: false }, data));
      touch(); save();
      toast(e.id ? 'Fiche modifiée' : 'Erreur ajoutée au carnet');
      if (again) errorForm(null, data.theme); else closeModal();
      if (again) refreshBehind();
    });
  }
  function refreshBehind() { renderers[currentTab](); updateSub(); }

  /* Formulaire de score libre */
  function scoreForm() {
    openModal('Ajouter un score',
      '<form id="scoreForm">' +
        '<div class="grid-2"><div class="field"><label for="s-type">Type</label><select id="s-type"><option value="serie">Série complète (40)</option><option value="theme">Série thématique</option></select></div>' +
        '<div class="field"><label for="s-date">Date</label><input type="date" id="s-date" value="' + todayISO() + '" max="' + todayISO() + '"></div></div>' +
        '<div class="field" id="s-theme-wrap" hidden><label for="s-theme">Thème</label><select id="s-theme">' + THEMES.map(t => '<option value="' + t.id + '">' + esc(t.name) + '</option>').join('') + '</select></div>' +
        '<div class="grid-2"><div class="field"><label for="s-score">Bonnes réponses</label><input type="number" id="s-score" inputmode="numeric" min="0" max="40" required></div>' +
        '<div class="field"><label for="s-total">Sur</label><input type="number" id="s-total" inputmode="numeric" min="1" max="100" value="40"></div></div>' +
        '<button class="btn primary" type="submit">Enregistrer</button></form>', { kind: 'score' });
    const type = $('#s-type');
    type.addEventListener('change', () => {
      $('#s-theme-wrap').hidden = type.value !== 'theme';
      $('#s-total').value = type.value === 'theme' ? 30 : 40;
      $('#s-total').disabled = type.value === 'serie';
    });
    $('#s-total').disabled = true;
    $('#scoreForm').addEventListener('submit', ev => {
      ev.preventDefault();
      const total = type.value === 'serie' ? 40 : parseInt($('#s-total').value, 10);
      const score = parseInt($('#s-score').value, 10);
      if (isNaN(score) || score < 0 || score > total) { toast('Score entre 0 et ' + total); return; }
      state.scores.push({ id: uid(), ts: Date.now(), date: $('#s-date').value || todayISO(), score, total, type: type.value,
        theme: type.value === 'theme' ? $('#s-theme').value : null, task: null });
      touch(); save(); closeModal(); toast('Score enregistré');
    });
  }

  /* Révision du carnet */
  function startReview(taskRef) {
    const queue = reviewQueue().map(e => e.id);
    if (!queue.length) { toast('Aucune fiche à revoir'); return; }
    const sess = { queue, i: 0, known: 0, again: 0, taskRef };
    const step = () => {
      if (sess.i >= sess.queue.length) {
        if (sess.taskRef) { state.tasks[tkey(sess.taskRef.n, sess.taskRef.i)] = true; }
        touch(); save();
        $('#modalBody').innerHTML = '<div class="celebrate"><b>Révision terminée</b><p class="muted">' + sess.known + ' sue' + (sess.known > 1 ? 's' : '') + ' · ' + sess.again + ' à revoir</p>' +
          '<p class="small muted">Les fiches à revoir reviendront en priorité la prochaine fois.</p><button class="btn primary" data-close>Fermer</button></div>';
        return;
      }
      const e = state.errors.find(x => x.id === sess.queue[sess.i]);
      if (!e) { sess.i++; step(); return; }
      $('#modalBody').innerHTML =
        '<div class="small muted" style="margin-bottom:8px">Fiche ' + (sess.i + 1) + ' sur ' + sess.queue.length + '</div>' +
        '<div class="progress" style="margin-bottom:12px"><span style="width:' + (sess.i / sess.queue.length * 100) + '%"></span></div>' +
        '<div class="flash"><div class="day-meta"><span class="chip blue">' + esc(themeShort(e.theme)) + '</span><span class="chip">' + (e.ok || 0) + '/' + MASTER_STREAK + '</span></div>' +
        '<div class="flash-q">' + esc(e.question) + '</div>' +
        '<p class="small muted">Quelle est la règle ? Réponds de tête avant de retourner la fiche.</p>' +
        '<div id="flashAns" hidden><div class="err-rule">' + esc(e.rule || 'Pas de règle notée : modifie la fiche pour l\'ajouter.') + '</div>' + (e.note ? '<div class="err-why" style="margin-top:6px">' + esc(e.note) + '</div>' : '') + '</div></div>' +
        '<div class="btn-row" style="margin-top:12px" id="flashBtns"><button class="btn primary block" id="flashShow">Retourner la fiche</button></div>';
      $('#flashShow').addEventListener('click', () => {
        $('#flashAns').hidden = false;
        $('#flashBtns').innerHTML = '<button class="btn" style="flex:1" id="fAgain">À revoir</button><button class="btn primary" style="flex:1" id="fKnow">Je savais</button>';
        $('#fAgain').addEventListener('click', () => { e.ok = 0; e.lastReview = todayISO() + 'T' + Date.now(); sess.again++; sess.i++; save(); step(); });
        $('#fKnow').addEventListener('click', () => {
          e.ok = (e.ok || 0) + 1; e.lastReview = todayISO() + 'T' + Date.now(); sess.known++;
          if (e.ok >= MASTER_STREAK) { e.mastered = true; toast('Fiche maîtrisée !'); }
          sess.i++; save(); step();
        });
      });
    };
    openModal('Révision du carnet', '', { kind: 'review' });
    step();
  }

  /* Réglages */
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });

  function settings(first) {
    openModal(first ? 'Bienvenue !' : 'Réglages',
      (first ? '<p class="muted">Ce site suit un plan de ' + PLAN.length + ' jours (environ une heure par jour) pour passer de 25 à 35/40 et plus. Tout est enregistré sur cet appareil, même hors connexion.</p>' : '') +
      '<form id="setForm">' +
        '<div class="field"><label for="p-name">Prénom</label><input type="text" id="p-name" value="' + esc(state.profile.name) + '" autocomplete="given-name"></div>' +
        '<div class="field"><label for="p-start">Date de début du plan</label><input type="date" id="p-start" value="' + esc(state.profile.start) + '"><span class="hint">Sert à afficher la date prévue de chaque jour. Le plan avance au rythme des tâches cochées, pas du calendrier.</span></div>' +
        (first ? '' : '<div class="field"><label for="p-theme">Apparence</label><select id="p-theme">' +
          [['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']].map(o => '<option value="' + o[0] + '"' + (state.theme === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>') +
        '<button class="btn primary block" type="submit">' + (first ? 'Commencer le plan' : 'Enregistrer') + '</button></form>' +
      (first ? '' :
        '<hr style="border:0;border-top:1px solid var(--line);margin:18px 0">' +
        '<h3>Installer l\'application</h3><p class="small muted" style="margin-top:4px">' +
          (installEvt ? 'Ajoute l\'appli à l\'écran d\'accueil pour l\'ouvrir comme une vraie application.' :
            'Sur iPhone : bouton Partager, puis « Sur l\'écran d\'accueil ». Sur Android : menu ⋮, puis « Installer l\'application ».') + '</p>' +
        (installEvt ? '<button class="btn" data-action="install">Installer</button>' : '') +
        '<hr style="border:0;border-top:1px solid var(--line);margin:18px 0">' +
        '<h3>Sauvegarde</h3><p class="small muted" style="margin-top:4px">Les données restent sur cet appareil. Exporte une sauvegarde pour les transférer sur un autre téléphone ou ne rien perdre.</p>' +
        '<div class="btn-row"><button class="btn" data-action="export">Exporter</button><label class="btn" style="cursor:pointer">Importer<input type="file" accept="application/json,.json" id="importFile" hidden></label></div>' +
        '<hr style="border:0;border-top:1px solid var(--line);margin:18px 0">' +
        '<button class="btn danger" data-action="reset">Tout effacer et recommencer</button>'),
      { kind: 'settings' });
    $('#setForm').addEventListener('submit', ev => {
      ev.preventDefault();
      state.profile.name = $('#p-name').value.trim();
      state.profile.start = $('#p-start').value || todayISO();
      if ($('#p-theme')) state.theme = $('#p-theme').value;
      state.onboarded = true;
      applyTheme(); save(); closeModal(); toast(first ? 'C\'est parti !' : 'Réglages enregistrés');
    });
    const imp = $('#importFile');
    if (imp) imp.addEventListener('change', () => {
      const f = imp.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data || typeof data !== 'object' || !data.profile) throw new Error('format');
          if (!confirm('Remplacer toutes les données actuelles par cette sauvegarde ?')) return;
          state = Object.assign(defaults(), data); save(); applyTheme(); closeModal(); toast('Sauvegarde importée');
        } catch (e) { toast('Fichier de sauvegarde invalide'); }
      };
      r.readAsText(f);
    });
  }
  function applyTheme() {
    if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', state.theme);
  }

  /* ---------- Actions ---------- */
  function setTask(n, i, val) {
    const day = PLAN[n - 1];
    const wasComplete = dayComplete(day);
    state.tasks[tkey(n, i)] = val;
    const task = day.tasks[i];
    if (task.kind === 'lesson') LESSONS[day.lesson].points.forEach((_, p) => { state.tasks[pkey(n, i, p)] = val; });
    if (val) touch();
    save();
    if (!wasComplete && dayComplete(day)) toast(n === PLAN.length ? 'Plan terminé, bravo !' : 'Jour ' + n + ' terminé, bravo !');
  }

  document.addEventListener('click', ev => {
    const t = ev.target.closest('[data-action]');
    if (!t || t.tagName === 'SELECT') return;
    const a = t.dataset.action;
    const n = +t.dataset.n, i = +t.dataset.i;

    if (a === 'task') { setTask(n, i, t.checked); refresh(); }
    else if (a === 'point') {
      state.tasks[pkey(n, i, +t.dataset.p)] = t.checked;
      const pts = LESSONS[PLAN[n - 1].lesson].points;
      const all = pts.every((_, p) => state.tasks[pkey(n, i, p)]);
      if (all !== taskDone(n, i)) setTask(n, i, all);
      else { if (t.checked) touch(); save(); }
      refresh();
    }
    else if (a === 'score-save') {
      const day = PLAN[n - 1], task = day.tasks[i], k = tkey(n, i);
      const root = t.closest('.task');
      const input = root.querySelector('input[type="number"]');
      const v = parseInt(input.value, 10);
      if (isNaN(v) || v < 0 || v > task.total) { toast('Entre un score entre 0 et ' + task.total); input.focus(); return; }
      let theme = null;
      if (task.stype === 'theme') { const sel = root.querySelector('select'); theme = fill(task.theme || '') || (sel ? sel.value : null); }
      state.scores = state.scores.filter(s => s.task !== k);
      state.scores.push({ id: uid(), ts: Date.now(), date: todayISO(), score: v, total: task.total, type: task.stype, theme, task: k });
      setTask(n, i, true);
      if (task.total === 40) toast(v >= READY_SCORE ? v + '/40 : excellent !' : v >= GOAL ? v + '/40 : réussi, vise 36 pour la marge' : v + '/40 enregistré. Analyse bien les erreurs !');
      refresh();
    }
    else if (a === 'score-redo') {
      const rec = state.scores.find(s => s.id === t.dataset.id);
      if (rec && rec.task) { const [dn, di] = rec.task.split('-').map(Number); state.scores = state.scores.filter(s => s.id !== rec.id); setTask(dn, di, false); }
      refresh();
    }
    else if (a === 'score-del') {
      if (!confirm('Supprimer ce score ?')) return;
      const rec = state.scores.find(s => s.id === t.dataset.id);
      state.scores = state.scores.filter(s => s.id !== t.dataset.id);
      if (rec && rec.task) { const [dn, di] = rec.task.split('-').map(Number); state.tasks[tkey(dn, di)] = false; }
      save(); refresh();
    }
    else if (a === 'score-new') scoreForm();
    else if (a === 'err-new') errorForm(null, t.dataset.theme || '');
    else if (a === 'err-edit') errorForm(state.errors.find(e => e.id === t.dataset.id));
    else if (a === 'err-del') { if (confirm('Supprimer cette fiche ?')) { state.errors = state.errors.filter(e => e.id !== t.dataset.id); save(); refresh(); } }
    else if (a === 'err-master') { const e = state.errors.find(x => x.id === t.dataset.id); e.mastered = !e.mastered; e.ok = e.mastered ? MASTER_STREAK : 0; save(); refresh(); }
    else if (a === 'review') startReview(t.dataset.n ? { n, i } : null);
    else if (a === 'open-day') { modalCtx = { kind: 'day', n }; openModal('Jour ' + n, '', modalCtx); renderModalDay(); $('#modalTitle').textContent = 'Jour ' + n; }
    else if (a === 'goto-plan') showTab('plan');
    else if (a === 'goto-fiches') { closeModal(); showTab('fiches'); }
    else if (a === 'export') {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'objectif-code-' + todayISO() + '.json';
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    else if (a === 'install' && installEvt) { installEvt.prompt(); installEvt = null; closeModal(); }
    else if (a === 'reset') {
      if (confirm('Effacer toute la progression, les scores et le carnet ? Cette action est définitive.')) {
        state = defaults(); save(); applyTheme(); closeModal(); showTab('today'); settings(true);
      }
    }
  });

  document.addEventListener('change', ev => {
    const t = ev.target;
    if (t.dataset.action === 'filter-theme') { carnetFilter.theme = t.value; renderCarnet(); }
    if (t.dataset.action === 'filter-status') { carnetFilter.status = t.value; renderCarnet(); }
  });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && ev.target.matches('.score-input input')) {
      ev.preventDefault();
      const btn = ev.target.closest('.task').querySelector('[data-action="score-save"]');
      if (btn) btn.click();
    }
  });

  document.querySelectorAll('.tabbar button').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  $('#btnSettings').addEventListener('click', () => settings(false));

  /* ---------- Démarrage ---------- */
  applyTheme();
  const initial = (location.hash || '').slice(1);
  showTab(renderers[initial] ? initial : 'today');
  updateSub();
  if (!state.onboarded) settings(true);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* hors ligne indisponible */ });
  }
})();
