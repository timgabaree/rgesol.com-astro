import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import { TOPICS } from '../worker/contact.ts';

const source = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('home identifies projected savings and attributes results to Tim leadership experience', async () => {
  const home = parse(await source('src/pages/index.astro'));
  const proof = home.querySelector('#proof');
  assert.match(proof.textContent, /Selected leadership experience/);
  assert.match(proof.textContent, /Tim Gabaree’s technology leadership roles/);
  const savings = proof.querySelector('.metric');
  assert.equal(savings.querySelector('strong').textContent.trim(), '$25M');
  assert.match(savings.textContent, /Projected savings identified through modernization, analytics, and financial controls/);
  assert.match(proof.textContent, /\$115M/);
  assert.match(proof.textContent, /100\+/);
});

test('About is complete and all three search descriptions match structured page descriptions', async () => {
  const about = await source('src/pages/about.astro');
  assert.match(about, /Practical advice\. Hands-on help\./);
  assert.match(about, /Led by Tim Gabaree/);
  assert.doesNotMatch(about, /currently being prepared|In the meantime/);
  const metadata = JSON.parse(await source('src/data/page-meta.json'));
  for (const name of ['index', 'about', 'contact']) {
    const head = parse(metadata[name].head);
    const description = head.querySelector('meta[name="description"]').getAttribute('content');
    assert.equal(head.querySelector('meta[property="og:description"]').getAttribute('content'), description);
    assert.equal(head.querySelector('meta[name="twitter:description"]').getAttribute('content'), description);
    const structured = JSON.parse(head.querySelector('script[type="application/ld+json"]').textContent);
    const page = structured['@graph'].find(item => ['WebPage', 'AboutPage', 'ContactPage'].includes(item['@type']));
    assert.equal(page.description, description);
  }
});

test('contact topic IDs remain stable while labels match services and outgoing email', async () => {
  const contact = parse(await source('src/pages/contact.astro'));
  const home = parse(await source('src/pages/index.astro'));
  const options = contact.querySelectorAll('select[name="topic"] option').filter(option => option.getAttribute('value'));
  assert.deepEqual(options.map(option => option.getAttribute('value')), [
    'technology-operating-model', 'infrastructure-cloud-modernization', 'cybersecurity-compliance-readiness',
    'vendor-spend-rationalization', 'ai-data-automation-advisory', 'program-recovery-execution-support', 'executive-advisory', 'other',
  ]);
  for (const option of options) assert.equal(option.textContent.trim(), TOPICS[option.getAttribute('value')]);
  assert.deepEqual(home.querySelectorAll('.service-card h3').map(node => node.textContent.trim()), options.slice(0, 6).map(node => node.textContent.trim()));
  assert.match(contact.textContent, /timgabaree@rgesol\.com/);
});
