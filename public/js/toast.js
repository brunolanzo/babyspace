function showToast(msg) {
  var t = document.getElementById('toast');
  var m = document.getElementById('toastMsg');
  if (t && m) {
    m.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 3000);
  }
}
