import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const packageJson = JSON.parse(read('package.json'));
const manifest = JSON.parse(read('prototype/manifest.json'));

assert.equal(packageJson.version, manifest.version, 'package.json and manifest versions must match');
assert.match(packageJson.version, /^\d+\.\d+\.\d+$/);
assert.deepEqual(manifest.permissions, ['storage']);
assert.deepEqual(manifest.host_permissions, ['https://www.youtube.com/*', 'https://music.youtube.com/*']);

const privacy = read('docs/PRIVACY.md');
assert.doesNotMatch(privacy, /replace this paragraph|TODO|FIXME/i);
assert.ok(privacy.includes('https://github.com/sameraskar/YouTune/issues'));

const listing = read('docs/STORE_LISTING.md');
assert.ok(listing.includes('https://github.com/sameraskar/YouTune/issues'));
assert.ok(listing.includes('https://github.com/sameraskar/YouTune/blob/main/docs/PRIVACY.md'));
assert.match(listing, /not affiliated with or endorsed by YouTube or Google/i);
assert.ok(listing.includes('assets/store-screenshots/youtune-popup-rock.png'));
assert.match(listing, /16 named profiles/i);
assert.match(listing, /selector visibly changes to Custom/i);

const publish = read('docs/PUBLISHING.md');
assert.ok(publish.includes(`npm run build -- ${packageJson.version}`));
assert.ok(publish.includes(`build.ps1 ${packageJson.version}`));
assert.equal(/0\.2\.[01]/.test(publish), false);
assert.equal(packageJson.version, '0.2.3', 'this release package must be version 0.2.3');

const options = read('prototype/options.html');
assert.doesNotMatch(options, /id="(limiter|ceiling|bass|crossfeed|loudness|save)"/);
assert.match(options, /No inactive experimental controls are exposed/);

for (const sourceFile of ['prototype/background.js', 'prototype/content.js', 'prototype/popup.js', 'prototype/options.js']) {
  const source = read(sourceFile);
  for (const forbidden of ['fetch(', 'XMLHttpRequest', 'WebSocket', 'eval(', 'new Function(']) {
    assert.equal(source.includes(forbidden), false, `${sourceFile} contains a disallowed pattern: ${forbidden}`);
  }
}

const iconSizes = { '16': [16, 16], '48': [48, 48], '128': [128, 128] };
for (const [size, expected] of Object.entries(iconSizes)) {
  const iconPath = path.join(root, 'prototype', 'icons', `icon${size}.png`);
  assert.ok(fs.existsSync(iconPath), `icon${size}.png must exist`);
  const identify = execFileSync('file', [iconPath], { encoding: 'utf8' });
  assert.match(identify, new RegExp(`${expected[0]} x ${expected[1]}`));
}

const zipPath = path.join(root, 'dist', `youtune-${packageJson.version}.zip`);
assert.ok(fs.existsSync(zipPath), `built package missing: ${zipPath}`);
const listingOutput = execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
assert.ok(listingOutput.includes('manifest.json'), 'manifest must be at ZIP root');
assert.ok(listingOutput.includes('icons/icon16.png'));
assert.ok(listingOutput.includes('icons/icon48.png'));
assert.ok(listingOutput.includes('icons/icon128.png'));
assert.ok(!listingOutput.includes('validate-extension.mjs'), 'development validator must not be in store ZIP');
assert.ok(!listingOutput.includes('README.md'), 'repository README must not be in store ZIP');
assert.ok(!listingOutput.includes('LICENSE'), 'repository license must not be in store ZIP');

console.log(`YouTune ${packageJson.version} release checks passed: ${listingOutput.length} runtime package entries`);
