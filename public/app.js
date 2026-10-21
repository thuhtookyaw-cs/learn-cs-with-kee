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
  $('#preview-frame').src = safeUrl(file.preview);
  $('#preview-fallback').href = safeUrl(file.preview || file.url);
  preview.showModal();
}
function flattenDriveTree(tree) {
  const files = [];
  function visit(nodes, subject, folders = []) {
    for (const node of nodes) {
      if (node.type === 'dir') { visit(node.children || [], subject, [...folders, node.name]); continue; }
      const text = [...folders, node.name].join(' '), low = text.toLowerCase();
      let kind = 'Other resources';
      for (const [word, label] of [['question','Question paper'],['mark','Mark scheme'],['examiner','Examiner report'],['data','Data files'],['topical','Topical questions']]) {
        if (low.includes(word)) { kind = label; break; }
      }
      if (folders.includes('other')) kind = 'Other resources';
      const year = text.match(/20\d{2}/)?.[0] || '';
      files.push({ name:node.name, subject, folders, year, session:low.includes('november')?'November':low.includes('june')?'June':'', kind, url:node.path, preview:node.previewUrl });
    }
  }
  for (const subject of ['cs','ict']) visit(tree[subject] || [], subject);
  return files;
}
async function loadResources() {
  try {
    const response = await fetch('/api/files');
    if (!response.ok) throw Error('Live index unavailable');
    const data = await response.json();
    if (data.error || !Array.isArray(data.cs) || !Array.isArray(data.ict)) throw Error('Invalid live index');
    return flattenDriveTree(data);
  } catch {
    const response = await fetch('/data/resources.json');
    if (!response.ok) throw Error('Resource index unavailable');
    const message = $('.results-meta>span:last-child');
    if (message) message.textContent = 'Saved index · 21 October 2026';
    return response.json();
  }
}
const page = document.querySelector('#site-root')?.dataset.page || document.body.dataset.page;

if (page === 'dashboard') {
  loadResources().then(files => { $('#cs-count').textContent = files.filter(file => file.subject === 'cs').length; $('#ict-count').textContent = files.filter(file => file.subject === 'ict').length; }).catch(() => { $('#cs-count').textContent = 'CS'; $('#ict-count').textContent = 'ICT'; });
}

