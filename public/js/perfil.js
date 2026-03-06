function togglePass(id, btn) {
  var input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.color = 'var(--color-primary)';
  } else {
    input.type = 'password';
    btn.style.color = 'var(--color-text-light)';
  }
}

function checkStrength(val) {
  var score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  var colors = ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71'];
  var labels = ['Fraca', 'Média', 'Boa', 'Forte'];
  for (var i = 1; i <= 4; i++) {
    document.getElementById('seg' + i).style.background = i <= score ? colors[score - 1] : '#E8E2DF';
  }
  document.getElementById('strengthLabel').textContent = val ? labels[score - 1] || '' : '';
  document.getElementById('strengthLabel').style.color = val ? colors[score - 1] || '' : '';
}

function checkDelete() {
  var val = document.getElementById('deleteConfirm').value;
  document.getElementById('deleteBtn').disabled = val !== 'EXCLUIR';
}
