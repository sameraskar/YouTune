# YouTune 0.2.3 release checklist

This checklist is the final gate for the YouTune browser extension. It separates checks that are automated and completed from checks that require a person to use the extension in current Chrome and Edge builds.

## Completed automatically

- [x] Manifest V3 is used.
- [x] The package requests only the `storage` permission.
- [x] Host access is limited to YouTube and YouTube Music.
- [x] No tab capture, microphone, identity, or all-sites permission is requested.
- [x] No remote-code pattern, network upload path, or audio upload path is present in the runtime source.
- [x] The package and manifest versions match.
- [x] The package contains the manifest at its ZIP root.
- [x] The store package contains only runtime files and the 16, 48, and 128 pixel icons.
- [x] The package excludes the development validator, DSP laboratory, reports, source archive, and repository documentation.
- [x] The source and DSP laboratory tests pass.
- [x] The release checker passes.
- [x] The privacy policy has a maintained GitHub Issues destination.
- [x] The listing includes support, privacy, and independent-product statements.
- [x] The current options page does not expose inactive experimental controls.
- [x] Bypass re-enables the selected EQ curve instead of leaving the filters at zero.
- [x] The original artwork provenance notice is present.

## Manual Chrome and Edge gate

Load the `prototype` directory unpacked in the latest stable Chrome and Edge versions. Then run the same scenarios against the exact ZIP package if the browser permits local installation of that package.

| Scenario | Chrome | Edge | Result required |
|---|---|---|---|
| YouTube video starts with YouTune already installed | [ ] | [ ] | Audio remains audible and the status becomes connected |
| YouTube Music track starts with YouTune already installed | [ ] | [ ] | Audio remains audible and the status becomes connected |
| Select each of the 16 named presets | [ ] | [ ] | The tone changes and no preset silently lowers preamp |
| Move each EQ slider | [ ] | [ ] | The visible selector changes to Custom and playback continues |
| Disable and re-enable Processing | [ ] | [ ] | Audio remains audible and the EQ curve returns when re-enabled |
| Use Bypass and then enable processing | [ ] | [ ] | Bypass is clean and the EQ curve returns afterward |
| Use Reset | [ ] | [ ] | Flat values and normal preamp are restored |
| Navigate to another YouTube video without reloading the tab | [ ] | [ ] | The new media element is processed once |
| Change tracks in YouTube Music | [ ] | [ ] | The new track remains audible and the graph reconnects |
| Close and reopen the popup | [ ] | [ ] | The graph remains active and settings persist |
| Reload the extension and press Reconnect | [ ] | [ ] | Playback remains audible and reconnect works |
| Test speakers, headphones, and Bluetooth output | [ ] | [ ] | No duplicate audio, silence, or unexpected routing |
| Inspect the extension and page consoles | [ ] | [ ] | No recurring errors or unhandled connection failures |

## Submission preparation

- [ ] Confirm the publisher owns or is authorized to distribute the supplied YouTune artwork.
- [ ] Confirm that the GitHub Issues URL will be monitored for support and security reports.
- [ ] Confirm the GitHub privacy-policy URL is publicly readable.
- [ ] Capture at least one screenshot from the final tested extension. The repository contains a promotional preview at `assets/store-screenshots/youtune-popup-rock.png`; replace it with a direct capture if the store or reviewer requires proof from the running extension.
- [ ] Use `docs/STORE_LISTING.md` for the short description, long description, search terms, support URL, privacy URL, and certification notes.
- [ ] Upload `dist/youtune-0.2.3.zip`, not the repository root.
- [ ] Complete the Chrome Web Store Package, Store Listing, Privacy, Distribution, and Test instructions sections.
- [ ] Complete the Edge Add-ons availability, properties, privacy, listing, language, search terms, and certification sections.
- [ ] Do not claim universal website support, hearing improvement, guaranteed sound quality, LUFS normalization, lossless restoration, or a production-grade limiter.

## Release decision

The Custom selector state was fixed in 0.2.3: slider edits now expose Custom as a visible option and retain the edited curve. The user reported that the broader Chrome, Edge, YouTube, and YouTube Music scenarios worked before this final patch; only the focused Custom behavior remains to be rechecked after reloading 0.2.3. The extension is technically ready for owner-run browser validation when every automated item above is checked. It is store-submission ready only after the manual Chrome and Edge rows pass and the publisher confirms the artwork and support details.
