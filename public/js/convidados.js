// Convidados — Guest management from RSVP data

var allRsvps = [];

async function loadRsvps() {
  try {
    var res = await fetch('/api/rsvps');
    var data = await res.json();
    allRsvps = data.rsvps || [];
    updateStats();
    renderGuests();
  } catch(e) {
    console.error('Error loading RSVPs:', e);
  }
}

function updateStats() {
  var totalPeople = 0;
  var totalCompanions = 0;
  var totalChildren = 0;

  allRsvps.forEach(function(r) {
    totalPeople += r.totalGuests || 1;
    var comps = r.companions || [];
    totalCompanions += comps.length;
    comps.forEach(function(c) {
      if (c.isChild) totalChildren++;
    });
  });

  document.getElementById('statTotal').textContent = totalPeople;
  document.getElementById('statRsvps').textContent = allRsvps.length;
  document.getElementById('statCompanions').textContent = totalCompanions;
  document.getElementById('statChildren').textContent = totalChildren;
}

function renderGuests() {
  var search = (document.getElementById('searchBox').value || '').toLowerCase();
  var filtered = allRsvps.filter(function(r) {
    if (search && r.guestName.toLowerCase().indexOf(search) === -1) return false;
    return true;
  });

  renderTable(filtered);
  renderMobile(filtered);
}

function renderTable(list) {
  var tbody = document.getElementById('guestsTable');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;padding:48px 16px;color:var(--color-text-light)">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="opacity:0.3;margin-bottom:12px"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' +
        '<p style="font-weight:600;color:var(--color-text);margin-bottom:4px">Nenhuma confirmação ainda</p>' +
        '<p style="font-size:0.85rem">Compartilhe o convite para receber confirmações de presença</p>' +
      '</td></tr>';
    return;
  }

  var html = '';
  list.forEach(function(r) {
    var comps = r.companions || [];
    var children = comps.filter(function(c) { return c.isChild; });
    var date = new Date(r.createdAt);
    var dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    var initial = r.guestName.charAt(0).toUpperCase();

    // Companions detail
    var compDetail = '';
    if (comps.length > 0) {
      compDetail = comps.map(function(c) {
        var label = esc(c.name);
        if (c.isChild) label += ' <span class="badge badge-child">' + (c.childAge ? c.childAge + ' anos' : 'criança') + '</span>';
        return label;
      }).join(', ');
    } else {
      compDetail = '<span style="color:var(--color-text-light)">—</span>';
    }

    html +=
      '<tr>' +
        '<td><div style="display:flex;align-items:center;gap:10px">' +
          '<div class="guest-avatar">' + initial + '</div>' +
          '<div><strong>' + esc(r.guestName) + '</strong>' +
          (comps.length > 0 ? '<br><small style="color:var(--color-text-light)">+ ' + comps.length + ' acompanhante(s)</small>' : '') +
          '</div></div></td>' +
        '<td>' + compDetail + '</td>' +
        '<td>' + (children.length > 0 ? children.length : '<span style="color:var(--color-text-light)">—</span>') + '</td>' +
        '<td>' + dateStr + '</td>' +
        '<td><button class="btn-icon" onclick="removeRsvp(\'' + r._id + '\')" title="Remover"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button></td>' +
      '</tr>';
  });
  tbody.innerHTML = html;
}

function renderMobile(list) {
  var container = document.getElementById('guestsMobile');
  if (!container) return;

  if (!list.length) {
    container.innerHTML =
      '<div style="text-align:center;padding:32px 16px;color:var(--color-text-light)">' +
        '<p style="font-weight:600;color:var(--color-text)">Nenhuma confirmação ainda</p>' +
        '<p style="font-size:0.85rem">Compartilhe o convite para receber confirmações</p>' +
      '</div>';
    return;
  }

  var html = '';
  list.forEach(function(r) {
    var comps = r.companions || [];
    var children = comps.filter(function(c) { return c.isChild; });
    var date = new Date(r.createdAt);
    var dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    var initial = r.guestName.charAt(0).toUpperCase();

    html +=
      '<div class="guest-card-mobile">' +
        '<div class="guest-card-header">' +
          '<div class="guest-avatar">' + initial + '</div>' +
          '<div><strong>' + esc(r.guestName) + '</strong><br><small style="color:var(--color-text-light)">' + dateStr + '</small></div>' +
        '</div>';

    if (comps.length > 0) {
      html += '<div class="guest-card-companions">';
      comps.forEach(function(c) {
        html += '<div class="companion-tag">' + esc(c.name);
        if (c.isChild) html += ' <span class="badge badge-child">' + (c.childAge ? c.childAge + 'a' : 'criança') + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<div class="guest-card-footer">' +
      '<span>' + r.totalGuests + ' pessoa(s)</span>' +
      (children.length > 0 ? '<span>' + children.length + ' criança(s)</span>' : '') +
    '</div></div>';
  });
  container.innerHTML = html;
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function removeRsvp(id) {
  if (!confirm('Remover esta confirmação de presença?')) return;
  try {
    var res = await fetch('/api/rsvps/' + id, { method: 'DELETE' });
    var data = await res.json();
    if (data.success) {
      allRsvps = allRsvps.filter(function(r) { return r._id !== id; });
      updateStats();
      renderGuests();
    }
  } catch(e) { console.error(e); }
}

// Init
loadRsvps();
