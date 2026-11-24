/* Partner Quest · interactive prototype · demo data only */
/* the artifact host puts page styles inside <body>; move them to <head> so re-rendering body keeps them */
document.querySelectorAll('body style, body link[rel=stylesheet]').forEach(e => document.head.appendChild(e));
/* the artifact host's CSP ignores style="" attributes from markup; re-apply them through CSSOM, which it allows */
const applyInline = root => { if (root.nodeType !== 1) return; const els = root.matches('[style]') ? [root, ...root.querySelectorAll('[style]')] : [...root.querySelectorAll('[style]')]; els.forEach(e => { const v = e.getAttribute('style'); if (!v || e.__st === v) return; e.__st = v; let depth = 0, cur = '', parts = []; for (const ch of v) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ';' && !depth) { parts.push(cur); cur = ''; } else cur += ch; } parts.push(cur); parts.forEach(d => { const i = d.indexOf(':'); if (i < 0) return; const k = d.slice(0, i).trim(), val = d.slice(i + 1).trim(), imp = /!important$/.test(val); if (k) e.style.setProperty(k, val.replace(/!important$/, '').trim(), imp ? 'important' : ''); }); }); };
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(applyInline))).observe(document.documentElement, { childList: true, subtree: true });
{ const d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML'); Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); applyInline(this); } }); }
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const I = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24">${(window.ICONS || {})[n] || ''}</svg>`;
const COIN = (c = '') => `<span class="coin ${c}"></span>`;
const fmt = n => n.toLocaleString('en-US');
const toTop = () => { const m = $('.main'); if (m && m.scrollTop > 0) m.scrollTo({ top: 0, behavior: 'smooth' }); };
const IMG = 'img/';

/* ------------------------------------------------------------ data */
const LEVELS = [0, 1000, 2000, 3000, 4000, 5000];
const GIFTS = ['Digital badge for LinkedIn', 'Certificate + Kaspersky sticker pack', 'Merch of your choice: tee, mug or tote', 'Course voucher or laptop backpack', 'Session with Kaspersky experts + merch box'];
const LVNAMES = { pv: ['Orbit', 'Descent', 'Landing', 'Base', 'Beacon'], he: ['Recruit', 'Guard', 'Specialist', 'Champion', 'Legend'] };
const ROLES = { sales: 'Sales', presales: 'Pre-sales', marketing: 'Marketing' };
const PEOPLE = { sales: ['Arjun Mehta', 'Sales Manager', 'AM'], presales: ['Priya Nair', 'Pre-sales Engineer', 'PN'], marketing: ['Rohan Kapoor', 'Marketing Manager', 'RK'] };
const QUESTS = {
  sales: [
    { id: 's1', t: 'Register a deal on the portal', d: 'Add the opportunity for Kaspersky XDR to the deal registration form.', b: 200, ic: 'briefcase', tag: 'Deal' },
    { id: 's2', t: 'Sales course: Kaspersky XDR', d: '25-minute course with a short quiz at the end.', b: 100, ic: 'school', tag: 'Learning' },
    { id: 's3', t: 'Request a demo with your pre-sales', d: 'Book a joint demo for a client.', b: 100, ic: 'users', tag: 'Team' },
    { id: 's4', t: 'Pass the sales certification', d: 'Kaspersky sales certification, online, 40 minutes.', b: 300, ic: 'certificate', tag: 'Certification' }],
  presales: [
    { id: 'p1', t: 'Run a client demo of XDR', d: 'Show XDR to a client and log the demo. Completes the team mission.', b: 200, ic: 'cpu', tag: 'Team mission', mission: true },
    { id: 'p2', t: 'Webinar + test: KUMA SIEM', d: 'Live technical webinar, 10-question test after.', b: 50, ic: 'school', tag: 'Learning' },
    { id: 'p3', t: 'Practicum module: EDR', d: 'Hands-on lab in the training environment.', b: 100, ic: 'target', tag: 'Learning' },
    { id: 'p4', t: 'XDR certification', d: 'Professional technical certification.', b: 300, ic: 'certificate', tag: 'Certification' }],
  marketing: [
    { id: 'm1', t: 'Download the XDR co-marketing kit', d: 'Ready-made emails, banners and a landing page.', b: 30, ic: 'package', tag: 'Marketing' },
    { id: 'm2', t: 'Apply for MDF', d: 'Submit a campaign plan to use the Marketing Development Fund.', b: 100, ic: 'speakerphone', tag: 'MDF' },
    { id: 'm3', t: 'Launch an MDF campaign', d: 'Start the approved campaign and attach the first report.', b: 300, ic: 'rocket', tag: 'MDF' },
    { id: 'm4', t: 'Process MQL leads on time', d: 'Handle new leads within 48 hours.', b: 200, ic: 'bolt', tag: 'Leads' }]
};
/* 4 zones x 3 objects, opened in order by the team season total */
const ZONES = {
  basecamp: { n: 'Basecamp', pad: [0.308, 0.206], objs: [['command', 'Command center', 0], ['hangar', 'Hangar', 500], ['power', 'Power station', 1200]] },
  network: { n: 'Network', pad: [0.70, 0.206], objs: [['antenna', 'Antenna', 2000], ['beacon', 'Relay', 3000], ['dome', 'Shield dome', 4000]] },
  exploration: { n: 'Exploration', pad: [0.708, 0.442], objs: [['lab', 'Science station', 5000], ['tower', 'Watch tower', 6000], ['rover', 'Rover', 7500]] },
  garden: { n: 'Cyber Garden', pad: [0.30, 0.442], objs: [['sprout', 'First sprouts', 9000], ['biodome', 'Biodome', 10500], ['tree', 'Glowing forest', 12000]] }
};
const ALLOBJ = Object.entries(ZONES).flatMap(([z, v]) => v.objs.map(([k, n, t]) => ({ k, n, t, z })));
const OBJ = k => ALLOBJ.find(o => o.k === k);
const builtIn = z => ZONES[z].objs.filter(o => S.team >= o[2]);
const nextObj = () => ALLOBJ.find(o => S.team < o.t);
const BW = {"command":0.23,"hangar":0.24,"power":0.2,"beacon":0.092,"antenna":0.23,"dome":0.22,"sprout":0.17,"biodome":0.22,"tree":0.19,"rover":0.19,"lab":0.22,"tower":0.104};
const CRATERS = [[0.47, 0.13], [0.165, 0.32], [0.845, 0.335], [0.555, 0.53]];
const HEROES = {
  guardian: { n: 'Guardian', p: 'Kaspersky XDR', pw: 'Sees the whole attack and stops it', fit: 'Mid-size and large business',
    tags: [['target', 'Sees the whole attack'], ['bolt', 'Responds automatically'], ['users', 'Less work for IT']], st: [95, 90, 75] },
  watcher: { n: 'Watcher', p: 'KUMA · SIEM', pw: 'Sees every signal in one place', fit: 'Companies with a security team',
    tags: [['antenna-bars-5', 'All signals, one view'], ['certificate', 'Ready for audits'], ['rocket', 'Grows with the client']], st: [90, 60, 70] },
  hunter: { n: 'Hunter', p: 'Kaspersky EDR', pw: 'Finds the threat on every device', fit: 'Teams that need deep visibility',
    tags: [['target', 'Finds the root cause'], ['lock', 'Isolates in one click'], ['shield-check', 'Uses the same agent']], st: [85, 85, 70] },
  oracle: { n: 'Oracle', p: 'Threat Intelligence', pw: 'Knows about threats in advance', fit: 'Security teams and MSSPs',
    tags: [['sparkles', 'Fresh threat data'], ['info-circle', 'Context for every alert'], ['flag', 'Focus on what matters']], st: [80, 55, 65] },
  ranger: { n: 'Ranger', p: 'Hybrid Cloud Security', pw: 'Guards workloads in any cloud', fit: 'Companies moving to the cloud',
    tags: [['planet', 'Any cloud, one console'], ['rocket', 'No slowdown for servers'], ['package', 'Protects containers too']], st: [80, 75, 85] },
  mentor: { n: 'Mentor', p: 'Security Awareness', pw: 'Turns employees into a human firewall', fit: 'Any company with staff',
    tags: [['school', 'Short lessons'], ['star', 'Game-style training'], ['users', 'Fewer human errors']], st: [60, 50, 95] },
  titan: { n: 'Titan', p: 'Industrial CyberSecurity', pw: 'Protects factories and power plants', fit: 'Industry, energy, transport',
    tags: [['building', 'Built for industrial networks'], ['lock', 'Safe for live equipment'], ['certificate', 'Meets industry rules']], st: [85, 80, 60] },
  shield: { n: 'Shield', p: 'Endpoint Security', pw: 'Protects every device first', fit: 'Any company, any size',
    tags: [['shield-check', 'Every device covered'], ['bolt', 'Light and fast'], ['planet', 'Managed from the cloud']], st: [80, 70, 95] }
};
const STATS = ['Detect', 'Respond', 'Easy to run'];
/* the frame grows with experience, the art stays */
const FRAMES = [['base', 'Base', 0], ['silver', 'Silver', 5], ['gold', 'Gold', 12], ['hologram', 'Hologram', 20]];
const frameOf = xp => FRAMES.filter(f => xp >= f[2]).pop();
const nextFrame = xp => FRAMES.find(f => xp < f[2]);
const packArt = (cls = '') => `<div class="packart ${cls}"><img src="${IMG}h_pack.webp" alt=""><img class="logo-on" src="${IMG}logo.png" alt=""></div>`;
const cap = t => t[0].toUpperCase() + t.slice(1);
const rchip = (t, cls = '') => `<span class="rchip ${cls}">${t}</span>`;
const NEXT = { n: 'Phishing', img: 'v_phish', when: 'Monday', weak: [['school', 'Trains people'], ['sparkles', 'Knows fake sites'], ['shield-check', 'Protects every device']] };
const THREAT = { n: 'Ransomware', img: 'v_ransom', atk: [['briefcase', 'Comes in a fake invoice'], ['cpu', 'Spreads to other computers'], ['lock', 'Locks files, asks for money']], weak: [['target', 'Sees the whole attack'], ['bolt', 'Responds fast'], ['shield-check', 'Protects every device']], good: ['guardian', 'hunter', 'shield'],
  why: { guardian: 'XDR sees the whole chain of the attack and stops it', hunter: 'EDR finds and isolates the infected device', shield: 'Endpoint Security blocks the encryptor on the device', watcher: 'SIEM spots the signals, but does not stop encryption by itself', oracle: 'Threat Intelligence warns in advance, but does not block the attack', ranger: 'Cloud protection helps only if the attack hits cloud servers', mentor: 'Training helps people avoid the trap, but does not stop encryption', titan: 'Industrial protection is for factory networks, not office laptops' } };
/* team votes of the other roles this week: [defender, votes for it, voters] */
const VOTES = { sales: ['shield', 3, 5], presales: ['hunter', 4, 6], marketing: ['mentor', 3, 5] };
const COMPANIES = [['CyberNet Integrators', 4120], ['SecureEdge MSP', 3890], ['Trident Infotech', 3610], ['Alpha Systems Pvt Ltd', 3450, 1], ['Nova IT Solutions', 3240], ['Bluepeak Networks', 2980], ['Sahyadri Systems', 2710]];

/* ------------------------------------------------------------ state */
let S;
function reset(concept) {
  S = { concept, role: 'sales', season: 1480, team: 3450, done: {}, week: [1, 1, 1, 0, 0], today: 3,
    mission: { marketing: true, sales: true, presales: false }, decos: [], shown: [],
    capsuleDone: false, stormDone: false, heroes: {}, packs: 2, threatDone: false, lastFight: null, trophies: [], page: 'home', onboarded: false };
  S.shown = ALLOBJ.filter(o => S.team >= o.t).map(o => o.k);
}
function demoHeroes() {
  S.heroes = { guardian: { xp: 6 }, watcher: { xp: 2 }, shield: { xp: 21 }, hunter: { xp: 13 }, oracle: { xp: 1 }, ranger: { xp: 0 }, mentor: { xp: 3 }, titan: { xp: 0 } };
  S.packs = 1;
}
const level = () => { let l = 0; LEVELS.forEach((t, i) => { if (S.season >= t) l = i; }); return Math.max(1, Math.min(5, l)); };
const lvlName = l => LVNAMES[S.concept][l - 1];
const nextT = () => LEVELS[Math.min(5, level() + 1)] || 5000;
const lvlPct = () => { const l = level(); if (l >= 5) return 100; const a = LEVELS[l], b = LEVELS[l + 1]; return Math.round((S.season - a) / (b - a) * 100); };

/* ------------------------------------------------------------ picker */
function picker() {
  document.body.innerHTML = `
  <div id="picker">
    <div class="top"><img src="${IMG}logo.png" alt="kaspersky"><h1>Partner Quest</h1><p>Interactive prototype of the game layer for Kaspersky United Partner Portal. Pick a concept.</p></div>
    <div class="pick-row">
      <button class="pick" data-c="pv"><div class="art" style="background-image:url(${IMG}pv_space.webp)"></div>
        <img src="${IMG}pv_planet.webp" style="position:absolute;left:50%;top:44%;width:72%;transform:translate(-50%,-50%)">
        <div class="shade"></div><div class="num"><span class="chip g">Concept 1</span></div><div class="txt"><b>Partnerverse</b><span>Your team lands on its own planet and builds it during the season</span></div></button>
      <button class="pick" data-c="he"><div class="art" style="background-image:url(${IMG}h_arena.webp)"></div>
        <img src="${IMG}h_guardian.webp" style="position:absolute;left:50%;top:0;height:92%;transform:translateX(-50%);mask:linear-gradient(180deg,#000 60%,transparent);-webkit-mask:linear-gradient(180deg,#000 60%,transparent)">
        <div class="shade"></div><div class="num"><span class="chip g">Concept 2</span></div><div class="txt"><b>Kaspersky Defenders</b><span>Kaspersky products become defenders. Collect them, grow them with real work, beat the threat of the week</span></div></button>
    </div>
    <p class="muted" style="font-size:12px">Demo data. No real accounts or client information.</p>
  </div>`;
  $$('.pick').forEach(b => b.onclick = () => { reset(b.dataset.c); sso(); });
}

/* ------------------------------------------------------------ SSO */
function sso() {
  const bg = S.concept === 'pv' ? 'pv_space' : 'h_arena';
  const [nm, ttl, av] = PEOPLE[S.role];
  document.body.innerHTML = `<div id="sso"><div class="bgimg" style="background-image:url(${IMG}${bg}.webp)"></div>
    <div class="box"><img class="lg" src="${IMG}logo.png" alt="kaspersky">
      <h2>Sign in to United Partner Portal</h2><p class="muted" style="margin-top:8px">Single sign-on with your company account</p>
      <div class="who"><div class="ava">${av}</div><div><b>${nm}</b><div class="muted" style="font-size:12px">${ttl} · Alpha Systems Pvt Ltd</div></div></div>
      <button class="btn pri big" style="width:100%;justify-content:center" id="go">Continue with SSO ${I('arrow-right', 's')}</button>
      <p class="muted" style="font-size:12px;margin-top:14px">Your role comes from your company CRM. You only see quests for your role.</p></div></div>`;
  gsap.from('#sso .box', { y: 30, opacity: 0, duration: .7, ease: 'power3.out' });
  $('#go').onclick = () => { shell(); S.concept === 'pv' ? go('world') : starterPack(); };
}

/* ------------------------------------------------------------ shell */
function shell() {
  const nav = S.concept === 'pv'
    ? [['home', 'home', 'Home'], ['world', 'planet', 'Planet'], ['rewards', 'gift', 'Rewards'], ['leaderboard', 'trophy', 'Leaderboard']]
    : [['home', 'home', 'Home'], ['world', 'cards', 'My defenders', 'Defenders'], ['threat', 'swords', 'Threat of the week', 'Threat'], ['rewards', 'gift', 'Rewards'], ['leaderboard', 'trophy', 'Leaderboard']];
  document.body.innerHTML = `
  <div id="app">
    <aside class="side"><img class="logo" src="${IMG}logo.png" alt="kaspersky"><div class="prog">United Partner Portal · ${S.concept === 'pv' ? 'Partnerverse' : 'Kaspersky Defenders'}</div>
      <nav class="nav">${nav.map(n => `<button data-p="${n[0]}">${I(n[1])}<span>${n[2]}</span><em class="sl">${n[3] || n[2]}</em></button>`).join('')}</nav>
      <div class="foot"><b>Alpha Systems Pvt Ltd</b>Season 1 · India pilot<div style="margin-top:10px;font-size:11px">Demo: switch role</div>
        <div class="role-sw">${Object.keys(ROLES).map(r => `<button data-r="${r}">${ROLES[r]}</button>`).join('')}</div></div>
    </aside>
    <header class="topbar"><div class="crumb" id="crumb"></div><div class="sp"></div>
      <div class="lvl" title="Season level"><span>Lv <b id="lvn"></b> · <span id="lvname"></span></span><div class="bar"><i id="lvbar"></i></div></div>
      <div class="bal" id="bal" title="Season points: they only add up">${COIN('l')}<span id="balv"></span><small>points</small></div>
      <button class="tb-swc" id="swc2" title="Change concept">${I('refresh', 's')}</button><div class="ava" id="ava"></div></header>
    <main class="main" id="main"></main>
  </div>
  <div class="scrim" id="scrim"><div class="modal" id="modal"></div></div>
  <div class="toast" id="toast"></div>
  <div class="pack-stage" id="stage"></div>
  <div class="demo-pill"><button id="swc">${I('refresh', 's')} Change concept</button></div>`;
  $$('.nav button').forEach(b => b.onclick = () => go(b.dataset.p));
  $$('.role-sw button').forEach(b => b.onclick = () => { S.role = b.dataset.r; hud(); go(S.page); toast(`${I('user')} Now viewing as ${PEOPLE[S.role][0]}, ${ROLES[S.role]}`); });
  $('#swc').onclick = picker; $('#swc2').onclick = picker;
  hud();
}
function hud() {
  $('#balv').textContent = fmt(S.season);
  $('#lvn').textContent = level(); $('#lvname').textContent = lvlName(level());
  $('#lvbar').style.width = lvlPct() + '%';
  $('#ava').textContent = PEOPLE[S.role][2];
  $$('.role-sw button').forEach(b => b.classList.toggle('on', b.dataset.r === S.role));
}
function go(p) {
  S.page = p;
  $$('.nav button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  const titles = { home: 'Home', world: S.concept === 'pv' ? 'Planet Alpha-7' : 'My defenders', threat: 'Threat of the week', rewards: 'Rewards', leaderboard: 'Leaderboard' };
  $('#crumb').textContent = titles[p];
  const m = $('#main'); m.scrollTop = 0;
  ({ home, world: S.concept === 'pv' ? planet : heroes, threat, rewards, leaderboard })[p](m);
  gsap.from('#main .page>*', { y: 16, opacity: 0, duration: .5, stagger: .05, ease: 'power2.out', clearProps: 'opacity,transform' });
}

/* ------------------------------------------------------------ modal / toast / coins */
function modal(html) { $('#modal').innerHTML = html; $('#scrim').classList.add('on'); $('#scrim').onclick = e => { if (e.target.id === 'scrim') closeModal(); }; }
function closeModal() { $('#scrim').classList.remove('on'); }
let tt; function toast(h) { const t = $('#toast'); t.innerHTML = h; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2600); }
function countTo(el, from, to) { const o = { v: from }; gsap.to(o, { v: to, duration: 1, ease: 'power2.out', onUpdate: () => el.textContent = fmt(Math.round(o.v)) }); }
function earn(n, fromEl, label) {
  const r = fromEl && fromEl.isConnected ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const t = $('#bal').getBoundingClientRect();
  for (let i = 0; i < 10; i++) {
    const c = document.createElement('div'); c.className = 'flycoin'; c.innerHTML = COIN('l');
    c.style.left = (r.left + r.width / 2 - 14) + 'px'; c.style.top = (r.top + r.height / 2 - 14) + 'px'; document.body.appendChild(c);
    gsap.timeline().to(c, { x: gsap.utils.random(-70, 70), y: gsap.utils.random(-90, -20), duration: .35, ease: 'power2.out', delay: i * .03 })
      .to(c, { x: t.left + 20 - (r.left + r.width / 2 - 14), y: t.top + 7 - (r.top + r.height / 2 - 14), scale: .6, duration: .6, ease: 'power2.in' })
      .call(() => c.remove());
  }
  const b0 = S.season, l0 = level(); S.season += n; S.team += n;
  setTimeout(() => {
    countTo($('#balv'), b0, S.season); gsap.fromTo('#bal', { boxShadow: '0 0 0 0 rgba(35,209,174,.7)' }, { boxShadow: '0 0 0 14px rgba(35,209,174,0)', duration: .8 });
    $('#lvbar').style.width = lvlPct() + '%'; $('#lvn').textContent = level(); $('#lvname').textContent = lvlName(level());
    const tc = $('#teamchip'); if (tc) tc.innerHTML = `${COIN()} Team ${fmt(S.team)}`;
    toast(`${COIN()} <span>+${n} points${label ? ' · ' + label : ''}</span>`);
    if (level() > l0) setTimeout(() => levelUp(level()), 700);
  }, 750);
}
function teamEarn(n, label) {
  S.team += n; const tc = $('#teamchip'); if (tc) tc.innerHTML = `${COIN()} Team ${fmt(S.team)}`;
  toast(`${I('users')} <span>+${n} team points${label ? ' · ' + label : ''}</span>`);
}
function levelUp(l) {
  modal(`<div style="text-align:center">${'<span class="chip gold">' + I('crown', 's') + ' Level up</span>'}
    <h2 style="font-size:34px">Level ${l} · ${lvlName(l)}</h2><p class="muted">Guaranteed gift unlocked${S.concept === 'he' ? ' + a defender pack' : ''}</p>
    <div class="card" style="margin:20px 0;display:flex;gap:14px;align-items:center;text-align:left">${I('gift', 'l')}<div><b class="disp">${GIFTS[l - 1]}</b><div class="sub">We will send it to your company address</div></div></div>
    <button class="btn pri big" onclick="closeModal()" style="width:100%;justify-content:center">Great</button></div>`);
  if (S.concept === 'he') S.packs += 1;
}

/* ------------------------------------------------------------ HOME */
function home(m) {
  const q = QUESTS[S.role];
  const pv = S.concept === 'pv';
  const ms = S.mission, mDone = Object.values(ms).every(Boolean);
  m.innerHTML = `<div class="page grid" style="grid-template-columns:2fr 1fr">
    <div class="hero-banner" style="grid-column:1/2">
      <div class="bgimg" style="background-image:url(${IMG}${pv ? 'pv_space' : 'h_arena'}.webp)"></div>
      ${pv ? `<img src="${IMG}pv_planet.webp" style="position:absolute;right:10px;top:50%;width:40%;transform:translateY(-50%)">`
           : `<div style="position:absolute;right:20px;bottom:0;top:10px;display:flex;gap:10px;align-items:flex-end">${['shield', 'guardian', 'watcher'].map((h, i) => `<img src="${IMG}h_${h}.webp" style="height:${i === 1 ? 100 : 82}%;border-radius:14px;mask:linear-gradient(180deg,#000 70%,transparent);-webkit-mask:linear-gradient(180deg,#000 70%,transparent)">`).join('')}</div>`}
      <div class="shade"></div>
      <span class="chip g">${I('flame', 's')} Season 1 · week 6 of 16</span>
      <h2 style="margin-top:12px">${pv ? 'Planet Alpha-7 is growing' : 'Your defenders are getting stronger'}</h2>
      <p>${pv ? `Every point of your team builds the planet. Next object: ${nextObj() ? nextObj().n : 'all built'}.` : 'Work with a product grows its defender. Threat of the week: Ransomware.'}</p>
      <div style="display:flex;gap:10px"><button class="btn pri" data-go="world">${pv ? 'Open planet' : 'Open my defenders'} ${I('arrow-right', 's')}</button>
      ${pv ? '' : `<button class="btn sec" data-go="threat">${I('swords', 's')} Fight the threat</button>`}</div>
    </div>
    <div class="card"><div class="sub">Your season points</div><div style="display:flex;align-items:center;gap:10px;margin:10px 0 4px">${COIN('l')}<span class="kpi" id="kb">${fmt(S.season)}</span></div>
      <div class="sub">Points only add up. They can't be bought, sold or spent. Each one also goes to your team.</div>
      <div style="margin:18px 0 8px;display:flex;justify-content:space-between;font-size:12px"><span>Level ${level()} · ${lvlName(level())}</span><span class="muted">${level() < 5 ? fmt(nextT()) + ' for level ' + (level() + 1) : 'Max level'}</span></div>
      <div class="progress"><i style="width:${lvlPct()}%"></i></div>
      <div class="sub" style="margin-top:10px">${level() < 5 ? 'Next gift: ' + GIFTS[level()] : 'All gifts unlocked'}</div></div>

    <div class="card" style="grid-column:1/2"><div style="display:flex;justify-content:space-between;align-items:center"><div><h3>Your quests</h3><div class="sub">For ${ROLES[S.role]} · ${PEOPLE[S.role][0]}</div></div><span class="chip">${I(S.role === 'sales' ? 'briefcase' : S.role === 'presales' ? 'cpu' : 'speakerphone', 's')} ${ROLES[S.role]} track</span></div>
      <div class="grid" style="gap:10px;margin-top:16px">${q.map(x => `<div class="quest ${S.done[x.id] ? 'done' : ''}" data-q="${x.id}"><div class="qi">${I(x.ic)}</div><div class="qt"><b>${x.t}</b><span>${x.tag}${x.mission ? ' · completes the team mission' : ''}</span></div><div class="rw">+${x.b} ${COIN()}</div><button class="btn ${S.done[x.id] ? 'ghost' : 'sec'}">${S.done[x.id] ? 'Done' : 'Start'}</button></div>`).join('')}</div></div>

    <div class="grid" style="gap:18px;align-content:start">
      <div class="card"><h3>Weekly rhythm</h3><div class="sub">3 active days out of 5 close the week: +30 and ${pv ? 'a weekly capsule' : 'a defender pack'}</div>
        <div class="week">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => `<span class="${S.week[i] ? 'on' : ''} ${i === S.today ? 'today' : ''}">${S.week[i] ? I('check', 's') : d}</span>`).join('')}</div>
        <div class="sub" style="margin-top:12px">${I('flame', 's')} Streak: 3 weeks · 4 in a row: +100</div></div>
      <div class="card mission"><span class="chip gold">${I('users', 's')} Team mission · all 3 roles</span><h3 style="margin-top:10px">Launch an XDR project</h3>
        <div class="roles">${['marketing', 'sales', 'presales'].map(r => `<div class="role ${ms[r] ? 'ok' : ''}"><b>${ROLES[r]}</b>${{ marketing: 'Campaign', sales: 'Deal', presales: 'Demo' }[r]}</div>`).join('')}</div>
        <div class="sub">${mDone ? (pv ? 'Done. The Observatory appeared on your planet.' : 'Done. Everyone in the team got a defender pack.') : 'Waiting for Pre-sales to run the demo.'}</div></div>
      <div class="card"><h3>Daily puzzle</h3><div class="sub">One question for all partners, one try per day</div>
        <button class="btn sec" style="margin-top:14px" id="puz">${I('target', 's')} Solve · +10</button></div>
    </div></div>`;
  $$('[data-go]', m).forEach(b => b.onclick = () => go(b.dataset.go));
  $$('.quest', m).forEach(el => el.querySelector('.btn').onclick = () => questModal(q.find(x => x.id === el.dataset.q), el));
  $('#puz').onclick = e => puzzle(e.currentTarget);
}
function questModal(x, el) {
  modal(`<span class="chip g">${I(x.ic, 's')} ${x.tag}</span><h2>${x.t}</h2><p class="muted">${x.d}</p>
    <div class="card" style="margin-top:18px;display:flex;align-items:center;gap:12px;padding:16px">${COIN('l')}<div><b class="disp" style="font-size:18px">+${x.b} points</b><div class="sub">The portal reports it to the game. Goes to your level and to your team.</div></div></div>
    <div class="acts"><button class="btn pri" id="qdo">${I('check', 's')} Mark as done (demo)</button><button class="btn ghost" onclick="closeModal()">Later</button></div>`);
  $('#qdo').onclick = () => {
    closeModal(); S.done[x.id] = true; el.classList.add('done'); el.querySelector('.btn').textContent = 'Done';
    if (!S.week[S.today]) { S.week[S.today] = 1; }
    if (x.mission) S.mission.presales = true;
    earn(x.b, el.querySelector('.rw'), x.mission ? 'team mission' : '');
    if (x.mission) setTimeout(() => missionDone(), 1700);
    else setTimeout(() => go('home'), 1900);
  };
}
function missionDone() {
  const pv = S.concept === 'pv';
  modal(`<div style="text-align:center"><span class="chip gold">${I('users', 's')} Team mission complete</span><h2 style="font-size:30px">Launch an XDR project</h2>
    <p class="muted">Marketing, Sales and Pre-sales each did their part.</p>
    ${pv ? `<img src="${IMG}pv_tower.webp" style="height:180px;margin:18px auto">` : `<div style="width:150px;margin:18px auto">${packArt()}</div>`}
    <p>${pv ? 'A special object for the whole team: <b>Observatory</b>' : 'Everyone in the team gets a <b>defender pack</b>'}</p>
    <button class="btn pri big" style="margin-top:18px;width:100%;justify-content:center" id="msok">${pv ? 'See it on the planet' : 'Open my defenders'}</button></div>`);
  if (pv) { if (!S.decos.includes('tower')) S.decos.push('tower'); } else S.packs += 1;
  $('#msok').onclick = () => { closeModal(); go('world'); };
}
function puzzle(btn) {
  modal(`<span class="chip g">${I('target', 's')} Daily puzzle</span><h2>A user got an email “Your invoice is attached” from an unknown sender. The file is invoice.pdf.exe. What is it most likely?</h2>
    <div class="grid" style="gap:8px;margin-top:16px">${['A normal PDF invoice', 'Phishing with a malicious file', 'A system update'].map((a, i) => `<button class="quest" data-a="${i}" style="text-align:left"><div class="qt"><b>${a}</b></div></button>`).join('')}</div>`);
  $$('#modal [data-a]').forEach(b => b.onclick = () => {
    const ok = b.dataset.a === '1'; b.style.borderColor = ok ? 'var(--green2)' : 'var(--red)';
    setTimeout(() => { closeModal(); if (ok) { earn(10, btn, 'daily puzzle'); btn.disabled = true; } else toast(`${I('info-circle')} Not quite. It is phishing: a double extension hides an .exe`); }, 500);
  });
}

/* ------------------------------------------------------------ PARTNERVERSE: planet */
let zoneTab = 'network';
const syncTabs = () => $$('.zone-tabs button').forEach(x => x.classList.toggle('on', x.dataset.z === zoneTab));
function planet(m) {
  m.innerHTML = `<div class="page" style="max-width:none;padding:28px"><div class="world" id="world">
    <div class="space" style="background-image:url(${IMG}pv_space.webp)"></div>
    <div class="planet-wrap" id="pw"><div class="planet" id="planet"><img class="base" src="${IMG}pv_planet.webp"></div></div>
    <img class="mascot" id="masc" src="${IMG}pv_mascot.webp">
    <div class="bubble" id="bub"></div>
    <div class="wpanel l"><div style="display:flex;justify-content:space-between;align-items:center"><b class="disp" style="font-size:16px">Planet progress</b><span class="chip g" id="teamchip">${COIN()} Team ${fmt(S.team)}</span></div>
      <div class="sub" style="font-size:12px;margin-top:4px">Objects open by themselves as the team total grows. Nothing to choose or buy.</div>
      <div class="zone-tabs">${Object.entries(ZONES).map(([k, z]) => `<button data-z="${k}" class="${k === zoneTab ? 'on' : ''}">${z.n}</button>`).join('')}</div>
      <div class="zinfo" id="zinfo"></div><div class="objs" id="objs"></div></div>
    <div class="wpanel b"><div class="team-av"><span>AM</span><span>PN</span><span>RK</span><span style="background:#2a3236">+4</span></div>
      <div style="flex:1"><b class="disp">Alpha Systems · 7 players</b><div class="sub" style="font-size:12px">Sales, Pre-sales and Marketing all active this week</div></div>
      <button class="btn sec storm" id="storm">${I('flame', 's')} <span>Phishing storm · Shield 3/4</span></button>
      <button class="btn pri" id="cap"></button></div>
  </div></div>`;
  drawPlanet(); drawObjs(); capUI();
  $$('.zone-tabs button').forEach(b => b.onclick = () => selectZone(b.dataset.z));
  $('#cap').onclick = () => capsule();
  $('#storm').onclick = defend; if (S.stormDone) stormDoneUI();
  if (!S.onboarded) { S.onboarded = true; landing(); return; }
  if (checkNew()) return;
  const nx = nextObj();
  if (!S.stormDone) say('Threat of the month: a phishing storm hits Alpha-7 on Friday. Your team charged the shield: 3 of 4.', ['Raise shield', defend]);
  else say(nx ? `Next object: <b>${nx.n}</b>, ${fmt(nx.t - S.team)} team points to go. Quests on Home bring it closer.` : 'All 12 objects are built.', nx ? ['Go to quests', () => go('home')] : null);
}
function say(t, btn) {
  const b = $('#bub'); if (!b) return;
  b.innerHTML = t + (btn ? `<div style="margin-top:10px"><button class="btn pri" style="height:34px;font-size:13px" id="bubb">${btn[0]}</button></div>` : '');
  gsap.fromTo(b, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 });
  if (btn) $('#bubb').onclick = btn[1];
}
function selectZone(k) {
  zoneTab = k; syncTabs(); drawPlanet(); drawObjs();
  gsap.fromTo('#objs', { x: -6 }, { x: 0, duration: .3 });
  gsap.fromTo('#planet .ring', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' });
}
function drawPlanet() {
  const p = $('#planet'); $$('.slot,.deco,.ring,.pin', p).forEach(e => e.remove());
  const nx = nextObj();
  Object.entries(ZONES).forEach(([k, z]) => {
    const got = builtIn(k), b = got.length ? got[got.length - 1][0] : null, s = document.createElement('div');
    s.style.left = z.pad[0] * 100 + '%'; s.style.top = z.pad[1] * 100 + '%'; s.dataset.z = k;
    if (b) { s.className = 'slot'; s.style.width = BW[b] * 100 + '%'; s.innerHTML = `<img src="${IMG}pv_${b}.webp"><div class="lab">${z.n} · ${got.length}/3</div>`; }
    else { const here = nx && nx.z === k; s.className = 'slot empty' + (here ? ' next' : ''); s.innerHTML = `<div class="plus">${I(here ? 'building' : 'lock', 's')}</div>`; }
    s.onclick = () => selectZone(k);
    p.appendChild(s);
  });
  const zr = ZONES[zoneTab], ring = document.createElement('div'); ring.className = 'ring'; ring.style.left = zr.pad[0] * 100 + '%'; ring.style.top = zr.pad[1] * 100 + '%'; p.insertBefore(ring, p.children[1]);
  const pin = document.createElement('div'); pin.className = 'pin'; pin.textContent = zr.n; pin.style.left = zr.pad[0] * 100 + '%'; pin.style.top = (zr.pad[1] - (builtIn(zoneTab).length ? .21 : .075)) * 100 + '%'; p.appendChild(pin);
  $$('.slot', p).forEach(e => e.classList.toggle('sel', e.dataset.z === zoneTab));
  S.decos.forEach((d, i) => { const e = document.createElement('img'); e.className = 'deco'; e.src = IMG + 'pv_' + d + '.webp'; e.style.left = CRATERS[i][0] * 100 + '%'; e.style.top = CRATERS[i][1] * 100 + '%'; p.appendChild(e); });
}
function drawObjs() {
  const z = ZONES[zoneTab], got = builtIn(zoneTab).length, nx = nextObj(), here = nx && nx.z === zoneTab;
  const i = nx ? ALLOBJ.indexOf(nx) : -1, prevT = i > 0 ? ALLOBJ[i - 1].t : 0;
  $('#zinfo').innerHTML = got === 3
    ? `<div class="free ok">${I('check', 's')}</div><div><b>${z.n} complete</b><span>3 of 3 objects built</span></div>`
    : here ? `<img class="ghost" src="${IMG}pv_${nx.k}.webp"><div><b>Next: ${nx.n}</b><span>${COIN()} ${fmt(nx.t - S.team)} team points to go</span><i class="zbar"><b style="width:${Math.round((S.team - prevT) / (nx.t - prevT) * 100)}%"></b></i></div>`
    : `<div class="free">${I('lock', 's')}</div><div><b>${z.n} opens later</b><span>When the previous zone is complete</span></div>`;
  $('#objs').innerHTML = z.objs.map(([k, n, t]) => {
    const built = S.team >= t, next = nx && nx.k === k;
    const foot = built ? `<div class="of on">${I('check', 's')} Built</div>` : next ? `<div class="of nx">${fmt(t - S.team)} left</div>` : `<div class="of lk2">${I('lock', 's')} ${fmt(t)}</div>`;
    return `<div class="obj ${built ? 'built' : next ? 'nextup' : 'locked'}"><img src="${IMG}pv_${k}.webp"><div class="on1">${n}</div><div class="od">${t ? 'at ' + fmt(t) : 'first action'}</div>${foot}</div>`;
  }).join('');
}
/* objects that crossed their threshold since the planet was last shown: drop them in */
function checkNew() {
  const fresh = ALLOBJ.filter(o => S.team >= o.t && !S.shown.includes(o.k));
  if (!fresh.length) return false;
  fresh.forEach(o => S.shown.push(o.k));
  const o = fresh[fresh.length - 1]; zoneTab = o.z; syncTabs(); drawPlanet(); drawObjs(); toTop();
  const sl = $(`#planet .slot[data-z="${o.z}"]`);
  if (sl) { gsap.fromTo(sl.querySelector('img'), { y: -260, opacity: 0, scale: .7 }, { y: 0, opacity: 1, scale: 1, duration: .9, ease: 'bounce.out', delay: .3 }); setTimeout(() => sparks(sl, 24), 900); }
  const nx = nextObj();
  say(`<b>${o.n}</b> is built! Your team reached ${fmt(o.t)} points.${nx ? ` Next: ${nx.n} at ${fmt(nx.t)}.` : ''}`);
  return true;
}
function sparks(el, n = 14, color) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div'); s.className = 'spark'; if (color) { s.style.background = color; s.style.boxShadow = `0 0 10px ${color}`; }
    s.style.position = 'fixed'; s.style.left = r.left + r.width / 2 + 'px'; s.style.top = r.top + r.height * .7 + 'px'; s.style.zIndex = 80; document.body.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120;
    gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d - 40, opacity: 0, scale: .3, duration: .9 + Math.random() * .5, ease: 'power2.out', onComplete: () => s.remove() });
  }
}
function landing() {
  gsap.fromTo('#pw', { scale: .25, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.6, ease: 'power3.out' });
  gsap.from('.wpanel', { opacity: 0, y: 20, duration: .6, delay: 1.2, stagger: .1 });
  gsap.from('#masc', { x: 200, opacity: 0, duration: .8, delay: 1.5, ease: 'back.out(1.6)' });
  setTimeout(() => say(`Welcome to Partnerverse, ${PEOPLE[S.role][0].split(' ')[0]}! Alpha Systems has landed on planet <b>Alpha-7</b>. Every point of your team builds it. Your week is closed, so the weekly capsule has landed.`, ['Open the capsule', () => capsule()]), 1900);
}
function capUI() {
  const b = $('#cap'); if (!b) return; const closed = S.week.filter(Boolean).length >= 3;
  b.disabled = S.capsuleDone || !closed;
  b.innerHTML = S.capsuleDone ? `${I('check', 's')} Capsule opened · next on Friday` : closed ? `${I('package', 's')} Open weekly capsule` : `${I('package', 's')} Close the week to get a capsule`;
}
function capsule() {
  if (S.capsuleDone || S.week.filter(Boolean).length < 3 || $('.capsule')) return;
  toTop(); $('#cap').disabled = true; $('#bub').style.opacity = 0;
  const w = $('#world');
  const beam = document.createElement('div'); beam.className = 'beam'; w.appendChild(beam);
  const c = document.createElement('div'); c.className = 'capsule'; c.innerHTML = `<div class="flame"></div><img src="${IMG}pv_capsule.webp">`; w.appendChild(c);
  const wr = w.getBoundingClientRect(), pr = $('#pw').getBoundingClientRect();
  const landY = pr.top - wr.top + pr.height * .30 - 120, cx = pr.left - wr.left + pr.width / 2;
  c.style.left = cx + 'px'; beam.style.left = cx + 'px';
  const n = [10, 30, 30, 50][Math.floor(Math.random() * 4)];
  gsap.timeline()
    .to(beam, { opacity: 1, duration: .5 })
    .fromTo(c, { top: -200, rotate: -8 }, { top: landY, rotate: 0, duration: 1.4, ease: 'power2.in' }, '<')
    .to(c, { y: -18, duration: .18, ease: 'power1.out' })
    .to(c, { y: 0, duration: .25, ease: 'bounce.out' })
    .to(c.querySelector('.flame'), { opacity: 0, duration: .3 }, '<')
    .to(c, { scale: 1.12, duration: .25, yoyo: true, repeat: 3, ease: 'sine.inOut' })
    .call(() => { sparks(c, 26); })
    .to(c, { opacity: 0, scale: 1.4, duration: .35 })
    .to(beam, { opacity: 0, duration: .6 }, '<')
    .call(() => {
      c.remove(); beam.remove();
      const card = document.createElement('div'); card.className = 'reward-card';
      card.innerHTML = `<div style="margin-bottom:12px"><span class="chip g">${I('package', 's')} Weekly capsule</span></div><img src="${IMG}pv_capsule.webp"><h3 class="disp" style="font-size:30px">+${n} points</h3><p class="muted" style="margin:6px 0 16px">For a closed week: 3 active days out of 5. The amount inside is a surprise.</p><button class="btn pri" style="width:100%;justify-content:center">Claim</button>`;
      w.appendChild(card);
      gsap.fromTo(card, { scale: .6, opacity: 0, rotateX: 30 }, { scale: 1, opacity: 1, rotateX: 0, duration: .6, ease: 'back.out(1.7)' });
      card.querySelector('button').onclick = () => {
        S.capsuleDone = true; capUI(); earn(n, card.querySelector('h3'), 'weekly capsule');
        gsap.to(card, { scale: .8, opacity: 0, duration: .3, delay: .2, onComplete: () => card.remove() });
        setTimeout(() => { drawObjs(); if (!checkNew()) say('Capsules only hold points. Real gifts come with levels. Now do quests on Home: every point grows the planet.', ['Go to quests', () => go('home')]); }, 1300);
      };
    });
}

