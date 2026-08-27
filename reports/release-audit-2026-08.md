# YouTune Release-Readiness Audit

**Audit date:** 2026-08-27  
**Audited version:** 0.2.1  
**Target stores:** Chrome Web Store and Microsoft Edge Add-ons  
**Scope:** Source, Manifest V3 package, runtime path, privacy and permissions, documentation, repository hygiene, store metadata, legal/trademark readiness, and required manual testing.

## Executive decision

YouTune is technically close to a publishable private beta, but it is **not ready for public store submission yet**. The basic extension package is structurally sound: it uses Manifest V3, has a YouTube-only host boundary, requests only `storage`, contains local-only processing, includes the required icon sizes, and has reproducible validation and packaging scripts.

The remaining work is not one missing file. It is a release gate made of three different classes of risk. First, there are documentation and store-listing blockers that are straightforward to fix. Second, there are runtime-quality risks that cannot be cleared by static checks, especially live YouTube/YouTube Music lifecycle testing and the options page exposing settings that are not connected to the active graph. Third, there are publication inputs that only the account owner can supply, including a maintained support URL, store screenshots, developer-account details, final legal declarations, and confirmation that the supplied artwork and product name can be used commercially.

The recommended decision is **GO for a controlled manual release candidate, NO-GO for public submission until the Must Fix and Must Prepare items below are completed**.

## Current baseline: what is already in good shape

| Area | Current result | Release interpretation |
|---|---|---|
| Manifest | Manifest V3, version 0.2.1, name, description, service worker, popup, options page, icons, and content script are present. | Structurally ready, subject to final store review. |
| Permissions | Only `storage`; host access is limited to `www.youtube.com` and `music.youtube.com`. | Good least-privilege starting point. |
| Remote code and network | Static scan found no `fetch`, `XMLHttpRequest`, `WebSocket`, `eval`, `new Function`, or remote script loading in the extension source. | Good privacy and MV3 posture. Recheck the final ZIP before upload. |
| Audio route | Source-level Web Audio processing is used instead of `tabCapture`. | Lower permission burden, but live lifecycle testing remains essential. |
| Presets | Sixteen presets are present, with descriptions and custom-slider behavior. | Adequate for first release; preset count is not a market differentiator. |
| Icons | 16, 48, and 128 pixel branded PNG assets are present and referenced by the manifest. | Store asset baseline is present. Screenshots and promotional graphics are still missing. |
| Build | Automated validation and ZIP packaging exist, with `manifest.json` at the ZIP root. | Reproducible packaging is in place. |
| Open-source disclosure | `README.md` and `docs/THIRD_PARTY.md` state that EffeTune, FaustWasm, and AutoEq are references only and are not bundled. | Good transparency, but confirm the final package contains no accidental third-party artifacts. |

## Must Fix before store submission

These are blockers because they create an inaccurate listing, a misleading UI, a broken release document, or a preventable review question.

| ID | Finding | Evidence | Required fix |
|---|---|---|---|
| MF-01 | The publishing guide still contains version `0.2.0` commands. | `docs/PUBLISHING.md` uses `npm run build -- 0.2.0` and the PowerShell equivalent, while the audited package is 0.2.1. | Replace all stale commands with the exact release version. Add a release-command check so documentation cannot silently fall behind the manifest. |
| MF-02 | The privacy policy contains an explicit placeholder telling the owner to replace it before submission. | `docs/PRIVACY.md` says: “Replace this paragraph with a maintained support email or GitHub Issues URL before store submission.” | Replace the placeholder with a real support destination. Use a GitHub Issues URL only if issues will be monitored, or provide a maintained support email. The same URL must be used consistently in both store listings. |
| MF-03 | The options page exposes controls that are stored but not connected to the active processing graph. | `options.js` stores limiter, bass enhancer, crossfeed, and loudness flags; the live `content.js` graph does not consult those flags. | Do one of two things before release: remove or hide the inactive experimental controls, or wire each control into a tested audio path. The safer first-release choice is to hide them and keep only active controls. |
| MF-04 | The repository contains a stale prototype README that says the extension is not store-ready, has only a small set of presets, and is still an early technical spike. | `prototype/README.md` contains outdated prototype wording that conflicts with root `README.md` and version 0.2.1. | Replace it with a concise current extension README or clearly label it as historical documentation outside the shipped source. Do not ship contradictory documentation in the store ZIP. |
| MF-05 | The store package may include unnecessary repository documentation. | The build script copies the root `README.md` and `LICENSE` into the extension ZIP in addition to the `prototype` contents. | Decide deliberately whether these files belong in the submitted package. A minimal store ZIP containing only runtime files reduces review surface. If README and LICENSE remain, ensure every included document is current and useful to reviewers. |
| MF-06 | The user-facing listing does not yet provide a real support/contact destination. | `docs/STORE_LISTING.md` contains listing copy but no support URL or email. | Add the final support URL to the store preparation document and privacy policy. Verify that it works without authentication if possible. |
| MF-07 | The product name and listing must be checked for trademark and affiliation risk. | The name is “YouTune” and the extension operates on YouTube and YouTube Music. | Add a clear non-affiliation statement to the listing and repository, such as “YouTune is an independent extension and is not affiliated with or endorsed by YouTube or Google.” Confirm that the chosen name and icon do not imply official sponsorship. If a store or trademark review raises an issue, be prepared to rename before submission. |
| MF-08 | The supplied logo artwork lacks a documented rights statement from the owner. | The repository preserves the supplied artwork as `assets/youtune-icon-source.png`, but the source does not state who owns or may redistribute it. | Add an asset notice stating that the submitter has the right to use and distribute the artwork, or replace it with artwork whose license and provenance are documented. This is a publication responsibility, not something the MIT source license can solve automatically. |

