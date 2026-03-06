// Lista de Presentes — Modal logic for adding/editing gifts

function openModal() {
  document.getElementById('giftModal').classList.add('open');
}

function closeModal() {
  document.getElementById('giftModal').classList.remove('open');
}

// Close modal when clicking the overlay background
document.getElementById('giftModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
