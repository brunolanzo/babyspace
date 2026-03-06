function togglePin(btn){
  const card = btn.closest('.mural-card');
  card.classList.toggle('pinned');
  const isPinned = card.classList.contains('pinned');
  if(isPinned){
    btn.textContent = '📌 Desafixar';
    const badge = document.createElement('span');
    badge.className = 'pin-badge';
    badge.textContent = '📌 Fixado';
    card.prepend(badge);
    showToast('Recado fixado!');
  } else {
    btn.textContent = '📌 Fixar';
    const badge = card.querySelector('.pin-badge');
    if(badge) badge.remove();
    showToast('Recado desafixado');
  }
}

function togglePending(){
  showToast('Filtro de pendentes aplicado');
}
