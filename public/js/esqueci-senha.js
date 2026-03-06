var form = document.getElementById('resetForm');
var stateReq = document.getElementById('stateRequest');
var stateOk = document.getElementById('stateSuccess');
var emailInput = document.getElementById('email');
var emailDisplay = document.getElementById('emailDisplay');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!emailInput.value || !emailInput.value.includes('@')) {
    emailInput.style.borderColor = '#E74C3C';
    return;
  }
  emailDisplay.textContent = emailInput.value;
  stateReq.style.display = 'none';
  stateOk.style.display = 'block';
});

document.getElementById('resendBtn').addEventListener('click', function() {
  var fb = document.getElementById('resendFeedback');
  fb.classList.add('show');
  setTimeout(function() { fb.classList.remove('show'); }, 3000);
});
