# YouTune - Personal Listening Tuner

YouTune is a privacy-first Chromium browser extension for adjusting the sound of **YouTube** and **YouTube Music**. It adds a 10-band graphic equalizer, local listening presets, preamp control, bypass, reconnect controls, and diagnostics around the active media element.

YouTune is designed for people who want more control over browser playback without sending audio to a server or installing a desktop audio pipeline. The extension runs locally in the browser. The current implementation does not require an account, upload audio, inject advertising, or use tab capture.

> YouTune is an independent project. It is not affiliated with, endorsed by, or sponsored by YouTube, Google, Microsoft, Frieve-A, the Faust project, or AutoEq.

## Current status

The current source is a release candidate for a controlled Chrome and Edge pilot. The source and DSP laboratory pass automated validation, and the extension package can be loaded unpacked in Chrome and Edge. Public store release still requires manual testing against current browser versions and live YouTube and YouTube Music sessions, followed by store review.

The product should not be presented as “just another equalizer.” Its intended value is dependable YouTube integration, persistent local settings, transparent processing status, predictable bypass, recovery after YouTube navigation, and a future headphone-correction feature based on clearly licensed profiles or user-imported data.

## Features

The popup currently includes **16 curated presets** plus an explicit **Custom** profile: Flat, Bass Boost, Bass Light, Treble Boost, Vocal, Speech, Rock, Pop, Classical, Jazz, Electronic, Hip-Hop, Metal, Acoustic, Late Night, and Laptop Speakers. Each named preset contains a 10-band curve, a short description, and a recommended headroom value. Custom preserves the current curve for manual editing.

Selecting a preset changes the tone curve but does **not** silently change the user's preamp. This is intentional. The first version of the expanded preset system automatically applied a lower preamp when a preset was selected, which made the effect feel weaker. YouTune version 0.2.3 removes that behavior and migrates old version 1 settings back to neutral preamp for named presets. Users can still adjust preamp manually.

Other current features include a 10-band graphic equalizer, preamp control, enable and disable processing, bypass, reset, reconnect, versioned local settings, a conservative safety-dynamics baseline, an options page, and a status channel for media discovery and connection errors.

## What is currently bundled

The current extension package deliberately has **no third-party runtime npm dependency** and no copied third-party DSP source. The audio graph uses the browser's native Web Audio API. The repository contains original YouTune JavaScript, HTML, icons, tests, documentation, and a deterministic DSP laboratory.

This distinction matters. The open-source projects described below influenced the research and product direction, but their code, WebAssembly binaries, presets, measurements, and assets are **not bundled in the current YouTune extension**. They remain reference projects until a future dependency and license review justifies actual inclusion.

