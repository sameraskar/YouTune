# YouTune Evaluation Report

## Executive conclusion

YouTune has a credible reason to exist, but not as another generic browser equalizer. The linked competitor already reports 40,000 users, a 4.7-star rating, more than ten presets, and a relatively small extension footprint. That makes a basic 10-band EQ, bass boost, and genre presets a weak product proposition.[1]

The strongest viable direction is a **privacy-first personal listening tuner** for YouTube and YouTube Music. Its differentiator should be reliable activation and persistence plus an optional, transparent correction layer for headphones or speakers. A conservative safety ceiling is also a practical benefit. Headphone correction is the first advanced feature worth validating because AutoEq provides a relevant open-source reference and profile-generation workflow, while EffeTune demonstrates that richer browser DSP can be built as a separate deterministic engine.[2] [3]

The current technical result is a **conditional go for continued prototype work** and a **no-go for store publication or a polished MVP release yet**. The native JavaScript DSP laboratory passes its automated checks, the Manifest V3 prototype passes structural validation, and the files have been transferred into the connected `E:\yt\youtune-workspace` folder. However, the decisive browser tests against live Chrome and Edge YouTube and YouTube Music pages have not been completed in this environment. Until those tests pass, YouTune has not met the approved reliability gate.

## What was built

The prototype is deliberately small and modular. It contains a Manifest V3 manifest, a service worker for versioned local defaults, a content script that discovers the active media element and observes YouTube lifecycle changes, a popup for quick controls, and an options page for local safety and experimental-module flags.

The audio laboratory contains a 10-band graphic EQ based on peaking filters, preamp gain, a basic safety ceiling, a short-term RMS loudness proxy, a conservative harmonic bass prototype, and a simple crossfeed prototype. The laboratory also includes deterministic test and benchmark scripts. It does not upload audio, require an account, use tab capture, or enable experimental processing by default.

| Area | Result |
|---|---|
| Pure JavaScript DSP laboratory | Automated tests pass |
| Flat EQ behavior | 0 dB response at measured bands in deterministic tone tests |
| Targeted EQ behavior | Approximately +6 dB at 1 kHz when configured |
| Safety ceiling baseline | Reduced an intentionally overloaded signal to approximately -1 dBFS |
| Bass enhancement prototype | Produces measurable harmonic content; subjective benefit unproven |
| Crossfeed prototype | Produces controlled delayed opposite-channel contribution; quality unproven |
| Manifest V3 structure | Validated |
| Syntax checks | `background.js`, `content.js`, `popup.js`, and `options.js` pass Node syntax checks |
| Browser lifecycle behavior | Not yet validated in a real Chrome or Edge session |

## Technical decisions

### Source-level Web Audio first

The prototype uses the preferred source-level route, attaching a Web Audio graph to the active media element. This keeps the first permission model narrow and avoids the extra routing work required by tab capture. The content script watches for DOM changes, YouTube navigation events, back/forward navigation, and hash changes, and it exposes a reconnect action.

Tab capture is intentionally excluded from the first prototype. Chrome's official documentation says that `tabCapture` can only be called after the user invokes the extension. It also says that captured tab audio stops being played to the user unless the extension explicitly routes the stream back to an AudioContext destination.[4] That makes tab capture a valid fallback experiment, but a poor first choice for a low-friction equalizer.

### Native Web Audio before WASM

Native Web Audio is sufficient for the stable first chain: gain, biquad filters, analyser, and a basic dynamics stage. FaustWasm remains a candidate for a separate proof of concept, not a dependency to add for prestige. The older `faust2webaudio` repository is marked obsolete in favor of `faustwasm`, so it should not be selected for new development.[5]

EffeTune is especially relevant as a reference because its public project describes a deterministic DSP engine usable from JavaScript and browser AudioWorklets, and its public README reports an MIT-licensed DSP engine.[6] That still does not remove the need to audit its exact repository files, dependencies, and assets before copying any code.

### Headphone correction as the first advanced feature

AutoEq is a strong reference for profile generation and measured headphone correction.[7] The important limitation is that a model cannot be treated as supported simply because it has a name. Measurement coverage, target choice, profile data provenance, and redistribution rights all matter. YouTune should initially support user-imported profiles and only bundle profiles whose code and data terms are clearly documented.

### Loudness and “enhancement” claims

The current laboratory loudness stage is only an RMS proxy. It must not be described as LUFS normalization or EBU R128 compliance. A real loudness mode needs a standards-aware implementation, reference material, slow control behavior, true-peak protection, and listening tests for pumping and flattening.

