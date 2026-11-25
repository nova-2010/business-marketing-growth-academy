(() => {
  const $ = (selector) => document.querySelector(selector);
  const storage = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  };
  const completed = new Set(storage.get('growth-academy-completed', []));
  let activeId = COURSE[0].id;
  const esc = (value) => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const progress = () => {
    const count = [...completed].filter(id => COURSE.some(m => m.id === id)).length;
    const percent = Math.round(count / COURSE.length * 100);
    $('#progressText').textContent = percent + '%';
    $('#progressBar').style.width = percent + '%';
    $('#progressDetail').textContent = count + ' of ' + COURSE.length + ' lessons completed';
  };
  function renderNav() {
    let html = '', lastGroup = '';
    COURSE.forEach((module, index) => {
      if (module.group !== lastGroup) {
        lastGroup = module.group;
        html += '<div class="nav-group">' + esc(lastGroup) + '</div>';
      }
      html += '<button class="nav-item ' + (activeId === module.id ? 'active' : '') + '" data-id="' + esc(module.id) + '"><span class="nav-num">' + String(index + 1).padStart(2, '0') + '</span><span>' + esc(module.title) + '</span>' + (completed.has(module.id) ? '<span class="nav-check">✓</span>' : '') + '</button>';
    });
    $('#moduleNav').innerHTML = html;
    $('#moduleNav').querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => openLesson(button.dataset.id)));
  }
  function renderCards() {
    $('#moduleCards').innerHTML = COURSE.map((module, index) =>
      '<article class="module-card" data-id="' + esc(module.id) + '"><div class="card-top"><span class="card-num">' + String(index + 1).padStart(2, '0') + ' / ' + String(COURSE.length).padStart(2, '0') + '</span><span class="card-level">' + esc(module.level) + '</span></div><h3>' + esc(module.title) + '</h3><p>' + esc(module.intro) + '</p><span class="card-arrow">↗</span></article>'
    ).join('');
    $('#moduleCards').querySelectorAll('[data-id]').forEach(card => card.addEventListener('click', () => openLesson(card.dataset.id)));
  }
  function showHome() {
    $('#lessonView').classList.add('hidden');
    $('#searchView').classList.add('hidden');
    $('#homeView').classList.remove('hidden');
    activeId = '';
    renderNav();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function openLesson(id) {
    const module = COURSE.find(item => item.id === id);
    if (!module) return;
    activeId = id;
    const index = COURSE.indexOf(module);
    $('#homeView').classList.add('hidden');
    $('#searchView').classList.add('hidden');
    $('#lessonView').classList.remove('hidden');
    const topics = module.sections.map((section, i) =>
      '<section class="topic"><h2>' + (i + 1) + '. ' + esc(section[0]) + '</h2><p>' + esc(section[1]) + '</p></section>'
    ).join('');
    const checklist = module.check.map((item, i) =>
      '<li><label><input type="checkbox" id="task-' + i + '"><span>' + esc(item) + '</span></label></li>'
    ).join('');
    $('#lessonView').innerHTML =
      '<div class="breadcrumb"><a href="#home" id="homeCrumb">ACADEMY</a> / ' + esc(module.group) + ' / ' + String(index + 1).padStart(2, '0') + '</div>' +
      '<header class="lesson-head"><div class="lesson-kicker">MODULE ' + String(index + 1).padStart(2, '0') + ' · ' + esc(module.level) + '</div><h1>' + esc(module.title) + '</h1><p>' + esc(module.intro) + '</p><div class="lesson-meta"><span>◷ ' + esc(module.time) + '</span><span>✳ CONCEPTS + APPLICATION</span><span>' + (completed.has(id) ? '✓ COMPLETED' : 'IN PROGRESS') + '</span></div></header>' +
      '<article class="lesson-content">' + topics +
      '<div class="example-box"><div class="box-label">WORKED EXAMPLE · ILLUSTRATIVE</div><p>' + esc(module.example) + '</p></div>' +
      '<h2>Common mistakes to avoid</h2><ul>' + module.mistakes.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul>' +
      '<div class="output-box"><div class="box-label">YOUR PRACTICAL OUTPUT</div><ul>' + module.outputs.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul></div>' +
      '<h2>Knowledge check & action</h2><p>Tick each prompt when you can explain and apply it without relying on the lesson text.</p><ul class="action-list">' + checklist + '</ul>' +
      '<div class="lesson-footer"><button class="secondary-btn" id="prevLesson" ' + (index === 0 ? 'disabled' : '') + '>← Previous</button><button class="complete-btn ' + (completed.has(id) ? 'done' : '') + '" id="completeLesson">' + (completed.has(id) ? '✓ Completed — mark incomplete' : 'Mark lesson complete') + '</button><button class="secondary-btn" id="nextLesson" ' + (index === COURSE.length - 1 ? 'disabled' : '') + '>Next →</button></div></article>';
    $('#homeCrumb').addEventListener('click', event => { event.preventDefault(); showHome(); });
    if (index > 0) $('#prevLesson').addEventListener('click', () => openLesson(COURSE[index - 1].id));
    if (index < COURSE.length - 1) $('#nextLesson').addEventListener('click', () => openLesson(COURSE[index + 1].id));
    $('#completeLesson').addEventListener('click', () => {
      if (completed.has(id)) completed.delete(id); else completed.add(id);
      storage.set('growth-academy-completed', [...completed]);
      progress(); renderNav(); openLesson(id);
    });
    renderNav();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function search(query) {
    const term = query.trim().toLowerCase();
    if (!term) { $('#searchView').classList.add('hidden'); $('#homeView').classList.remove('hidden'); return; }
    const matches = COURSE.filter(module => (module.title + ' ' + module.intro + ' ' + module.sections.flat().join(' ') + ' ' + module.example + ' ' + module.mistakes.join(' ')).toLowerCase().includes(term));
    $('#homeView').classList.add('hidden'); $('#lessonView').classList.add('hidden'); $('#searchView').classList.remove('hidden');
    $('#searchView').innerHTML = '<div class="breadcrumb">ACADEMY / SEARCH</div><header class="lesson-head"><div class="lesson-kicker">KNOWLEDGE LIBRARY</div><h1>Search results</h1><p>' + matches.length + ' module(s) match “' + esc(query) + '”.</p></header>' +
      (matches.length ? matches.map(module => '<button class="search-result" data-id="' + esc(module.id) + '"><strong>' + esc(module.title) + ' →</strong><span>' + esc(module.intro) + '</span></button>').join('') : '<p class="empty-state">No matching lessons. Try “customer”, “pricing”, “funnel”, “measurement” or “market”.</p>');
    $('#searchView').querySelectorAll('[data-id]').forEach(element => element.addEventListener('click', () => openLesson(element.dataset.id)));
  }
  $('#searchInput').addEventListener('input', event => search(event.target.value));
  $('#startLearning').addEventListener('click', () => openLesson(COURSE[0].id));
  $('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    try { localStorage.setItem('growth-academy-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch {}
  });
  try { if (localStorage.getItem('growth-academy-theme') === 'dark') document.body.classList.add('dark'); } catch {}
  renderCards(); renderNav(); progress();
})();