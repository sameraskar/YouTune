import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('./manifest.json', import.meta.url)));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.name, 'YouTune - Personal Listening Tuner');
assert.deepEqual(manifest.permissions, ['storage']);
assert.deepEqual(manifest.host_permissions, ['https://www.youtube.com/*', 'https://music.youtube.com/*']);
assert.equal(manifest.background.service_worker, 'background.js');
assert.equal(manifest.options_page, 'options.html');
assert.ok(manifest.content_scripts.some((entry) => entry.js.includes('content.js')));
assert.equal(manifest.content_scripts[0].run_at, 'document_idle');

for (const file of ['background.js', 'content.js', 'popup.html', 'popup.js', 'presets.js', 'options.html', 'options.js']) {
  assert.ok(fs.existsSync(new URL(`./${file}`, import.meta.url)), `${file} must exist`);
}

const source = fs.readFileSync(new URL('./content.js', import.meta.url), 'utf8');
assert.match(source, /createMediaElementSource/);
assert.match(source, /MutationObserver/);
assert.match(source, /yt-navigate-finish/);
assert.match(source, /disconnect\(\)/);
assert.match(source, /YOUTUNE_RECONNECT/);
assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|eval\s*\(/);
assert.match(source, /if \(enabled\) \{\s*updateFilterCoefficients\(\);/s);

const popup = fs.readFileSync(new URL('./popup.js', import.meta.url), 'utf8');
assert.match(popup, /chrome\.storage\.local/);
assert.match(popup, /chrome\.tabs\.sendMessage/);
assert.match(popup, /PRESET_NAMES/);
assert.match(popup, /settings\.preset = 'Custom'/);
assert.match(popup, /presetEl\.value = 'Custom'/);
assert.match(popup, /name === 'Custom'/);
assert.match(popup, /Switching presets leaves your current preamp unchanged/);
assert.doesNotMatch(popup, /settings\.preampDb\s*=\s*preset\.preampDb/);

const background = fs.readFileSync(new URL('./background.js', import.meta.url), 'utf8');
assert.match(background, /SETTINGS_VERSION = 2/);
assert.match(background, /storedSettings\.version === 1/);

const presets = fs.readFileSync(new URL('./presets.js', import.meta.url), 'utf8');
const presetNames = [...presets.matchAll(/^\s{4}description:\s*['"]/gm)];
assert.ok(presetNames.length >= 12, `expected at least 12 presets, found ${presetNames.length}`);
assert.match(presets, /const PRESET_NAMES = \[\.\.\.Object\.keys\(PRESETS\), 'Custom'\]/);
assert.match(fs.readFileSync(new URL('./popup.html', import.meta.url), 'utf8'), /presets\.js/);
const options = fs.readFileSync(new URL('./options.html', import.meta.url), 'utf8');
assert.doesNotMatch(options, /id="(limiter|ceiling|bass|crossfeed|loudness|save)"/);
assert.match(options, /No inactive experimental controls are exposed/);

console.log(`YouTune extension structure validated with ${presetNames.length} presets`);
