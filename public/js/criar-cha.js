// Criar Chá — Stepper logic, type selection, theme selection, twins toggle, form validation

let currentStep = 0;
let selectedType = '';
let selectedTheme = 'Nuvens';
let isGemeos = false;

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

// ===== TWINS TOGGLE =====
function toggleGemeos() {
  var checkbox = document.getElementById('toggleGemeos');
  isGemeos = checkbox.checked;
  var group2 = document.getElementById('babyName2Group');
  var toggleText = document.getElementById('toggleText');
  var babyNameLabel = document.getElementById('babyNameLabel');

  if (isGemeos) {
    group2.style.display = 'block';
    toggleText.textContent = 'Sim, s\u00e3o g\u00eameos!';
    toggleText.classList.add('active');
    babyNameLabel.textContent = 'Nome do 1\u00ba beb\u00ea';
  } else {
    group2.style.display = 'none';
    toggleText.textContent = 'N\u00e3o, apenas um beb\u00ea';
    toggleText.classList.remove('active');
    babyNameLabel.textContent = 'Nome do beb\u00ea';
    document.getElementById('babyName2').value = '';
  }

  // Auto-update title suggestion placeholder
  autoSuggestTitle();
}

function autoSuggestTitle() {
  var name1 = document.getElementById('babyName').value.trim();
  var name2 = isGemeos ? document.getElementById('babyName2').value.trim() : '';
  var titleInput = document.getElementById('chaTitle');

  if (isGemeos && name1 && name2) {
    titleInput.placeholder = 'Ex: Ch\u00e1 da ' + name1 + ' e do(a) ' + name2;
  } else if (name1) {
    titleInput.placeholder = 'Ex: Ch\u00e1 da ' + name1;
  } else {
    titleInput.placeholder = 'Ex: Ch\u00e1 da Helena';
  }
}

// ===== REVIEW =====
function updateReview() {
  document.getElementById('revType').textContent = selectedType || '\u2014';

  var name1 = document.getElementById('babyName').value || '';
  var name2 = isGemeos ? (document.getElementById('babyName2').value || '') : '';
  var revBabyLabel = document.getElementById('revBabyLabel');

  if (isGemeos && name1 && name2) {
    document.getElementById('revBaby').textContent = name1 + ' e ' + name2;
    revBabyLabel.textContent = 'Nomes dos beb\u00eas';
  } else if (isGemeos && name1) {
    document.getElementById('revBaby').textContent = name1 + ' (+ g\u00eameo)';
    revBabyLabel.textContent = 'Nomes dos beb\u00eas';
  } else {
    document.getElementById('revBaby').textContent = name1 || '\u2014';
    revBabyLabel.textContent = 'Nome do beb\u00ea';
  }

  document.getElementById('revTitle').textContent = document.getElementById('chaTitle').value || '\u2014';
  document.getElementById('revDate').textContent = document.getElementById('chaDate').value || '\u2014';
  var mode = document.querySelector('input[name="mode"]:checked');
  document.getElementById('revMode').textContent = mode ? (mode.value === 'presencial' ? 'Presencial' : 'Online') : '\u2014';
  document.getElementById('revTheme').textContent = selectedTheme;
}

function publish() {
  alert('Ch\u00e1 publicado com sucesso! \uD83C\uDF89');
  window.location.href = '/dashboard';
}

// ===== COVER PHOTO UPLOAD =====
var coverFile = null;

function initUpload() {
  var zone = document.getElementById('uploadZone');
  var fileInput = document.getElementById('fileInput');
  var removeBtn = document.getElementById('removePhoto');

  // Click to select
  zone.addEventListener('click', function(e) {
    if (e.target === removeBtn || e.target.closest('.upload-remove')) return;
    fileInput.click();
  });

  // File selected
  fileInput.addEventListener('change', function() {
    if (fileInput.files && fileInput.files[0]) {
      handleFile(fileInput.files[0]);
    }
  });

  // Remove photo
  removeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    clearPreview();
  });

  // Drag & drop
  zone.addEventListener('dragover', function(e) {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    zone.classList.remove('drag-over');
    var files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  });
}

function handleFile(file) {
  // Validate type
  if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
    alert('Formato inv\u00e1lido. Use PNG, JPG ou WEBP.');
    return;
  }
  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Arquivo muito grande. M\u00e1ximo 5MB.');
    return;
  }

  coverFile = file;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = document.getElementById('previewImg');
    img.src = e.target.result;
    document.getElementById('uploadPlaceholder').style.display = 'none';
    document.getElementById('uploadPreview').style.display = 'block';
    document.getElementById('uploadZone').classList.add('has-preview');
  };
  reader.readAsDataURL(file);
}

function clearPreview() {
  coverFile = null;
  document.getElementById('previewImg').src = '';
  document.getElementById('uploadPlaceholder').style.display = '';
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('uploadZone').classList.remove('has-preview');
  document.getElementById('fileInput').value = '';
}

// ===== INIT =====
// Init first radio as checked
document.querySelector('.radio-label').classList.add('checked');

// Listen for baby name changes to auto-suggest title
document.getElementById('babyName').addEventListener('input', autoSuggestTitle);
document.getElementById('babyName2').addEventListener('input', autoSuggestTitle);

// Init upload zone
initUpload();
