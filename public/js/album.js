// Upload zone drag and drop visual
const uploadZone = document.getElementById('uploadZone');
uploadZone.addEventListener('dragover', e=>{e.preventDefault();uploadZone.classList.add('dragover')});
uploadZone.addEventListener('dragleave', ()=>uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', e=>{e.preventDefault();uploadZone.classList.remove('dragover');showToast('Fotos enviadas com sucesso!')});

// Lightbox
const photos = [
  {title:'Decoração da mesa', author:'Camila', label:'Decoração'},
  {title:'Bolo temático', author:'Camila', label:'Bolo'},
  {title:'Chegada dos convidados', author:'Ana', label:'Convidados'},
  {title:'Mesa de presentes', author:'Camila', label:'Presentes'},
  {title:'Brincadeiras', author:'João', label:'Brincadeiras'},
  {title:'Mamãe feliz', author:'Letícia', label:'Mamãe'},
  {title:'Lembrancinhas', author:'Camila', label:'Lembrancinhas'},
  {title:'Foto da família', author:'Maria', label:'Família'},
  {title:'Abrindo presentes', author:'Fernando', label:'Abrindo presentes'}
];
let currentPhoto = 0;

function openLightbox(idx){
  currentPhoto = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}

function navLightbox(dir){
  currentPhoto = (currentPhoto + dir + photos.length) % photos.length;
  updateLightbox();
}

function updateLightbox(){
  document.getElementById('lightboxTitle').textContent = photos[currentPhoto].title;
  document.getElementById('lightboxAuthor').textContent = 'Enviada por ' + photos[currentPhoto].author;
  document.getElementById('lightboxLabel').textContent = photos[currentPhoto].label;
}

// Keyboard nav
document.addEventListener('keydown', e=>{
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft') navLightbox(-1);
  if(e.key==='ArrowRight') navLightbox(1);
});
