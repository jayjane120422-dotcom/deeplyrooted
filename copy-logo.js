const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', '..', '..', '.gemini', 'antigravity', 'brain', '0d0d767a-87b5-44b9-930f-972860940dd4', 'media__1777039340307.png');
const dest = path.join(__dirname, 'assets', 'images', 'logo.png');

fs.copyFileSync(src, dest);
console.log('✅ Logo successfully copied to assets/images/logo.png');
