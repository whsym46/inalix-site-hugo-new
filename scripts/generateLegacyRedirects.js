const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const teamDir = path.join(publicDir, 'team');
const enDir = path.join(publicDir, 'en');
const enTeamDir = path.join(enDir, 'team');

function createRedirectHtml(targetUrl) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <link rel="canonical" href="${targetUrl}">
    <meta http-equiv="refresh" content="0; url=${targetUrl}">
    <script>window.location.replace("${targetUrl}");</script>
  </head>
  <body>
    <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a>...</p>
  </body>
</html>
`;
}

// 1. Pastikan /en/ redirect ke /
if (!fs.existsSync(enDir)) {
  fs.mkdirSync(enDir, { recursive: true });
}
fs.writeFileSync(path.join(enDir, 'index.html'), createRedirectHtml('/'));

// 2. Pastikan /en/team/ redirect ke /team/
if (!fs.existsSync(enTeamDir)) {
  fs.mkdirSync(enTeamDir, { recursive: true });
}
fs.writeFileSync(path.join(enTeamDir, 'index.html'), createRedirectHtml('/team/'));

// 3. Untuk setiap slug di public/team, generate public/en/team/<slug>/index.html
if (fs.existsSync(teamDir)) {
  const items = fs.readdirSync(teamDir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory() && item.name !== 'page') {
      const slug = item.name;
      const targetSlugDir = path.join(enTeamDir, slug);
      if (!fs.existsSync(targetSlugDir)) {
        fs.mkdirSync(targetSlugDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(targetSlugDir, 'index.html'),
        createRedirectHtml(`/team/${slug}/`)
      );
    }
  }
}

console.log('Legacy /en/ redirects generated successfully.');