if (page === 'resources') {
  const subject = $('.resource-workspace').dataset.subject;
  const controls = ['#resource-search', '#year-filter', '#session-filter', '#kind-filter', '#resource-sort'].map(selector => $(selector));
  let files = [], pageNumber = 1, filtered = [];
  const size = 15;
  function render() {
    const search = $('#resource-search').value.toLowerCase().trim();
    filtered = files.filter(file => (!search || [file.name, ...file.folders, file.kind].join(' ').toLowerCase().replace(/[-_]/g, ' ').includes(search.replace(/[-_]/g, ' '))) && (!$('#year-filter').value || file.year === $('#year-filter').value) && (!$('#session-filter').value || file.session === $('#session-filter').value) && (!$('#kind-filter').value || file.kind === $('#kind-filter').value));
    const sort = $('#resource-sort').value;
    filtered.sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : ((sort === 'new' ? -1 : 1) * a.year.localeCompare(b.year) || a.name.localeCompare(b.name)));
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));
    pageNumber = Math.min(pageNumber, totalPages);
    $('#results-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'file' : 'files'}${filtered.length !== files.length ? ` of ${files.length}` : ''}`;
    const items = filtered.slice((pageNumber - 1) * size, pageNumber * size);
    $('#resource-list').innerHTML = items.length ? items.map((file,index) => `<article class="file-row"><span class="file-icon" aria-hidden="true">${file.name.includes('.') ? file.name.split('.').pop().slice(0,4).toUpperCase() : 'FILE'}</span><div class="file-copy"><h3>${escapeHtml(file.name.replace(/[-_]/g, ' '))}</h3><p>${escapeHtml([file.year,file.session,file.kind].filter(Boolean).join(' · '))}</p></div><div class="file-actions">${file.preview ? `<button class="plain-button" data-preview="${index}" aria-label="Preview ${escapeHtml(file.name)}">Preview</button>` : ''}<a href="${escapeHtml(safeUrl(file.url))}" target="_blank" rel="noopener" aria-label="Download ${escapeHtml(file.name)}">Download ↗</a></div></article>`).join('') : '<div class="empty-state"><h2>No papers found.</h2><p>Try a different search, or reset your filters.</p><button class="button button-outline" id="empty-reset">Reset filters</button></div>';
    $$('[data-preview]').forEach(button => button.addEventListener('click', () => previewFile(items[Number(button.dataset.preview)])));
    $('#empty-reset')?.addEventListener('click', resetFilters);
    $('#resource-pagination').innerHTML = totalPages > 1 ? `<button id="previous-page" ${pageNumber === 1 ? 'disabled' : ''}>← Previous</button><span>Page ${pageNumber} of ${totalPages}</span><button id="next-page" ${pageNumber === totalPages ? 'disabled' : ''}>Next →</button>` : '';
    function turnPage(delta) { pageNumber += delta; render(); $('.resource-results').scrollIntoView({behavior:'smooth',block:'start'}); }
    $('#previous-page')?.addEventListener('click', () => turnPage(-1));
    $('#next-page')?.addEventListener('click', () => turnPage(1));
  }
  function resetFilters() { controls.forEach(control => control.value = control.id === 'resource-sort' ? 'new' : ''); pageNumber = 1; render(); }
  controls.forEach(control => control.addEventListener(control.type === 'search' ? 'input' : 'change', () => { pageNumber = 1; render(); }));
  $('#clear-filters').addEventListener('click', resetFilters);
  loadResources().then(data => {
    files = data.filter(file => file.subject === subject);
    [...new Set(files.map(file => file.year).filter(Boolean))].sort().reverse().forEach(year => $('#year-filter').add(new Option(year, year)));
    render();
  }).catch(() => { $('#results-count').textContent = 'Resource index unavailable'; $('#resource-error').hidden = false; });
}

