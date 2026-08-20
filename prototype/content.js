(() => {
  const state = {
    settings: null,
    media: null,
    audioContext: null,
    source: null,
    gain: null,
    filters: [],
    analyser: null,
    limiter: null,
    connected: false,
    lastError: null,
    observer: null,
    routeTimer: null,
  };

  const BAND_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  function sendStatus(extra = {}) {
    window.postMessage({
      source: 'youtune-content',
      type: 'YOUTUNE_STATUS',
      status: {
        supported: true,
        connected: state.connected,
        enabled: Boolean(state.settings?.enabled),
        mediaFound: Boolean(state.media),
        error: state.lastError,
        url: location.href,
        ...extra,
      },
    }, location.origin);
  }

  function getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
        if (chrome.runtime.lastError) {
          state.lastError = chrome.runtime.lastError.message;
          resolve(null);
          return;
        }
        state.settings = response?.settings ?? null;
        resolve(state.settings);
      });
    });
  }

  function updateFilterCoefficients() {
    if (!state.audioContext || !state.filters.length || !state.settings) return;
    state.filters.forEach((filter, index) => {
      const frequency = BAND_FREQUENCIES[index];
      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1.1;
      filter.gain.value = Number(state.settings.eqGainsDb?.[index] ?? 0);
    });
    if (state.gain) state.gain.gain.value = 10 ** (Number(state.settings.preampDb ?? 0) / 20);
    if (state.limiter) {
      state.limiter.threshold.value = Number(state.settings.limiterCeilingDb ?? -1);
      state.limiter.knee.value = 0;
      state.limiter.ratio.value = 20;
      state.limiter.attack.value = 0.003;
      state.limiter.release.value = 0.15;
    }
  }

  async function attachToMedia(media) {
    if (state.media === media && state.connected) {
      updateFilterCoefficients();
      return;
    }
    disconnect();
    state.media = media;
    try {
      state.audioContext = new AudioContext();
      state.source = state.audioContext.createMediaElementSource(media);
      state.gain = state.audioContext.createGain();
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 2048;
      state.filters = BAND_FREQUENCIES.map(() => state.audioContext.createBiquadFilter());
      state.limiter = state.audioContext.createDynamicsCompressor();

      let node = state.source;
      for (const filter of state.filters) {
        node.connect(filter);
        node = filter;
      }
      node.connect(state.gain);
      state.gain.connect(state.limiter);
      state.limiter.connect(state.analyser);
      state.analyser.connect(state.audioContext.destination);
      state.connected = true;
      state.lastError = null;
      updateFilterCoefficients();
      if (state.settings?.enabled === false) setBypass(true);
      if (state.audioContext.state === 'suspended') {
        const resume = () => {
          state.audioContext?.resume().catch(() => {});
          media.removeEventListener('play', resume);
        };
        media.addEventListener('play', resume, { once: true });
      }
      sendStatus();
    } catch (error) {
      state.lastError = error?.message ?? String(error);
      state.connected = false;
      sendStatus();
    }
  }

  function setBypass(bypass) {
    if (!state.filters.length || !state.gain) return;
    const enabled = !bypass && state.settings?.enabled !== false;
    state.filters.forEach((filter) => {
      filter.gain.value = enabled ? Number(filter.gain.value) : 0;
    });
    state.gain.gain.value = enabled ? 10 ** (Number(state.settings?.preampDb ?? 0) / 20) : 1;
  }

  function disconnect() {
    for (const node of [state.source, ...state.filters, state.gain, state.limiter, state.analyser]) {
      try { node?.disconnect(); } catch (_) { /* already disconnected */ }
    }
    try { state.audioContext?.close(); } catch (_) { /* best effort */ }
    state.source = null;
    state.filters = [];
    state.gain = null;
    state.limiter = null;
    state.analyser = null;
    state.audioContext = null;
    state.connected = false;
  }

  function findMedia() {
    const media = document.querySelector('video, audio');
    if (media) attachToMedia(media);
    else {
      state.media = null;
      state.connected = false;
      sendStatus({ mediaFound: false });
    }
  }

  function startLifecycleWatch() {
    state.observer = new MutationObserver(() => {
      clearTimeout(state.routeTimer);
      state.routeTimer = setTimeout(findMedia, 150);
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('yt-navigate-finish', findMedia);
    window.addEventListener('popstate', findMedia);
    window.addEventListener('hashchange', findMedia);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'YOUTUNE_SET_SETTINGS') {
      state.settings = message.settings;
      updateFilterCoefficients();
      setBypass(state.settings.enabled === false);
      sendStatus();
    }
    if (message?.type === 'YOUTUNE_RECONNECT') findMedia();
    if (message?.type === 'YOUTUNE_GET_STATUS') sendStatus();
  });

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    if (event.data?.source !== 'youtune-popup') return;
    if (event.data.type === 'YOUTUNE_SET_SETTINGS') {
      state.settings = event.data.settings;
      updateFilterCoefficients();
      setBypass(state.settings.enabled === false);
      sendStatus();
    }
    if (event.data.type === 'YOUTUNE_RECONNECT') findMedia();
    if (event.data.type === 'YOUTUNE_GET_STATUS') sendStatus();
  });

  getSettings().then(() => {
    startLifecycleWatch();
    findMedia();
  });
})();
