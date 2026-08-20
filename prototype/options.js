const DEFAULTS = {
  limiterEnabled: true,
  limiterCeilingDb: -1,
  bassEnhancerEnabled: false,
  crossfeedEnabled: false,
  loudnessEnabled: false,
};

const limiterEl = document.querySelector('#limiter');
const ceilingEl = document.querySelector('#ceiling');
const bassEl = document.querySelector('#bass');
const crossfeedEl = document.querySelector('#crossfeed');
const loudnessEl = document.querySelector('#loudness');
const savedEl = document.querySelector('#saved');

async function load() {
  const stored = await chrome.storage.local.get('settings');
  const settings = { ...DEFAULTS, ...(stored.settings ?? {}) };
  limiterEl.checked = settings.limiterEnabled;
  ceilingEl.value = settings.limiterCeilingDb;
  bassEl.checked = Boolean(settings.bassEnhancerEnabled);
  crossfeedEl.checked = Boolean(settings.crossfeedEnabled);
  loudnessEl.checked = Boolean(settings.loudnessEnabled);
}

async function save() {
  const stored = await chrome.storage.local.get('settings');
  const settings = {
    ...DEFAULTS,
    ...(stored.settings ?? {}),
    limiterEnabled: limiterEl.checked,
    limiterCeilingDb: Number(ceilingEl.value),
    bassEnhancerEnabled: bassEl.checked,
    crossfeedEnabled: crossfeedEl.checked,
    loudnessEnabled: loudnessEl.checked,
  };
  await chrome.storage.local.set({ settings });
  savedEl.textContent = 'Saved locally.';
  setTimeout(() => { savedEl.textContent = ''; }, 1800);
}

document.querySelector('#save').addEventListener('click', () => {
  save().catch((error) => { savedEl.textContent = `Save failed: ${error.message}`; });
});
load().catch((error) => { savedEl.textContent = `Load failed: ${error.message}`; });