if (page === 'store') {
  const products = [
    {id:'free',title:'Free sample exam paper',desc:'A complete Edexcel IGCSE Computer Science sample paper. A good place to find your starting point.',price:0,type:'free',art:'01',label:'START HERE'},
    {id:'single',title:'1 sample exam paper',desc:'One focused practice paper. Choose Easy, Hard, or Extreme to suit your next study session.',price:1000,type:'paid',art:'01',label:'CHOOSE YOUR LEVEL'},
    {id:'five',title:'5 papers bundle',desc:'Five sample exam papers for a little more practice. Choose the difficulty level that works for you.',price:4000,original:5000,type:'paid',art:'05',label:'PRACTICE BUNDLE'},
    {id:'ten',title:'10 papers bundle',desc:'Ten sample exam papers to build a steady practice rhythm. Available in Easy, Hard, or Extreme.',price:8000,original:10000,type:'paid',art:'10',label:'PRACTICE BUNDLE'},
    {id:'mixed',title:'Mixed level: 10 papers',desc:'A blend of Easy, Hard, and Extreme papers. Work through a wider range of challenges.',price:8000,original:10000,type:'paid',art:'10+',label:'MIX IT UP'}
  ];
  let filter = 'all', selected;
  const money = amount => `${amount.toLocaleString('en-US')} MMK`;
  function renderProducts() {
    const search = $('#store-search').value.toLowerCase().trim();
    const list = products.filter(product => (filter === 'all' || product.type === filter) && `${product.title} ${product.desc}`.toLowerCase().includes(search));
    $('#store-count').textContent = `${list.length} ${list.length === 1 ? 'resource' : 'resources'}`;
    $('#store-empty').hidden = list.length > 0;
    $('#store-products').innerHTML = list.map(product => `<article class="product-card"><div class="product-art" aria-hidden="true"><span>${product.art}</span><div class="pill">${product.label}</div></div><div class="product-copy"><h2>${product.title}</h2><p>${product.desc}</p><div class="product-price">${product.original ? `<s>${money(product.original)}</s>` : ''}<strong>${product.price ? money(product.price) : 'Free'}</strong></div>${product.type === 'free' ? '<a class="button button-outline" href="/data/sample-exam-paper.pdf" download>Download sample PDF <span>↓</span></a>' : `<button class="button button-outline" data-order="${product.id}">Choose resource <span>↗</span></button>`}</div></article>`).join('');
    $$('[data-order]').forEach(button => button.addEventListener('click', () => {
      selected = products.find(product => product.id === button.dataset.order);
      $('#order-title').textContent = selected.title;
      $('#order-price').textContent = money(selected.price);
      $('#order-level').hidden = selected.id === 'mixed';
      $('label[for="order-level"]').hidden = selected.id === 'mixed';
      updateOrder(); $('#order-dialog').showModal();
    }));
  }
  function updateOrder() {
    const level = selected.id === 'mixed' ? 'Mixed levels' : $('#order-level').value;
    $('#order-link').href = `https://t.me/xkxxee?text=${encodeURIComponent(`Hi Kee! I'd like to ask about ${selected.title} (${level}), priced at ${money(selected.price)}. Could you confirm how to order?`)}`;
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
  editor.value = examples.hello;
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
  $('#python-example').addEventListener('change', event => { editor.value = examples[event.target.value]; if (event.target.value === 'input') $('#python-input').value = 'Kee\n18'; });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); execute(); }
    if (event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end'); }
  });
  $('#download-code').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([editor.value], {type:'text/x-python'})); const link = document.createElement('a'); link.href = url; link.download = 'script.py'; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
  window.addEventListener('pagehide', () => worker?.terminate());
}

if (page === 'quiz') {
  let bank = [], questions = [], index = 0, score = 0, answers = [];
  const area = $('#quiz-area');
  function start() {
    if (!bank.length) return;
    const pool = [...bank];
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i],pool[j]] = [pool[j],pool[i]]; }
    questions = pool.slice(0,10); index = 0; score = 0; answers = []; renderQuestion();
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
    area.innerHTML = `<div class="quiz-welcome"><span class="big-symbol">${score}/${questions.length}</span><h2>${score === questions.length ? 'Everything clicked.' : 'A little clearer than before.'}</h2><p>${score >= 7 ? 'You’re building a solid foundation. Revisit the questions below, or try a fresh mix.' : 'Every attempt shows you where to focus next. Review the answers below, then give it another go.'}</p><button class="button" id="restart-quiz">Try a fresh mix ↻</button></div><h3>Your review</h3><ul class="review-list">${answers.map(({question,answer,correct}) => `<li><span class="review-status">${correct ? '✓ UNDERSTOOD' : '↻ REVISIT'}</span><strong>${escapeHtml(question.q)}</strong><span>${correct ? 'Your answer' : 'Correct answer'}: ${escapeHtml(question.answer)}</span>${!correct ? `<br><span>Your answer: ${escapeHtml(answer)}</span>` : ''}</li>`).join('')}</ul>`;
    $('#restart-quiz').addEventListener('click',start);
    area.scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('#start-quiz').disabled = true;
  $('#start-quiz').addEventListener('click',start);
  fetch('/data/quiz.json').then(response => { if (!response.ok) throw Error(); return response.json(); }).then(data => { bank = data.filter(item => item.options.includes(item.answer)); $('#quiz-bank-status').textContent = `${bank.length} questions in the original question bank.`; $('#start-quiz').disabled = false; }).catch(() => $('#quiz-bank-status').textContent = 'The questions couldn’t load. Refresh to try again.');
}