function stormDoneUI() { const b = $('#storm'); if (!b) return; b.disabled = true; b.classList.add('ok'); b.innerHTML = `${I('shield-check', 's')} <span>Storm repelled · +300</span>`; }
function defend() {
  if (S.stormDone || $('#dome')) return; toTop();
  $('#bub').style.opacity = 0; $('#storm').disabled = true;
  const w = $('#world'), pw = $('#pw'), wr = w.getBoundingClientRect(), pr = pw.getBoundingClientRect();
  const dome = document.createElement('div'); dome.className = 'dome'; dome.id = 'dome'; pw.appendChild(dome);
  const cx = pr.left - wr.left + pr.width / 2, cy = pr.top - wr.top + pr.height * .46, rx = pr.width * .58, ry = pr.height * .6;
  const tl = gsap.timeline();
  tl.fromTo(dome, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: 'back.out(1.6)' });
  const N = 8;
  for (let i = 0; i < N; i++) {
    const th = (-155 + Math.random() * 130) * Math.PI / 180, tx = cx + rx * Math.cos(th), ty = cy + ry * Math.sin(th);
    const sx = tx + 520 + Math.random() * 260, sy = ty - 560 - Math.random() * 120;
    const m = document.createElement('div'); m.className = 'meteor'; w.appendChild(m);
    gsap.set(m, { left: 0, top: 0, x: sx, y: sy, rotation: Math.atan2(ty - sy, tx - sx) * 180 / Math.PI, opacity: 0 });
    tl.to(m, { opacity: 1, duration: .1 }, .7 + i * .32)
      .to(m, { x: tx, y: ty, duration: .75, ease: 'power1.in' }, '<')
      .call(() => {
        const r = m.getBoundingClientRect(); sparks({ getBoundingClientRect: () => ({ left: r.left, top: r.top - 6, width: r.width, height: r.height }) }, 16, '#ff8a5c'); m.remove();
        gsap.fromTo(dome, { '--hit': 1 }, { '--hit': 0, duration: .5 });
        const ring = document.createElement('div'); ring.className = 'shock'; ring.style.left = tx + 'px'; ring.style.top = ty + 'px'; ring.style.borderColor = '#ffb08a'; w.appendChild(ring);
        gsap.fromTo(ring, { opacity: 1, width: 10, height: 10 }, { width: 120, height: 120, opacity: 0, duration: .6, ease: 'power2.out', onComplete: () => ring.remove() });
      });
  }
  tl.to(dome, { opacity: 0, scale: 1.08, duration: .9, delay: .4 })
    .call(() => {
      dome.remove(); S.stormDone = true; stormDoneUI();
      teamEarn(300, 'threat of the month');
      setTimeout(() => { drawObjs(); if (!checkNew()) say('Shield held with 3 of 4 charges: +300 to the team total. If it had fewer, nothing would break. Next threat in a month.'); }, 300);
    });
}

