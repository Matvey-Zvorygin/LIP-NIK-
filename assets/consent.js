/* LIP-NIK: cookie-баннер. Яндекс Метрика загружается ТОЛЬКО после согласия посетителя. */
(function () {
  var KEY = 'lipnik_cookie_choice_v1';   // 'accepted' | 'declined'
  var METRIKA_ID = 109479852;

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadMetrika() {
    if (window.__lnMetrikaLoaded) return;
    window.__lnMetrikaLoaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');
    window.ym(METRIKA_ID, 'init', {
      ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer',
      referrer: document.referrer, url: location.href,
      accurateTrackBounce: true, trackLinks: true
    });
  }

  var css =
    '#ln-cookie{position:fixed;left:24px;right:48px;bottom:32px;max-width:520px;margin-left:auto;z-index:9999;' +
    'background:rgba(255,255,255,.86);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);' +
    'color:#4A4C52;border:1px solid rgba(22,23,26,.08);border-radius:22px;' +
    'padding:20px 22px;font-family:"Onest Variable",system-ui,sans-serif;font-weight:400;font-size:13px;line-height:1.6;' +
    'box-shadow:0 24px 60px -20px rgba(22,23,26,.25);transform:translateY(16px);opacity:0;transition:transform .5s cubic-bezier(.2,.8,.2,1),opacity .4s}' +
    '#ln-cookie.show{transform:none;opacity:1}' +
    '#ln-cookie a{color:#2F7C78;text-underline-offset:3px}' +
    '#ln-cookie .lc-btns{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}' +
    '#ln-cookie button{font-family:inherit;font-size:13px;font-weight:500;' +
    'padding:10px 20px;border-radius:999px;cursor:pointer;border:1px solid rgba(22,23,26,.14);' +
    'background:transparent;color:#16171A;transition:background .2s,color .2s,border-color .2s}' +
    '#ln-cookie button:hover{border-color:#16171A}' +
    '#ln-cookie button.lc-accept{background:#16171A;border-color:#16171A;color:#fff}' +
    '#ln-cookie button.lc-accept:hover{background:#2F7C78;border-color:#2F7C78}' +
    '@media(max-width:600px){#ln-cookie{left:20px;right:20px;bottom:20px}#ln-cookie button{flex:1}}';

  function showBanner() {
    if (document.getElementById('ln-cookie')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var b = document.createElement('div');
    b.id = 'ln-cookie';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Использование cookie');
    b.innerHTML =
      'Мы используем cookie и сервис «Яндекс Метрика», чтобы понимать, как посетители пользуются сайтом. ' +
      'Метрика включится только с вашего согласия. Подробнее — в ' +
      '<a href="privacy.html">Политике обработки персональных данных</a>.' +
      '<div class="lc-btns"><button class="lc-accept" type="button">Принять</button>' +
      '<button class="lc-decline" type="button">Отклонить</button></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add('show'); });
    b.querySelector('.lc-accept').onclick = function () { setChoice('accepted'); hide(b); loadMetrika(); };
    b.querySelector('.lc-decline').onclick = function () {
      var wasAccepted = getChoice() === 'accepted';
      setChoice('declined'); hide(b);
      if (wasAccepted) location.reload(); // выгрузить уже работающий счётчик
    };
  }
  function hide(b) { b.classList.remove('show'); setTimeout(function () { b.remove(); }, 350); }

  // Ссылка «Настройки cookie» в футере
  window.lnCookieSettings = function (e) { if (e) e.preventDefault(); showBanner(); };

  function start() {
    var c = getChoice();
    if (c === 'accepted') loadMetrika();
    else if (c !== 'declined') showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
