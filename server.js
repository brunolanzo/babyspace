require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('./config/passport');
const { ensureAuthenticated } = require('./middleware/auth');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directories exist
const dataDir = path.join(__dirname, 'data');
const sessionsDir = path.join(dataDir, 'sessions');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ===== PUBLIC PAGES =====

// Landing page
app.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'O espaço do seu bebê começa aqui',
    bodyClass: '',
    cssIncludes: '<link rel="stylesheet" href="/css/landing.css">',
    jsIncludes: '<script src="/js/landing.js"></script>'
  });
});

// Auth pages (redirect if already logged in)
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.render('pages/login', {
    title: 'Entrar',
    bodyClass: 'auth-body',
    cssIncludes: '<link rel="stylesheet" href="/css/auth.css">',
    jsIncludes: '<script src="/js/auth.js"></script><script src="/js/login.js"></script>'
  });
});

app.get('/cadastro', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.render('pages/cadastro', {
    title: 'Cadastro',
    bodyClass: 'auth-body',
    cssIncludes: '<link rel="stylesheet" href="/css/auth.css">',
    jsIncludes: '<script src="/js/auth.js"></script><script src="/js/cadastro.js"></script>'
  });
});

app.get('/esqueci-senha', (req, res) => {
  res.render('pages/esqueci-senha', {
    title: 'Recuperar Senha',
    bodyClass: 'auth-body',
    cssIncludes: '<link rel="stylesheet" href="/css/auth.css">',
    jsIncludes: '<script src="/js/esqueci-senha.js"></script>'
  });
});

// Public invite & checkout
app.get('/convite', (req, res) => {
  res.render('pages/convite', {
    title: 'Convite',
    bodyClass: '',
    cssIncludes: '<link rel="stylesheet" href="/css/convite.css">',
    jsIncludes: '<script src="/js/convite.js"></script>'
  });
});

app.get('/checkout', (req, res) => {
  res.render('pages/checkout', {
    title: 'Pagamento',
    bodyClass: '',
    cssIncludes: '<link rel="stylesheet" href="/css/checkout.css">',
    jsIncludes: '<script src="/js/checkout.js"></script>'
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

// ===== PROTECTED DASHBOARD PAGES =====

const dashboardPages = [
  { path: '/dashboard',        view: 'dashboard',        title: 'Painel',             activePage: 'dashboard',        pageCss: 'dashboard-home', pageJs: null,               showNotif: true },
  { path: '/criar-cha',        view: 'criar-cha',        title: 'Meu Chá',            activePage: 'criar-cha',        pageCss: 'criar-cha',      pageJs: 'criar-cha',        showNotif: false },
  { path: '/lista-presentes',  view: 'lista-presentes',  title: 'Lista de Presentes', activePage: 'lista-presentes',  pageCss: 'lista-presentes',pageJs: 'lista-presentes',  showNotif: false },
  { path: '/convidados',       view: 'convidados',       title: 'Convidados',         activePage: 'convidados',       pageCss: 'convidados',     pageJs: 'convidados',       showNotif: false },
  { path: '/mural',            view: 'mural',            title: 'Mural de Recados',   activePage: 'mural',            pageCss: 'mural',          pageJs: 'mural',            showNotif: false, hasToast: true },
  { path: '/album',            view: 'album',            title: 'Álbum de Fotos',     activePage: 'album',            pageCss: 'album',          pageJs: 'album',            showNotif: false, hasToast: true },
  { path: '/resgate',          view: 'resgate',          title: 'Resgate',            activePage: 'resgate',          pageCss: 'resgate',        pageJs: 'resgate',          showNotif: false, hasToast: true },
  { path: '/perfil',           view: 'perfil',           title: 'Perfil',             activePage: 'perfil',           pageCss: 'perfil',         pageJs: 'perfil',           showNotif: false, hasToast: true },
];

dashboardPages.forEach(({ path: routePath, view, title, activePage, pageCss, pageJs, showNotif, hasToast }) => {
  app.get(routePath, ensureAuthenticated, (req, res) => {
    const css = '<link rel="stylesheet" href="/css/dashboard.css">' +
                `<link rel="stylesheet" href="/css/pages/${pageCss}.css">`;
    let js = '<script src="/js/sidebar.js"></script>';
    if (hasToast) js += '<script src="/js/toast.js"></script>';
    if (pageJs) js += `<script src="/js/${pageJs}.js"></script>`;
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
