/**
 * Musical note data for different instruments
 */

export interface Note {
  note?: string;
  drum?: string;
  duration: string | number;
}

// Twinkle Twinkle Little Star - Piano
export const PIANO_NOTES: Note[] = [
  { note: 'C', duration: '4n' }, { note: 'C', duration: '4n' },
  { note: 'G', duration: '4n' }, { note: 'G', duration: '4n' },
  { note: 'A', duration: '4n' }, { note: 'A', duration: '4n' },
  { note: 'G', duration: '2n' },
  { note: 'F', duration: '4n' }, { note: 'F', duration: '4n' },
  { note: 'E', duration: '4n' }, { note: 'E', duration: '4n' },
  { note: 'D', duration: '4n' }, { note: 'D', duration: '4n' },
  { note: 'C', duration: '2n' },
];

// Bass notes (lower octave)
export const BASS_NOTES: Note[] = [
  { note: 'C', duration: '4n' }, { note: 'C', duration: '4n' },
  { note: 'G', duration: '4n' }, { note: 'G', duration: '4n' },
  { note: 'A', duration: '4n' }, { note: 'A', duration: '4n' },
  { note: 'G', duration: '2n' },
  { note: 'F', duration: '4n' }, { note: 'F', duration: '4n' },
  { note: 'E', duration: '4n' }, { note: 'E', duration: '4n' },
  { note: 'D', duration: '4n' }, { note: 'D', duration: '4n' },
  { note: 'C', duration: '2n' },
];

// Guitar notes
export const GUITAR_NOTES: Note[] = [
  { note: 'C', duration: '4n' }, { note: 'C', duration: '4n' },
  { note: 'G', duration: '4n' }, { note: 'G', duration: '4n' },
  { note: 'A', duration: '4n' }, { note: 'A', duration: '4n' },
  { note: 'G', duration: '2n' },
  { note: 'F', duration: '4n' }, { note: 'F', duration: '4n' },
  { note: 'E', duration: '4n' }, { note: 'E', duration: '4n' },
  { note: 'D', duration: '4n' }, { note: 'D', duration: '4n' },
  { note: 'C', duration: '2n' },
];

// Drum pattern
export const DRUM_NOTES: Note[] = [
  { drum: 'kick', duration: 500 }, { drum: 'snare', duration: 500 },
  { drum: 'hihat', duration: 500 }, { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 }, { drum: 'hihat', duration: 500 },
  { drum: 'snare', duration: 500 }, { drum: 'hihat', duration: 500 },
  { drum: 'kick', duration: 500 }, { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 }, { drum: 'snare', duration: 500 },
  { drum: 'kick', duration: 500 }, { drum: 'hihat', duration: 500 },
  { drum: 'snare', duration: 1000 },
];

// Twinkle notes for Home.tsx (with octave and duration in ms)
export const TWINKLE_NOTES_HOME: Note[] = [
  { note: 'C4', duration: 500 }, { note: 'C4', duration: 500 },
  { note: 'G4', duration: 500 }, { note: 'G4', duration: 500 },
  { note: 'A4', duration: 500 }, { note: 'A4', duration: 500 },
  { note: 'G4', duration: 1000 },
  { note: 'F4', duration: 500 }, { note: 'F4', duration: 500 },
  { note: 'E4', duration: 500 }, { note: 'E4', duration: 500 },
  { note: 'D4', duration: 500 }, { note: 'D4', duration: 500 },
  { note: 'C4', duration: 1000 },
];
