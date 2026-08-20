const SETTINGS_VERSION = 2;
const DEFAULT_SETTINGS = {
  version: SETTINGS_VERSION,
  enabled: true,
  preampDb: 0,
  eqGainsDb: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  preset: 'Flat',
  limiterEnabled: true,
  limiterCeilingDb: -1,
  processingMode: 'eq',
};

function migrateSettings(storedSettings) {
  if (!storedSettings) return { ...DEFAULT_SETTINGS, eqGainsDb: [...DEFAULT_SETTINGS.eqGainsDb] };
  const migrated = {
    ...DEFAULT_SETTINGS,
    ...storedSettings,
    eqGainsDb: [...(storedSettings.eqGainsDb ?? DEFAULT_SETTINGS.eqGainsDb)],
    version: SETTINGS_VERSION,
  };
  // Version 1 automatically lowered preamp when a preset was selected.
  // Preserve custom curves, but restore neutral preamp for named presets.
  if (storedSettings.version === 1 && storedSettings.preset !== 'Custom') {
    migrated.preampDb = 0;
  }
  return migrated;
}

async function ensureDefaults() {
  const stored = await chrome.storage.local.get('settings');
  const current = stored.settings;
  const normalized = migrateSettings(current);
  if (!current || JSON.stringify(current) !== JSON.stringify(normalized)) {
    await chrome.storage.local.set({ settings: normalized });
  }
  return normalized;
}

chrome.runtime.onInstalled.addListener(() => {
  ensureDefaults().catch((error) => console.error('[YouTune] defaults failed', error));
});

chrome.runtime.onStartup.addListener(() => {
  ensureDefaults().catch((error) => console.error('[YouTune] startup defaults failed', error));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'GET_SETTINGS') {
    ensureDefaults().then((settings) => {
      sendResponse({ settings });
    }).catch((error) => {
      sendResponse({ error: error.message });
    });
    return true;
  }
  if (message?.type === 'GET_TAB_STATUS') {
    sendResponse({
      tabId: sender.tab?.id ?? null,
      url: sender.tab?.url ?? null,
      supported: Boolean(sender.tab?.url && /^(https:\/\/)?(www\.)?music\.youtube\.com|^(https:\/\/)?(www\.)?youtube\.com/.test(sender.tab.url)),
    });
  }
  return false;
});

ensureDefaults().catch((error) => console.error('[YouTune] initial defaults failed', error));
