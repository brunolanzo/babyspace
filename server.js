require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('./config/passport');
const { ensureAuthenticated } = require('./middleware/auth');
const path = require('path');
const fs = require('fs');
const Datastore = require('nedb-promises');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const ASSET_V = Date.now(); // cache-buster for static assets

// Ensure data directories exist
const dataDir = path.join(__dirname, 'data');
const sessionsDir = path.join(dataDir, 'sessions');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Events database
const eventsDb = Datastore.create({ filename: path.join(__dirname, 'data', 'events.db'), autoload: true });

// Multer setup for cover photo uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, uploadsDir); },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + '-cover-' + Date.now() + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) cb(null, true);
    else cb(new Error('Formato invalido'), false);
  }
});

// Slug helpers
function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
async function uniqueSlug(base) {
  var slug = base;
  var suffix = 0;
  while (await eventsDb.findOne({ slug: slug })) {
    suffix++;
    slug = base + '-' + suffix;
  }
  return slug;
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files & body parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  store: new FileStore({
    path: sessionsDir,
    ttl: 86400 * 7,
    retries: 0
  }),
  secret: process.env.SESSION_SECRET || 'babyspace-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Make user + asset version available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.v = ASSET_V;
  next();
});

// ===== PUBLIC PAGES =====

// Landing page
app.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'O espaço do seu bebê começa aqui',
    bodyClass: '',
    cssIncludes: `<link rel="stylesheet" href="/css/landing.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/landing.js?v=${ASSET_V}"></script>`
  });
});

// Auth pages (redirect if already logged in)
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.render('pages/login', {
    title: 'Entrar',
    bodyClass: 'auth-body',
    cssIncludes: `<link rel="stylesheet" href="/css/auth.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/auth.js?v=${ASSET_V}"></script><script src="/js/login.js?v=${ASSET_V}"></script>`
  });
});

app.get('/cadastro', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.render('pages/cadastro', {
    title: 'Cadastro',
    bodyClass: 'auth-body',
    cssIncludes: `<link rel="stylesheet" href="/css/auth.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/auth.js?v=${ASSET_V}"></script><script src="/js/cadastro.js?v=${ASSET_V}"></script>`
  });
});

app.get('/esqueci-senha', (req, res) => {
  res.render('pages/esqueci-senha', {
    title: 'Recuperar Senha',
    bodyClass: 'auth-body',
    cssIncludes: `<link rel="stylesheet" href="/css/auth.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/esqueci-senha.js?v=${ASSET_V}"></script>`
  });
});

// Public invite page — redirect to slug if logged in
app.get('/convite', async (req, res) => {
  if (req.isAuthenticated()) {
    const event = await eventsDb.findOne({ userId: req.user._id });
    if (event && event.slug) return res.redirect('/convite/' + event.slug);
  }
  res.render('pages/convite', {
    title: 'Convite', bodyClass: '', event: null,
    cssIncludes: `<link rel="stylesheet" href="/css/convite.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/convite.js?v=${ASSET_V}"></script>`
  });
});

// Public invite page with slug
app.get('/convite/:slug', async (req, res) => {
  const event = await eventsDb.findOne({ slug: req.params.slug });
  if (!event) {
    return res.render('pages/convite', {
      title: 'Convite', bodyClass: '', event: null,
      cssIncludes: `<link rel="stylesheet" href="/css/convite.css?v=${ASSET_V}">`,
      jsIncludes: `<script src="/js/convite.js?v=${ASSET_V}"></script>`
    });
  }
  res.render('pages/convite', {
    title: event.chaTitle + ' — Convite', bodyClass: '', event: event,
    cssIncludes: `<link rel="stylesheet" href="/css/convite.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/pregnancy-utils.js?v=${ASSET_V}"></script><script src="/js/convite.js?v=${ASSET_V}"></script>`
  });
});

app.get('/checkout', (req, res) => {
  res.render('pages/checkout', {
    title: 'Pagamento',
    bodyClass: '',
    cssIncludes: `<link rel="stylesheet" href="/css/checkout.css?v=${ASSET_V}">`,
    jsIncludes: `<script src="/js/checkout.js?v=${ASSET_V}"></script>`
  });
});

// ===== OAUTH ROUTES =====

// Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

// Logout
app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// ===== EVENT API ROUTES =====

