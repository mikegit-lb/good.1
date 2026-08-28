// Optimized navigation — beats rivals with mega+subnav+palette
const hamburger = document.getElementById('hamburger');
const navWrap = document.getElementById('nav');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen=false;
function toggleMenu(force){
  menuOpen = typeof force==='boolean'? force : !menuOpen;
  navWrap.classList.toggle('open', menuOpen);
  hamburger?.setAttribute('aria-expanded', String(menuOpen));
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  if(menuOpen) mobileMenu?.querySelector('a')?.focus();
}
hamburger?.addEventListener('click', ()=> toggleMenu());
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && menuOpen) toggleMenu(false)});
document.querySelectorAll('.mobile-menu a, .mobile-menu button').forEach(a=> a.addEventListener('click', ()=> setTimeout(()=>toggleMenu(false),80)));

// Mega menu keyboard + hover intent
const progNav = document.getElementById('programsNav');
const mega = document.getElementById('megaMenu');
let megaTimer;
progNav?.addEventListener('mouseenter', ()=> {clearTimeout(megaTimer); progNav.classList.add('open'); progNav.querySelector('a')?.setAttribute('aria-expanded','true')});
progNav?.addEventListener('mouseleave', ()=> {megaTimer=setTimeout(()=>{progNav.classList.remove('open'); progNav.querySelector('a')?.setAttribute('aria-expanded','false')},120)});
progNav?.querySelector('a')?.addEventListener('click', e=>{
  if(window.innerWidth>900){ e.preventDefault(); const o=progNav.classList.toggle('open'); progNav.querySelector('a').setAttribute('aria-expanded', String(o));}
});
document.addEventListener('click', e=>{
  if(!progNav?.contains(e.target)) {progNav?.classList.remove('open'); progNav?.querySelector('a')?.setAttribute('aria-expanded','false')}
});

