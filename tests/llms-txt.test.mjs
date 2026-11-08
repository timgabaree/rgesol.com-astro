import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const text = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');

test('llms.txt is concise, structured, and site-specific', () => {
  assert.match(text, /^# RGE Solutions\n/);
  assert.match(text, /^> .+/m);
  assert.match(text, /^## Services$/m);
  assert.match(text, /\[Contact RGE Solutions\]\(https:\/\/rgesol\.com\/contact\)/);
  assert.match(text, /projected savings identified, not realized savings/);
  assert.doesNotMatch(text, /ai-train\s*=\s*yes/i);
  assert.ok(text.length < 6000);
});