The bass-enhancement and crossfeed prototypes are not product features yet. They prove that an algorithm can create a measurable signal change. They do not prove that the change is preferred by listeners. They should remain hidden or explicitly experimental until they beat a normal EQ or bypass in controlled listening tests.

## Product differentiation assessment

| Candidate differentiator | Already common? | Evidence or risk | YouTune decision |
|---|---:|---|---|
| 10-band equalizer | Yes | Direct competitor already offers YouTube EQ and more than ten presets.[1] | Required baseline, not differentiation |
| Bass boost and loudness boost | Yes | Multiple browser extensions advertise volume and bass amplification.[8] | Avoid competing on extreme boost; emphasize safety |
| More genre presets | Yes | Existing listings already advertise large preset collections.[9] | Keep a small curated set only |
| Reliable YouTube and YouTube Music lifecycle handling | Less visibly differentiated | Requires real-browser benchmark; silent failure is a common product risk | Primary product quality goal |
| Headphone correction | Less common in simple YouTube extensions | AutoEq provides an open-source reference; profile licensing must be controlled.[7] | First advanced feature to validate |
| Conservative loudness management | Available in desktop audio tools | Browser implementation and artifacts require careful testing | Second advanced feature, after validation |
| Psychoacoustic small-speaker bass | Uncommon in basic extensions | Can create harshness or distortion | Experimental only |
| Crossfeed | Not universal | Preference feature with subjective benefit | Experimental only |
| Privacy and diagnostics | Often stated, rarely explained in detail | Competitor page discloses no data collection, so privacy alone is not enough.[1] | Trust layer, not sole differentiator |

## Go/no-go decision

The correct decision at this stage is:

> **GO for a controlled browser validation pilot. NO-GO for public release until the live reliability and listening gates are passed.**

The next gate must run the unpacked extension in current Chrome and Edge profiles with YouTube and YouTube Music. It must test fresh activation, SPA navigation, playlist changes, media-element replacement, popup close, browser restart, settings persistence, bypass, reconnect, Bluetooth outputs, and long-session performance. The result must be recorded in `reports/reliability-test-matrix.md`.

YouTune should proceed to a real MVP only if it satisfies all three conditions:

1. It works reliably through normal YouTube and YouTube Music navigation and browser lifecycle events.
2. Headphone correction or another advanced feature provides a repeatable practical or listening benefit over a normal EQ.
3. Pilot users can explain why they prefer YouTune and keep it installed after the novelty wears off.

If the extension fails the first condition, the source-level integration must be repaired before any additional audio feature work. If it passes reliability but no advanced feature creates repeat-use value, the honest decision is to stop or narrow the product rather than release an interchangeable equalizer.

## Current limitations and risks

The most important unresolved risk is whether `createMediaElementSource()` remains reliable with YouTube's actual media lifecycle and cross-origin media behavior. The prototype handles common replacement signals, but only a live browser run can confirm that it neither duplicates audio nor produces silence.

The popup and content script messaging path is structurally validated, but real permission and tab-state behavior still need testing. The current prototype also uses a basic compressor/ceiling rather than a proper look-ahead limiter. It should not expose high-gain enhancement settings as safe defaults.

The research register contains public repository and listing evidence, but not a complete legal review. Before bundling any third-party code, generated WASM, headphone profiles, impulse responses, or measurement data, the exact license and asset provenance must be recorded. If terms are unclear, user import is the correct first approach.

## Files delivered

The connected project folder now contains:

```text
E:\yt\youtune-workspace\lab
E:\yt\youtune-workspace\prototype
E:\yt\youtune-workspace\reports
```

The sandbox copies are attached with the final response as a ZIP archive and as individual key reports.

## References

[1]: https://chromewebstore.google.com/detail/audio-equalizer-for-youtu/dcjnokfichnijppmkbgpafmdjghibike "Audio Equalizer for Youtube - Chrome Web Store"
[2]: https://github.com/jaakkopasanen/AutoEq "AutoEq - Automatic headphone equalization"
[3]: https://github.com/Frieve-A/effetune "Frieve-A/EffeTune"
[4]: https://developer.chrome.com/docs/extensions/reference/api/tabCapture "Chrome tabCapture API"
[5]: https://github.com/grame-cncm/faustwasm "FaustWasm for WebAudio"
[6]: https://github.com/Frieve-A/effetune/blob/main/README.md "EffeTune README"
[7]: https://github.com/jaakkopasanen/AutoEq/blob/master/results/README.md "AutoEq results and headphone correction profiles"
[8]: https://github.com/polywock/globalSpeed "Global Speed"
[9]: https://chromewebstore.google.com/detail/equalizer-for-youtube/oggiagogblgafoilijjdhcmflgekfmja?hl=en "Equalizer for YouTube - Chrome Web Store"