// Scroll progress + nav shadow + subnav spy — throttled rAF
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const subnav = document.getElementById('subnav');
const subLinks = [...document.querySelectorAll('.subnav a[data-sec]')];
const sections = ['services','about','resources','membership','clubs','contact'].map(id=> document.getElementById(id)).filter(Boolean);
let ticking=false;
function onScroll(){
  if(ticking) return;
  ticking=true;
  requestAnimationFrame(()=>{
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH>0 ? (y/docH)*100 : 0;
    if(progressBar) progressBar.style.width = pct+'%';
    if(nav) nav.style.boxShadow = y>8 ? '0 6px 30px rgba(11,36,71,.08)' : 'none';
    // scroll spy for main nav + subnav
    let current = '';
    const offset = 140;
    sections.forEach(s=>{
      const top = s.getBoundingClientRect().top;
      if(top - offset < 0) current = s.id;
    });
    document.querySelectorAll('.nav-links a[href^=\"#\"]').forEach(a=>{
      const href=a.getAttribute('href')?.slice(1);
      a.classList.toggle('active', href===current);
      if(href===current) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
    subLinks.forEach(a=>{
      const sec=a.getAttribute('data-sec');
      a.classList.toggle('active', sec===current);
    });
    ticking=false;
  });
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Smooth reveal — respect reduced motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el=> el.classList.add('in'));
}

// Billing toggle
const toggleWrap = document.querySelector('.billing-toggle');
const toggleBtn = document.getElementById('billingToggle');
const billMonthly = document.getElementById('billMonthly');
const billYearly = document.getElementById('billYearly');
let yearly=false;
function setBilling(v){
  yearly=v;
  toggleWrap?.classList.toggle('yearly', yearly);
  billMonthly?.classList.toggle('active', !yearly);
  billYearly?.classList.toggle('active', yearly);
  document.querySelectorAll('.price strong[data-monthly]').forEach(el=>{
    const m=el.getAttribute('data-monthly');
    const y=el.getAttribute('data-yearly');
    el.textContent = yearly ? '£'+y : '£'+m;
    const suffix = el.nextElementSibling;
    if(suffix) suffix.textContent = yearly ? '/year' : '/month';
  });
}
toggleBtn?.addEventListener('click', ()=> setBilling(!yearly));
billMonthly?.addEventListener('click', ()=> setBilling(false));
billYearly?.addEventListener('click', ()=> setBilling(true));

// Modals & toast
const leadModal = document.getElementById('leadModal');
const leadTitle = document.getElementById('leadTitle');
const leadKicker = document.getElementById('leadKicker');
const leadDesc = document.getElementById('leadDesc');
const leadSource = document.getElementById('leadSource');
const toast = document.getElementById('toast');
function showToast(msg){
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  const lr=document.getElementById('liveRegion');
  if(lr) lr.textContent = msg;
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=> toast.classList.remove('show'), 4200);
}
window.openLead = (source)=>{
  if(!leadModal) return;
  leadSource.value = source;
  leadKicker.textContent = 'Recurso gratis';
  leadTitle.textContent = source;
  leadDesc.textContent = 'Introduce tu email — descarga instantánea y un seguimiento útil. Sin spam. GDPR seguro.';
  leadModal.showModal();
  setTimeout(()=> document.getElementById('leadEmail')?.focus(), 80);
}
window.openCheckout = (plan)=>{
  const p = yearly ? 'Yearly' : 'Monthly';
  showToast(`Gran elección — ${plan} (${p}) — abriendo pago (demo). Tu plaza reservada 15 min.`);
  setTimeout(()=> window.openLead(plan + ' — ' + p + ' Membership'), 900);
}
window.handleLead = (e)=>{
  e.preventDefault();
  const email = document.getElementById('leadEmail').value;
  const source = document.getElementById('leadSource').value;
  leadModal.close();
  showToast(`¡Enviado! Revisa ${email} para "${source}" — si no está en bandeja, mira spam. Bienvenido a L.B. English Co.`);
  e.target.reset();
}
window.handleBooking = (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get('firstName');
  const goal = fd.get('goal');
  e.target.reset();
  showToast(`Gracias, ${name}! Your free call request para "${goal}" recibida. Te escribiremos en 6h para confirmar.`);
  toggleMenu(false);
}
document.querySelectorAll('dialog').forEach(d=>{
  d.addEventListener('click', e=>{
    const r=d.getBoundingClientRect();
    if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
  d.addEventListener('cancel', ()=> toggleMenu(false));
});

// FAQ single-open
const details = document.querySelectorAll('.faq-list details');
details.forEach(d=>{
  d.addEventListener('toggle', ()=>{
    if(d.open) details.forEach(o=>{ if(o!==d) o.open=false });
  });
});

// Counter animation
const counters = document.querySelectorAll('[data-count]');
const cObserver = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    const target=parseInt(el.getAttribute('data-count'),10);
    let cur=0;
    const step = Math.max(1, Math.round(target/40));
    const int=setInterval(()=>{
      cur+=step;
      if(cur>=target){ cur=target; clearInterval(int); }
      el.textContent = cur;
    },22);
    cObserver.unobserve(el);
  });
},{threshold:0.6});
counters.forEach(c=> cObserver.observe(c));