## Must Prepare before submission

These are not necessarily code defects, but the stores will require them or reviewers will need them to evaluate the product.

| ID | Required item | What must be prepared |
|---|---|---|
| MP-01 | Live Chrome testing | Load the exact `prototype` directory in a clean Chrome profile and test YouTube and YouTube Music. Record browser version, operating system, result, and any console errors. |
| MP-02 | Live Edge testing | Repeat the same test matrix in a clean Edge profile. Do not assume Chrome compatibility is proof of Edge runtime behavior. |
| MP-03 | Lifecycle coverage | Test initial playback, popup opened after playback, popup closed, pause/resume, seek, SPA navigation, next video, playlist changes, YouTube Music track changes, media-element replacement, extension reload, browser restart, and Reconnect. Any silence or duplicate audio is a release blocker. |
| MP-04 | Output-device coverage | Test built-in speakers, wired headphones, Bluetooth headphones, and changing the output device during playback. Confirm that bypass and reconnect never produce silence. |
| MP-05 | Safety coverage | Test strong positive EQ curves and positive preamp settings at high source volume. Confirm the current compressor/ceiling behavior is acceptable and document that it is a basic safety stage, not a production look-ahead limiter. |
| MP-06 | Store screenshots | Capture clean screenshots of the popup, 16-preset selector, EQ controls, bypass state, and a supported YouTube or YouTube Music page. Do not include private account data, unrelated extensions, personal bookmarks, or misleading UI. |
| MP-07 | Store listing assets | Prepare the final icon, screenshots, short description, long description, search terms, category, language, support URL, privacy-policy URL if requested, and optional promotional artwork in the dimensions requested by each dashboard. |
| MP-08 | Certification notes | Prepare exact reviewer steps: install, open YouTube, start playback, open YouTune, select a preset, move a slider, bypass, reconnect, navigate to another video, then repeat on YouTube Music. State clearly that no login is required. |
| MP-09 | Privacy declarations | Declare local settings storage, YouTube host access, no account, no audio upload, no analytics, no remote code, and no sale or sharing of data. These declarations must match the submitted ZIP, not a future roadmap. |
| MP-10 | Permission explanations | Explain `storage` as necessary for local preferences and YouTube host access as necessary to find the active media element and apply the local audio graph. Do not request tab capture, microphone, identity, or all-sites access for this release. |
| MP-11 | Developer accounts | Confirm that Chrome Web Store and Edge Partner Center developer accounts are active and that the account owner has completed any required identity, payment, or verification steps. These account actions cannot be completed from the source repository. |
| MP-12 | Support operation | Decide who will answer user issues, where bug reports go, and how security reports are handled. A store listing with a dead or unmonitored support link is avoidable review risk. |

## Important runtime and product risks

These items may not be visible in a static audit but can still cause rejection or poor reviews.

### Media-element selection

The current content script uses `document.querySelector('video, audio')` and therefore attaches to the first matching media element. That is usually adequate for a normal YouTube page, but it is not a proof that the selected element is always the active player. Test pages with previews, advertisements, picture-in-picture transitions, embedded players, and YouTube Music navigation. If the wrong element is ever selected, improve the selection logic before release.

### Media-element replacement and source-node lifecycle

`createMediaElementSource` has lifecycle implications. Reusing or reconnecting the same media element incorrectly can produce silence or duplicate processing. The current recovery logic is promising, but only the live matrix can establish whether it survives current YouTube behavior. Record evidence for at least a long session and several navigation transitions.

### AudioContext startup behavior

Browsers may suspend an `AudioContext` until a user gesture. Test opening the extension before playback, after playback, and after navigating. The extension should fail safely and visibly, never silently claim that processing is active when the context is suspended or disconnected.

### Bypass semantics