/* ------------------------------------------------------------ DEFENDERS */
function cardHTML(k, xp, opts = {}) {
  const h = HEROES[k];
  if (opts.locked) return `<div class="hcard f-base locked"><div class="face"><img src="${IMG}h_${k}.webp"><div class="q">?</div><div class="shade"></div><div class="meta">${rchip('Locked')}<b>???</b><span>Open packs to find this defender</span></div></div></div>`;
  const f = frameOf(xp || 0);
  return `<div class="hcard f-${f[0]}" data-h="${k}"><div class="face"><img src="${IMG}h_${k}.webp"><div class="shade"></div>${opts.noxp ? '' : `<div class="lvlb">XP ${xp || 0}</div>`}<div class="meta">${rchip(f[1])}<b>${h.n}</b><span>${h.p}</span></div></div><div class="holo"></div></div>`;
}
function tilt(root) {
  $$('.hcard', root).forEach(c => {
    c.onmousemove = e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', (x - .5) * 18 + 'deg'); c.style.setProperty('--rx', (.5 - y) * 18 + 'deg'); c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); };
    c.onmouseleave = () => { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); };
  });
}
function heroes(m) {
  const owned = Object.keys(S.heroes).length, N = Object.keys(HEROES).length;
  m.innerHTML = `<div class="page">
    <div class="card packhead" style="display:flex;align-items:center;gap:22px;margin-bottom:18px;background:linear-gradient(90deg,#0f1f1c,var(--surface))">
      ${packArt('mini')}
      <div style="flex:1"><h3 style="font-size:22px">Defender pack</h3><div class="sub">3 cards inside. New defenders come first, a repeat gives +1 XP. Packs come for a closed week, a new level and a boss win. They can't be bought.</div>
        <div class="ph-chips" style="display:flex;gap:8px;margin-top:12px"><span class="chip">${I('cards', 's')} ${owned}/${N} defenders</span><span class="chip ${S.packs ? 'g' : ''}">${I('package', 's')} ${S.packs} ${S.packs === 1 ? 'pack' : 'packs'} ready</span></div></div>
      <button class="btn pri big" id="openpack" ${S.packs ? '' : 'disabled'}>${I('package', 's')} ${S.packs ? 'Open pack' : 'No packs ready'}</button></div>
    <div style="display:flex;justify-content:space-between;align-items:end;margin:26px 0 14px"><div><h3 style="font-size:20px">Your defenders</h3><div class="sub">Each defender is a Kaspersky product. Tap to see its powers.</div></div></div>
    <div class="coll">${Object.keys(HEROES).map(k => S.heroes[k] ? cardHTML(k, S.heroes[k].xp) : cardHTML(k, 0, { locked: true })).join('')}</div>
    <div class="card lvlup"><b class="disp">How a defender grows</b><div class="sub">Experience changes the frame. The art stays the same, and the frame does not change the strike.</div>
      <div class="lsteps">
        <div>${I('school')}<span>Course, webinar or certification on the product: +2 XP</span></div>
        <div>${I('swords')}<span>Fits the threat of the week: +1 XP</span></div>
        <div>${I('package')}<span>Repeat card from a pack: +1 XP</span></div></div>
      <div class="frames">${FRAMES.map(([k, n, x]) => `<div class="fr f-${k}"><b>${n}</b><span>${x ? x + ' XP' : 'from day one'}</span></div>`).join('')}</div></div>
  </div>`;
  tilt(m);
  $$('.coll .hcard:not(.locked)', m).forEach(c => c.onclick = () => heroDetail(c.dataset.h));
  $('#openpack').onclick = () => { if (!S.packs) return; S.packs -= 1; openPack(randomPack()); };
}
/* new defenders first, repeats only when the collection is complete */
function randomPack() {
  const ks = Object.keys(HEROES), missing = ks.filter(k => !S.heroes[k]).sort(() => Math.random() - .5);
  return [0, 1, 2].map(i => missing[i] || ks[Math.floor(Math.random() * ks.length)]);
}
function starterPack() {
  openPack(['shield', 'guardian', 'watcher'], true);
}
function ambient(el) {
  if (!el.isConnected) return;
  const r = el.getBoundingClientRect(), s = document.createElement('div'); s.className = 'spark';
  s.style.position = 'fixed'; s.style.left = r.left + Math.random() * r.width + 'px'; s.style.top = r.bottom - 30 - Math.random() * 40 + 'px'; s.style.zIndex = 49;
  document.body.appendChild(s);
  gsap.to(s, { y: -(160 + Math.random() * 220), x: (Math.random() - .5) * 80, opacity: 0, scale: .4, duration: 1.6 + Math.random(), ease: 'power1.out', onComplete: () => s.remove() });
}
function openPack(cards, starter) {
  const st = $('#stage'); st.classList.add('on'); st.style.opacity = 1;
  const art = packArt();
  st.innerHTML = `<div class="rays" id="rays"></div><div class="legend-flash" id="lf"></div><div class="flash" id="fx"></div>
    <div class="stage-title" id="stt">${starter ? `Welcome, ${PEOPLE[S.role][0].split(' ')[0]}` : 'Defender pack'}</div>
    <div class="stage-sub" id="sts">${starter ? 'Kaspersky products are defenders. Your starter pack is on us.' : '3 cards inside'}</div>
    <div class="pack" id="pack"><div class="whole">${art}</div><div class="half l">${art}</div><div class="half r">${art}</div><div class="seam" id="seam"></div></div>
    <div class="shock" id="sh1"></div><div class="shock" id="sh2"></div><div class="burst" id="burst"></div>
    <div class="deal" id="deal"></div><div class="stage-hint" id="sth"><button class="btn pri big" id="popen">${I('package', 's')} Open</button></div>`;
  const pack = $('#pack');
  gsap.set('.half', { opacity: 0 });
  gsap.fromTo(pack, { scale: .4, opacity: 0, rotate: -15, y: 90 }, { scale: 1, opacity: 1, rotate: 0, y: 0, duration: 1, ease: 'back.out(1.5)' });
  const idle = gsap.to(pack, { y: -14, rotate: 1.5, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
  const amb = setInterval(() => ambient(pack), 200);
  $('#popen').onclick = () => pack.onclick && pack.onclick();
  gsap.from('#popen', { y: 20, opacity: 0, duration: .5, delay: .6 });
  pack.onclick = () => {
    pack.onclick = null; idle.kill(); clearInterval(amb); $('#stt').textContent = ''; $('#sts').textContent = ''; $('#sth').innerHTML = '';
    const shake = [...Array(18)].map((_, i) => ({ x: (i % 2 ? 1 : -1) * (1.5 + i * .8), rotate: (i % 2 ? 1 : -1) * (.4 + i * .28), duration: .055 }));
    gsap.timeline()
      .to(pack, { y: 0, rotate: 0, duration: .15 })
      .to(pack, { scale: 1.1, duration: 1.1, ease: 'power1.in' })
      .to(pack, { keyframes: shake }, '<')
      .to(pack, { filter: 'drop-shadow(0 0 90px rgba(35,209,174,1))', duration: 1.1 }, '<')
      .to('#rays', { opacity: 1, duration: 1 }, '<')
      .to('#seam', { scaleY: 1, opacity: 1, duration: .3, ease: 'power2.in' }, '-=.3')
      .call(() => { $('.whole', pack).style.opacity = 0; gsap.set('.half', { opacity: 1 }); sparks(pack, 80); })
      .to('#fx', { opacity: .85, duration: .07 })
      .to('#fx', { opacity: 0, duration: .7 })
      .to('.half.l', { x: -300, y: 40, rotate: -32, opacity: 0, duration: 1, ease: 'power3.out' }, '<')
      .to('.half.r', { x: 300, y: 40, rotate: 32, opacity: 0, duration: 1, ease: 'power3.out' }, '<')
      .to('#seam', { scaleX: 40, opacity: 0, duration: .5 }, '<')
      .fromTo('#sh1', { opacity: 1, width: 40, height: 40 }, { width: 1000, height: 1000, opacity: 0, duration: 1.1, ease: 'power2.out' }, '<')
      .fromTo('#sh2', { opacity: .8, width: 40, height: 40 }, { width: 640, height: 640, opacity: 0, duration: .9, ease: 'power2.out' }, '<.12')
      .to('#burst', { width: 2600, height: 2600, opacity: 0, duration: 1, ease: 'power2.out' }, '<')
      .call(() => deal(cards, starter), null, '-=.75');
    gsap.to('#rays', { rotate: '+=360', duration: 30, repeat: -1, ease: 'none' });
  };
}
function deal(cards, starter) {
  const d = $('#deal'); let revealed = 0;
  d.innerHTML = cards.map((k, i) => `<div class="slotc" data-i="${i}"><div class="glowc" style="--gc:rgba(35,209,174,.85)"></div><div class="flip-in" style="position:relative;aspect-ratio:2/3">
      <div class="facewrap" style="position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden"></div>
      <div class="hcard" style="position:absolute;inset:0;backface-visibility:hidden"><div class="cardback"><div class="hex"></div><img src="${IMG}logo.png" style="width:38%;opacity:.7"></div></div></div></div>`).join('');
  $('#sth').textContent = 'Tap each card to reveal';
  const slots = $$('.slotc', d);
  gsap.fromTo(slots, { y: 360, scale: .3, rotate: i => (i - 1) * 40, opacity: 0 }, { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 1, stagger: .14, ease: 'back.out(1.3)' });
  slots.forEach((sc, i) => {
    const glow = sc.querySelector('.glowc');
    const hover = gsap.to(sc, { y: -8, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 + i * .2 });
    sc.onmouseenter = () => { if (!sc.dataset.r) gsap.to(glow, { opacity: .55, duration: .3 }); };
    sc.onmouseleave = () => { if (!sc.dataset.r) gsap.to(glow, { opacity: 0, duration: .3 }); };
    sc.onclick = () => {
      if (sc.dataset.r) return; sc.dataset.r = 1; hover.kill();
      const k = cards[+sc.dataset.i], inner = sc.querySelector('.flip-in'), isNew = !S.heroes[k];
      const xp0 = isNew ? 0 : S.heroes[k].xp, xp1 = isNew ? 0 : xp0 + 1, up = !isNew && frameOf(xp1)[0] !== frameOf(xp0)[0];
      sc.querySelector('.facewrap').innerHTML = cardHTML(k, xp1, { noxp: true }) + '<div class="sweep"><i></i></div>';
      const tl = gsap.timeline();
      tl.to(sc, { y: -34, scale: 1.13, duration: .35, ease: 'power2.out' }).to(glow, { opacity: 1, scale: 1.2, duration: .35 }, '<');
      if (isNew || up) tl.to(sc, { keyframes: [...Array(12)].map((_, j) => ({ x: (j % 2 ? 1 : -1) * (1 + j * .6), duration: .045 })) }).to(sc, { x: 0, duration: .05 });
      tl.to(inner, { rotateY: 90, rotateZ: isNew ? 7 : 3, duration: .28, ease: 'power2.in' })
        .call(() => {
          sparks(sc, isNew || up ? 60 : 20, up ? '#E8BE62' : null);
          const ring = document.createElement('div'); ring.className = 'shock'; ring.style.position = 'fixed';
          const rr = sc.getBoundingClientRect(); ring.style.left = rr.left + rr.width / 2 + 'px'; ring.style.top = rr.top + rr.height / 2 + 'px'; ring.style.zIndex = 79;
          if (up) ring.style.borderColor = '#E8BE62'; document.body.appendChild(ring);
          gsap.fromTo(ring, { opacity: 1, width: 40, height: 40 }, { width: isNew || up ? 700 : 380, height: isNew || up ? 700 : 380, opacity: 0, duration: .8, ease: 'power2.out', onComplete: () => ring.remove() });
          if (up) { $('#rays').classList.add('gold'); gsap.fromTo('#lf', { opacity: 1 }, { opacity: 0, duration: 1.6 }); }
          $('#stt').innerHTML = up ? `<span style="color:var(--gold)">${frameOf(xp1)[1]} frame</span> · ${HEROES[k].n}` : isNew ? `<span style="color:var(--green2)">New defender</span> · ${HEROES[k].n}` : `${HEROES[k].n} · <span style="color:var(--muted)">+1 XP</span>`;
          gsap.fromTo('#stt', { scale: isNew || up ? 1.5 : 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, ease: 'back.out(2)' });
        })
        .to(inner, { rotateY: 180, rotateZ: 0, duration: .55, ease: 'back.out(2.2)' })
        .fromTo(() => sc.querySelector('.sweep i'), { left: '-60%', opacity: 1 }, { left: '130%', opacity: 0, duration: .9, ease: 'power2.out' }, '<.05')
        .to(sc, { y: 0, scale: 1, duration: .8, ease: 'elastic.out(1,.5)' }, '<')
        .to(glow, { opacity: isNew ? .9 : .4, scale: 1, duration: .6 }, '<')
        .call(() => {
          if (isNew) S.heroes[k] = { xp: 0 }; else S.heroes[k].xp = xp1;
          const tag = document.createElement('div'); tag.className = 'newtag' + (isNew ? '' : ' up'); tag.textContent = isNew ? 'New defender' : `+1 XP · ${xp1}`;
          sc.appendChild(tag); gsap.from(tag, { y: 10, opacity: 0, scale: .8, duration: .4, ease: 'back.out(2)' });
          if (++revealed === cards.length) {
            $('#sth').innerHTML = `<button class="btn pri big" id="done">${I('check', 's')} ${starter ? 'Meet your defenders' : 'Add to collection'}</button>`;
            gsap.from('#done', { y: 20, opacity: 0, duration: .5 });
            $('#done').onclick = () => { gsap.to('#stage', { opacity: 0, duration: .4, onComplete: () => { const s = $('#stage'); s.classList.remove('on'); s.style.opacity = 1; s.innerHTML = ''; go('world'); if (starter) setTimeout(() => toast(`${I('info-circle')} Tap a defender to see its powers`), 700); } }); };
          }
        });
    };
  });
}
function backHTML(k, xp) {
  const h = HEROES[k];
  return `<div class="hcard f-${frameOf(xp)[0]}" style="position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden"><div class="backside" style="transform:none;position:absolute">
    <span class="chip g">${h.p}</span><h4>${h.n}</h4><div class="pw">${h.pw}</div>
    <div class="tags">${h.tags.map(([ic, t]) => `<div class="tg">${I(ic)}<span>${t}</span></div>`).join('')}</div>
    <div class="stats">${STATS.map((n, i) => `<div class="sr"><span>${n}</span><i><b style="width:${h.st[i]}%"></b></i></div>`).join('')}</div>
    <div class="fit">${I('users', 's')} ${h.fit}</div></div></div>`;
}
function heroDetail(k) {
  const h = HEROES[k], o = S.heroes[k], f = frameOf(o.xp), nf = nextFrame(o.xp);
  const pct = nf ? Math.round((o.xp - f[2]) / (nf[2] - f[2]) * 100) : 100;
  modal(`<div class="hd"><div style="perspective:1200px"><div class="flip-in" id="fl" style="position:relative;aspect-ratio:2/3">
      <div style="position:absolute;inset:0;backface-visibility:hidden">${cardHTML(k, o.xp)}</div>${backHTML(k, o.xp)}</div></div>
    <div><span class="chip ${f[0] === 'gold' ? 'gold' : 'g'}">${f[1]} frame · XP ${o.xp}</span><h2>${h.n}</h2><p class="muted">${h.p}</p>
      <div class="card" style="margin:18px 0;padding:14px"><div style="display:flex;align-items:center;gap:12px">${I('school')}<div><div class="sub">Grow it</div><b class="disp">${h.p} course · +2 XP</b></div></div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:12px"><span>${f[1]}</span><span class="muted">${nf ? `${nf[2] - o.xp} XP to ${nf[1]}` : 'Top frame'}</span></div><div class="progress" style="margin-top:6px"><i style="width:${pct}%"></i></div></div>
      <div class="acts" style="margin-top:0"><button class="btn pri" id="flipb">${I('refresh', 's')} Flip card</button><button class="btn ghost" onclick="closeModal()">Close</button></div></div></div>`);
  $('#modal').style.width = 'min(700px,94vw)';
  let fl = 0; $('#flipb').onclick = () => { fl = 1 - fl; gsap.to('#fl', { rotateY: fl * 180, duration: .8, ease: 'power3.inOut' }); };
  $('#fl').onclick = () => $('#flipb').click();
}

/* ------------------------------------------------------------ THREAT OF THE WEEK */
let pick = null;
const trioOf = p => Object.fromEntries(Object.keys(ROLES).map(r => [r, r === S.role ? p : VOTES[r][0]]));
const coverage = t => { const ks = Object.values(t).filter(Boolean); return THREAT.weak.filter(([ic]) => ks.some(k => HEROES[k].tags.some(x => x[0] === ic))).map(x => x[0]); };
const multOf = c => c >= 3 ? 3 : c === 2 ? 2 : 1;
function pickBack(k) {
  const h = HEROES[k], o = S.heroes[k], on = pick === k;
  return `<div class="hcard f-${frameOf(o.xp)[0]} pback" style="position:absolute;inset:0;transform:rotateY(180deg);backface-visibility:hidden"><div class="backside" style="transform:none;position:absolute">
    <h4>${h.n}</h4><div class="pp">${h.p}</div>
    <div class="tags">${h.tags.map(([ic, t]) => `<div class="tg">${I(ic)}<span>${t}</span></div>`).join('')}</div>
    <button class="btn ${on ? 'pri' : 'sec'} pickb" data-k="${k}">${on ? I('check', 's') + ' Voted' : 'Vote'}</button></div></div>`;
}
function bossCol() {
  return `<div><div class="hcard f-gold boss" style="--rc:#E5383B"><div class="face" style="border-color:#E5383B"><img src="${IMG}${THREAT.img}.webp"><div class="shade"></div><div class="meta"><span class="rchip red">Threat of the week</span><b>${THREAT.n}</b><span>Monday to Friday</span></div></div></div>
      <div class="card bossinfo"><b class="disp">How it attacks</b>
        <div class="atk">${THREAT.atk.map(([ic, t], i) => `<div><i>${i + 1}</i>${I(ic)}<span>${t}</span></div>`).join('')}</div>
        <b class="disp" style="margin-top:16px;display:block">Weak spots</b>
        <div class="weak">${THREAT.weak.map(([ic, t]) => `<div>${I(ic)}<span>${t}</span></div>`).join('')}</div></div></div>`;
}
function threat(m) {
  if (S.threatDone && S.lastFight) return threatAfter(m);
  pick = null;
  const owned = Object.keys(S.heroes);
  m.innerHTML = `<div class="page"><div class="threat">
    ${bossCol()}
    <div><span class="chip red">${I('swords', 's')} Threat of the week</span><h2 style="font-size:30px;margin:10px 0 6px">Stop ${THREAT.n}</h2>
      <p class="muted" style="max-width:640px">Each role sends one defender: the one with the most votes. Flip a card and vote for the defender whose powers close the weak spots.</p>
      <div id="trio"></div>
      <div class="pickh" style="margin-top:18px">${Object.keys(HEROES).map(k => owned.includes(k)
        ? `<div class="flipc" data-k="${k}"><div class="flip-in"><div style="position:absolute;inset:0;backface-visibility:hidden">${cardHTML(k, S.heroes[k].xp)}<div class="fliphint">${I('refresh', 's')}</div></div>${pickBack(k)}</div></div>`
        : cardHTML(k, 0, { locked: true })).join('')}</div>
      <div class="fightbar"><button class="btn pri big" id="fight" disabled>${I('swords', 's')} <span id="fightl">Vote</span></button><span class="muted" id="fhint">Flip a defender, then tap Vote</span></div>
    </div></div></div>`;
  tilt($('.boss', m).parentElement);
  drawTrio();
  const upd = () => {
    $$('.flipc', m).forEach(f => {
      const k = f.dataset.k, on = pick === k; f.classList.toggle('sel', on);
      const b = $('.pickb', f); b.className = `btn ${on ? 'pri' : 'sec'} pickb`; b.innerHTML = on ? I('check', 's') + ' Voted' : 'Vote';
    });
    drawTrio();
    const mult = multOf(coverage(trioOf(pick)).length);
    $('#fight').disabled = !pick; $('#fightl').textContent = pick ? `Strike ×${mult}` : 'Vote';
    $('#fhint').textContent = pick ? `Your vote: ${HEROES[pick].n}. Real work this week hits the threat ×${mult}` : 'Flip a defender, then tap Vote';
  };
  $$('.flipc', m).forEach(f => {
    f.onclick = () => { const on = !f.classList.contains('f'); $$('.flipc.f', m).forEach(x => x !== f && x.classList.remove('f')); f.classList.toggle('f', on); };
    $('.pickb', f).onclick = e => { e.stopPropagation(); const k = f.dataset.k; pick = pick === k ? null : k; upd(); if (pick) setTimeout(() => f.classList.remove('f'), 350); };
  });
  $('#fight').onclick = fight;
}
function drawTrio() {
  const t = trioOf(pick), cov = coverage(t), mult = multOf(cov.length);
  $('#trio').innerHTML = `<div class="tslots">${Object.keys(ROLES).map(r => { const k = t[r], me = r === S.role;
      return `<div class="tslot ${me ? 'me' : ''} ${k ? '' : 'empty'}"><div class="tr">${ROLES[r]}${me ? ' · your vote' : ''}</div>${k ? `<img src="${IMG}h_${k}.webp"><b>${HEROES[k].n}</b><span>${me ? 'Your pick' : `${VOTES[r][1]} of ${VOTES[r][2]} votes`}</span>` : `<div class="tq">?</div><b>Your vote</b><span>Pick below</span>`}</div>`; }).join('')}</div>
    <div class="tcov"><span class="muted">Weak spots closed</span>${THREAT.weak.map(([ic, tt]) => `<span class="wi ${cov.includes(ic) ? 'on' : 'off'}" title="${tt}">${I(ic, 's')}</span>`).join('')}<b class="mult">Strike ×${mult}</b></div>`;
}
function fight() {
  const t = trioOf(pick), cov = coverage(t), mult = multOf(cov.length), win = mult >= 2;
  const fit = [...new Set(Object.values(t).filter(k => THREAT.good.includes(k)))];
  gsap.timeline().to('.threat .boss', { x: '+=8', duration: .05, repeat: 11, yoyo: true }).to('.threat .boss', { filter: win ? 'grayscale(1) brightness(.5)' : 'none', duration: .6 });
  S.lastFight = { trio: t, cov, mult, win, fit };
  setTimeout(() => {
    S.threatDone = true;
    modal(`<div style="text-align:center"><span class="chip">${I('calendar-week', 's')} Friday result · demo</span><h2 style="font-size:30px">${win ? `${THREAT.n} defeated` : `${THREAT.n} got through`}</h2><p class="muted">${cov.length} of 3 weak spots closed · strike ×${mult}</p></div>
      <div class="grid" style="gap:8px;margin-top:14px">${Object.keys(ROLES).map(r => { const k = t[r], good = THREAT.good.includes(k);
        return `<div class="quest" style="padding:12px"><img src="${IMG}h_${k}.webp" style="width:40px;height:52px;object-fit:cover;border-radius:8px"><div class="qt"><b>${ROLES[r]} · ${HEROES[k].n}${good ? ' <span class="chip g" style="height:20px;font-size:11px;margin-left:4px">+1 XP</span>' : ''}</b><span>${THREAT.why[k]}</span></div><span style="color:${good ? 'var(--green2)' : '#ff7a7c'}">${I(good ? 'check' : 'x')}</span></div>`; }).join('')}</div>
      <p class="sub" style="margin-top:12px">The multiplier only hits the threat. Points, levels and the company rating count as usual.</p>
      <button class="btn pri big" style="width:100%;justify-content:center;margin-top:14px" id="fok">${win ? `${I('trophy', 's')} Add the trophy to the album` : 'OK'}</button>`);
    $('#fok').onclick = () => { closeModal(); fit.forEach(k => { if (S.heroes[k]) S.heroes[k].xp += 1; }); if (win && !S.trophies.includes('ransom')) S.trophies.push('ransom'); go('threat'); };
  }, 900);
}
function threatAfter(m) {
  const L = S.lastFight, win = L.win;
  const album = [['v_ransom', 'Ransomware', 'ransom'], ['v_phish', 'Phishing', ''], ['v_apt', 'Silent spy', ''], ['', 'Final boss', '']];
  m.innerHTML = `<div class="page"><div class="threat">
    <div><div class="hcard f-gold boss beaten ${win ? '' : 'lost'}" style="--rc:${win ? '#23D1AE' : '#E5383B'}"><div class="face" style="border-color:${win ? '#23D1AE' : '#E5383B'}"><img src="${IMG}${THREAT.img}.webp"><div class="shade"></div>
        <div class="stamp" id="stamp">${win ? 'Defeated' : 'Got through'}</div>
        <div class="meta"><span class="rchip ${win ? '' : 'red'}">Threat of the week</span><b>${THREAT.n}</b><span>${win ? 'Stopped by Alpha Systems' : 'Nothing is lost. It leaves an empty slot'}</span></div></div></div>
      <div class="card bossinfo"><b class="disp">Trophy album</b><div class="album">${album.map(([img, n, id]) => `<div class="${S.trophies.includes(id) ? 'got' : ''}">${S.trophies.includes(id) ? `<img src="${IMG}${img}.webp">` : '?'}<span>${n}</span></div>`).join('')}</div></div></div>
    <div><span class="chip ${win ? 'g' : 'red'}">${I(win ? 'shield-check' : 'info-circle', 's')} ${win ? 'Threat stopped' : 'Threat got through'}</span>
      <h2 style="font-size:30px;margin:10px 0 6px">${win ? `${THREAT.n} is stopped` : `${THREAT.n} got through`}</h2>
      <p class="muted">${L.cov.length} of 3 weak spots closed · strike ×${L.mult}. Defenders that fit got +1 XP.</p>
      <div class="res">${Object.keys(ROLES).map(r => { const k = L.trio[r], good = THREAT.good.includes(k), o = S.heroes[k];
        return `<div class="rescard"><div class="rrole">${ROLES[r]}</div>${cardHTML(k, o ? o.xp : 0)}<div class="mk ${good ? '' : 'no'}">${I(good ? 'check' : 'x', 's')}</div>${good ? `<div class="newtag">+1 XP</div>` : `<div class="newtag up">No match</div>`}</div>`; }).join('')}</div>
      <div class="card rsum">${I(win ? 'trophy' : 'info-circle', 'l')}<div><b class="disp">${win ? 'Trophy added to the album' : 'No trophy this time'}</b><div class="sub">Points for real work count as usual. A boss of the month also gives everyone a pack.</div></div></div>
      <div class="card nextb"><div class="nimg"><img src="${IMG}${NEXT.img}.webp"><div class="nq">?</div></div>
        <div><span class="chip red">${I('calendar-week', 's')} Next threat · ${NEXT.when}</span><h3 style="font-size:22px;margin:10px 0 4px">${NEXT.n}</h3>
          <div class="sub">Weak spots:</div><div class="weak row">${NEXT.weak.map(([ic, t]) => `<div>${I(ic)}<span>${t}</span></div>`).join('')}</div>
          <button class="btn pri" id="ready" style="margin-top:14px">${I('cards', 's')} Check my defenders</button></div></div>
    </div></div></div>`;
  tilt($('.res', m));
  gsap.fromTo('#stamp', { scale: 2.2, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: -12, duration: .6, ease: 'back.out(2)', delay: .2 });
  gsap.from('.rescard', { y: 30, opacity: 0, duration: .5, stagger: .1, delay: .3 });
  $('#ready').onclick = () => go('world');
}

/* ------------------------------------------------------------ REWARDS & LEADERBOARD */
function rewards(m) {
  const l = level();
  m.innerHTML = `<div class="page grid" style="gap:22px">
    <div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="font-size:20px">Level gifts · guaranteed</h3><div class="sub">The level grows with your season points and never goes down.</div></div><span class="chip g">${fmt(S.season)} season points</span></div>
      <div class="track" style="margin-top:18px">${GIFTS.map((g, i) => `<div class="step ${i + 1 <= l ? 'got' : i + 1 === l + 1 ? 'cur' : ''}"><div class="n">Level ${i + 1} · ${fmt(LEVELS[i + 1])}</div><b>${lvlName(i + 1)}</b><span>${g}</span></div>`).join('')}</div></div>
    <div class="card"><h3 style="font-size:20px">Inside the level gifts</h3><div class="sub">Points can't be spent, bought or cashed out. Physical gifts come only with levels and the final.</div>
      <div class="shop" style="margin-top:18px">${[['m_tshirt', 'Kaspersky T-shirt', 3], ['m_mug', 'Thermo mug', 3], ['m_backpack', 'Laptop backpack', 4], ['m_course', 'Course voucher', 4]].map(([ic, n, lv]) => `<div class="item"><div class="ii"><img src="${IMG}${ic}.webp" alt=""></div><b>${n}</b><div><span class="chip ${l >= lv ? 'g' : ''}">${I(l >= lv ? 'check' : 'lock', 's')} Level ${lv} · ${lvlName(lv)}</span></div></div>`).join('')}</div></div>
    <div class="card"><h3 style="font-size:20px">Grand final · top companies of the season</h3><div class="sub">By company rating, not by luck.</div>
      <div class="final" style="margin-top:18px">${[['f_ipl', 'IPL match in a VIP box', 'For the whole team'], ['f_summit', 'Security Analyst Summit', 'Flight, hotel, meeting with experts'], ['f_retreat', 'Team retreat', 'Goa or Singapore']].map(([ic, a, b]) => `<div class="f"><img src="${IMG}${ic}.webp" alt=""><b>${a}</b><span>${b}</span></div>`).join('')}</div></div></div>`;
}
function leaderboard(m) {
  const rows = COMPANIES.map(c => c[2] ? [c[0], S.team, 1] : c).sort((a, b) => b[1] - a[1]);
  m.innerHTML = `<div class="page grid" style="grid-template-columns:1.4fr 1fr">
    <div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div><h3 style="font-size:20px">Companies · season 1</h3><div class="sub">Only company names. No personal data.</div></div><span class="chip">${I('calendar-week', 's')} Updated daily</span></div>
      ${rows.map((r, i) => `<div class="lb-row ${r[2] ? 'me' : ''}"><span class="pos ${i < 3 ? 'top3' : ''}">${i + 1}</span><span class="nm">${r[0]}</span><span class="sc">${fmt(r[1])}</span>${COIN()}</div>`).join('')}
      <div class="lbnote">${I('users', 's')} Each week the team score takes the points of its 5 most active players. Full Team bonus when all 3 roles are active.${S.concept === 'pv' ? ' A repelled threat adds +300.' : ''}</div></div>
    <div class="card"><h3 style="font-size:20px">Your team</h3><div class="sub">Alpha Systems · 7 players</div>
      ${[['Arjun M.', 'Sales', S.season], ['Priya N.', 'Pre-sales', 1120], ['Rohan K.', 'Marketing', 640], ['Kavya S.', 'Sales', 210], ['Vikram R.', 'Pre-sales', 0]].map(p => `<div class="lb-row"><span class="nm">${p[0]} <span class="muted" style="font-size:12px">· ${p[1]}</span></span><span class="sc">${fmt(p[2])}</span></div>`).join('')}
      <p class="sub" style="margin-top:12px">Inside your company names are visible. Other companies only see the team total.</p></div></div>`;
}

/* ------------------------------------------------------------ boot */
window.closeModal = closeModal;
/* deep links for the deck: ?c=pv|he&p=home|world|threat|rewards|leaderboard|start */
(() => {
  const q = new URLSearchParams(location.search), c = q.get('c'), p = q.get('p');
  if (c !== 'pv' && c !== 'he') return picker();
  reset(c);
  if (p === 'start') { shell(); if (c === 'pv') go('world'); else { go('home'); starterPack(); } return; }
  S.onboarded = true; if (c === 'he') demoHeroes();
  shell(); go(['home', 'world', 'threat', 'rewards', 'leaderboard'].includes(p) ? p : (c === 'pv' ? 'world' : 'home'));
})();
