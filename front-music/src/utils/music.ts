/**
 * Transposes a note from one key to another
 */
export const transposeNote = (note: string, fromKey: string, toKey: string): string => {
  const keyOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const fromIndex = keyOrder.indexOf(fromKey);
  const toIndex = keyOrder.indexOf(toKey);
  const diff = toIndex - fromIndex;

  const noteIndex = keyOrder.indexOf(note);
  const newIndex = (noteIndex + diff + keyOrder.length) % keyOrder.length;
  return keyOrder[newIndex];
};

/**
 * Calculates beat duration in seconds based on BPM
 */
export const calculateBeatDuration = (bpm: number): number => {
  return 60 / bpm;
};

/**
 * Calculates total duration from notes array
 */
export const calculateTotalDuration = (
  notes: Array<{ duration: string | number }>,
  beatDuration: number
): number => {
  return notes.reduce((sum, n) => {
    if (typeof n.duration === 'number') {
      return sum + (n.duration / 1000); // Convert ms to seconds
    }
    return sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration);
  }, 0);
};

/**
 * Calculates time offset for a note at given index
 */
export const calculateNoteOffset = (
  notes: Array<{ duration: string | number }>,
  index: number,
  beatDuration: number
): number => {
  if (index === 0) return 0;

  return notes.slice(0, index).reduce((sum, n) => {
    if (typeof n.duration === 'number') {
      return sum + (n.duration / 1000); // Convert ms to seconds
    }
    return sum + (n.duration === '2n' ? beatDuration * 2 : beatDuration);
  }, 0);
};

/**
 * Transposes a note by semitones (e.g., "C4" + 2 semitones = "D4")
 */
export const getTransposedNote = (note: string, semitones: number): string => {
  const noteMap: { [key: string]: number } = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  };
  const reverseNoteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const noteName = note[0].toUpperCase();
  const octave = parseInt(note[1]);
  const baseSemitone = noteMap[noteName];

  const totalSemitone = baseSemitone + semitones;
  const newOctave = octave + Math.floor(totalSemitone / 12);
  const newSemitone = ((totalSemitone % 12) + 12) % 12;

  return `${reverseNoteMap[newSemitone]}${newOctave}`;
};
