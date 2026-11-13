/* LIP-NIK — общий скрипт: меню, появление блоков, форма предзаказа, опрос */
document.documentElement.classList.add('js');

// ── Навигация ──
const nav = document.querySelector('.nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

const burger = document.querySelector('.burger');
const mmenu  = document.querySelector('.mmenu');
if (burger && mmenu) {
  const setMenu = open => { mmenu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  burger.addEventListener('click', () => setMenu(!mmenu.classList.contains('open')));
  mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

// ── Плавное появление блоков ──
const rv = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  rv.forEach(el => io.observe(el));
} else { rv.forEach(el => el.classList.add('in')); }

// ── Предзаказ ──
// ВАЖНО: токен бота виден в коде страницы. Перевыпустите его в @BotFather (/revoke) и вставьте новый.
const TG_TOKEN = '8697074188:AAEYUNWedE2_iK-zJVfLwoVX4RMgysXejms';
const TG_CHAT  = '565338476';
const CONSENT_VERSION = 'ред. 12.11.2026';
function tgSend(text){
  return fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({chat_id:TG_CHAT, text})
  }).catch(()=>{});
}
const pForm = document.getElementById('preorder-form');
if (pForm) {
  const pConsent = document.getElementById('pConsent');
  const pSubmit  = document.getElementById('pSubmit');
  const pError   = document.getElementById('pError');
  pConsent.addEventListener('change', () => { pSubmit.disabled = !pConsent.checked; });
  pForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('pName').value.trim();
    const tg   = document.getElementById('pTg').value.trim();
    const fail = msg => { pError.textContent = msg; pError.style.display = 'block'; };
    if (!name) return fail('Укажите ваше имя');
    if (!tg)   return fail('Укажите Telegram');
    if (!pConsent.checked) return fail('Отметьте согласие на обработку персональных данных');
    pError.style.display = 'none';
    pSubmit.textContent = 'Отправляем…'; pSubmit.disabled = true;
    const date = new Date().toLocaleString('ru-RU');
    tgSend(`🆕 Новый предзаказ LIP-NIK\n\n👤 Имя: ${name}\n📱 Telegram: ${tg}\n🕐 Дата: ${date}\n✅ Согласие на обработку ПДн: дано (${CONSENT_VERSION})`);
    setTimeout(() => {
      pForm.style.display = 'none';
      document.getElementById('preorder-success').style.display = 'block';
    }, 500);
  });
}

// ── Опрос о цене (анонимный) ──
document.querySelectorAll('.ps-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ps-option').forEach(b => { b.disabled = true; });
    btn.classList.add('chosen');
    tgSend(`💰 Опрос цены LIP-NIK\n\n📊 Ответ: ${btn.dataset.price}\n🕐 Дата: ${new Date().toLocaleString('ru-RU')}`);
    setTimeout(() => { document.getElementById('ps-success').style.display = 'block'; }, 300);
  });
});
