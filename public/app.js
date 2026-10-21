'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeUrl = value => {
  try { const url = new URL(value, location.origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : '#'; }
  catch { return '#'; }
};
const menu = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
$$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });

$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
const preview = $('#preview-dialog');
preview.addEventListener('close', () => $('#preview-frame').removeAttribute('src'));
function previewFile(file) {
  $('#preview-title').textContent = file.name;
  $('#preview-frame').src = `https://docs.google.com/gview?url=${encodeURIComponent(safeUrl(file.url))}&embedded=true`;
  $('#preview-fallback').href = safeUrl(file.preview || file.url);
  preview.showModal();
}
async function loadResources() {
  const response = await fetch('/data/past-papers.json');
  if (!response.ok) throw Error('Main library index unavailable');
  const files = await response.json();
  if (!Array.isArray(files)) throw Error('Invalid main library index');
  const status = $('#resource-index-status');
  if (status) status.textContent = 'PDFs & practical files · Hosted here';
  return files;
}
const page = document.querySelector('#site-root')?.dataset.page || document.body.dataset.page;

const practiceKey = 'kee-practice-v1';
function readPractice(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function savePractice(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
function practiceRecord() {
  const record = readPractice(practiceKey, {});
  return record && typeof record === 'object' && !Array.isArray(record) ? record : {};
}
function updatePractice(values) { savePractice(practiceKey, {...practiceRecord(), ...values}); }
const practiceTools = {
  python:{name:'Python editor',url:'/playground/python/'},
  logic:{name:'Logic lab',url:'/playground/logic/'},
  quiz:{name:'Quick quiz',url:'/playground/quiz/'},
  binary:{name:'Binary arcade',url:'/playground/binary/'}
};
if (practiceTools[page]) updatePractice({lastTool:page});

if (page === 'playground') {
  const targets = [13,6,9,5,14,10,7,12];
  let challenge = 0, value = 0, solved = false;
  const bits = $$('[data-warm-bit]');
  function showRecords() {
    const record = practiceRecord();
    $('#record-warmups').textContent = Number.isInteger(record.warmups) && record.warmups >= 0 ? record.warmups : 0;
    const quizPlayed = Number.isInteger(record.quizAttempts) && record.quizAttempts > 0;
    $('#record-quiz').textContent = quizPlayed ? `${record.quizBest}/10` : 'Not tried yet';
    $('#record-quiz').classList.toggle('not-started', !quizPlayed);
    const arcadePlayed = (Number.isInteger(record.arcadeBest) && record.arcadeBest > 0) || record.arcadeRuns > 0;
    $('#record-arcade').textContent = arcadePlayed ? (record.arcadeBest || 0) : 'Not tried yet';
    $('#record-arcade').classList.toggle('not-started', !arcadePlayed);
    const recent = practiceTools[record.lastTool];
    $('#practice-resume').hidden = !recent;
    if (recent) { $('#resume-description').textContent = `Your last stop was the ${recent.name.toLowerCase()}.`; $('#resume-link').href = recent.url; }
  }
  bits.forEach(bit => bit.addEventListener('click', () => {
    const active = bit.getAttribute('aria-pressed') !== 'true';
    bit.setAttribute('aria-pressed', String(active)); $('strong', bit).textContent = active ? '1' : '0';
    const values = bits.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => Number(button.dataset.warmBit));
    value = values.reduce((sum, next) => sum + next, 0);
    $('#warmup-value').textContent = value;
    $('#warmup-expression').textContent = values.join(' + ') || '0';
  }));
  $('#check-warmup').addEventListener('click', () => {
    const correct = value === targets[challenge];
    $('#warmup-feedback').classList.toggle('success', correct);
    $('#warmup-feedback').textContent = correct ? `That’s it. ${value} in decimal is ${value.toString(2).padStart(4,'0')} in binary.` : `Your switches add up to ${value}. You’re looking for ${targets[challenge]} — try changing a bit.`;
    if (correct && !solved) {
      solved = true; const record = practiceRecord(); updatePractice({warmups:(Number.isInteger(record.warmups) ? record.warmups : 0)+1});
      $('#check-warmup').disabled = true; $('#next-warmup').hidden = false; $('#hint-warmup').hidden = true; showRecords();
    }
  });
  $('#hint-warmup').addEventListener('click', () => {
    const target = targets[challenge], highest = 2 ** Math.floor(Math.log2(target));
    $('#warmup-feedback').textContent = `Start with ${highest}, the biggest bit that fits. Then make the remaining ${target-highest} using the smaller bits.`;
  });
  $('#next-warmup').addEventListener('click', () => {
    challenge = (challenge+1) % targets.length; value = 0; solved = false;
    bits.forEach(bit => {bit.setAttribute('aria-pressed','false'); $('strong', bit).textContent = '0';});
    $('#warmup-target').textContent = targets[challenge]; $('#warmup-value').textContent = '0'; $('#warmup-expression').textContent = '0';
    $('#check-warmup').disabled = false; $('#next-warmup').hidden = true; $('#hint-warmup').hidden = false;
    $('#warmup-feedback').classList.remove('success'); $('#warmup-feedback').textContent = 'A fresh number. Take it one bit at a time.'; bits[0].focus({preventScroll:true});
  });
  const paths = {
    foundations:[['binary','Get comfortable with bits','/playground/binary/?mode=practice'],['logic','See what a logic gate does'],['python','Write a small program']],
    revision:[['quiz','Find the ideas to revisit'],['python','Practise a programming example'],['resources','Put it into exam practice','/subject/cs/']],
    challenge:[['logic','Build your own circuit'],['binary','Test your speed in the arcade','/playground/binary/?mode=arcade'],['quiz','Try a fresh question mix']]
  };
  function choosePath(key) {
    const steps = paths[key];
    $$('[data-practice-path]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.practicePath === key)));
    $('#practice-path').innerHTML = `<ol class="practice-path-steps">${steps.map(([tool,label,url],index) => `<li><a href="${url || practiceTools[tool].url}"><span>${index+1}</span>${label}</a></li>`).join('')}</ol>`;
    $$('[data-tool]').forEach(card => { const recommended = card.dataset.tool === steps[0][0]; card.classList.toggle('is-recommended',recommended); $('.recommended-label',card).hidden = !recommended; });
  }
  $$('[data-practice-path]').forEach(button => button.addEventListener('click',()=>choosePath(button.dataset.practicePath)));
  window.addEventListener('storage', event => { if (event.key === practiceKey || event.key === null) showRecords(); });
  choosePath('foundations'); showRecords();
}

if (page === 'dashboard') {
  loadResources().then(files => { $('#cs-count').textContent = files.filter(file => file.subject === 'cs' && file.sourceKey === 'primary').length; $('#ict-count').textContent = files.filter(file => file.subject === 'ict' && file.sourceKey === 'primary').length; $('#language-b-count').textContent = files.filter(file => file.subject === 'language-b' && file.sourceKey === 'primary').length; $('#physics-count').textContent = files.filter(file => file.subject === 'physics' && file.sourceKey === 'primary').length; }).catch(() => { $('#cs-count').textContent = 'CS'; $('#ict-count').textContent = 'ICT'; $('#language-b-count').textContent = 'English'; $('#physics-count').textContent = 'Physics'; });
}

if (page === 'resources') {
  const subject = $('.resource-workspace').dataset.subject;
  const controls = ['#resource-search', '#year-filter', '#session-filter', '#paper-filter', '#kind-filter', '#resource-sort'].map(selector => $(selector));
  let files = [], pageNumber = 1, helpers;
  const size = 8;
  const typeLabels = {'':'All files','Question paper':'Question papers','Mark scheme':'Mark schemes','Data files':'Practical files','Examiner report':'Examiner reports','Topical questions':'Topical questions','Other resources':'Other resources'};
  const filterNames = {'resource-search':'Search','year-filter':'Year','session-filter':'Series','paper-filter':'Paper','kind-filter':'Type'};
  const filters = () => ({search:$('#resource-search').value,year:$('#year-filter').value,session:$('#session-filter').value,paper:$('#paper-filter').value,kind:$('#kind-filter').value});
  const panel = $('.paper-filter-panel');
  panel.open = !window.matchMedia('(max-width: 760px)').matches;
  function render() {
    if (!helpers) return;
    const current = filters();
    const filtered = helpers.filterPapers(files,current);
    const groups = helpers.groupPapers(filtered,$('#resource-sort').value);
    const totalPages = Math.max(1,Math.ceil(groups.length / size));
    pageNumber = Math.min(pageNumber,totalPages);
    const start = (pageNumber-1)*size, items = groups.slice(start,start+size);
    const unit = groups.length === 1 ? 'paper set' : 'paper sets';
    $('#results-count').textContent = `${groups.length} ${unit} · ${filtered.length} ${filtered.length === 1 ? 'file' : 'files'}`;
    $('#resource-index-status').textContent = groups.length ? `Showing ${start+1}–${Math.min(start+size,groups.length)} of ${groups.length}` : 'Try fewer filters';
    const base = helpers.filterPapers(files,{...current,kind:''});
    $$('[data-paper-kind]').forEach(button => {
      const kind = button.dataset.paperKind;
      const count = kind ? base.filter(file=>file.kind===kind).length : base.length;
      button.hidden = Boolean(kind && !files.some(file=>file.kind===kind));
      button.setAttribute('aria-pressed',String(current.kind===kind));
      button.innerHTML = `${typeLabels[kind]}<span>${count}</span>`;
    });
    const selected = controls.filter(control => control.id !== 'resource-sort' && control.value);
    $('#active-paper-filters').hidden = !selected.length;
    $('#active-paper-filters').innerHTML = selected.map(control => {
      const value = control.id==='paper-filter' ? helpers.paperLabel(control.value) : control.value;
      return `<button type="button" data-clear-filter="${control.id}" aria-label="Remove ${escapeHtml(filterNames[control.id])} filter: ${escapeHtml(value)}">${escapeHtml(value)}<span aria-hidden="true">×</span></button>`;
    }).join('');
    $$('[data-clear-filter]').forEach(button=>button.addEventListener('click',()=>{
      const control=$(`#${button.dataset.clearFilter}`);control.value='';
      pageNumber=1;render();
    }));
    const visibleFiles=[];
    $('#resource-list').innerHTML = items.length ? items.map(group => {
      const title = helpers.paperLabel(group.paper);
      const meta = [group.code,group.session,group.year].filter(Boolean).join(' · ');
      return `<article class="paper-set"><header class="paper-set-heading"><div><p>${escapeHtml(meta)}</p><h2>${escapeHtml(title)}</h2></div><span>${group.files.length} ${group.files.length===1?'file':'files'}</span></header><div class="paper-set-files">${group.files.map(file => {
        const index=visibleFiles.push(file)-1;
        const extension=file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : '';
        const format=/^[A-Z0-9]{2,5}$/.test(extension)?extension:'FILE';
        const details=[format,helpers.formatBytes(file.bytes)].filter(Boolean).join(' · ');
        return `<div class="paper-file"><div class="paper-file-copy"><h3>${escapeHtml(file.kind)}</h3><p>${escapeHtml(details)}</p>${file.note?`<p class="paper-file-note">${escapeHtml(file.note)}</p>`:''}</div><div class="paper-file-actions">${file.preview?`<button type="button" data-preview="${index}" aria-label="Preview ${escapeHtml(file.name)}">Preview</button>`:''}<a href="${escapeHtml(safeUrl(file.url))}" download aria-label="Download ${escapeHtml(file.name)}">Download</a></div></div>`;
      }).join('')}</div></article>`;
    }).join('') : '<div class="empty-state"><h2>No matching papers</h2><p>Try another year, paper number or keyword. You can also clear your filters and start again.</p><button class="button button-outline" id="empty-reset" type="button">Reset filters</button></div>';
    $$('[data-preview]').forEach(button => button.addEventListener('click',()=>previewFile(visibleFiles[Number(button.dataset.preview)])));
    $('#empty-reset')?.addEventListener('click',resetFilters);
    $('#resource-pagination').innerHTML = totalPages>1 ? `<button type="button" id="previous-page" ${pageNumber===1?'disabled':''}>Previous</button><span>Page ${pageNumber} of ${totalPages}</span><button type="button" id="next-page" ${pageNumber===totalPages?'disabled':''}>Next</button>` : '';
    function turnPage(delta) { pageNumber+=delta;render();$('.resource-results').scrollIntoView({behavior:'smooth',block:'start'});$('#resource-search').focus({preventScroll:true}); }
    $('#previous-page')?.addEventListener('click',()=>turnPage(-1));
    $('#next-page')?.addEventListener('click',()=>turnPage(1));
  }
  function resetFilters() { controls.forEach(control=>control.value=control.id==='resource-sort'?'new':'');pageNumber=1;updateOptions();render(); }
  function updateOptions() {
    const libraryFiles=files;
    for(const [selector,property,label] of [['#year-filter','year','All years'],['#session-filter','session','All series'],['#paper-filter','paper','All papers']]) {
      const select=$(selector), current=select.value;
      const values=[...new Set(libraryFiles.map(file=>file[property]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
      if(property==='year') values.reverse();
      select.innerHTML=`<option value="">${label}</option>`+values.map(value=>`<option value="${escapeHtml(value)}">${escapeHtml(property==='paper'?helpers.paperLabel(value):value)}</option>`).join('');
      select.value=values.includes(current)?current:'';
    }
  }
  controls.forEach(control=>control.addEventListener(control.type==='search'?'input':'change',()=>{pageNumber=1;render();}));
  $$('[data-paper-kind]').forEach(button=>button.addEventListener('click',()=>{$('#kind-filter').value=button.dataset.paperKind;pageNumber=1;render();}));
  $('#clear-filters').addEventListener('click',resetFilters);
  Promise.all([loadResources(),import('/paper-library.mjs')]).then(([data,module])=>{
    helpers=module;files=data.filter(file=>file.subject===subject && helpers.isHostedPaper(file));
    $('#library-total').textContent=`${files.length} files · ${Math.min(...files.map(file=>Number(file.year)))}–${Math.max(...files.map(file=>Number(file.year)))}`;
    updateOptions();render();
  }).catch(()=>{$('#results-count').textContent='Library unavailable';$('#library-total').textContent='Please try again shortly';$('#resource-error').hidden=false;});
}

if (page === 'store') {
  const sampleUrl = '/data/sample-exam-paper.pdf';
  const subject = 'Edexcel International GCSE Computer Science (4CP0)';
  const products = [
    {id:'free',title:'Free sample exam paper',desc:'One complete original practice paper to see the question style and start working.',price:0,type:'free',art:'01',label:'START HERE'},
    {id:'single',title:'1 practice paper',desc:'One original practice paper. Ask for Easy, Hard, or Extreme difficulty.',price:1000,type:'paid',art:'01',label:'CHOOSE YOUR LEVEL'},
    {id:'five',title:'5-paper practice bundle',desc:'Five original practice papers at the difficulty level you choose.',price:4000,original:5000,type:'paid',art:'05',label:'PRACTICE BUNDLE'},
    {id:'ten',title:'10-paper practice bundle',desc:'Ten original practice papers at the difficulty level you choose.',price:8000,original:10000,type:'paid',art:'10',label:'PRACTICE BUNDLE'},
    {id:'mixed',title:'10-paper mixed-level bundle',desc:'Ten original practice papers across Easy, Hard, and Extreme levels.',price:8000,original:10000,type:'paid',art:'10+',label:'MIX IT UP'}
  ];
  let filter = 'all', selected;
  const money = amount => `${amount.toLocaleString('en-US')} MMK`;
  function renderProducts() {
    const search = $('#store-search').value.toLowerCase().trim();
    const list = products.filter(product => (filter === 'all' || product.type === filter) && `${product.title} ${product.desc} ${subject}`.toLowerCase().includes(search));
    $('#store-count').textContent = `${list.length} ${list.length === 1 ? 'resource' : 'resources'}`;
    $('#store-empty').hidden = list.length > 0;
    $('#store-products').innerHTML = list.map(product => `<article class="product-card"><div class="product-art" aria-hidden="true"><span>${product.art}</span><div class="pill">${product.label}</div></div><div class="product-copy"><div class="product-subject">COMPUTER SCIENCE · 4CP0</div><h2>${product.title}</h2><p>${product.desc}</p><div class="product-price">${product.original ? `<s>${money(product.original)}</s>` : ''}<strong>${product.price ? money(product.price) : 'Free'}</strong></div><div class="product-actions">${product.type === 'free' ? `<a class="button button-outline" href="${sampleUrl}" download>Download free paper <span>↓</span></a>` : `<button class="button button-outline" data-order="${product.id}">Ask about this ${product.id === 'single' ? 'paper' : 'bundle'}</button>`}<a class="product-preview-link" href="${sampleUrl}" target="_blank" rel="noopener">View a free paper example</a></div></div></article>`).join('');
    $$('[data-order]').forEach(button => button.addEventListener('click', () => {
      selected = products.find(product => product.id === button.dataset.order);
      $('#order-title').textContent = selected.title;
      $('#order-subject').textContent = subject;
      $('#order-price').textContent = money(selected.price);
      $('#order-level').hidden = selected.id === 'mixed';
      $('label[for="order-level"]').hidden = selected.id === 'mixed';
      updateOrder(); $('#order-dialog').showModal();
    }));
  }
  function updateOrder() {
    const level = selected.id === 'mixed' ? 'Mixed levels' : $('#order-level').value;
    $('#order-link').href = `https://t.me/xkxxee?text=${encodeURIComponent(`Hi Kee! I'd like to ask about the ${subject} ${selected.title} (${level}), priced at ${money(selected.price)}. Could you confirm how to order?`)}`;
  }
  $('#order-level').addEventListener('change', updateOrder);
  $('#store-search').addEventListener('input', renderProducts);
  $$('[data-store-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.storeFilter; $$('[data-store-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); renderProducts(); }));
  renderProducts();
}

if (page === 'python') {
  const examples = {
    hello:'# A small beginning. Change the message and run it again.\nprint("Hello, world!")\nprint("Let’s make something make sense.")\n',
    grade:'def calculate_grade(marks):\n    if marks >= 90:\n        return "A*"\n    elif marks >= 80:\n        return "A"\n    else:\n        return "Keep practising"\n\n# Example thresholds for programming practice.\n# These are not official exam grade boundaries.\nscore = 85\nprint(f"A score of {score}: {calculate_grade(score)}")\n',
    fibonacci:'a, b = 0, 1\nfor step in range(10):\n    print(a)\n    a, b = b, a + b\n',
    sort:'numbers = [7, 2, 9, 1, 5]\n\nfor i in range(len(numbers) - 1):\n    for j in range(len(numbers) - 1 - i):\n        if numbers[j] > numbers[j + 1]:\n            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]\n\nprint("Sorted:", numbers)\n',
    input:'name = input("What is your name? ")\nage = int(input("How old are you? "))\nprint(f"Hello, {name}! Next year you will be {age + 1}.")\n'
  };
  let worker, ready = false, running = false;
  const editor = $('#python-code'), output = $('#python-output'), run = $('#run-python'), stop = $('#stop-python');
  const savedDraft = readPractice('kee-python-draft-v1', null);
  editor.value = savedDraft && typeof savedDraft.code === 'string' ? savedDraft.code.slice(0,50000) : examples.hello;
  if (savedDraft && typeof savedDraft.input === 'string') $('#python-input').value = savedDraft.input.slice(0,10000);
  if (savedDraft) $('#draft-status').textContent = 'Your saved draft is restored';
  function saveDraft() {
    const saved = savePractice('kee-python-draft-v1',{code:editor.value.slice(0,50000),input:$('#python-input').value.slice(0,10000)});
    $('#draft-status').textContent = saved ? 'Draft saved in this browser' : 'Draft could not be saved in this browser';
  }
  let draftTimer;
  function queueDraftSave() { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft,350); }
  editor.addEventListener('input',queueDraftSave);
  $('#python-input').addEventListener('input',queueDraftSave);
  window.addEventListener('pagehide',saveDraft);
  function appendOutput(text) { output.textContent += (output.textContent ? '\n' : '') + text; output.scrollTop = output.scrollHeight; }
  function setRunning(value) { running = value; run.disabled = value; stop.hidden = !value; }
  function stopWorker() { worker?.terminate(); worker = undefined; ready = false; setRunning(false); $('#python-status').textContent = 'Stopped. Python will reload on the next run.'; }
  async function execute() {
    if (running) return;
    output.textContent = ''; setRunning(true);
    $('#python-status').textContent = ready ? 'Running your program…' : 'Loading the Python interpreter…';
    if (!worker) {
      worker = new Worker('/python-worker.js');
      worker.onmessage = event => {
        if (event.data.type === 'ready') { ready = true; $('#python-status').textContent = 'Running your program…'; }
        if (event.data.type === 'output') appendOutput(event.data.text);
        if (event.data.type === 'error') appendOutput(event.data.text);
        if (event.data.type === 'done') { setRunning(false); $('#python-status').textContent = event.data.ok ? 'Finished. Try changing something and running again.' : 'Check the console for details.'; if (!output.textContent) output.textContent = 'Program finished with no printed output.'; }
      };
      worker.onerror = () => { appendOutput('Python could not start. Check your connection, then try again.'); stopWorker(); };
    }
    worker.postMessage({code:editor.value, input:$('#python-input').value});
  }
  run.addEventListener('click', execute);
  stop.addEventListener('click', () => { stopWorker(); appendOutput('Execution stopped.'); });
  $('#clear-console').addEventListener('click', () => output.textContent = '');
  $('#python-example').addEventListener('change', event => { editor.value = examples[event.target.value]; if (event.target.value === 'input') $('#python-input').value = 'Kee\n18'; saveDraft(); });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); execute(); }
    if (event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end'); queueDraftSave(); }
  });
  $('#download-code').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([editor.value], {type:'text/x-python'})); const link = document.createElement('a'); link.href = url; link.download = 'script.py'; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
  window.addEventListener('pagehide', () => worker?.terminate());
}

