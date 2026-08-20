# YouTune Research Register

## Repository and technical audit, initial pass

Date: 2026-08-17

| Candidate | Evidence found | Initial assessment |
|---|---|---|
| Frieve-A/EffeTune | Public repository describes a real-time audio processor for music listening, with browser support and effect-oriented documentation. Search results also indicate browser AudioWorklet/Web Audio requirements and a desktop release path. | Strong reference implementation and possible source of selected browser-compatible ideas. The whole application should not be copied into YouTune without an exact license and dependency audit. |
| grame-cncm/faustwasm | Public repository describes Faust DSP compiled to WebAudio/WASM and includes tooling for creating standalone Faust DSP builds. The older faust2webaudio repository is explicitly marked obsolete in favor of faustwasm. | Current-looking candidate for one isolated AudioWorklet/WASM proof of concept. The older repository should not be used for new development. |
| grame-cncm/faust | Public repository describes Faust as a functional language for real-time signal processing and synthesis. | Potential DSP authoring layer, but it increases build and debugging complexity. Use only if the prototype demonstrates an advantage over native Web Audio nodes. |
| jaakkopasanen/AutoEq | Public repository describes automatic headphone equalization from measured frequency responses and an application for generating/tuning correction. Search results also indicate that measurements depend on supported sources and that unmeasured headphone models cannot simply be assumed supported. | Strong candidate for headphone correction. Treat code, measurement sources, generated profiles, and redistribution rights as separate audit items. User-imported profiles are the safest first implementation if bundled data terms are unclear. |

## Important technical observations

The repository search supports the plan's central conclusion: there is no single drop-in open-source backend that turns a browser extension into a universally better audio system. The strongest route is a modular YouTune chain using native Web Audio where practical, adding selected WASM/AudioWorklet DSP only when it provides measurable value.

The old `faust2webaudio` repository is explicitly identified as obsolete in favor of `faustwasm`; it should not be selected for new work. AutoEq profiles depend on measurement coverage and source data, so YouTune must not promise every headphone model without a profile or user-provided data.

## Source URLs

- https://github.com/Frieve-A/effetune
- https://github.com/Frieve-A/effetune/blob/main/README.md
- https://github.com/grame-cncm/faustwasm
- https://github.com/grame-cncm/faust
- https://github.com/grame-cncm/faust2webaudio
- https://github.com/jaakkopasanen/AutoEq
- https://github.com/jaakkopasanen/AutoEq/blob/master/results/README.md
- https://github.com/jaakkopasanen/AutoEq/issues/1054

## Competitor audit, public evidence pass

| Competitor or category | Publicly claimed capability | Strategic implication for YouTune |
|---|---|---|
| Audio Equalizer for YouTube™ | YouTube-focused sound customization with multiple presets. | The core YouTube EQ idea is already directly covered; YouTune needs reliability, profile correction, or safer processing as a reason to switch. |
| Equalizer for YouTube™ | YouTube and embedded-video support, with 18 audio presets according to public listings. | Preset count is not a differentiator. Embedded-video behavior and lifecycle reliability are worth testing. |
| Browser-wide equalizer extensions | Some listings claim support for YouTube, Spotify, and other sites, with bass, treble, preamp, and multiple bands. | Broad claims are common. YouTune should initially focus on doing YouTube and YouTube Music exceptionally well rather than claiming universal support. |
| Global Speed | Universal media controls, volume boost up to 600%, pitch shift, hotkeys, and optional filters/effects. | Users may already have an extension that covers volume and some effects. YouTune should avoid competing on extreme volume boost and instead emphasize sound correction and safe, transparent controls. |
| YouTube volume-control extensions | Some offer up to 300% volume and a small three-band EQ. | Volume amplification is commoditized and can create distortion. YouTune should use output protection and not treat louder as better. |

## Weakness patterns found in public evidence

Public search results and discussions repeatedly surface reliability, persistence, compatibility, and trust as more meaningful concerns than the absence of another preset. Some third-party pages claim that per-domain persistence is a distinguishing feature, which suggests that saved settings should be treated as a core requirement rather than an optional enhancement. These claims still require direct installation testing before they can be treated as verified facts.