| Project | Why we value it | Current YouTune relationship | License and attribution |
|---|---|---|---|
| [EffeTune](https://github.com/Frieve-A/effetune) | A serious real-time audio effect processor with browser-oriented Web Audio and AudioWorklet work. It is a useful reference for effect graphs, listening-oriented controls, and browser DSP design. | Studied and used as architectural inspiration. No EffeTune source, WASM, presets, or assets are bundled in YouTune. | The repository provides an [MIT License](https://github.com/Frieve-A/effetune/blob/main/LICENSE). If YouTune ever copies or bundles code, the relevant copyright and license notice will be included. |
| [FaustWasm](https://github.com/grame-cncm/faustwasm) | A TypeScript-oriented wrapper around the Faust compiler that can compile Faust DSP to WebAssembly and expose it as WebAudio nodes. It is a possible future route for CPU-intensive or specialized DSP. | Researched as a future AudioWorklet/WASM option. It is not a current dependency and no generated FaustWasm artifacts are bundled. | The repository contains [COPYING.txt](https://github.com/grame-cncm/faustwasm/blob/master/COPYING.txt) identifying an LGPL license. Any future use must satisfy the exact license obligations for the selected version and generated artifacts. |
| [AutoEq](https://github.com/jaakkopasanen/AutoEq) | A well-known project for generating headphone equalization from measured frequency responses. It is relevant to YouTune's possible future headphone-correction feature. | Studied as a reference. YouTune currently bundles none of its code, measurement data, target data, or result profiles. | The repository identifies itself as MIT-licensed, but profile and measurement provenance still need to be tracked separately. A future YouTune profile system will not assume that every data file has identical reuse terms. |

### Clear attribution boundary

YouTune currently uses the **ideas and public documentation** of these projects as research input. It does not claim their work as its own, does not copy their source into the extension, and does not package their data without a separate review. “Inspired by” is not the same as “derived from,” and this README intentionally states the difference.

The detailed record is also maintained in [`docs/THIRD_PARTY.md`](docs/THIRD_PARTY.md). If a future release adds one of these projects as a dependency, the change must include the dependency version, repository URL, license text or notice, source-availability requirements where applicable, generated-artifact details, bundle-size impact, and a record of which files were included.

## Architecture

YouTune uses a Manifest V3 Chromium extension with one codebase intended for Chrome and Microsoft Edge. The content script runs only on `https://www.youtube.com/*` and `https://music.youtube.com/*`. It discovers the active `<video>` or `<audio>` element and attaches a Web Audio graph to that media element.

The current processing chain is:

```text
YouTube media element
        |
        v
10 peaking filters, 31 Hz to 16 kHz
        |
        v
Preamp gain
        |
        v
Basic safety dynamics
        |
        v
Analyser
        |
        v
AudioContext destination
```

The content script watches for media-element replacement and YouTube single-page navigation. When YouTube replaces the player, YouTune attempts to disconnect the old graph and attach to the new media element. The popup communicates with the active tab and persists settings through `chrome.storage.local`. Closing the popup should not stop the audio graph because the graph is owned by the content script and page lifecycle.

Tab capture is intentionally not used in the current architecture. Chrome's official `tabCapture` documentation explains that capture is initiated after a user action and that captured audio must be routed back to an output destination if it is to remain audible.[4] Source-level Web Audio attachment is therefore the lower-friction first route for YouTube-specific processing.

## Repository structure

```text
prototype/                 Manifest V3 extension source
  manifest.json            Chrome and Edge manifest
  background.js            Service worker, defaults, and settings migration
  content.js               YouTube media discovery and Web Audio graph
  popup.html               Quick-control interface
  popup.js                 Popup behavior and local settings
  presets.js               Curated preset definitions
  icons/                   16, 48, and 128 pixel extension icons
  options.html             Advanced settings page
  options.js               Advanced settings behavior
  validate-extension.mjs   Structural, preset, and permission-boundary checks
lab/                       Deterministic DSP laboratory
reports/                   Research, benchmark, reliability, and evaluation reports
docs/                      Publishing, privacy, store-listing, third-party, and release-checklist documentation
scripts/                   Linux/macOS and Windows packaging scripts
.github/workflows/         GitHub Actions validation workflow
package.json               Reproducible local validation commands
LICENSE                    MIT license for YouTune-authored source
.gitignore                 Repository exclusions
```

## Local development

The prototype has no third-party runtime npm dependency. Node.js is used for syntax checks, structural validation, packaging, and the deterministic DSP laboratory. Python and Pillow are used only by the icon-generation helper.

```bash
npm test
npm run validate
npm run test:lab
npm run build -- 0.2.3
npm run release-check
```

The build creates `dist/youtune-0.2.3.zip` with `manifest.json` at the ZIP root. That ZIP is the browser-store package. Run `npm run release-check` after the build to verify the exact store contents. The repository source itself should be uploaded to GitHub separately.

On Windows PowerShell:

```powershell
npm test
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 0.2.3
```

## Load the extension locally

In Chrome, open `chrome://extensions`. In Edge, open `edge://extensions`. Enable Developer mode, choose **Load unpacked**, and select the `prototype` directory. Open YouTube or YouTube Music, start playback, and open the YouTune popup. Use **Reconnect** if playback was already active before the extension was loaded.

When debugging, inspect the extension service worker and the page console. A failure that produces silence, duplicate audio, or a lost connection is a release blocker.

## Testing matrix

Manual testing is still required because YouTube is a dynamic single-page application and browser audio behavior depends on the active media element and output device. Use [`reports/reliability-test-matrix.md`](reports/reliability-test-matrix.md) as the test script.

| Area | Required checks |
|---|---|
| Basic playback | YouTube video, YouTube Music track, pause/resume, seek, volume change |
| Presets | All 16 named presets, explicit Custom profile, slider-to-Custom behavior, preamp persistence, reset |
| Lifecycle | New video, SPA navigation, playlist change, track change, media-element replacement |
| Extension lifecycle | Popup close, browser restart, extension reload, reconnect |
| Output devices | Built-in speakers, headphones, Bluetooth device, output-device change |
| Safety | Large positive EQ curve, preamp changes, bypass, no silence, no duplicate audio |
| Privacy boundary | No account request, no audio upload, no unexpected network request |

## Privacy and permissions

YouTune requests the `storage` permission and host access to YouTube and YouTube Music because it must store local preferences and access the active media element on those sites. The current source does not request tab capture, microphone access, identity access, or broad all-sites host access.

The current source stores equalizer values, preset selection, processing state, and safety settings locally. It does not send those values or audio to a YouTune server. The repository includes [`docs/PRIVACY.md`](docs/PRIVACY.md), which must be updated if a future release adds analytics, synchronization, accounts, remote services, or any other data practice.

## Publishing

The repository includes [`docs/PUBLISHING.md`](docs/PUBLISHING.md) and [`docs/STORE_LISTING.md`](docs/STORE_LISTING.md). The short version is:

1. Run `npm test`.
2. Build the ZIP with `npm run build -- 0.2.3` or the PowerShell build script.
3. Load the unpacked `prototype` directory in Chrome and Edge.
4. Complete the manual reliability matrix on live YouTube and YouTube Music.
5. Upload the ZIP through the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) or the [Microsoft Edge Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview).
6. Provide store listing, privacy, permission-justification, support, and certification-test information that matches the actual source.

Chrome's official guide describes ZIP upload through the Chrome Developer Dashboard and separate Package, Store Listing, Privacy, Distribution, and Test instructions sections.[5] Microsoft's current Edge guide describes ZIP packaging, manifest metadata, permission justification, privacy information, remote-code declaration, listing details, search terms, and certification testing notes.[6]

## Limitations and future work

The current safety stage is a basic prototype rather than a production-grade look-ahead limiter. Headphone correction, standards-aware loudness management, psychoacoustic bass enhancement, crossfeed, and specialized WASM DSP are not active MVP features. They require separate listening tests, numerical benchmarks, performance checks, browser compatibility checks, and license review.

The most credible future differentiator is a transparent headphone-correction system. The safest first version would accept user-imported profiles or bundle only profiles whose data provenance and redistribution rights are documented. YouTune should not promise correction for every headphone model without a verified profile.

Other possible future features include per-site or per-channel profiles, an optional spectrum view, keyboard shortcuts, profile import/export, a more capable limiter, and a carefully isolated AudioWorklet/WASM module. Each feature should be evaluated against CPU use, latency, failure recovery, privacy, and licensing before being added.

## Contributing

Contributions should keep audio processing deterministic and independently testable. Do not add a dependency without documenting its version, repository URL, license, build path, bundle-size impact, and reason for inclusion. Do not bundle headphone profiles, impulse responses, generated WASM, or copied DSP code unless the code and data rights are recorded separately.

Before opening a pull request, run:

```bash
npm test
```

Pull requests that change the audio chain should include a short explanation of the expected audible effect, the safety implications, and the manual browser scenarios that were tested.

## License

YouTune-authored source is released under the [MIT License](LICENSE). Third-party projects, code, documentation, profile data, measurements, and generated artifacts remain under their own licenses. This repository's MIT License does not relicense third-party material.

## References

[1]: https://github.com/Frieve-A/effetune "Frieve-A/EffeTune repository"
[2]: https://github.com/Frieve-A/effetune/blob/main/LICENSE "EffeTune MIT License"
[3]: https://github.com/grame-cncm/faustwasm "grame-cncm/FaustWasm repository"
[4]: https://developer.chrome.com/docs/extensions/reference/api/tabCapture "Chrome tabCapture API"
[5]: https://developer.chrome.com/docs/webstore/publish "Publish in the Chrome Web Store"
[6]: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension "Publish a Microsoft Edge extension"
[7]: https://github.com/jaakkopasanen/AutoEq "jaakkopasanen/AutoEq repository"
