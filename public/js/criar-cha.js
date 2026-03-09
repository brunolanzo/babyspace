// Criar Chá — Stepper logic, type selection, theme selection, twins toggle, publish API

// Guard: only run wizard JS if wizard DOM exists (not in summary view)
if (!document.getElementById('stepper')) {
  // Summary view mode — no wizard JS needed
} else {
(function() {

var currentStep = 0;
var selectedType = '';
var selectedTheme = 'Nuvens';
var isGemeos = false;
var coverFile = null;
var isPublishing = false;

// ===== STEPPER =====
window.updateStepper = function() {
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
};

window.nextStep = function() {
  if (currentStep < 3) {
    currentStep++;
    if (currentStep === 3) updateReview();
    updateStepper();
    window.scrollTo(0, 0);
  }
};

window.prevStep = function() {
  if (currentStep > 0) {
    currentStep--;
    updateStepper();
    window.scrollTo(0, 0);
  }
};

window.goToStep = function(n) {
  currentStep = n;
  updateStepper();
  window.scrollTo(0, 0);
};

// ===== TYPE & THEME SELECTION =====
window.selectType = function(el) {
  document.querySelectorAll('.type-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedType = el.dataset.type;
};

window.selectTheme = function(el) {
  document.querySelectorAll('.theme-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedTheme = el.dataset.theme;
};

window.selectRadio = function(el) {
  document.querySelectorAll('.radio-label').forEach(function(r) { r.classList.remove('checked'); });
  el.classList.add('checked');
  var v = el.querySelector('input').value;
  document.getElementById('locationGroup').style.display = v === 'presencial' ? 'block' : 'none';
};

// ===== TWINS TOGGLE =====
window.toggleGemeos = function() {
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
  autoSuggestTitle();
};

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

// ===== PUBLISH (real API call) =====
window.publish = function() {
  if (isPublishing) return;
  var mode = document.querySelector('input[name="mode"]:checked');
  var payload = {
    selectedType: selectedType,
    isGemeos: isGemeos,
    babyName: document.getElementById('babyName').value.trim(),
    babyName2: isGemeos ? document.getElementById('babyName2').value.trim() : '',
    chaTitle: document.getElementById('chaTitle').value.trim(),
    chaDate: document.getElementById('chaDate').value,
    chaDesc: document.getElementById('chaDesc').value.trim(),
    modality: mode ? mode.value : 'presencial',
    chaLocation: document.getElementById('chaLocation').value.trim(),
    selectedTheme: selectedTheme
  };

  if (!payload.selectedType) { alert('Selecione o tipo de ch\u00e1.'); goToStep(0); return; }
  if (!payload.chaTitle) { alert('Informe o t\u00edtulo do ch\u00e1.'); goToStep(1); return; }

  isPublishing = true;
  var btn = document.getElementById('publishBtn');
  btn.textContent = 'Salvando...';
  btn.disabled = true;

  var isEdit = !!window.__eventData;
  var url = isEdit ? '/api/events/me' : '/api/events';
  var method = isEdit ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) {
    if (!res.ok) return res.json().then(function(d) { throw new Error(d.error || 'Erro ao salvar'); });
    return res.json();
  })
  .then(function() {
    window.location.href = '/criar-cha';
  })
  .catch(function(err) {
    alert(err.message || 'Erro ao salvar o ch\u00e1.');
    btn.textContent = 'Publicar meu ch\u00e1 \u2728';
    btn.disabled = false;
    isPublishing = false;
  });
};

// ===== COVER PHOTO UPLOAD =====
function initUpload() {
  var zone = document.getElementById('uploadZone');
  var fileInput = document.getElementById('fileInput');
  var removeBtn = document.getElementById('removePhoto');

  zone.addEventListener('click', function(e) {
    if (e.target === removeBtn || e.target.closest('.upload-remove')) return;
    fileInput.click();
  });

  fileInput.addEventListener('change', function() {
    if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  removeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    clearPreview();
  });

  zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', function(e) { e.preventDefault(); zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', function(e) {
    e.preventDefault();
    zone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
}

function handleFile(file) {
  if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) { alert('Formato inv\u00e1lido. Use PNG, JPG ou WEBP.'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('Arquivo muito grande. M\u00e1ximo 5MB.'); return; }
  coverFile = file;
  var reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('previewImg').src = e.target.result;
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
document.querySelector('.radio-label').classList.add('checked');
document.getElementById('babyName').addEventListener('input', autoSuggestTitle);
document.getElementById('babyName2').addEventListener('input', autoSuggestTitle);
initUpload();

// ===== PRE-POPULATE IF EDITING =====
if (window.__eventData) {
  var e = window.__eventData;
  selectedType = e.selectedType || '';
  selectedTheme = e.selectedTheme || 'Nuvens';
  isGemeos = !!e.isGemeos;

  // Highlight selected type card
  document.querySelectorAll('.type-card').forEach(function(c) {
    c.classList.toggle('selected', c.dataset.type === selectedType);
  });

  // Fill form fields
  document.getElementById('babyName').value = e.babyName || '';
  if (e.isGemeos) {
    document.getElementById('toggleGemeos').checked = true;
    toggleGemeos();
    document.getElementById('babyName2').value = e.babyName2 || '';
  }
  document.getElementById('chaTitle').value = e.chaTitle || '';
  document.getElementById('chaDate').value = e.chaDate || '';
  document.getElementById('chaDesc').value = e.chaDesc || '';

  // Set modality radio
  var modeRadio = document.querySelector('input[name="mode"][value="' + (e.modality || 'presencial') + '"]');
  if (modeRadio) {
    modeRadio.checked = true;
    selectRadio(modeRadio.closest('.radio-label'));
  }
  document.getElementById('chaLocation').value = e.chaLocation || '';

  // Highlight selected theme
  document.querySelectorAll('.theme-card').forEach(function(c) {
    c.classList.toggle('selected', c.dataset.theme === selectedTheme);
  });

  autoSuggestTitle();
}

})(); // end IIFE
}
