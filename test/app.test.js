import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health reports ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('GET /api/quotes returns the seeded quotes', async () => {
  const res = await fetch(`${baseUrl}/api/quotes`);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  assert.ok(body.every((quote) => typeof quote.text === 'string'));
});

test('GET /api/quotes/random returns one quote', async () => {
  const res = await fetch(`${baseUrl}/api/quotes/random`);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(typeof body.id, 'number');
  assert.equal(typeof body.text, 'string');
});

test('POST /api/quotes creates a quote and defaults the author', async () => {
  const res = await fetch(`${baseUrl}/api/quotes`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '  Ship it.  ' }),
  });
  const body = await res.json();
  assert.equal(res.status, 201);
  assert.equal(body.text, 'Ship it.');
  assert.equal(body.author, 'Anonymous');
});

test('POST /api/quotes rejects an empty text', async () => {
  const res = await fetch(`${baseUrl}/api/quotes`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '   ' }),
  });
  assert.equal(res.status, 400);
});

test('unknown routes return 404 json', async () => {
  const res = await fetch(`${baseUrl}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error, 'Not found');
});
