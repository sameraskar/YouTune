# YouTune 0.2.3 final release report

## Status

YouTune 0.2.3 is **engineering-ready for final owner-run browser validation**. This patch fixes the remaining visible UI defect reported during manual testing: after an EQ slider was changed, the popup internally entered the Custom state but the selector displayed a blank value because Custom was not an option. The selector now includes Custom, slider edits visibly select it, and choosing Custom preserves the current EQ curve.

The broader Chrome, Edge, YouTube, and YouTube Music behavior was reported by the publisher as working before this patch. The focused Custom behavior still needs one short manual confirmation after reloading the 0.2.3 unpacked extension or installing the final package. Store publication has not been performed by this report.

## Automated evidence

The release source includes explicit structural assertions for the Custom option, popup selector state, named-preset behavior, narrow permissions, local-only processing boundaries, and bypass re-enable behavior. The package version is 0.2.3 in both `package.json` and `prototype/manifest.json`.

The completed validation commands were:

```bash
npm test
npm run build -- 0.2.3
npm run release-check
```

All three commands passed. Structural validation reported 16 named presets, the DSP laboratory passed, and the release checker reported 12 runtime package entries. The build output is `dist/youtune-0.2.3.zip`. Its SHA-256 checksum is `4241951b5479b1ea069abf5ee14cfa134a3334fd1dd51570a9c857008156585e`. The store ZIP is intentionally runtime-only and must contain `manifest.json` at its root, the extension runtime files, and the 16, 48, and 128 pixel icons. It must not contain the repository README, license, laboratory, reports, or development validator.

## Manual owner gate

Reload the unpacked `prototype` directory in current stable Chrome and Edge, open YouTube or YouTube Music, start playback, open the YouTune popup, and move one EQ slider. The selector must display **Custom**, playback must continue, and the edited curve must remain active after closing and reopening the popup. The publisher should then rerun the existing manual matrix in `docs/RELEASE_CHECKLIST.md`, especially bypass and re-enable, YouTube navigation, YouTube Music track changes, reconnect, and output-device checks.

## Publishing inputs

Use `docs/STORE_LISTING.md` for the prepared store copy, support URL, privacy policy URL, non-affiliation statement, screenshot reference, and certification notes. Upload only `dist/youtune-0.2.3.zip` to the Chrome Web Store Developer Dashboard or Microsoft Edge Partner Center. Keep the GitHub source archive separate from the store package.

Before submission, the publisher must confirm rights to distribute the supplied artwork, verify that the public privacy-policy URL is readable, confirm that GitHub Issues will be monitored, and complete the store-specific declarations. The extension must not be described as universally compatible, clinically beneficial, lossless, perfectly normalized, or equipped with a production-grade limiter.

## Files

| Purpose | Path |
|---|---|
| Store upload package | `dist/youtune-0.2.3.zip` |
| Full source | `YouTune-GitHub-Source-0.2.3.zip` |
| Publishing guide | `docs/PUBLISHING.md` |
| Store listing copy | `docs/STORE_LISTING.md` |
| Privacy policy | `docs/PRIVACY.md` |
| Manual release checklist | `docs/RELEASE_CHECKLIST.md` |
| Artwork rights notice | `assets/ARTWORK-NOTICE.md` |
| This report | `reports/release-final-0.2.3.md` |

## Decision

The code and packaging work for 0.2.3 are complete when the automated commands pass and the final ZIP contents are inspected. The release becomes store-submission ready only after the publisher completes the focused Custom check and the remaining manual Chrome and Edge checklist rows, then confirms artwork and support ownership. No store dashboard upload or store approval is claimed here.

---

Prepared by **Manus AI** for the YouTune project.

> This report records the 0.2.3 engineering state. The older `reports/release-final-0.2.2.md` remains as a historical release record.

## References

[1]: https://github.com/sameraskar/YouTune/issues "YouTune support and security issues"
[2]: https://github.com/sameraskar/YouTune/blob/main/docs/PRIVACY.md "YouTune privacy policy"
[3]: https://developer.chrome.com/docs/webstore/publish "Publish in the Chrome Web Store"
[4]: https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension "Publish a Microsoft Edge extension"
