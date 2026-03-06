function openModal() {
  document.getElementById('guestModal').classList.add('open');
}

function closeModal() {
  document.getElementById('guestModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('guestModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
});