// Create event (one per user)
app.post('/api/events', ensureAuthenticated, async (req, res) => {
  try {
    const existing = await eventsDb.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({ error: 'Você já possui um chá criado.' });
    }
    const { selectedType, isGemeos, babyName, babyName2, chaTitle, chaDate, chaDesc, modality, chaLocation, selectedTheme, pregnancyWeeks, weekCountDay } = req.body;
    if (!selectedType || !chaTitle) {
      return res.status(400).json({ error: 'Tipo de chá e título são obrigatórios.' });
    }
    const slug = await uniqueSlug(generateSlug(chaTitle));
    const event = await eventsDb.insert({
      userId: req.user._id,
      selectedType,
      isGemeos: !!isGemeos,
      babyName: babyName || '',
      babyName2: babyName2 || '',
      chaTitle,
      chaDate: chaDate || null,
      chaDesc: chaDesc || '',
      modality: modality || 'presencial',
      chaLocation: chaLocation || '',
      selectedTheme: selectedTheme || 'Nuvens',
      pregnancyWeeks: parseInt(pregnancyWeeks) || null,
      weekCountDay: parseInt(weekCountDay) || 0,
      slug: slug,
      coverPhoto: null,
      coverPosition: 50,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Erro ao criar o chá.' });
  }
});

// Get current user's event
app.get('/api/events/me', ensureAuthenticated, async (req, res) => {
  try {
    const event = await eventsDb.findOne({ userId: req.user._id });
    res.json({ event: event || null });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Erro ao buscar o chá.' });
  }
});

// Update event
app.put('/api/events/me', ensureAuthenticated, async (req, res) => {
  try {
    const existing = await eventsDb.findOne({ userId: req.user._id });
    if (!existing) {
      return res.status(404).json({ error: 'Nenhum chá encontrado.' });
    }
    const { selectedType, isGemeos, babyName, babyName2, chaTitle, chaDate, chaDesc, modality, chaLocation, selectedTheme, pregnancyWeeks, weekCountDay } = req.body;
    const updates = {
      selectedType: selectedType || existing.selectedType,
      isGemeos: isGemeos !== undefined ? !!isGemeos : existing.isGemeos,
      babyName: babyName !== undefined ? babyName : existing.babyName,
      babyName2: babyName2 !== undefined ? babyName2 : existing.babyName2,
      chaTitle: chaTitle || existing.chaTitle,
      chaDate: chaDate !== undefined ? chaDate : existing.chaDate,
      chaDesc: chaDesc !== undefined ? chaDesc : existing.chaDesc,
      modality: modality || existing.modality,
      chaLocation: chaLocation !== undefined ? chaLocation : existing.chaLocation,
      selectedTheme: selectedTheme || existing.selectedTheme,
      pregnancyWeeks: pregnancyWeeks !== undefined ? (parseInt(pregnancyWeeks) || null) : existing.pregnancyWeeks,
      weekCountDay: weekCountDay !== undefined ? (parseInt(weekCountDay) || 0) : existing.weekCountDay,
      updatedAt: new Date()
    };
    // Regenerate slug if title changed
    if (chaTitle && chaTitle !== existing.chaTitle) {
      updates.slug = await uniqueSlug(generateSlug(chaTitle));
    }
    await eventsDb.update({ _id: existing._id }, { $set: updates });
    const updated = await eventsDb.findOne({ _id: existing._id });
    res.json({ success: true, event: updated });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Erro ao atualizar o chá.' });
  }
});

// Upload cover photo
app.post('/api/events/cover', ensureAuthenticated, upload.single('cover'), async (req, res) => {
  try {
    const existing = await eventsDb.findOne({ userId: req.user._id });
    if (!existing) return res.status(404).json({ error: 'Nenhum chá encontrado.' });
    // Delete old cover file if exists
    if (existing.coverPhoto) {
      const oldPath = path.join(__dirname, existing.coverPhoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const coverPath = '/uploads/' + req.file.filename;
    const coverPosition = parseInt(req.body.coverPosition) || 50;
    await eventsDb.update({ _id: existing._id }, { $set: { coverPhoto: coverPath, coverPosition: coverPosition, updatedAt: new Date() } });
    res.json({ success: true, coverPhoto: coverPath });
  } catch (err) {
    console.error('Error uploading cover:', err);
    res.status(500).json({ error: 'Erro ao salvar a foto.' });
  }
});

// ===== PROTECTED DASHBOARD PAGES =====

// Dashboard (custom: loads event data)
app.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const event = await eventsDb.findOne({ userId: req.user._id });
  const css = `<link rel="stylesheet" href="/css/dashboard.css?v=${ASSET_V}">` +
              `<link rel="stylesheet" href="/css/pages/dashboard-home.css?v=${ASSET_V}">`;
  const js = `<script src="/js/pregnancy-utils.js?v=${ASSET_V}"></script>` +
             `<script src="/js/sidebar.js?v=${ASSET_V}"></script>`;
  res.render('pages/dashboard', {
    title: 'Painel', bodyClass: '', cssIncludes: css, jsIncludes: js,
    activePage: 'dashboard', pageTitle: 'Painel', showNotif: true,
    event: event || null
  });
});

// Meu Chá (custom: loads event data for view/edit mode)
app.get('/criar-cha', ensureAuthenticated, async (req, res) => {
  const event = await eventsDb.findOne({ userId: req.user._id });
  const editMode = req.query.edit === '1';
  const css = `<link rel="stylesheet" href="/css/dashboard.css?v=${ASSET_V}">` +
              `<link rel="stylesheet" href="/css/pages/criar-cha.css?v=${ASSET_V}">`;
  const js = `<script src="/js/pregnancy-utils.js?v=${ASSET_V}"></script>` +
             `<script src="/js/sidebar.js?v=${ASSET_V}"></script>` +
             `<script src="/js/criar-cha.js?v=${ASSET_V}"></script>`;
  res.render('pages/criar-cha', {
    title: 'Meu Chá', bodyClass: '', cssIncludes: css, jsIncludes: js,
    activePage: 'criar-cha', pageTitle: 'Meu Chá', showNotif: false,
    event: event || null, editMode: editMode
  });
});

// Remaining dashboard pages (generic loop)
const dashboardPages = [
  { path: '/lista-presentes',  view: 'lista-presentes',  title: 'Lista de Presentes', activePage: 'lista-presentes',  pageCss: 'lista-presentes',pageJs: 'lista-presentes',  showNotif: false },
  { path: '/convidados',       view: 'convidados',       title: 'Convidados',         activePage: 'convidados',       pageCss: 'convidados',     pageJs: 'convidados',       showNotif: false },
  { path: '/mural',            view: 'mural',            title: 'Mural de Recados',   activePage: 'mural',            pageCss: 'mural',          pageJs: 'mural',            showNotif: false, hasToast: true },
  { path: '/album',            view: 'album',            title: 'Álbum de Fotos',     activePage: 'album',            pageCss: 'album',          pageJs: 'album',            showNotif: false, hasToast: true },
  { path: '/resgate',          view: 'resgate',          title: 'Resgate',            activePage: 'resgate',          pageCss: 'resgate',        pageJs: 'resgate',          showNotif: false, hasToast: true },
  { path: '/perfil',           view: 'perfil',           title: 'Perfil',             activePage: 'perfil',           pageCss: 'perfil',         pageJs: 'perfil',           showNotif: false, hasToast: true },
];

dashboardPages.forEach(({ path: routePath, view, title, activePage, pageCss, pageJs, showNotif, hasToast }) => {
  app.get(routePath, ensureAuthenticated, (req, res) => {
    const css = `<link rel="stylesheet" href="/css/dashboard.css?v=${ASSET_V}">` +
                `<link rel="stylesheet" href="/css/pages/${pageCss}.css?v=${ASSET_V}">`;
    let js = `<script src="/js/sidebar.js?v=${ASSET_V}"></script>`;
    if (hasToast) js += `<script src="/js/toast.js?v=${ASSET_V}"></script>`;
    if (pageJs) js += `<script src="/js/${pageJs}.js?v=${ASSET_V}"></script>`;
    res.render(`pages/${view}`, {
      title,
      bodyClass: '',
      cssIncludes: css,
      jsIncludes: js,
      activePage,
      pageTitle: title,
      showNotif: showNotif || false
    });
  });
});

app.listen(PORT, () => {
  console.log(`BabySpace running at http://localhost:${PORT}`);
});
