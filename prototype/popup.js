const DEFAULT_SETTINGS = {
  version: 2,
  enabled: true,
  preampDb: 0,
  eqGainsDb: [...PRESETS.Flat.eq],
  preset: 'Flat',
  limiterEnabled: true,
  limiterCeilingDb: -1,
  processingMode: 'eq',
};

let settings = { ...DEFAULT_SETTINGS, eqGainsDb: [...DEFAULT_SETTINGS.eqGainsDb] };

const statusEl = document.querySelector('#status');
const presetEl = document.querySelector('#preset');
const presetDescriptionEl = document.querySelector('#presetDescription');
const enabledEl = document.querySelector('#enabled');
const preampEl = document.querySelector('#preamp');
const preampValueEl = document.querySelector('#preampValue');
const bandsEl = document.querySelector('#bands');

function setStatus(text, tone = '') {
  statusEl.textContent = text;
  statusEl.className = `status ${tone}`;
}

function populatePresets() {
  presetEl.innerHTML = '';
  PRESET_NAMES.forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    presetEl.appendChild(option);
  });
}

function updatePresetDescription() {
  if (settings.preset === 'Custom') {
    presetDescriptionEl.textContent = 'Custom curve. Change any slider to create your own profile.';
    return;
  }
  const preset = PRESETS[settings.preset];
  presetDescriptionEl.textContent = preset
    ? `${preset.description} Suggested headroom: ${preset.preampDb} dB. Switching presets leaves your current preamp unchanged.`
    : 'Choose a listening profile.';
}

function renderBands() {
  bandsEl.innerHTML = '';
  BAND_FREQUENCIES.forEach((frequency, index) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'band';
    wrapper.innerHTML = `<span>${frequency >= 1000 ? `${frequency / 1000}k` : frequency}</span><input type="range" min="-12" max="12" step="0.5" data-band="${index}" value="${settings.eqGainsDb[index]}"><span class="db">${settings.eqGainsDb[index]} dB</span>`;
    wrapper.querySelector('input').addEventListener('input', (event) => {
      settings.eqGainsDb[index] = Number(event.target.value);
      settings.preset = 'Custom';
      presetEl.value = '';
      wrapper.querySelector('.db').textContent = `${settings.eqGainsDb[index]} dB`;
      updatePresetDescription();
      persistAndBroadcast();
    });
    bandsEl.appendChild(wrapper);
  });
}

function render() {
  enabledEl.checked = settings.enabled;
  preampEl.value = settings.preampDb;
  preampValueEl.textContent = `${settings.preampDb} dB`;
  presetEl.value = PRESETS[settings.preset] ? settings.preset : '';
  updatePresetDescription();
  renderBands();
}

function persistAndBroadcast() {
  chrome.storage.local.set({ settings }).catch((error) => setStatus(`Save failed: ${error.message}`, 'warn'));
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { type: 'YOUTUNE_SET_SETTINGS', settings }, () => {
      if (chrome.runtime.lastError) setStatus('Settings saved. Open a supported YouTube page to apply them.', 'warn');
    });
  });
}

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  settings.preset = name;
  // Presets change tone only. Keep the user's preamp so the effect does not become unexpectedly quieter.
  settings.eqGainsDb = [...preset.eq];
  render();
  persistAndBroadcast();
  setStatus(`${name} preset applied.`, 'good');
}

function reset() {
  settings = { ...DEFAULT_SETTINGS, eqGainsDb: [...DEFAULT_SETTINGS.eqGainsDb] };
  render();
  persistAndBroadcast();
  setStatus('Reset to Flat.', 'good');
}

async function load() {
  populatePresets();
  const stored = await chrome.storage.local.get('settings');
  const storedSettings = stored.settings;
  settings = {
    ...DEFAULT_SETTINGS,
    ...(storedSettings ?? {}),
    eqGainsDb: [...(storedSettings?.eqGainsDb ?? DEFAULT_SETTINGS.eqGainsDb)],
    version: 2,
  };
  if (storedSettings?.version === 1 && settings.preset !== 'Custom') {
    settings.preampDb = 0;
    await chrome.storage.local.set({ settings });
  }
  render();
  setStatus('Ready. Open a YouTube video to connect.', 'good');
}

enabledEl.addEventListener('change', () => {
  settings.enabled = enabledEl.checked;
  persistAndBroadcast();
  setStatus(settings.enabled ? 'Processing enabled.' : 'Bypassed. Audio should remain audible.', settings.enabled ? 'good' : 'warn');
});

preampEl.addEventListener('input', () => {
  settings.preampDb = Number(preampEl.value);
  preampValueEl.textContent = `${settings.preampDb} dB`;
  persistAndBroadcast();
});

presetEl.addEventListener('change', () => applyPreset(presetEl.value));
document.querySelector('#reset').addEventListener('click', reset);
document.querySelector('#bypass').addEventListener('click', () => {
  settings.enabled = false;
  render();
  persistAndBroadcast();
  setStatus('Bypassed. Audio should remain audible.', 'warn');
});
document.querySelector('#reconnect').addEventListener('click', () => {
  chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { type: 'YOUTUNE_RECONNECT' }, () => {
      if (chrome.runtime.lastError) setStatus('Reconnect message could not be delivered.', 'warn');
      else setStatus('Reconnect requested.', 'good');
    });
  });
});

load().catch((error) => setStatus(`Load failed: ${error.message}`, 'warn'));
