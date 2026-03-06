document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var hamburger = document.getElementById('hamburgerBtn');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
    });
  }
});
