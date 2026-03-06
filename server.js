const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use(express.static(path.join(__dirname, 'public')));

// Landing page
app.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'O espaço do seu bebê começa aqui',
    bodyClass: '',
    cssIncludes: '<link rel="stylesheet" href="/css/landing.css">',
    jsIncludes: '<script src="/js/landing.js"></script>'
  });
});

// Auth pages
app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Entrar',
    bodyClass: 'auth-body',
    cssIncludes: '<link rel="stylesheet" href="/css/auth.css">',
    jsIncludes: '<script src="/js/auth.js"></script><script src="/js/login.js"></script>'
  });
});

app.get('/cadastro', (req, res) => {
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

// Dashboard pages
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
  app.get(routePath, (req, res) => {
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

// Public pages
app.get('/convite', (req, res) => {
  res.render('pages/convite', {
    title: 'Chá da Helena',
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

app.listen(PORT, () => {
  console.log(`BabySpace running at http://localhost:${PORT}`);
});
