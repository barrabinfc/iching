/*
 * King Wen Lookup Table.
 *
 * Given two trigrams, get the iching number X
 * THen read the interpretation numbered X.
 */
import find from 'lodash/find';
import isNumber from 'lodash/isNumber';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';

function getIching() {
  return window.store.getState().iching
}

// yang => 0 => ---
// yin  => 1 => - -

// TRIGRAMS: Always bottom to UP
export const Trigrams = [
  // chien , tui , li, chen, sun, kan, ken, kun
  {
    trigrams: [0, 0, 0],
    image: '☁️',
    image_name: 'cloud',
    name: 'chien',
    structure: 'Sense',
    motivation: 'Creative',
    body: 'head',
    animal: '🐴',
    animal_name: 'horse',
    wilhelm: 'Heaven'
  },
  {
    trigrams: [0, 0, 1],
    image: '💦',
    image_name: 'sweat_drops',
    structure: 'Feel',
    motivation: 'Serene',
    name: 'tui',
    body: 'mouth',
    animal: '🐐',
    animal_name: 'goat',
    wilhelm: 'Lake'
  },
  {
    trigrams: [0, 1, 0],
    image: '🔥',
    image_name: 'fire',
    structure: 'Think',
    motivation: 'Attaching',
    name: 'li',
    body: 'eye',
    animal: '🐦',
    animal_name: 'bird',
    wilhelm: 'Flame'
  },
  {
    trigrams: [0, 1, 1],
    image: '⚡',
    image_name: 'thunder',
    name: 'chen',
    structure: 'Spirit',
    motivation: 'Exciting',
    body: 'foot',
    animal: '🐉',
    animal_name: 'dragon',
    wilhelm: 'Thunder'
  },
  {
    trigrams: [1, 0, 0],
    image: '🍃',
    image_name: 'leaves',
    structure: 'Sense',
    motivation: 'Soft&Penetrating',
    name: 'sun',
    body: 'thigh',
    animal: '🐓',
    animal_name: 'rooster',
    wilhelm: 'Wind'
  },
  {
    trigrams: [1, 0, 1],
    image: '🌊️',
    image_name: 'ocean',
    structure: 'Soul',
    motivation: 'Danger&Abyss',
    name: 'kan',
    body: 'ear',
    animal: '🐖',
    animal_name: 'pig2',
    wilhelm: 'Water'
  },
  {
    trigrams: [1, 1, 0],
    image: '🗻',
    image_name: 'mount_fuji',
    name: 'ken',
    structure: 'Body',
    motivation: 'Keeping still',
    body: 'hand',
    animal: '🐕',
    animal_name: 'dog2',
    wilhelm: 'Mountain'
  },
  {
    trigrams: [1, 1, 1],
    image: '🌍',
    image_name: ':earth_africa',
    structure: 'Will',
    motivation: 'Recepetive',
    name: 'kun',
    body: 'belly',
    animal: '🐄',
    animal_name: ':cow2',
    wilhelm: 'Earth'
  },
];

//  This order is called king wen sequence
//
// These numbers corresponds to the interpretation X.
// Check iching.json, there you can find the interpreatation for every number
//
// Vertical rows are lower trigrams
// Horizontal lines are upper trigrams
export const Lookup = {
  // chien,tui,li,chen,sun,san,kan,ken,kun
  chien: [1, 43, 14, 34, 9, 5, 26, 11],
  tui: [10, 58, 38, 54, 61, 60, 41, 19],
  li: [13, 49, 30, 55, 37, 63, 22, 36],
  chen: [25, 17, 21, 51, 42, 3, 27, 24],
  sun: [44, 28, 50, 32, 57, 48, 18, 46],
  kan: [6, 47, 64, 40, 59, 29, 4, 7],
  ken: [33, 31, 56, 62, 53, 39, 52, 15],
  kun: [12, 45, 35, 16, 20, 8, 23, 2],
};


// Get a trigram full representation from a array of 3 kuas
export function getTrigram(trigram_bitfield) {
  return find(Trigrams, tri => isEqual(tri.trigrams, trigram_bitfield));
}

// Get a trigram full representation from its name
export function getTrigramByName(trigram_name) {
  return find(Trigrams, tri => (tri.name === trigram_name));
}

export function getHexagramNumberByKuas(kuas) {
  let below = kuas.slice(0, 3);
  let above = kuas.slice(3);

  let belowTrigram = getTrigram(below);
  let aboveTrigram = getTrigram(above);

  // Get the index of above trigram
  let aboveIndex = Object.keys(Lookup).indexOf(aboveTrigram.name);

  // Now get the desired hex number
  let hexNumber = Lookup[belowTrigram.name][aboveIndex];

  return hexNumber;
}

/*
 * Get a full hexagram.
 *
 * hex = array of kuas
 * or the hexagram number
 * or hexagram name
 */
export function getHexagram(hex) {

  let hexNumber = 1;

  if (isArray(hex)) {
    let kuas = hex.map(k => k.yin)
    hexNumber = getHexagramNumberByKuas(kuas)
  } else if (isNumber(hex)) {
    hexNumber = hex;
  } else if (isString(hex)) {
    hexNumber = find(getIching(), { name: hex }).number;
  } else {
    console.error('getHexagram', `Argument ${hex} is not of valid type
            (Number,Name or Array of Kuas)`);
    return undefined;
  }

  // And finally the interpretation
  let hexInterpretation = Object.assign({}, find(getIching(), { number: hexNumber }));

  return hexInterpretation;
}

