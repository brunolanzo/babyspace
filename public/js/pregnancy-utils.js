// Shared pregnancy week calculator + fruit comparison
// Used by: dashboard, criar-cha summary, convite

var FRUIT_MAP = [
  { week: 4,  fruit: 'Semente de papoula', emoji: '🌱', size: '~2mm' },
  { week: 6,  fruit: 'Lentilha', emoji: '🫘', size: '~5mm' },
  { week: 8,  fruit: 'Framboesa', emoji: '🫐', size: '~1,5cm' },
  { week: 10, fruit: 'Morango', emoji: '🍓', size: '~3cm' },
  { week: 12, fruit: 'Limão', emoji: '🍋', size: '~5cm' },
  { week: 14, fruit: 'Pêssego', emoji: '🍑', size: '~8cm' },
  { week: 16, fruit: 'Abacate', emoji: '🥑', size: '~11cm' },
  { week: 18, fruit: 'Batata-doce', emoji: '🍠', size: '~14cm' },
  { week: 20, fruit: 'Banana', emoji: '🍌', size: '~16cm' },
  { week: 22, fruit: 'Mamão', emoji: '🥭', size: '~19cm' },
  { week: 24, fruit: 'Espiga de milho', emoji: '🌽', size: '~21cm' },
  { week: 26, fruit: 'Alface', emoji: '🥬', size: '~23cm' },
  { week: 28, fruit: 'Berinjela', emoji: '🍆', size: '~25cm' },
  { week: 30, fruit: 'Repolho', emoji: '🥬', size: '~27cm' },
  { week: 32, fruit: 'Coco', emoji: '🥥', size: '~29cm' },
  { week: 34, fruit: 'Abacaxi', emoji: '🍍', size: '~32cm' },
  { week: 36, fruit: 'Melão', emoji: '🍈', size: '~34cm' },
  { week: 38, fruit: 'Mini melancia', emoji: '🍉', size: '~35cm' },
  { week: 40, fruit: 'Melancia', emoji: '🍉', size: '~36cm' }
];

function calculateCurrentWeek(pregnancyWeeks, weekCountDay, createdAt) {
  if (!pregnancyWeeks) return null;
  var created = new Date(createdAt);
  created.setHours(0, 0, 0, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  // Count how many times weekCountDay has passed since creation
  var weeksElapsed = 0;
  var d = new Date(created);
  d.setDate(d.getDate() + 1); // start from day after creation
  while (d <= today) {
    if (d.getDay() === weekCountDay) weeksElapsed++;
    d.setDate(d.getDate() + 1);
  }
  return Math.min(pregnancyWeeks + weeksElapsed, 42); // cap at 42 weeks
}

function getFruitForWeek(week) {
  if (!week) return FRUIT_MAP[0];
  var match = FRUIT_MAP[0];
  for (var i = 0; i < FRUIT_MAP.length; i++) {
    if (week >= FRUIT_MAP[i].week) match = FRUIT_MAP[i];
  }
  return match;
}

function renderPregnancyBanner(containerId, pregnancyWeeks, weekCountDay, createdAt) {
  var el = document.getElementById(containerId);
  if (!el || !pregnancyWeeks) return;
  var currentWeek = calculateCurrentWeek(pregnancyWeeks, weekCountDay, createdAt);
  var fruit = getFruitForWeek(currentWeek);
  el.innerHTML =
    '<div class="pregnancy-fruit">' + fruit.emoji + '</div>' +
    '<div class="pregnancy-info">' +
      '<div class="pregnancy-week">' + currentWeek + ' semanas</div>' +
      '<div class="pregnancy-comparison">Do tamanho de um(a) <strong>' + fruit.fruit.toLowerCase() + '</strong> ' + fruit.size + '</div>' +
    '</div>';
  el.style.display = '';
}
