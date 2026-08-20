# YouTune prototype

This is the first Manifest V3 technical prototype for YouTune, the privacy-first personal listening tuner for YouTube and YouTube Music.

## What is implemented

The prototype contains a YouTube-only content script that discovers the active media element, attaches a source-level Web Audio graph, applies a 10-band graphic EQ, preamp gain, analyser, and basic dynamics safety stage, then reconnects when YouTube replaces the media element or finishes a single-page navigation. A popup provides quick controls, presets, bypass, reset, and reconnect. An options page stores local safety and experimental-module flags.

The prototype intentionally does not use `tabCapture`, does not upload audio, does not require an account, and does not enable psychoacoustic bass enhancement, crossfeed, or loudness mode in the active audio path.

## Load locally in Chrome or Edge

1. Open the browser's extension management page.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this `prototype` directory.
5. Open a YouTube or YouTube Music page, start playback, and open the YouTune popup.
6. If the player was already active before the extension loaded, use **Reconnect**.

## Validation performed

The following automated checks pass in the sandbox:

```text
node --check background.js
node --check content.js
node --check popup.js
node --check options.js
node validate-extension.mjs
```

The validator checks Manifest V3, the YouTube-only host permissions, required files, media-element attachment, lifecycle observation, reconnect support, local storage, and popup-to-content messaging.

## Known prototype limitations

The current version is a technical spike, not a store-ready release. The extension has not yet been run inside a real Chrome and Edge profile against current YouTube and YouTube Music pages in this environment. Real-browser testing is still required for autoplay behavior, media-element replacement, cross-origin restrictions, browser restart persistence, Bluetooth output behavior, and service-worker lifecycle.

The output safety stage is a basic compressor/ceiling baseline, not a production-grade look-ahead limiter. The popup has only a small set of example presets. Headphone correction, profile import, standards-aware loudness measurement, and a validated WASM/AudioWorklet module remain future work after the prototype reliability gate.

## Architectural decision

The prototype validates the preferred source-level route first. If real-browser tests show that this route fails too often because of media-element replacement or YouTube player changes, the next experiment should test `tabCapture` separately rather than quietly adding broad permissions to the MVP.
