# YouTune Audio Laboratory Report

## Scope

This laboratory evaluates deterministic DSP building blocks before any YouTube integration. The test engine is pure JavaScript so behavior can be checked independently from extension lifecycle, media-element replacement, and browser permissions.

The current lab covers a 10-band graphic EQ, preamp gain, peak safety ceiling, short-term RMS loudness proxy, psychoacoustic-style bass enhancement prototype, and simple crossfeed. It also includes automated tests and generated benchmark output.

## Files

| File | Purpose |
|---|---|
| `lab/dsp.mjs` | Deterministic DSP functions and signal generators |
| `lab/test-dsp.mjs` | Automated sanity and safety tests |
| `lab/run-benchmarks.mjs` | Frequency-response and processing benchmarks |
| `lab/benchmark-results.json` | Machine-readable benchmark results |
| `lab/eq-response.csv` | Frequency-response table for analysis |
| `lab/benchmark-output.txt` | Captured benchmark output |

## Automated test result

The laboratory test suite passes. It verifies signal generation, flat-EQ stability, a targeted 1 kHz EQ boost, overload protection, loudness-window generation, conservative bass enhancement, and crossfeed channel interaction.

The test command was:

```text
node test-dsp.mjs
```

The result was:

```text
YouTune DSP lab tests passed
```

## Benchmark findings

The flat 10-band EQ produced a 0 dB response at all measured test bands in the deterministic tone test. The targeted 1 kHz vocal-style boost produced approximately +6 dB at 1 kHz, with the expected smaller response around neighboring frequencies. This confirms that the filter coefficient and processing chain are behaving predictably for the initial prototype.

The safety test intentionally overloaded a 1 kHz signal to a peak of approximately 2.01 linear amplitude. The peak ceiling reduced the output to approximately 0.891 linear amplitude, equivalent to -1 dBFS. This is a useful baseline protection result, but it is not yet a production-grade look-ahead limiter. YouTune should not expose aggressive preamp or enhancement settings until a proper real-time safety stage is implemented and tested in an AudioWorklet or equivalent processing node.

The bass-enhancement prototype added approximately 0.029 linear peak amplitude to a 0.2-amplitude 80 Hz test tone at the conservative test setting. The output remained below 0.5 linear amplitude in this test. This demonstrates that the prototype produces measurable harmonic content, not that it sounds better. Listening tests and distortion measurements are still required before this feature can be considered for YouTune.

The crossfeed prototype preserved buffer length and introduced a controlled opposite-channel contribution after the configured short delay. This confirms basic operation, but the model is intentionally simple and is not suitable for shipping without listening evaluation and a clearer psychoacoustic design.

| Test | Result | Interpretation |
|---|---:|---|
| Flat EQ response | 0 dB at all measured bands | Good deterministic baseline |
| +6 dB at 1 kHz | Approximately +6 dB at 1 kHz | EQ control behaves as intended |
| Overloaded input peak | Approximately 2.01 | Safety test successfully exercises overload |
| Limited output peak | Approximately 0.891, -1 dBFS | Basic ceiling works; not yet a look-ahead limiter |
| Bass enhancer output increase | Approximately +0.029 peak | Measurable effect; subjective value unproven |
| Crossfeed delayed contribution | 0.2 at the configured delayed sample | Prototype operates; quality unproven |

## Important limitation discovered

The loudness calculation in this first lab is explicitly an RMS proxy, not a standards-compliant LUFS or EBU R128 implementation. It is useful for checking windowing and relative level behavior, but it must not be marketed as LUFS normalization. The next version should either implement or integrate a verified loudness algorithm and test it against reference material before adding a loudness mode to YouTune.

The benchmark also demonstrates why each experimental module must be evaluated on comparable input material. The source loudness and enhanced loudness numbers in the JSON are from different test signals and must not be interpreted as a before-and-after quality comparison.

## Decisions from the laboratory phase

The native Web Audio-style EQ and basic output ceiling are ready to become the baseline prototype. The bass enhancer and crossfeed remain experimental. The loudness feature needs a standards-aware implementation before it can be evaluated as a product capability. FaustWasm remains a candidate for one isolated comparison, not a required dependency.

The next phase should build a minimal Manifest V3 YouTune prototype with a modular processing configuration and reliability diagnostics. It should use native Web Audio nodes first, preserve the lab's safety and bypass principles, and avoid shipping the experimental bass, crossfeed, or loudness features as enabled defaults.