The current bypass approach resets the filter gains and gain stage rather than necessarily removing the entire graph. That can be acceptable, but test that bypass is audibly transparent enough, does not change volume unexpectedly, and does not create a second route. Document the behavior accurately.

### Limiter and loudness claims

The current safety stage is a basic compressor/ceiling baseline. It should not be marketed as a mastering limiter, hearing protection, clipping prevention under every condition, or standards-compliant loudness normalization. Keep the current conservative wording in the listing.

### Inactive experimental features

The options UI currently mentions psychoacoustic bass enhancement, crossfeed, and loudness mode even though these are not active in the live graph. This is both a user-experience problem and a store-accuracy problem. Hide them for the first public release unless they are fully implemented, tested, and described as experimental.

## Store-specific completion list

### Chrome Web Store

The official Chrome publishing flow uses a ZIP upload followed by Package, Store Listing, Privacy, Distribution, and optional Test instructions sections.[1] Before upload, verify the final ZIP root, manifest version, icons, description, permissions, privacy declarations, support destination, screenshots, and test instructions. Chrome review should receive the same behavior described in the listing. The current package should not be submitted until MF-01 through MF-08 and MP-01 through MP-10 are cleared.

### Microsoft Edge Add-ons

Microsoft's current publishing guide requires a developer account, a ZIP containing the manifest and required assets, availability and market settings, properties, privacy declarations, permission justifications, remote-code declaration, data-use certification, privacy-policy information when required, listing details, search terms, and certification testing notes.[2] Edge policies additionally emphasize single purpose, accurate representation, stability and performance, least-privilege permissions, compliant CSP, no unwanted or malicious code, a maintained privacy policy, and a testable product.[3]

Do not copy Chrome's store form mechanically. Review the Edge-specific fields and confirm that the manifest name, description, and short description are the intended listing text. The same support and privacy URLs may be reused if they are accessible and accurate.

## Final package checks

Run the following checks immediately before upload:

| Check | Acceptance condition |
|---|---|
| Version consistency | `package.json`, `prototype/manifest.json`, README commands, publishing guide, and ZIP filename all use the same release version. |
| ZIP root | `manifest.json` is at the root of the submitted ZIP, not inside a parent directory. |
| ZIP contents | No source archives, benchmark results, test audio, private tokens, absolute local paths, unrelated reports, or development-only files are included. |
| Permissions | Only permissions required by the final code are declared. |
| Remote code | No remote scripts, runtime downloads, dynamic code evaluation, or undocumented network calls. |
| Privacy | The policy, dashboard declarations, README, and code all agree. |
| Attribution | YouTune-authored source, supplied artwork, and every third-party dependency or asset have separate provenance statements. |
| Store text | No claims of universal website support, clinical hearing improvement, guaranteed audio quality, lossless restoration, or production-grade limiting. |
| Manual tests | Chrome and Edge live test matrices pass with no silence, duplicate audio, settings loss, or unexplained permission prompt. |
| Repository | Release commit is on `main`, GitHub Actions passes, and the GitHub release/tag matches the submitted version. |

## Recommended order of work

First, correct the documentation and metadata blockers: stale 0.2.0 commands, the privacy-policy placeholder, the stale prototype README, the inactive options controls, the support destination, the non-affiliation statement, and the artwork rights statement. Second, produce a clean release ZIP and test that exact directory in clean Chrome and Edge profiles. Third, capture screenshots and complete store listing fields. Fourth, create a 0.2.1 GitHub release or decide whether the documentation and inactive-control fixes justify a 0.2.2 patch release. Finally, upload to each store only after the manual matrix and final ZIP inspection pass.

## Bottom line

The missing work is manageable, but it is not safe to describe YouTune as release-ready solely because the ZIP builds and the EQ works on a test page. The largest technical unknown is live lifecycle reliability across current YouTube and YouTube Music pages. The largest publication risks are the stale instructions, privacy contact placeholder, inactive settings controls, missing store screenshots, absent support destination, and unverified rights and non-affiliation wording for the name and artwork.

Once the Must Fix items are corrected and both browser matrices pass against the exact upload package, YouTune will be in a credible position for a first public release. It should be presented as an independent, privacy-first YouTube audio tuner with a 10-band EQ and local presets, not as an official YouTube product or a professional mastering, hearing, or loudness-correction system.

## Sources

[1]: https://developer.chrome.com/docs/webstore/publish "Publish in the Chrome Web Store"
[2]: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension "Publish a Microsoft Edge extension"
[3]: https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies "Developer policies for the Microsoft Edge Add-ons website"
[4]: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy "Chrome Web Store privacy and dashboard requirements"
[5]: https://developer.chrome.com/docs/extensions/reference/api/tabCapture "Chrome tabCapture API"

