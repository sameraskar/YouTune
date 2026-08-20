# YouTune Browser Reliability Test Matrix

This matrix is the required manual gate for the first real-browser run. The prototype has passed structural and syntax checks, but these scenarios require Chrome and Edge with active YouTube playback.

| Area | Scenario | Expected result | Result in current environment |
|---|---|---|---|
| Activation | Fresh YouTube video | YouTune finds the media element and audio remains audible | Not run: no browser automation session available |
| Activation | Fresh YouTube Music track | YouTune finds the media element and audio remains audible | Not run |
| Navigation | YouTube single-page route change | Existing graph recovers or reconnects without duplicate audio | Not run |
| Navigation | Playlist next item | Settings remain active and only one graph is attached | Not run |
| Navigation | Browser back/forward | Status remains visible and processing recovers | Not run |
| Media lifecycle | Pause, resume, seek, volume change | No silence, click, or unexpected level jump | Not run |
| Media lifecycle | Media element replacement | Old nodes disconnect and new media is attached once | Not run |
| Extension lifecycle | Popup closes | Processing continues | Not run |
| Extension lifecycle | Browser restart | Local settings persist and the page can reconnect | Not run |
| Controls | EQ slider and presets | Change applies to the active tab and persists locally | Not run |
| Controls | Bypass | Audio remains audible and processing is bypassed | Not run |
| Controls | Reconnect | User can recover after a failed or delayed attachment | Not run |
| Outputs | Laptop speakers, wired headphones, Bluetooth | No obvious distortion or routing failure | Not run |
| Privacy | Permission review and network audit | Only storage plus YouTube host permissions; no audio upload | Structural check passed; network audit not run |
| Performance | Long session and multiple media tabs | No runaway CPU, duplicated sound, or memory growth | Not run |

## Acceptance rule

The MVP should not be called reliable until the real-browser scenarios above pass on current Chrome and Edge. Failures should be classified as activation, persistence, audio quality, lifecycle, permission, interface, performance, or YouTube Music compatibility issues. Silent failure is a release blocker.
