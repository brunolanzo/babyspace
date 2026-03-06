function switchTab(tab, el){
  document.querySelectorAll('.pay-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
}

function showSuccess(){
  document.getElementById('checkoutForm').style.display='none';
  const s = document.getElementById('successState');
  s.classList.add('show');
  window.scrollTo(0,0);
}
