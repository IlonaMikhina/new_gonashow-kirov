(() => {

/* ===== ГОУ НА ШОУ — app.js =====
   Рендерит контент из data.js и отвечает за интерактив.
   Контакты берутся из CONTACTS (data.js) .
*/

const S = window.SITE || {};
const C = window.CONTACTS || {};
const SERVICES = window.SERVICES || [];
const BUNDLES = window.BUNDLES || [];
const GALLERY = window.GALLERY || [];
const FAQ = window.FAQ || [];

function phoneText(){ return C.phone || "+7(912)726-60-26"; }
function phoneLink(){ return "tel:" + (C.phone || "+79127266026").replace(/[^+\d]/g,''); }

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderBundles();
  renderGallery();
  renderFaq();
  applyContacts();
  bindHeader();
  bindReveal();
  bindFaqToggles();
  bindForms();
  bindLightbox();
  bindNav();
  handleHashAnchor();
});

/* ---------- contacts ---------- */
function applyContacts(){
  document.querySelectorAll('[data-tel]').forEach(el => el.setAttribute('href', phoneLink()));
  document.querySelectorAll('[data-phone]').forEach(el => { el.textContent = phoneText(); });
  document.querySelectorAll('[data-tel-nikita]').forEach(el => el.setAttribute('href', 'tel:' + (C.phoneNikita || '+79539443323').replace(/[^+\d]/g, '')));
  document.querySelectorAll('[data-phone-nikita]').forEach(el => { el.textContent = C.phoneNikita || '+7(953)944-33-23'; });
  document.querySelectorAll('[data-vk]').forEach(el => el.setAttribute('href', C.vk || 'https://vk.ru/go_na_show43'));
  document.querySelectorAll('[data-email]').forEach(el => {
    el.textContent = C.email || 'hello@goushow.ru';
    el.setAttribute('href', 'mailto:' + (C.email || 'hello@goushow.ru'));
  });
  document.querySelectorAll('[data-region]').forEach(el => el.textContent = C.address || S.region);
}

/* ---------- render: services ---------- */
function renderServices(){
  const hosts = document.querySelectorAll('[data-render="services"]');
  if(!hosts.length || !SERVICES.length) return;
  hosts.forEach(host => {
    const offset = parseInt(host.getAttribute('data-offset') || '0', 10) || 0;
    let limit = host.getAttribute('data-limit');
    let list = SERVICES.slice(offset);
    if(limit && limit !== 'all') list = list.slice(0, parseInt(limit, 10));
    host.innerHTML = list.map(s => serviceCard(s)).join('');
  });
}

function serviceCard(s){
  const vars = (s.variants && s.variants.length)
    ? '<div class="chips">' + s.variants.map(v => '<span class="chip">' + v + '</span>').join('') + '</div>'
    : '';
  const img = s.image
    ? '<img src="'+s.image+'" alt="'+s.alt+'" loading="lazy">'
    : '<div class="thumb-ph" style="display:grid;place-items:center;height:100%;color:var(--muted);font-size:.9rem">Фото скоро</div>';
  return `
  <article class="card show-card reveal" id="${s.id}">
    <div class="thumb">${img}<span class="tag">${s.tag||''}</span></div>
    <div class="body">
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="meta">Аудитория: <b>${s.audience}</b></div>
      ${vars}
      <div class="price-row">
        <div class="price">${s.price}<small>${s.price.includes('от') ? ' ориентир' : ''}</small></div>
        <button class="btn btn-primary btn-sm" data-order="${s.id}">Заказать</button>
      </div>
    </div>
  </article>`;
}

/* ---------- render: bundles ---------- */
function renderBundles(){
  const host = document.querySelector('[data-render="bundles"]');
  if(!host || !BUNDLES.length) return;
  host.innerHTML = BUNDLES.map(b => `
    <article class="card benefit reveal" style="display:flex;flex-direction:column;gap:.6rem">
      <h3>${b.title}</h3>
      <p>${b.desc}</p>
      <div class="price" style="font-size:1rem">Цена — индивидуально</div>
    </article>`).join('');
}

