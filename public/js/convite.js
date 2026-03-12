// Convite — Real countdown, pregnancy badge, share functions

(function() {

// ===== COUNTDOWN =====
var eventData = window.__conviteEvent;
if (eventData && eventData.chaDate) {
  var target = new Date(eventData.chaDate + 'T12:00:00');

  function updateCountdown() {
    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minsEl = document.getElementById('mins');
    var secsEl = document.getElementById('secs');
    if (!daysEl) return;

    var now = new Date();
    var diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = d;
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ===== PREGNANCY BADGE =====
if (eventData && eventData.pregnancyWeeks && typeof calculateCurrentWeek === 'function') {
  var el = document.getElementById('convitePregnancy');
  if (el) {
    var currentWeek = calculateCurrentWeek(eventData.pregnancyWeeks, eventData.weekCountDay || 0, eventData.createdAt);
    var fruit = getFruitForWeek(currentWeek);
    el.innerHTML =
      '<span class="pregnancy-badge-emoji">' + fruit.emoji + '</span>' +
      '<span class="pregnancy-badge-text"><strong>' + currentWeek + ' semanas</strong> — do tamanho de um(a) ' + fruit.fruit.toLowerCase() + ' ' + fruit.size + '</span>';
  }
}

// ===== SHARE =====
window.shareWhatsApp = function() {
  var url = window.location.href;
  var text = 'Venha celebrar conosco! ';
  window.open('https://wa.me/?text=' + encodeURIComponent(text + url), '_blank');
};

window.copyLink = function() {
  var url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function() {
      showCopyFeedback();
    });
  } else {
    var input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showCopyFeedback();
  }
};

function showCopyFeedback() {
  var btn = document.querySelector('.share-copy');
  if (!btn) return;
  var original = btn.innerHTML;
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg> Copiado!';
  btn.style.borderColor = '#4a9d6e';
  btn.style.color = '#4a9d6e';
  setTimeout(function() {
    btn.innerHTML = original;
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 2000);
}

})();
