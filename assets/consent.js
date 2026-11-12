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
    '#ln-cookie{position:fixed;left:24px;right:24px;bottom:24px;max-width:560px;margin-left:auto;z-index:9999;' +
    'background:#141416;color:rgba(232,227,218,.88);border:1px solid rgba(255,255,255,.1);border-radius:2px;' +
    'padding:22px 24px;font-family:Geologica,sans-serif;font-weight:300;font-size:13px;line-height:1.65;' +
    'box-shadow:0 20px 60px rgba(0,0,0,.35);transform:translateY(16px);opacity:0;transition:all .35s}' +
    '#ln-cookie.show{transform:none;opacity:1}' +
    '#ln-cookie a{color:#A8CDB8}' +
    '#ln-cookie .lc-btns{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}' +
    '#ln-cookie button{font-family:inherit;font-size:11px;letter-spacing:2px;text-transform:uppercase;' +
    'padding:12px 22px;border-radius:2px;cursor:pointer;border:1px solid rgba(255,255,255,.18);' +
    'background:transparent;color:rgba(232,227,218,.88)}' +
    '#ln-cookie button.lc-accept{background:#C45C72;border-color:#C45C72;color:#fff}' +
    '@media(max-width:600px){#ln-cookie{left:12px;right:12px;bottom:12px}#ln-cookie button{flex:1}}';

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
