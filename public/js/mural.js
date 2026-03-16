// Mural de Recados — Dashboard management (authenticated)

var allMessages = [];

async function loadMessages() {
  try {
    var res = await fetch('/api/messages');
    var data = await res.json();
    allMessages = data.messages || [];
    updateStats();
    renderMessages();
    loadShareUrl();
  } catch(e) {
    console.error('Error loading messages:', e);
  }
}

function updateStats() {
  var total = allMessages.length;
  var approved = allMessages.filter(m => m.status === 'approved').length;
  var pending = allMessages.filter(m => m.status === 'pending').length;
  var pinned = allMessages.filter(m => m.pinned).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statApproved').textContent = approved;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statPinned').textContent = pinned;
  document.getElementById('pendingCount').textContent = pending;
}

function renderMessages() {
  var grid = document.getElementById('muralGrid');
  if (!grid) return;

  var filter = document.getElementById('filterSelect').value;
  var search = (document.getElementById('searchBox').value || '').toLowerCase();

  var filtered = allMessages.filter(function(m) {
    if (filter === 'pinned' && !m.pinned) return false;
    if (filter === 'approved' && m.status !== 'approved') return false;
    if (filter === 'pending' && m.status !== 'pending') return false;
    if (search && m.guestName.toLowerCase().indexOf(search) === -1 && m.text.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  // Sort: pinned first, then by date
  filtered.sort(function(a, b) {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!filtered.length) {
    grid.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:48px 16px;color:var(--color-text-light)">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity:0.3;margin-bottom:16px"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
        '<p style="font-weight:600;color:var(--color-text);margin-bottom:4px;font-size:1.1rem">Nenhum recado ainda</p>' +
        '<p style="font-size:0.9rem;margin-bottom:16px">Compartilhe o link do mural para que amigos e familiares deixem mensagens carinhosas!</p>' +
        '<button class="btn btn-primary btn-sm" onclick="document.getElementById(\'shareModal\').classList.add(\'open\')">Compartilhar link do mural</button>' +
      '</div>';
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(function(msg) {
    var card = document.createElement('div');
    card.className = 'mural-card' + (msg.pinned ? ' pinned' : '');
    card.dataset.id = msg._id;

    var date = new Date(msg.createdAt);
    var dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    var initial = msg.guestName ? msg.guestName.charAt(0).toUpperCase() : '?';
    var statusBadge = msg.status === 'pending'
      ? '<span class="msg-status-badge pending">Pendente</span>'
      : '';

    card.innerHTML =
      (msg.pinned ? '<span class="pin-badge">Fixado</span>' : '') +
      statusBadge +
      '<div class="mural-card-header">' +
        '<div class="mural-avatar">' + initial + '</div>' +
        '<div><strong>' + escapeHtml(msg.guestName) + '</strong><br><small style="color:var(--color-text-light)">' + dateStr + '</small></div>' +
      '</div>' +
      '<p class="mural-card-text">' + escapeHtml(msg.text) + '</p>' +
      '<div class="mural-card-actions">' +
        '<button class="btn btn-outline btn-sm" onclick="togglePin(\'' + msg._id + '\')">' + (msg.pinned ? 'Desafixar' : 'Fixar') + '</button>' +
        (msg.status === 'pending'
          ? '<button class="btn btn-primary btn-sm" onclick="approveMsg(\'' + msg._id + '\')">Aprovar</button>'
          : '<button class="btn btn-outline btn-sm" onclick="approveMsg(\'' + msg._id + '\')">Ocultar</button>') +
        '<button class="btn btn-outline btn-sm" style="color:var(--color-accent)" onclick="deleteMsg(\'' + msg._id + '\')">Excluir</button>' +
      '</div>';

    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function togglePin(id) {
  try {
    var res = await fetch('/api/messages/' + id + '/pin', { method: 'PUT' });
    var data = await res.json();
    if (data.success) {
      var msg = allMessages.find(m => m._id === id);
      if (msg) msg.pinned = data.pinned;
      updateStats();
      renderMessages();
      showToast(data.pinned ? 'Recado fixado!' : 'Recado desafixado');
    }
  } catch(e) { console.error(e); }
}

async function approveMsg(id) {
  try {
    var res = await fetch('/api/messages/' + id + '/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    var data = await res.json();
    if (data.success) {
      var msg = allMessages.find(m => m._id === id);
      if (msg) msg.status = data.status;
      updateStats();
      renderMessages();
      showToast(data.status === 'approved' ? 'Recado aprovado!' : 'Recado ocultado');
    }
  } catch(e) { console.error(e); }
}

async function deleteMsg(id) {
  if (!confirm('Tem certeza que deseja excluir este recado?')) return;
  try {
    var res = await fetch('/api/messages/' + id, { method: 'DELETE' });
    var data = await res.json();
    if (data.success) {
      allMessages = allMessages.filter(m => m._id !== id);
      updateStats();
      renderMessages();
      showToast('Recado excluído');
    }
  } catch(e) { console.error(e); }
}

function filterMessages(type) {
  document.getElementById('filterSelect').value = type;
  renderMessages();
}

async function loadShareUrl() {
  try {
    var res = await fetch('/api/events/me');
    var data = await res.json();
    var urlEl = document.getElementById('shareUrl');
    if (data.event && data.event.slug) {
      var url = window.location.origin + '/convite/' + data.event.slug + '#muralSection';
      urlEl.textContent = url;
    } else {
      urlEl.textContent = 'Crie seu chá para gerar o link do mural';
    }
  } catch(e) {}
}

function copyShareLink() {
  var urlEl = document.getElementById('shareUrl');
  if (urlEl && navigator.clipboard) {
    navigator.clipboard.writeText(urlEl.textContent).then(function() {
      showToast('Link copiado!');
      document.getElementById('shareModal').classList.remove('open');
    });
  }
}

// Init
loadMessages();