One public discussion describes concern about an audio equalizer extension being removed from the store and uncertainty around security detections. This is not evidence that all equalizer extensions are unsafe, but it reinforces the value of minimal permissions, no unexplained network activity, a clear privacy statement, and an auditable dependency list.

## Competitor research limitation

The available research results provide public claims and recurring themes but not a reliable controlled benchmark of current extension behavior. Direct installation testing in isolated Chrome and Edge profiles remains necessary. The project should not present store snippets or third-party rankings as verified performance measurements.

## Additional source URLs

- https://chromewebstore.google.com/detail/audio-equalizer-for-youtu/dcjnokfichnijppmkbgpafmdjghibike
- https://chromewebstore.google.com/detail/equalizer-for-youtube/oggiagogblgafoilijjdhcmflgekfmja?hl=en
- https://chromewebstore.google.com/detail/youtube-volume-control/fdibijfmbnaejaafdkfiacboidlbigki
- https://chromewebstore.google.com/detail/global-speed-video-speed/jpbjcnkcffbooppibceonlgknpkniiff?hl=en
- https://github.com/polywock/globalSpeed
- https://mybrowseraddon.com/equalizer-for-youtube.html
- https://www.reddit.com/r/chrome/comments/1fbs32w/concerned_about_audio_equalizer_chrome_extension/

## License and reuse audit, public evidence pass

| Candidate | Public license signal | Current reuse posture |
|---|---|---|
| EffeTune | Its public README/search result describes the DSP engine as MIT-licensed for Python, JavaScript, and browser AudioWorklets. | Potentially reusable at the DSP-engine level, but the exact repository license, included dependencies, and any non-code assets still need to be inspected and recorded before copying or bundling. |
| FaustWasm | Public search results identify the project as a TypeScript/JavaScript library for compiling Faust DSP into WebAudio nodes. A public package-reference result reports LGPL-2.1, but this must be verified from the repository's actual license files before distribution. | Treat as a possible dynamically linked or separately packaged dependency until the exact license and distribution obligations are verified. Do not copy generated artifacts blindly. |
| AutoEq | Public repository includes a license file and public issue discussion around copyright interpretation. Code and profile/measurement assets may not have identical terms or provenance. | Use user-imported profiles first unless the exact terms for each bundled profile/data source are clear. Keep code, generated filters, measurement data, and external source licenses separate in the register. |
| EasyEffects | Public repository is a desktop application and has separate code, plugin, and preset assets. | Reference only until individual algorithm and asset licenses are audited. Do not treat the desktop project as a drop-in browser dependency. |

## Licensing decision

The project will not bundle repository code, WASM files, headphone profile data, impulse responses, or generated artifacts solely because a public listing says “open source.” Before reuse, the exact license file and asset provenance must be recorded. If any data terms remain unclear, YouTune will support user-imported profiles and use original implementation for the first release.

## Source URLs

- https://github.com/Frieve-A/effetune
- https://github.com/Frieve-A/effetune/blob/main/README.md
- https://github.com/grame-cncm/faustwasm
- https://github.com/jaakkopasanen/AutoEq
- https://github.com/jaakkopasanen/AutoEq/blob/master/LICENSE
- https://github.com/jaakkopasanen/AutoEq/issues/790
- https://github.com/wwmm/easyeffects

## Browser API and architecture audit

Chrome's official API results identify Manifest V3 as the current extension architecture and expose a dedicated `tabCapture` API for obtaining a tab media stream. Public API results state that tab capture requires a user action, making it a higher-friction route for a persistent listening extension. Microsoft documents Chrome API compatibility as the preferred path for porting extensions to Edge, which supports the one-codebase strategy.

The architecture decision remains:

| Route | Benefit | Risk | Decision |
|---|---|---|---|
| Source-level Web Audio processing | Lower permission burden and direct processing of the active media element | YouTube can replace media elements or change player behavior; lifecycle handling must be robust | Preferred first route; validate in the prototype |
| `tabCapture` | More general tab-level audio access | User gesture requirement, stream lifecycle, routing, latency, and permission complexity | Fallback only if source-level processing fails acceptance tests |

