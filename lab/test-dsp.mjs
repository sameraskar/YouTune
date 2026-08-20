import assert from 'node:assert/strict';
import {
  DEFAULT_SAMPLE_RATE,
  EQ_BANDS,
  applyBassEnhancer,
  applyCrossfeed,
  applyGain,
  applyPeakCeiling,
  createGraphicEq,
  estimateShortTermLoudness,
  generateSine,
  generateStereoImpulse,
  peakAbs,
  rmsDb,
} from './dsp.mjs';

function approx(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} not within ${tolerance} of ${expected}`);
}

// 1. Conversion and signal generation sanity.
const sine = generateSine({ frequency: 1000, seconds: 0.25, amplitude: 0.5 });
assert.equal(sine.left.length, DEFAULT_SAMPLE_RATE / 4);
approx(peakAbs(sine.left, sine.right), 0.5, 0.001, 'sine peak');
assert.ok(rmsDb(sine.left, sine.right) < -5 && rmsDb(sine.left, sine.right) > -10, 'sine RMS should be approximately -9 dBFS');

// 2. Flat EQ should not create a large level change.
const flatFilters = createGraphicEq(new Array(EQ_BANDS.length).fill(0));
const flat = {
  left: sine.left.slice(),
  right: sine.right.slice(),
};
const flatResult = (() => {
  const outL = new Float32Array(flat.left.length);
  const outR = new Float32Array(flat.right.length);
  for (let i = 0; i < flat.left.length; i += 1) {
    let l = flat.left[i];
    let r = flat.right[i];
    for (const filter of flatFilters) {
      l = filter.processSample(l, 0);
      r = filter.processSample(r, 1);
    }
    outL[i] = l;
    outR[i] = r;
  }
  return { left: outL, right: outR };
})();
assert.ok(Math.abs(rmsDb(flatResult.left, flatResult.right) - rmsDb(flat.left, flat.right)) < 0.25, 'flat EQ level drift');

// 3. Positive gain should increase the target tone, while output ceiling limits peak.
const boostedFilters = createGraphicEq(EQ_BANDS.map((frequency) => (frequency === 1000 ? 6 : 0)));
const boosted = (() => {
  const outL = new Float32Array(sine.left.length);
  const outR = new Float32Array(sine.right.length);
  for (let i = 0; i < sine.left.length; i += 1) {
    let l = sine.left[i];
    let r = sine.right[i];
    for (const filter of boostedFilters) {
      l = filter.processSample(l, 0);
      r = filter.processSample(r, 1);
    }
    outL[i] = l;
    outR[i] = r;
  }
  return { left: outL, right: outR };
})();
assert.ok(rmsDb(boosted.left, boosted.right) > rmsDb(sine.left, sine.right) + 2, 'EQ boost should raise target tone');
const limited = applyPeakCeiling(applyGain(boosted.left, boosted.right, 12).left, applyGain(boosted.left, boosted.right, 12).right, -1);
assert.ok(peakAbs(limited.left, limited.right) <= 0.892, 'peak ceiling should be below -1 dBFS');
assert.ok(limited.scale < 1, 'limiter test should actually scale an overloaded signal');

// 4. Loudness proxy should provide one result per analysis window.
const loudness = estimateShortTermLoudness(sine.left, sine.right, 2400);
assert.equal(loudness.length, 5, 'short-term window count');
assert.ok(loudness.every((value) => Number.isFinite(value)), 'loudness values should be finite');

// 5. Bass enhancement should alter a low-level signal but remain bounded for conservative amount.
const low = generateSine({ frequency: 80, seconds: 0.25, amplitude: 0.2 });
const enhanced = applyBassEnhancer(low.left, low.right, { amount: 0.1 });
assert.ok(peakAbs(enhanced.left, enhanced.right) > peakAbs(low.left, low.right), 'bass enhancer should add a measurable harmonic component');
assert.ok(peakAbs(enhanced.left, enhanced.right) < 0.5, 'conservative bass enhancer should remain bounded');

// 6. Crossfeed should preserve length and introduce a controlled channel interaction.
const impulse = generateStereoImpulse(128);
const crossfed = applyCrossfeed(impulse.left, impulse.right, { mix: 0.2, delaySamples: 4 });
assert.equal(crossfed.left.length, impulse.left.length);
assert.equal(crossfed.right.length, impulse.right.length);
approx(crossfed.left[0], 0.8, 1e-6, 'crossfeed direct level');
assert.ok(crossfed.right[4] > 0, 'crossfeed should reach the opposite channel after delay');

console.log('YouTune DSP lab tests passed');
