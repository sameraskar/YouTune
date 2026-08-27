# YouTune Third-Party Software and Research Disclosure

This document records open-source projects that informed YouTune's design and the current status of any code, data, or assets from those projects.

## Summary

The current YouTune browser package does not bundle third-party runtime JavaScript, WebAssembly, headphone measurements, headphone target data, headphone result profiles, impulse responses, or copied assets from the open-source projects listed below. The active audio graph uses the browser's native Web Audio API. The package does include YouTune branding artwork supplied for this project; its separate provenance and rights conditions are recorded in [`assets/ARTWORK-NOTICE.md`](../assets/ARTWORK-NOTICE.md).

The projects below are **research references**, not current YouTune dependencies. Their repositories and licenses were checked before they were named here. If a future release bundles or links one of them as a runtime dependency, this document must be updated with the exact version, files, license notice, source obligations, and distribution details.

## Reference projects

### EffeTune

Repository: [Frieve-A/effetune](https://github.com/Frieve-A/effetune)

License: [MIT License](https://github.com/Frieve-A/effetune/blob/main/LICENSE)

Why it matters: EffeTune is a real-time audio effect processor with browser-oriented Web Audio and AudioWorklet support. YouTune uses it as a reference for listener-facing effect design and for thinking about how a richer processing chain could work in a browser.

Current status: No EffeTune source, WASM, preset, or asset is bundled in YouTune.

### FaustWasm

Repository: [grame-cncm/faustwasm](https://github.com/grame-cncm/faustwasm)

License file: [COPYING.txt](https://github.com/grame-cncm/faustwasm/blob/master/COPYING.txt)

Why it matters: FaustWasm demonstrates a route from Faust DSP code to WebAssembly and WebAudio nodes. It is a candidate for future specialized processing if YouTune needs more advanced effects than native Web Audio nodes can provide.

Current status: FaustWasm is not a YouTune dependency. No Faust source, generated WASM, wrapper code, or compiled artifact is bundled in the current extension. Any future use must comply with the exact LGPL terms that apply to the selected version and its distribution model.

### Supplied YouTune branding artwork

The icon source and derived browser sizes are project branding assets supplied for YouTune. They are not from EffeTune, FaustWasm, AutoEq, or another open-source runtime project. The publisher must confirm the right to reproduce and distribute them before store submission. See [`assets/ARTWORK-NOTICE.md`](../assets/ARTWORK-NOTICE.md).

### AutoEq

Repository: [jaakkopasanen/AutoEq](https://github.com/jaakkopasanen/AutoEq)

License: [MIT License](https://github.com/jaakkopasanen/AutoEq/blob/master/LICENSE)

Why it matters: AutoEq provides tools and data structures for headphone equalization based on measured frequency responses. It is a strong reference for a possible future YouTune headphone-correction feature.

Current status: YouTune does not bundle AutoEq code, measurements, targets, or results. The fact that the repository code is MIT-licensed does not automatically make every measurement or profile source freely redistributable under the same terms. A future profile catalog must track data provenance separately.

## Native browser platform

YouTune uses the standard Web Audio API provided by Chromium. This is a browser platform API rather than a copied third-party library. The extension also uses the Manifest V3 extension APIs for storage, messaging, tabs, and service-worker lifecycle.

## Attribution policy

YouTune-authored source is licensed under the MIT License in the repository root. Third-party projects retain their own copyright and license terms. A future pull request that adds a dependency must include the following information:

| Required record | What to document |
|---|---|
| Project and version | Exact repository URL, release, tag, or commit |
| License | License name, license URL, and required notice text |
| Included material | Source files, generated files, WASM, data, presets, or assets |
| Build method | How the material enters the extension package |
| Distribution duties | Source offer, notice, attribution, or other obligations |
| Privacy and security | Network behavior, remote code, permissions, and supply-chain review |
| Performance | Bundle size, CPU cost, memory use, latency, and failure behavior |

The words “inspired by” do not grant permission to copy code or data. YouTune will keep research references and shipped dependencies clearly separated.

## Disclaimer

This is a project-maintenance disclosure, not legal advice. Before a public store release that bundles external code or data, obtain an appropriate license review for the exact materials and distribution model.
