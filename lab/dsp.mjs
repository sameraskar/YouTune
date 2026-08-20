// YouTune DSP laboratory engine
// This lab intentionally uses pure JavaScript so each stage can be tested deterministically
// before it is moved into Web Audio nodes or an AudioWorklet/WASM module.

export const DEFAULT_SAMPLE_RATE = 48000;

export const EQ_BANDS = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export function dbToGain(db) {
  return 10 ** (db / 20);
}

export function gainToDb(gain) {
  return 20 * Math.log10(Math.max(gain, 1e-12));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// RBJ cookbook peaking EQ coefficients.
export function peakingCoefficients({ frequency, gainDb, q = 1, sampleRate = DEFAULT_SAMPLE_RATE }) {
  const A = 10 ** (gainDb / 40);
  const omega = 2 * Math.PI * frequency / sampleRate;
  const alpha = Math.sin(omega) / (2 * q);
  const cosOmega = Math.cos(omega);

  const b0 = 1 + alpha * A;
  const b1 = -2 * cosOmega;
  const b2 = 1 - alpha * A;
  const a0 = 1 + alpha / A;
  const a1 = -2 * cosOmega;
  const a2 = 1 - alpha / A;

  return {
    b0: b0 / a0,
    b1: b1 / a0,
    b2: b2 / a0,
    a1: a1 / a0,
    a2: a2 / a0,
  };
}

export class Biquad {
  constructor(coefficients) {
    this.setCoefficients(coefficients);
    this.reset();
  }

  setCoefficients(coefficients) {
    Object.assign(this, coefficients);
  }

  reset() {
    this.x1L = 0;
    this.x2L = 0;
    this.y1L = 0;
    this.y2L = 0;
    this.x1R = 0;
    this.x2R = 0;
    this.y1R = 0;
    this.y2R = 0;
  }

  processSample(x, channel = 0) {
    const prefix = channel === 0 ? 'L' : 'R';
    const y = this.b0 * x + this.b1 * this[`x1${prefix}`] + this.b2 * this[`x2${prefix}`]
      - this.a1 * this[`y1${prefix}`] - this.a2 * this[`y2${prefix}`];
    this[`x2${prefix}`] = this[`x1${prefix}`];
    this[`x1${prefix}`] = x;
    this[`y2${prefix}`] = this[`y1${prefix}`];
    this[`y1${prefix}`] = y;
    return y;
  }
}

export function createGraphicEq(gainsDb, { q = 1.1, sampleRate = DEFAULT_SAMPLE_RATE } = {}) {
  if (gainsDb.length !== EQ_BANDS.length) {
    throw new Error(`Expected ${EQ_BANDS.length} EQ bands, received ${gainsDb.length}`);
  }
  return gainsDb.map((gainDb, index) => new Biquad(peakingCoefficients({
    frequency: EQ_BANDS[index],
    gainDb,
    q,
    sampleRate,
  })));
}

export function processStereoEq(left, right, filters) {
  if (left.length !== right.length) throw new Error('Stereo channels must have equal length');
  const outL = new Float32Array(left.length);
  const outR = new Float32Array(right.length);
  for (let i = 0; i < left.length; i += 1) {
    let l = left[i];
    let r = right[i];
    for (const filter of filters) {
      l = filter.processSample(l, 0);
      r = filter.processSample(r, 1);
    }
    outL[i] = l;
    outR[i] = r;
  }
  return { left: outL, right: outR };
}

export function applyGain(left, right, gainDb) {
  const gain = dbToGain(gainDb);
  const outL = Float32Array.from(left, (value) => value * gain);
  const outR = Float32Array.from(right, (value) => value * gain);
  return { left: outL, right: outR };
}

// Simple peak safety stage for laboratory evaluation. Production should use
// a proper look-ahead limiter or a carefully tested AudioWorklet implementation.
export function applyPeakCeiling(left, right, ceilingDb = -1) {
  const ceiling = dbToGain(ceilingDb);
  let peak = 0;
  for (let i = 0; i < left.length; i += 1) {
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }
  const scale = peak > ceiling ? ceiling / peak : 1;
  return {
    left: Float32Array.from(left, (value) => value * scale),
    right: Float32Array.from(right, (value) => value * scale),
    peakBefore: peak,
    scale,
  };
}

// Short-term RMS loudness proxy. This is deliberately labelled a proxy,
// not a standards-compliant integrated LUFS implementation.
export function rmsDb(left, right) {
  if (!left.length) return -Infinity;
  let energy = 0;
  for (let i = 0; i < left.length; i += 1) {
    energy += (left[i] ** 2 + right[i] ** 2) / 2;
  }
  return gainToDb(Math.sqrt(energy / left.length));
}

export function estimateShortTermLoudness(left, right, windowSize = 4800) {
  const result = [];
  for (let start = 0; start < left.length; start += windowSize) {
    const end = Math.min(start + windowSize, left.length);
    result.push(rmsDb(left.slice(start, end), right.slice(start, end)));
  }
  return result;
}

// Conservative harmonic bass enhancer. The input is mixed to mono for the
// detector, and two soft harmonics are added to preserve stereo placement.
export function applyBassEnhancer(left, right, {
  amount = 0.12,
  cutoffHz = 140,
  sampleRate = DEFAULT_SAMPLE_RATE,
} = {}) {
  const outL = new Float32Array(left.length);
  const outR = new Float32Array(right.length);
  let lowpass = 0;
  const smoothing = 1 - Math.exp(-2 * Math.PI * cutoffHz / sampleRate);
  for (let i = 0; i < left.length; i += 1) {
    const mono = (left[i] + right[i]) / 2;
    lowpass += smoothing * (mono - lowpass);
    const harmonic = amount * (0.55 * Math.sin(2 * Math.asin(clamp(lowpass, -1, 1)))
      + 0.25 * Math.sin(3 * Math.asin(clamp(lowpass, -1, 1))));
    outL[i] = left[i] + harmonic;
    outR[i] = right[i] + harmonic;
  }
  return { left: outL, right: outR };
}

// Simple headphone crossfeed model for initial A/B testing.
export function applyCrossfeed(left, right, { mix = 0.12, delaySamples = 24 } = {}) {
  const outL = new Float32Array(left.length);
  const outR = new Float32Array(right.length);
  const amount = clamp(mix, 0, 0.5);
  for (let i = 0; i < left.length; i += 1) {
    const delayedL = i >= delaySamples ? left[i - delaySamples] : 0;
    const delayedR = i >= delaySamples ? right[i - delaySamples] : 0;
    outL[i] = (1 - amount) * left[i] + amount * delayedR;
    outR[i] = (1 - amount) * right[i] + amount * delayedL;
  }
  return { left: outL, right: outR };
}

export function generateSine({ frequency = 1000, seconds = 1, amplitude = 0.5, sampleRate = DEFAULT_SAMPLE_RATE } = {}) {
  const length = Math.floor(seconds * sampleRate);
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const value = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
    left[i] = value;
    right[i] = value;
  }
  return { left, right };
}

export function generateStereoImpulse(length = DEFAULT_SAMPLE_RATE) {
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  left[0] = 1;
  right[0] = 1;
  return { left, right };
}

export function peakAbs(left, right) {
  let peak = 0;
  for (let i = 0; i < left.length; i += 1) {
    peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  }
  return peak;
}
