// Convite — Countdown, pregnancy badge, share, RSVP, gifts, mural

(function() {

var eventData = window.__conviteEvent;
if (!eventData) return;

var slug = eventData.slug;
var apiBase = '/api/public/' + slug;

// ===== COUNTDOWN =====
if (eventData.chaDate) {
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
if (eventData.pregnancyWeeks && typeof calculateCurrentWeek === 'function') {
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

// ===== RSVP =====
var companionCount = 0;

function getStoredName() {
  try { return localStorage.getItem('babyspace_guest_name') || ''; } catch(e) { return ''; }
}
function storeName(name) {
  try { localStorage.setItem('babyspace_guest_name', name); } catch(e) {}
}

// Pre-fill name from localStorage
var rsvpNameEl = document.getElementById('rsvpName');
if (rsvpNameEl) {
  var stored = getStoredName();
  if (stored) rsvpNameEl.value = stored;
}

var addBtn = document.getElementById('addCompanionBtn');
if (addBtn) {
  addBtn.addEventListener('click', function() {
    companionCount++;
    var container = document.getElementById('companionsContainer');
    var row = document.createElement('div');
    row.className = 'companion-row';
    row.id = 'comp-' + companionCount;
    row.innerHTML =
      '<div class="companion-fields">' +
        '<input type="text" class="form-input comp-name" placeholder="Nome do acompanhante" required>' +
        '<label class="companion-child-label">' +
          '<input type="checkbox" class="comp-child-check" onchange="toggleChildAge(this)"> É criança?' +
        '</label>' +
        '<input type="number" class="form-input comp-age" placeholder="Idade" min="0" max="17" style="display:none">' +
      '</div>' +
      '<button type="button" class="btn-remove-comp" onclick="removeCompanion(\'' + companionCount + '\')">&times;</button>';
    container.appendChild(row);
  });
}

window.toggleChildAge = function(checkbox) {
  var row = checkbox.closest('.companion-row');
  var ageInput = row.querySelector('.comp-age');
  ageInput.style.display = checkbox.checked ? 'block' : 'none';
  if (!checkbox.checked) ageInput.value = '';
};

window.removeCompanion = function(id) {
  var row = document.getElementById('comp-' + id);
  if (row) row.remove();
};

var rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var name = document.getElementById('rsvpName').value.trim();
    if (!name) return;

    var companions = [];
    document.querySelectorAll('.companion-row').forEach(function(row) {
      var cName = row.querySelector('.comp-name').value.trim();
      var isChild = row.querySelector('.comp-child-check').checked;
      var childAge = row.querySelector('.comp-age').value;
      if (cName) {
        companions.push({ name: cName, isChild: isChild, childAge: isChild ? parseInt(childAge) || null : null });
      }
    });

    try {
      var res = await fetch(apiBase + '/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, companions: companions })
      });
      if (res.ok) {
        storeName(name);
        document.getElementById('rsvpForm').style.display = 'none';
        document.getElementById('rsvpSuccess').style.display = 'block';
        // Pre-fill other name fields
        var cartName = document.getElementById('cartGuestName');
        if (cartName && !cartName.value) cartName.value = name;
        var msgNameEl = document.getElementById('msgName');
        if (msgNameEl && !msgNameEl.value) msgNameEl.value = name;
      }
    } catch(err) { console.error('RSVP error:', err); }
  });
}

// ===== GIFTS =====
var cart = new Map(); // productId -> { name, price }

