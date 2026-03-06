function selectPill(el){document.querySelectorAll('.radio-pill').forEach(p=>p.classList.remove('selected'));el.classList.add('selected')}

// Countdown
const target = new Date();
target.setDate(target.getDate() + 45);
function updateCountdown(){
  const now = new Date();
  const diff = target - now;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m = Math.floor((diff%(1000*60*60))/(1000*60));
  const s = Math.floor((diff%(1000*60))/1000);
  document.getElementById('days').textContent = d;
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('mins').textContent = String(m).padStart(2,'0');
  document.getElementById('secs').textContent = String(s).padStart(2,'0');
}
setInterval(updateCountdown, 1000);
updateCountdown();
