// krei klausimynas po pirmo susitikimo: vienas puslapis, trys rolės (vadovas, skyrius, it).
// Asmeninė nuoroda ?k=KODAS -> Apps Script grąžina žmogaus duomenis; be kodo veikia pavyzdys (?demo=skyrius), atsakymai lieka įrenginyje.
let CONFIG = {
  imone: 'UAB Pavyzdys', vardas: 'Vardenis Pavardenis', pareigos: 'pardavimų vadovas', role: 'skyrius',
  data: 'lapkričio 24 d.', terminas: 'lapkričio 20 d.', vadovas: 'Jonas Jonaitis',
  kontaktas: {vardas: 'Antanas Sitnikas', pastas: 'antanas@krei.lt', telefonas: '+370 603 04727'},
  darbai: [], skyriai: [], pavyzdziai: {}
};

const ICONS = {
  'arrow-right': '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7l7 7l-7 7"/>',
  'check': '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/>',
  'download': '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10l5 5l5-5"/></g>',
  'chevron-down': '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/>',
  'plus': '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/>'
};
// Pasirinkimai su paveikslėliu rodomi kortelėmis; kiti lieka trumpomis piliulėmis.
const CHOICE_CARDS = {
  programos: {layout: 'cols-3', icons: {'Paštas (Outlook, Gmail)': 'mail', 'Excel': 'logo-excel', 'Word': 'logo-word', 'Apskaitos programa': 'calculator', 'Klientų programa (CRM)': 'book-user', 'Gamybos, sandėlio ar ERP sistema': 'factory', 'Užsakovo sistema ar portalas': 'globe', 'WhatsApp, Viber, Teams': 'message', 'Popierius': 'file', 'Kita': 'ellipsis'}},
  failai: {layout: 'cols-3', icons: {'Kompiuteryje': 'laptop', 'Įmonės serveryje': 'server', 'OneDrive / SharePoint': 'logo-onedrive', 'Google Drive': 'logo-drive', 'Dropbox': 'logo-dropbox', 'Kita': 'ellipsis'}},
  pastas: {layout: 'cols-3', icons: {'Microsoft 365': 'logo-microsoft', 'Google Workspace': 'logo-google', 'Kita': 'ellipsis'}},
  kompiuteriai: {layout: 'is-row cols-2', icons: {'Windows': 'logo-windows', 'Mac': 'logo-apple'}}
};
// Lucide (lucide.dev, ISC) keliai, piešiami 1,7 storio linija styles.css.
const OPTION_ICONS = {
  laptop: '<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2zm2.054 10.987H3.946"/>',
  mail: '<path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
  calculator: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8m0 8v4m0-8h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
  'book-user': '<path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/>',
  ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  factory: '<path d="M12 16h.01M16 16h.01M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-7 5V8l-7 5V3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"/><path d="M8 16h.01"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>'
};
const UI = {
  saved: 'Išsaugota', local: 'Atsakymai išsaugomi šiame įrenginyje.',
  storageError: 'Nepavyksta išsaugoti šiame įrenginyje. Prieš užverdami puslapį atsisiųskite atsakymus.',
  answer: 'Jūsų atsakymas', empty: 'Neatsakyta', required: 'privaloma',
  missingTitle: 'Dar trūksta privalomų atsakymų:',
  calculator: 'Valandos per mėnesį', hours: 'val.', total: 'Iš viso',
  chartEmpty: 'Įrašykite darbą, kartų skaičių ir minutes. Čia matysite, kam skyrius skiria daugiausia laiko.',
  suggested: 'Daugiausia laiko užima:', use: 'Pasirinkti: {name}', suggestedDone: 'Darbas pasirinktas. Žemiau parašykite, kodėl būtent jis.',
  addRow: 'Pridėti eilutę', addJob: 'Pridėti darbą', addStep: 'Pridėti žingsnį', row: 'Eilutė {n}', job: 'Darbas {n}', step: 'Žingsnis {n}',
  example: 'Pavyzdys, kaip pildyti', decimalHint: 'Įrašykite skaičių, pvz., 2,5.',
  answeredCount: 'Atsakyta {n} iš {viso}',
  usedFor: 'Iš jūsų atsakymų paruošime:', uses: ['konkrečią strategiją ir planą įmonei', 'pasiūlymą su grąža', 'demonstraciją su jūsų pavyzdžiu'],
  presentation: 'Pristatymas', deadline: 'Atsakymų terminas', duration: 'Trukmė',
  demoNotice: 'Tai pavyzdys: atsakymai niekur nesiunčiami.',
  loading: 'Įkeliame jūsų puslapį…', expiredTitle: 'Ši nuoroda nebegalioja', expiredNote: 'Parašykite tam, kas jums ją atsiuntė, ir gausite naują.',
  loadError: 'Nepavyko įkelti puslapio. Patikrinkite ryšį ir bandykite dar kartą.',
  retry: 'Bandyti dar kartą', sending: 'Siunčiama…', submit: 'Pateikti', home: '{ZENKLAS}, į pradžią',
  privacy: 'Atsakymus gauname mes, {ZENKLAS} ({JURIDINIS}). Juos naudojame tik ruošdami jūsų įmonei strategiją, pasiūlymą ir demonstraciją ir saugome iki 6 mėnesių. Jei norite, kad ištrintume anksčiau, parašykite adresu {KONTAKTAS_PASTAS}.',
  sent: 'Atsakymai išsiųsti {data}. Ačiū, iki pristatymo {DATA}.',
  done: 'Šiame pavyzdyje atsakymai lieka tik šiame įrenginyje. Galite juos atsisiųsti.',
  sendError: 'Nepavyko išsiųsti. Atsakymai liko šiame įrenginyje. Bandykite dar kartą arba atsisiųskite failą ir nusiųskite jį {KONTAKTAS_PASTAS}.',
  tooMany: 'Pateikėte per daug kartų. Bandykite po kelių valandų.',
  edited: 'Atsakymus pakeitėte po išsiuntimo. Pateikite dar kartą, kad gautume naujausius.',
  alreadySent: 'Klausimyną jau pateikėte {data}. Galite papildyti ir pateikti dar kartą.',
  download: 'Atsisiųsti atsakymus', downloadError: 'Atsisiųsti nepavyko. Bandykite dar kartą.',
  questions: 'Klausimai? {KONTAKTAS_VARDAS}, ', thanks: 'Ačiū. Atsakymai išsisaugo automatiškai.'
};

