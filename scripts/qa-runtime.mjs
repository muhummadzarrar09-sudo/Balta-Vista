import { spawn } from 'node:child_process';

const port = 3200 + Math.floor(Math.random() * 1000);
const base = `http://127.0.0.1:${port}`;
const server = spawn('npm', ['run', 'start', '--', '-p', String(port)], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
let logs = '';
server.stdout.on('data', (d) => { logs += d.toString(); });
server.stderr.on('data', (d) => { logs += d.toString(); });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stop = () => {
  try { process.kill(-server.pid, 'SIGTERM'); } catch {}
};
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`${base}/api/health`);
      if (res.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`server did not start on ${base}\n${logs}`);
}

async function expectStatus(path, expected = 200) {
  const res = await fetch(`${base}${path}`);
  if (res.status !== expected) throw new Error(`${path} expected ${expected}, got ${res.status}`);
  return res;
}

try {
  await waitForServer();
  for (const route of ['/', '/rooms', '/booking', '/experience', '/location', '/design', '/reviews', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/opengraph-image', '/twitter-image']) {
    await expectStatus(route, 200);
  }

  const invalidBooking = await fetch(`${base}/api/booking`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: base },
    body: JSON.stringify({ bad: true })
  });
  if (invalidBooking.status !== 400) throw new Error(`invalid booking expected 400, got ${invalidBooking.status}`);

  const validBooking = await fetch(`${base}/api/booking`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: base },
    body: JSON.stringify({ checkIn: '2026-08-01', checkOut: '2026-08-03', room: 'double', name: 'QA Tester', email: 'qa@example.com', phone: '923001234567', guests: 2, arrivalWindow: 'afternoon', message: 'Runtime QA', companyWebsite: '' })
  });
  if (validBooking.status !== 200) throw new Error(`valid booking expected 200, got ${validBooking.status}`);
  const bookingJson = await validBooking.json();
  if (!String(bookingJson.reference || '').startsWith('BV-')) throw new Error('booking reference does not use BV- prefix');

  const event = await fetch(`${base}/api/events`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: base },
    body: JSON.stringify({ name: 'cta_click', path: '/', label: 'runtime_qa' })
  });
  if (event.status !== 200) throw new Error(`event expected 200, got ${event.status}`);

  console.log(`QA runtime passed on ${base}`);
} finally {
  stop();
  await sleep(300);
}
