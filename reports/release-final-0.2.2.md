# YouTune 0.2.2 final release report

## Decision

YouTune 0.2.2 is **engineering-ready for final owner-run browser validation**. The previously identified release blockers have been corrected, the source and package checks pass, and the store package is minimal and correctly rooted. It is ready for submission only after the manual Chrome and Edge playback matrix is completed and the publisher confirms the artwork rights and support details.

This distinction is deliberate. Automated checks can verify the package and source, but they cannot prove that every current YouTube player transition behaves correctly in every browser and output-device configuration.

## Completed fixes

The release package now has current version metadata, no unfinished privacy-policy contact placeholder, accurate publishing commands, a release-accurate prototype README, explicit artwork provenance, and a dedicated release checklist. The public options page no longer exposes controls for inactive experimental processing. The bypass path restores the selected EQ curve when processing is enabled again. The build scripts produce a runtime-only ZIP and keep development validators, reports, source archives, and repository documentation out of the store package.

The source remains intentionally narrow. It uses Manifest V3, requests `storage` and YouTube/YouTube Music host access only, and does not use tab capture, microphone access, identity access, broad all-sites access, network audio upload, remote code, or an account system. The current runtime has no third-party runtime dependency. EffeTune, FaustWasm, and AutoEq are disclosed as research references and are not bundled.

## Automated evidence

The current release passes `npm test`, including source syntax checks, extension structure checks, preset checks, permission checks, regression checks, and the DSP laboratory. `npm run build -- 0.2.2` produces `dist/youtune-0.2.2.zip` with `manifest.json` at the archive root. `npm run release-check` verifies the version, permissions, privacy and listing URLs, inactive-control boundary, no-remote-code boundary, icon dimensions, and runtime-only ZIP contents.

## Final human gates

The publisher must load `prototype` in current stable Chrome and Edge and complete `docs/RELEASE_CHECKLIST.md`. The important live tests are YouTube video playback, YouTube Music track playback, all 16 presets, slider-to-Custom behavior, bypass and re-enable, reset, SPA navigation, playlist or track changes, popup close, extension reload, Reconnect, Bluetooth output, and a check for silence or duplicate audio.

The publisher must also confirm that the supplied artwork may be distributed in the extension and that the GitHub Issues page will be monitored for support and security reports. The current store listing and privacy URLs point to the public GitHub repository and should be checked after the final commit.

## Store submission package

Upload `dist/youtune-0.2.2.zip` to the Chrome Web Store Developer Dashboard and Microsoft Edge Partner Center. Do not upload the repository root or the GitHub source archive. Use `docs/STORE_LISTING.md` for the store copy, support URL, privacy URL, non-affiliation statement, and certification notes. Do not claim universal website support, clinical hearing improvement, guaranteed audio quality, lossless restoration, loudness normalization, or a production-grade limiter.

## References

[1]: https://developer.chrome.com/docs/webstore/publish "Publish in the Chrome Web Store - Chrome for Developers"
[2]: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy "Chrome Web Store dashboard privacy and listing information"
[3]: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension "Publish a Microsoft Edge extension - Microsoft Learn"
[4]: https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies "Microsoft Edge Add-ons developer policies"
