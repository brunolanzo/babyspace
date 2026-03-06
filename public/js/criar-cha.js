// Criar Chá — Stepper logic, type selection, theme selection, form validation

let currentStep = 0;
let selectedType = '';
let selectedTheme = 'Nuvens';

function updateStepper() {
  document.querySelectorAll('.step-wrap').forEach(function(w, i) {
    w.classList.remove('active', 'done');
    if (i < currentStep) w.classList.add('done');
    if (i === currentStep) w.classList.add('active');
    var c = w.querySelector('.step-circle');
    c.textContent = i < currentStep ? '\u2713' : (i + 1);
  });
  document.querySelectorAll('.stepper-row .step-line').forEach(function(l, i) {
    l.classList.toggle('done', i < currentStep);
  });
  document.querySelectorAll('.step-content').forEach(function(s, i) {
    s.classList.toggle('active', i === currentStep);
  });
}

function nextStep() {
  if (currentStep < 3) {
    if (currentStep === 3) updateReview();
    currentStep++;
    if (currentStep === 3) updateReview();
    updateStepper();
    window.scrollTo(0, 0);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    updateStepper();
    window.scrollTo(0, 0);
  }
}

function goToStep(n) {
  currentStep = n;
  updateStepper();
  window.scrollTo(0, 0);
}

function selectType(el) {
  document.querySelectorAll('.type-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedType = el.dataset.type;
}

function selectTheme(el) {
  document.querySelectorAll('.theme-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedTheme = el.dataset.theme;
}

function selectRadio(el) {
  document.querySelectorAll('.radio-label').forEach(function(r) { r.classList.remove('checked'); });
  el.classList.add('checked');
  var v = el.querySelector('input').value;
  document.getElementById('locationGroup').style.display = v === 'presencial' ? 'block' : 'none';
}

function updateReview() {
  document.getElementById('revType').textContent = selectedType || '\u2014';
  document.getElementById('revBaby').textContent = document.getElementById('babyName').value || '\u2014';
  document.getElementById('revTitle').textContent = document.getElementById('chaTitle').value || '\u2014';
  document.getElementById('revDate').textContent = document.getElementById('chaDate').value || '\u2014';
  var mode = document.querySelector('input[name="mode"]:checked');
  document.getElementById('revMode').textContent = mode ? (mode.value === 'presencial' ? 'Presencial' : 'Online') : '\u2014';
  document.getElementById('revTheme').textContent = selectedTheme;
}

function publish() {
  alert('Chá publicado com sucesso! 🎉');
  window.location.href = '/dashboard';
}

// Init first radio as checked
document.querySelector('.radio-label').classList.add('checked');