## Source URLs

- https://developer.chrome.com/docs/extensions/reference/api
- https://developer.chrome.com/docs/extensions/reference/api/tabCapture
- https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension
- https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/chrome-extensions/SKILL.md

## Direct documentation verification

The official Chrome `tabCapture` documentation confirms two important constraints: capture can only be called after the user invokes the extension, and captured tab audio stops playing to the user unless the extension explicitly routes the returned MediaStream back to an AudioContext destination. This validates the decision to avoid tab capture in the first YouTune architecture and keep it as a fallback experiment only.

The Microsoft Edge URL previously recorded as `https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome` returned a 404 during direct verification. The Edge compatibility claim should therefore be cited from a currently valid Microsoft page before a final publication report. The earlier search result remains an unverified lead, not final evidence.

## Direct verification source

- https://developer.chrome.com/docs/extensions/reference/api/tabCapture

## Direct competitor listing verification

The linked extension's Chrome Web Store page currently shows **4.7 stars**, **40,000 users**, **version 3.0.2**, an update date of **January 31, 2025**, a listed size of **335 KiB**, and a public disclosure that the developer will not collect or use user data. The listing describes a YouTube page control placed below the video and more than ten default settings. The page also visibly shows **461 ratings** near the header while the review section says **4.7 out of 5461 ratings**, an internal inconsistency that should not be repeated without qualification.

The direct listing confirms that a basic YouTube equalizer can already have substantial adoption and strong public ratings. YouTune therefore cannot rely on “EQ plus presets” as a sufficient value proposition. It must compete on a clearly explained improvement such as correction profiles, reliable persistence and recovery, safe output behavior, or a user-visible status and diagnostics experience.

## Direct competitor source

- https://chromewebstore.google.com/detail/audio-equalizer-for-youtu/dcjnokfichnijppmkbgpafmdjghibike

## Store publishing documentation verified

The official Chrome Web Store publishing guide confirms that the first upload is a ZIP through the Chrome Developer Dashboard, followed by Package, Store Listing, Privacy, Distribution, and optional Test instructions sections. It also documents deferred publishing after review.[1]

The current Microsoft Edge Add-ons publishing guide confirms that the submitted ZIP must include the manifest and required assets, and that manifest name, description, and short description feed into the listing. It also calls out availability, privacy, permission justification, remote-code declaration, store listing details, search terms, and certification test notes.[2]

[1]: https://developer.chrome.com/docs/webstore/publish "Publish in the Chrome Web Store"
[2]: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension "Publish a Microsoft Edge extension"

## Direct open-source verification: EffeTune

The official EffeTune repository describes a real-time audio effect processor and documents browser support through Web Audio API and Audio Worklet. Its repository page links a MIT License, and the direct license page states that the software may be used, modified, and distributed subject to preserving the copyright and license notice.[1] [2]

YouTune currently does **not** bundle EffeTune code, WASM, presets, or assets. EffeTune is a reference project and an architectural inspiration for effect-oriented browser audio, not a dependency in the current package.

[1]: https://github.com/Frieve-A/effetune "Frieve-A/effetune"
[2]: https://github.com/Frieve-A/effetune/blob/main/LICENSE "EffeTune LICENSE"

## Direct open-source verification: FaustWasm and AutoEq

The official FaustWasm repository describes a TypeScript-oriented library that wraps the Faust compiler, compiles Faust DSP to WebAssembly, and exposes the result as WebAudio nodes. Its repository contains `COPYING.txt` identifying an LGPL license.[1]

The official AutoEq repository describes automatic headphone equalization from measured frequency responses. It identifies the repository as MIT-licensed and includes measurement, target, and result collections from multiple sources. YouTune currently bundles none of AutoEq's code, measurement data, target data, or result profiles.[2]

[1]: https://github.com/grame-cncm/faustwasm "grame-cncm/faustwasm"
[2]: https://github.com/jaakkopasanen/AutoEq "jaakkopasanen/AutoEq"