async function loadPublicGifts() {
  var grid = document.getElementById('publicGiftsGrid');
  var emptyEl = document.getElementById('emptyGifts');
  if (!grid) return;

  try {
    var res = await fetch(apiBase + '/gifts');
    var data = await res.json();
    var gifts = data.gifts || [];

    if (!gifts.length) {
      grid.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      // Hide entire gift section if no gifts
      var section = document.getElementById('giftSection');
      if (section) section.style.display = 'none';
      return;
    }

    // Build catalog lookup
    var catalogMap = {};
    if (typeof GIFT_CATALOG !== 'undefined') {
      GIFT_CATALOG.forEach(function(p) { catalogMap[p.id] = p; });
    }

    // Group by category
    var byCategory = {};
    gifts.forEach(function(g) {
      var product = catalogMap[g.productId];
      if (!product) return;
      var catId = product.cat;
      if (!byCategory[catId]) byCategory[catId] = [];
      byCategory[catId].push({ ...product, customPrice: g.customPrice, purchased: g.purchased });
    });

    grid.innerHTML = '';

    // Get categories in order
    var catOrder = (typeof CATEGORIES !== 'undefined') ? CATEGORIES : [];
    catOrder.forEach(function(cat) {
      var items = byCategory[cat.id];
      if (!items || !items.length) return;

      var catSection = document.createElement('div');
      catSection.className = 'public-cat-section';
      catSection.innerHTML = '<h3 class="public-cat-title"><span>' + cat.emoji + '</span> ' + cat.name + '</h3>';

      var row = document.createElement('div');
      row.className = 'public-gifts-row';

      items.forEach(function(item) {
        var card = document.createElement('div');
        card.className = 'public-gift-card' + (item.purchased ? ' public-gift-card--purchased' : '');
        card.dataset.id = item.id;

        var icon = (typeof CAT_ICONS !== 'undefined' && CAT_ICONS[cat.id]) ? CAT_ICONS[cat.id] : '';
        var price = item.customPrice || item.price;

        card.innerHTML =
          '<div class="pgift-thumb" style="background:' + cat.color + '30">' +
            '<div class="pgift-icon" style="color:' + cat.color + '">' + icon + '</div>' +
            (item.purchased ? '<div class="pgift-purchased-badge">Presenteado ✓</div>' : '') +
          '</div>' +
          '<div class="pgift-body">' +
            '<div class="pgift-name">' + item.name + '</div>' +
            '<div class="pgift-price">R$ ' + price.toFixed(2).replace('.', ',') + '</div>' +
            (item.purchased
              ? '<button class="btn btn-outline btn-sm" disabled>Presenteado</button>'
              : '<button class="btn btn-primary btn-sm pgift-add-btn" onclick="addToCart(\'' + item.id + '\', \'' + item.name.replace(/'/g, "\\'") + '\', ' + price + ')">🎁 Presentear</button>'
            ) +
          '</div>';

        row.appendChild(card);
      });

      catSection.appendChild(row);
      grid.appendChild(catSection);
    });

  } catch(err) {
    console.error('Error loading gifts:', err);
  }
}

window.addToCart = function(productId, name, price) {
  if (cart.has(productId)) {
    cart.delete(productId);
  } else {
    cart.set(productId, { name: name, price: price });
  }
  updateCartUI();
  // Toggle button state
  var card = document.querySelector('[data-id="' + productId + '"]');
  if (card) {
    var btn = card.querySelector('.pgift-add-btn');
    if (btn) {
      if (cart.has(productId)) {
        btn.textContent = '✓ No carrinho';
        btn.className = 'btn btn-outline btn-sm pgift-add-btn pgift-in-cart';
      } else {
        btn.innerHTML = '🎁 Presentear';
        btn.className = 'btn btn-primary btn-sm pgift-add-btn';
      }
    }
  }
};

function updateCartUI() {
  var bar = document.getElementById('cartBar');
  var countEl = document.getElementById('cartCount');
  var totalEl = document.getElementById('cartTotal');
  if (!bar) return;

  var count = cart.size;
  var total = 0;
  cart.forEach(function(v) { total += v.price; });

  if (count > 0) {
    bar.style.display = 'flex';
    countEl.textContent = count;
    totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  } else {
    bar.style.display = 'none';
  }
}

window.openCartModal = function() {
  var modal = document.getElementById('cartModal');
  var itemsEl = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartModalTotal');
  if (!modal) return;

  var total = 0;
  var html = '';
  cart.forEach(function(v, id) {
    total += v.price;
    html += '<div class="cart-item">' +
      '<span class="cart-item-name">' + v.name + '</span>' +
      '<span class="cart-item-price">R$ ' + v.price.toFixed(2).replace('.', ',') + '</span>' +
      '<button class="cart-item-remove" onclick="removeFromCart(\'' + id + '\')">&times;</button>' +
    '</div>';
  });

  itemsEl.innerHTML = html || '<p style="text-align:center;color:#999">Carrinho vazio</p>';
  totalEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  // Pre-fill guest name
  var guestInput = document.getElementById('cartGuestName');
  if (guestInput && !guestInput.value) {
    guestInput.value = getStoredName();
  }

  // Reset purchase state
  document.getElementById('purchaseBtn').style.display = 'block';
  document.getElementById('purchaseSuccess').style.display = 'none';

  modal.style.display = 'flex';
};

window.closeCartModal = function() {
  document.getElementById('cartModal').style.display = 'none';
};

window.removeFromCart = function(id) {
  cart.delete(id);
  updateCartUI();
  openCartModal(); // refresh modal
  // Update card button
  var card = document.querySelector('[data-id="' + id + '"]');
  if (card) {
    var btn = card.querySelector('.pgift-add-btn');
    if (btn) {
      btn.innerHTML = '🎁 Presentear';
      btn.className = 'btn btn-primary btn-sm pgift-add-btn';
    }
  }
};

window.submitPurchase = async function() {
  var name = document.getElementById('cartGuestName').value.trim();
  if (!name) { alert('Por favor, informe seu nome.'); return; }
  if (cart.size === 0) return;

  var items = [];
  cart.forEach(function(v, id) {
    items.push({ productId: id, name: v.name, price: v.price });
  });

  try {
    var res = await fetch(apiBase + '/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName: name, items: items, paymentMethod: 'pix' })
    });
    if (res.ok) {
      storeName(name);
      document.getElementById('purchaseBtn').style.display = 'none';
      document.getElementById('purchaseSuccess').style.display = 'block';

      // Mark purchased cards
      cart.forEach(function(v, id) {
        var card = document.querySelector('[data-id="' + id + '"]');
        if (card) {
          card.classList.add('public-gift-card--purchased');
          var btn = card.querySelector('.pgift-add-btn');
          if (btn) { btn.textContent = 'Presenteado'; btn.disabled = true; btn.className = 'btn btn-outline btn-sm'; }
          var thumb = card.querySelector('.pgift-thumb');
          if (thumb && !thumb.querySelector('.pgift-purchased-badge')) {
            thumb.insertAdjacentHTML('beforeend', '<div class="pgift-purchased-badge">Presenteado ✓</div>');
          }
        }
      });

      cart.clear();
      updateCartUI();
    }
  } catch(err) { console.error('Purchase error:', err); }
};

