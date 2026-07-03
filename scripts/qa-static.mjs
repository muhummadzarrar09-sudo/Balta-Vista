import fs from 'node:fs';
import path from 'node:path';

const fail = (message) => {
  console.error(`QA static failed: ${message}`);
  process.exit(1);
};

const requiredFiles = [
  'app/page.tsx',
  'app/rooms/page.tsx',
  'app/booking/page.tsx',
  'app/experience/page.tsx',
  'app/location/page.tsx',
  'app/design/page.tsx',
  'app/reviews/page.tsx',
  'app/api/booking/route.ts',
  'app/api/events/route.ts',
  'app/api/health/route.ts',
  'proxy.ts'
];
for (const file of requiredFiles) if (!fs.existsSync(file)) fail(`missing ${file}`);
if (fs.existsSync('middleware.ts')) fail('deprecated middleware.ts exists; use proxy.ts');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.dependencies?.['framer-motion'] || packageJson.devDependencies?.['framer-motion']) fail('framer-motion dependency is forbidden');
if (packageJson.name !== 'balta-vista-nathiagali-mvp') fail('package name does not match Balta Vista');

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.npm', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?|md|html|css|json)$/.test(entry.name) || entry.name === '.env.example') sourceFiles.push(full);
  }
}
for (const dir of ['app', 'components', 'lib', 'docs', 'brochure']) walk(dir);
sourceFiles.push('README.md', 'PROJECT_STRUCTURE.md', 'package.json', '.env.example');

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (/Pine & Peak|pine-peak|Pine%20%26%20Peak/.test(text)) fail(`old brand reference in ${file}`);
  if (/#fff|#ffffff|bg-white|text-white/.test(text) && /^(app|components|lib|public|brochure)\//.test(file)) fail(`pure white token in ${file}`);
}

const env = fs.readFileSync('.env.example', 'utf8');
const envKeys = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'BOOKING_WEBHOOK_URL',
  'BOOKING_WEBHOOK_SECRET',
  'ANALYTICS_WEBHOOK_URL',
  'ANALYTICS_WEBHOOK_SECRET',
  'FORCE_HTTPS'
];
for (const key of envKeys) if (!env.includes(`${key}=`)) fail(`missing env key ${key}`);

const assetRefFiles = ['app/page.tsx', 'app/layout.tsx', 'app/rooms/page.tsx', 'app/experience/page.tsx', 'app/reviews/page.tsx', 'brochure/balta-vista-brochure.html'];
const refs = [];
for (const file of assetRefFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:src="|src: '|image:\s*`\$\{siteUrl\})(\/assets\/[^'"`)]+)/g)) refs.push([file, match[1]]);
  for (const match of text.matchAll(/\.\.\/public\/(assets\/[^"']+)/g)) refs.push([file, `/${match[1]}`]);
}
for (const [file, ref] of refs) {
  const assetPath = path.join('public', ref.replace(/^\//, ''));
  if (!fs.existsSync(assetPath)) fail(`missing asset ${ref} referenced from ${file}`);
}

console.log(`QA static passed: ${requiredFiles.length} required files, ${sourceFiles.length} source files, ${refs.length} asset refs checked.`);