if (page === 'quiz') {
  let bank = [], questions = [], index = 0, score = 0, answers = [], recorded = false;
  const area = $('#quiz-area');
  const previousQuiz = practiceRecord();
  $('#quiz-personal-best').hidden = !(previousQuiz.quizAttempts > 0);
  if (previousQuiz.quizAttempts > 0) $('#quiz-personal-best').textContent = `Your best: ${previousQuiz.quizBest}/10 · Saved in this browser`;
  function start() {
    if (!bank.length) return;
    const pool = [...bank];
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
    questions = pool.slice(0,10); index = 0; score = 0; answers = []; recorded = false; renderQuestion();
  }
  function renderQuestion() {
    const question = questions[index];
    area.innerHTML = `<div class="quiz-progress-meta"><span>QUESTION ${index + 1} / ${questions.length}</span><span>${score} correct so far</span></div><div class="quiz-progress"><span style="width:${index / questions.length * 100}%"></span></div><h2 class="question-heading" tabindex="-1">${escapeHtml(question.q)}</h2><div class="quiz-options">${question.options.map((option,i) => `<button class="quiz-option" data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${escapeHtml(option)}</button>`).join('')}</div><div id="quiz-answer-feedback" role="status"></div><div class="quiz-bottom"><span class="small-note">Take your time. Understanding comes first.</span><button class="button" id="next-question" hidden>${index + 1 === questions.length ? 'See your results' : 'Next question'} →</button></div>`;
    $('.question-heading').focus({preventScroll:true});
    $$('[data-answer]').forEach(button => button.addEventListener('click', () => {
      const answer = question.options[Number(button.dataset.answer)];
      const correct = answer === question.answer;
      if (correct) score++;
      answers.push({question,answer,correct});
      $$('[data-answer]').forEach(item => { item.disabled = true; if (question.options[Number(item.dataset.answer)] === question.answer) item.classList.add('correct'); });
      if (!correct) button.classList.add('incorrect');
      $('#quiz-answer-feedback').innerHTML = `<div class="quiz-feedback">${correct ? 'That’s it. Nice work.' : `A useful one to revisit. The answer is: <strong>${escapeHtml(question.answer)}</strong>`}</div>`;
      $('#next-question').hidden = false;
    },{once:true}));
    $('#next-question').addEventListener('click', () => { index++; if (index < questions.length) renderQuestion(); else renderResults(); });
  }
  function renderResults() {
    if (!recorded) { const record = practiceRecord(); updatePractice({quizAttempts:(record.quizAttempts || 0)+1,quizBest:Math.max(record.quizBest || 0,score)}); recorded = true; }
    area.innerHTML = `<div class="quiz-welcome"><span class="big-symbol">${score}/${questions.length}</span><h2>${score === questions.length ? 'Everything clicked.' : 'A little clearer than before.'}</h2><p>${score >= 7 ? 'You’re building a solid foundation. Revisit the questions below, or try a fresh mix.' : 'Every attempt shows you where to focus next. Review the answers below, then give it another go.'}</p><button class="button" id="restart-quiz">Try a fresh mix ↻</button></div><h3>Your review</h3><ul class="review-list">${answers.map(({question,answer,correct}) => `<li><span class="review-status">${correct ? '✓ UNDERSTOOD' : '↻ REVISIT'}</span><strong>${escapeHtml(question.q)}</strong><span>${correct ? 'Your answer' : 'Correct answer'}: ${escapeHtml(question.answer)}</span>${!correct ? `<br><span>Your answer: ${escapeHtml(answer)}</span>` : ''}</li>`).join('')}</ul>`;
    const best = document.createElement('p'); best.className = 'small-note'; best.textContent = `Your best: ${practiceRecord().quizBest}/10 · Saved in this browser`; $('.quiz-welcome').append(best);
    $('#restart-quiz').addEventListener('click',start);
    area.scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('#start-quiz').disabled = true;
  $('#start-quiz').addEventListener('click',start);
  fetch('/data/quiz.json').then(response => { if (!response.ok) throw Error(); return response.json(); }).then(data => { bank = data.filter(item => item.options.includes(item.answer)); $('#quiz-bank-status').textContent = `${bank.length} questions in the original question bank.`; $('#start-quiz').disabled = false; }).catch(() => $('#quiz-bank-status').textContent = 'The questions couldn’t load. Refresh to try again.');
}

if (page === 'binary') {
  let score = 0, lives = 3, level = 1, bitCount = 4, value = 0, target = 0, running = false, paused = false, distance = 0, last = 0, frame;
  const requestedMode = new URLSearchParams(location.search).get('mode');
  let mode = requestedMode === 'practice' || requestedMode === 'arcade' ? requestedMode : readPractice('kee-binary-mode-v1','arcade');
  if (!['practice','arcade'].includes(mode)) mode = 'arcade';
  const field = $('#arcade-field'), number = $('#falling-number'), overlay = $('#arcade-overlay');
  const feedback = text => $('#arcade-feedback').textContent = text;
  function renderBits() {
    value = 0; $('#arcade-value').textContent = '0';
    $('#arcade-bits').innerHTML = Array.from({length:bitCount}, (_,i) => { const bit = 2 ** (bitCount - i - 1); return `<button class="arcade-bit" data-value="${bit}" aria-label="${bit} bit" aria-pressed="false"><span>${bit}</span><strong>0</strong></button>`; }).join('');
    $$('.arcade-bit').forEach(button => button.addEventListener('click', () => { if (!running || paused) return; const on = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed',String(on)); $('strong',button).textContent = on ? '1' : '0'; value += (on ? 1 : -1) * Number(button.dataset.value); $('#arcade-value').textContent = value; }));
  }
  function spawn() { distance = 18; const previous = target; do { target = 1 + Math.floor(Math.random() * (2 ** bitCount - 1)); } while (target === previous); number.textContent = target; number.style.transform = 'translate(-50%,18px)'; }
  function updateStats() { $('#arcade-score').textContent = score; $('#arcade-level').textContent = level; $('#arcade-lives').textContent = lives; $('#arcade-best').textContent = practiceRecord().arcadeBest || 0; }
  function finish() {
    running = false; cancelAnimationFrame(frame); number.hidden = true; $('#submit-binary').disabled = true; $('#pause-arcade').disabled = true;
    overlay.hidden = false; overlay.innerHTML = `<span class="big-symbol">${score}</span><h2>A good bit of practice.</h2><p>You matched ${score} ${score === 1 ? 'number' : 'numbers'}. Ready for another round?</p><button id="restart-arcade" class="button">Play again ↻</button>`;
    $('#restart-arcade').addEventListener('click',start);
  }
  function tick(now) {
    if (!running || paused) return;
    const elapsed = last ? Math.min(now - last,100) : 0; last = now;
    distance += elapsed * (0.016 + level * 0.003);
    number.style.transform = `translate(-50%,${distance}px)`;
    if (distance > field.clientHeight - 105) {
      lives--; updateStats(); feedback(`That one was ${target} = ${target.toString(2).padStart(bitCount,'0')}. Try the next number.`);
      if (lives <= 0) return finish();
      renderBits(); spawn();
    }
    frame = requestAnimationFrame(tick);
  }
  function start() { if (mode === 'arcade') {const record=practiceRecord();updatePractice({arcadeRuns:(record.arcadeRuns || 0)+1});} cancelAnimationFrame(frame); score = 0; lives = 3; level = 1; bitCount = 4; running = true; paused = false; last = 0; overlay.hidden = true; number.hidden = false; $('#submit-binary').disabled = false; $('#pause-arcade').disabled = false; $('#pause-arcade').textContent = 'Pause'; updateStats(); renderBits(); spawn(); feedback(mode === 'practice' ? 'No timer. Tap the bits, then press Enter to check your answer.' : 'Tap the bits. Add the values. Press Enter to match.'); if (mode === 'arcade') frame = requestAnimationFrame(tick); }
  function togglePause() {
    if (!running) return;
    paused = !paused; $('#pause-arcade').textContent = paused ? 'Resume' : 'Pause'; $('#submit-binary').disabled = paused;
    if (paused) { cancelAnimationFrame(frame); feedback('Paused. Take a breath, then resume when you’re ready.'); }
    else { last = 0; feedback('Back to the bits.'); frame = requestAnimationFrame(tick); }
  }
  function submit() {
    if (!running || paused) return;
    if (value !== target) { feedback(`Your switches add up to ${value}. Aim for ${target}.`); return; }
    score++; level = 1 + Math.floor(score / 5); bitCount = Math.min(8,4 + Math.floor(score / 5));
    if (mode === 'arcade' && score > (practiceRecord().arcadeBest || 0)) updatePractice({arcadeBest:score});
    updateStats(); feedback('That’s a match. Here comes the next one.'); renderBits(); spawn();
  }
  function selectMode(nextMode) {
    mode = nextMode; savePractice('kee-binary-mode-v1',mode);
    running = false; paused = false; cancelAnimationFrame(frame); score = 0; lives = 3; level = 1; bitCount = 4;
    field.classList.toggle('practice-mode',mode === 'practice'); $('#arcade-lives-group').hidden = mode === 'practice'; $('#pause-arcade').hidden = mode === 'practice'; $('#pause-arcade').disabled = true; $('#submit-binary').disabled = true; number.hidden = true;
    $$('[data-binary-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.binaryMode === mode)));
    overlay.hidden = false;
    overlay.innerHTML = mode === 'practice' ? '<span class="big-symbol">01</span><h2>Take it one bit at a time.</h2><p>No timer and no lost lives. Add the bit values to match each decimal number. More bits unlock as you practise.</p><button class="button" id="start-arcade">Start practising →</button>' : '<span class="big-symbol">01</span><h2>Catch the number.</h2><p>Match each decimal number before it reaches the line. You have three lives. More bits unlock as you progress.</p><button class="button" id="start-arcade">Let’s play ▷</button>';
    $('#start-arcade').addEventListener('click',start); updateStats(); renderBits(); feedback('Choose a mode to start. Switching modes starts a new round.');
  }
  $$('[data-binary-mode]').forEach(button => button.addEventListener('click',()=>selectMode(button.dataset.binaryMode)));
  $('#submit-binary').addEventListener('click',submit); $('#pause-arcade').addEventListener('click',togglePause);
  document.addEventListener('keydown',event => { if (event.key === 'Enter' && running && (document.activeElement.classList.contains('arcade-bit') || !['BUTTON','A','INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))) { event.preventDefault(); submit(); } });
  document.addEventListener('visibilitychange',() => { if (document.hidden && running && !paused && mode === 'arcade') togglePause(); });
  window.addEventListener('pagehide',() => cancelAnimationFrame(frame)); selectMode(mode);
}

if (page === 'logic') {
  let nodes = [], wires = [], nextId = 1, pending = null;
  const stage = $('#logic-stage'), nodeLayer = $('#logic-nodes'), svg = $('#logic-wires');
  const say = text => $('#logic-feedback').textContent = text;
  const countInputs = type => ['INPUT'].includes(type) ? 0 : ['NOT','OUTPUT'].includes(type) ? 1 : 2;
  function addNode(type,x,y) { const node = {id:nextId++,type,x:x ?? 60 + (nodes.length % 5) * 140,y:y ?? 65 + Math.floor(nodes.length / 5) * 130,on:false}; nodes.push(node); return node; }
  function solve(id,seen = new Set()) {
    if (seen.has(id)) return false;
    seen.add(id); const node = nodes.find(item => item.id === id); if (!node) return false;
    if (node.type === 'INPUT') return node.on;
    const inputs = Array.from({length:countInputs(node.type)},(_,port) => { const wire = wires.find(item => item.to === id && item.port === port); return wire ? solve(wire.from,new Set(seen)) : false; });
    switch(node.type) { case 'AND':return inputs.every(Boolean); case 'OR':return inputs.some(Boolean); case 'NOT':return !inputs[0]; case 'XOR':return inputs[0] !== inputs[1]; case 'NAND':return !inputs.every(Boolean); case 'NOR':return !inputs.some(Boolean); case 'OUTPUT':return inputs[0]; default:return false; }
  }
  function wouldCycle(from,to) {
    const queue = [to], seen = new Set();
    while(queue.length) { const id = queue.pop(); if (id === from) return true; if (seen.has(id)) continue; seen.add(id); wires.filter(wire => wire.from === id).forEach(wire => queue.push(wire.to)); }
    return false;
  }
  function drawWires() {
    svg.innerHTML = wires.map(wire => { const from = nodes.find(node => node.id === wire.from), to = nodes.find(node => node.id === wire.to); if (!from || !to) return ''; const x1=from.x+115,y1=from.y+61,x2=to.x,y2=to.y+(countInputs(to.type)===1?61:48+wire.port*28); const bend=Math.max(45,Math.abs(x2-x1)*.45);return `<path d="M${x1} ${y1} C${x1+bend} ${y1},${x2-bend} ${y2},${x2} ${y2}" fill="none" stroke="${solve(from.id)?'#6a9943':'#a9b99a'}" stroke-width="${solve(from.id)?3:2}"/>`; }).join('');
  }
  function render() {
    nodeLayer.innerHTML = nodes.map(node => {
      const active = solve(node.id), inputCount = countInputs(node.type);
      const label = `${node.type} ${node.id}`;
      return `<div class="logic-node" data-node="${node.id}" style="left:${node.x}px;top:${node.y}px"><div class="node-header" tabindex="0" aria-label="Move ${label}. Use arrow keys."><span>${label}</span><button class="delete-node" data-delete="${node.id}" aria-label="Delete ${label}">×</button></div><div class="node-body">${node.type==='INPUT'?`<button class="input-toggle" data-toggle="${node.id}" aria-label="Toggle input ${node.id}" aria-pressed="${node.on}">${node.on?1:0}</button>`:node.type==='OUTPUT'?`<span class="output-bulb ${active?'on':''}" role="status" aria-label="Output ${node.id}: ${active?1:0}">${active?1:0}</span>`:`<span class="gate-display">${node.type==='AND'?'&':node.type==='OR'?'≥1':node.type==='NOT'?'¬':node.type==='XOR'?'=1':node.type==='NAND'?'¬&':'¬≥1'}</span>`}</div>${Array.from({length:inputCount},(_,port)=>{const wire=wires.find(item=>item.to===node.id&&item.port===port);return `<button class="port input ${wire&&solve(wire.from)?'live':''}" style="top:${inputCount===1?49:36+port*28}px" data-in="${node.id}" data-port="${port}" aria-label="Connect to ${label} input ${port+1}"></button>`;}).join('')}${node.type!=='OUTPUT'?`<button class="port output ${active?'live':''} ${pending===node.id?'selected':''}" data-out="${node.id}" aria-label="Connect from ${label} output"></button>`:''}</div>`;
    }).join('');
    drawWires();
    $$('[data-toggle]').forEach(button=>button.addEventListener('click',()=>{const node=nodes.find(item=>item.id===Number(button.dataset.toggle));node.on=!node.on;render();const next=$(`[data-toggle="${node.id}"]`);next.focus({preventScroll:true});say(`Input ${node.id} is ${node.on?1:0}. The circuit has updated.`);}));
    $$('[data-delete]').forEach(button=>button.addEventListener('click',()=>{const id=Number(button.dataset.delete);nodes=nodes.filter(node=>node.id!==id);wires=wires.filter(wire=>wire.from!==id&&wire.to!==id);if(pending===id)pending=null;render();say('Component removed.');}));
    $$('[data-out]').forEach(button=>button.addEventListener('click',()=>{pending=Number(button.dataset.out);render();say('Now choose an input dot.');}));
    $$('[data-in]').forEach(button=>button.addEventListener('click',()=>{
      const to=Number(button.dataset.in),port=Number(button.dataset.port);
      if(pending===null){const exists=wires.some(wire=>wire.to===to&&wire.port===port);wires=wires.filter(wire=>wire.to!==to||wire.port!==port);render();say(exists?'Connection removed.':'Choose an output dot first.');return;}
      if(wouldCycle(pending,to)){say('That would create a loop. Connect components in a forward path.');return;}
      wires=wires.filter(wire=>wire.to!==to||wire.port!==port);wires.push({from:pending,to,port});pending=null;render();say('Connected. Toggle an input to explore the circuit.');
    }));
    $$('.node-header').forEach(header=>{
      const node=nodes.find(item=>item.id===Number(header.closest('[data-node]').dataset.node));
      header.addEventListener('keydown',event=>{const deltas={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(!deltas[event.key])return;event.preventDefault();node.x=Math.max(15,Math.min(770,node.x+deltas[event.key][0]));node.y=Math.max(10,Math.min(385,node.y+deltas[event.key][1]));const element=header.closest('.logic-node');element.style.left=node.x+'px';element.style.top=node.y+'px';drawWires();});
      header.addEventListener('pointerdown',event=>{
        if(event.target.closest('button'))return;
        event.preventDefault();const startX=event.clientX,startY=event.clientY,initialX=node.x,initialY=node.y;header.setPointerCapture(event.pointerId);
        const move=event=>{node.x=Math.max(15,Math.min(770,initialX+event.clientX-startX));node.y=Math.max(10,Math.min(385,initialY+event.clientY-startY));const element=header.closest('.logic-node');element.style.left=node.x+'px';element.style.top=node.y+'px';drawWires();};
        const end=()=>{header.removeEventListener('pointermove',move);header.removeEventListener('pointerup',end);header.removeEventListener('pointercancel',end);};
        header.addEventListener('pointermove',move);header.addEventListener('pointerup',end);header.addEventListener('pointercancel',end);
      });
    });
  }
  function example() { nodes=[];wires=[];nextId=1;pending=null;const a=addNode('INPUT',40,100),b=addNode('INPUT',40,295),xor=addNode('XOR',260,100),and=addNode('AND',260,295),sum=addNode('OUTPUT',480,100),carry=addNode('OUTPUT',480,295);wires=[{from:a.id,to:xor.id,port:0},{from:b.id,to:xor.id,port:1},{from:a.id,to:and.id,port:0},{from:b.id,to:and.id,port:1},{from:xor.id,to:sum.id,port:0},{from:and.id,to:carry.id,port:0}];render();say('Half adder: XOR gives the sum; AND gives the carry. Toggle the two inputs to explore.');}
  $('#restore-circuit').disabled = !readPractice('kee-circuit-v1',null);
  $('#save-circuit').addEventListener('click',()=>{
    const saved = savePractice('kee-circuit-v1',{version:1,nodes,wires,nextId});
    $('#restore-circuit').disabled = !saved; say(saved ? 'Circuit saved in this browser. You can restore it after leaving the page.' : 'This browser could not save the circuit. Your current circuit is still on the canvas.');
  });
  $('#restore-circuit').addEventListener('click',()=>{
    const saved = readPractice('kee-circuit-v1',null), types=['INPUT','AND','OR','NOT','XOR','NAND','NOR','OUTPUT'];
    if (!saved || saved.version !== 1 || !Array.isArray(saved.nodes) || !Array.isArray(saved.wires) || saved.nodes.length > 25 || saved.wires.length > 50 || saved.nodes.some(node=>!Number.isInteger(node.id)||!types.includes(node.type)||!Number.isFinite(node.x)||!Number.isFinite(node.y)) || new Set(saved.nodes.map(node=>node.id)).size !== saved.nodes.length) {say('The saved circuit could not be restored. Your current canvas is unchanged.');return;}
    const oldNodes=nodes,oldWires=wires;
    nodes=saved.nodes.map(node=>({...node,x:Math.max(15,Math.min(770,node.x)),y:Math.max(10,Math.min(385,node.y)),on:Boolean(node.on)})); wires=[];
    for (const wire of saved.wires) {
      const from=nodes.find(node=>node.id===wire.from),to=nodes.find(node=>node.id===wire.to);
      if (!from || !to || from.type==='OUTPUT' || !Number.isInteger(wire.port) || wire.port<0 || wire.port>=countInputs(to.type) || wires.some(item=>item.to===wire.to&&item.port===wire.port) || wouldCycle(wire.from,wire.to)) {nodes=oldNodes;wires=oldWires;say('The saved circuit contains an invalid connection. Your current canvas is unchanged.');return;}
      wires.push({from:wire.from,to:wire.to,port:wire.port});
    }
    nextId=Math.max(0,...nodes.map(node=>node.id))+1;pending=null;render();say('Saved circuit restored. Pick up where you left off.');
  });
  $$('[data-add-gate]').forEach(button=>button.addEventListener('click',()=>{if(nodes.length>=25){say('Your workspace has 25 components. Remove one before adding more.');return;}addNode(button.dataset.addGate);render();say(`${button.dataset.addGate} added. Drag it into place.`);}));
  $('#load-example').addEventListener('click',example);$('#reset-circuit').addEventListener('click',()=>{nodes=[];wires=[];pending=null;nextId=1;render();say('A fresh canvas. Add an input, a gate, and an output to get started.');});
  $('#cancel-wire').addEventListener('click',()=>{pending=null;render();say('Connection cancelled.');});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pending!==null){pending=null;render();say('Connection cancelled.');}});example();
}

document.querySelector('#site-root')?.setAttribute('data-interactive', 'ready');
