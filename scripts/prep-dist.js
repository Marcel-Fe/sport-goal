// Macht dist/ GitHub-Pages-tauglich: .nojekyll, 404.html (SPA), App-Icon + Manifest.
const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '..', 'dist');
const base = '/sport-goal';

// .nojekyll (sonst wird _expo ignoriert)
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

// Icon kopieren
fs.copyFileSync(path.resolve(__dirname, '..', 'assets', 'images', 'icon.png'), path.join(dist, 'icon.png'));

// Web-Manifest (Android "Zum Startbildschirm")
const manifest = {
  name: 'SPORT GOAL',
  short_name: 'SPORT GOAL',
  start_url: base + '/',
  scope: base + '/',
  display: 'standalone',
  background_color: '#0A0E18',
  theme_color: '#0A0E18',
  icons: [{ src: base + '/icon.png', sizes: '1024x1024', type: 'image/png', purpose: 'any maskable' }],
};
fs.writeFileSync(path.join(dist, 'manifest.json'), JSON.stringify(manifest));

// In index.html Icon/Manifest/Theme einfügen
const inject =
  `<link rel="apple-touch-icon" href="${base}/icon.png">` +
  `<link rel="icon" type="image/png" href="${base}/icon.png">` +
  `<link rel="manifest" href="${base}/manifest.json">` +
  `<meta name="theme-color" content="#0A0E18">` +
  `<meta name="apple-mobile-web-app-capable" content="yes">` +
  `<meta name="mobile-web-app-capable" content="yes">` +
  `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` +
  `<meta name="apple-mobile-web-app-title" content="SPORT GOAL">`;

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!html.includes('apple-touch-icon')) html = html.replace('</head>', inject + '</head>');
fs.writeFileSync(path.join(dist, 'index.html'), html);

// 404.html = SPA-Fallback (Kopie)
fs.writeFileSync(path.join(dist, '404.html'), html);

console.log('PREP DONE');