/* ---------- render: gallery ---------- */
function renderGallery(){
  const host = document.querySelector('[data-render="gallery"]');
  if(!host || !GALLERY.length) return;
  host.innerHTML = GALLERY.map(g => `
    <div class="item reveal" data-lightbox="${g.url}">
      <img src="${g.url}" alt="${g.alt}" loading="lazy">
    </div>`).join('');
}

/* ---------- render: faq ---------- */
function renderFaq(){
  const host = document.querySelector('[data-render="faq"]');
  if(!host || !FAQ.length) return;
  host.innerHTML = FAQ.map(f => `
    <div class="faq-item">
      <button class="faq-q" type="button">${f.q}<span class="plus">+</span></button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>`).join('');
}

/* ---------- hash anchor ---------- */
function handleHashAnchor(){
  if(!location.hash) return;
  const id = location.hash.slice(1);
  if(!id) return;
  setTimeout(() => {
    const el = document.getElementById(id);
    if(el){ el.scrollIntoView({ behavior:'smooth', block:'start' }); }
  }, 150);
}

/* ---------- header ---------- */
function bindHeader(){
  const h = document.querySelector('.site-header');
  if(!h) return;
  const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll);
}
function bindNav(){
  const t = document.querySelector('.nav-toggle');
  if(!t) return;
  t.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.main-nav a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open')));
}

/* ---------- reveal ---------- */
function bindReveal(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold:.12 });
  els.forEach(e => io.observe(e));
}

/* ---------- faq toggles ---------- */
function bindFaqToggles(){
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement, a = item.querySelector('.faq-a');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0px';
      });
      if(!open){ item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });
}

/* ---------- lightbox ---------- */
function bindLightbox(){
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const url = el.getAttribute('data-lightbox');
      let lb = document.getElementById('lightbox');
      if(!lb){
        lb = document.createElement('div');
        lb.id = 'lightbox'; lb.className = 'lightbox';
        lb.innerHTML = '<span class="close">&times;</span><img alt="Просмотр фото">';
        document.body.appendChild(lb);
        lb.querySelector('.close').addEventListener('click', () => lb.classList.remove('open'));
        lb.addEventListener('click', e => { if(e.target === lb) lb.classList.remove('open'); });
      }
      lb.querySelector('img').src = url;
      lb.classList.add('open');
    });
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ const lb = document.getElementById('lightbox'); if(lb) lb.classList.remove('open'); }
  });
}

/* ---------- forms ---------- */
function bindForms(){
  document.querySelectorAll('form[data-order-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      let valid = true;
      form.querySelectorAll('[required]').forEach(f => {
        const field = f.closest('.field');
        const ok = f.value.trim().length > 0;
        if(field) field.classList.toggle('error', !ok);
        if(!ok) valid = false;
      });
      if(!valid){
        if(status){ status.className = 'form-status error'; status.textContent = 'Пожалуйста, заполните обязательные поля.'; }
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      const hook = form.getAttribute('data-hook');
      if(!hook){
        if(status){
          status.className = 'form-status warn';
          status.textContent = 'Форма пока не подключена к системе приёма заявок. Позвоните Илоне или Никите либо напишите ВКонтакте — поможем оформить заказ.';
        }
        return;
      }
      status.className = 'form-status'; status.textContent = 'Отправка…';
      fetch(hook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
        .then(r => { if(!r.ok) throw new Error();
          status.className = 'form-status ok'; status.textContent = 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.'; form.reset(); })
        .catch(() => { status.className = 'form-status error';
          status.textContent = 'Не удалось отправить заявку. Позвоните или напишите нам напрямую.'; });
    });
    form.querySelectorAll('input,select,textarea').forEach(f => {
      f.addEventListener('input', () => { const field = f.closest('.field');
        if(field && f.value.trim()) field.classList.remove('error'); });
    });
  });

  document.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-order');
      const form = document.querySelector('form[data-order-form]');
      if(!form) return;
      const sel = form.querySelector('select[name="service"]');
      if(sel){
        const opt = [...sel.options].find(o => o.value === id);
        if(opt) sel.value = id;
      }
      form.scrollIntoView({ behavior:'smooth', block:'center' });
    });
  });
}

})();