let FIELDS = configFields(CONFIG);
function configFields(c) {
  return {VARDAS: c.vardas, IMONE: c.imone, PAREIGOS: c.pareigos || '', DATA: c.data, TERMINAS: c.terminas, VADOVAS: c.vadovas || 'vadovas',
    KONTAKTAS_VARDAS: c.kontaktas.vardas, KONTAKTAS_PASTAS: c.kontaktas.pastas, KONTAKTAS_TELEFONAS: c.kontaktas.telefonas,
    ZENKLAS: ZENKLAS.vardas, JURIDINIS: ZENKLAS.juridinis};
}
function fill(text) { return String(text).replace(/\{([A-Z_]+)\}/g, (_, key) => FIELDS[key] ?? ''); }
function esc(value) { return String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c])); }
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`; }
function number(value) { return new Intl.NumberFormat('lt-LT', {maximumFractionDigits: 2}).format(value); }
function role() { return klausimynoRole(CONFIG.role); }
function roleInfo() { return KLAUSIMYNAS.roles[role()]; }
// Pavyzdžiai pritaikomi kiekvienam klientui per nuorodos nustatymus (pavyzdziai: {raktas: tekstas}).
function example(field) { return CONFIG.pavyzdziai && typeof CONFIG.pavyzdziai[field.raktas] === 'string' ? CONFIG.pavyzdziai[field.raktas] : field.pavyzdys; }

function blankJob() { return {name: '', count: '', minutes: '', people: '', risk: ''}; }
function blankRow(field) { return field.stulpeliai.map(() => ''); }
function prefilledRows(field) {
  if (field.raktas === 'darbai') return (Array.isArray(CONFIG.darbai) ? CONFIG.darbai : []).filter(darbasTinka).map(d => ({...blankJob(), ...d}));
  if (field.raktas === 'skyriai') return (Array.isArray(CONFIG.skyriai) ? CONFIG.skyriai : []).filter(r => Array.isArray(r)).map(r => field.stulpeliai.map((_, i) => String(r[i] ?? '')));
  return [];
}
function padRows(field, rows) {
  const out = rows.slice(0, field.eiluciu);
  while (out.length < field.pradzioje) out.push(field.tipas === 'darbai' ? blankJob() : blankRow(field));
  return out;
}
function freshState() {
  const answers = {};
  for (const field of klausimynoLaukai(role())) if (['darbai', 'lentele', 'zingsniai'].includes(field.tipas)) answers[field.raktas] = padRows(field, prefilledRows(field));
  return {v: 1, answers, sentAt: null, changedAfterSend: false, pakeista: new Date().toISOString()};
}
function syncFirstJob(state) {
  const names = darbuPavadinimai(state.answers.darbai);
  if (names.length && state.answers.pirmas && !names.includes(state.answers.pirmas)) delete state.answers.pirmas;
  return state;
}
function renameFirstJob(state, index, value) {
  const before = state.answers.darbai[index].name.trim(), after = value.trim();
  state.answers.darbai[index].name = value;
  if (before && after && state.answers.pirmas === before && !state.answers.darbai.some(job => job.name.trim() === before)) state.answers.pirmas = after;
  return syncFirstJob(state);
}
function normalizeState(raw) {
  const result = freshState();
  if (!raw || typeof raw !== 'object' || raw.v !== 1) return result;
  const answers = raw.answers && typeof raw.answers === 'object' ? raw.answers : {};
  for (const field of klausimynoLaukai(role())) {
    const value = Object.prototype.hasOwnProperty.call(answers, field.raktas) ? answers[field.raktas] : undefined;
    if (value === undefined) continue;
    if (['darbai', 'lentele', 'zingsniai'].includes(field.tipas)) {
      if (!Array.isArray(value)) continue;
      const rows = field.tipas === 'darbai'
        ? value.map(d => { const job = blankJob(); for (const k of Object.keys(job)) if (typeof d?.[k] === 'string') job[k] = d[k].slice(0, 300); return job; })
        : value.filter(Array.isArray).map(r => field.stulpeliai.map((_, i) => typeof r[i] === 'string' ? r[i].slice(0, 300) : ''));
      result.answers[field.raktas] = padRows(field, rows);
    } else if (reiksmeTinka(field, value)) result.answers[field.raktas] = Array.isArray(value) ? [...value] : value;
  }
  syncFirstJob(result);
  if (typeof raw.sentAt === 'string' && !isNaN(Date.parse(raw.sentAt))) result.sentAt = raw.sentAt;
  result.changedAfterSend = raw.changedAfterSend === true;
  if (typeof raw.pakeista === 'string' && !isNaN(Date.parse(raw.pakeista))) result.pakeista = raw.pakeista;
  return result;
}
// Tiksliai tai, kas išeina iš puslapio: matomi ir tinkami atsakymai.
function submissionState(state) {
  return {v: 1, role: role(), answers: pateikiamiAtsakymai(state.answers, role()), sentAt: state.sentAt, changedAfterSend: state.changedAfterSend, pakeista: state.pakeista};
}
function rankedJobs(jobs) {
  return jobs.map((job, index) => ({...job, index, hours: jobHours(job)})).filter(job => job.name.trim() && job.hours !== null).sort((a, b) => b.hours - a.hours || a.index - b.index);
}
// Kopija įrenginyje galioja 60 d. po paskutinio pakeitimo.
const KOPIJOS_PRIESDELIS = 'klausimynas-v1:';
const KOPIJA_D = 60, DIENA_MS = 86400000;
function kopijaNebegalioja(raw, now = Date.now()) {
  let copy;
  try { copy = JSON.parse(raw); } catch { return true; }
  if (!copy || typeof copy !== 'object' || copy.v !== 1) return true;
  const until = typeof copy.pakeista === 'string' ? Date.parse(copy.pakeista) + KOPIJA_D * DIENA_MS : NaN;
  return isNaN(until) || until <= now;
}
function isvalytiKopijas(storage, now = Date.now()) {
  const keys = [];
  try { for (let i = 0; i < storage.length; i++) { const key = storage.key(i); if (typeof key === 'string' && key.startsWith(KOPIJOS_PRIESDELIS)) keys.push(key); } } catch { return []; }
  return keys.filter(key => { try { if (!kopijaNebegalioja(storage.getItem(key), now)) return false; storage.removeItem(key); return true; } catch { return false; } });
}

// DOM
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const PARAMS = new URLSearchParams(location.search || '');
const LINK_CODE = PARAMS.get('k');
const LINK_MODE = LINK_CODE !== null && LINK_CODE !== '';
let STORAGE_KEY = KOPIJOS_PRIESDELIS + 'demo:' + (PARAMS.get('demo') || 'skyrius');
let storageOK = true;
let state = null;
let serverSentAt = null;
let sending = false, sendFailed = false, submitAttempted = false;
let currentView = 'klausimynas';
let suggestionName = '';
let saveTimer;

function writeLocal() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadLocalState() {
  try { state = normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { state = freshState(); storageOK = false; }
}
function save(changed = true) {
  if (changed) state.pakeista = new Date().toISOString();
  if (state.sentAt) state.changedAfterSend = true;
  try { writeLocal(); storageOK = true; } catch { storageOK = false; }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { $('#save-status').textContent = storageOK ? UI.saved : UI.storageError; }, 250);
  updateProgress();
}

function requiredMark(field) { return field.privalomas ? ` <span class="required-mark">(${UI.required})</span>` : ''; }
function note(kind, field, text) { return text ? `<p class="field-${kind}" id="${kind}-${field.raktas}">${esc(fill(text))}</p>` : ''; }
function describedBy(field) {
  const ids = [field.pagalba ? `help-${field.raktas}` : '', typeof example(field) === 'string' ? `example-${field.raktas}` : ''].filter(Boolean);
  return ids.length ? ` aria-describedby="${ids.join(' ')}"` : '';
}
function choiceVisual(name) {
  if (!name) return '';
  if (name.startsWith('logo-')) return `<span class="choice-logo ${name}" aria-hidden="true"></span>`;
  return `<svg class="choice-icon" viewBox="0 0 24 24" aria-hidden="true">${OPTION_ICONS[name]}</svg>`;
}
function choiceFace(field, choice) {
  const cards = CHOICE_CARDS[field.raktas];
  if (!cards && field.tipas !== 'darbas') return `<span class="choice-face">${icon('check')}<span class="choice-text">${esc(choice)}</span></span>`;
  return `<span class="choice-face">${cards ? choiceVisual(cards.icons[choice]) : ''}<span class="choice-text">${esc(choice)}</span><span class="choice-mark" aria-hidden="true"></span></span>`;
}
function choiceGroup(field, labelId, choices = field.pasirinkimai) {
  const multi = field.tipas === 'keli', value = state.answers[field.raktas];
  const layout = CHOICE_CARDS[field.raktas] ? 'is-cards ' + CHOICE_CARDS[field.raktas].layout : field.tipas === 'darbas' ? 'is-list' : 'is-pills';
  return `<div class="choice-group ${layout}" role="${multi ? 'group' : 'radiogroup'}" aria-labelledby="${labelId}"${describedBy(field)}>${choices.map((choice, i) => `<label class="choice"><input type="${multi ? 'checkbox' : 'radio'}" name="${field.raktas}" id="q-${field.raktas}-${i}" value="${esc(choice)}" data-choice="${field.raktas}" ${(multi ? (value || []).includes(choice) : value === choice) ? 'checked' : ''}>${choiceFace(field, choice)}</label>`).join('')}</div>`;
}
function askClass(text) { return /[?:]$/.test(text || '') ? ' class="is-ask"' : ''; }
function textControl(field, labelled) {
  const value = esc(state.answers[field.raktas] || '');
  if (field.tipas === 'tekstas') return `<textarea id="q-${field.raktas}" name="q-${field.raktas}" data-answer="${field.raktas}" rows="3" maxlength="${field.riba}" placeholder="${UI.answer}"${labelled}${describedBy(field)}>${value}</textarea>`;
  const num = field.tipas === 'skaicius';
  return `<input type="text" class="text-input${num ? ' number-input' : ''}" id="q-${field.raktas}" name="q-${field.raktas}" data-answer="${field.raktas}" maxlength="${num ? 6 : field.riba}" ${num ? 'inputmode="numeric" ' : ''}value="${value}"${labelled}${describedBy(field)}>`;
}
function firstJobHTML(field, question) {
  const names = darbuPavadinimai(state.answers.darbai);
  if (names.length) return choiceGroup(field, `title-${question.id}`, names);
  return `<label for="q-${field.raktas}">${esc(field.etikete)}</label>${textControl(field, '')}`;
}
// Lentelė (skyriai, dalyviai, sistemos) ir žingsnių lentelė: eilutės su įvesties laukais, numeris, pavyzdys, „Pridėti eilutę“.
function tableHTML(field) {
  const rows = state.answers[field.raktas], cols = field.stulpeliai, steps = field.tipas === 'zingsniai';
  const rowLabel = steps ? UI.step : UI.row;
  const head = `<div class="tbl-head tbl-${cols.length}" aria-hidden="true"><span></span>${cols.map(c => `<span>${esc(c)}</span>`).join('')}</div>`;
  const ex = steps
    ? `<details class="table-example"><summary>${UI.example}${icon('chevron-down')}</summary><ol class="example-steps">${(field.pavyzdziai || []).map(r => `<li>${r.map((c, j) => c ? `<span><span class="example-label">${esc(cols[j])}: </span>${esc(c)}</span>` : '').filter(Boolean).join(' · ')}</li>`).join('')}</ol></details>`
    : (example(field) ? `<div class="example-row tbl-${cols.length}"><span></span>${example(field).map((c, j) => `<span><span class="example-label">${esc(cols[j])}: </span>${esc(c)}</span>`).join('')}</div>` : '');
  const body = rows.map((row, i) => `<div class="tbl-row tbl-${cols.length}" role="group" aria-label="${rowLabel.replace('{n}', i + 1)}"><span class="row-num">${String(i + 1).padStart(2, '0')}</span>${cols.map((c, j) => `<div class="tbl-cell"><label for="cell-${field.raktas}-${i}-${j}">${esc(c)}</label><input id="cell-${field.raktas}-${i}-${j}" aria-label="${esc(c)}, ${rowLabel.replace('{n}', i + 1)}" data-cell="${field.raktas}" data-row="${i}" data-col="${j}" type="text" maxlength="300" ${steps && j === cols.length - 1 ? 'inputmode="decimal"' : ''} value="${esc(row[j])}"></div>`).join('')}</div>`).join('');
  const add = `<button type="button" class="secondary add-row" data-add="${field.raktas}" ${rows.length >= field.eiluciu ? 'hidden' : ''}>${icon('plus')}${steps ? UI.addStep : UI.addRow}</button>`;
  return `<div class="table-block" id="table-${field.raktas}">${head}${ex}<div class="tbl-body">${body}</div>${add}</div>`;
}
function jobsHTML(field) {
  const rows = state.answers.darbai, cols = field.stulpeliai, keys = ['name', 'count', 'minutes', 'people', 'risk'];
  const body = rows.map((job, i) => `<div class="tbl-row tbl-jobs" role="group" aria-label="${UI.job.replace('{n}', i + 1)}"><span class="row-num">${String(i + 1).padStart(2, '0')}</span>${keys.map((key, c) => `<div class="tbl-cell"><label for="job-${i}-${key}">${esc(cols[c])}</label><input id="job-${i}-${key}" aria-label="${esc(cols[c])}, ${UI.job.replace('{n}', i + 1)}" data-job="${i}" data-key="${key}" type="text" maxlength="300" ${c >= 1 && c <= 3 ? 'inputmode="decimal"' : ''} value="${esc(job[key])}"></div>`).join('')}</div>`).join('');
  return `<div class="table-block" id="table-darbai"><div class="tbl-head tbl-jobs" aria-hidden="true"><span></span>${cols.map(c => `<span>${esc(c)}</span>`).join('')}</div><div class="example-row tbl-jobs"><span></span>${example(field).map((c, j) => `<span><span class="example-label">${esc(cols[j])}: </span>${esc(c)}</span>`).join('')}</div><div class="tbl-body">${body}</div><button type="button" class="secondary add-row" data-add="darbai" ${rows.length >= field.eiluciu ? 'hidden' : ''}>${icon('plus')}${UI.addJob}</button></div>` +
    `<aside class="calculation" aria-label="${UI.calculator}"><div><p class="calc-label">${UI.calculator}</p><p class="calc-total"><span id="total-hours">0</span> <small>${UI.hours}</small></p></div><div id="chart" role="img" aria-label="${UI.calculator}"></div></aside><div class="mobile-total"><span>${UI.calculator}</span><strong><span id="mobile-total-hours">0</span> ${UI.hours}</strong></div>`;
}
function fieldHTML(field, question, previousGroup) {
  const choice = ['vienas', 'keli'].includes(field.tipas), labelId = `label-${field.raktas}`;
  const shown = field.rodomaKai ? ` data-conditional="${field.raktas}"${laukasRodomas(field, state.answers) ? '' : ' hidden'}` : '';
  const group = field.grupe && field.grupe !== previousGroup ? `<p class="group-label">${esc(field.grupe)}</p>` : '';
  if (field.tipas === 'darbas') {
    return `<div class="subfield"><div id="suggestion-area" hidden><p class="suggestion-note">${UI.suggested}</p><button type="button" id="suggestion" class="suggestion"></button><p id="suggestion-status" class="suggestion-note" role="status"></p></div><div id="first-job">${firstJobHTML(field, question)}</div>${note('help', field, field.pagalba)}</div>`;
  }
  const label = !field.etikete ? '' : choice ? `<p class="group-label${/[?:]$/.test(field.etikete) ? ' is-ask' : ''}" id="${labelId}">${esc(fill(field.etikete))}${requiredMark(field)}</p>` : ['lentele', 'zingsniai'].includes(field.tipas) ? `<p class="group-label is-ask" id="${labelId}">${esc(fill(field.etikete))}</p>` : `<label for="q-${field.raktas}"${askClass(field.etikete)}>${esc(fill(field.etikete))}${requiredMark(field)}</label>`;
  let control;
  if (choice) control = choiceGroup(field, field.etikete ? labelId : `title-${question.id}`);
  else if (['lentele', 'zingsniai'].includes(field.tipas)) control = tableHTML(field);
  else control = textControl(field, field.etikete ? '' : ` aria-labelledby="title-${question.id}"`);
  const tableType = ['lentele', 'zingsniai'].includes(field.tipas);
  return `<div class="subfield"${shown}>${group}${label}${note('help', field, field.pagalba)}${tableType ? '' : note('example', field, example(field))}${control}</div>`;
}
function questionTitle(question) { return klausimoPavadinimas(question, state.answers, fill); }
function renderQuestion(question) {
  const title = esc(questionTitle(question));
  const long = (question.pavadinimasBe || question.pavadinimas).length > 90 ? ' class="is-long"' : '';
  if (question.atsakyta === 'darbai') {
    const field = question.laukai[0];
    return `<fieldset class="field question calculator" id="question-${question.id}"><legend id="title-${question.id}"${long}>${title}</legend>${note('help', field, question.pagalba)}${question.pavyzdziai ? `<p class="field-example">${esc(question.pavyzdziai)}</p>` : ''}${jobsHTML(field)}</fieldset>`;
  }
  const only = question.laukai.length === 1 && question.laukai[0].tipas === 'tekstas' && !question.laukai[0].etikete ? question.laukai[0] : null;
  if (only) return `<div class="field question" id="question-${question.id}"><label for="q-${only.raktas}" id="title-${question.id}"${long}>${title}${requiredMark(only)}</label>${note('help', only, question.pagalba || only.pagalba)}${note('example', only, example(only))}${textControl(only, '')}</div>`;
  let previousGroup = '';
  const fields = question.laukai.map(field => { const html = fieldHTML(field, question, previousGroup); previousGroup = field.grupe || ''; return html; }).join('');
  return `<fieldset class="field question" id="question-${question.id}"><legend id="title-${question.id}"${long}>${title}</legend>${question.pagalba ? `<p class="field-help">${esc(fill(question.pagalba))}</p>` : ''}${fields}</fieldset>`;
}
function renderQuestionnaire() {
  $('#questionnaire-intro').textContent = fill(roleInfo().ivadas);
  $('#panels').innerHTML = `<section class="panel" id="panel-${role()}">${klausimynoKlausimai(role()).map(q => `<div class="fields">${renderQuestion(q)}</div>`).join('')}</section>`;
  $('#save-status').textContent = storageOK ? UI.local : UI.storageError;
  firstJobKey = firstJobSignature();
  updateCalculator();
  $$('#panels textarea').forEach(grow);
}
let firstJobKey = '';
function firstJobSignature() { return JSON.stringify(darbuPavadinimai(state.answers.darbai)); }
function updateFirstJob(force = false) {
  const found = klausimynoLaukas('pirmas');
  if (!found || !$('#first-job')) return;
  const signature = firstJobSignature();
  if (force || signature !== firstJobKey) $('#first-job').innerHTML = firstJobHTML(found.laukas, found.klausimas);
  firstJobKey = signature;
  const chain = klausimynoLaukas('gPradzia');
  if (chain && $(`#title-${chain.klausimas.id}`)) $(`#title-${chain.klausimas.id}`).textContent = questionTitle(chain.klausimas);
}
function updateConditional() {
  $$('[data-conditional]').forEach(element => { element.hidden = !laukasRodomas(klausimynoLaukas(element.dataset.conditional).laukas, state.answers); });
}
function grow(element) { element.style.height = 'auto'; element.style.height = Math.max(100, element.scrollHeight + 2) + 'px'; }
function updateProgress() {
  const count = atsakytuSkaicius(state.answers, role());
  $('#progress').max = count.viso; $('#progress').value = count.n;
  $('#progress-text').textContent = UI.answeredCount.replace('{n}', count.n).replace('{viso}', count.viso);
  updateFlow();
  if (!$('#finish').hidden) renderFinish();
}
// Šoninė schema užsidega dalimis, kai atsiranda atitinkami atsakymai.
const FLOW_KEYS = {
  vadovas: {darbai: ['skyriai'], pirmas: ['metai', 'brangiausi'], aprasymas: ['neuzdirba', 'dalyviai', 'pradzia']},
  skyrius: {darbai: ['darbai'], pirmas: ['pirmas'], aprasymas: ['gPradzia', 'gZingsniai', 'gSprendimai']},
  it: {darbai: ['itVardas'], pirmas: ['pastas', 'sistemos'], aprasymas: ['taisykles', 'itPagalba']}
};
function updateFlow() {
  const keys = FLOW_KEYS[role()];
  for (const part of Object.keys(keys)) {
    const on = keys[part].some(k => { const v = state.answers[k]; return k === 'darbai' ? darbuPavadinimai(v).length > 0 : !reiksmeTuscia(v); });
    $(`#flow-${part}`)?.classList.toggle('is-on', on);
  }
}
function updateCalculator() {
  if (!$('#chart')) { updateFirstJob(); return; }
  const jobs = state.answers.darbai, ranked = rankedJobs(jobs), total = totalHours(jobs);
  $('#total-hours').textContent = number(total);
  $('#mobile-total-hours').textContent = number(total);
  $$('#table-darbai [inputmode=decimal]').forEach(input => {
    const invalid = input.value.trim() !== '' && !validNumber(input.value);
    input.setAttribute('aria-invalid', String(invalid));
    if (invalid) input.setAttribute('title', UI.decimalHint); else input.removeAttribute('title');
  });
  $('#chart').innerHTML = ranked.length ? ranked.map(job => `<div class="chart-row"><div class="chart-label"><span>${esc(job.name)}</span><span>${number(job.hours)} ${UI.hours}</span></div><div class="bar-track"><div class="bar-fill"></div></div></div>`).join('') : `<p class="chart-empty">${UI.chartEmpty}</p>`;
  $$('#chart .bar-fill').forEach((bar, i) => { bar.style.width = `${ranked[0].hours ? ranked[i].hours / ranked[0].hours * 100 : 0}%`; });
  $('#chart').setAttribute('aria-label', UI.calculator + ': ' + (ranked.length ? ranked.map(j => `${j.name}: ${number(j.hours)} ${UI.hours}`).join('; ') : UI.chartEmpty));
  suggestionName = ranked[0]?.name.trim() || '';
  $('#suggestion-area').hidden = !suggestionName;
  $('#suggestion').textContent = UI.use.replace('{name}', suggestionName);
  updateFirstJob();
}
function addRow(raktas) {
  const field = klausimynoLaukas(raktas).laukas, rows = state.answers[raktas];
  if (rows.length >= field.eiluciu) return;
  rows.push(field.tipas === 'darbai' ? blankJob() : blankRow(field));
  const block = $(`#table-${raktas}`);
  if (field.tipas === 'darbai') block.outerHTML = jobsHTML(field).split('<aside')[0];
  else block.outerHTML = tableHTML(field);
  const first = field.tipas === 'darbai' ? $(`#job-${rows.length - 1}-name`) : $(`#cell-${raktas}-${rows.length - 1}-0`);
  first?.focus();
  updateCalculator();
  save();
}
function fieldLabel(field, question) { return !field.etikete ? questionTitle(question) : (field.grupe ? field.grupe + ' ' : '') + fill(field.etikete); }
function renderMissing(focus = false) {
  const missing = trukstamiLaukai(state.answers, role()), box = $('#missing'), hint = $('#required-hint');
  hint.textContent = roleInfo().privalomi;
  hint.hidden = submitAttempted || !missing.length;
  if (!missing.length || !submitAttempted) { box.hidden = true; box.innerHTML = ''; box.dataset.markup = ''; return missing; }
  const markup = `<p>${UI.missingTitle}</p><ul>${missing.map(field => { const found = klausimynoLaukas(field.raktas); return `<li><a href="#question-${found.klausimas.id}" data-missing="${field.raktas}">${esc(fieldLabel(field, found.klausimas).replace(/^\d+\.\s*/, ''))}</a></li>`; }).join('')}</ul>`;
  if (box.dataset.markup !== markup) { box.innerHTML = markup; box.dataset.markup = markup; }
  box.hidden = false;
  if (focus) box.querySelector('a').focus();
  return missing;
}
function renderFinish(focusMissing = false) {
  const count = atsakytuSkaicius(state.answers, role());
  $('#answered-count').textContent = UI.answeredCount.replace('{n}', count.n).replace('{viso}', count.viso);
  $('#edited-note').textContent = LINK_MODE && state.changedAfterSend ? UI.edited : '';
  return renderMissing(focusMissing);
}
let pendingFocus = null;
function focusField(key) {
  const field = klausimynoLaukas(key)?.laukas;
  if (!field) return false;
  const target = ['vienas', 'keli'].includes(field.tipas) || (field.tipas === 'darbas' && darbuPavadinimai(state.answers.darbai).length) ? $(`#q-${key}-0`) : $(`#q-${key}`);
  if (!target) return false;
  target.focus({preventScroll: true});
  target.scrollIntoView({block: 'center'});
  return true;
}
function route(moveFocus = false) {
  const hash = location.hash.slice(1);
  let view = hash === 'baigta' ? hash : hash === 'klausimynas' ? 'klausimynas' : currentView;
  if (view === 'baigta' && !state.sentAt && LINK_MODE) view = 'klausimynas';
  currentView = view;
  const inQuestionnaire = view !== 'baigta';
  $('.questionnaire-header').hidden = !inQuestionnaire;
  $('#questionnaire-intro').hidden = !inQuestionnaire;
  $('#panels').hidden = !inQuestionnaire;
  $('#klausimynas').classList.toggle('is-done', !inQuestionnaire);
  $('#finish').hidden = !inQuestionnaire;
  $('#done').hidden = inQuestionnaire;
  if (inQuestionnaire) { renderFinish(); $$('#panels textarea').forEach(grow); }
  else { $('#done-note').textContent = LINK_MODE ? fill(UI.sent.replace('{data}', formatSentDate(state.sentAt))) : UI.done; updateProgress(); }
  const focusKey = pendingFocus; pendingFocus = null;
  if (inQuestionnaire && focusKey && focusField(focusKey)) return;
  if (moveFocus && (hash === 'klausimynas' || hash === 'baigta')) {
    $(inQuestionnaire ? '#questionnaire-title' : '#done-title').focus({preventScroll: true});
    $('#klausimynas').scrollIntoView({block: 'start'});
  }
}
function go(view) { if (location.hash === `#${view}`) route(true); else location.hash = view; }
function exportText() {
  return [roleInfo().pavadinimas, `${CONFIG.vardas}, ${CONFIG.imone}`, `${UI.presentation}: ${CONFIG.data}`, '', atsakymaiTekstu(state.answers, role(), fill)].join('\n');
}
function download() {
  try {
    const blob = new Blob(['﻿', exportText()], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `${ZENKLAS.vardas}-klausimynas-${role()}.txt`; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch { $(currentView === 'baigta' ? '#done-note' : '#send-message').textContent = UI.downloadError; }
}
function formatSentDate(value) {
  return new Intl.DateTimeFormat('lt-LT', {timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}).format(new Date(value));
}
function contactText(text) {
  const link = `<a href="mailto:${esc(CONFIG.kontaktas.pastas)}">${esc(CONFIG.kontaktas.pastas)}</a>`;
  return text.split('{KONTAKTAS_PASTAS}').map(part => esc(fill(part))).join(link);
}
function showLinkState(kind) {
  if (kind === 'expired') { try { localStorage.removeItem(STORAGE_KEY); } catch (_) {} }
  $('#pradzia').hidden = true; $('.topbar').hidden = true; $('#footer').hidden = true;
  const content = kind === 'loading' ? `<p>${UI.loading}</p>` : kind === 'expired' ? `<h1>${UI.expiredTitle}</h1><p>${UI.expiredNote}</p>` : `<p>${UI.loadError}</p><button type="button" class="primary" id="load-retry">${UI.retry}</button>`;
  $('#link-state').hidden = false; $('#link-state').innerHTML = content;
  if (kind === 'error') $('#load-retry').addEventListener('click', start);
}
async function requestJSON(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.method === 'POST' ? 45000 : 15000);
  try {
    const response = await fetch(url, {...options, signal: controller.signal, referrerPolicy: 'no-referrer'});
    if (!response.ok) throw new Error('network');
    return await response.json();
  } finally { clearTimeout(timer); }
}
function configValid(c) {
  return c && ['imone', 'vardas', 'role', 'data', 'terminas'].every(k => typeof c[k] === 'string') && KLAUSIMYNAS.roles[c.role] &&
    c.kontaktas && ['vardas', 'pastas', 'telefonas'].every(k => typeof c.kontaktas[k] === 'string');
}
async function start() {
  try { isvalytiKopijas(localStorage); } catch (_) {}
  if (LINK_MODE) {
    showLinkState('loading');
    try {
      if (!ENDPOINT) throw new Error('endpoint');
      const result = await requestJSON(ENDPOINT + (ENDPOINT.includes('?') ? '&' : '?') + 'k=' + encodeURIComponent(LINK_CODE));
      if (result.klaida === 'nebegalioja') { showLinkState('expired'); return; }
      if (!result.ok || !configValid(result.config)) throw new Error('config');
      CONFIG = {...CONFIG, ...result.config, kontaktas: {...CONFIG.kontaktas, ...result.config.kontaktas}};
      FIELDS = configFields(CONFIG);
      STORAGE_KEY = KOPIJOS_PRIESDELIS + LINK_CODE;
      serverSentAt = result.pateikta || null;
    } catch { showLinkState('error'); return; }
  } else {
    const demo = PARAMS.get('demo');
    if (KLAUSIMYNAS.roles[demo]) CONFIG.role = demo;
    FIELDS = configFields(CONFIG);
  }
  loadLocalState();
  $('#link-state').hidden = true;
  $('#pradzia').hidden = false; $('.topbar').hidden = false; $('#footer').hidden = false;
  $('#submission-note').innerHTML = LINK_MODE ? contactText(UI.privacy) : esc(UI.demoNotice);
  $('#already-sent').textContent = LINK_MODE && serverSentAt && !hasLocalAnswers() ? UI.alreadySent.replace('{data}', formatSentDate(serverSentAt)) : '';
  initializePage();
}
function hasLocalAnswers() { return Object.keys(pateikiamiAtsakymai(state.answers, role())).length > 0; }
function finishSubmission() {
  clearTimeout(saveTimer);
  try { writeLocal(); storageOK = true; } catch { storageOK = false; }
  $('#save-status').textContent = storageOK ? UI.saved : UI.storageError;
  go('baigta');
}
function pateikimoID() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID().replace(/-/g, '');
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('');
}
async function submitAnswers() {
  if (sending) return;
  submitAttempted = true;
  if (renderFinish(true).length) return;
  if (!LINK_MODE) { state.sentAt = new Date().toISOString(); finishSubmission(); return; }
  sending = true; sendFailed = false;
  $('#submit').disabled = true; $('#submit').textContent = UI.sending;
  $('#send-retry').hidden = true; $('#send-message').textContent = '';
  const snapshot = JSON.stringify(state);
  const payload = JSON.stringify({k: LINK_CODE, state: submissionState(JSON.parse(snapshot)), id: pateikimoID(), pakeista: state.pakeista});
  try {
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await requestJSON(ENDPOINT, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: payload});
        if (result.klaida === 'uzimta' || result.klaida === 'klaida') throw new Error('Nepavyko išsiųsti.');
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise(resolve => setTimeout(resolve, attempt === 0 ? 1000 : 3000));
      }
    }
    if (result.klaida === 'nebegalioja') { showLinkState('expired'); return; }
    if (!result.ok) { sendFailed = true; $('#send-message').innerHTML = result.klaida === 'per_daug' ? esc(UI.tooMany) : contactText(UI.sendError); return; }
    const changed = JSON.stringify(state) !== snapshot;
    state.sentAt = result.pateikta;
    state.changedAfterSend = changed;
    if (changed) { save(false); renderFinish(); } else finishSubmission();
  } catch {
    sendFailed = true; $('#send-message').innerHTML = contactText(UI.sendError);
  } finally {
    sending = false; $('#submit').disabled = false; $('#submit').innerHTML = UI.submit + ' ' + icon('arrow-right');
    $('#send-retry').hidden = !sendFailed;
    $('#finish-download').hidden = !sendFailed;
  }
}
function contactHTML() {
  const c = CONFIG.kontaktas;
  const phone = /^\+?[0-9 ]+$/.test(c.telefonas) ? `<a href="tel:${esc(c.telefonas.replace(/\s/g, ''))}">${esc(c.telefonas)}</a>` : esc(c.telefonas);
  return `<p class="footer-contact"><strong>${esc(UI.thanks)}</strong> ${esc(fill(UI.questions))}<a href="mailto:${esc(c.pastas)}">${esc(c.pastas)}</a>${phone ? ', ' + phone : ''}.</p>`;
}
function renderHero() {
  const info = roleInfo();
  $('#page-title').innerHTML = info.antraste;
  $('.promise').textContent = fill(info.pazadas);
  $('#uses').innerHTML = `<p class="flow-caption">${UI.usedFor}</p><ul class="uses">${UI.uses.map(u => `<li>${icon('check')}<span>${esc(u)}</span></li>`).join('')}</ul>`;
  $('#dates').innerHTML = [[UI.presentation, CONFIG.data], [UI.deadline, CONFIG.terminas], [UI.duration, info.trukme]].map(([label, value]) => `<div class="date-row"><dt>${esc(label)}</dt><dd><span class="date-value">${esc(value)}</span></dd></div>`).join('');
}
function initializePage() {
  document.title = `${roleInfo().pavadinimas} · ${CONFIG.imone}`;
  $('#person').textContent = `${CONFIG.vardas}, ${CONFIG.imone}`;
  $('#footer').innerHTML = contactHTML() + `<p class="footer-legal">${esc(ZENKLAS.poraste)}<a href="${esc(ZENKLAS.salygos)}" target="_blank" rel="noopener noreferrer">${esc(ZENKLAS.salyguNuoroda)}</a></p>`;
  $('.brand').setAttribute('aria-label', fill(UI.home));
  $('.brand img').setAttribute('alt', ZENKLAS.vardas);
  renderHero(); renderQuestionnaire();
  $$('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  updateProgress(); route(Boolean(location.hash));
  try { writeLocal(); storageOK = true; } catch { storageOK = false; }
  $('#save-status').textContent = storageOK ? UI.saved : UI.storageError;
  document.addEventListener('input', event => {
    const input = event.target;
    if (input.matches('[data-answer]')) {
      const key = input.dataset.answer, field = klausimynoLaukas(key)?.laukas;
      if (!field) return;
      if (field.tipas === 'skaicius' && /\D/.test(input.value)) input.value = input.value.replace(/\D/g, '');
      state.answers[key] = input.value;
      if (input.tagName === 'TEXTAREA') grow(input);
      if (key === 'pirmas') updateFirstJob();
      save();
    }
    if (input.matches('[data-job]')) {
      const index = Number(input.dataset.job);
      if (input.dataset.key === 'name') renameFirstJob(state, index, input.value);
      else state.answers.darbai[index][input.dataset.key] = input.value;
      updateCalculator(); save();
    }
    if (input.matches('[data-cell]')) {
      const rows = state.answers[input.dataset.cell];
      if (rows?.[Number(input.dataset.row)]) { rows[Number(input.dataset.row)][Number(input.dataset.col)] = input.value; save(); }
    }
  });
  document.addEventListener('change', event => {
    const input = event.target;
    if (input.matches('[data-choice]')) {
      const key = input.dataset.choice, field = klausimynoLaukas(key)?.laukas;
      if (!field) return;
      if (field.tipas === 'keli') {
        const chosen = $$(`[data-choice="${key}"]`).filter(box => box.checked).map(box => box.value);
        state.answers[key] = field.pasirinkimai.filter(choice => chosen.includes(choice));
      } else state.answers[key] = input.value;
      if (key === 'pirmas') updateFirstJob();
      updateConditional(); save();
    }
  });
  document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    if (add) { addRow(add.dataset.add); return; }
    if (event.target.closest('#suggestion')) {
      if (!suggestionName) return;
      state.answers.pirmas = suggestionName; updateFirstJob(true); save();
      $('#suggestion-status').textContent = UI.suggestedDone; $('#q-kodel')?.focus();
      return;
    }
    if (event.target.closest('[data-start-questionnaire]')) { event.preventDefault(); go('klausimynas'); }
    const missingLink = event.target.closest('[data-missing]');
    if (missingLink) { event.preventDefault(); pendingFocus = missingLink.dataset.missing; go('klausimynas'); }
  });
  $('#submit').addEventListener('click', submitAnswers);
  $('#send-retry').textContent = UI.retry;
  $('#send-retry').addEventListener('click', submitAnswers);
  $('#finish-download').textContent = UI.download;
  $('#finish-download').addEventListener('click', download);
  $('#download').addEventListener('click', download);
  window.addEventListener('storage', event => { if (event.key !== STORAGE_KEY) return; loadLocalState(); renderQuestionnaire(); updateProgress(); route(); });
  window.addEventListener('hashchange', () => route(true));
  window.addEventListener('resize', () => $$('#panels textarea').forEach(grow));
  if (window.visualViewport) {
    const viewport = window.visualViewport;
    const updateKeyboardInset = () => $('#panels').style.setProperty('--keyboard-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);
    updateKeyboardInset();
  }
}
start();
