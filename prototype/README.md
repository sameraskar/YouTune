# YouTune extension source

This directory contains the release source for **YouTune - Personal Listening Tuner**, a Manifest V3 browser extension for YouTube and YouTube Music.

## What is active in this release

The extension attaches a local Web Audio graph to the active YouTube media element. It provides a 10-band graphic equalizer, preamp control, 16 named listening presets, custom slider curves, bypass, reset, and reconnect support after a YouTube player change.

YouTune does not require an account, upload audio, use microphone access, or use tab capture. Settings remain in local extension storage. The extension is independent and is not affiliated with or endorsed by YouTube or Google.

## Load locally

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this `prototype` directory.
5. Open YouTube or YouTube Music, start playback, and open the YouTune popup.
6. If playback was already active before loading the extension, use **Reconnect**.

## Release scope and limitations

The current release ships the equalizer, preamp, presets, bypass, and recovery controls. It does not ship headphone-correction profiles, psychoacoustic bass enhancement, crossfeed, loudness normalization, or a production-grade look-ahead limiter. Those ideas remain outside the active release until they have separate listening, performance, safety, and licensing evidence.

The output safety stage is a conservative compressor and ceiling baseline. It must not be described as hearing protection, guaranteed clipping prevention, mastering-grade limiting, or standards-compliant loudness normalization.

## Support

Questions, bug reports, and security reports belong at https://github.com/sameraskar/YouTune/issues.

## Licensing

YouTune-authored source is released under the repository MIT license. Third-party projects are documented in `docs/THIRD_PARTY.md`. The repository's MIT license does not relicense third-party code, data, profiles, measurements, or artwork.