// ===== MURAL =====
async function loadMessages() {
  var wall = document.getElementById('messagesWall');
  if (!wall) return;

  try {
    var res = await fetch(apiBase + '/messages');
    var data = await res.json();
    var messages = data.messages || [];

    if (!messages.length) {
      wall.innerHTML = '<p class="mural-empty">Seja o primeiro a deixar um recado! 💬</p>';
      return;
    }

    wall.innerHTML = '';
    messages.forEach(function(msg) {
      wall.appendChild(createMessageCard(msg));
    });
  } catch(err) { console.error('Error loading messages:', err); }
}

function createMessageCard(msg) {
  var card = document.createElement('div');
  card.className = 'msg-card';
  var date = new Date(msg.createdAt);
  var dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  card.innerHTML =
    '<div class="msg-card-header">' +
      '<div class="msg-avatar">' + (msg.guestName ? msg.guestName.charAt(0).toUpperCase() : '?') + '</div>' +
      '<div class="msg-meta"><strong>' + msg.guestName + '</strong><span>' + dateStr + '</span></div>' +
    '</div>' +
    '<p class="msg-text">' + msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
  return card;
}

var msgForm = document.getElementById('messageForm');
if (msgForm) {
  msgForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var name = document.getElementById('msgName').value.trim();
    var text = document.getElementById('msgText').value.trim();
    if (!name || !text) return;

    try {
      var res = await fetch(apiBase + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, text: text })
      });
      if (res.ok) {
        var data = await res.json();
        storeName(name);
        // Prepend new message
        var wall = document.getElementById('messagesWall');
        var emptyMsg = wall.querySelector('.mural-empty');
        if (emptyMsg) emptyMsg.remove();
        wall.prepend(createMessageCard(data.message));
        // Show success briefly
        document.getElementById('messageForm').style.display = 'none';
        document.getElementById('msgSuccess').style.display = 'block';
        setTimeout(function() {
          document.getElementById('messageForm').style.display = 'block';
          document.getElementById('msgSuccess').style.display = 'none';
          document.getElementById('msgText').value = '';
        }, 3000);
      }
    } catch(err) { console.error('Message error:', err); }
  });

  // Pre-fill message name
  var msgNameEl = document.getElementById('msgName');
  if (msgNameEl) {
    var sn = getStoredName();
    if (sn) msgNameEl.value = sn;
  }
}

// ===== INIT =====
loadPublicGifts();
loadMessages();

})();
