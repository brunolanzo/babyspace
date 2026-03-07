document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var valid = true;
  var email = document.getElementById('email');
  var pass = document.getElementById('password');

  email.parentElement.classList.remove('has-error');
  pass.parentElement.parentElement.classList.remove('has-error');

  if (!email.value || !email.value.includes('@')) {
    email.parentElement.classList.add('has-error');
    valid = false;
  }
  if (!pass.value) {
    pass.parentElement.parentElement.classList.add('has-error');
    valid = false;
  }
  if (valid) {
    alert('Login com e-mail em breve! Por enquanto, use Google ou Facebook.');
  }
});
