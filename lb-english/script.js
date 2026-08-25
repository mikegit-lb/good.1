// Mobile nav
const hamburger = document.getElementById('hamburger');
const navWrap = document.getElementById('nav');
hamburger?.addEventListener('click', ()=> navWrap.classList.toggle('open'));

// Smooth reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('in');
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// Sticky nav shadow
const nav = document.getElementById('nav');
let lastY=0;
window.addEventListener('scroll', ()=>{
  if(window.scrollY>10) nav.style.boxShadow='0 6px 30px rgba(11,36,71,.08)';
  else nav.style.boxShadow='none';
},{passive:true});

// Billing toggle
const toggleWrap = document.querySelector('.billing-toggle');
const toggleBtn = document.getElementById('billingToggle');
const billMonthly = document.getElementById('billMonthly');
const billYearly = document.getElementById('billYearly');
let yearly=false;
function setBilling(v){
  yearly=v;
  toggleWrap.classList.toggle('yearly', yearly);
  billMonthly.classList.toggle('active', !yearly);
  billYearly.classList.toggle('active', yearly);
  document.querySelectorAll('.price strong[data-monthly]').forEach(el=>{
    const m=el.getAttribute('data-monthly');
    const y=el.getAttribute('data-yearly');
    el.textContent = yearly ? '£'+y : '£'+m;
    // update suffix
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
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 4200);
}

window.openLead = (source)=>{
  leadSource.value = source;
  leadKicker.textContent = 'Free Resource';
  leadTitle.textContent = source;
  leadDesc.textContent = 'Enter your email — instant download, plus one useful follow-up. No spam. GDPR safe.';
  leadModal.showModal();
}
window.openCheckout = (plan)=>{
  // Simulate checkout — capture email then toast
  const p = yearly ? 'Yearly' : 'Monthly';
  showToast(`Great choice — ${plan} (${p}) — checkout opening (demo). Your spot will be held for 15 min.`);
  setTimeout(()=> openLead(plan + ' — ' + p + ' Membership'), 900);
}
window.handleLead = (e)=>{
  e.preventDefault();
  const email = document.getElementById('leadEmail').value;
  const source = document.getElementById('leadSource').value;
  leadModal.close();
  showToast(`Sent! Check ${email} for "${source}" — if not in inbox, check spam. Welcome to L.B. English Co.`);
  e.target.reset();
}
window.handleBooking = (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get('firstName');
  const goal = fd.get('goal');
  e.target.reset();
  showToast(`Thank you, ${name}! Your free call request for "${goal}" is received. We’ll email you within 6 hours to confirm your slot.`);
  // close mobile menu if open
  navWrap.classList.remove('open');
  // gentle confetti
  if(window.confetti) window.confetti();
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a=>{
  a.addEventListener('click', ()=> navWrap.classList.remove('open'));
});

// FAQ single-open optional
const details = document.querySelectorAll('.faq-list details');
details.forEach(d=>{
  d.addEventListener('toggle', ()=>{
    if(d.open) details.forEach(o=>{ if(o!==d) o.open=false });
  });
});

// Counter animation
const counters = document.querySelectorAll('[data-count]');
const cObserver = new IntersectionObserver((entries)=>{
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

// Keyboard trap for dialogs: close on backdrop click
document.querySelectorAll('dialog').forEach(d=>{
  d.addEventListener('click', (e)=>{
    const rect=d.getBoundingClientRect();
    if(e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom){
      d.close();
    }
  });
});
