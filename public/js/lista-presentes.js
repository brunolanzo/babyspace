// Lista de Presentes — Gift selection logic (catalog data in gift-catalog.js)

// State
const selectedGifts = new Map(); // id -> { customPrice }
let saveTimeout = null;

// Load saved gifts from API
async function loadSavedGifts() {
  try {
    const res = await fetch('/api/gifts');
    const data = await res.json();
    if (data.gifts && data.gifts.length) {
      data.gifts.forEach(g => selectedGifts.set(g.productId, { customPrice: g.customPrice }));
    }
  } catch (e) { /* ignore */ }
  render();
}

// Save to API (debounced)
function saveGifts() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const gifts = [];
    selectedGifts.forEach((val, id) => {
      gifts.push({ productId: id, customPrice: val.customPrice });
    });
    try {
      await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gifts })
      });
    } catch (e) { /* ignore */ }
  }, 800);
}

// Update stats bar
function updateStats() {
  let count = selectedGifts.size;
  let total = 0;
  selectedGifts.forEach((val, id) => {
    const product = GIFT_CATALOG.find(p => p.id === id);
    total += val.customPrice != null ? val.customPrice : (product ? product.price : 0);
  });
  document.getElementById('statCount').textContent = count;
  document.getElementById('statValue').textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Toggle gift
function toggleGift(id) {
  if (selectedGifts.has(id)) {
    selectedGifts.delete(id);
  } else {
    const product = GIFT_CATALOG.find(p => p.id === id);
    selectedGifts.set(id, { customPrice: product.price });
  }
  updateCard(id);
  updateStats();
  saveGifts();
}

// Update single card UI
function updateCard(id) {
  const card = document.querySelector(`[data-gift-id="${id}"]`);
  if (!card) return;
  const isAdded = selectedGifts.has(id);
  card.classList.toggle('gift-card--added', isAdded);
  const btn = card.querySelector('.gift-btn');
  if (isAdded) {
    btn.className = 'gift-btn gift-btn--remove';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg> Remover';
  } else {
    btn.className = 'gift-btn gift-btn--add';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Adicionar';
  }
}

// Handle price edit
function onPriceChange(id, value) {
  const num = parseFloat(value.replace(',', '.'));
  if (isNaN(num) || num < 0) return;
  if (selectedGifts.has(id)) {
    selectedGifts.get(id).customPrice = num;
  }
  updateStats();
  saveGifts();
}

// Scroll a row left/right
function scrollRow(catId, direction) {
  const row = document.getElementById('scroll-' + catId);
  if (!row) return;
  const amount = 340;
  row.scrollBy({ left: direction * amount, behavior: 'smooth' });
}

// Render full catalog
function render() {
  const container = document.getElementById('catalogContainer');
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const products = GIFT_CATALOG.filter(p => p.cat === cat.id);
    if (!products.length) return;

    const section = document.createElement('div');
    section.className = 'category-section';

    // Header with title and info icon
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <h2 class="category-title">
        <span class="category-emoji">${cat.emoji}</span> ${cat.name}
        <span class="category-info" title="${products.length} itens disponíveis">i</span>
      </h2>
    `;
    section.appendChild(header);

    // Scroll wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'gifts-scroll-wrapper';

    // Left scroll button
    const btnLeft = document.createElement('button');
    btnLeft.className = 'scroll-btn scroll-btn--left';
    btnLeft.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';
    btnLeft.onclick = () => scrollRow(cat.id, -1);
    wrapper.appendChild(btnLeft);

    // Right scroll button
    const btnRight = document.createElement('button');
    btnRight.className = 'scroll-btn scroll-btn--right';
    btnRight.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>';
    btnRight.onclick = () => scrollRow(cat.id, 1);
    wrapper.appendChild(btnRight);

    const scrollRow_ = document.createElement('div');
    scrollRow_.className = 'gifts-scroll';
    scrollRow_.id = 'scroll-' + cat.id;

    products.forEach(product => {
      const isAdded = selectedGifts.has(product.id);
      const customPrice = isAdded ? selectedGifts.get(product.id).customPrice : product.price;

      const card = document.createElement('div');
      card.className = 'gift-card' + (isAdded ? ' gift-card--added' : '');
      card.dataset.giftId = product.id;

      card.innerHTML = `
        <div class="gift-thumb" style="background:${cat.color}30">
          <div class="gift-icon" style="color:${cat.color}">${CAT_ICONS[cat.id]}</div>
          ${isAdded ? '<div class="gift-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></div>' : ''}
        </div>
        <div class="gift-body">
          <div class="gift-name">${product.name}</div>
          <div class="gift-price-row">
            <span class="gift-currency">R$</span>
            <input type="text" class="gift-price-input" value="${customPrice.toFixed(2).replace('.', ',')}"
              onchange="onPriceChange('${product.id}', this.value)"
              onfocus="this.select()">
          </div>
          <button class="gift-btn ${isAdded ? 'gift-btn--remove' : 'gift-btn--add'}" onclick="toggleGift('${product.id}')">
            ${isAdded
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg> Remover'
              : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Adicionar'}
          </button>
        </div>
      `;
      scrollRow_.appendChild(card);
    });

    wrapper.appendChild(scrollRow_);
    section.appendChild(wrapper);
    container.appendChild(section);
  });

  updateStats();
}

// Init
loadSavedGifts();
