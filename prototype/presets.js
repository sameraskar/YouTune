const BAND_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

const PRESETS = {
  Flat: {
    eq: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    preampDb: 0,
    description: 'No tonal change. Use this as the bypass reference.',
  },
  'Bass Boost': {
    eq: [5, 4, 3, 1, 0, 0, 0, 0, 0, 0],
    preampDb: -2,
    description: 'Adds low-end weight without pushing the treble forward.',
  },
  'Bass Light': {
    eq: [3, 2, 1, 0, -1, 0, 0, 1, 1, 0],
    preampDb: -1,
    description: 'A restrained low-end lift for everyday listening.',
  },
  'Treble Boost': {
    eq: [-1, -1, 0, 0, 0, 1, 2, 3, 4, 4],
    preampDb: -2,
    description: 'Adds presence and detail on darker headphones or speakers.',
  },
  Vocal: {
    eq: [-2, -1, 0, 2, 4, 5, 3, 1, 0, -1],
    preampDb: -2,
    description: 'Brings speech and lead vocals forward without extreme bass.',
  },
  Speech: {
    eq: [-4, -3, -1, 2, 4, 5, 4, 2, 0, -2],
    preampDb: -2,
    description: 'Prioritizes intelligibility for interviews, lectures, and news.',
  },
  Rock: {
    eq: [4, 3, 2, 0, -1, 1, 3, 4, 3, 2],
    preampDb: -3,
    description: 'Punchy lows, clear guitars, and energetic upper presence.',
  },
  Pop: {
    eq: [2, 1, 0, 1, 3, 2, 0, 2, 3, 2],
    preampDb: -2,
    description: 'A balanced modern curve for polished pop production.',
  },
  Classical: {
    eq: [-1, 0, 1, 2, 1, 0, 1, 2, 2, 1],
    preampDb: -1,
    description: 'Preserves midrange detail with a gentle sense of openness.',
  },
  Jazz: {
    eq: [1, 1, 0, 1, 2, 2, 1, 2, 1, 0],
    preampDb: -1,
    description: 'Warm low mids with a little air for horns and cymbals.',
  },
  Electronic: {
    eq: [4, 3, 1, 0, 1, 1, 2, 3, 3, 2],
    preampDb: -3,
    description: 'Tight low end and brighter detail for electronic production.',
  },
  'Hip-Hop': {
    eq: [5, 4, 2, 0, 1, 2, 0, 1, 2, 1],
    preampDb: -3,
    description: 'Low-end impact with a clear vocal and hi-hat range.',
  },
  Metal: {
    eq: [3, 2, 1, -1, -1, 2, 3, 4, 2, 1],
    preampDb: -3,
    description: 'Controls low-mid buildup while keeping guitars and attack clear.',
  },
  Acoustic: {
    eq: [1, 1, 0, 2, 3, 2, 1, 2, 2, 1],
    preampDb: -1,
    description: 'Adds body and presence to acoustic instruments and vocals.',
  },
  'Late Night': {
    eq: [1, 1, 0, 0, 1, 1, 0, -1, -1, -2],
    preampDb: -1,
    description: 'A softer, less fatiguing curve for lower-volume listening.',
  },
  'Laptop Speakers': {
    eq: [-2, -1, 1, 3, 3, 2, 0, 1, 1, 0],
    preampDb: -2,
    description: 'Shifts focus toward the frequencies small speakers reproduce well.',
  },
};

const PRESET_NAMES = [...Object.keys(PRESETS), 'Custom'];
