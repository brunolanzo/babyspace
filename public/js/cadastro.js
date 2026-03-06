// Password strength
var pwd = document.getElementById('password');
var bars = [document.getElementById('sb1'),document.getElementById('sb2'),document.getElementById('sb3'),document.getElementById('sb4')];
var strengthLabel = document.getElementById('strengthLabel');
var colors = ['#E74C3C','#F39C12','#FFE5A0','#A8D8B9'];
var labels = ['Fraca','Média','Boa','Forte'];

pwd.addEventListener('input', function() {
  var v = this.value;
  var score = 0;
  if (v.length >= 4) score++;
  if (v.length >= 6) score++;
  if (v.length >= 8 && /[A-Z]/.test(v)) score++;
  if (v.length >= 8 && /[0-9]/.test(v) && /[A-Z]/.test(v) && /[a-z]/.test(v)) score++;

  bars.forEach(function(b, i) {
    b.style.background = i < score ? colors[score - 1] : '#E8E2DF';
  });
  strengthLabel.textContent = v.length > 0 ? labels[Math.max(0, score - 1)] : '';
  strengthLabel.style.color = v.length > 0 ? colors[Math.max(0, score - 1)] : 'transparent';
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var valid = true;
  document.querySelectorAll('.form-group').forEach(function(g) { g.classList.remove('has-error'); });

  var name = document.getElementById('name');
  var email = document.getElementById('email');
  var pass = document.getElementById('password');
  var confirm = document.getElementById('confirmPass');
  var date = document.getElementById('dueDate');
  var terms = document.getElementById('terms');

  if (!name.value.trim()) { name.closest('.form-group').classList.add('has-error'); valid = false; }
  if (!email.value.includes('@')) { email.closest('.form-group').classList.add('has-error'); valid = false; }
  if (pass.value.length < 8) { pass.closest('.form-group').classList.add('has-error'); valid = false; }
  if (confirm.value !== pass.value) { confirm.closest('.form-group').classList.add('has-error'); valid = false; }
  if (!date.value) { date.closest('.form-group').classList.add('has-error'); valid = false; }
  if (!terms.checked) { alert('Você precisa aceitar os termos para continuar.'); valid = false; }

  if (valid) window.location.href = '/dashboard';
});