if (page === 'binary') {
  let score = 0, lives = 3, level = 1, bitCount = 4, value = 0, target = 0, running = false, paused = false, distance = 0, last = 0, frame;
  const field = $('#arcade-field'), number = $('#falling-number'), overlay = $('#arcade-overlay');
  const feedback = text => $('#arcade-feedback').textContent = text;
  function renderBits() {
    value = 0; $('#arcade-value').textContent = '0';
    $('#arcade-bits').innerHTML = Array.from({length:bitCount}, (_,i) => { const bit = 2 ** (bitCount - i - 1); return `<button class="arcade-bit" data-value="${bit}" aria-label="${bit} bit" aria-pressed="false"><span>${bit}</span><strong>0</strong></button>`; }).join('');
    $$('.arcade-bit').forEach(button => button.addEventListener('click', () => { if (!running || paused) return; const on = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed',String(on)); $('strong',button).textContent = on ? '1' : '0'; value += (on ? 1 : -1) * Number(button.dataset.value); $('#arcade-value').textContent = value; }));
  }
  function spawn() { distance = 18; const previous = target; do { target = 1 + Math.floor(Math.random() * (2 ** bitCount - 1)); } while (target === previous); number.textContent = target; number.style.transform = 'translate(-50%,18px)'; }
  function updateStats() { $('#arcade-score').textContent = score; $('#arcade-level').textContent = level; $('#arcade-lives').textContent = lives; }
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
  function start() { cancelAnimationFrame(frame); score = 0; lives = 3; level = 1; bitCount = 4; running = true; paused = false; last = 0; overlay.hidden = true; number.hidden = false; $('#submit-binary').disabled = false; $('#pause-arcade').disabled = false; $('#pause-arcade').textContent = 'Pause'; updateStats(); renderBits(); spawn(); feedback('Tap the bits. Add the values. Press Enter to match.'); frame = requestAnimationFrame(tick); }
  function togglePause() {
    if (!running) return;
    paused = !paused; $('#pause-arcade').textContent = paused ? 'Resume' : 'Pause'; $('#submit-binary').disabled = paused;
    if (paused) { cancelAnimationFrame(frame); feedback('Paused. Take a breath, then resume when you’re ready.'); }
    else { last = 0; feedback('Back to the bits.'); frame = requestAnimationFrame(tick); }
  }
  function submit() {
    if (!running || paused) return;
    if (value !== target) { feedback(`Your switches add up to ${value}. Aim for ${target}.`); return; }
    score++; level = 1 + Math.floor(score / 5); bitCount = Math.min(8,4 + Math.floor(score / 5)); updateStats(); feedback('That’s a match. Here comes the next one.'); renderBits(); spawn();
  }
  $('#start-arcade').addEventListener('click',start); $('#submit-binary').addEventListener('click',submit); $('#pause-arcade').addEventListener('click',togglePause);
  document.addEventListener('keydown',event => { if (event.key === 'Enter' && running && (document.activeElement.classList.contains('arcade-bit') || !['BUTTON','A','INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))) { event.preventDefault(); submit(); } });
  document.addEventListener('visibilitychange',() => { if (document.hidden && running && !paused) togglePause(); });
  window.addEventListener('pagehide',() => cancelAnimationFrame(frame)); renderBits();
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
  $$('[data-add-gate]').forEach(button=>button.addEventListener('click',()=>{if(nodes.length>=25){say('Your workspace has 25 components. Remove one before adding more.');return;}addNode(button.dataset.addGate);render();say(`${button.dataset.addGate} added. Drag it into place.`);}));
  $('#load-example').addEventListener('click',example);$('#reset-circuit').addEventListener('click',()=>{nodes=[];wires=[];pending=null;nextId=1;render();say('A fresh canvas. Add an input, a gate, and an output to get started.');});
  $('#cancel-wire').addEventListener('click',()=>{pending=null;render();say('Connection cancelled.');});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pending!==null){pending=null;render();say('Connection cancelled.');}});example();
}
