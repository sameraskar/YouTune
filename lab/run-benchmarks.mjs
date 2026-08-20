import fs from 'node:fs';
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
  gainToDb,
  peakAbs,
  rmsDb,
} from './dsp.mjs';

const sampleRate = DEFAULT_SAMPLE_RATE;
const frequencies = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

function processTone(frequency, gainsDb) {
  const source = generateSine({ frequency, seconds: 0.4, amplitude: 0.25, sampleRate });
  const filters = createGraphicEq(gainsDb, { sampleRate });
  const left = new Float32Array(source.left.length);
  const right = new Float32Array(source.right.length);
  for (let i = 0; i < source.left.length; i += 1) {
    let l = source.left[i];
    let r = source.right[i];
    for (const filter of filters) {
      l = filter.processSample(l, 0);
      r = filter.processSample(r, 1);
    }
    left[i] = l;
    right[i] = r;
  }
  const skip = Math.floor(sampleRate * 0.1);
  return {
    frequency,
    inputRmsDb: rmsDb(source.left.slice(skip), source.right.slice(skip)),
    outputRmsDb: rmsDb(left.slice(skip), right.slice(skip)),
    responseDb: rmsDb(left.slice(skip), right.slice(skip)) - rmsDb(source.left.slice(skip), source.right.slice(skip)),
    peak: peakAbs(left, right),
  };
}

const flatGains = new Array(EQ_BANDS.length).fill(0);
const vocalGains = EQ_BANDS.map((frequency) => (frequency === 1000 ? 6 : 0));
const flatResponse = frequencies.map((frequency) => processTone(frequency, flatGains));
const vocalResponse = frequencies.map((frequency) => processTone(frequency, vocalGains));

const overload = generateSine({ frequency: 1000, seconds: 0.4, amplitude: 0.8, sampleRate });
const boosted = applyGain(overload.left, overload.right, 8);
const limited = applyPeakCeiling(boosted.left, boosted.right, -1);

const low = generateSine({ frequency: 80, seconds: 0.4, amplitude: 0.2, sampleRate });
const enhanced = applyBassEnhancer(low.left, low.right, { amount: 0.1, sampleRate });
const impulseL = new Float32Array(128);
const impulseR = new Float32Array(128);
impulseL[0] = 1;
impulseR[0] = 1;
const crossfed = applyCrossfeed(impulseL, impulseR, { mix: 0.2, delaySamples: 4 });

const report = {
  sampleRate,
  eqBands: EQ_BANDS,
  flatResponse,
  vocalResponse,
  safety: {
    overloadedPeakBefore: peakAbs(boosted.left, boosted.right),
    limitedPeakAfter: peakAbs(limited.left, limited.right),
    limiterScale: limited.scale,
    limitedPeakDb: gainToDb(peakAbs(limited.left, limited.right)),
  },
  loudnessProxy: {
    sourceWindowDb: estimateShortTermLoudness(overload.left, overload.right, 4800),
    enhancedWindowDb: estimateShortTermLoudness(enhanced.left, enhanced.right, 4800),
  },
  bassEnhancer: {
    inputPeak: peakAbs(low.left, low.right),
    outputPeak: peakAbs(enhanced.left, enhanced.right),
    addedPeak: peakAbs(enhanced.left, enhanced.right) - peakAbs(low.left, low.right),
  },
  crossfeed: {
    directLeft: crossfed.left[0],
    delayedRight: crossfed.right[4],
  },
};

fs.writeFileSync('benchmark-results.json', `${JSON.stringify(report, null, 2)}\n`);
const csv = [
  'scenario,frequency_hz,input_rms_db,output_rms_db,response_db,peak',
  ...flatResponse.map((row) => `flat,${row.frequency},${row.inputRmsDb},${row.outputRmsDb},${row.responseDb},${row.peak}`),
  ...vocalResponse.map((row) => `vocal_1khz_boost,${row.frequency},${row.inputRmsDb},${row.outputRmsDb},${row.responseDb},${row.peak}`),
].join('\n');
fs.writeFileSync('eq-response.csv', `${csv}\n`);
console.log(JSON.stringify(report, null, 2));
