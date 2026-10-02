const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');

if (fs.existsSync(standaloneDir)) {
  // 1. Copy public folder to .next/standalone/public
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
    console.log('[standalone] Copied public/ to .next/standalone/public');
  }

  // 2. Copy .next/static folder to .next/standalone/.next/static
  const staticSrc = path.join(rootDir, '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
    console.log('[standalone] Copied .next/static/ to .next/standalone/.next/static');
  }

  console.log('✅ Standalone bundle is ready with full Tailwind CSS and static assets.');
}