// Command palette — rivals don't have this
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
const commands = [
  {id:'ielts', label:'IELTS — Band 7–8.5', desc:'IELTS Academic & General • 8-week mastery', icon:'IELTS', href:'#services'},
  {id:'toefl', label:'TOEFL iBT', desc:'ETS tactics • Note-taking & integrated templates', icon:'TOEFL', href:'#services'},
  {id:'sat', label:'SAT Verbal', desc:'College Board • Reading & Writing 700+', icon:'SAT', href:'#services'},
  {id:'yds', label:'YDS', desc:'ÖSYM • All 80 Qs • vocab/grammar/reading', icon:'YDS', osym:true, href:'#services'},
  {id:'yokdil', label:'YÖKDİL', desc:'Sci / Health / Social • ÖSYM mocks', icon:'YÖK', osym:true, href:'#services'},
  {id:'ydt', label:'YDT', desc:'University entrance • timed strategy', icon:'YDT', osym:true, href:'#services'},
  {id:'esl', label:'ESL A1–C2', desc:'Foundations to proficiency', icon:'ESL', href:'#services'},
  {id:'business', label:'Business English', desc:'Meetings • pitches • LinkedIn polish', icon:'BE', href:'#services'},
  {id:'clubs', label:'Speaking Clubs', desc:'Twice weekly • Max 8 • £9', icon:'◐', href:'#clubs'},
  {id:'pricing', label:'Membership — Scholar £29 / Elite £79', desc:'Tailored packs + corrections', icon:'£', href:'#membership'},
  {id:'resources', label:'Recurso gratiss', desc:'IELTS Band 9 PDF • TOEFL audio • Phrase bank', icon:'◈', href:'#resources'},
  {id:'consult', label:'Book Free 20-min Consult', desc:'Level check • roadmap • no card', icon:'→', href:'#contact'},
  {id:'about', label:'About Both Teachers', desc:'Native 12y + ÖSYM 5y specialist', icon:'★', href:'#about'},
];
let cmdActive=0;
function renderCmd(filter=''){
  if(!cmdResults) return;
  const f=filter.toLowerCase();
  const list = f ? commands.filter(c=> (c.label+c.desc).toLowerCase().includes(f)) : commands;
  cmdResults.innerHTML = list.map((c,i)=>`
    <div class="cmd-item ${i===cmdActive?'active':''}" role="option" data-href="${c.href}" data-idx="${i}">
      <span class="ci ${c.osym?'osym':''}">${c.icon}</span>
      <div><strong>${c.label}</strong><br><span>${c.desc}</span></div>
    </div>
  `).join('') || `<div style="padding:18px; text-align:center; color:var(--muted)">No results for “${filter}”</div>`;
  cmdResults.querySelectorAll('.cmd-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const href=el.getAttribute('data-href');
      cmdPalette.close();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
      history.pushState(null,'',href);
    });
  });
}
function openPalette(){
  if(!cmdPalette) return;
  cmdActive=0; renderCmd(''); cmdPalette.showModal(); setTimeout(()=>cmdInput.focus(),40);
}
document.getElementById('searchBtn')?.addEventListener('click', openPalette);
document.getElementById('searchBtnMobile')?.addEventListener('click', openPalette);
document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openPalette(); }
  if(cmdPalette?.open){
    if(e.key==='ArrowDown'){ e.preventDefault(); cmdActive=Math.min(cmdActive+1, commands.length-1); renderCmd(cmdInput.value); }
    if(e.key==='ArrowUp'){ e.preventDefault(); cmdActive=Math.max(cmdActive-1,0); renderCmd(cmdInput.value); }
    if(e.key==='Enter'){
      const active = cmdResults.querySelector('.cmd-item.active');
      active?.click();
    }
  }
});
cmdInput?.addEventListener('input', e=>{ cmdActive=0; renderCmd(e.target.value); });

// Prefetch on hover for contact (perceived perf)
document.querySelectorAll('a[href="#contact"]').forEach(a=>{
  a.addEventListener('mouseenter', ()=>{ const l=document.createElement('link'); l.rel='prefetch'; l.href='#contact'; document.head.appendChild(l); }, {once:true});
});

// Bottom bar hide on scroll down, show on up (thumb comfort)
let lastY=window.scrollY;
const bottomBar=document.getElementById('bottomBar');
window.addEventListener('scroll', ()=>{
  if(!bottomBar) return;
  const y=window.scrollY;
  const diff=y-lastY;
  if(y<200) bottomBar.style.transform='translateY(0)';
  else if(diff>8) bottomBar.style.transform='translateY(110%)';
  else if(diff<-8) bottomBar.style.transform='translateY(0)';
  lastY=y;
},{passive:true});
bottomBar && (bottomBar.style.transition='transform .22s ease');


// Language dropdown toggle
document.querySelectorAll('.lang-switch.dropdown').forEach(sw=>{
  const btn=sw.querySelector('.lang-btn');
  const menu=sw.querySelector('.lang-menu');
  btn?.addEventListener('click', e=>{
    e.stopPropagation();
    const open=sw.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});
document.addEventListener('click', ()=> document.querySelectorAll('.lang-switch.open').forEach(s=>{s.classList.remove('open'); s.querySelector('.lang-btn')?.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown', e=>{ if(e.key==='Escape') document.querySelectorAll('.lang-switch.open').forEach(s=>{s.classList.remove('open'); s.querySelector('.lang-btn')?.setAttribute('aria-expanded','false')})});

// Performance: lazy hydration for below-fold images already via loading="lazy"
